# Relatório de segurança — UAÇAÍ

Revisão da Fase 7, feita sobre o cenário real: o site exposto na internet por um link
do **ngrok**, aberto por qualquer pessoa que leia o QR Code da mesa, com a área da loja
atrás de e-mail e senha no computador da recepção.

Escopo: `server.js`, `scripts/`, `public/app.js`, `public/index.html`, `public/catalogo.js`.
Os testes de `test/api.test.js` cobrem os pontos marcados com ✅.

---

## Achados e correções

| # | Severidade | Achado | Correção |
|---|---|---|---|
| 1 | **Alta** | O celular mandava o preço junto com o item. Quem abrisse o console podia pedir um salmão por Gs. 1. | O servidor ignora qualquer `p` que venha no corpo e usa `CATALOGO[chave]`, de `public/catalogo.js`. Item que não está no catálogo é recusado com 400. ✅ |
| 2 | **Alta** | Senha da loja no código (`uacai123`, na demo). | Nenhuma senha no repositório. `npm run criar-usuario -- email senha` grava `salt:hash` com `crypto.scrypt` (N=16384, r=8, p=1, 64 bytes, salt de 16 bytes por usuário). A comparação usa `crypto.timingSafeEqual`. |
| 3 | **Alta** | Força bruta no login. | Limite por IP (10 tentativas / 10 min) e por e-mail (5 / 10 min), em memória. Estouro responde 429 com a **mesma mensagem** do erro de senha. ✅ |
| 4 | **Alta** | O login respondia mais rápido para um e-mail que não existe, revelando quais e-mails são válidos. | Quando o e-mail não existe, o servidor compara contra um hash descartável gerado no boot, então o tempo de resposta é o mesmo. A mensagem é idêntica nos dois casos. ✅ |
| 5 | **Alta** | Rotas da loja acessíveis sem sessão. | `POST /api/login`, `POST /api/logout` e as rotas do cliente ficam antes do portão; **tudo** o que vem depois passa por `if (!sessao) return 401`. ✅ |
| 6 | **Alta** | `server.js`, o banco e os scripts estavam na mesma pasta servida. | Só `public/` é servida. O caminho é decodificado, normalizado e conferido com `startsWith(PUBLIC + path.sep)`: `../`, `%2e%2e%2f`, barra invertida e byte nulo caem em 400/403. `data/`, `scripts/`, `qr/`, `.env` e `.git` ficam fora de `public/` e no `.gitignore`. ✅ |
| 7 | **Média** | Qualquer pessoa podia ler os pedidos de qualquer mesa. | O cliente só lê com um token de 128 bits (`crypto.getRandomValues`) guardado no próprio celular, e só enxerga os pedidos daquele token — nas duas pontas, `GET /api/meus-pedidos` e o fluxo SSE. ✅ |
| 8 | **Média** | Entrada do cliente sem validação. | No servidor: mesa inteira de 1 a 11; chave precisa existir no catálogo (`Object.hasOwn`, que não deixa passar `constructor` nem `__proto__`); quantidade inteira de 1 a 20; no máximo 40 linhas por pedido; observação cortada em 200 caracteres; corpo do pedido limitado a 16 KiB; `status` só dentro da lista fechada. Todo SQL é `prepare` com parâmetros. ✅ |
| 9 | **Média** | Enxurrada de pedidos ou de chamados de uma mesa. | 6 pedidos e 3 chamados por mesa por minuto. Acima disso, 429. ✅ |
| 10 | **Média** | Sessão sem prazo e cookie frouxo. | Cookie `sid` com 256 bits, `HttpOnly`, `SameSite=Lax`, `Path=/` e `Secure` quando a conexão chega por HTTPS (atrás do ngrok, lido de `x-forwarded-proto`). A sessão vale 12 h e as vencidas são apagadas a cada leitura. ✅ |
| 11 | **Média** | XSS pelo campo de observações e pelos nomes nos cartões. | O painel da loja é montado com `createElement` + `textContent`; a observação entra por `document.createTextNode`. No cardápio, o pouco que usa `innerHTML` interpola só texto do catálogo e passa por `esc()`. Nada vindo do usuário chega a `innerHTML`. |
| 12 | **Média** | Sem cabeçalhos de segurança. | Em toda resposta: `Content-Security-Policy` (`default-src 'self'`, sem `unsafe-inline`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` e `Cross-Origin-Opener-Policy: same-origin`. ✅ |
| 13 | **Baixa** | Erro do servidor podia vazar caminho e stack. | Toda rota de API está dentro de um `try`; a falha vira `400 {"erro":"pedido malformado"}`, sem detalhe. |

### Revisão dos seis ajustes (trava de mesa, extrato, faturamento)

| # | Severidade | Achado | Correção |
|---|---|---|---|
| 14 | **Alta** | A trava de mesa, se ficasse no celular, seria decorativa: bastava trocar o `?mesa=` ou mexer no `sessionStorage`. | Quem trava é o servidor. O primeiro pedido grava `mesa_token(token → mesa)`; o pedido seguinte com outra mesa recebe **409**, com a mesa certa no corpo. A tela só obedece ao que o servidor respondeu. ✅ |
| 15 | **Média** | Ler a trava e depois gravá-la deixava dois pedidos simultâneos do mesmo aparelho quebrarem no `PRIMARY KEY` (e o erro virava um 400 confuso). | Virou `INSERT OR IGNORE` seguido de leitura: um passo atômico, o primeiro pedido ganha a mesa e os outros leem o resultado. |
| 16 | **Alta** | `GET /api/faturamento` mostra o dinheiro do dia. | Fica depois do portão `if (!sessao) return 401`, como todas as rotas da loja. Cliente recebe 401. O número também viaja no SSE — e o `avisa()` só manda o evento `painel` para conexões marcadas como loja, nunca para um celular. ✅ |
| 17 | **Média** | `?dia=` entrando numa consulta de datas. | `AAAA-MM-DD` por expressão regular **e** conferência de que a data existe de verdade (`2026-02-31` e `2026-13-01` caem em 400). A consulta é `prepare` com dois parâmetros de milissegundos. ✅ |
| 18 | **Média** | Total da conta calculado no navegador viraria um total adulterável. | `contas_fechadas.total` e o faturamento saem de `SUM()` sobre os preços que o próprio servidor gravou no pedido. O navegador não manda total nenhum. ✅ |
| 19 | **Média** | Observação do cliente impressa no extrato. | O extrato é montado com `createElement` + `textContent` em todas as células, inclusive a linha de observações. Nada do usuário encosta em `innerHTML`; a janela do açaí usa `innerHTML`, mas só com nomes do catálogo passados por `esc()`. |
| 20 | **Baixa** | Guardar a conta fechada podia virar um arquivo de dados de cliente. | `contas_fechadas` guarda mesa, abertura, fechamento, itens (horário, chave, quantidade, preço) e total. **Não** guarda o token do aparelho, IP, nem a observação — que é o único campo escrito por uma pessoa e o único que poderia trazer dado pessoal. |

## Riscos aceitos, e por quê

- **Apagar o `localStorage` cria um aparelho novo.** A trava amarra *aquele* token àquela mesa.
  Quem limpar o navegador recebe um token novo, sem histórico e sem conta, e pode pedir para
  outra mesa — exatamente como se tivesse pegado outro celular. Não existe, sem código por mesa,
  como distinguir isso de uma pessoa nova; o que segura o abuso continua sendo o limite de 6
  pedidos por mesa por minuto e a recepção ver a mesa antes de preparar. Se um dia incomodar, o
  passo seguinte é o código curto impresso junto do QR, que a trava já saberia conferir.
- **A trava sai quando a loja fecha a conta**, e só aí. Mesa que fica a noite inteira aberta
  mantém a linha em `mesa_token`; são no máximo alguns aparelhos por mesa, e o `Fechar conta`
  limpa todas as linhas daquela mesa de uma vez.

- **Pedir não pede login.** É o ponto do projeto: a pessoa lê o QR e pede. Quem tiver o link
  pode mandar pedido falso para uma mesa. O que segura é o limite por mesa (6/min), o fato de o
  link do ngrok mudar a cada sessão e a recepção ver a mesa antes de preparar. Para uma casa com
  11 mesas, isso é proporcional; se virar problema, o passo seguinte é um código curto por mesa,
  impresso junto do QR.
- **Sem token CSRF.** As rotas que mudam estado são `POST`/`PATCH`/`DELETE` com corpo JSON, e o
  cookie é `SameSite=Lax`, que o navegador não manda em requisição vinda de outro site. Um
  `<form>` de outro domínio não consegue montar o corpo JSON que o servidor exige.
- **O token do cliente vai na URL** de `GET /api/meus-pedidos` e do SSE, porque `EventSource` não
  deixa mandar cabeçalho. O servidor não escreve log de acesso e o `Referrer-Policy` evita que a
  URL inteira saia para fora. O token não dá acesso a nada além dos pedidos daquele celular.
- **Limites em memória.** Reiniciar o servidor zera os contadores de tentativa. Para um processo
  só, numa loja, é o suficiente; num deploy com várias cópias isso precisaria ir para o banco.
- **Sem HTTPS próprio.** Quem fecha o TLS é o ngrok. Rodando `npm start` direto na rede local sem
  HTTPS, o cookie sai sem `Secure` — o que é correto, mas significa que a rede local precisa ser
  de confiança.

## Conferência de segredos

Nada de senha, chave ou token no repositório. `.gitignore` cobre `data/` (o banco, onde ficam os
hashes), `qr/`, `.env` e `node_modules/`. O usuário da loja é criado por comando, nunca por código.
