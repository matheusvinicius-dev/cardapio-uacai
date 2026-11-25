# Prompt — UAÇAÍ: pedido por mesa + Área da loja (tempo real)

> Cole este prompt no Claude Code aberto **dentro da pasta `cardapio-uacai`**.

---

Você vai evoluir o cardápio digital do **UAÇAÍ** que está nesta pasta (`index.html`, `styles.css`, `app.js` e `img/`) para um **site único com duas áreas**:

1. **Área do cliente:** o cardápio de hoje, agora com pedido pela mesa.
2. **Área da loja:** um painel no computador da recepção, protegido por e-mail e senha, onde os pedidos chegam **em tempo real** dos celulares dos clientes.

O arquivo `referencia/site-demo.html` é uma **demonstração funcionando** de tudo isso, num arquivo só. Use-o como referência de comportamento e de visual (fluxo, textos, cores, estados e painel). Ele guarda os pedidos no `localStorage` e só sincroniza abas do mesmo navegador. Você vai trocar isso por um **servidor de verdade**. Não copie o código dele às cegas.

Use as **7 skills** e os **2 MCPs** abaixo, **cada um só na sua área**, na ordem das fases. Antes de cada fase, carregue a skill e siga as instruções dela. Ao final de cada fase, escreva no `CHANGELOG.md`, em 3 a 6 linhas, o que mudou e por quê. **Não faça commit nem push.**

## O que não muda

- **Visual de hoje:** o hero com o cartão verde, a bola roxa de açaí com a folha verde e o título UAÇAÍ com o "U" verde-claro; as cores branco, verde (`#1f7a4d` / `#6cb33f`) e roxo (`#6a2fb0`); a logo `img/logo.png` e as fotos de `img/`.
- **Conteúdo e funções atuais:** combos, pratos, pesos, preços dos combos, busca, categorias, idiomas ES/PT/EN e visualizador de fotos.
- **Nada inventado:** não invente pratos nem descrições. Os **pratos avulsos ainda não têm preço oficial**. Use os preços de exemplo da demo, todos num único objeto `PRECOS`, com o comentário `// EXEMPLO — trocar pelos preços reais`.

## O que construir

### Área do cliente (celular, via QR Code)
- **Mesa:** o QR de cada mesa abre `/?mesa=N` (mesas 1 a **11**). A mesa aparece num selo no topo e pode ser trocada. Se a pessoa abrir sem mesa, o site pergunta a mesa antes de enviar o pedido.
- **Montar o pedido:** botão "+" e quantidade em pratos, combos e destaques; também o botão "+ Adicionar" no visualizador de fotos.
- **Painel do pedido:** itens com quantidade, mesa (com opção de trocar), observações, total em Gs. e o botão **"Enviar pedido para a recepção"**.
- **Depois de enviar:** aparece "Pedido enviado!" e a tela **Meus pedidos**, com o andamento de cada pedido **ao vivo** (Recebido → Em preparo → Pronto → Entregue).
- **Pedir a conta:** um botão que avisa a recepção. Depois de tocado, mostra "a recepção já vem até a sua mesa".
- **Menu de três pontinhos:** fica no topo do cardápio e tem a opção **"Área da loja"**.

### Área da loja (computador da recepção)
- **Entrada:** pelos três pontinhos → **"Área da loja"** → janela com **e-mail e senha**. Com erro, mostra "E-mail ou senha incorretos".
- **Painel em tela cheia:**
  - **Topo:** logo, "Área da loja", "Conectado como <e-mail>", contadores (novos, em preparo, prontos, mesas ocupadas x/11, total em aberto), indicador **Ao vivo** e o botão **Sair**, que desconecta e volta ao cardápio.
  - **Aviso de pagamento:** um aviso laranja quando uma mesa pede a conta ("Mesa X está chamando para pagar", com o total), com os botões **Ver conta** e **Estou indo**.
  - **Grade das 11 mesas:** cores por status (pedido novo roxo, em preparo amarelo, pronto verde, quer pagar laranja, atendida e livre), quantidade de pedidos abertos e total da mesa.
  - **Conta da mesa:** clicando numa mesa aparecem os itens somados, o total e o botão **Fechar conta**, que zera a mesa.
  - **Colunas de pedidos** (Novos / Em preparo / Prontos para servir): mesa, número, há quanto tempo chegou, itens com preço, subtotal, observação e o botão da próxima etapa (Aceitar e preparar → Marcar como pronto → Entregue na mesa).
  - **Alertas:** um **bipe** e o destaque visual quando chega pedido novo ou pedido de conta.

### Servidor (tempo real)
- **Tecnologia:** Node.js com o **mínimo de dependências** e banco **SQLite** em arquivo (`data/uacai.db`, fora da pasta pública).
- **Tempo real:** **Server-Sent Events** (`EventSource`). Os pedidos e os pedidos de conta chegam ao painel na hora, e o status volta ao cliente na hora.
- **Estrutura:** mova o site para `public/`. Só essa pasta é servida, para que `server.js`, o banco e os scripts **nunca** fiquem acessíveis pelo navegador.
- **API sugerida:**

  | Quem usa | Rotas |
  |---|---|
  | Cliente | `POST /api/pedidos`, `GET /api/meus-pedidos` (com um token do pedido), `POST /api/chamados` |
  | Loja (precisa de sessão) | `POST /api/login`, `POST /api/logout`, `GET /api/painel`, `PATCH /api/pedidos/:id`, `DELETE /api/chamados/:mesa`, `POST /api/mesas/:n/fechar` |
  | Os dois | `GET /api/eventos` (SSE). A loja recebe tudo; o cliente recebe só os próprios pedidos. |

- **O servidor calcula os preços** a partir do catálogo. Nunca confie no preço vindo do celular.
- **Usuários da loja:** e-mail + senha com hash (`crypto.scrypt` do Node) e sessão em cookie `HttpOnly`, `SameSite=Lax` e `Secure` quando em HTTPS. Crie o comando `npm run criar-usuario -- email senha`. **Não deixe nenhuma senha no código.**
- **QR Codes:** crie `npm run gerar-qr -- https://SEU-LINK`, que gera `qr/mesa-1.png` até `qr/mesa-11.png` e um `qr/imprimir.html` com os 11 QR prontos para imprimir, cada um com o número da mesa.
- **Para rodar:**
  1. `npm install` e `npm run criar-usuario -- loja@uacai.com SUA_SENHA`
  2. `npm start` (porta 8080)
  3. `ngrok http 8080`

  Escreva esses passos no `README.md`.

---

## Fase 0 — Linha de base · MCP **Playwright**
1. Sirva o site atual e tire screenshots em 393 e 1280; salve em `qa/antes/`.
2. Abra `referencia/site-demo.html` e percorra o fluxo completo: cliente pede → loja entra com `loja@uacai.com` / `uacai123` → aceita → cliente vê o status → pede a conta → loja fecha a conta. Anote o comportamento esperado.

## Fase 1 — Arquitetura e servidor mínimos · skill **Ponytail**
**Área:** a menor solução completa. Ela não decide o visual.
- Monte a estrutura `public/`, `server.js`, `data/` e `scripts/`, a API acima, o SQLite e os SSE, com o menor número de arquivos e dependências possível.
- Prefira os recursos nativos do Node (`http`, `crypto`, `fs`) e do navegador (`fetch`, `EventSource`, `<dialog>`). Justifique cada dependência no `CHANGELOG.md`.
- Ligue o front ao servidor: troque o `localStorage` da demo por chamadas à API e pelo `EventSource`.

## Fase 2 — Telas novas · skill **frontend-design**
**Área:** layout e hierarquia das telas novas, coerentes com o hero e o cardápio atuais.
- Desenhe e construa:
  - **cliente:** selo da mesa, escolha de mesa, painel do pedido, "Pedido enviado", "Meus pedidos" e "Pedir a conta";
  - **loja:** menu de três pontinhos, janela de login e painel completo (desktop e também usável num tablet).
- O painel precisa ser lido de longe, por quem está atendendo: números grandes, status claros, ações óbvias.

## Fase 3 — Curadoria · skill **Taste**
**Área:** julgamento do que sobra e do que sai.
- Critique o resultado da Fase 2: excesso de selos, cores, bordas, sombras ou texto, e qualquer coisa "com cara de IA".
- Liste as decisões no formato **manter / remover / mudar** e aplique. O laranja fica só para o pedido de conta; o roxo, só para pedido novo e ações principais.

## Fase 4 — Sistema e acabamento · skill **Impeccable**
**Área:** consistência.
- Tokens em `:root` (cores, tipografia, espaçamentos múltiplos de 4, raios, sombras), alinhamentos, áreas de toque de no mínimo 44px, contraste AA e foco visível em tudo, incluindo o painel.
- Rode os comandos de auditoria e polimento da skill e aplique as correções.

## Fase 5 — Padrões de componente · MCP **jpisnice/shadcn**
**Área:** anatomia, ARIA e estados. **Não instale React nem shadcn.**
- Consulte **Dropdown Menu** (três pontinhos), **Dialog** (login, escolha de mesa, visualizador), **Sheet** (pedido), **Badge**, **Button**, **Card**, **Alert** (pedido de conta), **Toast** e **Input**, e traga para o HTML/JS puro:
  - papéis ARIA corretos;
  - foco preso nos modais e devolvido ao fechar;
  - Esc e clique fora para fechar;
  - estados default, hover, active, focus, disabled e loading (por exemplo, "Enviando…" no botão de enviar).

## Fase 6 — Movimento · skill **Emil Kowalski**
**Área:** só animação e sensação de toque.
- **Feedback de toque:** scale 0.96–0.97 nos botões "+", nas mesas e nas ações do painel.
- **Painel do pedido:** desliza de baixo e pode ser arrastado para fechar.
- **Pedidos chegando:** entram no painel da loja com um leve deslize e destaque, e mudam de coluna com uma transição curta.
- **Contadores:** pulsam quando o número muda.
- **Pedido de conta:** o aviso laranja chama atenção sem piscar sem parar.
- **Regras:** entradas de 200 a 300ms com ease-out personalizado, só `transform` e `opacity`, e respeito a `prefers-reduced-motion`.

## Fase 7 — Segurança · skill **security audit**
**Área:** riscos reais de um site exposto na internet pelo ngrok.
- **Login:** limite de tentativas por IP e por e-mail, mensagem genérica de erro, hash scrypt com salt, sessão expirando e cookie seguro.
- **Autorização:** toda rota da loja exige sessão. O cliente só lê os próprios pedidos, com o token.
- **Validação no servidor:** mesa de 1 a 11; itens que existem no catálogo; quantidade de 1 a 20; observação de até 200 caracteres; limite de pedidos e de pedidos de conta por mesa por minuto.
- **XSS:** nada do usuário entra em `innerHTML` sem escape. Prefira `textContent`.
- **Cabeçalhos:** `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` e `frame-ancestors 'none'`.
- **Arquivos:** só `public/` é servida; `.env`, `data/`, `scripts/`, `.git` e `qa/` nunca. Confira também que não há segredos no repositório.
- Entregue o relatório no `SECURITY.md`, com a severidade de cada achado e a correção.

## Fase 8 — Portão anti-"cara de IA" · skill **Hallmark**
**Área:** auditoria visual final, antes da QA.
- Rode `hallmark audit` no `public/index.html` e cole a lista de problemas no `CHANGELOG.md`.
- Corrija o que for reprovado **sem descaracterizar a marca**. Não rode `redesign`.
- Garanta os estados completos de todo componente interativo.

## Fase 9 — QA ponta a ponta · MCP **Playwright**
1. Com o servidor rodando, abra **dois contextos de navegador**: um celular (393×852, `/?mesa=4`) e um computador (1440×900).
2. Teste o fluxo completo: o cliente pede → **o pedido aparece no painel em até 2 s, sem recarregar** → a loja aceita → o cliente vê "Em preparo" → pronto → entregue → o cliente pede a conta → o aviso laranja aparece → a loja fecha a conta → a mesa volta a ficar livre.
3. Teste também:
   - login errado;
   - acesso à API da loja sem sessão (tem que dar 401);
   - mesa inválida;
   - pedido vazio;
   - a página continuando ao vivo depois de 1 min ociosa;
   - os 3 idiomas;
   - teclado e `prefers-reduced-motion`.
4. Tire screenshots em `qa/depois/`. O console tem que terminar com **zero erros**.

## Fase 10 — Revisão final · **web design guidelines**
- Rode a skill **web-design-guidelines** em todos os arquivos de `public/`.
- Corrija os itens apontados. Para qualquer item que decidir não corrigir, justifique em 1 linha no `CHANGELOG.md`.
- Termine com um resumo de até 10 linhas no `CHANGELOG.md` e confira o `README.md` com os passos para rodar e colocar online pelo ngrok.

---

### Mapa rápido de responsabilidades

| # | Ferramenta | Faz | Não faz |
|---|---|---|---|
| 0 | Playwright MCP | Linha de base e estudo da demo | Decidir o design |
| 1 | Ponytail | Servidor, API, SQLite e SSE mínimos; ligar o front | Visual |
| 2 | frontend-design | Telas novas do cliente e da loja | Animação, ajuste fino |
| 3 | Taste | Crítica e corte | Criar funcionalidades |
| 4 | Impeccable | Tokens, consistência, contraste | Mudar o conceito |
| 5 | shadcn MCP | Anatomia, ARIA e estados de referência | Instalar React/shadcn |
| 6 | Emil Kowalski | Movimento e feedback de toque | Cores, layout |
| 7 | Security audit | Login, autorização, validação, XSS, headers | Mudar o design |
| 8 | Hallmark | Auditoria anti-slop e estados completos | Redesign da marca |
| 9 | Playwright MCP | Teste ponta a ponta com 2 aparelhos | Decidir o design |
| 10 | web-design-guidelines | Revisão final | — |
