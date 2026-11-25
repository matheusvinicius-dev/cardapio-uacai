// npm run criar-usuario -- loja@uacai.com SUA_SENHA
// Grava e-mail + hash scrypt no banco. Nenhuma senha fica no repositório.
"use strict";
const { criarHash, db } = require("../server.js");

const [email, senha] = process.argv.slice(2);
if (!email || !senha) {
  console.error("uso: npm run criar-usuario -- email senha");
  process.exit(1);
}
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("e-mail inválido");
  process.exit(1);
}
if (senha.length < 8) {
  console.error("a senha precisa de pelo menos 8 caracteres");
  process.exit(1);
}
db.prepare("INSERT INTO usuarios(email,hash) VALUES(?,?) ON CONFLICT(email) DO UPDATE SET hash=excluded.hash")
  .run(email.trim().toLowerCase(), criarHash(senha));
console.log("usuário pronto:", email.trim().toLowerCase());
process.exit(0);
