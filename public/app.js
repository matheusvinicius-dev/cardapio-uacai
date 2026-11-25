// UAÇAÍ · carta digital com pedido pela mesa. Dados (UI, D, TR, CATS) no topo; preços e combos vêm de catalogo.js.
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
// COMBOS, PRECOS e CATALOGO vêm de catalogo.js (o servidor lê o mesmo arquivo)
for(const k in PRECOS) if(D[k]) D[k].p=PRECOS[k];
const gs=v=>"Gs. "+Math.round(v).toLocaleString("es-PY").replace(/,/g,".");

/* ===== textos das telas novas ===== */
Object.assign(UI.es,{more:"Más opciones",order:"Tu pedido",view:"Ver pedido",my:"Mis pedidos",add:"Añadir",rm:"Quitar",
 mesa:"Mesa",change:"Cambiar",pickT:"¿En qué mesa estás?",pickS:"El número está en la placa del código QR.",cancel:"Cancelar",
 notesL:"Observaciones",notes:"Ej.: arroz integral, puré de batata…",total:"Total",send:"Enviar pedido a la recepción",
 sending:"Enviando…",clear:"Vaciar pedido",emptyBag:"Tu pedido está vacío. Tocá + en un plato para empezar.",
 sentT:"¡Pedido enviado!",sentS:"La recepción ya lo recibió.",cont:"Seguir pidiendo",noneYet:"Todavía no enviaste ningún pedido.",
 st_novo:"Recibido",st_preparo:"En preparación",st_pronto:"Listo, va a tu mesa",st_entregue:"Entregado",
 pay:"Pedir la cuenta",payDone:"Listo: la recepción ya viene a tu mesa.",
 area:"Área de la tienda",areaS:"Solo para el equipo · pide contraseña",email:"Correo electrónico",pass:"Contraseña",
 enter:"Entrar",entering:"Entrando…",wrong:"Correo o contraseña incorrectos.",
 failNet:"No pudimos hablar con la recepción. Probá de nuevo.",pickFirst:"Elegí tu mesa para enviar el pedido.",
 locked:"mesa fijada",wrongMesa:"¿Mesa equivocada? Llamá a la recepción.",
 acaiT:"¿Te vendría bien un açaí ahora?",acaiS:"Tu pedido tiene platos salados. Un açaí cierra la comida.",
 acaiYes:"Enviar con açaí",acaiJust:"Enviar el pedido",acaiNo:"No, gracias",cats:"Categorías"});
Object.assign(UI.pt,{more:"Mais opções",order:"Seu pedido",view:"Ver pedido",my:"Meus pedidos",add:"Adicionar",rm:"Remover",
 mesa:"Mesa",change:"Trocar",pickT:"Em qual mesa você está?",pickS:"O número está na plaquinha do QR Code.",cancel:"Cancelar",
 notesL:"Observações",notes:"Ex.: arroz integral, purê de batata-doce…",total:"Total",send:"Enviar pedido para a recepção",
 sending:"Enviando…",clear:"Limpar pedido",emptyBag:"Seu pedido está vazio. Toque em + num prato para começar.",
 sentT:"Pedido enviado!",sentS:"A recepção já recebeu.",cont:"Continuar pedindo",noneYet:"Você ainda não enviou nenhum pedido.",
 st_novo:"Recebido",st_preparo:"Em preparo",st_pronto:"Pronto, indo para a mesa",st_entregue:"Entregue",
 pay:"Pedir a conta",payDone:"Pronto: a recepção já vem até a sua mesa.",
 area:"Área da loja",areaS:"Só para a equipe · pede senha",email:"E-mail",pass:"Senha",
 enter:"Entrar",entering:"Entrando…",wrong:"E-mail ou senha incorretos.",
 failNet:"Não deu para falar com a recepção. Tente de novo.",pickFirst:"Escolha a sua mesa para enviar o pedido.",
 locked:"mesa travada",wrongMesa:"Mesa errada? Chame a recepção.",
 acaiT:"Cairia bem um açaí agora?",acaiS:"Seu pedido tem pratos salgados. Um açaí fecha a refeição.",
 acaiYes:"Enviar com açaí",acaiJust:"Enviar o pedido",acaiNo:"Não, obrigado",cats:"Categorias"});
Object.assign(UI.en,{more:"More options",order:"Your order",view:"View order",my:"My orders",add:"Add",rm:"Remove",
 mesa:"Table",change:"Change",pickT:"Which table are you at?",pickS:"The number is on the QR code sign.",cancel:"Cancel",
 notesL:"Notes",notes:"e.g. brown rice, sweet potato mash…",total:"Total",send:"Send order to the counter",
 sending:"Sending…",clear:"Empty order",emptyBag:"Your order is empty. Tap + on a dish to start.",
 sentT:"Order sent!",sentS:"The counter has it.",cont:"Keep ordering",noneYet:"You haven't sent an order yet.",
 st_novo:"Received",st_preparo:"Being prepared",st_pronto:"Ready, on its way",st_entregue:"Delivered",
 pay:"Ask for the bill",payDone:"Done: someone is on the way to your table.",
 area:"Staff area",areaS:"Team only · asks for a password",email:"Email",pass:"Password",
 enter:"Sign in",entering:"Signing in…",wrong:"Wrong email or password.",
 failNet:"We couldn't reach the counter. Try again.",pickFirst:"Pick your table to send the order.",
 locked:"table locked",wrongMesa:"Wrong table? Ask the counter.",
 acaiT:"How about an açaí now?",acaiS:"Your order has savory dishes. An açaí rounds off the meal.",
 acaiYes:"Send with açaí",acaiJust:"Send the order",acaiNo:"No, thanks",cats:"Categories"});

// idioma salvo, senão o do celular, senão espanhol
let L=(()=>{try{const s=localStorage.getItem("uacai-lang"); if(LANGS.includes(s)) return s;}catch(e){} return (navigator.languages||[navigator.language]).map(x=>String(x).slice(0,2)).find(x=>LANGS.includes(x))||"es";})();
const T=k=>UI[L][k], N=c=>c.nome[L];
const nm=k=>L==="es"?D[k].n:TR[k][L][0], ds=k=>L==="es"?D[k].d:TR[k][L][1];
const $=s=>document.querySelector(s), app=document.getElementById("app"), bar=document.getElementById("bar");
const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
// A partir de 1024px o cardápio é um site de computador: sem moldura e com o painel do pedido
// fixo à direita. Aí o painel não é mais um diálogo, então não entra na pilha de camadas.
const deskMQ=matchMedia("(min-width:1024px)");
const desk=()=>deskMQ.matches&&document.getElementById("loja").hidden;
const EASE_OUT="cubic-bezier(.23,1,.32,1)";
// com a moldura do desktop (zoom), as medidas da tela vêm escaladas: divide para voltar a px do elemento
const zoomOf=()=>parseFloat(document.getElementById("device").style.zoom)||1;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
for(const k in D){D[k].key=k; D[k].t=D[k].t||[];}
const combo=k=>COMBOS.find(c=>c.key===k);
// nome legível de qualquer chave do catálogo, prato ou combo
const nomeDe=k=>combo(k)?combo(k).n:(D[k]?nm(k):k);
const precoDe=k=>CATALOGO[k]||0;
console.assert(Object.keys(D).every(k=>TR[k]&&TR[k].pt&&TR[k].en),"tradução faltando");
console.assert(Object.keys(D).every(k=>PRECOS[k]>0),"preço faltando");

/* ===== CARTA ===== */
// a foto é um botão de verdade (abre o visualizador pelo teclado); a <img> é decorativa porque o nome está no rótulo
const zoomBtn=(k,cls)=>`<button type="button" class="${cls}" data-zoom="${k}" aria-label="${esc(T("photo"))}: ${esc(nm(k))}"><img src="img/${k}.jpg" alt="" width="600" height="600" loading="lazy" decoding="async"></button>`;
const tagsHTML=it=>(it.p?`<span class="t pr">${gs(it.p)}</span>`:"")+(it.g?`<span class="t g">${it.g} g</span>`:"")+it.t.map(t=>`<span class="t ${t}">${esc(T(t))}</span>`).join("");
const ctrlHTML=k=>{const n=cesta[k]||0, rot=esc(nomeDe(k));
 return n?`<div class="stepper"><button type="button" data-d="1" data-k="${k}" aria-label="${esc(T("add"))}: ${rot}">+</button><span aria-hidden="true">${n}</span><button type="button" data-d="-1" data-k="${k}" aria-label="${esc(T("rm"))}: ${rot}">−</button></div>`
       :`<button type="button" class="plus" data-d="1" data-k="${k}" aria-label="${esc(T("add"))}: ${rot}">+</button>`;};

// quanto a busca e as categorias cobrem do topo: no celular a barra fica em cima do conteúdo,
// no computador ela é uma coluna ao lado e só precisa de uma folga
const topoFixo=()=>desk()?20:$(".sticky").offsetHeight+$(".sb-bg").offsetHeight;
function renderChips(){const ch=$("#chips"); ch.innerHTML="";
  [{id:"combos",nome:{[L]:T("combos")}},...CATS].forEach((c,i)=>{const b=document.createElement("button"); b.className="chip"+(i===0?" active":""); b.textContent=N(c); b.dataset.id=c.id;
  b.onclick=()=>{const el=document.getElementById(c.id); if(el) app.scrollTo({top:el.offsetTop-topoFixo()+2,behavior:reduced()?"auto":"smooth"});};
  ch.appendChild(b);});}

// a busca usa o idioma escolhido (nome e descrição traduzidos)
function render(){const q=$("#q").value.trim().toLowerCase(), menu=$("#menu"); menu.innerHTML=""; let shown=0;
 const has=s=>!q||s.toLowerCase().includes(q);
 if(!q){const f=document.createElement("div"); f.className="feat";
  const top=Object.keys(D).filter(k=>D[k].t.includes("star")).sort((a,b)=>(b[0]==="V")-(a[0]==="V"));
  f.innerHTML=`<div class="feat-h"><h2 id="featTitle">${esc(T("top"))}</h2></div><div class="rail" role="region" aria-roledescription="${esc(T("carousel"))}" aria-labelledby="featTitle">${top.map((k,i)=>`<article class="fcard" role="group" aria-roledescription="slide" aria-label="${i+1} ${esc(T("of"))} ${top.length}"><div class="fimg">${zoomBtn(k,"zoom")}<div class="fn">${esc(nm(k))}${D[k].g?`<span class="fd">${D[k].g} g</span>`:""}</div><div class="ctrl ctrl-f" data-k="${k}"></div></div></article>`).join("")}</div>`;
  menu.appendChild(f);}
 const cl=COMBOS.filter(c=>has(c.n+" "+[...c.ids].map(nm).join(" ")));
 if(cl.length){const s=document.createElement("section"); s.className="cat"; s.id="combos";
  s.innerHTML=`<div class="cat-h"><h2>${esc(T("combos"))}</h2></div><p class="note">${esc(T("combosNote"))}</p>`;
  cl.forEach(c=>{shown++; const d=document.createElement("article"); d.className="item combo"; d.dataset.k=c.key;
   d.innerHTML=`<div class="collage">${[...c.ids].slice(0,4).map(k=>zoomBtn(k,"cz")).join("")}</div>
   <div class="cbody"><div class="ctop"><div class="n">${esc(c.n)}</div><div class="ctrl" data-k="${c.key}"></div></div>
   <ol class="clist">${[...c.ids].map(k=>`<li>${zoomBtn(k,"zbtn")}${esc(nm(k))} <em>${D[k].g} g</em></li>`).join("")}</ol>
   <div class="price"><s>${gs(c.old)}</s><strong>${gs(c.p)}</strong><small>${esc(T("avg"))}: ${gs(c.p/5)}</small></div></div>`;
   s.appendChild(d);});
  menu.appendChild(s);}
 CATS.forEach(c=>{const list=c.ids.filter(k=>has(nm(k)+" "+ds(k)));
  if(!list.length) return;
  const s=document.createElement("section"); s.className="cat"; s.id=c.id;
  s.innerHTML=`<div class="cat-h"><h2>${esc(N(c))}</h2></div><p class="note">${esc(c.note[L])}</p>`;
  list.forEach(k=>{shown++; const d=document.createElement("article"); d.className="item"; d.dataset.k=k;
   d.innerHTML=`${zoomBtn(k,"pic")}<div class="info"><div class="n">${esc(nm(k))}</div><p class="d">${esc(ds(k))}</p><div class="tags">${tagsHTML(D[k])}</div></div><div class="ctrl" data-k="${k}"></div>`;
   s.appendChild(d);});
  menu.appendChild(s);});
 $("#empty").style.display=shown?"none":"block"; desenhaCtrls();}

function desenhaCtrls(){document.querySelectorAll(".ctrl").forEach(el=>{el.innerHTML=ctrlHTML(el.dataset.k);});
 document.querySelectorAll(".item").forEach(el=>el.classList.toggle("in",!!cesta[el.dataset.k]));}

/* ===== CAMADAS (anatomia do Dialog do shadcn, sem <dialog>: o top layer do <dialog>
   escaparia da moldura de iPhone do desktop. Foco preso, Esc, clique fora e foco devolvido. ===== */
const pilha=[];
const FUNDO=()=>document.getElementById("loja").hidden?[app,bar]:[document.getElementById("loja")];
const tabbables=root=>[...root.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(e=>e.getClientRects().length);
const noTopo=()=>pilha[pilha.length-1];
const aberto=el=>pilha.some(x=>x.el===el);
function abrir(el,foco){
 if(aberto(el)) return;
 // guarda quem abriu ANTES de tornar o fundo inerte: inert tira o foco do elemento na hora
 const ret=document.activeElement, t=noTopo();
 if(t) t.el.inert=true; else FUNDO().forEach(e=>e.inert=true);
 pilha.push({el,ret});
 el.inert=false; el.classList.add("show");
 requestAnimationFrame(()=>{const f=(foco&&el.querySelector(foco))||tabbables(el)[0]; if(f) f.focus({preventScroll:true});});
}
function fechar(el){
 const i=pilha.findIndex(x=>x.el===el); if(i<0) return;
 const [item]=pilha.splice(i,1);
 el.classList.remove("show"); el.inert=true;
 const t=noTopo();
 if(t) t.el.inert=false; else FUNDO().forEach(e=>e.inert=false);
 if(item.ret&&item.ret.isConnected) item.ret.focus({preventScroll:true});
}
document.addEventListener("keydown",e=>{const t=noTopo(); if(!t) return;
 if(e.key==="Escape"){e.preventDefault(); if(t.el===viewer) closeV(); else fechar(t.el); return;}
 if(e.key==="Tab"){const f=tabbables(t.el); if(!f.length) return; const a=f[0], z=f[f.length-1];
  if(e.shiftKey&&(document.activeElement===a||!t.el.contains(document.activeElement))){e.preventDefault(); z.focus();}
  else if(!e.shiftKey&&(document.activeElement===z||!t.el.contains(document.activeElement))){e.preventDefault(); a.focus();}}});

/* ===== VISUALIZADOR DE FOTO ===== */
const viewer=$("#viewer"), isOpen=()=>aberto(viewer);
let vList=[], vIdx=0;
function showV(){const k=vList[vIdx]; $("#vImg").src="img/"+k+".jpg"; $("#vImg").alt=nm(k); $("#vName").textContent=nm(k); $("#vDesc").textContent=ds(k);
 $("#vG").textContent=D[k].g?D[k].g+" g":""; $("#vAdd").textContent="+ "+T("add");
 $(".vnav").style.display=vList.length>1?"flex":"none";}
// FLIP: anima a foto do visualizador a partir (ou de volta) do retângulo da miniatura
function flip(img,rect,dir){const to=img.getBoundingClientRect(), z=zoomOf();
 const t=`translate(${(rect.left+rect.width/2-(to.left+to.width/2))/z}px,${(rect.top+rect.height/2-(to.top+to.height/2))/z}px) scale(${rect.width/to.width})`;
 return img.animate(dir>0?[{transform:t,opacity:.6},{transform:"none",opacity:1}]:[{transform:"none",opacity:1},{transform:t,opacity:.4}],{duration:dir>0?280:200,easing:EASE_OUT,fill:"forwards"});}
const thumbOf=k=>{const vis=app.getBoundingClientRect(); return [...document.querySelectorAll(`#menu [data-zoom="${k}"]`)].find(e=>{const b=e.getBoundingClientRect(); return b.width&&b.bottom>vis.top+60&&b.top<vis.bottom;});};
function openV(k,from){vList=[...new Set([...document.querySelectorAll("#menu [data-zoom]")].map(e=>e.dataset.zoom))]; vIdx=Math.max(0,vList.indexOf(k)); showV(); abrir(viewer,"#vClose");
 if(from&&!reduced()) flip($("#vImg"),from.getBoundingClientRect(),1);}
let vClosing=false;
function closeV(){if(!isOpen()||vClosing) return; const img=$("#vImg"), th=thumbOf(vList[vIdx]);
 const done=()=>{vClosing=false; img.getAnimations().forEach(a=>a.cancel()); fechar(viewer);};
 if(th&&!reduced()){vClosing=true; flip(img,th.getBoundingClientRect(),-1).finished.then(done,done);} else done();}
document.addEventListener("keydown",e=>{if(!isOpen()) return;
 if(e.key==="ArrowRight"){e.preventDefault(); $("#vNext").click();} if(e.key==="ArrowLeft"){e.preventDefault(); $("#vPrev").click();}});
$("#q").addEventListener("input",render);
// carrossel dos destaques: ← → rolam um card quando o foco está nele
$("#menu").addEventListener("keydown",e=>{const rail=e.target.closest(".rail"); if(!rail||(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")) return;
 e.preventDefault(); const cards=[...rail.querySelectorAll(".fcard")], i=cards.findIndex(c=>c.contains(document.activeElement)), j=Math.max(0,Math.min(cards.length-1,i+(e.key==="ArrowRight"?1:-1)));
 cards[j].querySelector(".zoom").focus(); cards[j].scrollIntoView({inline:"start",block:"nearest",behavior:reduced()?"auto":"smooth"});});
// grupo de idioma (Toggle Group): ← → movem o foco entre ES, PT e EN
$("#lang").addEventListener("keydown",e=>{if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft") return; const b=[...$("#lang").querySelectorAll("button")], i=b.indexOf(document.activeElement); if(i<0) return; e.preventDefault(); b[(i+(e.key==="ArrowRight"?1:-1)+b.length)%b.length].focus();});
// troca de foto com deslize lateral: a atual sai para um lado, a nova entra do outro
function step(dir,fromX){const img=$("#vImg"); img.getAnimations().forEach(a=>a.cancel()); vIdx=(vIdx+dir+vList.length)%vList.length;
 if(reduced()){img.style.transform=""; showV(); return;}
 const w=img.getBoundingClientRect().width/zoomOf();
 img.animate([{transform:`translateX(${fromX||0}px)`,opacity:1},{transform:`translateX(${-dir*w*.4}px)`,opacity:0}],{duration:140,easing:"cubic-bezier(.4,0,1,1)"}).finished.then(()=>{img.style.transform=""; showV();
  img.animate([{transform:`translateX(${dir*w*.4}px)`,opacity:0},{transform:"none",opacity:1}],{duration:220,easing:EASE_OUT});});}
$("#vPrev").onclick=()=>step(-1);
$("#vNext").onclick=()=>step(1);
$("#vClose").onclick=closeV;
viewer.onclick=e=>{if(e.target===viewer) closeV();};
$("#vAdd").onclick=()=>{muda(vList[vIdx],1); const b=$("#vAdd"); b.textContent="✓"; setTimeout(()=>{b.textContent="+ "+T("add");},900);};
// swipe no visualizador: a foto segue o dedo; troca por distância (60 px) ou velocidade (0,11 px/ms), senão volta
{let x0=null,t0=0,dx=0,id=null; const img=$("#vImg");
 img.addEventListener("pointerdown",e=>{if(id!==null||vList.length<2) return; id=e.pointerId; x0=e.clientX; t0=performance.now(); dx=0; img.setPointerCapture(id); img.getAnimations().forEach(a=>a.cancel());});
 img.addEventListener("pointermove",e=>{if(e.pointerId!==id) return; dx=(e.clientX-x0)/zoomOf(); img.style.transform=`translateX(${dx}px)`; img.style.opacity=String(1-Math.min(.4,Math.abs(dx)/600));});
 const end=e=>{if(e.pointerId!==id) return; id=null; const v=Math.abs(dx)/Math.max(1,performance.now()-t0); img.style.opacity="";
  if(Math.abs(dx)>60||(Math.abs(dx)>16&&v>.11)) step(dx<0?1:-1,dx);
  else{const from=dx; img.style.transform=""; if(from&&!reduced()) img.animate([{transform:`translateX(${from}px)`},{transform:"none"}],{duration:220,easing:EASE_OUT});}
  dx=0;};
 img.addEventListener("pointerup",end); img.addEventListener("pointercancel",end);}

app.addEventListener("scroll",()=>{const top=app.getBoundingClientRect().top, off=topoFixo()+30; let cur=null;
 document.querySelectorAll("section.cat").forEach(s=>{if(s.getBoundingClientRect().top-top-off<=0) cur=s.id;}); if(!cur){const f=document.querySelector("section.cat"); cur=f&&f.id;}
 const secs=document.querySelectorAll("section.cat"); if(secs.length&&app.scrollTop+app.clientHeight>=app.scrollHeight-2) cur=secs[secs.length-1].id; // no fim da rolagem a última seção não chega ao topo: ela fica ativa
 document.querySelectorAll(".chip[data-id]").forEach(c=>{const a=c.dataset.id===cur;
  if(a&&!c.classList.contains("active")&&!desk()){const ch=$("#chips"); ch.scrollTo({left:c.offsetLeft-ch.clientWidth/2+c.offsetWidth/2,behavior:reduced()?"auto":"smooth"});}
  c.classList.toggle("active",a); if(a) c.setAttribute("aria-current","true"); else c.removeAttribute("aria-current");});},{passive:true});

/* ===== MESA ===== */
const NMESAS=11;
const ss=(k,d)=>{try{const v=sessionStorage.getItem(k); return v===null?d:JSON.parse(v);}catch(e){return d;}};
const ssSet=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v));}catch(e){}};
let MESA=(()=>{const n=parseInt(new URLSearchParams(location.search).get("mesa"),10);
 if(n>=1&&n<=NMESAS){ssSet("uacai-mesa",n); return n;} return ss("uacai-mesa",null);})();
let depoisDeEscolher=null;
const pick=$("#pick");
// a mesa trava no primeiro pedido e quem decide é o servidor (meus.travada): o celular só mostra
let travada=null, travaVista=false;
const SVG_CAD='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
function setMesa(n){MESA=n; ssSet("uacai-mesa",n);
 const c=$("#mesaChip"); c.hidden=false; c.textContent="";
 const t=document.createElement("span"); t.textContent=T("mesa")+" "+n; c.appendChild(t);
 if(travada){const lk=document.createElement("span"); lk.className="lk"; lk.setAttribute("aria-hidden","true"); lk.innerHTML=SVG_CAD; c.appendChild(lk);}
 c.classList.toggle("travada",!!travada); c.disabled=!!travada;
 c.setAttribute("aria-label",T("mesa")+" "+n+" — "+T(travada?"locked":"change"));
 $("#sheetMesa").textContent=n;}
function aplicaTrava(){
 $("#changeMesa").hidden=!!travada;
 $("#mesaErr").hidden=!travada;
 if(travada||MESA) setMesa(travada||MESA);
 if(travada&&!travaVista){travaVista=true; const lk=$("#mesaChip .lk");
  if(lk&&!reduced()) lk.animate([{transform:"translateY(-4px) rotate(-14deg)",opacity:0},{transform:"none",opacity:1}],{duration:260,easing:EASE_OUT});}}
function abrePick(entao){depoisDeEscolher=entao||null; const g=$("#pickGrid"); g.innerHTML="";
 for(let n=1;n<=NMESAS;n++){const b=document.createElement("button"); b.type="button"; b.className="pk"+(n===MESA?" on":"");
  b.textContent=n; b.setAttribute("aria-pressed",String(n===MESA)); b.setAttribute("aria-label",T("mesa")+" "+n);
  b.onclick=()=>{setMesa(n); fechar(pick); const f=depoisDeEscolher; depoisDeEscolher=null; if(f) f();};
  g.appendChild(b);}
 abrir(pick);}
$("#pickClose").onclick=()=>fechar(pick);
pick.onclick=e=>{if(e.target===pick) fechar(pick);};
$("#mesaChip").onclick=()=>{if(!travada) abrePick();};
$("#changeMesa").onclick=()=>{if(!travada) abrePick();};

/* ===== CESTA ===== */
const cesta={};
const quantos=()=>Object.values(cesta).reduce((a,b)=>a+b,0);
const totalCesta=()=>Object.keys(cesta).reduce((a,k)=>a+precoDe(k)*cesta[k],0);
function muda(k,d){cesta[k]=Math.max(0,(cesta[k]||0)+d); if(!cesta[k]) delete cesta[k];
 desenhaCtrls(); atualizaBarra(d>0); redesenha();}
document.addEventListener("click",e=>{const b=e.target.closest("[data-d]"); if(b) muda(b.dataset.k,+b.dataset.d);});
$("#menu").addEventListener("click",e=>{const z=e.target.closest("[data-zoom]"); if(z&&!e.target.closest(".ctrl")) openV(z.dataset.zoom,z);});

/* ===== BARRA E PAINEL DO PEDIDO ===== */
const overlay=$("#overlay"), sheet=$("#sheet");
let meus={pedidos:[],chamados:[]};
function atualizaBarra(pulsa){
 const n=quantos(), emAndamento=meus.pedidos.filter(o=>o.status!=="entregue").length;
 bar.hidden=!(n||meus.pedidos.length);
 const c=$("#barCount");
 c.textContent=String(n||emAndamento||meus.pedidos.length);
 $("#barLbl").textContent=n?T("view"):T("my");
 $("#barTotal").textContent=n?gs(totalCesta()):"";
 if(pulsa&&!reduced()){c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");}}
function desenhaCesta(){const box=$("#lines"); box.innerHTML="";
 for(const k in cesta){
  const r=document.createElement("div"); r.className="line";
  const nome=document.createElement("span"); nome.className="n"; nome.textContent=nomeDe(k);
  const sub=document.createElement("small"); sub.textContent=gs(precoDe(k)*cesta[k]); nome.appendChild(sub);
  const st=document.createElement("div"); st.className="stepper";
  st.innerHTML=`<button type="button" data-d="-1" data-k="${esc(k)}" aria-label="${esc(T("rm"))}: ${esc(nomeDe(k))}">−</button><span aria-hidden="true">${cesta[k]}</span><button type="button" data-d="1" data-k="${esc(k)}" aria-label="${esc(T("add"))}: ${esc(nomeDe(k))}">+</button>`;
  r.append(nome,st); box.appendChild(r);}
 if(!quantos()){const p=document.createElement("p"); p.className="muted"; p.textContent=T("emptyBag"); box.appendChild(p);}
 $("#sheetTotal").textContent=quantos()?gs(totalCesta()):gs(0);
 $("#send").disabled=!quantos();
 $("#sheetMesa").textContent=MESA||"";}
function desenhaMeus(){const box=$("#myList"); box.innerHTML="";
 const lista=meus.pedidos.slice().reverse();
 if(!lista.length){const p=document.createElement("p"); p.className="muted"; p.textContent=T("noneYet"); box.appendChild(p);}
 const passos=["novo","preparo","pronto"];
 lista.forEach(o=>{const d=document.createElement("article"); d.className="mo";
  const idx=o.status==="entregue"?3:passos.indexOf(o.status);
  const h=document.createElement("div"); h.className="mo-h";
  const b=document.createElement("b"); b.textContent="#"+o.id+" · "+T("mesa")+" "+o.mesa;
  const s=document.createElement("span"); s.className="mo-s s-"+o.status; s.textContent=T("st_"+o.status);
  h.append(b,s);
  const steps=document.createElement("div"); steps.className="steps"; steps.setAttribute("aria-hidden","true");
  passos.forEach((_,i)=>{const i2=document.createElement("i"); if(i<=idx) i2.className="done"; steps.appendChild(i2);});
  const it=document.createElement("p"); it.className="mo-i";
  it.textContent=o.itens.map(x=>x.q+"× "+nomeDe(x.chave)).join(" · ")+" — "+gs(o.total);
  d.append(h,steps,it); box.appendChild(d);});
 const chamou=MESA&&meus.chamados.includes(MESA);
 $("#payMsg").textContent=chamou?T("payDone"):"";
 $("#payBtn").disabled=!!chamou||!MESA;}
// no computador as duas vistas ficam juntas no painel fixo; no celular continuam alternando
function mostraVista(v){if(desk()){$("#cartView").hidden=false; $("#statusView").hidden=false; return;}
 $("#cartView").hidden=v!=="cart"; $("#statusView").hidden=v!=="status";}
const painelVisivel=()=>desk()||aberto(overlay);
function redesenha(){if(!painelVisivel()) return;
 if(!$("#cartView").hidden) desenhaCesta();
 if(!$("#statusView").hidden) desenhaMeus();}
function abreSheet(v){mostraVista(v); $("#msg").textContent=""; sheet.style.transform="";
 // abrir() primeiro: redesenha() só desenha o painel que já está visível
 if(!desk()) abrir(overlay,v==="status"?"#closeBag2":"#closeBag");
 redesenha();}
// troca entre celular e computador sem recarregar
function ajustaModo(){
 if(desk()){if(aberto(overlay)) fechar(overlay); overlay.inert=false; mostraVista();}
 else if(!aberto(overlay)){overlay.inert=true; mostraVista("cart");}
 redesenha(); fitFrame();}
$("#openBag").onclick=()=>abreSheet(quantos()?"cart":"status");
$("#closeBag").onclick=()=>fechar(overlay);
$("#closeBag2").onclick=()=>fechar(overlay);
$("#contBtn").onclick=()=>{$("#sentHead").hidden=true; fechar(overlay);};
overlay.onclick=e=>{if(e.target===overlay) fechar(overlay);};
$("#clear").onclick=()=>{for(const k in cesta) delete cesta[k]; desenhaCtrls(); atualizaBarra(); desenhaCesta();};

// arrastar o painel para baixo para fechar: segue o dedo, solta além de 110 px ou com velocidade
{let y0=null,dy=0,t0=0,id=null;
 const alvo=e=>e.target.closest("#grab,.sh")&&!e.target.closest("button");
 sheet.addEventListener("pointerdown",e=>{if(id!==null||!alvo(e)) return; id=e.pointerId; y0=e.clientY; t0=performance.now(); dy=0; sheet.setPointerCapture(id); sheet.style.transition="none"; sheet.classList.add("arrastando");});
 sheet.addEventListener("pointermove",e=>{if(e.pointerId!==id) return; dy=Math.max(0,(e.clientY-y0)/zoomOf()); sheet.style.transform=`translateY(${dy}px)`;});
 const fim=e=>{if(e.pointerId!==id) return; id=null; sheet.style.transition=""; sheet.classList.remove("arrastando");
  const v=dy/Math.max(1,performance.now()-t0);
  if(dy>110||v>.5){sheet.style.transform=""; fechar(overlay);} else sheet.style.transform="";
  dy=0;};
 sheet.addEventListener("pointerup",fim); sheet.addEventListener("pointercancel",fim);}

/* ===== ENVIO ===== */
const api=async (rota,op)=>{const r=await fetch(rota,{credentials:"same-origin",headers:{"Content-Type":"application/json"},...op});
 const d=await r.json().catch(()=>({})); if(!r.ok) throw Object.assign(new Error(d.erro||"erro"),{status:r.status,dados:d}); return d;};
// token do cliente: identifica os pedidos deste celular sem pedir nome nem login
const TOKEN=(()=>{let t=null; try{t=localStorage.getItem("uacai-token");}catch(e){}
 if(!/^[a-f0-9]{32}$/.test(t||"")){t=[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,"0")).join("");
  try{localStorage.setItem("uacai-token",t);}catch(e){}}
 return t;})();

async function enviar(forcado){
 if(!quantos()) return;
 if(!MESA){$("#msg").textContent=T("pickFirst"); abrePick(()=>enviar(false)); return;}
 // pergunta do açaí: prato salgado, nenhum açaí e no máximo uma vez por pedido
 if(!forcado&&!perguntouAcai&&temSalgado()&&!temAcai()){perguntouAcai=true; abreAcai(); return;}
 const b=$("#send"); b.disabled=true; b.classList.add("loading"); b.setAttribute("aria-busy","true"); b.textContent=T("sending"); $("#msg").textContent="";
 try{
  await api("/api/pedidos",{method:"POST",body:JSON.stringify({mesa:MESA,token:TOKEN,obs:$("#obs").value,
   itens:Object.keys(cesta).map(k=>({chave:k,q:cesta[k]}))})});
  for(const k in cesta) delete cesta[k];
  $("#obs").value=""; perguntouAcai=false; desenhaCtrls(); atualizaBarra();
  $("#sentHead").hidden=false; await puxaMeus(); mostraVista("status"); redesenha();
 }catch(e){
  // 409: o servidor ja amarrou este aparelho a outra mesa. Ele manda qual, e a tela obedece.
  if(e.status===409){travada=(e.dados&&e.dados.mesa)||travada; aplicaTrava(); $("#msg").textContent=T("wrongMesa");}
  else $("#msg").textContent=e.status===429?e.message:T("failNet");}
 finally{b.classList.remove("loading"); b.removeAttribute("aria-busy"); b.textContent=T("send"); b.disabled=!quantos();}}
$("#send").onclick=()=>enviar(false);

/* ===== "CAIRIA BEM UM AÇAÍ AGORA?" ===== */
const acai=$("#sugAcai");
let perguntouAcai=false;
const temAcai=()=>ACAIS.some(k=>cesta[k]);
const temSalgado=()=>SALGADOS.some(k=>cesta[k]);
const rotuloAcai=()=>{$("#acaiSend").textContent=temAcai()?T("acaiYes"):T("acaiJust");};
function abreAcai(){
 $("#acaiGrid").innerHTML=ACAIS.map(k=>`<article class="ac"><img class="ac-f" src="img/${k}.jpg" alt="${esc(nm(k))}" width="300" height="300" decoding="async"><div class="ac-b"><span class="ac-n">${esc(nm(k))}</span><span class="ac-p">${gs(precoDe(k))}</span></div><button type="button" class="ac-add" data-d="1" data-k="${k}" aria-label="${esc(T("add"))}: ${esc(nm(k))}">+ ${esc(T("add"))}</button></article>`).join("");
 rotuloAcai(); abrir(acai,"#acaiNo");}
$("#acaiSend").onclick=()=>{fechar(acai); enviar(true);};
$("#acaiNo").onclick=()=>{fechar(acai); enviar(true);};
acai.onclick=e=>{if(e.target===acai) fechar(acai);};   // fora e Esc so fecham: o pedido continua montado
// "+ Adicionar" confirma e o prato pula para o pedido
$("#acaiGrid").addEventListener("click",e=>{const b=e.target.closest(".ac-add"); if(!b) return;
 b.classList.add("feito"); b.textContent="✓ "+T("add");
 setTimeout(()=>{if(b.isConnected){b.classList.remove("feito"); b.textContent="+ "+T("add");}},900);
 rotuloAcai();
 if(!reduced()) pula(b.closest(".ac").querySelector(".ac-f"));});
function pula(img){const alvo=desk()?$("#sheetTotal"):$("#barCount");
 if(!img||!alvo) return;
 const a=img.getBoundingClientRect(), z=alvo.getBoundingClientRect();
 const fly=img.cloneNode(); fly.className="fly"; fly.removeAttribute("width"); fly.removeAttribute("height");
 Object.assign(fly.style,{left:a.left+"px",top:a.top+"px",width:a.width+"px",height:a.height+"px"});
 document.body.appendChild(fly);
 const fim=()=>fly.remove();
 fly.animate([{transform:"none",opacity:1},
  {transform:`translate(${z.left+z.width/2-a.left-a.width/2}px,${z.top+z.height/2-a.top-a.height/2}px) scale(.18)`,opacity:.15}],
  {duration:320,easing:EASE_OUT}).finished.then(fim,fim);}

$("#payBtn").onclick=async ()=>{
 if(!MESA) return;
 const b=$("#payBtn"); b.disabled=true;
 try{await api("/api/chamados",{method:"POST",body:JSON.stringify({mesa:MESA})}); meus.chamados=[...new Set([...meus.chamados,MESA])];}
 catch(e){$("#payMsg").textContent=e.status===429?T("payDone"):T("failNet");}
 desenhaMeus();};

async function puxaMeus(){try{meus=await api("/api/meus-pedidos?token="+TOKEN);}catch(e){}
 aplicaMeus();}
// um caminho so para tudo o que depende de "meus": trava da mesa, barra e painel
function aplicaMeus(){
 travada=meus.travada||null;
 if(travada||MESA) aplicaTrava();
 atualizaBarra(); redesenha();}

/* ===== MENU ⋮ (Dropdown Menu) ===== */
const dots=$("#dots"), pop=$("#menuPop");
const fechaPop=()=>{if(pop.hidden) return; pop.hidden=true; dots.setAttribute("aria-expanded","false");};
dots.onclick=e=>{e.stopPropagation(); const abrirAgora=pop.hidden; pop.hidden=!abrirAgora;
 dots.setAttribute("aria-expanded",String(abrirAgora)); if(abrirAgora) $("#goLoja").focus();};
document.addEventListener("click",e=>{if(!pop.hidden&&!pop.contains(e.target)&&e.target!==dots) fechaPop();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pop.hidden){fechaPop(); dots.focus();}});
pop.addEventListener("keydown",e=>{if(e.key==="Tab"){fechaPop(); return;} if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault(); $("#goLoja").focus();}});

/* ===== LOGIN DA LOJA ===== */
const login=$("#login");
$("#goLoja").onclick=()=>{fechaPop(); $("#pwErr").textContent=""; $("#pw").value=""; abrir(login,"#em");};
$("#pwCancel").onclick=()=>fechar(login);
login.onclick=e=>{if(e.target===login) fechar(login);};
$("#loginForm").onsubmit=async e=>{
 e.preventDefault();
 const b=$("#loginBtn"); b.disabled=true; b.classList.add("loading"); b.setAttribute("aria-busy","true"); b.textContent=T("entering");
 $("#pwErr").textContent=""; [$("#em"),$("#pw")].forEach(i=>i.removeAttribute("aria-invalid"));
 try{
  const d=await api("/api/login",{method:"POST",body:JSON.stringify({email:$("#em").value,senha:$("#pw").value})});
  $("#pw").value=""; fechar(login); abreLoja(d.email);
 }catch(err){$("#pwErr").textContent=T("wrong"); [$("#em"),$("#pw")].forEach(i=>i.setAttribute("aria-invalid","true"));
  $("#pw").value=""; $("#pw").focus();}
 finally{b.disabled=false; b.classList.remove("loading"); b.removeAttribute("aria-busy"); b.textContent=T("enter");}};

/* ===== IDIOMA ===== */
function setLang(l){L=l; try{localStorage.setItem("uacai-lang",l);}catch(e){}
 document.documentElement.lang=l;
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=T(el.dataset.i18n));
 document.querySelectorAll("[data-i18n-ph]").forEach(el=>el.placeholder=T(el.dataset.i18nPh));
 document.querySelectorAll("[data-i18n-aria]").forEach(el=>el.setAttribute("aria-label",T(el.dataset.i18nAria)));
 $("#lang").querySelectorAll("button").forEach(b=>{b.classList.toggle("on",b.dataset.l===l); b.setAttribute("aria-pressed",String(b.dataset.l===l));});
 renderChips(); render(); if(isOpen()) showV();
 if(MESA) setMesa(MESA);
 atualizaBarra(); redesenha();}
LANGS.forEach(l=>{const b=document.createElement("button"); b.textContent=l.toUpperCase(); b.dataset.l=l; b.onclick=()=>setLang(l); $("#lang").appendChild(b);});

/* ===== ÁREA DA LOJA ===== */
const loja=$("#loja");
const STATUS_LOJA={novo:{col:"Novos pedidos",acao:"Aceitar e preparar",prox:"preparo",bdg:"Novo"},
 preparo:{col:"Em preparo",acao:"Marcar como pronto",prox:"pronto",bdg:"Preparando"},
 pronto:{col:"Prontos para servir",acao:"Entregue na mesa",prox:"entregue",bdg:"Pronto"}};
let dados={pedidos:[],chamados:[],mesas:NMESAS}, mesaSel=null, visto={novos:0,chamados:0}, audio=null, contaVista=null;
// o que já estava na tela: só o que é novo (ou mudou de coluna) entra com movimento
let naTela=new Set();
const ago=t=>{const m=Math.max(0,Math.round((Date.now()-t)/60000)); return m<1?"agora":"há "+m+" min";};
const hora=t=>new Date(t).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const dataHora=t=>new Date(t).toLocaleDateString("pt-BR")+" às "+hora(t);
const BDG=k=>STATUS_LOJA[k]?STATUS_LOJA[k].bdg:"Entregue";
const soma=l=>l.reduce((a,o)=>a+o.total,0);
function bipe(){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();
 const o=audio.createOscillator(), g=audio.createGain(); o.type="sine"; o.frequency.value=880;
 g.gain.setValueAtTime(.0001,audio.currentTime); g.gain.exponentialRampToValueAtTime(.22,audio.currentTime+.02);
 g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.5);
 o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime+.55);}catch(e){}}
// contador que pulsa só quando o número muda
function conta(id,valor){const el=document.getElementById(id); const novo=String(valor);
 if(el.textContent===novo) return; el.textContent=novo;
 if(!reduced()){el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");}}

let fatVisto=null;
function desenhaFat(){
 const f=dados.faturamento||{total:0,contas:0,ticket:0};
 const el=$("#fatTotal");
 if(fatVisto===null||reduced()||f.total===fatVisto) el.textContent=gs(f.total);
 else sobeAte(el,fatVisto,f.total);
 fatVisto=f.total;
 conta("fatContas",f.contas); conta("fatTicket",gs(f.ticket));}
// contagem curta: o número caminha do antigo ao novo em 600 ms
function sobeAte(el,de,para){const t0=performance.now();
 const passo=now=>{const k=Math.min(1,(now-t0)/600), e=1-Math.pow(1-k,3);
  el.textContent=gs(de+(para-de)*e); if(k<1) requestAnimationFrame(passo);};
 requestAnimationFrame(passo);}

function abreLoja(email){
 document.body.classList.add("loja-on"); loja.hidden=false;
 $("#lojaEmail").textContent=email||"";
 visto={novos:-1,chamados:-1};           // o primeiro desenho não bipa
 conecta();
 $("#lojaTop").focus();}
async function fechaLoja(){
 try{await api("/api/logout",{method:"POST"});}catch(e){}
 document.body.classList.remove("loja-on"); loja.hidden=true;
 dados={pedidos:[],chamados:[],mesas:NMESAS}; mesaSel=null;
 conecta();}
$("#lojaOut").onclick=fechaLoja;

function desenhaLoja(){
 if(loja.hidden) return;
 const vivos=dados.pedidos.filter(o=>o.status!=="entregue");
 const novos=vivos.filter(o=>o.status==="novo").length;
 conta("stNovo",novos);
 $("#stNovo").parentElement.classList.toggle("pur",novos>0);   // o chip só ganha cor quando há algo a fazer
 conta("stPrep",vivos.filter(o=>o.status==="preparo").length);
 conta("stPronto",vivos.filter(o=>o.status==="pronto").length);
 conta("stAberto",gs(soma(dados.pedidos)));
 desenhaFat();
 $("#stCall").hidden=!dados.chamados.length; conta("stCallN",dados.chamados.length);

 /* chamados de conta */
 const agora=new Set();
 const calls=$("#calls"); calls.textContent="";
 dados.chamados.forEach(n=>{
  const d=document.createElement("div"); d.className="call"+(naTela.has("c"+n)?"":" chega"); agora.add("c"+n);
  const t=document.createElement("div"); t.className="call-t";
  const b=document.createElement("b"); b.textContent="Mesa "+n+" está chamando para pagar";
  const s=document.createElement("span"); s.textContent="Total da conta: "+gs(soma(dados.pedidos.filter(o=>o.mesa===n)));
  t.append(b,s);
  const ver=document.createElement("button"); ver.type="button"; ver.className="b-out"; ver.textContent="Ver conta"; ver.dataset.ver=n;
  const ok=document.createElement("button"); ok.type="button"; ok.className="b-call"; ok.textContent="Estou indo"; ok.dataset.ok=n;
  d.append(t,ver,ok); calls.appendChild(d);});

 /* mesas */
 const rank={novo:3,pronto:2,preparo:1}, mesas=$("#mesas"); mesas.textContent=""; let ocupadas=0;
 for(let n=1;n<=NMESAS;n++){
  const daMesa=dados.pedidos.filter(o=>o.mesa===n), vivosM=vivos.filter(o=>o.mesa===n);
  let st="livre"; vivosM.forEach(o=>{if(st==="livre"||rank[o.status]>rank[st]) st=o.status;});
  if(st==="livre"&&daMesa.length) st="atendida";
  const chama=dados.chamados.includes(n);
  if(st!=="livre"||chama) ocupadas++;
  const rot=chama?"Quer pagar":{novo:"Pedido novo",preparo:"Em preparo",pronto:"Pronto para servir",atendida:"Atendida",livre:"Livre"}[st];
  const b=document.createElement("button"); b.type="button"; b.dataset.mesa=n;
  b.className="mesa m-"+(chama?"chama":st)+(mesaSel===n?" sel":"");
  b.setAttribute("aria-pressed",String(mesaSel===n));
  const num=document.createElement("span"); num.className="mn"; num.textContent=n;
  const lab=document.createElement("span"); lab.className="ml"; lab.textContent=rot;
  const sub=document.createElement("span"); sub.className="ms";
  sub.textContent=vivosM.length?vivosM.length+(vivosM.length>1?" pedidos abertos":" pedido aberto"):(st==="atendida"?"Comendo":"");
  const tot=document.createElement("span"); tot.className="mt"; tot.textContent=daMesa.length?gs(soma(daMesa)):"";
  b.append(num,lab,sub,tot); mesas.appendChild(b);}
 conta("stOcup",ocupadas);

 /* conta da mesa */
 const cb=$("#conta"); cb.textContent="";
 if(mesaSel){
  const daMesa=dados.pedidos.filter(o=>o.mesa===mesaSel);
  cb.hidden=false;
  cb.classList.toggle("chega",contaVista!==mesaSel);   // so na troca de mesa, nao a cada evento do SSE
  contaVista=mesaSel;
  const ct=document.createElement("div"); ct.className="ct";
  const sp=document.createElement("span"); sp.textContent="Conta da mesa "+mesaSel+" · "+daMesa.length+(daMesa.length===1?" pedido":" pedidos");
  const bt=document.createElement("b"); bt.textContent=gs(soma(daMesa));
  ct.append(sp,bt);
  const acoes=document.createElement("div"); acoes.className="cb";
  const ver=document.createElement("button"); ver.type="button"; ver.className="b-out"; ver.textContent="Ver conta";
  ver.onclick=()=>abreExtrato(mesaSel);
  const todas=document.createElement("button"); todas.type="button"; todas.className="b-out"; todas.textContent="Ver todas as mesas";
  todas.onclick=()=>{mesaSel=null; desenhaLoja();};
  const fecharC=document.createElement("button"); fecharC.type="button"; fecharC.className="b-pur"; fecharC.textContent="Fechar conta";
  // fechar a conta apaga a mesa inteira: o primeiro clique pergunta, o segundo faz
  let confirmando=false;
  fecharC.onclick=async ()=>{
   if(!confirmando){confirmando=true; fecharC.textContent="Confirmar? Isso zera a mesa";
    fecharC.classList.add("confirmar");
    setTimeout(()=>{if(confirmando&&fecharC.isConnected){confirmando=false; fecharC.textContent="Fechar conta"; fecharC.classList.remove("confirmar");}},6000);
    return;}
   fecharC.disabled=true;
   // o evento do SSE pode chegar antes da linha de baixo, então redesenha depois de limpar a seleção
   try{await api("/api/mesas/"+mesaSel+"/fechar",{method:"POST"}); mesaSel=null; desenhaLoja();}
   catch(e){fecharC.disabled=false;}};
  acoes.append(ver,todas,fecharC);
  const chead=document.createElement("div"); chead.className="chead"; chead.append(ct,acoes);
  cb.appendChild(chead);
  /* lista dos pedidos da mesa, do mais antigo para o mais novo */
  const pl=document.createElement("div"); pl.className="plist";
  if(!daMesa.length){const p=document.createElement("p"); p.className="none"; p.textContent="Esta mesa ainda não pediu nada"; pl.appendChild(p);}
  daMesa.forEach(o=>{
   const art=document.createElement("article"); art.className="ped"; art.setAttribute("aria-label","Pedido #"+o.id);
   const h=document.createElement("div"); h.className="ped-h";
   const b=document.createElement("b"); b.textContent="#"+o.id+" · "+hora(o.criado);
   const bdg=document.createElement("span"); bdg.className="bdg b-"+o.status; bdg.textContent=BDG(o.status);
   h.append(b,bdg);
   const ul=document.createElement("ul");
   o.itens.forEach(it=>{const li=document.createElement("li");
    const em=document.createElement("em"); em.textContent=it.q+"×";
    const sn=document.createElement("span"); sn.textContent=nomeDe(it.chave);
    const sm=document.createElement("small"); sm.textContent=gs(it.q*it.p);
    li.append(em,sn,sm); ul.appendChild(li);});
   art.append(h,ul);
   if(o.obs){const p=document.createElement("p"); p.className="note2";
    const st=document.createElement("strong"); st.textContent="Obs.: "; p.append(st,document.createTextNode(o.obs)); art.appendChild(p);}
   const sub=document.createElement("div"); sub.className="osub";
   const sl=document.createElement("span"); sl.textContent="Subtotal do pedido";
   const sv=document.createElement("b"); sv.textContent=gs(o.total);
   sub.append(sl,sv); art.appendChild(sub);
   pl.appendChild(art);});
  cb.appendChild(pl);
 } else {cb.hidden=true; contaVista=null;}
 $("#pedT").textContent=mesaSel?"Pedidos da mesa "+mesaSel:"Pedidos";

 /* colunas */
 const kan=$("#kanban"); kan.textContent="";
 const lista=mesaSel?vivos.filter(o=>o.mesa===mesaSel):vivos;
 ["novo","preparo","pronto"].forEach(k=>{
  const meta=STATUS_LOJA[k], col=document.createElement("div"); col.className="col";
  const h=document.createElement("div"); h.className="col-h";
  const dot=document.createElement("i"); dot.className="dot d-"+k; dot.setAttribute("aria-hidden","true");
  const h3=document.createElement("h3"); h3.textContent=meta.col;
  const cnt=document.createElement("span"); cnt.className="cnt";
  const daCol=lista.filter(o=>o.status===k).sort((a,b)=>a.criado-b.criado);
  cnt.textContent=daCol.length; h.append(dot,h3,cnt); col.appendChild(h);
  if(!daCol.length){const p=document.createElement("p"); p.className="none"; p.textContent="Nenhum pedido aqui"; col.appendChild(p);}
  daCol.forEach(o=>{
   const marca="o"+o.id+":"+k;
   const c=document.createElement("article"); c.className="card c-"+k+(naTela.has(marca)?"":" chega"); agora.add(marca);
   const ch=document.createElement("div"); ch.className="card-h";
   const esq=document.createElement("div");
   const bm=document.createElement("b"); bm.textContent="Mesa "+o.mesa;
   const sp=document.createElement("span"); sp.textContent="Pedido #"+o.id+" · "+ago(o.criado);
   esq.append(bm,sp);
   const bdg=document.createElement("span"); bdg.className="bdg b-"+k; bdg.textContent=meta.bdg;
   ch.append(esq,bdg);
   const ul=document.createElement("ul");
   o.itens.forEach(it=>{const li=document.createElement("li");
    const em=document.createElement("em"); em.textContent=it.q+"×";
    const sn=document.createElement("span"); sn.textContent=nomeDe(it.chave);
    const sm=document.createElement("small"); sm.textContent=gs(it.q*it.p);
    li.append(em,sn,sm); ul.appendChild(li);});
   const sub=document.createElement("div"); sub.className="osub";
   const sl=document.createElement("span"); sl.textContent="Subtotal do pedido";
   const sv=document.createElement("b"); sv.textContent=gs(o.total);
   sub.append(sl,sv);
   c.append(ch,ul,sub);
   if(o.obs){const p=document.createElement("p"); p.className="note2";
    const st=document.createElement("strong"); st.textContent="Obs.: "; p.append(st,document.createTextNode(o.obs)); c.appendChild(p);}
   const act=document.createElement("button"); act.type="button"; act.className="act a-"+k;
   act.textContent=meta.acao; act.dataset.id=o.id; act.dataset.prox=meta.prox;
   c.appendChild(act); col.appendChild(c);});
  kan.appendChild(col);});

 naTela=agora;
 /* bipe quando chega pedido novo ou pedido de conta */
 if(visto.novos>=0&&(novos>visto.novos||dados.chamados.length>visto.chamados)) bipe();
 visto={novos,chamados:dados.chamados.length};}

loja.addEventListener("click",async e=>{
 const b=e.target.closest("button"); if(!b) return;
 if(b.dataset.mesa){mesaSel=mesaSel===+b.dataset.mesa?null:+b.dataset.mesa; desenhaLoja();}
 else if(b.dataset.id){b.disabled=true; try{await api("/api/pedidos/"+b.dataset.id,{method:"PATCH",body:JSON.stringify({status:b.dataset.prox})});}catch(err){b.disabled=false;}}
 else if(b.dataset.ver){mesaSel=+b.dataset.ver; desenhaLoja(); abreExtrato(mesaSel);}
 else if(b.dataset.ok){b.disabled=true; try{await api("/api/chamados/"+b.dataset.ok,{method:"DELETE"});}catch(err){b.disabled=false;}}});

/* ===== EXTRATO DA CONTA (Dialog + Table) ===== */
const extrato=$("#extrato");
let exMesa=null, exConfirm=false;
function abreExtrato(n){
 exMesa=n;
 const ps=dados.pedidos.filter(o=>o.mesa===n);     // já vem do servidor em ordem de criação
 $("#exT").textContent="Extrato · mesa "+n;
 $("#exAb").textContent=ps.length?"Conta aberta em "+dataHora(ps[0].criado):"Mesa sem pedidos";
 const tb=$("#exBody"); tb.textContent=""; let total=0;
 ps.forEach(o=>o.itens.forEach(it=>{
  const tr=document.createElement("tr");
  // textContent: nome e observação entram como texto, nunca como HTML
  [hora(o.criado),it.q+"×",nomeDe(it.chave),gs(it.p),gs(it.q*it.p)].forEach((v,i)=>{
   const td=document.createElement("td"); td.textContent=v; if(i>2) td.className="num"; tr.appendChild(td);});
  total+=it.q*it.p; tb.appendChild(tr);}));
 $("#exTotal").textContent=gs(total);
 const obs=ps.map(o=>o.obs).filter(Boolean);
 $("#exObs").hidden=!obs.length; $("#exObs").textContent=obs.length?"Obs.: "+obs.join(" · "):"";
 resetFechar(); abrir(extrato,"#exPrint");}
$("#exVoltar").onclick=()=>fechar(extrato);
extrato.onclick=e=>{if(e.target===extrato) fechar(extrato);};
$("#exPrint").onclick=()=>{
 const b=$("#exPrint"), tx=b.textContent;
 b.disabled=true; b.classList.add("loading"); b.setAttribute("aria-busy","true"); b.textContent="Imprimindo…";
 const volta=()=>{b.disabled=false; b.classList.remove("loading"); b.removeAttribute("aria-busy"); b.textContent=tx;};
 // o rótulo precisa estar na tela antes de window.print(), que trava a linha de execução
 requestAnimationFrame(()=>{try{window.print();}finally{setTimeout(volta,300);}});};
function resetFechar(){const b=$("#exFechar"); exConfirm=false; b.disabled=false; b.textContent="Fechar conta"; b.classList.remove("confirmar");}
// fechar a conta zera a mesa: o primeiro clique pergunta, o segundo faz
$("#exFechar").onclick=async ()=>{
 const b=$("#exFechar");
 if(!exConfirm){exConfirm=true; b.textContent="Confirmar? Isso zera a mesa"; b.classList.add("confirmar");
  setTimeout(()=>{if(exConfirm&&b.isConnected) resetFechar();},6000); return;}
 b.disabled=true;
 try{await api("/api/mesas/"+exMesa+"/fechar",{method:"POST"}); mesaSel=null; resetFechar(); fechar(extrato); desenhaLoja();}
 catch(e){b.disabled=false;}};

/* ===== TEMPO REAL (SSE) ===== */
let es=null;
function conecta(){
 if(es) es.close();
 es=new EventSource("/api/eventos"+(loja.hidden?"?token="+TOKEN:""));
 es.addEventListener("painel",ev=>{dados=JSON.parse(ev.data); desenhaLoja();});
 es.addEventListener("meus",ev=>{meus=JSON.parse(ev.data); aplicaMeus();});
 es.onopen=()=>marcaVivo(true);
 es.onerror=()=>marcaVivo(false);}
const marcaVivo=ok=>{const el=$("#live"); if(!el) return; el.classList.toggle("off",!ok); $("#liveTx").textContent=ok?"Ao vivo":"Reconectando…";};

/* ===== INÍCIO ===== */
setLang(L);
if(MESA) setMesa(MESA);
puxaMeus();
conecta();
// os "há N min" dos cartões envelhecem sozinhos
setInterval(()=>{if(!loja.hidden) desenhaLoja();},30000);
(function tick(){const d=new Date(); $("#clock").textContent=d.getHours()+":"+String(d.getMinutes()).padStart(2,"0"); setTimeout(tick,30000);})();
// moldura do iPhone no desktop: encolhe para caber na altura da janela
const frameMQ=matchMedia('(min-width:760px) and (min-height:720px) and (max-width:1023px)');
const fitFrame=()=>{document.getElementById('device').style.zoom=frameMQ.matches&&loja.hidden?Math.min(1,(innerHeight-24)/876).toFixed(3):'';};
ajustaModo(); addEventListener('resize',ajustaModo);
