# UAÇAÍ — cardápio digital com pedido pela mesa

Um site, duas áreas:

- **Cliente** — a pessoa lê o QR Code da mesa, monta o pedido no celular e envia para a recepção.
  Depois acompanha o andamento ao vivo e pode pedir a conta.
- **Loja** — no computador da recepção, um painel em tela cheia com as 11 mesas, os pedidos em
  três colunas e um aviso quando alguém chama para pagar. Entra pelo menu de três pontinhos.

Os pedidos vão do celular para o painel **na hora**, sem recarregar, por Server-Sent Events.

## Como rodar

Precisa de **Node.js 22.5 ou mais novo** (o banco usa o `node:sqlite`, que vem junto com o Node).

```bash
npm install
npm run criar-usuario -- loja@uacai.com SUA_SENHA
npm start
```

O site sobe em <http://localhost:8080>. O cardápio abre na raiz; a área da loja fica atrás do
menu de três pontinhos, no canto do topo.

Para abrir no celular das pessoas, com o servidor rodando, numa segunda janela do terminal:

```bash
ngrok http 8080
```

O ngrok devolve um endereço `https://alguma-coisa.ngrok-free.app`. É esse endereço que vai nos
QR Codes. Ele **muda a cada vez que você liga o ngrok**, então gere os QR de novo quando mudar
(ou use um domínio fixo do ngrok, se a sua conta tiver um).

## QR Codes das mesas

```bash
npm run gerar-qr -- https://alguma-coisa.ngrok-free.app
```

Isso escreve `qr/mesa-1.png` até `qr/mesa-11.png` e `qr/imprimir.html`, com as 11 plaquinhas
prontas para imprimir em duas colunas. Abra o `imprimir.html` no navegador e mande imprimir.
Cada código abre `/?mesa=N`, então o celular já chega com a mesa certa.

## Senhas da loja

Nenhuma senha fica no código. O comando abaixo cria ou troca a senha de um usuário:

```bash
npm run criar-usuario -- loja@uacai.com NOVA_SENHA
```

A senha é guardada como hash `scrypt` com salt próprio, em `data/uacai.db`. Essa pasta está no
`.gitignore` e nunca é servida pelo navegador.

## Preços

Os preços dos combos são os oficiais da carta. **Os preços dos pratos avulsos são de exemplo** e
estão todos em `public/catalogo.js`, no objeto `PRECOS`, marcado com
`// EXEMPLO — trocar pelos preços reais`. Troque ali e reinicie o servidor: o mesmo arquivo serve
o navegador e o servidor, então não existe o risco de os dois discordarem. O servidor sempre
calcula o total pelo catálogo dele e ignora qualquer preço que venha do celular.

## Testes

```bash
npm test
```

Cobre preço calculado no servidor, validação de entrada, quem pode ver o quê, login, cabeçalhos
e o fato de nada fora de `public/` ser servido.

## Como está organizado

```
server.js            HTTP, API, SQLite e SSE num arquivo só. Sem dependência de runtime.
public/              a única pasta servida
  index.html         cardápio, telas do pedido e painel da loja
  app.js             toda a interface
  styles.css         tokens e estilos
  catalogo.js        preços e combos, lidos pelo navegador e pelo servidor
  img/               fotos dos pratos e a logo
scripts/
  criar-usuario.js   npm run criar-usuario
  gerar-qr.js        npm run gerar-qr
test/api.test.js     npm test
data/uacai.db        banco (criado sozinho, fora do ar público, fora do git)
qr/                  QR Codes gerados (fora do git)
qa/                  screenshots antes e depois
```

`SECURITY.md` tem o relatório de segurança; `CHANGELOG.md`, o histórico do que mudou e por quê.
