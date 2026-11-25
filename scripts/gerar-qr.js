// npm run gerar-qr -- https://SEU-LINK
// Gera qr/mesa-1.png … qr/mesa-11.png e qr/imprimir.html com as 11 plaquinhas prontas para imprimir.
"use strict";
const fs = require("node:fs"), path = require("node:path");
const QR = require("qrcode");

const NMESAS = 11;
const base = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https?:\/\/.+/.test(base)) {
  console.error("uso: npm run gerar-qr -- https://SEU-LINK");
  process.exit(1);
}
const dir = path.join(__dirname, "..", "qr");
fs.mkdirSync(dir, { recursive: true });

const esc = s => String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

(async () => {
  const cartoes = [];
  for (let n = 1; n <= NMESAS; n++) {
    const url = base + "/?mesa=" + n;
    await QR.toFile(path.join(dir, "mesa-" + n + ".png"), url,
      { width: 900, margin: 2, errorCorrectionLevel: "M", color: { dark: "#1f7a4d", light: "#ffffff" } });
    cartoes.push(`<figure class="card">
    <b>Mesa ${n}</b>
    <img src="mesa-${n}.png" alt="QR Code da mesa ${n}" width="300" height="300">
    <figcaption>Aponte a câmera para ver o cardápio e pedir</figcaption>
    <small>${esc(url)}</small>
  </figure>`);
  }
  fs.writeFileSync(path.join(dir, "imprimir.html"), `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UAÇAÍ — QR Codes das mesas</title>
<style>
  :root{--green:#1f7a4d;--purple:#6a2fb0;--ink:#14231b;--muted:#5d6b63}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;color:var(--ink);padding:16mm 12mm;background:#fff}
  h1{font-size:20px;margin-bottom:4mm;color:var(--green)}
  p.lead{color:var(--muted);font-size:13px;margin-bottom:8mm}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8mm}
  .card{display:flex;flex-direction:column;align-items:center;gap:3mm;padding:8mm 4mm;
        border:2px solid var(--green);border-radius:6mm;text-align:center;break-inside:avoid}
  .card b{font-size:34px;letter-spacing:-.02em;color:var(--purple)}
  .card img{width:62mm;height:62mm}
  .card figcaption{font-size:13px;color:var(--ink)}
  .card small{font-size:10px;color:var(--muted);word-break:break-all}
  @media print{body{padding:0}p.lead,h1{display:none}.grid{gap:6mm}}
</style>
</head>
<body>
<h1>UAÇAÍ — QR Codes das mesas</h1>
<p class="lead">Imprima, recorte e deixe uma plaquinha em cada mesa. Cada código abre o cardápio já com a mesa escolhida.</p>
<div class="grid">
  ${cartoes.join("\n  ")}
</div>
</body>
</html>
`);
  console.log("pronto: " + NMESAS + " PNGs e qr/imprimir.html em " + dir);
})();
