// Catálogo de preços — único arquivo lido pelos dois lados: o navegador carrega como script
// clássico (vira global) e o server.js dá require(). O servidor nunca aceita preço do celular.
// EXEMPLO — trocar pelos preços reais
var PRECOS={A:33000,B:34000,C:36000,D:36000,E:38000,F:30000,G:36000,H:30000,I:40000,J:40000,K:34000,L:40000,M:36000,N:42000,O:45000,P:40000,Q:55000,R:36000,S:34000,T:40000,U:40000,V9:35000,V7:38000,V11:30000,V8:28000,V5:30000,V1:28000,V2:28000,V3:25000,V12:28000,V6:28000,V4:20000,V10:18000};
// preços dos combos: oficiais, vindos da carta impressa
var COMBOS=[
 {n:"Combo 1",ids:"ABCDE",old:177000,p:168000},
 {n:"Combo 2",ids:"CFGHD",old:160000,p:152000},
 {n:"Combo 3",ids:"IJKLM",old:209000,p:198000},
 {n:"Combo 6",ids:"NOPQR",old:252000,p:239000},
 {n:"Combo 7",ids:"JONLJ",old:213000,p:200000},
 {n:"Combo 8",ids:"LSNOJ",old:207000,p:195000},
 {n:"Combo 9",ids:"FRLTN",old:192000,p:180000},
 {n:"Combo 10",ids:"TFLUJ",old:203000,p:190000},
];
COMBOS.forEach((c,i)=>c.key="combo"+i);
// chave -> preço em Gs., para pratos avulsos e combos juntos
var CATALOGO=Object.assign({},PRECOS);
COMBOS.forEach(c=>{CATALOGO[c.key]=c.p;});
// grupos da pergunta "cairia bem um açaí?": prato salgado no pedido e nenhum açaí.
// Açaí = a categoria açaí da carta (V9, V7, V11), que é o que a janela oferece.
var ACAIS=["V9","V7","V11"];
// salgados: os pratos de 5 letras (A–U), a tapioca de jamón y queso, a crepioca de pollo,
// a ensalada e todos os combos. Doces e bebidas ficam de fora de propósito.
var SALGADOS=[..."ABCDEFGHIJKLMNOPQRSTU","V8","V5","V2",...COMBOS.map(c=>c.key)];
if(typeof module!=="undefined") module.exports={PRECOS,COMBOS,CATALOGO,ACAIS,SALGADOS};
