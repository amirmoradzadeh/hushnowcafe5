const IMGS = {
  branded: 'images/branded.webp',
  matcha: 'images/matcha.webp',
  tea: 'images/tea.webp',
  dryice: 'images/dryice.webp',
  hn_mug: 'images/hn_mug.webp',
  espresso: 'images/espresso.webp',
  cappuccino: 'images/cappuccino.webp',
  cocktail_red: 'images/cocktail_red.webp',
  croissants: 'images/croissants.webp',
};
const LOGO_SRC = 'images/logo.webp';

// TG handled by Cloudflare Worker
// TG_CHAT handled by Cloudflare Worker
function sendTelegram(text) {
  return fetch('https://hushnow-notify.amirhmz1996.workers.dev', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ message: text })
  }).catch(function(e){ console.log('Notification error:', e); });
}

document.getElementById('resBgImg').src = LOGO_SRC;
document.getElementById('eventsBgImg').src = IMGS.cocktail_red;
document.getElementById('aboutImg').src = IMGS.branded;
document.getElementById('resDate').min = new Date().toISOString().split('T')[0];
document.getElementById('evDate').min  = new Date().toISOString().split('T')[0];

setTimeout(() => {
  const hero = document.getElementById('hero');
  if(hero) hero.classList.add('visible');
}, 200);

let lang = 'it';
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.getElementById('btnIT').classList.toggle('active', l==='it');
  document.getElementById('btnEN').classList.toggle('active', l==='en');
  document.getElementById('btnDE').classList.toggle('active', l==='de');
  document.querySelectorAll('[data-it]').forEach(el => {
    const txt = el.getAttribute('data-'+l) || el.getAttribute('data-en');
    if(!txt) return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') {
      el.placeholder = txt;
    } else if(el.tagName==='OPTION') {
      el.textContent = txt;
    } else {
      el.innerHTML = txt;
    }
  });
  renderMenu(activeCat);
  renderHours();
  renderGallery();
  renderReviews();
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('burger').classList.toggle('open');
}

function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active','visible'));
  const target = document.getElementById(id);
  if(target) {
    target.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => target.classList.add('visible')));
  }
  const backBtn = document.getElementById('backBtn');
  if(backBtn) backBtn.style.display = id === 'hero' ? 'none' : 'flex';
  const navEl = document.getElementById('navLinks');
  if (navEl.classList.contains('open')) {
    navEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    navEl.style.opacity = '0';
    navEl.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      navEl.classList.remove('open');
      navEl.style.display = '';
      navEl.style.opacity = '';
      navEl.style.transform = '';
      navEl.style.transition = '';
    }, 400);
  }
  document.getElementById('burger').classList.remove('open');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#'+id);
  });
  window.scrollTo({top:0,behavior:'instant'});
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')) showSection(href.slice(1));
  });
});

const menuData = {
  caffetteria: [
    {it:'Espresso',en:'Espresso',de:'Espresso',dit:'',den:'',dde:'',price:'€1.20'},
    {it:'Decaffeinato',en:'Decaffeinated',de:'Entkoffeiniert',dit:'',den:'',dde:'',price:'€1.40'},
    {it:'Cappuccino Classico',en:'Classic Cappuccino',de:'Klassischer Cappuccino',dit:'',den:'',dde:'',price:'€2.20'},
    {it:'Cappuccino Special',en:'Special Cappuccino',de:'Special Cappuccino',dit:'Deca / Latte di mandorla / Soia / Senza lattosio',den:'Decaf / Almond milk / Soy / Lactose free',dde:'Deka / Mandelmilch / Soja / Laktosefrei',price:'€2.50'},
    {it:'Latte Macchiato Classico',en:'Classic Latte Macchiato',de:'Klassischer Latte Macchiato',dit:'',den:'',dde:'',price:'€2.00'},
    {it:'Latte Macchiato Special',en:'Special Latte Macchiato',de:'Special Latte Macchiato',dit:'Deca / Latte di mandorla / Soia / Senza lattosio',den:'Decaf / Almond milk / Soy / Lactose free',dde:'Deka / Mandelmilch / Soja / Laktosefrei',price:'€2.30'},
    {it:'Americano',en:'Americano',de:'Americano',dit:'',den:'',dde:'',price:'€2.50'},
    {it:'Ginseng Small / Large',en:'Ginseng Small / Large',de:'Ginseng Klein / Groß',dit:'',den:'',dde:'',price:'€1.80 / 2.50'},
    {it:'Orzo Small / Large',en:'Barley coffee Small / Large',de:'Gerstenkaffee Klein / Groß',dit:'',den:'',dde:'',price:'€1.80 / 2.50'},
    {it:'Tè / Infuso Classico / Special',en:'Tea / Infusion Classic / Special',de:'Tee / Aufguss Klassisch / Special',dit:'Servito con biscotti',den:'Served with cookies',dde:'Mit Keksen serviert',price:'€2.50 / 3.00'},
    {it:'Crema di Caffè',en:'Coffee Cream',de:'Kaffeecreme',dit:'',den:'',dde:'',price:'€2.00'},
    {it:'Caffè Freddo',en:'Iced Coffee',de:'Eiskaffee',dit:'Da giugno a ottobre',den:'June to October',dde:'Juni bis Oktober',price:'€1.60'},
    {it:'Cioccolata Calda',en:'Hot Chocolate',de:'Heiße Schokolade',dit:'Bianca, Gianduia, Fondente — con panna +0.50',den:'White, Gianduia, Dark — with cream +0.50',dde:'Weiß, Gianduia, Dunkel — mit Sahne +0.50',price:'€4.00'},
    {it:'Cioccolata Calda Senza Lattosio',en:'Lactose-Free Hot Chocolate',de:'Laktosefreie heiße Schokolade',dit:'Da ottobre a marzo',den:'October to March',dde:'Oktober bis März',price:'€5.00'},
    {it:'Diletta',en:'Diletta',de:'Diletta',dit:'Tè Matcha, latte di mandorla schiumato caldo, senza zuccheri aggiunti',den:'Matcha tea, hot steamed almond milk, no added sugar',dde:'Matcha-Tee, heiße aufgeschäumte Mandelmilch, ohne Zuckerzusatz',price:'€6.00'},
    {it:'Hush Cream',en:'Hush Cream',de:'Hush Cream',dit:'Espresso, latte condensato, latte montato',den:'Espresso, condensed milk, whipped milk',dde:'Espresso, Kondensmilch, aufgeschäumte Milch',price:'€5.00'},
  ],
  dolce: [
    {it:'Brioche Vuota / Ripiena',en:'Brioche Plain / Filled',de:'Brioche Leer / Gefüllt',dit:'',den:'',dde:'',price:'€1.80 / 2.00'},
    {it:'Cornetto Piccolo Vuoto / Pieno',en:'Small Croissant Plain / Filled',de:'Kleines Croissant Leer / Gefüllt',dit:'',den:'',dde:'',price:'€1.30 / 1.60'},
    {it:'Cornetto Grande Vuoto / Pieno',en:'Large Croissant Plain / Filled',de:'Großes Croissant Leer / Gefüllt',dit:'',den:'',dde:'',price:'€2.00 / 2.20'},
    {it:'Pane Tostato ai Cereali',en:'Toasted Grain Bread',de:'Geröstetes Körner­brot',dit:'Burro e marmellata / Nutella',den:'Butter and jam / Nutella',dde:'Butter und Marmelade / Nutella',price:'€4.00'},
    {it:'French Toast Fatti in Casa',en:'Homemade French Toast',de:'Hausgemachter French Toast',dit:'Sciroppo d\'acero / Nutella / Marmellata',den:'Maple syrup / Nutella / Jam',dde:'Ahornsirup / Nutella / Marmelade',price:'€6.00'},
    {it:'Pancake',en:'Pancake',de:'Pancake',dit:'Sciroppo d\'acero / Nutella / Marmellata',den:'Maple syrup / Nutella / Jam',dde:'Ahornsirup / Nutella / Marmelade',price:'€6.00'},
    {it:'Le Nostre Crostate',en:'Our Fruit Tarts',de:'Unsere Obstkuchen',dit:'Fatti in casa — Classic €4 / Special €5',den:'Homemade — Classic €4 / Special €5',dde:'Hausgemacht — Classic €4 / Special €5',price:'€4.00 / 5.00'},
    {it:'I Nostri Cookies',en:'Our Cookies',de:'Unsere Cookies',dit:'Fatti in casa — Classic €3 / Special €4',den:'Homemade — Classic €3 / Special €4',dde:'Hausgemacht — Classic €3 / Special €4',price:'€3.00 / 4.00'},
    {it:'I Nostri Biscotti',en:'Our Biscuits',de:'Unsere Kekse',dit:'Fatti in casa — Shortbread, Danese, Girella, alla Nocciola',den:'Homemade — Shortbread, Danish, Girella, Hazelnut',dde:'Hausgemacht — Shortbread, Dänisch, Girella, Haselnuss',price:'€1.00 / 1.50 / 2.00'},
    {it:'Cinnamon Roll',en:'Cinnamon Roll',de:'Zimtschnecke',dit:'Fatti in casa — Solo nel weekend — Classic €4 / Special €5',den:'Homemade — Weekends only — Classic €4 / Special €5',dde:'Hausgemacht — Nur am Wochenende — Classic €4 / Special €5',price:'€4.00 / 5.00'},
    {it:'Yogurt e la Nostra Granola',en:'Yogurt and Our Granola',de:'Joghurt mit unserer Granola',dit:'Classico €4 / Greco €5 / Special €8',den:'Classic €4 / Greek €5 / Special €8',dde:'Klassisch €4 / Griechisch €5 / Special €8',price:'€4.00 – 8.00'},
    {it:'Special Double Chocolate',en:'Special Double Chocolate',de:'Special Double Chocolate',dit:'Da ottobre a marzo — Arancia e Cannella €7, Caramello Salato €7, Black Hush €7',den:'October to March — Orange & Cinnamon €7, Salted Caramel €7, Black Hush €7',dde:'Oktober bis März — Orange & Zimt €7, Gesalzenes Karamell €7, Black Hush €7',price:'€7.00'},
  ],
  cucina: [
    {it:'Brioche o Cornetto ai Cereali',en:'Brioche or Grain Croissant',de:'Brioche oder Körner-Croissant',dit:'Crema di formaggio, mortadella o prosciutto €7 — Ragù €8',den:'Cheese cream, mortadella or ham €7 — Ragù €8',dde:'Frischkäse, Mortadella oder Schinken €7 — Ragù €8',price:'€7.00 / 8.00'},
    {it:'15x15 Big Toast',en:'15x15 Big Toast',de:'15x15 Big Toast',dit:'Prosciutto cotto e formaggio €7 / Pancetta e formaggio fumé €8 / Vegetariano €7',den:'Ham and cheese €7 / Smoked pancetta and cheese €8 / Vegetarian €7',dde:'Schinken und Käse €7 / Speck und Räucherkäse €8 / Vegetarisch €7',price:'€7.00 / 8.00'},
    {it:'Avocado Toast ai Cereali',en:'Grain Avocado Toast',de:'Körner Avocado Toast',dit:'Classico €10 / Special €12',den:'Classic €10 / Special €12',dde:'Klassisch €10 / Special €12',price:'€10.00 / 12.00'},
    {it:'Croque Hush',en:'Croque Hush',de:'Croque Hush',dit:'15 min cottura — Gratinato con béchamelle al formaggio. Prosciutto cotto e formaggio €8 / Prosciutto, formaggio e blu €8 / Prosciutto, formaggio e miele tartufato €10',den:'15 min cooking — Gratinated with cheese béchamel. Ham & cheese €8 / Ham, cheese & blue €8 / Ham, cheese & truffle honey €10',dde:'15 Min. Garzeit — Mit Käsebéchamel überbacken. Schinken & Käse €8 / Schinken, Käse & Blauschimmel €8 / Schinken, Käse & Trüffelhonig €10',price:'€8.00 / 10.00'},
    {it:'Insalata del Giorno',en:'Salad of the Day',de:'Tagessalat',dit:'Tonno, uovo sodo, feta, salmone, patate, pollo',den:'Tuna, hard-boiled egg, feta, salmon, potatoes, chicken',dde:'Thunfisch, gekochtes Ei, Feta, Lachs, Kartoffeln, Hähnchen',price:'€8.00 / 10.00 / 12.00'},
    {it:'Piatto o Zuppa del Giorno',en:'Dish or Soup of the Day',de:'Tagesgericht oder Suppe',dit:'',den:'',dde:'',price:'€8.00 / 10.00 / 12.00'},
    {it:'Aperitivo Gourmet',en:'Gourmet Aperitif',de:'Gourmet-Aperitif',dit:'Min. 2 persone',den:'Min. 2 people',dde:'Min. 2 Personen',price:'€12.00'},
  ],
  cocktails: [
    {it:'Aperol Spritz',en:'Aperol Spritz',de:'Aperol Spritz',dit:'Prosecco Extra Dry, Aperol, Soda',den:'Prosecco Extra Dry, Aperol, Soda',dde:'Prosecco Extra Dry, Aperol, Soda',price:'€8.00'},
    {it:'Campari Spritz',en:'Campari Spritz',de:'Campari Spritz',dit:'Prosecco Extra Dry, Campari, Soda',den:'Prosecco Extra Dry, Campari, Soda',dde:'Prosecco Extra Dry, Campari, Soda',price:'€8.00'},
    {it:'Hugo Spritz',en:'Hugo Spritz',de:'Hugo Spritz',dit:'Prosecco Extra Dry, Elderflower, Soda',den:'Prosecco Extra Dry, Elderflower, Soda',dde:'Prosecco Extra Dry, Holunderblüte, Soda',price:'€8.00'},
    {it:'Amalfi Spritz',en:'Amalfi Spritz',de:'Amalfi Spritz',dit:'Prosecco Extra Dry, Limoncello, Soda',den:'Prosecco Extra Dry, Limoncello, Soda',dde:'Prosecco Extra Dry, Limoncello, Soda',price:'€8.00'},
    {it:'Falltime Spritz',en:'Falltime Spritz',de:'Falltime Spritz',dit:'Prosecco Extra Dry, Nocillo, Soda',den:'Prosecco Extra Dry, Nocillo, Soda',dde:'Prosecco Extra Dry, Nocillo, Soda',price:'€8.00'},
    {it:'Black Spritz',en:'Black Spritz',de:'Black Spritz',dit:'Prosecco Extra Dry, Liquirizia, Soda',den:'Prosecco Extra Dry, Liquorice, Soda',dde:'Prosecco Extra Dry, Lakritze, Soda',price:'€8.00'},
    {it:'Virgin Spritz',en:'Virgin Spritz',de:'Virgin Spritz',dit:'Succo d\'arancia, Bitter analcolico, Soda',den:'Orange juice, Alcohol-free bitter, Soda',dde:'Orangensaft, Alkoholfreier Bitter, Soda',price:'€8.00'},
    {it:'N°5',en:'N°5',de:'N°5',dit:'Bourbon Four Roses, Lime, Sciroppo di zucchero, Campari',den:'Bourbon Four Roses, Lime, Sugar syrup, Campari',dde:'Bourbon Four Roses, Limette, Zuckersirup, Campari',price:'€10.00'},
    {it:'Exotic Vesuvius',en:'Exotic Vesuvius',de:'Exotic Vesuvius',dit:'Passoa, Gin Vesuvius, Lime, Top Schweppes Lemon',den:'Passoa, Gin Vesuvius, Lime, Top Schweppes Lemon',dde:'Passoa, Gin Vesuvius, Limette, Top Schweppes Lemon',price:'€10.00'},
    {it:'Mr Hush',en:'Mr Hush',de:'Mr Hush',dit:'Tequila bianca, Tequila invecchiata, Triplesec, Lime, Sciroppo di zucchero, Frutto della passione',den:'White tequila, Aged tequila, Triple sec, Lime, Sugar syrup, Passion fruit',dde:'Weißer Tequila, Gereifter Tequila, Triple Sec, Limette, Zuckersirup, Maracuja',price:'€12.00'},
    {it:'Boulevardier',en:'Boulevardier',de:'Boulevardier',dit:'Whiskey, Vermouth Rosso, Campari',den:'Whiskey, Red Vermouth, Campari',dde:'Whiskey, Roter Wermut, Campari',price:'€10.00'},
    {it:'Americano',en:'Americano',de:'Americano',dit:'Vermouth Rosso, Campari, Soda',den:'Red Vermouth, Campari, Soda',dde:'Roter Wermut, Campari, Soda',price:'€9.00'},
    {it:'Old Fashioned',en:'Old Fashioned',de:'Old Fashioned',dit:'Bourbon, Zucchero, Angostura, Soda',den:'Bourbon, Sugar, Angostura, Soda',dde:'Bourbon, Zucker, Angostura, Soda',price:'€9.00'},
    {it:'Margarita',en:'Margarita',de:'Margarita',dit:'Tequila, Triple Sec, Lime',den:'Tequila, Triple Sec, Lime',dde:'Tequila, Triple Sec, Limette',price:'€9.00'},
    {it:'Negroni',en:'Negroni',de:'Negroni',dit:'Gin, Vermouth Rosso, Campari',den:'Gin, Red Vermouth, Campari',dde:'Gin, Roter Wermut, Campari',price:'€9.00'},
    {it:'Martini Dry',en:'Martini Dry',de:'Martini Dry',dit:'Gin, Dry Vermouth',den:'Gin, Dry Vermouth',dde:'Gin, Trockener Wermut',price:'€9.00'},
    {it:'Paloma',en:'Paloma',de:'Paloma',dit:'Tequila, Soda al pompelmo, Lime, Sale',den:'Tequila, Grapefruit soda, Lime, Salt',dde:'Tequila, Grapefruitsoda, Limette, Salz',price:'€9.00'},
    {it:'Gin Tonic 0.0',en:'Gin Tonic 0.0',de:'Gin Tonic 0.0',dit:'Gin Tanqueray 0.0',den:'Gin Tanqueray 0.0',dde:'Gin Tanqueray 0.0',price:'€9.00'},
    {it:'Shirley Temple',en:'Shirley Temple',de:'Shirley Temple',dit:'Ginger Ale, Granatina',den:'Ginger Ale, Grenadine',dde:'Ginger Ale, Grenadine',price:'€8.00'},
    {it:'Virgin Paloma',en:'Virgin Paloma',de:'Virgin Paloma',dit:'Succo di lime, Soda al pompelmo rosa, Sciroppo d\'agave, Sale',den:'Lime juice, Pink grapefruit soda, Agave syrup, Salt',dde:'Limettensaft, Rosa Grapefruitsoda, Agavensirup, Salz',price:'€8.00'},
  ],
  gin: [
    {it:'Tanqueray',en:'Tanqueray',de:'Tanqueray',dit:'London Dry',den:'London Dry',dde:'London Dry',price:'€8.00'},
    {it:'Plymouth',en:'Plymouth',de:'Plymouth',dit:'Inghilterra, Plymouth Gin',den:'England, Plymouth Gin',dde:'England, Plymouth Gin',price:'€8.00'},
    {it:'Gin Mare',en:'Gin Mare',de:'Gin Mare',dit:'Spagna',den:'Spain',dde:'Spanien',price:'€9.00'},
    {it:'Bombay',en:'Bombay',de:'Bombay',dit:'Inghilterra',den:'England',dde:'England',price:'€9.00'},
    {it:'Hendrick\'s',en:'Hendrick\'s',de:'Hendrick\'s',dit:'Scozia',den:'Scotland',dde:'Schottland',price:'€10.00'},
    {it:'Roku',en:'Roku',de:'Roku',dit:'Giappone',den:'Japan',dde:'Japan',price:'€10.00'},
    {it:'Vesuvius',en:'Vesuvius',de:'Vesuvius',dit:'Campania',den:'Campania',dde:'Kampanien',price:'€12.00'},
  ],
  vini: [
    {it:'Falanghina',en:'Falanghina',de:'Falanghina',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€6 / 25'},
    {it:'Fiano',en:'Fiano',de:'Fiano',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 28'},
    {it:'Greco di Tufo',en:'Greco di Tufo',de:'Greco di Tufo',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 30'},
    {it:'Chardonnay',en:'Chardonnay',de:'Chardonnay',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 28'},
    {it:'Gewürztraminer',en:'Gewürztraminer',de:'Gewürztraminer',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 30'},
    {it:'Sauvignon',en:'Sauvignon',de:'Sauvignon',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 28'},
    {it:'Ribolla Gialla',en:'Ribolla Gialla',de:'Ribolla Gialla',dit:'Vino Bianco',den:'White Wine',dde:'Weißwein',price:'€7 / 28'},
    {it:'Vita Nuova',en:'Vita Nuova',de:'Vita Nuova',dit:'Vino Rosè',den:'Rosé Wine',dde:'Roséwein',price:'€7 / 28'},
    {it:'Pinot Ramato',en:'Pinot Ramato',de:'Pinot Ramato',dit:'Vino Rosè',den:'Rosé Wine',dde:'Roséwein',price:'€7 / 28'},
    {it:'Aglianico',en:'Aglianico',de:'Aglianico',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€6 / 25'},
    {it:'Taurasi',en:'Taurasi',de:'Taurasi',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€8 / 35'},
    {it:'Piedirosso',en:'Piedirosso',de:'Piedirosso',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€7 / 30'},
    {it:'Pinot Nero',en:'Pinot Nero',de:'Pinot Nero',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€7 / 30'},
    {it:'Morellino',en:'Morellino',de:'Morellino',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€6 / 25'},
    {it:'Valpolicella Classico',en:'Valpolicella Classico',de:'Valpolicella Classico',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€8 / 30'},
    {it:'Chianti',en:'Chianti',de:'Chianti',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'€6 / 25'},
    {it:'El Sior Prosecco Extra Dry',en:'El Sior Prosecco Extra Dry',de:'El Sior Prosecco Extra Dry',dit:'Veneto — Calice / Bottiglia',den:'Veneto — Glass / Bottle',dde:'Veneto — Glas / Flasche',price:'€7 / 28'},
    {it:'Berlucchi Saten',en:'Berlucchi Saten',de:'Berlucchi Saten',dit:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',den:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',dde:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',price:'€10 / 40'},
    {it:'Berlucchi Rosé',en:'Berlucchi Rosé',de:'Berlucchi Rosé',dit:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',den:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',dde:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',price:'€10 / 40'},
    {it:'Santa Margherita Valdobbiadene',en:'Santa Margherita Valdobbiadene',de:'Santa Margherita Valdobbiadene',dit:'Calice / Bottiglia',den:'Glass / Bottle',dde:'Glas / Flasche',price:'€7 / 25'},
    {it:'Ca\' del Bosco',en:'Ca\' del Bosco',de:'Ca\' del Bosco',dit:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',den:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',dde:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',price:'€70'},
    {it:'Laurent Perrier Champagne',en:'Laurent Perrier Champagne',de:'Laurent Perrier Champagne',dit:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',den:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',dde:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',price:'€80'},
    {it:'Louis Roederer — Collection',en:'Louis Roederer — Collection',de:'Louis Roederer — Collection',dit:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',den:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',dde:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',price:'€115'},
    {it:'Louis Roederer — Vintage',en:'Louis Roederer — Vintage',de:'Louis Roederer — Vintage',dit:'70% Pinot Noir 30% Chardonnay',den:'70% Pinot Noir 30% Chardonnay',dde:'70% Pinot Noir 30% Chardonnay',price:'€170'},
    {it:'Louis Roederer — Rosé',en:'Louis Roederer — Rosé',de:'Louis Roederer — Rosé',dit:'65% Pinot Noir 35% Chardonnay',den:'65% Pinot Noir 35% Chardonnay',dde:'65% Pinot Noir 35% Chardonnay',price:'€180'},
    {it:'Louis Roederer — Blanc de Blancs',en:'Louis Roederer — Blanc de Blancs',de:'Louis Roederer — Blanc de Blancs',dit:'100% Chardonnay',den:'100% Chardonnay',dde:'100% Chardonnay',price:'€185'},
    {it:'Louis Roederer — Cristal',en:'Louis Roederer — Cristal',de:'Louis Roederer — Cristal',dit:'55% Pinot Nero 45% Chardonnay',den:'55% Pinot Nero 45% Chardonnay',dde:'55% Pinot Nero 45% Chardonnay',price:'€470'},
  ],
  spirits: [
    {it:'Macallan',en:'Macallan',de:'Macallan',dit:'Whiskey — Ispeyside, Scozia',den:'Whiskey — Ispeyside, Scotland',dde:'Whiskey — Ispeyside, Schottland',price:'€14.00'},
    {it:'Lagavulin 16',en:'Lagavulin 16',de:'Lagavulin 16',dit:'Whiskey — Islay, Scozia',den:'Whiskey — Islay, Scotland',dde:'Whiskey — Islay, Schottland',price:'€14.00'},
    {it:'Oban 14',en:'Oban 14',de:'Oban 14',dit:'Whiskey — Highland, Scozia',den:'Whiskey — Highland, Scotland',dde:'Whiskey — Highland, Schottland',price:'€12.00'},
    {it:'Nikka From The Barrel',en:'Nikka From The Barrel',de:'Nikka From The Barrel',dit:'Whiskey — Giappone',den:'Whiskey — Japan',dde:'Whiskey — Japan',price:'€12.00'},
    {it:'Bulleit Rye',en:'Bulleit Rye',de:'Bulleit Rye',dit:'Whiskey — Kentucky, Stati Uniti',den:'Whiskey — Kentucky, USA',dde:'Whiskey — Kentucky, USA',price:'€8.00'},
    {it:'Johnnie Walker Black Label',en:'Johnnie Walker Black Label',de:'Johnnie Walker Black Label',dit:'Whiskey — Scozia',den:'Whiskey — Scotland',dde:'Whiskey — Schottland',price:'€8.00'},
    {it:'Zacapa 23',en:'Zacapa 23',de:'Zacapa 23',dit:'Rum — Cuba',den:'Rum — Cuba',dde:'Rum — Kuba',price:'€12.00'},
    {it:'Havana Club 3',en:'Havana Club 3',de:'Havana Club 3',dit:'Rum — Cuba',den:'Rum — Cuba',dde:'Rum — Kuba',price:'€8.00'},
    {it:'Havana Club 7',en:'Havana Club 7',de:'Havana Club 7',dit:'Rum — Cuba',den:'Rum — Cuba',dde:'Rum — Kuba',price:'€8.00'},
    {it:'Diplomatico',en:'Diplomatico',de:'Diplomatico',dit:'Rum — Lara, Venezuela',den:'Rum — Lara, Venezuela',dde:'Rum — Lara, Venezuela',price:'€10.00'},
    {it:'Agricol J.M. Fumée Volcanique',en:'Agricol J.M. Fumée Volcanique',de:'Agricol J.M. Fumée Volcanique',dit:'Rum — Martinica, Caraibi',den:'Rum — Martinique, Caribbean',dde:'Rum — Martinique, Karibik',price:'€10.00'},
    {it:'Don Papa Baroko',en:'Don Papa Baroko',de:'Don Papa Baroko',dit:'Rum — Isola di Negros, Philippine',den:'Rum — Negros Island, Philippines',dde:'Rum — Insel Negros, Philippinen',price:'€10.00'},
    {it:'Hors d\'Age Dartigalongue',en:'Hors d\'Age Dartigalongue',de:'Hors d\'Age Dartigalongue',dit:'Cognac & Brandy — Armagnac, Francia',den:'Cognac & Brandy — Armagnac, France',dde:'Cognac & Brandy — Armagnac, Frankreich',price:'€10.00'},
    {it:'Nistru XO',en:'Nistru XO',de:'Nistru XO',dit:'Cognac & Brandy — Moldova',den:'Cognac & Brandy — Moldova',dde:'Cognac & Brandy — Moldau',price:'€8.00'},
    {it:'Poli Bassano Bianca',en:'Poli Bassano Bianca',de:'Poli Bassano Bianca',dit:'Grappa — Veneto',den:'Grappa — Veneto',dde:'Grappa — Venetien',price:'€6.00'},
    {it:'Poli Bassano Barrique',en:'Poli Bassano Barrique',de:'Poli Bassano Barrique',dit:'Grappa — Veneto',den:'Grappa — Veneto',dde:'Grappa — Venetien',price:'€6.00'},
    {it:'Espolon Blanco',en:'Espolon Blanco',de:'Espolon Blanco',dit:'Tequila — Jalisco, Messico',den:'Tequila — Jalisco, Mexico',dde:'Tequila — Jalisco, Mexiko',price:'€8.00'},
    {it:'Espolon Reposado',en:'Espolon Reposado',de:'Espolon Reposado',dit:'Tequila — Jalisco, Messico',den:'Tequila — Jalisco, Mexico',dde:'Tequila — Jalisco, Mexiko',price:'€8.00'},
    {it:'Montelobos Oaxaca',en:'Montelobos Oaxaca',de:'Montelobos Oaxaca',dit:'Tequila — Oaxaca, Messico',den:'Tequila — Oaxaca, Mexico',dde:'Tequila — Oaxaca, Mexiko',price:'€10.00'},
    {it:'Stolichnaya Elit',en:'Stolichnaya Elit',de:'Stolichnaya Elit',dit:'Vodka — Tambov, Russia',den:'Vodka — Tambov, Russia',dde:'Vodka — Tambov, Russland',price:'€10.00'},
    {it:'Hetman',en:'Hetman',de:'Hetman',dit:'Vodka — Ucraina',den:'Vodka — Ukraine',dde:'Vodka — Ukraine',price:'€8.00'},
    {it:'Zubrowka Black',en:'Zubrowka Black',de:'Zubrowka Black',dit:'Vodka — Polonia',den:'Vodka — Poland',dde:'Vodka — Polen',price:'€8.00'},
    {it:'Vin Santo Frescobaldi',en:'Vin Santo Frescobaldi',de:'Vin Santo Frescobaldi',dit:'Vini Dolci — Toscana, Frescobaldi',den:'Dessert Wine — Tuscany, Frescobaldi',dde:'Dessertwein — Toskana, Frescobaldi',price:'€8.00'},
    {it:'Dios',en:'Dios',de:'Dios',dit:'Amaro — Campania',den:'Amaro — Campania',dde:'Amaro — Kampanien',price:'€6.00'},
    {it:'Jefferson',en:'Jefferson',de:'Jefferson',dit:'Amaro — Calabria',den:'Amaro — Calabria',dde:'Amaro — Kalabrien',price:'€6.00'},
    {it:'Limoncello',en:'Limoncello',de:'Limoncello',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'€5.00'},
    {it:'Liquirizia',en:'Liquorice',de:'Lakritze',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'€5.00'},
    {it:'Rucolino',en:'Rucolino',de:'Rucolino',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'€5.00'},
    {it:'Nocino',en:'Nocino',de:'Nocino',dit:'Amaro — Campania',den:'Amaro — Campania',dde:'Amaro — Kampanien',price:'€5.00'},
  ],
  birre: [
    {it:'Nastro Azzurro',en:'Nastro Azzurro',de:'Nastro Azzurro',dit:'Birra',den:'Beer',dde:'Bier',price:'€5.00'},
    {it:'Ichnusa Non Filtrata',en:'Ichnusa Unfiltered',de:'Ichnusa Ungefiltert',dit:'Birra',den:'Beer',dde:'Bier',price:'€5.00'},
    {it:'Artigianale',en:'Craft Beer',de:'Handwerksbier',dit:'Birra',den:'Beer',dde:'Bier',price:'€6.00'},
    {it:'Corona',en:'Corona',de:'Corona',dit:'Birra',den:'Beer',dde:'Bier',price:'€6.00'},
    {it:'Spremuta d\'Arancia',en:'Fresh Orange Juice',de:'Frisch gepresster Orangensaft',dit:'',den:'',dde:'',price:'€5.00'},
    {it:'Succhi di Frutta',en:'Fruit Juices',de:'Fruchtsäfte',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Succo di Pomodoro Condito',en:'Seasoned Tomato Juice',de:'Gewürzter Tomatensaft',dit:'',den:'',dde:'',price:'€4.00'},
    {it:'Acqua Filette Piccola / Grande',en:'Filette Water Small / Large',de:'Filette Wasser Klein / Groß',dit:'',den:'',dde:'',price:'€2.50 / 3.00'},
    {it:'Tè Freddo / Special',en:'Iced Tea / Special',de:'Eistee / Special',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Coca Cola Original / Zero',en:'Coca Cola Original / Zero',de:'Coca Cola Original / Zero',dit:'',den:'',dde:'',price:'€2.50'},
    {it:'Tassoni / Chinotto',en:'Tassoni / Chinotto',de:'Tassoni / Chinotto',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Bitter Bianco / Rosso',en:'White / Red Bitter',de:'Weißer / Roter Bitter',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Campari Soda',en:'Campari Soda',de:'Campari Soda',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Fever Tree Acqua Tonica',en:'Fever Tree Tonic Water',de:'Fever Tree Tonic Water',dit:'Indian, Mediterranea, Elderflower',den:'Indian, Mediterranean, Elderflower',dde:'Indian, Mediterran, Holunderblüte',price:'€3.00'},
    {it:'Ginger Beer Fever Tree',en:'Ginger Beer Fever Tree',de:'Ginger Beer Fever Tree',dit:'',den:'',dde:'',price:'€3.00'},
    {it:'Ginger Ale Fever Tree',en:'Ginger Ale Fever Tree',de:'Ginger Ale Fever Tree',dit:'',den:'',dde:'',price:'€3.00'},
  ],
};


let activeCat = 'colazione';
function renderMenu(cat) {
  activeCat = cat;
  document.getElementById('menuGrid').innerHTML = menuData[cat].map(i => `
    <div class="menu-item"> <div> <div class="menu-item-name">${lang==='de'?(i.de||i.en):lang==='en'?i.en:i.it}</div> <div class="menu-item-desc">${lang==='de'?(i.dde||i.den):lang==='en'?i.den:i.dit}</div> </div> <div class="menu-item-price">${i.price}</div> </div>`).join('');
}
document.getElementById('menuTabs').querySelectorAll('.menu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
});
// ─── LOCALSTORAGE PERSISTENCE ─────────────────────────────────────────────
function saveToStorage() {
  try {
    localStorage.setItem('hn_menu', JSON.stringify(menuData));
    localStorage.setItem('hn_hours', JSON.stringify(hoursData));
  } catch(e) { console.log('Storage error:', e); }
}

function loadFromStorage() {
  try {
    var savedMenu = localStorage.getItem('hn_menu');
    var savedHours = localStorage.getItem('hn_hours');
    if(savedMenu) {
      var parsed = JSON.parse(savedMenu);
      Object.keys(parsed).forEach(function(cat) {
        if(menuData[cat]) menuData[cat] = parsed[cat];
      });
    }
    if(savedHours) {
      var parsedH = JSON.parse(savedHours);
      parsedH.forEach(function(h, i) {
        if(hoursData[i]) hoursData[i].time = h.time;
      });
    }
  } catch(e) { console.log('Load error:', e); }
}
loadFromStorage();
renderMenu('caffetteria');

const hoursData = [
  {day_it:'Lunedì',day_en:'Monday',day_de:'Montag',time:'07:30 – 22:00'},
  {day_it:'Martedì',day_en:'Tuesday',day_de:'Dienstag',time:'07:30 – 22:00'},
  {day_it:'Mercoledì',day_en:'Wednesday',day_de:'Mittwoch',time:'07:30 – 22:00'},
  {day_it:'Giovedì',day_en:'Thursday',day_de:'Donnerstag',time:'07:30 – 22:00'},
  {day_it:'Venerdì',day_en:'Friday',day_de:'Freitag',time:'07:30 – 23:00'},
  {day_it:'Sabato',day_en:'Saturday',day_de:'Samstag',time:'08:00 – 23:00'},
  {day_it:'Domenica',day_en:'Sunday',day_de:'Sonntag',time:'',closed_it:'Chiuso',closed_en:'Closed',closed_de:'Geschlossen'},
];
function renderHours() {
  document.getElementById('hoursGrid').innerHTML = hoursData.map(h => `
    <div class="hours-card"> <div class="hours-day">${lang==='de'?h.day_de:lang==='en'?h.day_en:h.day_it}</div> <div class="hours-time ${h.time?'':'hours-closed'}">${h.time||(lang==='de'?h.closed_de:lang==='en'?h.closed_en:h.closed_it)}</div> </div>`).join('');
}
renderHours();

function submitReservation(e) {
  e.preventDefault();
  const name    = document.getElementById('resName').value.trim();
  const contact = document.getElementById('resContact').value.trim();
  const date    = document.getElementById('resDate').value;
  const time    = document.getElementById('resTime').value;
  const guests  = document.getElementById('resGuests').value;
  const occasion= document.getElementById('resOccasion').value || '—';
  const notes   = document.getElementById('resNotes').value.trim() || '—';
  if(!name||!contact||!date||!time||!guests){
    alert(lang==='it'?'Compila tutti i campi obbligatori.':'Please fill in all required fields.');
    return;
  }
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;
  const message = '🍽 <b>NUOVA PRENOTAZIONE</b>\n<b>HUSHNOW CAFÉ °5</b>\n\n👤 <b>Nome:</b> '+name+'\n📞 <b>Contatto:</b> '+contact+'\n📅 <b>Data:</b> '+date+'\n🕐 <b>Orario:</b> '+time+'\n👥 <b>Persone:</b> '+guests+'\n🎉 <b>Occasione:</b> '+occasion+'\n📝 <b>Note:</b> '+notes;
  Promise.all([
    fetch('https://formspree.io/f/mgoqoyyd', {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({_subject:'Prenotazione HUSHNOW CAFÉ °5 — '+date+' ore '+time, nome:name, contatto:contact, data:date, orario:time, persone:guests, occasione:occasion, note:notes})
    }),
    sendTelegram(message)
  ]).catch(function(err){ console.log('Error:',err); }).finally(function(){
    btn.textContent = origText;
    btn.disabled = false;
    document.getElementById('resForm').style.display = 'none';
    document.getElementById('formConfirm').style.display = 'block';
  });
}

function resetForm() {
  document.getElementById('resForm').reset();
  document.getElementById('resForm').style.display='block';
  document.getElementById('formConfirm').style.display='none';
}

function selectToggle(groupId, btn) {
  document.querySelectorAll('#'+groupId+' .toggle-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
function getToggleVal(groupId) {
  const a=document.querySelector('#'+groupId+' .toggle-btn.active');
  return a?a.dataset.val:'no';
}
function submitEvent(e) {
  e.preventDefault();
  const name    = document.getElementById('evName').value.trim();
  const contact = document.getElementById('evContact').value.trim();
  const date    = document.getElementById('evDate').value;
  const time    = document.getElementById('evTime').value;
  const guests  = document.getElementById('evGuests').value;
  const type    = document.getElementById('evType').value;
  const ff      = getToggleVal('ffGroup') === 'si' ? 'Si ✓' : 'No';
  const dj      = getToggleVal('djGroup') === 'si' ? 'Si ✓' : 'No';
  const notes   = document.getElementById('evNotes').value.trim() || '—';
  if(!name||!contact||!date||!time||!guests||!type){
    alert(lang==='it'?'Compila tutti i campi obbligatori.':'Please fill in all required fields.');
    return;
  }
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;
  const message = '🎉 <b>NUOVO EVENTO</b>\n<b>HUSHNOW CAFÉ °5</b>\n\n👤 <b>Nome:</b> '+name+'\n📞 <b>Contatto:</b> '+contact+'\n📅 <b>Data:</b> '+date+'\n🕐 <b>Orario:</b> '+time+'\n👥 <b>Ospiti:</b> '+guests+'\n🎭 <b>Tipo:</b> '+type+'\n🍢 <b>Finger Food:</b> '+ff+'\n🎵 <b>DJ Set:</b> '+dj+'\n📝 <b>Note:</b> '+notes;
  Promise.all([
    fetch('https://formspree.io/f/mnjrjvzn', {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({_subject:'Richiesta Evento HUSHNOW CAFÉ °5 — '+date+' — '+type, nome:name, contatto:contact, data:date, orario:time, ospiti:guests, tipo:type, finger_food:ff, dj_set:dj, note:notes})
    }),
    sendTelegram(message)
  ]).catch(function(err){ console.log('Error:',err); }).finally(function(){
    btn.textContent = origText;
    btn.disabled = false;
    document.getElementById('eventForm').style.display = 'none';
    document.getElementById('eventConfirm').style.display = 'block';
  });
}

function resetEvent() {
  document.getElementById('eventForm').reset();
  document.getElementById('eventForm').style.display='block';
  document.getElementById('eventConfirm').style.display='none';
  document.querySelectorAll('#ffGroup .toggle-btn,#djGroup .toggle-btn').forEach((b,i)=>b.classList.toggle('active',i%2===0));
}

const galleryItems = [
  {key:'espresso',    cap_it:'Espresso Napoletano',  cap_en:'Neapolitan Espresso'},
  {key:'cappuccino',  cap_it:'Cappuccino in Vetro',  cap_en:'Glass Cappuccino'},
  {key:'matcha',      cap_it:'Matcha Latte',         cap_en:'Matcha Latte'},
  {key:'cocktail_red',cap_it:'Signature Cocktail',   cap_en:'Signature Cocktail'},
  {key:'dryice',      cap_it:'Cocktail con Dry Ice', cap_en:'Dry Ice Cocktail'},
  {key:'hn_mug',      cap_it:'Colazione Hushnow',    cap_en:'Hushnow Breakfast'},
  {key:'tea',         cap_it:'Servizio Tè',          cap_en:'Tea Service'},
  {key:'croissants',  cap_it:'Cornetto Artigianale', cap_en:'Artisan Croissant'},
];
function renderGallery() {
  document.getElementById('galleryGrid').innerHTML = galleryItems.map((it,i)=>`
    <div class="gallery-item" style="animation-delay:${i*0.07}s" onclick="openLightbox('${it.key}')"> <img src="${IMGS[it.key]}" alt="${lang==='it'?it.cap_it:it.cap_en}" loading="lazy" decoding="async"/> <div class="gallery-caption">${lang==='it'?it.cap_it:it.cap_en}</div> </div>`).join('');
}
renderGallery();

function openLightbox(key) {
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lbImg');
  if(!lb||!img) return;
  img.src=IMGS[key];
  lb.style.display='flex';
  document.body.style.overflow='hidden';
}
const lb=document.getElementById('lightbox');
if(lb) lb.addEventListener('click',()=>{lb.style.display='none';document.body.style.overflow='';});

document.getElementById('heroBg').style.backgroundImage = 'url(' + LOGO_SRC + ')';

const reviews = [
  { stars:5, text_it:"Un posto meraviglioso nel cuore di Napoli. Il caffè è eccezionale e l'atmosfera è unica. Ci torneremo sicuramente!", text_en:"A wonderful place in the heart of Naples. The coffee is exceptional and the atmosphere is unique. We will definitely come back!", text_de:"Ein wunderbarer Ort im Herzen von Neapel. Der Kaffee ist außergewöhnlich und die Atmosphäre einzigartig. Wir kommen definitiv wieder!", author:"Sofia M.", flag:"🇮🇹" },
  { stars:5, text_it:"Il miglior matcha latte che abbia mai assaggiato a Napoli. Il design del locale è raffinatissimo.", text_en:"The best matcha latte I've ever had in Naples. The interior design is incredibly refined.", text_de:"Der beste Matcha Latte, den ich je in Neapel getrunken habe. Das Interieur ist unglaublich raffiniert.", author:"Thomas K.", flag:"🇩🇪" },
  { stars:5, text_it:"Aperitivo perfetto, cocktail creativi e personale gentilissimo. Un'esperienza da non perdere!", text_en:"Perfect aperitif, creative cocktails and very kind staff. An experience not to be missed!", text_de:"Perfekter Aperitif, kreative Cocktails und sehr freundliches Personal. Ein Erlebnis, das man nicht verpassen sollte!", author:"Emma L.", flag:"🇬🇧" },
  { stars:5, text_it:"L'atmosfera è magica, sembrava di essere in un set fotografico. I croissant sono deliziosi.", text_en:"The atmosphere is magical, it felt like being in a photo shoot. The croissants are delicious.", text_de:"Die Atmosphäre ist magisch, es fühlte sich an wie in einem Fotoshooting. Die Croissants sind köstlich.", author:"Giulia R.", flag:"🇮🇹" },
  { stars:5, text_it:"Posto unico a Napoli. La colazione qui è un rituale, non solo un pasto. Tornerò presto!", text_en:"Unique place in Naples. Breakfast here is a ritual, not just a meal. I will be back soon!", text_de:"Einzigartiger Ort in Neapel. Das Frühstück hier ist ein Ritual. Ich komme bald wieder!", author:"Marco B.", flag:"🇮🇹" },
  { stars:5, text_it:"Servizio impeccabile, ambiente elegante e caffè napoletano autentico. Consigliatissimo!", text_en:"Impeccable service, elegant atmosphere and authentic Neapolitan coffee. Highly recommended!", text_de:"Tadelloser Service, elegante Atmosphäre und authentischer neapolitanischer Kaffee. Sehr empfehlenswert!", author:"Hans W.", flag:"🇩🇪" },
];
function renderReviews() {
  const g = document.getElementById('reviewsGrid');
  if(!g) return;
  const key = lang==='de' ? 'text_de' : lang==='en' ? 'text_en' : 'text_it';
  g.innerHTML = reviews.map((r,i) => `
    <div class="review-card" style="animation-delay:${i*0.1}s"> <div class="review-stars">${'★'.repeat(r.stars)}</div> <p class="review-text">"${r[key]}"</p> <div class="review-author">${r.author} <span class="review-flag">${r.flag}</span></div> </div>`).join('');
}
renderReviews();

function drawQR() {
  const canvas = document.getElementById('qrCanvas');
  if(!canvas) return;
  const parent = canvas.parentNode;
  if(!parent) return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  script.onload = () => {
    
    const div = document.createElement('div');
    div.id = 'qrDiv';
    div.style.cssText = 'border-radius:12px;overflow:hidden;border:1px solid rgba(201,169,110,0.35);width:160px;height:160px;flex-shrink:0;';
    parent.replaceChild(div, canvas);
    new QRCode(div, {
      text: 'https://hushnowcafe.com',
      width: 160, height: 160,
      colorDark: '#080808', colorLight: '#F2EDE6',
      correctLevel: QRCode.CorrectLevel.H
    });
  };
  script.onerror = () => {
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F2EDE6';
    ctx.fillRect(0,0,160,160);
    ctx.fillStyle = '#080808';
    ctx.font = '10px Montserrat';
    ctx.textAlign = 'center';
    ctx.fillText('hushnowcafe.com', 80, 85);
  };
  document.head.appendChild(script);
}

setTimeout(drawQR, 100);

function downloadQR() {
  const div = document.getElementById('qrDiv');
  const img = div ? div.querySelector('img') : null;
  if(img) {
    const a = document.createElement('a');
    a.download = 'hushnow-qr.png';
    a.href = img.src;
    a.click();
  }
}

function initCookies() {
  if(!localStorage.getItem('hn_cookies')) {
    setTimeout(() => {
      document.getElementById('cookieBanner').style.display = 'flex';
    }, 3500);
  }
}
function acceptCookies() {
  localStorage.setItem('hn_cookies', 'accepted');
  hideCookie();
}
function declineCookies() {
  localStorage.setItem('hn_cookies', 'declined');
  hideCookie();
}
function hideCookie() {
  const b = document.getElementById('cookieBanner');
  b.style.transition = 'opacity 0.5s, transform 0.5s';
  b.style.opacity = '0';
  b.style.transform = 'translateY(20px)';
  setTimeout(() => b.style.display='none', 500);
}
initCookies();

const cookieTexts = {
  it: 'Utilizziamo i cookie per migliorare la tua esperienza. Continuando accetti la nostra <a href="#" style="color:var(--gold2)">Privacy Policy</a>. 🇪🇺 GDPR',
  en: 'We use cookies to improve your experience. By continuing you accept our <a href="#" style="color:var(--gold2)">Privacy Policy</a>. 🇪🇺 GDPR',
  de: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern. Durch die weitere Nutzung akzeptieren Sie unsere <a href="#" style="color:var(--gold2)">Datenschutzrichtlinie</a>. 🇪🇺 DSGVO',
};
const cookieBtnTexts = {
  it: ['Accetta', 'Solo necessari'], en: ['Accept', 'Necessary only'], de: ['Akzeptieren', 'Nur notwendige']
};
const origSetLang = setLang;

const _setLang = setLang;
window.setLang = function(l) {
  _setLang(l);
  const ct = document.getElementById('cookieText');
  const ca = document.getElementById('cookieAccept');
  const cd = document.getElementById('cookieDecline');
  if(ct) ct.innerHTML = cookieTexts[l]||cookieTexts.en;
  if(ca) ca.textContent = (cookieBtnTexts[l]||cookieBtnTexts.en)[0];
  if(cd) cd.textContent = (cookieBtnTexts[l]||cookieBtnTexts.en)[1];
};

;

const ADMIN_PWD = 'hushnow5';
let currentAdminCat = 'colazione';
let currentAdminLang = 'it';

function openAdmin() {
  const panel = document.getElementById('adminPanel');
  panel.style.setProperty('display', 'block', 'important');
  panel.classList.add('open');
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('adminDash').style.display = 'none';
  document.getElementById('loginErr').style.display = 'none';
  document.getElementById('adminPwd').value = '';
  // body scroll kept free for admin
  setTimeout(() => {
    const pwd = document.getElementById('adminPwd');
    if(pwd) pwd.focus();
  }, 100);
}

let adminKeySeq = '';
document.addEventListener('keydown', e => {
  if(document.getElementById('adminPanel').classList.contains('open')) return;
  adminKeySeq += e.key.toLowerCase();
  adminKeySeq = adminKeySeq.slice(-5);
  if(adminKeySeq === 'admin') { adminKeySeq = ''; openAdmin(); }
});

function closeAdmin() {
  const panel = document.getElementById('adminPanel');
  panel.classList.remove('open');
  panel.style.setProperty('display', 'none', 'important');
  
}

function checkPwd() {
  const pwd = document.getElementById('adminPwd').value;
  if (pwd === ADMIN_PWD) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDash').style.display = 'block';
    loadMenuAdmin('colazione', 'it');
    loadHoursAdmin();
  } else {
    document.getElementById('loginErr').style.display = 'block';
    document.getElementById('adminPwd').value = '';
  }
}

function switchAdminTab(tabId, clickedBtn) {
  document.querySelectorAll('#mainAdminTabs .admin-tab').forEach(function(t){ t.classList.remove('active'); });
  if(clickedBtn) clickedBtn.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(function(s){ s.classList.remove('active'); });
  var sec = document.getElementById('admin-' + tabId);
  if(sec) sec.classList.add('active');
  if(tabId==='menu-it') loadMenuAdmin('caffetteria','it');
  if(tabId==='menu-en') loadMenuAdmin('caffetteria','en');
  if(tabId==='menu-de') loadMenuAdmin('caffetteria','de');
  if(tabId==='hours-admin') loadHoursAdmin();
}

function loadMenuAdmin(cat, lang, btn) {
  currentAdminCat = cat;
  currentAdminLang = lang;
  if(btn) {
    btn.closest('div').querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
    btn.classList.add('active');
  }
  var list = document.getElementById('menuAdminList-' + lang);
  if(!list) return;
  var items = menuData[cat];
  var nameKey = lang==='it' ? 'it' : lang==='de' ? 'de' : 'en';
  var descKey = lang==='it' ? 'dit' : lang==='de' ? 'dde' : 'den';
  var html = '';
  for(var i=0; i<items.length; i++) {
    var item = items[i];
    html += '<div style="background:var(--bg3);border:1px solid rgba(201,169,110,0.2);border-radius:14px;padding:1.2rem;margin-bottom:0.8rem;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">';
    html += '<span style="font-family:Cormorant Garamond,serif;font-size:1rem;color:var(--gold2);">' + (item[nameKey]||item.en||'') + '</span>';
    html += '<button class="admin-del-btn" data-cat="'+cat+'" data-index="'+i+'" data-lang="'+lang+'" style="background:rgba(255,60,60,0.15);border:1px solid rgba(255,60,60,0.3);color:#ff6b6b;border-radius:8px;padding:0.3rem 0.8rem;cursor:pointer;font-size:0.7rem;">&#10005; Elimina</button>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 100px;gap:0.6rem;">';
    html += '<div><div style="font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem;">Nome</div>';
    html += '<input type="text" class="ai-name" data-cat="'+cat+'" data-index="'+i+'" value="'+(item[nameKey]||item.en||'').replace(/"/g,"&quot;").replace(/'/g,"&#39;")+'" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.2);border-radius:8px;color:var(--white);padding:0.5rem 0.7rem;font-family:Montserrat,sans-serif;font-size:0.75rem;outline:none;box-sizing:border-box;"/></div>';
    html += '<div><div style="font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem;">Descrizione</div>';
    html += '<input type="text" class="ai-desc" data-cat="'+cat+'" data-index="'+i+'" value="'+(item[descKey]||item.den||'').replace(/"/g,"&quot;").replace(/'/g,"&#39;")+'" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.2);border-radius:8px;color:var(--white);padding:0.5rem 0.7rem;font-family:Montserrat,sans-serif;font-size:0.75rem;outline:none;box-sizing:border-box;"/></div>';
    html += '<div><div style="font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem;">Prezzo</div>';
    html += '<input type="text" class="ai-price" data-cat="'+cat+'" data-index="'+i+'" value="'+(item.price||'')+'" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.2);border-radius:8px;color:var(--gold2);padding:0.5rem 0.7rem;font-family:Montserrat,sans-serif;font-size:0.75rem;outline:none;box-sizing:border-box;"/></div>';
    html += '</div></div>';
  }
  list.innerHTML = html;
  list.querySelectorAll('.admin-del-btn').forEach(function(btn2){
    btn2.addEventListener('click', function(){
      deleteMenuItem(this.dataset.cat, parseInt(this.dataset.index), this.dataset.lang);
    });
  });
}

function saveMenuAdmin(lang) {
  var nameKey = lang==='it' ? 'it' : lang==='de' ? 'de' : 'en';
  var descKey = lang==='it' ? 'dit' : lang==='de' ? 'dde' : 'den';
  var names = document.querySelectorAll('#menuAdminList-'+lang+' .ai-name');
  var descs = document.querySelectorAll('#menuAdminList-'+lang+' .ai-desc');
  var prices = document.querySelectorAll('#menuAdminList-'+lang+' .ai-price');
  names.forEach(function(el) {
    var cat = el.dataset.cat; var idx = parseInt(el.dataset.index);
    if(menuData[cat] && menuData[cat][idx]) menuData[cat][idx][nameKey] = el.value;
  });
  descs.forEach(function(el) {
    var cat = el.dataset.cat; var idx = parseInt(el.dataset.index);
    if(menuData[cat] && menuData[cat][idx]) menuData[cat][idx][descKey] = el.value;
  });
  prices.forEach(function(el) {
    var cat = el.dataset.cat; var idx = parseInt(el.dataset.index);
    if(menuData[cat] && menuData[cat][idx]) menuData[cat][idx].price = el.value;
  });
  renderMenu(currentAdminCat);
  saveToStorage();
  var saved = document.getElementById('saved-menu-'+lang);
  saved.style.opacity='1';
  setTimeout(function(){ saved.style.opacity='0'; }, 2500);
  // Changes saved to localStorage ✓
}

function addMenuItem(cat, lang) {
  const newItem = {
    it: 'Nuovo piatto', en: 'New item', de: 'Neues Gericht',
    dit: 'Descrizione', den: 'Description', dde: 'Beschreibung',
    price: '€0.00'
  };
  menuData[cat].push(newItem);
  loadMenuAdmin(cat, lang);
}

function deleteMenuItem(cat, idx, lang) {
  if (confirm('Eliminare questa voce?')) {
    menuData[cat].splice(idx, 1);
    loadMenuAdmin(cat, lang);
  }
}

function loadHoursAdmin() {
  const list = document.getElementById('hoursAdminList');
  if (!list) return;
  list.innerHTML = hoursData.map((h, i) => `
    <div class="hours-admin-item"> <div class="day-name">${h.day_it}</div> <div> <div class="admin-label">Apertura</div> <input type="time" class="ha-open" value="${h.time ? h.time.split(' – ')[0] : ''}" /> </div> <div> <div class="admin-label">Chiusura (vuoto = chiuso)</div> <input type="time" class="ha-close" value="${h.time ? h.time.split(' – ')[1] : ''}" /> </div> </div>`).join('');
}

function saveHoursAdmin() {
  const rows = document.querySelectorAll('.hours-admin-item');
  rows.forEach((row, i) => {
    const open = row.querySelector('.ha-open').value;
    const close = row.querySelector('.ha-close').value;
    hoursData[i].time = (open && close) ? open + ' – ' + close : '';
  });
  renderHours();
  saveToStorage();
  const saved = document.getElementById('saved-hours');
  saved.style.opacity = '1';
  setTimeout(() => saved.style.opacity = '0', 2500);
}

function saveInfoAdmin() {
  const addr = document.getElementById('ai-address').value;
  const email = document.getElementById('ai-email').value;
  const ig = document.getElementById('ai-instagram').value;
  const fb = document.getElementById('ai-facebook').value;
  document.querySelectorAll('.contact-val').forEach(el => {
    if (el.textContent.includes('Carlo Poerio')) el.innerHTML = addr.replace(',', ',<br>');
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.href = 'mailto:' + email;
    a.textContent = email;
  });
  const saved = document.getElementById('saved-info');
  saved.style.opacity = '1';
  setTimeout(() => saved.style.opacity = '0', 2500);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAdmin();
});

window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});
