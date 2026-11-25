// UAÇAÍ · servidor único: arquivos de public/, API do cliente e da loja, e SSE.
// Sem dependências de runtime: http, crypto, fs e node:sqlite são do próprio Node.
"use strict";
const http = require("node:http"), fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const { CATALOGO } = require("./public/catalogo.js");

const PORT = +process.env.PORT || 8080, NMESAS = 11;
const PUBLIC = path.join(__dirname, "public");
const DB_PATH = process.env.UACAI_DB || path.join(__dirname, "data", "uacai.db");   // o teste usa um banco à parte
const SESSAO_MS = 12 * 60 * 60 * 1000;            // a sessão da loja dura um turno
const MAX_OBS = 200, MAX_Q = 20, MAX_ITENS = 40;

/* ===== banco ===== */
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS usuarios(email TEXT PRIMARY KEY, hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessoes(id TEXT PRIMARY KEY, email TEXT NOT NULL, exp INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS pedidos(id INTEGER PRIMARY KEY AUTOINCREMENT, mesa INTEGER NOT NULL,
  token TEXT NOT NULL, criado INTEGER NOT NULL, status TEXT NOT NULL, obs TEXT NOT NULL DEFAULT '',
  aberto INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS itens(pedido INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  chave TEXT NOT NULL, q INTEGER NOT NULL, p INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS chamados(mesa INTEGER PRIMARY KEY, criado INTEGER NOT NULL);
-- trava de mesa: o primeiro pedido amarra o token do aparelho a uma mesa; sai quando a conta fecha
CREATE TABLE IF NOT EXISTS mesa_token(token TEXT PRIMARY KEY, mesa INTEGER NOT NULL, criado INTEGER NOT NULL);
-- histórico de contas fechadas: base do faturamento do dia (sem nada que identifique a pessoa)
CREATE TABLE IF NOT EXISTS contas_fechadas(id INTEGER PRIMARY KEY AUTOINCREMENT, mesa INTEGER NOT NULL,
  abertura INTEGER NOT NULL, fechamento INTEGER NOT NULL, itens TEXT NOT NULL, total INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS i_contas_dia ON contas_fechadas(fechamento);
CREATE INDEX IF NOT EXISTS i_pedidos_mesa ON pedidos(mesa, aberto);
CREATE INDEX IF NOT EXISTS i_pedidos_token ON pedidos(token);
CREATE INDEX IF NOT EXISTS i_itens_pedido ON itens(pedido);`);
const q = (sql, ...a) => db.prepare(sql).all(...a);
const run = (sql, ...a) => db.prepare(sql).run(...a);

/* ===== senha e sessão ===== */
const SCRYPT = { N: 16384, r: 8, p: 1 };
const hashSenha = (senha, salt) => crypto.scryptSync(senha, salt, 64, SCRYPT).toString("hex");
const criarHash = senha => { const salt = crypto.randomBytes(16).toString("hex"); return salt + ":" + hashSenha(senha, salt); };
function confere(senha, guardado) {
  const [salt, h] = String(guardado).split(":");
  if (!salt || !h) return false;
  const a = Buffer.from(h, "hex"), b = Buffer.from(hashSenha(senha, salt), "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
// hash descartável: o login compara com ele quando o e-mail não existe, para o tempo de resposta não entregar isso
const HASH_FALSO = criarHash(crypto.randomBytes(16).toString("hex"));

const limpaSessoes = () => run("DELETE FROM sessoes WHERE exp<?", Date.now());
const sidDe = req => (/(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie || "") || [])[1];
function sessaoDe(req) {
  limpaSessoes();
  const id = sidDe(req);
  if (!id) return null;
  return q("SELECT email FROM sessoes WHERE id=? AND exp>?", id, Date.now())[0] || null;
}

/* ===== limites: login por IP e por e-mail, pedidos por mesa ===== */
const tentativas = new Map(), porMesa = new Map();
function excedeu(mapa, chave, max, janela) {
  const agora = Date.now(), lista = (mapa.get(chave) || []).filter(t => agora - t < janela);
  lista.push(agora);
  if (mapa.size > 5000) mapa.clear();        // teto de memória: zera tudo em vez de crescer sem fim
  mapa.set(chave, lista);
  return lista.length > max;
}
const ipDe = req => req.socket.remoteAddress || "?";

/* ===== leituras ===== */
const itensDe = id => q("SELECT chave,q,p FROM itens WHERE pedido=?", id);
const comItens = linhas => linhas.map(o => {
  const itens = itensDe(o.id);
  return { ...o, itens, total: itens.reduce((a, x) => a + x.q * x.p, 0) };
});
const painel = () => ({
  pedidos: comItens(q("SELECT id,mesa,criado,status,obs FROM pedidos WHERE aberto=1 ORDER BY criado")),
  chamados: q("SELECT mesa FROM chamados ORDER BY criado").map(r => r.mesa),
  mesas: NMESAS,
  faturamento: faturamento(hoje()),        // vai no mesmo evento do SSE: o número sobe ao vivo
});
// o dia da loja vai de 00:00 a 23:59 no horário deste computador, e por isso zera sozinho
const dois = n => String(n).padStart(2, "0");
const hoje = () => { const d = new Date(); return d.getFullYear() + "-" + dois(d.getMonth() + 1) + "-" + dois(d.getDate()); };
// AAAA-MM-DD -> [começo, fim) em ms, ou null se a data não existir (2026-02-31, 2026-13-01)
function faixaDoDia(dia) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dia))) return null;
  const [a, m, d] = dia.split("-").map(Number);
  const i = new Date(a, m - 1, d);
  if (i.getFullYear() !== a || i.getMonth() !== m - 1 || i.getDate() !== d) return null;
  return [i.getTime(), new Date(a, m - 1, d + 1).getTime()];
}
function faturamento(dia) {
  const f = faixaDoDia(dia);
  if (!f) return null;
  const r = q("SELECT COUNT(*) n, COALESCE(SUM(total),0) t FROM contas_fechadas WHERE fechamento>=? AND fechamento<?", f[0], f[1])[0];
  return { dia, contas: r.n, total: r.t, ticket: r.n ? Math.round(r.t / r.n) : 0 };
}
const travaDe = token => { const r = q("SELECT mesa FROM mesa_token WHERE token=?", token)[0]; return r ? r.mesa : null; };
// só as últimas 6 h: o celular que volta noutro dia não vê a conta antiga
const meusPedidos = token => ({
  pedidos: comItens(q("SELECT id,mesa,criado,status,obs FROM pedidos WHERE token=? AND criado>? ORDER BY criado",
    token, Date.now() - 6 * 60 * 60 * 1000)),
  chamados: q("SELECT mesa FROM chamados").map(r => r.mesa),
  travada: travaDe(token),                 // o celular descobre a trava pelo servidor, não por si
});

/* ===== SSE ===== */
const clientes = new Set();                  // { res, loja, token }
function manda(c, evento, dados) {
  try { c.res.write("event: " + evento + "\ndata: " + JSON.stringify(dados) + "\n\n"); }
  catch (e) { clientes.delete(c); }
}
function avisa() {
  let p = null;
  for (const c of clientes) {
    if (c.loja) { p = p || painel(); manda(c, "painel", p); }
    else if (c.token) manda(c, "meus", meusPedidos(c.token));
  }
}
// comentário a cada 25 s: mantém a conexão viva em proxies (ngrok) e mostra queda cedo
setInterval(() => { for (const c of clientes) { try { c.res.write(": ping\n\n"); } catch (e) { clientes.delete(c); } } }, 25000).unref();

/* ===== HTTP ===== */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; " +
  "font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; " +
  "base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const CABECALHOS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": CSP,
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
};
const json = (res, code, dados) => {
  res.writeHead(code, { ...CABECALHOS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(dados));
};

function corpo(req) {
  return new Promise((ok, ruim) => {
    let n = 0, d = "";
    req.on("data", c => { n += c.length; if (n > 16384) { ruim(new Error("grande")); req.destroy(); } d += c; });
    req.on("end", () => { try { ok(d ? JSON.parse(d) : {}); } catch (e) { ruim(e); } });
    req.on("error", ruim);
  });
}

// Secure só quando a conexão chegou por HTTPS (atrás do ngrok isso vem em x-forwarded-proto)
const ehHttps = req => (req.headers["x-forwarded-proto"] || "").split(",")[0].trim() === "https";
const cookie = (req, v, maxAge) => "sid=" + v + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=" + maxAge + (ehHttps(req) ? "; Secure" : "");

function estatico(req, res, rota) {
  let pedido;
  try { pedido = decodeURIComponent(rota === "/" ? "/index.html" : rota); }
  catch (e) { return json(res, 400, { erro: "caminho inválido" }); }
  if (pedido.includes(" ")) return json(res, 400, { erro: "caminho inválido" });
  // normaliza depois de decodificar e confere que o resultado continua dentro de public/:
  // nem %2e%2e%2f nem barra invertida saem da pasta
  const arq = path.join(PUBLIC, path.normalize(pedido));
  if (!arq.startsWith(PUBLIC + path.sep)) return json(res, 403, { erro: "proibido" });
  fs.readFile(arq, (e, dados) => {
    if (e) return json(res, 404, { erro: "não encontrado" });
    const ext = path.extname(arq);
    res.writeHead(200, {
      ...CABECALHOS, "Content-Type": MIME[ext] || "application/octet-stream",
      // página, estilo e script sempre revalidados: reiniciar o servidor com código novo
      // não pode deixar um celular preso na versão antiga. Só as fotos ficam em cache longo.
      "Cache-Control": [".png", ".jpg", ".svg", ".ico"].includes(ext) ? "public, max-age=86400" : "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : dados);
  });
}

const mesaOk = n => Number.isInteger(n) && n >= 1 && n <= NMESAS;
const tokenOk = t => /^[a-f0-9]{32}$/.test(String(t || ""));
const STATUS = ["novo", "preparo", "pronto", "entregue"];

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x"), rota = url.pathname;
  if (!rota.startsWith("/api/")) {
    if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { erro: "método não permitido" });
    return estatico(req, res, rota);
  }
  try {
    /* ---------- SSE: a loja recebe tudo, o cliente só os próprios pedidos ---------- */
    if (rota === "/api/eventos" && req.method === "GET") {
      // quem manda token quer o fluxo do cliente, mesmo que o navegador ainda carregue
      // o cookie da loja (acontece quando a mesma máquina abre o cardápio e o painel)
      const token = tokenOk(url.searchParams.get("token")) ? url.searchParams.get("token") : null;
      const loja = !token && !!sessaoDe(req);
      res.writeHead(200, {
        ...CABECALHOS, "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store", Connection: "keep-alive", "X-Accel-Buffering": "no",
      });
      const c = { res, loja, token };
      clientes.add(c);
      res.write("retry: 3000\n\n");
      if (loja) manda(c, "painel", painel()); else if (token) manda(c, "meus", meusPedidos(token));
      req.on("close", () => clientes.delete(c));
      return;
    }
    /* ---------- cliente ---------- */
    if (rota === "/api/pedidos" && req.method === "POST") {
      const b = await corpo(req);
      const mesa = Number(b.mesa);
      if (!mesaOk(mesa)) return json(res, 400, { erro: "mesa inválida" });
      if (!tokenOk(b.token)) return json(res, 400, { erro: "token inválido" });
      if (!Array.isArray(b.itens) || !b.itens.length || b.itens.length > MAX_ITENS)
        return json(res, 400, { erro: "pedido vazio" });
      const obs = String(b.obs || "").slice(0, MAX_OBS).trim();
      const itens = [];
      for (const it of b.itens) {
        const chave = String(it && it.chave || ""), n = Number(it && it.q);
        if (!Object.hasOwn(CATALOGO, chave)) return json(res, 400, { erro: "item desconhecido" });
        if (!Number.isInteger(n) || n < 1 || n > MAX_Q) return json(res, 400, { erro: "quantidade inválida" });
        itens.push({ chave, q: n, p: CATALOGO[chave] });      // preço sempre do catálogo do servidor
      }
      // Trava de mesa: quem decide é o servidor. O ?mesa= e o sessionStorage do celular não mandam nada aqui.
      // O INSERT OR IGNORE resolve a amarração num passo só: o primeiro pedido do aparelho ganha a mesa,
      // os seguintes apenas leem quem ganhou. Dois pedidos ao mesmo tempo não dão erro nem brecha.
      run("INSERT OR IGNORE INTO mesa_token(token,mesa,criado) VALUES(?,?,?)", b.token, mesa, Date.now());
      const trava = travaDe(b.token);
      if (trava !== mesa) return json(res, 409, { erro: "este aparelho já está na mesa " + trava, mesa: trava });
      if (excedeu(porMesa, "p" + mesa, 6, 60000)) return json(res, 429, { erro: "muitos pedidos seguidos" });
      const id = Number(run("INSERT INTO pedidos(mesa,token,criado,status,obs) VALUES(?,?,?,'novo',?)",
        mesa, b.token, Date.now(), obs).lastInsertRowid);
      const ins = db.prepare("INSERT INTO itens(pedido,chave,q,p) VALUES(?,?,?,?)");
      for (const it of itens) ins.run(id, it.chave, it.q, it.p);
      avisa();
      return json(res, 201, { id });
    }
    if (rota === "/api/meus-pedidos" && req.method === "GET") {
      const token = url.searchParams.get("token") || "";
      if (!tokenOk(token)) return json(res, 400, { erro: "token inválido" });
      return json(res, 200, meusPedidos(token));
    }
    if (rota === "/api/chamados" && req.method === "POST") {
      const b = await corpo(req), mesa = Number(b.mesa);
      if (!mesaOk(mesa)) return json(res, 400, { erro: "mesa inválida" });
      if (excedeu(porMesa, "c" + mesa, 3, 60000)) return json(res, 429, { erro: "a recepção já foi avisada" });
      run("INSERT OR IGNORE INTO chamados(mesa,criado) VALUES(?,?)", mesa, Date.now());
      avisa();
      return json(res, 201, { ok: true });
    }
    /* ---------- login ---------- */
    if (rota === "/api/login" && req.method === "POST") {
      const b = await corpo(req);
      const email = String(b.email || "").trim().toLowerCase().slice(0, 120), senha = String(b.senha || "").slice(0, 200);
      if (excedeu(tentativas, "ip:" + ipDe(req), 10, 600000) || excedeu(tentativas, "em:" + email, 5, 600000))
        return json(res, 429, { erro: "credenciais inválidas" });   // mesma mensagem do erro de senha
      const u = q("SELECT hash FROM usuarios WHERE email=?", email)[0];
      const ok = confere(senha, u ? u.hash : HASH_FALSO);
      if (!u || !ok) return json(res, 401, { erro: "credenciais inválidas" });
      const sid = crypto.randomBytes(32).toString("hex");
      run("INSERT INTO sessoes(id,email,exp) VALUES(?,?,?)", sid, email, Date.now() + SESSAO_MS);
      res.writeHead(200, {
        ...CABECALHOS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
        "Set-Cookie": cookie(req, sid, SESSAO_MS / 1000),
      });
      return res.end(JSON.stringify({ email }));
    }
    if (rota === "/api/logout" && req.method === "POST") {
      const id = sidDe(req);
      if (id) run("DELETE FROM sessoes WHERE id=?", id);
      res.writeHead(200, {
        ...CABECALHOS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
        "Set-Cookie": cookie(req, "", 0),
      });
      return res.end(JSON.stringify({ ok: true }));
    }
    /* ---------- loja: tudo daqui para baixo exige sessão ---------- */
    const sessao = sessaoDe(req);
    if (!sessao) return json(res, 401, { erro: "entre na área da loja" });
    if (rota === "/api/painel" && req.method === "GET") return json(res, 200, { ...painel(), email: sessao.email });
    if (rota === "/api/faturamento" && req.method === "GET") {
      const f = faturamento(url.searchParams.get("dia") || hoje());
      return f ? json(res, 200, f) : json(res, 400, { erro: "dia inválido" });
    }
    let m;
    if ((m = /^\/api\/pedidos\/(\d+)$/.exec(rota)) && req.method === "PATCH") {
      const b = await corpo(req), st = String(b.status || "");
      if (!STATUS.includes(st)) return json(res, 400, { erro: "status inválido" });
      // 'entregue' sai do painel mas continua na conta da mesa até o Fechar conta
      const r = run("UPDATE pedidos SET status=? WHERE id=? AND aberto=1", st, +m[1]);
      if (!r.changes) return json(res, 404, { erro: "pedido não encontrado" });
      avisa();
      return json(res, 200, { ok: true });
    }
    if ((m = /^\/api\/chamados\/(\d+)$/.exec(rota)) && req.method === "DELETE") {
      run("DELETE FROM chamados WHERE mesa=?", +m[1]);
      avisa();
      return json(res, 200, { ok: true });
    }
    if ((m = /^\/api\/mesas\/(\d+)\/fechar$/.exec(rota)) && req.method === "POST") {
      const n = +m[1];
      if (!mesaOk(n)) return json(res, 400, { erro: "mesa inválida" });
      // registra a conta ANTES de liberar a mesa: é o que o faturamento do dia soma.
      // Os totais saem daqui, nunca do navegador; `itens` guarda só horário, chave, quantidade e preço.
      const abertos = comItens(q("SELECT id,criado FROM pedidos WHERE mesa=? AND aberto=1 ORDER BY criado", n));
      if (abertos.length) {
        const itens = abertos.flatMap(o => o.itens.map(it => ({ h: o.criado, chave: it.chave, q: it.q, p: it.p })));
        run("INSERT INTO contas_fechadas(mesa,abertura,fechamento,itens,total) VALUES(?,?,?,?,?)",
          n, abertos[0].criado, Date.now(), JSON.stringify(itens), itens.reduce((a, x) => a + x.q * x.p, 0));
      }
      run("UPDATE pedidos SET aberto=0, status='entregue' WHERE mesa=? AND aberto=1", n);
      run("DELETE FROM chamados WHERE mesa=?", n);
      run("DELETE FROM mesa_token WHERE mesa=?", n);          // a trava da mesa sai com a conta
      avisa();
      return json(res, 200, { ok: true });
    }
    return json(res, 404, { erro: "rota não encontrada" });
  } catch (e) {
    return json(res, 400, { erro: "pedido malformado" });
  }
});

module.exports = { criarHash, db, servidor };                      // scripts/criar-usuario.js usa criarHash e db
if (require.main === module) servidor.listen(PORT, () => console.log("UAÇAÍ em http://localhost:" + PORT));
