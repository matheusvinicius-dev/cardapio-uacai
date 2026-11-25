# CHANGELOG

## 2026-11-24 — pedido pela mesa e área da loja em tempo real

### Fase 0 — Linha de base (Playwright)
Servi o site como estava e guardei `qa/antes/cliente-393.png` e `qa/antes/cliente-1280.png`.
Percorri a demo `referencia/site-demo.html` inteira e anotei o comportamento esperado:
pedido do cliente → painel da loja → Aceitar e preparar → Marcar como pronto → Entregue na mesa →
Pedir a conta → aviso laranja → Fechar conta, que zera a mesa. `qa/antes/demo-loja-1280.png` guarda
o painel da demo com um pedido e um chamado abertos, que serviu de referência de comportamento.

### Fase 1 — Arquitetura e servidor (Ponytail)
O site saiu para `public/`; nasceram `server.js`, `data/`, `scripts/` e `test/`. O servidor é um
arquivo só: HTTP, arquivos estáticos, API do cliente, API da loja e Server-Sent Events.
**Dependências de runtime: nenhuma.** `node:sqlite` (banco), `node:crypto` (scrypt, tokens),
`node:http` e `node:fs` já vêm com o Node 22.5+, então não entrou nem driver de banco nem framework.
A única dependência do projeto é **`qrcode`**, usada só pelo `npm run gerar-qr`: escrever um
codificador de QR à mão seria muito mais código do que o problema merece.

Decisões que valem registro:
- **`public/catalogo.js` é lido pelos dois lados.** O navegador carrega como script clássico e o
  `server.js` dá `require` no mesmo arquivo. Um lugar só para os preços, sem risco de o celular e
  o servidor discordarem. O servidor ignora qualquer preço que venha do corpo da requisição.
- **Não usei `<dialog>`**, apesar de ser o nativo. O `<dialog>` modal renderiza no *top layer*, que
  escapa da moldura de iPhone usada no desktop e quebraria a prévia. O cardápio já tinha uma camada
  modal testada (a do visualizador de fotos) com foco preso, Esc e foco devolvido; generalizei essa
  camada em vez de escrever um contorno para o top layer.
- **SSE em vez de polling.** Um `EventSource` por aba. A loja recebe o painel inteiro; o celular
  recebe só os pedidos do próprio token.

### Fase 2 — Telas novas (frontend-design)
Nada de identidade nova: o hero, as cores e as fontes do UAÇAÍ já existem e mandam. O trabalho foi
estender esse sistema para o que não existia.
- **Cliente:** selo da mesa ao lado da logo e menu de três pontinhos no topo do hero; botão "+" e
  contador nos pratos, combos, destaques e no visualizador de fotos; barra do pedido fixa embaixo;
  painel do pedido deslizando de baixo, com itens, mesa, observações e total; "Pedido enviado" e
  "Meus pedidos" com o andamento ao vivo; "Pedir a conta".
- **Loja:** uma tela cheia pensada para ser lida de longe por quem está atendendo. Números grandes
  nas mesas (2 rem), uma grade de 11 mesas coloridas por status, as três colunas de pedidos e o
  aviso de conta no topo, onde o olho bate primeiro.

### Fase 3 — Curadoria (crítica e corte)
A skill *Taste* não está instalada nesta máquina; apliquei o critério dela à mão.

**Manter** — a legenda das cores das mesas (ensina o código em uma linha); o selo de status em cada
cartão; o total em aberto no topo; os três chips de contagem.

**Remover** — o rodapé "Demonstração: os pedidos ficam salvos neste navegador" da demo (deixou de
ser verdade); o `—` embaixo das mesas livres (vazio é mais claro que um travessão); o pulso infinito
do ponto "Ao vivo"; a pílula branca que embrulhava o "Ao vivo".

**Mudar** — o preço era uma pílula roxa repetida em todos os pratos, trinta pílulas descendo a
página: virou texto em negrito, e o roxo voltou a significar alguma coisa. O contador de quantidade
era roxo enquanto o "+" era verde, uma troca de cor sem sentido ao tocar: ficou verde. A linha da
mesa no painel do pedido era um bloco roxo cheio, mas é informação e não ação: virou uma linha
discreta. "Limpar pedido", "Cancelar" e "Continuar pedindo" eram roxos e disputavam a cor da ação
principal: ficaram neutros. O aviso "Pedido enviado!" tinha um disco roxo dentro de um cartão verde,
duas cores de marca brigando num selo de 40 px: virou um círculo translúcido. Os chips do topo da
loja eram todos coloridos mesmo valendo zero: agora só "novos" e "querem pagar" ganham cor, e só
quando têm o que mostrar. **O laranja ficou exclusivo do pedido de conta; o roxo, de pedido novo e
das ações principais.**

### Fase 4 — Sistema e acabamento
A skill *Impeccable* não está instalada; segui a regra que o próprio `styles.css` já declara no
cabeçalho ("nenhum valor de cor, tipo, espaço, raio ou sombra fora dos tokens").
- Sete tokens novos no `:root`: `--amber`, `--amber-l`, `--amber-d`, `--orange`, `--orange-l`,
  `--orange-d`, `--danger`, mais `--veil-sheet`, `--veil-modal`, `--purple-h`, `--on-leaf` e
  `--glass-edge`. Fora do bloco do hero, **zero cor crua** nas telas novas.
- Contraste conferido por script (OKLCH → sRGB → WCAG): os doze pares novos passam AA, do menor
  (5,26:1, branco sobre verde) ao maior (8,94:1). O laranja do chamado teve de escurecer de
  `#e8590c` (3,2:1 com branco, reprovado) para `oklch(52% .17 42)` (5,85:1).
- Área de toque de 44 px em tudo que é tocável, inclusive no contador de quantidade, que na demo
  tinha botões de 30 px.
- Foco visível em todo controle, com o anel trocando de cor onde o roxo cairia sobre roxo ou verde
  (mesas, ações dos cartões, topo verde da loja).

### Fase 5 — Padrões de componente (MCP shadcn)
Consultei **Alert** e **Button** no MCP e levei o que se aplica a HTML puro:
- `role="alert"` no contêiner dos chamados, que já existe na página antes de receber conteúdo, para
  o leitor de tela anunciar de verdade.
- Desabilitado em três canais (fundo, texto e cursor) em vez de só opacidade, e `hover`/`active`
  que não respondem mais quando o botão está desabilitado.
- `aria-busy` nos botões enquanto a requisição corre, junto com o "Enviando…" / "Entrando…".
- `aria-invalid` e `aria-describedby` nos campos do login quando a senha está errada.
- Tab dentro do menu de três pontinhos passou a fechar o menu e seguir o foco adiante, como manda o
  padrão de Dropdown Menu, em vez de ser engolido.
- Diálogos (login, escolha de mesa, visualizador) e o painel do pedido: `role="dialog"`,
  `aria-modal`, rótulo, foco preso, Esc, clique fora e foco devolvido a quem abriu.

### Fase 6 — Movimento
A skill *Emil Kowalski* não está instalada; segui os princípios dela.
- Toque: `scale(.96–.97)` nos "+", nas mesas, nos cartões e nas ações do painel.
- O painel do pedido desliza de baixo e pode ser arrastado para fechar (solta além de 110 px ou com
  velocidade); enquanto arrasta, o texto não é selecionado.
- Pedido novo entra na coluna com um deslize curto — **só quando é novo**. Antes, cada atualização
  do SSE reanimava todos os cartões; agora o painel guarda o que já estava na tela e só anima o que
  mudou de coluna ou acabou de chegar.
- Contadores pulsam **só quando o número muda**.
- O aviso de conta chama atenção com três pulsos e para. Era um `box-shadow` animado (fora do
  compositor); virou um anel em `opacity`/`transform`.
- Entradas de 260 ms com `--ease-out`, só `transform` e `opacity`, e `prefers-reduced-motion`
  zerando tudo — conferido no Playwright: `transition-duration: 0s`, nenhuma animação ativa.

### Fase 7 — Segurança
A skill `security-review` desta máquina só sabe revisar diff contra `origin/HEAD`, e o repositório
não tem remoto, então ela parou logo no começo. Fiz a auditoria à mão, item por item do checklist
da fase, e escrevi o resultado em **`SECURITY.md`**: 13 achados com severidade e correção, mais os
riscos que ficam aceitos e por quê.

Os três mais sérios: o preço vinha do celular (agora o servidor calcula pelo catálogo); a senha da
loja estava no código da demo (agora é `scrypt` com salt no banco, criada por comando, nada no
repositório); `server.js` e o banco ficavam na mesma pasta servida (agora só `public/` é servida, e
o caminho é decodificado, normalizado e conferido).

`test/api.test.js` nasceu junto, com 13 testes que travam o comportamento: preço do servidor,
validação de mesa/item/quantidade/observação, isolamento por token, 401 em todas as rotas da loja,
mensagem igual para senha errada e e-mail inexistente, cookie `HttpOnly`/`SameSite`, limite por
mesa, cabeçalhos e arquivos fora de `public/`.

### Fase 8 — Portão anti-"cara de IA" (Hallmark)
`sloplint.mjs public/index.html --genre editorial` apontou, na primeira rodada:

```
FAIL 39a  desabilitado só por opacidade em button:disabled
FAIL 48   oklch solto fora dos tokens: .overlay, .modal, .pay:hover, .vadd
FAIL 19   travessão "—" no texto (index.html, placeholder da mesa e do total)
FAIL 7a   #fff puro: .hero, .logo, .lang button.on, .eyebrow, .pill            (hero)
FAIL 48   34 literais de cor e a fonte "Inter" fora dos tokens                  (hero)
FAIL 67   .eyebrow em maiúsculas com tracking 0.18em num papel de rótulo        (hero)
WARN F4   dois botões cheios lado a lado no topo
NOTE 24b  8 espaçamentos fora da escala de 4 px                                 (hero)
```

Corrigi tudo que é meu: os quatro `oklch` viraram token, o desabilitado ganhou três canais e os
travessões saíram. **Fora do bloco do hero (`styles.css` 85–109) a auditoria fecha em 0 FAIL.**

Os 38 FAIL restantes estão todos dentro do hero e ficaram **waived no carimbo do CSS**, com a razão
escrita lá: o hero é a identidade que já existe — cartão verde, bola de açaí, U verde-claro,
`#1f7a4d` / `#6a2fb0` / `#6cb33f`, Inter — e esta tarefa diz com todas as letras que ele não muda.
Tokenizar essas cores descaracterizaria a marca. O `WARN F4` foi dispensado: os dois botões cheios
do topo são a plaquinha da mesa e o menu de opções, controles de utilidade, não duas chamadas para
ação disputando o mesmo clique.

### Fase 9 — QA ponta a ponta (Playwright)
Dois contextos: celular 393×852 em `/?mesa=4` e computador 1440×900. O fluxo inteiro passou.

**O pedido apareceu no painel em 36 ms** (medido com `MutationObserver` no contador de novos),
sem recarregar — o limite da fase era 2 s. O celular viu `Recebido → Em preparo → Pronto, indo para
a mesa → Entregue` ao vivo, cada passo chegando em menos de meio segundo do clique da loja, com a
aba em segundo plano. Depois: pedir a conta → aviso laranja no painel → fechar conta → mesa livre,
chamado apagado, total em aberto zerado.

Também testados: login errado (mensagem genérica, `aria-invalid`, foco de volta na senha); API da
loja sem sessão (401 nas quatro rotas); `?mesa=99` ignorado, com o diálogo de escolha de mesa
aparecendo antes do envio; pedido vazio (botão desabilitado, barra escondida); **SSE aberto depois
de 80 s ocioso** (8 amostras, `readyState` 1 o tempo todo); os três idiomas (ES/PT/EN, incluindo os
textos novos); teclado (Esc fecha, foco preso, foco devolvido) e `prefers-reduced-motion`
(`transition-duration: 0s`, nenhuma animação). **Console terminou com zero erros nas duas abas.**

Quatro bugs reais saíram daqui, nenhum deles visível sem rodar as duas pontas juntas:
1. **O SSE escolhia o fluxo pelo cookie, e o cliente pela URL.** Num computador que entrou no painel
   e depois abriu o cardápio, o celular recebia o painel da loja em vez dos próprios pedidos e o
   status nunca atualizava. Agora quem manda token recebe o fluxo do cliente, ponto. Virou teste.
2. **`abrir()` guardava "quem abriu" depois de tornar o fundo inerte**, e `inert` já tinha tirado o
   foco — Esc devolvia o foco ao `<body>` em vez do botão. Agora guarda antes.
3. **Fechar a conta deixava a mesa marcada como selecionada**: o evento do SSE chegava antes da
   linha que limpa a seleção. Redesenha depois de limpar.
4. **`Cache-Control: public, max-age=3600` no CSS e no JS.** Reiniciar o servidor com código novo
   deixaria celulares presos na versão antiga por uma hora. Agora página, estilo e script são
   sempre revalidados; só as fotos ficam em cache longo.

Screenshots em `qa/depois/`: cardápio e painel do pedido no celular, "Meus pedidos", o painel da
loja com pedido novo, com o chamado laranja, com a conta da mesa aberta, e em tablet (820 px).

### Fase 10 — Revisão final (web-design-guidelines)
Rodei a lista do Web Interface Guidelines sobre `public/`. Corrigido:
- `transition` de `background` na barrinha de progresso do pedido → nada (só `transform`/`opacity`).
- Ponto decorativo do "Ao vivo" piscando sem parar → cor estática; a cor já diz o estado.
- Espaço que não quebra em `Gs. 70.000` e em `330 g`.
- `overflow-wrap` e `min-width: 0` onde texto do cliente ou nome de prato poderia estourar o cartão.
- Placeholder das observações terminando em reticências, nos três idiomas.
- `spellcheck="false"` no e-mail, `autocomplete="off"` nas observações, `name` no textarea.
- `width`/`height`/`fetchpriority="high"` na logo do hero.
- `outline:none` sobrando no `h1` da loja.
- `user-select: none` enquanto o painel do pedido é arrastado.
- **"Fechar conta" era destrutivo sem confirmação** — um clique errado zerava a conta de uma mesa.
  Agora o primeiro clique pergunta ("Confirmar? Isso zera a mesa") e volta sozinho em 6 s.

Não corrigido, com a razão:
- *Title Case em títulos e botões*: é convenção do inglês. Em português e espanhol a forma correta
  é a frase em caixa baixa, e o cardápio já era assim.
- *`Intl.RelativeTimeFormat` no "há 3 min" dos cartões*: o painel é só em português e a string
  manual é mais curta que o nome do método; voltar a isso se o painel virar multilíngue.
- *Regiões `aria-live` nos seis contadores do topo*: anunciar seis números a cada pedido atrapalha
  mais do que ajuda. O que precisa ser anunciado é o chamado de conta, e esse tem `role="alert"`.
- *Área da loja com URL própria*: um endereço direto seria compartilhável por engano. A entrada é
  pelo menu e pela sessão, de propósito.
- *Placeholder do e-mail sem reticências*: `loja@uacai.com` é um exemplo completo; reticências ali
  sugeririam que falta digitar algo.
- *Painel da loja só em português*: é ferramenta interna da equipe, e os textos dela estão fixados
  em português no próprio pedido desta tarefa. O cardápio do cliente segue nos três idiomas.

### Resumo
O cardápio virou um site com duas áreas e um servidor de verdade por trás: Node sem dependência de
runtime, SQLite em arquivo fora da pasta pública, Server-Sent Events ligando o celular à recepção.
O cliente lê o QR da mesa, monta o pedido, envia e acompanha ao vivo; a recepção vê o pedido chegar
em 36 ms, move entre três colunas, recebe o chamado de conta num aviso laranja e fecha a mesa.
O hero, as cores, as fotos, os combos, a busca, as categorias e os três idiomas continuam iguais.
O servidor calcula todo preço, valida toda entrada e serve só `public/`; a senha da loja é scrypt
com salt, criada por comando, e nada de segredo entrou no repositório. 13 testes de API travam o
comportamento. Fora do hero, a auditoria do Hallmark fecha em zero. O QA ponta a ponta passou com
console limpo e achou quatro bugs que só apareciam com as duas pontas rodando juntas — todos
corrigidos. Falta uma coisa só, e é do dono: trocar os preços de exemplo dos pratos avulsos em
`public/catalogo.js`.

---

## Seis ajustes — desktop, mesa travada, extrato, faturamento e açaí

### Fase 0 · Linha de base (Playwright MCP)
- Servidor de QA numa porta e num banco à parte (`UACAI_DB` no scratchpad), para não tocar no banco
  real da loja nem na senha dela.
- `qa/ajustes-antes/` guarda o cardápio em 393, 768, 1280 e 1440 e o painel da loja em 1440.
- O fluxo atual foi gravado em quatro passos: celular `/?mesa=10` pede → a loja aceita → o cliente
  pede a conta → a loja fecha a conta. Tudo funcionou, console com zero erros.
- Em 1280 e 1440 o cardápio aparece dentro da moldura de iPhone, centralizado: é exatamente o que
  o ajuste 1 vem resolver.

### Fase 1 · Servidor e lógica mínimos (Ponytail)
- **Trava de mesa (2):** tabela `mesa_token`. O pedido faz `INSERT OR IGNORE` e lê quem ganhou a
  mesa: outro número vira **409** com a mesa certa no corpo. `Fechar conta` apaga a amarração, e o
  celular descobre a trava por `meus.travada`, que já viaja no SSE — nenhuma decisão fica no cliente.
- **Faturamento (5):** tabela `contas_fechadas` (mesa, abertura, fechamento, itens, total) gravada
  antes de liberar a mesa, rota `GET /api/faturamento?dia=AAAA-MM-DD` só com sessão, e o número
  entra no evento `painel` do SSE. O dia sai do relógio da loja, então zera sozinho às 00:00.
- **Lista e extrato (3 e 4):** nada novo no servidor — o `painel` já manda `criado`, `status`, itens
  e observação de cada pedido, que é exatamente o que a lista e o extrato precisam.
- **Açaí (6):** `ACAIS` e `SALGADOS` no `catalogo.js`, lidos pelos dois lados. A regra é uma linha:
  tem salgado, não tem açaí, e só na primeira vez de cada pedido.
- Revisão `/ponytail-review` achou uma corrida: ler a trava e depois gravá-la deixava dois pedidos
  simultâneos quebrarem no `PRIMARY KEY`. Virou um `INSERT OR IGNORE` + leitura, que é atômico e
  também mais curto. Ficou anotado para a Fase 9 o teste do 409 e do `/api/faturamento`.
- Zero dependência nova. Os 13 testes continuam passando.

### Fase 2 · Layout (frontend-design)
- **Cardápio no computador (1):** a partir de 1024px a moldura de iPhone sai, o hero vira um cartão
  largo, a busca e as categorias viram barra lateral fixa de 216px, os pratos entram numa grade de
  2 a 3 colunas e o painel do pedido passa a ser uma coluna fixa de 368px à direita, com "Seu
  pedido" e "Meus pedidos" um abaixo do outro. No celular nada muda: a mesma folha, outro ponto.
- **Mesa travada (2):** o selo da mesa ganha o cadeado e deixa de ser botão; abaixo da linha da
  mesa aparece o aviso "Mesa errada? Chame a recepção", em roxo-açaí (laranja continua reservado
  ao pedido de conta, no painel da loja).
- **Lista e extrato (3 e 4):** a conta da mesa virou cabeçalho + grade de cartões, um por pedido,
  com número, horário, status, itens, observação e subtotal. O extrato é um diálogo com tabela de
  cinco colunas; a impressão esconde todo o resto da página e sai em cupom de 72 mm de conteúdo
  dentro de papel de 80 mm, preto no branco e sem botões.
- **Faturamento (5):** faixa verde-clara no topo do painel com o número em 3,25rem e, ao lado,
  contas fechadas e ticket médio. O "Em aberto" continua onde estava, nos chips do cabeçalho.
- **Açaí (6):** no celular a janela sobe de baixo com as três fotos em linhas de 84px; no
  computador ela centraliza e as fotos viram cartões 4:5 — as fotos são o argumento.
- Dois erros achados na tela e corrigidos: a bola de açaí do hero crescia até engolir os controles
  no largo, e a janela do açaí usava `id="acai"`, que já era da categoria Açaí da carta (virou
  `sugAcai`).

### Fase 3 · Curadoria (julgamento; a skill Taste não está instalada nesta máquina)
Crítica do resultado da Fase 2, em manter / remover / mudar:
- **Manter:** hero intacto; o painel fixo à direita com "Seu pedido" e "Meus pedidos" juntos; o
  trilho dos destaques (é um trilho de verdade, não uma grade de celular esticada); a faixa de
  faturamento verde-clara, que informa sem gritar; o extrato como tabela sóbria.
- **Remover:** os chips agregados da conta da mesa ("2× Salmão · Gs. 110.000"). A lista de pedidos
  logo abaixo diz o mesmo com horário, status e subtotal. Saíram os chips, o `Map` que os montava
  e as regras `.cl` — menos código e uma repetição a menos na tela.
- **Mudar:** o botão principal da janela do açaí dizia "Enviar com açaí" mesmo sem açaí no pedido.
  Agora ele só promete isso quando há açaí; sem açaí, lê "Enviar o pedido". A janela convida e não
  empurra: sem contagem, sem desconto, sem segunda pergunta — uma vez por pedido e pronto.
- **Mudar:** a foto do açaí no celular foi de 84 para 96px, porque a foto é o argumento da janela.

### Fase 4 · Sistema e acabamento (consistência; a skill Impeccable não está instalada)
- Tokens novos em `:root`, nenhum valor solto nas telas novas: `--pw` (painel do pedido), `--side`
  (barra lateral), `--wide`, `--t-fat` (número do faturamento), `--cupom`, `--t-cupom`,
  `--t-cupom-sm`, `--t-cupom-lg`, `--ink-print` e `--paper`.
- Auditoria rodada no navegador, não a olho: nenhum alvo de toque abaixo de 44px no painel, no
  extrato, na janela do açaí e no painel do pedido.
- Contraste medido em 25 pares de cor das telas novas (texto sobre o fundo real, com a cor
  resolvida pelo navegador): todos passam AA — o menor é 5,26:1 no "+ Adicionar" e 5,46:1 no
  rótulo "Contas fechadas".
- Foco visível: o anel roxo de 3px já valia para o documento inteiro, e o extrato, que vive fora
  do `#loja`, herda esse mesmo anel.

### Fase 5 · Padrões de componente (MCP shadcn, sem React)
- Li a anatomia do **Dialog**, **Alert**, **Table**, **Card** e **Badge** no MCP e trouxe só o que
  o HTML puro precisa: o extrato passou a ter `aria-describedby` apontando para a linha de
  abertura da conta, e a tabela ganhou uma `<caption class="sr">` que só o leitor de tela lê.
- Cada cartão de pedido (`<article>`) ganhou nome acessível ("Pedido #4"); a categoria em que a
  leitura está ganhou `aria-current="true"` na barra lateral (Navigation Menu).
- Foco preso, devolvido e Esc já valiam para os diálogos antigos e passaram a valer para o extrato
  e para a janela do açaí sem código novo: `FUNDO()` agora devolve o `#loja` quando o painel está
  aberto, então o diálogo da loja torna o painel inerte do mesmo jeito.
- Estados completos: faltava `:hover` nos três botões do painel (`.b-out`, `.b-call`, `.b-pur`);
  "Imprimindo…" e "Enviando…" já cobrem o estado de carregando, com `cursor:progress`.
- Conferido no navegador: ao abrir a janela do açaí o foco entra nela, Tab não escapa, Esc fecha e
  o foco volta para "Enviar pedido".

### Fase 6 · Movimento (princípios de Emil Kowalski; a skill não está instalada)
- Janela do açaí: sobe de baixo no celular e entra com `scale(.96) → 1` no computador, 260 ms com
  `--ease-out`. "+ Adicionar" vira "✓ Adicionar" e a foto voa até o total do pedido em 320 ms.
- Cadeado da mesa: microanimação de 260 ms na primeira vez que a mesa trava, nunca de novo.
- Faturamento: quando uma conta fecha, o número caminha do valor antigo ao novo em 600 ms.
- Extrato e lista de pedidos: o extrato entra com escala curta; a conta da mesa só anima na troca
  de mesa — os eventos do SSE redesenham sem repetir a entrada.
- Tudo com `transform` e `opacity`. `prefers-reduced-motion` desliga as animações de CSS numa
  regra só, e as de JavaScript estão atrás de `reduced()`.

### Fase 7 · Segurança (revisão das mudanças do servidor)
- Sete achados novos em `SECURITY.md` (14 a 20): a trava fica no servidor e o 409 é dele; a corrida
  do `INSERT OR IGNORE`; `/api/faturamento` atrás da sessão e o evento `painel` do SSE indo só para
  conexões de loja; `?dia=` validado por formato **e** por data existente; totais só por `SUM()` no
  servidor; extrato montado com `textContent`, inclusive a observação; e `contas_fechadas` sem
  token, sem IP e sem a observação do cliente.
- Dois riscos aceitos, escritos com todas as letras: apagar o `localStorage` cria um aparelho novo
  (sem código por mesa não há como distinguir isso de outra pessoa), e a trava só sai no
  "Fechar conta".
- Conferido com `curl`: cliente recebe 401 em `/api/faturamento`, `/api/painel` e no fechar conta,
  e o SSE de cliente traz só `event: meus`.

### Fase 8 · Portão anti-"cara de IA" (Hallmark · `sloplint`)
Lista do `sloplint public/index.html --genre editorial`, como ela saiu:

```
38 FAIL  — todos dentro do hero (styles.css 94–115): 7a (#fff puro), 48 (cor e fonte
           fora dos tokens), 67 (.eyebrow em caixa alta espaçada), 24b (espaços fora
           da escala de 4px). São as exceções já registradas: o hero não mudou nesta
           tarefa, só desceu de linha porque entraram tokens novos no topo.
 5 REFLEX — 7b: --paper (#fff) e --ink-print (#000) dentro do @media print.
 1 WARN   — F4: dois botões cheios no topo do hero (a plaquinha da mesa e o menu ⋮).
 1 WAIVED — 38iii: o "U" verde do logotipo.
 8 NOTE   — 24b, espaçamentos do hero.
```

- **Fora do hero, nas telas novas: 0 FAIL.** Painel do computador, extrato, faturamento, lista de
  pedidos e janela do açaí passam limpos.
- **Waiver novo registrado no cabeçalho do CSS (7b):** o cupom de 80 mm é preto no branco de
  verdade. `--paper` e `--ink-print` só existem dentro do `@media print`, onde a cor é tinta de
  impressora térmica, não a paleta da tela; tingir isso de verde gastaria toner e tiraria
  legibilidade do papel.
- O WARN F4 continua dispensado pela mesma razão de antes: a plaquinha da mesa e o menu de opções
  são controles de utilidade, não duas chamadas disputando o mesmo clique.
- Estados completos dos componentes novos conferidos na Fase 5 (hover, active, foco, desabilitado
  e carregando). `redesign` não foi rodado.

### Fase 9 · QA completo (Playwright MCP, dois aparelhos)
Celular em 393×852 com `/?mesa=10` e computador em 1440×900 na Área da loja, num banco e numa
porta só para o teste. Resultado item a item:

1. **Desktop (1):** em 1280 e 1440 o cardápio aparece sem moldura, com hero largo, categorias na
   lateral, grade de pratos e painel do pedido à direita. Em 393 e 768 a tela continua idêntica à
   de antes.
2. **Mesa travada (2):** depois do primeiro pedido o selo ganha cadeado, fica `disabled`, o
   "Trocar" some e aparece "Mesa errada? Chame a recepção". Abrindo `/?mesa=3` **no mesmo
   aparelho**, a tela volta sozinha para a Mesa 10 e o `POST /api/pedidos` com `mesa:3` forçado no
   console responde **409 `{"erro":"este aparelho já está na mesa 10","mesa":10}`**. Quando a loja
   fechou a conta, a trava saiu ao vivo pelo SSE, sem recarregar.
3. **Lista de pedidos (3):** ao escolher a mesa 10, os quatro pedidos aparecem do mais antigo ao
   mais novo, com número, horário, status, itens com preço e subtotal.
4. **Extrato (4):** "Ver conta" abre a janela com cabeçalho, seis linhas de item com horário,
   quantidade, unitário e total, e o total geral. Na mídia de impressão só o `#extrato` continua
   visível no `body`, o cupom mede **72 mm** de conteúdo (80 mm de papel com 4 mm de margem), os
   botões somem e o fundo fica branco.
5. **Faturamento (5):** fechar a conta da mesa 10 levou o número de `Gs. 0` a `Gs. 246.000`, com
   1 conta e ticket igual ao total; uma segunda conta de `Gs. 70.000` levou a `Gs. 316.000`, 2
   contas e ticket `Gs. 158.000` — a média certa. `GET /api/faturamento` devolve os mesmos valores.
6. **Açaí (6):** aparece com prato salgado sem açaí; **não** aparece com açaí no pedido nem num
   pedido só de doce e bebida; não repete dentro do mesmo pedido e volta a perguntar no pedido
   seguinte. "+ Adicionar" marca "✓", a foto voa para o total e o botão principal muda para
   "Enviar com açaí" só quando há açaí.

- **Dois bugs achados aqui e corrigidos:** o painel do pedido abria antes de ser desenhado no
  celular (o `redesenha()` vinha antes do `abrir()`, então o botão Enviar ficava desabilitado num
  pedido cheio); e os três "+ Adicionar" da janela do açaí no computador ficavam em alturas
  diferentes quando o nome do prato ocupava duas linhas.
- **Testes:** 15 passando, dois novos — o 409 da trava com a liberação ao fechar a conta, e o
  `/api/faturamento` (401 sem sessão, 400 em `2026-02-31`, `2026-13-01`, `2026-1-1` e numa string
  com `DROP TABLE`, soma e ticket conferidos contra os preços do catálogo).
- **Console:** zero erros nas duas pontas. O único erro visto na sessão foi o 409 que eu mesmo
  provoquei pelo console para testar a trava — é o navegador registrando a resposta do servidor.
- **Não verificado:** o PDF de 80 mm saindo da impressora. O `window.print()` não abre num
  navegador controlado, então conferi a regra `@page{size:80mm auto;margin:4mm}` no CSS e a
  largura medida do cupom, não o arquivo impresso.

### Fase 10 · Revisão final (web-design-guidelines, 104 regras)

Achados nos arquivos de `public/`:

```
public/styles.css:352  .mbox sem overscroll-behavior: contain (diálogo rolável)   → corrigido
public/styles.css:581  .ebox sem overscroll-behavior: contain (extrato rolável)   → corrigido
public/styles.css:540  .ac-n sem overflow-wrap em nome de prato comprido          → corrigido
public/app.js:525      hora() montava "14:02" na mão, em vez de Intl              → corrigido
public/index.html      ✓ sem achados
```

Itens que deixei como estão, com a razão em uma linha cada:
- *Title Case em títulos e botões (85)*: convenção do inglês; em PT e ES a forma correta é a frase
  em caixa baixa, como o resto do site — mesma decisão já registrada na entrega anterior.
- *`aria-live` no número do faturamento (7)*: anunciar o valor a cada conta fechada atrapalharia
  quem usa leitor de tela; o que precisa ser anunciado é o chamado de conta, e esse tem `role="alert"`.
- *Estado na URL: mesa escolhida, extrato aberto (58, 60)*: a área da loja não tem endereço próprio
  de propósito — um link direto seria compartilhado por engano.
- *Confirmação do "Fechar conta" em dois cliques, não em modal (61)*: na recepção, com fila na
  frente, o segundo clique protege igual e custa menos tempo.
- *Listas sem virtualização (50)*: o maior conjunto são 11 mesas e algumas dezenas de pedidos
  abertos; virtualizar aqui seria código para um problema que não existe.
- *`overscroll-behavior: none` no `<html>` (65)*: o documento já é `overflow: clip`, então não há
  rubber-banding a conter.
- *`@page{size:80mm auto}` valendo para a página toda*: `@page` não aceita condição e a única coisa
  que esta tela manda imprimir é o extrato; está marcado como `shortcut:` no CSS, com o gatilho
  para separar numa página própria se um dia houver um segundo tipo de impressão.

### Resumo
Seis ajustes, dez fases, nenhuma dependência nova: continua Node puro com `node:sqlite`.
A partir de 1024px o cardápio deixa de ser um celular no meio da tela e vira um site de
computador — hero largo, categorias na lateral, pratos em grade e o pedido numa coluna fixa à
direita; no celular nada mudou. A mesa agora trava no primeiro pedido, e quem trava é o servidor:
trocar o `?mesa=` responde 409, e a trava só sai quando a loja fecha a conta — aviso que chega ao
celular na hora, pelo SSE. A conta da mesa ganhou a lista dos pedidos com horário e status, e o
"Ver conta" abre um extrato que imprime em cupom de 80 mm, só o extrato, preto no branco. Toda
conta fechada vira linha em `contas_fechadas`, e o topo do painel mostra o faturamento do dia com
contas e ticket médio, somados pelo servidor e atualizados ao vivo. Com prato salgado e nenhum
açaí, uma janela pergunta uma vez — com as três fotos, sem pressa e sem insistir. 15 testes
passando, console limpo nas duas pontas, contraste AA e alvos de 44px nas telas novas, e sete
achados novos de segurança escritos em `SECURITY.md`. Falta a mesma coisa de sempre, e é do dono:
trocar os preços de exemplo em `public/catalogo.js`.
