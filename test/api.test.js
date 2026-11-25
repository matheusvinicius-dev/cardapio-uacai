// Teste da API: preço vem do servidor, validação, autorização e sessão.
// Roda num banco próprio e numa porta sorteada: npm test
"use strict";
const { test, after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");

const DB = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "uacai-")), "t.db");
process.env.UACAI_DB = DB;
const { servidor, criarHash, db } = require("../server.js");

db.prepare("INSERT INTO usuarios(email,hash) VALUES(?,?)").run("loja@teste.com", criarHash("senha-de-teste"));
servidor.listen(0);
after(() => { servidor.close(); db.close(); });
const base = () => "http://127.0.0.1:" + servidor.address().port;

const TOKEN = "a".repeat(32), OUTRO = "b".repeat(32);
let cookie = "";
const chamar = (rota, op = {}) => fetch(base() + rota, {
  ...op, headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}), ...op.headers },
});
const pedir = corpo => chamar("/api/pedidos", { method: "POST", body: JSON.stringify(corpo) });

test("o servidor ignora o preço mandado pelo celular e usa o do catálogo", async () => {
  const r = await pedir({ mesa: 3, token: TOKEN, itens: [{ chave: "Q", q: 1, p: 1 }] });
  assert.equal(r.status, 201);
  const meus = await (await chamar("/api/meus-pedidos?token=" + TOKEN)).json();
  assert.equal(meus.pedidos[0].itens[0].p, 55000);
  assert.equal(meus.pedidos[0].total, 55000);
});

test("recusa mesa fora de 1–11, item fora do catálogo, quantidade fora de 1–20 e pedido vazio", async () => {
  for (const corpo of [
    { mesa: 12, token: TOKEN, itens: [{ chave: "A", q: 1 }] },
    { mesa: 0, token: TOKEN, itens: [{ chave: "A", q: 1 }] },
    { mesa: 1, token: TOKEN, itens: [{ chave: "constructor", q: 1 }] },
    { mesa: 1, token: TOKEN, itens: [{ chave: "NAO_EXISTE", q: 1 }] },
    { mesa: 1, token: TOKEN, itens: [{ chave: "A", q: 0 }] },
    { mesa: 1, token: TOKEN, itens: [{ chave: "A", q: 21 }] },
    { mesa: 1, token: TOKEN, itens: [] },
    { mesa: 1, token: "curto", itens: [{ chave: "A", q: 1 }] },
  ]) assert.equal((await pedir(corpo)).status, 400, JSON.stringify(corpo));
});

test("a observação para em 200 caracteres", async () => {
  await pedir({ mesa: 2, token: OUTRO, obs: "x".repeat(500), itens: [{ chave: "A", q: 1 }] });
  const meus = await (await chamar("/api/meus-pedidos?token=" + OUTRO)).json();
  assert.equal(meus.pedidos[0].obs.length, 200);
});

test("cada celular só enxerga os próprios pedidos", async () => {
  const meus = await (await chamar("/api/meus-pedidos?token=" + TOKEN)).json();
  assert.ok(meus.pedidos.every(o => o.mesa !== 2));
});

test("as rotas da loja dão 401 sem sessão", async () => {
  for (const [rota, method] of [["/api/painel", "GET"], ["/api/pedidos/1", "PATCH"],
    ["/api/chamados/1", "DELETE"], ["/api/mesas/1/fechar", "POST"]])
    assert.equal((await chamar(rota, { method, body: method === "PATCH" ? '{"status":"pronto"}' : undefined })).status, 401, rota);
});

test("login erra com senha errada e com e-mail que não existe, com a mesma mensagem", async () => {
  const a = await chamar("/api/login", { method: "POST", body: JSON.stringify({ email: "loja@teste.com", senha: "nao" }) });
  const b = await chamar("/api/login", { method: "POST", body: JSON.stringify({ email: "ninguem@teste.com", senha: "nao" }) });
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.deepEqual(await a.json(), await b.json());
});

test("login certo abre sessão em cookie HttpOnly e libera o painel", async () => {
  const r = await chamar("/api/login", { method: "POST", body: JSON.stringify({ email: "loja@teste.com", senha: "senha-de-teste" }) });
  assert.equal(r.status, 200);
  const set = r.headers.get("set-cookie");
  assert.match(set, /HttpOnly/);
  assert.match(set, /SameSite=Lax/);
  cookie = set.split(";")[0];
  const p = await (await chamar("/api/painel")).json();
  assert.equal(p.email, "loja@teste.com");
  assert.ok(p.pedidos.length >= 2);
});

test("a loja muda o status e fechar a conta tira a mesa do painel", async () => {
  const p = await (await chamar("/api/painel")).json();
  const pedido = p.pedidos.find(o => o.mesa === 3);
  assert.equal((await chamar("/api/pedidos/" + pedido.id, { method: "PATCH", body: '{"status":"preparo"}' })).status, 200);
  assert.equal((await chamar("/api/pedidos/" + pedido.id, { method: "PATCH", body: '{"status":"voar"}' })).status, 400);
  assert.equal((await chamar("/api/mesas/3/fechar", { method: "POST" })).status, 200);
  const depois = await (await chamar("/api/painel")).json();
  assert.ok(depois.pedidos.every(o => o.mesa !== 3));
});

test("com token, o SSE serve o fluxo do cliente mesmo havendo cookie da loja", async () => {
  // é o caso do computador que abre o cardápio depois de entrar no painel
  const ctrl = new AbortController();
  const r = await chamar("/api/eventos?token=" + TOKEN, { signal: ctrl.signal });
  const trecho = new TextDecoder().decode((await r.body.getReader().read()).value);
  ctrl.abort();
  assert.ok(trecho.includes("event: meus"), trecho);
  assert.ok(!trecho.includes("event: painel"), trecho);
});

test("sem token e com sessão, o SSE serve o painel inteiro", async () => {
  const ctrl = new AbortController();
  const r = await chamar("/api/eventos", { signal: ctrl.signal });
  const leitor = r.body.getReader();
  let trecho = new TextDecoder().decode((await leitor.read()).value);
  if (!trecho.includes("event:")) trecho += new TextDecoder().decode((await leitor.read()).value);
  ctrl.abort();
  assert.ok(trecho.includes("event: painel"), trecho);
});

test("arquivos fora de public/ não são servidos", async () => {
  for (const rota of ["/server.js", "/../server.js", "/..%2fserver.js", "/%2e%2e/server.js", "/data/uacai.db", "/scripts/criar-usuario.js"])
    assert.ok([403, 404].includes((await fetch(base() + rota)).status), rota);
});

test("os cabeçalhos de segurança vão em toda resposta", async () => {
  const h = (await fetch(base() + "/")).headers;
  assert.match(h.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.equal(h.get("x-content-type-options"), "nosniff");
  assert.equal(h.get("referrer-policy"), "strict-origin-when-cross-origin");
});

test("a mesa trava no primeiro pedido: outra mesa dá 409, e fechar a conta libera", async () => {
  const APARELHO = "c".repeat(32);
  assert.equal((await pedir({ mesa: 5, token: APARELHO, itens: [{ chave: "A", q: 1 }] })).status, 201);
  const outra = await pedir({ mesa: 6, token: APARELHO, itens: [{ chave: "A", q: 1 }] });
  assert.equal(outra.status, 409);
  assert.equal((await outra.json()).mesa, 5);                       // o servidor diz qual é a mesa
  assert.equal((await pedir({ mesa: 5, token: APARELHO, itens: [{ chave: "A", q: 1 }] })).status, 201);
  assert.equal((await (await chamar("/api/meus-pedidos?token=" + APARELHO)).json()).travada, 5);
  assert.equal((await chamar("/api/mesas/5/fechar", { method: "POST" })).status, 200);
  assert.equal((await (await chamar("/api/meus-pedidos?token=" + APARELHO)).json()).travada, null);
  assert.equal((await pedir({ mesa: 6, token: APARELHO, itens: [{ chave: "A", q: 1 }] })).status, 201);
});

test("o faturamento do dia pede sessão, confere a data e soma as contas fechadas", async () => {
  assert.equal((await fetch(base() + "/api/faturamento")).status, 401);   // sem cookie
  for (const dia of ["2026-02-31", "2026-13-01", "2026-1-1", "ontem", "'; DROP TABLE contas_fechadas; --"])
    assert.equal((await chamar("/api/faturamento?dia=" + encodeURIComponent(dia))).status, 400, dia);
  const d = new Date();
  const hoje = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const f = await (await chamar("/api/faturamento?dia=" + hoje)).json();
  assert.ok(f.contas >= 2, JSON.stringify(f));            // a mesa 3 e a mesa 5 fecharam nos testes acima
  assert.equal(f.total, 55000 + 2 * 33000);               // o salmão da mesa 3 e os dois pratos da mesa 5
  assert.equal(f.ticket, Math.round(f.total / f.contas));
  assert.deepEqual(await (await chamar("/api/faturamento?dia=2020-01-01")).json(),
    { dia: "2020-01-01", contas: 0, total: 0, ticket: 0 });
});

test("o limite por mesa segura uma enxurrada de pedidos de conta", async () => {
  const códigos = [];
  for (let i = 0; i < 6; i++) códigos.push((await chamar("/api/chamados", { method: "POST", body: '{"mesa":9}' })).status);
  assert.ok(códigos.includes(429), códigos.join(","));
});
