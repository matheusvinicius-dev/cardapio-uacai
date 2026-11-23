// UAÇAÍ · carta digital (só consulta, sem pedido). Dados (UI, D, TR, CATS, COMBOS) no topo; depois render, visualizador e idioma.
const LANGS=["es","pt","en"];
const UI={
 es:{top:"Los más pedidos",eyebrow:"Açaí · Comida saludable",sub1:"Comida",sub2:" saludable",lede:"Açaí, tapiocas, platos caseros y postres. Condimentos naturales, sin frituras ni potenciadores de sabor. Ahorrá con un combo de 5 platos.",p1:"Açaí",p2:"Combos de 5 platos",p3:"Sin frituras",search:"Buscar plato o ingrediente…",skip:"Ir a la carta",lang:"Idioma",empty:"No encontramos nada. Probá con otra palabra.",f2:"Nuestras comidas se elaboran con condimentos naturales. No contienen potenciadores de sabor, frituras, colorantes ni condimentos artificiales; sin lactosa ni gluten para intolerantes. Pueden contener restos de gluten.",hint:"Vista previa en iPhone · en el celular la carta se abre a pantalla completa",star:"Favorito",new:"Novedad",combos:"Combos",combosNote:"5 platos con descuento",avg:"Promedio por plato",close:"Cerrar",photo:"Ver foto",prev:"Foto anterior",next:"Foto siguiente",of:"de",carousel:"carrusel"},
 pt:{top:"Mais pedidos",eyebrow:"Açaí · Comida saudável",sub1:"Comida",sub2:" saudável",lede:"Açaí, tapiocas, pratos caseiros e sobremesas. Temperos naturais, sem frituras nem realçadores de sabor. Economize com um combo de 5 pratos.",p1:"Açaí",p2:"Combos de 5 pratos",p3:"Sem frituras",search:"Buscar prato ou ingrediente…",skip:"Ir ao cardápio",lang:"Idioma",empty:"Nada encontrado. Tente outra palavra.",f2:"Nossas comidas são feitas com temperos naturais. Não contêm realçadores de sabor, frituras, corantes nem temperos artificiais; sem lactose nem glúten para intolerantes. Podem conter traços de glúten.",hint:"Prévia em iPhone · no celular o cardápio abre em tela cheia",star:"Favorito",new:"Novidade",combos:"Combos",combosNote:"5 pratos com desconto",avg:"Média por prato",close:"Fechar",photo:"Ver foto",prev:"Foto anterior",next:"Próxima foto",of:"de",carousel:"carrossel"},
 en:{top:"Most popular",eyebrow:"Açaí · Healthy food",sub1:"Healthy",sub2:" food",lede:"Açaí, tapiocas, home-style dishes and desserts. Natural seasonings, no fried food and no flavor enhancers. Save with a 5‑dish combo.",p1:"Açaí",p2:"5-dish combos",p3:"No fried food",search:"Search dish or ingredient…",skip:"Skip to menu",lang:"Language",empty:"Nothing found. Try another word.",f2:"Our meals are made with natural seasonings. They contain no flavor enhancers, fried food, colorings or artificial seasonings; lactose-free and gluten-free for people with intolerances. May contain traces of gluten.",hint:"iPhone preview · on a phone the menu opens full screen",star:"Favorite",new:"New",combos:"Combos",combosNote:"5 dishes at a discount",avg:"Average per dish",close:"Close",photo:"View photo",prev:"Previous photo",next:"Next photo",of:"of",carousel:"carousel"},
};
// espanhol = texto original da carta (não mudar); PT e EN ficam em TR
const D={
 A:{n:"Carne molida con zapallo",g:330,d:"Carne molida con chaucha y zanahoria, arroz blanco o integral y zapallo."},
 B:{n:"Pollo grillado con papa rústica",g:320,d:"Pollo grillado, arroz blanco o integral con vegetales y papa rústica con limón pepper."},
 C:{n:"Carne a la olla con frijoles negros",g:340,d:"Carne a la olla, arroz blanco o integral y frijoles negros."},
 D:{n:"Pollo grillado con puré y brócoli",g:310,d:"Pollo grillado, puré de batata dulce o puré de papa y brócoli al vapor.",t:["star"]},
 E:{n:"Pollo grillado con poroto y ensalada",g:400,d:"Pollo grillado, arroz blanco o integral, poroto (feijão carioca o negro) y brócoli al vapor con ensalada."},
 F:{n:"Caldo de mandioca",g:400,d:"Caldo de mandioca con carne magra.",t:["star"]},
 G:{n:"Carne a la olla con feijão carioca",g:340,d:"Carne a la olla, arroz blanco o integral y frijoles (feijão carioca)."},
 H:{n:"Canja — caldo de pollo",g:400,d:"Caldo de pollo con arroz integral, zanahoria y papa."},
 I:{n:"Tilapia grillada con puré",g:330,d:"Tilapia grillada, arroz blanco o integral con vegetales y puré de papa."},
 J:{n:"Carne a la olla con puré",g:350,d:"Carne a la olla, arroz blanco o integral con vegetales y puré de papa.",t:["star"]},
 K:{n:"Carne molida con lenteja al curry",g:320,d:"Carne molida con chaucha y zanahoria, arroz blanco o integral y lenteja al curry."},
 L:{n:"Strogonoff de pollo",g:340,d:"Strogonoff de pollo con champiñones frescos, arroz integral o blanco con vegetales y papa rústica limón pepper.",t:["star"]},
 M:{n:"Pollo con garbanzo y champiñones",g:330,d:"Pollo grillado, garbanzo con champiñones frescos y puré de batata dulce."},
 N:{n:"Strogonoff de carne",g:340,d:"Strogonoff de carne con champiñones frescos, arroz integral o blanco y papa rústica limón pepper.",t:["star"]},
 O:{n:"Tilapia a la moqueca",g:280,d:"Tilapia grillada con salsa de moqueca y puré de batata dulce.",t:["star"]},
 P:{n:"Muslo grillado con garbanzo",g:340,d:"Muslo deshuesado grillado, arroz falso de coliflor con brócoli y zanahoria, y garbanzo con champiñones frescos."},
 Q:{n:"Salmón grillado",g:340,d:"Salmón grillado, puré de batata dulce y brócoli al vapor con ensalada.",t:["star"]},
 R:{n:"Pollo con lenteja al curry",g:330,d:"Pollo grillado, lenteja al curry y puré de batata dulce."},
 S:{n:"Pollo grillado con zuchini",g:310,d:"Pollo grillado, puré de batata dulce o de papa y zuchini, tomate cherry y orégano."},
 T:{n:"Bobó de pollo",g:340,d:"Bobó de pollo, arroz blanco y brócoli al vapor.",t:["star"]},
 V9:{n:"Açaí con banana",d:"Açaí cremoso en capas con crema y rodajas de banana.",t:["star"]},
 V7:{n:"Copa de açaí con maní",d:"Açaí batido con hilos de crema blanca, coronado con maní picado.",t:["star"]},
 V11:{n:"Pote de açaí para llevar",d:"Açaí cremoso en pote cerrado, listo para llevar a casa."},
 V12:{n:"Brownie con açaí y maní",d:"Brownie de chocolate con bocha de açaí, maní picado y salsa de chocolate."},
 V8:{n:"Tapioca de jamón y queso",d:"Tapioca de mandioca rellena con queso derretido y jamón."},
 V1:{n:"Tapioca de frutilla y chocolate",d:"Tapioca dulce con frutillas frescas, chocolate rallado y salsa de chocolate."},
 V5:{n:"Crepioca de pollo",d:"Crepioca de huevo y tapioca con chía, rellena de pollo desmenuzado y queso cremoso."},
 V2:{n:"Ensalada de palmito",d:"Mix de lechugas, rúcula, tomate cherry, cebolla morada y palmito."},
 V3:{n:"Volcán de chocolate",d:"Torta de chocolate húmeda con centro y cobertura de chocolate derretido.",t:["star"]},
 V4:{n:"Torta con cobertura de chocolate",d:"Bizcochuelo casero bañado en cobertura de chocolate."},
 V6:{n:"Brownie con helado de açaí",d:"Brownie de chocolate con bocha de açaí y salsa de chocolate."},
 V10:{n:"Bloom Sparkling Energy",d:"Bebida energética gasificada con cafeína y vitaminas B, 0 g de azúcar. Sabores surtidos.",t:["new"]},
 U:{n:"Muslo grillado con zapallo",g:350,d:"Muslo deshuesado grillado, arroz falso de coliflor con brócoli y zanahoria, y zapallo."},
};
// [nome, descrição] em português e inglês
const TR={
 A:{pt:["Carne moída com abóbora","Carne moída com vagem e cenoura, arroz branco ou integral e abóbora."],en:["Ground beef with squash","Ground beef with green beans and carrot, white or brown rice and squash."]},
 B:{pt:["Frango grelhado com batata rústica","Frango grelhado, arroz branco ou integral com legumes e batata rústica com lemon pepper."],en:["Grilled chicken with rustic potatoes","Grilled chicken, white or brown rice with vegetables and rustic potatoes with lemon pepper."]},
 C:{pt:["Carne de panela com feijão preto","Carne de panela, arroz branco ou integral e feijão preto."],en:["Pot roast with black beans","Pot roast, white or brown rice and black beans."]},
 D:{pt:["Frango grelhado com purê e brócolis","Frango grelhado, purê de batata-doce ou purê de batata e brócolis no vapor."],en:["Grilled chicken with mash and broccoli","Grilled chicken, sweet potato mash or mashed potatoes and steamed broccoli."]},
 E:{pt:["Frango grelhado com feijão e salada","Frango grelhado, arroz branco ou integral, feijão (carioca ou preto) e brócolis no vapor com salada."],en:["Grilled chicken with beans and salad","Grilled chicken, white or brown rice, beans (feijão carioca or black) and steamed broccoli with salad."]},
 F:{pt:["Caldo de mandioca","Caldo de mandioca com carne magra."],en:["Cassava broth","Cassava broth with lean beef."]},
 G:{pt:["Carne de panela com feijão carioca","Carne de panela, arroz branco ou integral e feijão carioca."],en:["Pot roast with feijão carioca","Pot roast, white or brown rice and beans (feijão carioca)."]},
 H:{pt:["Canja — caldo de frango","Caldo de frango com arroz integral, cenoura e batata."],en:["Canja — chicken broth","Chicken broth with brown rice, carrot and potato."]},
 I:{pt:["Tilápia grelhada com purê","Tilápia grelhada, arroz branco ou integral com legumes e purê de batata."],en:["Grilled tilapia with mash","Grilled tilapia, white or brown rice with vegetables and mashed potatoes."]},
 J:{pt:["Carne de panela com purê","Carne de panela, arroz branco ou integral com legumes e purê de batata."],en:["Pot roast with mash","Pot roast, white or brown rice with vegetables and mashed potatoes."]},
 K:{pt:["Carne moída com lentilha ao curry","Carne moída com vagem e cenoura, arroz branco ou integral e lentilha ao curry."],en:["Ground beef with curried lentils","Ground beef with green beans and carrot, white or brown rice and curried lentils."]},
 L:{pt:["Strogonoff de frango","Strogonoff de frango com champignon fresco, arroz integral ou branco com legumes e batata rústica lemon pepper."],en:["Chicken Strogonoff","Chicken Strogonoff with fresh mushrooms, brown or white rice with vegetables and lemon pepper rustic potatoes."]},
 M:{pt:["Frango com grão-de-bico e champignon","Frango grelhado, grão-de-bico com champignon fresco e purê de batata-doce."],en:["Chicken with chickpeas and mushrooms","Grilled chicken, chickpeas with fresh mushrooms and sweet potato mash."]},
 N:{pt:["Strogonoff de carne","Strogonoff de carne com champignon fresco, arroz integral ou branco e batata rústica lemon pepper."],en:["Beef Strogonoff","Beef Strogonoff with fresh mushrooms, brown or white rice and lemon pepper rustic potatoes."]},
 O:{pt:["Tilápia à moqueca","Tilápia grelhada com molho de moqueca e purê de batata-doce."],en:["Tilapia Moqueca","Grilled tilapia with Moqueca sauce and sweet potato mash."]},
 P:{pt:["Sobrecoxa grelhada com grão-de-bico","Sobrecoxa desossada grelhada, arroz de couve-flor com brócolis e cenoura, e grão-de-bico com champignon fresco."],en:["Grilled chicken thigh with chickpeas","Grilled boneless chicken thigh, cauliflower rice with broccoli and carrot, and chickpeas with fresh mushrooms."]},
 Q:{pt:["Salmão grelhado","Salmão grelhado, purê de batata-doce e brócolis no vapor com salada."],en:["Grilled salmon","Grilled salmon, sweet potato mash and steamed broccoli with salad."]},
 R:{pt:["Frango com lentilha ao curry","Frango grelhado, lentilha ao curry e purê de batata-doce."],en:["Chicken with curried lentils","Grilled chicken, curried lentils and sweet potato mash."]},
 S:{pt:["Frango grelhado com abobrinha","Frango grelhado, purê de batata-doce ou de batata e abobrinha, tomate-cereja e orégano."],en:["Grilled chicken with zucchini","Grilled chicken, sweet potato or mashed potatoes and zucchini, cherry tomatoes and oregano."]},
 T:{pt:["Bobó de frango","Bobó de frango, arroz branco e brócolis no vapor."],en:["Chicken Bobó","Chicken Bobó, white rice and steamed broccoli."]},
 U:{pt:["Sobrecoxa grelhada com abóbora","Sobrecoxa desossada grelhada, arroz de couve-flor com brócolis e cenoura, e abóbora."],en:["Grilled chicken thigh with squash","Grilled boneless chicken thigh, cauliflower rice with broccoli and carrot, and squash."]},
 V9:{pt:["Açaí com banana","Açaí cremoso em camadas com creme e rodelas de banana."],en:["Açaí with banana","Creamy layered Açaí with cream and banana slices."]},
 V7:{pt:["Taça de açaí com amendoim","Açaí batido com fios de creme branco, coberto com amendoim picado."],en:["Açaí cup with peanuts","Blended Açaí with swirls of white cream, topped with chopped peanuts."]},
 V11:{pt:["Pote de açaí para viagem","Açaí cremoso em pote fechado, pronto para levar para casa."],en:["Açaí tub to go","Creamy Açaí in a sealed tub, ready to take home."]},
 V12:{pt:["Brownie com açaí e amendoim","Brownie de chocolate com bola de açaí, amendoim picado e calda de chocolate."],en:["Brownie with Açaí and peanuts","Chocolate brownie with a scoop of Açaí, chopped peanuts and chocolate sauce."]},
 V8:{pt:["Tapioca de presunto e queijo","Tapioca de mandioca recheada com queijo derretido e presunto."],en:["Ham and cheese Tapioca","Cassava Tapioca filled with melted cheese and ham."]},
 V1:{pt:["Tapioca de morango e chocolate","Tapioca doce com morangos frescos, chocolate ralado e calda de chocolate."],en:["Strawberry and chocolate Tapioca","Sweet Tapioca with fresh strawberries, grated chocolate and chocolate sauce."]},
 V5:{pt:["Crepioca de frango","Crepioca de ovo e tapioca com chia, recheada com frango desfiado e queijo cremoso."],en:["Chicken Crepioca","Egg and Tapioca Crepioca with chia, filled with shredded chicken and cream cheese."]},
 V2:{pt:["Salada de palmito","Mix de alfaces, rúcula, tomate-cereja, cebola roxa e palmito."],en:["Hearts of palm salad","Mixed lettuce, arugula, cherry tomatoes, red onion and hearts of palm."]},
 V3:{pt:["Vulcão de chocolate","Bolo de chocolate úmido com recheio e cobertura de chocolate derretido."],en:["Chocolate volcano","Moist chocolate cake with a molten center and melted chocolate topping."]},
 V4:{pt:["Bolo com cobertura de chocolate","Pão de ló caseiro banhado em cobertura de chocolate."],en:["Chocolate-frosted cake","Homemade sponge cake covered in chocolate frosting."]},
 V6:{pt:["Brownie com sorvete de açaí","Brownie de chocolate com bola de açaí e calda de chocolate."],en:["Brownie with Açaí ice cream","Chocolate brownie with a scoop of Açaí and chocolate sauce."]},
 V10:{pt:["Bloom Sparkling Energy","Bebida energética gaseificada com cafeína e vitaminas B, 0 g de açúcar. Sabores variados."],en:["Bloom Sparkling Energy","Sparkling energy drink with caffeine and B vitamins, 0 g sugar. Assorted flavors."]},
};
const CATS=[
 {id:"acai",nome:{es:"Açaí",pt:"Açaí",en:"Açaí"},note:{es:"Cremoso, bien frío y con toppings",pt:"Cremoso, bem gelado e com toppings",en:"Creamy, ice-cold and with toppings"},ids:["V9","V7","V11"]},
 {id:"pollo",nome:{es:"Pollo",pt:"Frango",en:"Chicken"},note:{es:"Grillado, strogonoff y bobó",pt:"Grelhado, strogonoff e bobó",en:"Grilled, Strogonoff and Bobó"},ids:[..."LTDBESMRPU"]},
 {id:"carnes",nome:{es:"Carnes",pt:"Carnes",en:"Beef"},note:{es:"A la olla, molida y strogonoff",pt:"Na panela, moída e strogonoff",en:"Pot roast, ground beef and Strogonoff"},ids:[..."NJCGAK"]},
 {id:"pescados",nome:{es:"Pescados",pt:"Peixes",en:"Fish"},note:{es:"Tilapia y salmón grillados",pt:"Tilápia e salmão grelhados",en:"Grilled tilapia and salmon"},ids:[..."OQI"]},
 {id:"caldos",nome:{es:"Caldos",pt:"Caldos",en:"Broths"},note:{es:"Calientes y reconfortantes",pt:"Quentes e reconfortantes",en:"Hot and comforting"},ids:[..."FH"]},
 {id:"tapiocas",nome:{es:"Tapiocas y crepiocas",pt:"Tapiocas e crepiocas",en:"Tapiocas & crepiocas"},note:{es:"Dulces y saladas",pt:"Doces e salgadas",en:"Sweet and savory"},ids:["V8","V5","V1"]},
 {id:"ensaladas",nome:{es:"Ensaladas",pt:"Saladas",en:"Salads"},note:{es:"Frescas y livianas",pt:"Frescas e leves",en:"Fresh and light"},ids:["V2"]},
 {id:"postres",nome:{es:"Postres",pt:"Sobremesas",en:"Desserts"},note:{es:"Para cerrar con algo dulce",pt:"Para fechar com um docinho",en:"A sweet way to finish"},ids:["V3","V12","V6","V4"]},
 {id:"bebidas",nome:{es:"Bebidas",pt:"Bebidas",en:"Drinks"},note:{es:"Novedad en nuestras tiendas",pt:"Novidade nas nossas lojas",en:"New in our stores"},ids:["V10"]},
];
const COMBOS=[
 {n:"Combo 1",ids:"ABCDE",old:177000,p:168000},
 {n:"Combo 2",ids:"CFGHD",old:160000,p:152000},
 {n:"Combo 3",ids:"IJKLM",old:209000,p:198000},
 {n:"Combo 6",ids:"NOPQR",old:252000,p:239000},
 {n:"Combo 7",ids:"JONLJ",old:213000,p:200000},
 {n:"Combo 8",ids:"LSNOJ",old:207000,p:195000},
 {n:"Combo 9",ids:"FRLTN",old:192000,p:180000},
 {n:"Combo 10",ids:"TFLUJ",old:203000,p:190000},
];
const gs=v=>"Gs. "+v.toLocaleString("es-PY").replace(/,/g,".");
// idioma salvo, senão o do celular, senão espanhol
let L=(()=>{try{const s=localStorage.getItem("uacai-lang"); if(LANGS.includes(s)) return s;}catch(e){} return (navigator.languages||[navigator.language]).map(x=>String(x).slice(0,2)).find(x=>LANGS.includes(x))||"es";})();
const T=k=>UI[L][k], N=c=>c.nome[L];
const nm=k=>L==="es"?D[k].n:TR[k][L][0], ds=k=>L==="es"?D[k].d:TR[k][L][1];
const $=s=>document.querySelector(s), app=document.getElementById("app");
const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE_OUT="cubic-bezier(.23,1,.32,1)";
// com a moldura do desktop (zoom), as medidas da tela vêm escaladas: divide para voltar a px do elemento
const zoomOf=()=>parseFloat(document.getElementById("device").style.zoom)||1;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
for(const k in D){D[k].key=k; D[k].t=D[k].t||[];}
console.assert(Object.keys(D).every(k=>TR[k]&&TR[k].pt&&TR[k].en),"tradução faltando");
// a foto é um botão de verdade (abre o visualizador pelo teclado); a <img> é decorativa porque o nome está no rótulo
const zoomBtn=(k,cls)=>`<button type="button" class="${cls}" data-zoom="${k}" aria-label="${esc(T("photo"))}: ${esc(nm(k))}"><img src="img/${k}.jpg" alt="" width="600" height="600" loading="lazy" decoding="async"></button>`;
const tagsHTML=it=>(it.g?`<span class="t g">${it.g} g</span>`:"")+it.t.map(t=>`<span class="t ${t}">${esc(T(t))}</span>`).join("");

function renderChips(){const ch=$("#chips"); ch.innerHTML="";
  [{id:"combos",nome:{[L]:T("combos")}},...CATS].forEach((c,i)=>{const b=document.createElement("button"); b.className="chip"+(i===0?" active":""); b.textContent=N(c); b.dataset.id=c.id;
  b.onclick=()=>{const el=document.getElementById(c.id); if(el) app.scrollTo({top:el.offsetTop-$(".sticky").offsetHeight-$(".sb-bg").offsetHeight+2,behavior:reduced()?"auto":"smooth"});};
  ch.appendChild(b);});}

// a busca usa o idioma escolhido (nome e descrição traduzidos)
function render(){const q=$("#q").value.trim().toLowerCase(), menu=$("#menu"); menu.innerHTML=""; let shown=0;
 const has=s=>!q||s.toLowerCase().includes(q);
 if(!q){const f=document.createElement("div"); f.className="feat";
  const top=Object.keys(D).filter(k=>D[k].t.includes("star")).sort((a,b)=>(b[0]==="V")-(a[0]==="V"));
  f.innerHTML=`<div class="feat-h"><h2 id="featTitle">${esc(T("top"))}</h2></div><div class="rail" role="region" aria-roledescription="${esc(T("carousel"))}" aria-labelledby="featTitle">${top.map((k,i)=>`<article class="fcard" role="group" aria-roledescription="slide" aria-label="${i+1} ${esc(T("of"))} ${top.length}"><div class="fimg">${zoomBtn(k,"zoom")}<div class="fn">${esc(nm(k))}${D[k].g?`<span class="fd">${D[k].g} g</span>`:""}</div></div></article>`).join("")}</div>`;
  menu.appendChild(f);}
 const cl=COMBOS.filter(c=>has(c.n+" "+[...c.ids].map(nm).join(" ")));
 if(cl.length){const s=document.createElement("section"); s.className="cat"; s.id="combos";
  s.innerHTML=`<div class="cat-h"><h2>${esc(T("combos"))}</h2></div><p class="note">${esc(T("combosNote"))}</p>`;
  cl.forEach(c=>{shown++; const d=document.createElement("article"); d.className="item combo";
   d.innerHTML=`<div class="collage">${[...c.ids].slice(0,4).map(k=>zoomBtn(k,"cz")).join("")}</div>
   <div class="cbody"><div class="n">${esc(c.n)}</div>
   <ol class="clist">${[...c.ids].map(k=>`<li>${zoomBtn(k,"zbtn")}${esc(nm(k))} <em>${D[k].g} g</em></li>`).join("")}</ol>
   <div class="price"><s>${gs(c.old)}</s><strong>${gs(c.p)}</strong><small>${esc(T("avg"))}: ${gs(c.p/5)}</small></div></div>`;
   s.appendChild(d);});
  menu.appendChild(s);}
 CATS.forEach(c=>{const list=c.ids.filter(k=>has(nm(k)+" "+ds(k)));
  if(!list.length) return;
  const s=document.createElement("section"); s.className="cat"; s.id=c.id;
  s.innerHTML=`<div class="cat-h"><h2>${esc(N(c))}</h2></div><p class="note">${esc(c.note[L])}</p>`;
  list.forEach(k=>{shown++; const d=document.createElement("article"); d.className="item";
   d.innerHTML=`${zoomBtn(k,"pic")}<div class="info"><div class="n">${esc(nm(k))}</div><p class="d">${esc(ds(k))}</p><div class="tags">${tagsHTML(D[k])}</div></div>`;
   s.appendChild(d);});
  menu.appendChild(s);});
 $("#empty").style.display=shown?"none":"block";}
// visualizador como camada modal (anatomia do Dialog do shadcn): fechado = inert; aberto = fundo inert, foco preso, foco devolvido a quem abriu
const viewer=$("#viewer"), isOpen=()=>viewer.classList.contains("show");
const tabbables=root=>[...root.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')].filter(e=>e.getClientRects().length);
function openLayer(){viewer._ret=document.activeElement; viewer.inert=false; viewer.classList.add("show"); app.inert=true;
 requestAnimationFrame(()=>$("#vClose").focus({preventScroll:true}));}
function closeLayer(){if(!isOpen()) return; viewer.classList.remove("show"); viewer.inert=true; app.inert=false;
 const back=viewer._ret; (back&&back.isConnected?back:$("#q")).focus({preventScroll:true});}
document.addEventListener("keydown",e=>{if(!isOpen()) return;
 if(e.key==="Escape"){e.preventDefault(); closeV(); return;}
 if(e.key==="ArrowRight"){e.preventDefault(); $("#vNext").click();} if(e.key==="ArrowLeft"){e.preventDefault(); $("#vPrev").click();}
 if(e.key==="Tab"){const f=tabbables(viewer); if(!f.length) return; const a=f[0], z=f[f.length-1];  // foco preso dentro do visualizador
  if(e.shiftKey&&(document.activeElement===a||!viewer.contains(document.activeElement))){e.preventDefault(); z.focus();}
  else if(!e.shiftKey&&(document.activeElement===z||!viewer.contains(document.activeElement))){e.preventDefault(); a.focus();}}});
$("#q").addEventListener("input",render);
// carrossel dos destaques: ← → rolam um card quando o foco está nele
$("#menu").addEventListener("keydown",e=>{const rail=e.target.closest(".rail"); if(!rail||(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")) return;
 e.preventDefault(); const cards=[...rail.querySelectorAll(".fcard")], i=cards.findIndex(c=>c.contains(document.activeElement)), j=Math.max(0,Math.min(cards.length-1,i+(e.key==="ArrowRight"?1:-1)));
 cards[j].querySelector(".zoom").focus(); cards[j].scrollIntoView({inline:"start",block:"nearest",behavior:reduced()?"auto":"smooth"});});
// grupo de idioma (Toggle Group): ← → movem o foco entre ES, PT e EN
$("#lang").addEventListener("keydown",e=>{if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft") return; const b=[...$("#lang").querySelectorAll("button")], i=b.indexOf(document.activeElement); if(i<0) return; e.preventDefault(); b[(i+(e.key==="ArrowRight"?1:-1)+b.length)%b.length].focus();});
let vList=[], vIdx=0;
function showV(){const k=vList[vIdx]; $("#vImg").src="img/"+k+".jpg"; $("#vImg").alt=nm(k); $("#vName").textContent=nm(k); $("#vDesc").textContent=ds(k); $("#vG").textContent=D[k].g?D[k].g+" g":"";
 $(".vnav").style.display=vList.length>1?"flex":"none";}
// FLIP: anima a foto do visualizador a partir (ou de volta) do retângulo da miniatura
function flip(img,rect,dir){const to=img.getBoundingClientRect(), z=zoomOf();
 const t=`translate(${(rect.left+rect.width/2-(to.left+to.width/2))/z}px,${(rect.top+rect.height/2-(to.top+to.height/2))/z}px) scale(${rect.width/to.width})`;
 return img.animate(dir>0?[{transform:t,opacity:.6},{transform:"none",opacity:1}]:[{transform:"none",opacity:1},{transform:t,opacity:.4}],{duration:dir>0?280:200,easing:EASE_OUT,fill:"forwards"});}
const thumbOf=k=>{const vis=app.getBoundingClientRect(); return [...document.querySelectorAll(`#menu [data-zoom="${k}"]`)].find(e=>{const b=e.getBoundingClientRect(); return b.width&&b.bottom>vis.top+60&&b.top<vis.bottom;});};
function openV(k,from){vList=[...new Set([...document.querySelectorAll("#menu [data-zoom]")].map(e=>e.dataset.zoom))]; vIdx=Math.max(0,vList.indexOf(k)); showV(); openLayer();
 if(from&&!reduced()) flip($("#vImg"),from.getBoundingClientRect(),1);}
let vClosing=false;
function closeV(){if(!isOpen()||vClosing) return; const img=$("#vImg"), th=thumbOf(vList[vIdx]);
 const done=()=>{vClosing=false; img.getAnimations().forEach(a=>a.cancel()); closeLayer();};
 if(th&&!reduced()){vClosing=true; flip(img,th.getBoundingClientRect(),-1).finished.then(done,done);} else done();}
$("#menu").addEventListener("click",e=>{const z=e.target.closest("[data-zoom]"); if(z) openV(z.dataset.zoom,z);});
$("#vClose").onclick=closeV;
viewer.onclick=e=>{if(e.target===viewer) closeV();};
// troca de foto com deslize lateral: a atual sai para um lado, a nova entra do outro
function step(dir,fromX){const img=$("#vImg"); img.getAnimations().forEach(a=>a.cancel()); vIdx=(vIdx+dir+vList.length)%vList.length;
 if(reduced()){img.style.transform=""; showV(); return;}
 const w=img.getBoundingClientRect().width/zoomOf();
 img.animate([{transform:`translateX(${fromX||0}px)`,opacity:1},{transform:`translateX(${-dir*w*.4}px)`,opacity:0}],{duration:140,easing:"cubic-bezier(.4,0,1,1)"}).finished.then(()=>{img.style.transform=""; showV();
  img.animate([{transform:`translateX(${dir*w*.4}px)`,opacity:0},{transform:"none",opacity:1}],{duration:220,easing:EASE_OUT});});}
$("#vPrev").onclick=()=>step(-1);
$("#vNext").onclick=()=>step(1);
// swipe no visualizador: a foto segue o dedo; troca por distância (60 px) ou velocidade (0,11 px/ms), senão volta
{let x0=null,t0=0,dx=0,id=null; const img=$("#vImg");
 img.addEventListener("pointerdown",e=>{if(id!==null||vList.length<2) return; id=e.pointerId; x0=e.clientX; t0=performance.now(); dx=0; img.setPointerCapture(id); img.getAnimations().forEach(a=>a.cancel());});
 img.addEventListener("pointermove",e=>{if(e.pointerId!==id) return; dx=(e.clientX-x0)/zoomOf(); img.style.transform=`translateX(${dx}px)`; img.style.opacity=String(1-Math.min(.4,Math.abs(dx)/600));});
 const end=e=>{if(e.pointerId!==id) return; id=null; const v=Math.abs(dx)/Math.max(1,performance.now()-t0); img.style.opacity="";
  if(Math.abs(dx)>60||(Math.abs(dx)>16&&v>.11)) step(dx<0?1:-1,dx);
  else{const from=dx; img.style.transform=""; if(from&&!reduced()) img.animate([{transform:`translateX(${from}px)`},{transform:"none"}],{duration:220,easing:EASE_OUT});}
  dx=0;};
 img.addEventListener("pointerup",end); img.addEventListener("pointercancel",end);}
app.addEventListener("scroll",()=>{const top=app.getBoundingClientRect().top, off=$(".sticky").offsetHeight+$(".sb-bg").offsetHeight+30; let cur=null;
 document.querySelectorAll("section.cat").forEach(s=>{if(s.getBoundingClientRect().top-top-off<=0) cur=s.id;}); if(!cur){const f=document.querySelector("section.cat"); cur=f&&f.id;}
 const secs=document.querySelectorAll("section.cat"); if(secs.length&&app.scrollTop+app.clientHeight>=app.scrollHeight-2) cur=secs[secs.length-1].id; // no fim da rolagem a última seção não chega ao topo: ela fica ativa
 document.querySelectorAll(".chip[data-id]").forEach(c=>{const a=c.dataset.id===cur; if(a&&!c.classList.contains("active")){const ch=$("#chips"); ch.scrollTo({left:c.offsetLeft-ch.clientWidth/2+c.offsetWidth/2,behavior:reduced()?"auto":"smooth"});} c.classList.toggle("active",a);});},{passive:true});
function setLang(l){L=l; try{localStorage.setItem("uacai-lang",l);}catch(e){}
 document.documentElement.lang=l;
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=T(el.dataset.i18n));
 document.querySelectorAll("[data-i18n-ph]").forEach(el=>el.placeholder=T(el.dataset.i18nPh));
 document.querySelectorAll("[data-i18n-aria]").forEach(el=>el.setAttribute("aria-label",T(el.dataset.i18nAria)));
 $("#lang").querySelectorAll("button").forEach(b=>{b.classList.toggle("on",b.dataset.l===l); b.setAttribute("aria-pressed",b.dataset.l===l);});
 renderChips(); render(); if(isOpen()) showV();}
LANGS.forEach(l=>{const b=document.createElement("button"); b.textContent=l.toUpperCase(); b.dataset.l=l; b.onclick=()=>setLang(l); $("#lang").appendChild(b);});
setLang(L);
// moldura do iPhone no desktop: encolhe para caber na altura da janela
const frameMQ=matchMedia('(min-width:760px) and (min-height:720px)');
const fitFrame=()=>{document.getElementById('device').style.zoom=frameMQ.matches?Math.min(1,(innerHeight-24)/876).toFixed(3):'';};
fitFrame(); addEventListener('resize',fitFrame);
(function tick(){const d=new Date(); $("#clock").textContent=d.getHours()+":"+String(d.getMinutes()).padStart(2,"0"); setTimeout(tick,30000);})();
