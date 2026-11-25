# Prompt — UAÇAÍ: 6 ajustes (desktop, mesa travada, conta, impressão, faturamento, açaí)

> Cole no Claude Code aberto dentro da pasta `cardapio-uacai`.

---

Faça os **6 ajustes** abaixo no site UAÇAÍ desta pasta (`public/` + `server.js`). Antes de começar, leia o `README.md` e o `CHANGELOG.md` para entender o que já existe.

Use as **7 skills** e os **2 MCPs**, **cada um só na sua área**, na ordem das fases. Antes de cada fase, carregue a skill e siga as instruções dela. Ao final de cada fase, escreva no `CHANGELOG.md`, em 3 a 6 linhas, o que mudou e por quê. **Não faça commit nem push.**

## Regras que nunca mudam
- **Identidade:** o hero verde com a bola de açaí e a folha, o "U" verde-claro, as cores branco/verde (`#1f7a4d` / `#6cb33f`)/roxo (`#6a2fb0`), a logo e as fotos.
- **Idiomas:** ES/PT/EN. **Todo texto novo precisa estar nos 3.**
- **Funções atuais:** tudo o que já funciona continua funcionando (busca, categorias, visualizador de fotos, pedido, "Meus pedidos", "Pedir a conta", Área da loja com e-mail e senha, tempo real, 11 mesas).
- **Nada inventado:** não invente pratos nem preços.

## Os 6 ajustes

**1. Cardápio em formato de computador.** A partir de 1024px:
- sem a moldura de celular;
- hero largo;
- categorias numa barra lateral fixa ou no topo;
- pratos em grade de 2 a 3 colunas;
- **painel do pedido fixo à direita**, em vez da gaveta que sobe de baixo.

No celular, tudo continua igual.

**2. A mesa só pode ser escolhida uma vez.**
- Depois do **primeiro pedido enviado**, a mesa trava naquele aparelho: o "Trocar mesa" some e o selo da mesa ganha um cadeado.
- Vale também quando a mesa veio pelo QR (`?mesa=N`).
- **O servidor também precisa garantir isso:** amarre o token do aparelho à mesa no primeiro pedido e responda **409** se esse token tentar pedir para outra mesa.
- A trava sai quando a loja **fecha a conta** da mesa (aviso pelo SSE).
- Se o cliente estiver na mesa errada, aparece "Mesa errada? Chame a recepção".

**3. Lista de pedidos ao selecionar a mesa.** No painel, abaixo da conta da mesa selecionada, mostre a **lista dos pedidos** daquela mesa, do mais antigo para o mais novo. Cada pedido mostra:
- número e horário (por exemplo, "#104 · 20:15");
- status;
- itens com quantidade e preço;
- observação;
- subtotal.

**4. "Ver conta" abre o extrato com botão de imprimir.** Tanto no aviso de pedido de conta quanto na conta da mesa, "Ver conta" abre uma janela com o **extrato**:
- **Cabeçalho:** logo, UAÇAÍ, mesa, data e horário de abertura da conta.
- **Linha por item:** **horário do pedido**, quantidade, nome, preço unitário e total da linha.
- **Total geral** em Gs.
- Botões **Imprimir**, **Fechar conta** e **Voltar**.

O **Imprimir** usa `window.print()` com `@media print`: sai **só o extrato**, em formato de cupom de **80mm**, sem cores de fundo e sem botões.

**5. Faturamento do dia.**
- "Fechar conta" passa a **registrar** cada conta numa tabela `contas_fechadas` (mesa, abertura, fechamento, itens, total) antes de liberar a mesa.
- No topo do painel, em destaque, mostre o **"Faturamento do dia"** (soma das contas fechadas hoje), com o **número de contas** e o **ticket médio** ao lado. O "Em aberto" continua separado.
- O dia vai de 00:00 a 23:59 no horário do computador da loja e zera sozinho.
- Crie a rota `GET /api/faturamento?dia=AAAA-MM-DD`, só para quem está logado na loja, e atualize o número ao vivo pelo SSE.

**6. "Cairia bem um açaí agora?"**
- Ao tocar em **"Enviar pedido"**, se o pedido tiver **pratos salgados** (combos, frango, carnes, peixes, caldos, tapiocas salgadas, crepioca, salada) e **nenhum açaí**, abra uma janela antes de enviar:
  - **PT:** "Cairia bem um açaí agora?"
  - **ES:** "¿Te vendría bien un açaí ahora?"
  - **EN:** "How about an açaí now?"
- A janela mostra Açaí con banana, Copa de açaí con maní e Pote de açaí, cada um com foto, preço e **"+ Adicionar"**, e mais dois botões: **"Enviar com açaí"** e **"Não, obrigado"**.
- **No máximo uma vez por pedido.** Não aparece se já tiver açaí no pedido ou se ele for só de doces e bebidas.

---

## Fase 0 — Linha de base · MCP **Playwright**
1. Com o servidor rodando (`npm start`), tire screenshots do cardápio em 393, 768, 1280 e 1440 e do painel da loja em 1440. Salve em `qa/ajustes-antes/`.
2. Grave o fluxo atual: celular `/?mesa=10` pede → a loja aceita → o cliente pede a conta → a loja fecha a conta.

## Fase 1 — Servidor e lógica mínimos · skill **Ponytail**
**Área:** a menor mudança completa no servidor e no JS. Ela não decide o visual.
- **(2)** amarrar o token do aparelho à mesa, responder 409 para outra mesa e liberar a trava ao fechar a conta;
- **(5)** criar a tabela `contas_fechadas`, a rota `/api/faturamento` e o evento SSE de faturamento;
- **(3) e (4)** expor os dados da mesa (pedidos com horário e status) para a lista e o extrato;
- **(6)** a regra de quando mostrar a pergunta do açaí, com as categorias "salgado" e "açaí" marcadas no catálogo.

Use os recursos nativos e não adicione dependências. Revise com `/ponytail-review` no final da fase.

## Fase 2 — Layout · skill **frontend-design**
**Área:** estrutura e hierarquia das telas novas e alteradas.
- **(1)** o layout desktop do cardápio (hero largo, categorias, grade, painel do pedido fixo à direita);
- **(2)** o selo de mesa travada e o aviso "Mesa errada?";
- **(3)** a lista de pedidos sob a conta da mesa;
- **(4)** a janela do extrato e o **layout do cupom de impressão** de 80mm;
- **(5)** o destaque do faturamento do dia no topo do painel, legível de longe;
- **(6)** a janela "Cairia bem um açaí agora?", com as fotos dos açaís como protagonistas.

## Fase 3 — Curadoria · skill **Taste**
**Área:** julgamento.
- Critique o resultado da Fase 2: o desktop não pode parecer o mobile esticado; o faturamento precisa ser claro sem poluir o topo; a janela do açaí tem que convidar sem empurrar (nada de insistência, contagem regressiva ou ar de anúncio).
- Liste as decisões em **manter / remover / mudar** e aplique.

## Fase 4 — Sistema e acabamento · skill **Impeccable**
**Área:** consistência.
- Use os tokens existentes em `:root` em todas as telas novas e crie os que faltarem: tipografia do cupom, tamanho do número de faturamento, espaçamentos do layout desktop.
- Confira alinhamentos, áreas de toque de no mínimo 44px, contraste AA e foco visível, inclusive no extrato e na janela do açaí.
- Rode os comandos de auditoria e polimento da skill e aplique as correções.

## Fase 5 — Padrões de componente · MCP **jpisnice/shadcn**
**Área:** anatomia, ARIA e estados. **Não instale React nem shadcn.**
- **Dialog** para o extrato e para a pergunta do açaí;
- **Table** para as linhas do extrato;
- **Card** para os pedidos da lista;
- **Badge** para status e cadeado da mesa;
- **Alert** para "Mesa errada?";
- **Sidebar** ou **Navigation Menu** para as categorias no desktop.

Traga para o HTML/JS puro os papéis ARIA, o foco preso e devolvido nos modais, o fechar com Esc e os estados completos (default, hover, active, focus, disabled e loading, por exemplo "Imprimindo…" e "Enviando…").

## Fase 6 — Movimento · skill **Emil Kowalski**
**Área:** só animação e sensação de toque.
- **Janela do açaí:** entra suave, de baixo no celular e com scale 0.96 → 1 no desktop. O "+ Adicionar" dá um feedback e o item "pula" para o pedido.
- **Cadeado da mesa:** fecha com uma microanimação na primeira vez.
- **Faturamento:** o número sobe com uma contagem curta quando uma conta é fechada.
- **Extrato e lista de pedidos:** abrem com transição curta.
- **Painel do pedido no desktop:** atualiza sem saltos.
- **Regras:** entradas de 200 a 300ms com ease-out personalizado, só `transform` e `opacity`, respeito a `prefers-reduced-motion`.

## Fase 7 — Segurança · skill **security audit**
**Área:** as mudanças no servidor e os dados novos.
- **Trava de mesa:** não pode ser burlada trocando o `?mesa=` nem apagando o token no navegador; o servidor decide.
- **Rotas da loja:** `/api/faturamento`, o extrato e o fechar conta exigem sessão. Cliente recebe 401/403.
- **Validação:** datas no formato `AAAA-MM-DD`, mesa de 1 a 11, totais calculados **só no servidor**.
- **Impressão e extrato:** nada do usuário entra sem escape (observações, por exemplo).
- **Dados:** nenhum dado pessoal desnecessário em `contas_fechadas`.
- Atualize o `SECURITY.md` com os achados novos e as correções.

## Fase 8 — Portão anti-"cara de IA" · skill **Hallmark**
**Área:** auditoria visual final, antes da QA.
- Rode `hallmark audit` no `public/index.html` e cole a lista de problemas no `CHANGELOG.md`.
- Corrija o que for reprovado nas telas novas. **O hero continua com as exceções já registradas.** Não rode `redesign`.
- Garanta os estados completos dos componentes novos.

## Fase 9 — QA completo · MCP **Playwright**
1. Abra **dois contextos**: celular (393×852, `/?mesa=10`) e computador (1440×900, Área da loja).
2. Confira:
   - **(1)** cardápio no desktop sem a moldura, em 1280 e 1440, e o celular intacto;
   - **(2)** a mesa trava depois do primeiro pedido, o servidor responde 409 para outra mesa e a trava sai ao fechar a conta;
   - **(3)** a lista de pedidos aparece ao selecionar a mesa 10;
   - **(4)** "Ver conta" abre o extrato e a impressão sai como **PDF de 80mm** só com o extrato;
   - **(5)** o faturamento do dia sobe ao fechar a conta, e o número de contas e o ticket médio estão certos;
   - **(6)** a pergunta do açaí aparece com prato salgado sem açaí, não aparece com açaí ou só com doces, e aparece uma vez só.
3. Rode os testes de `test/` e acrescente testes para o 409 da mesa e para o `/api/faturamento`.
4. Tire screenshots em `qa/ajustes-depois/`. O console tem que terminar com **zero erros**.

## Fase 10 — Revisão final · **web design guidelines**
- Rode a skill **web-design-guidelines** em todos os arquivos de `public/`.
- Corrija os itens apontados. Para qualquer item que decidir não corrigir, justifique em 1 linha no `CHANGELOG.md`.
- Termine com um resumo de até 10 linhas no `CHANGELOG.md`.

---

### Mapa rápido de responsabilidades

| # | Ferramenta | Faz nestes ajustes | Não faz |
|---|---|---|---|
| 0 | Playwright MCP | Linha de base (screenshots e fluxo atual) | Decidir o design |
| 1 | Ponytail | Trava de mesa, `contas_fechadas`, faturamento, regra do açaí, com código mínimo | Visual |
| 2 | frontend-design | Layout desktop, extrato, cupom, faturamento, janela do açaí | Animação |
| 3 | Taste | Corte de excessos, desktop sem "mobile esticado", açaí sem insistência | Criar funcionalidades |
| 4 | Impeccable | Tokens, alinhamento, contraste e foco nas telas novas | Mudar o conceito |
| 5 | shadcn MCP | Dialog, Table, Card, Badge, Alert, Sidebar como referência | Instalar React |
| 6 | Emil Kowalski | Animações do açaí, do cadeado, do faturamento e do extrato | Cores, layout |
| 7 | Security audit | Trava no servidor, rotas protegidas, validação, escape | Mudar o design |
| 8 | Hallmark | Auditoria visual e estados completos | Redesign da marca |
| 9 | Playwright MCP | Teste com 2 aparelhos dos 6 ajustes + PDF de 80mm | Decidir o design |
| 10 | web-design-guidelines | Revisão final | — |
