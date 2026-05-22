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
  localStorage.setItem('hn_lang', l);
  var flagMap = {it:'ð®ð¹',en:'ð¬ð§',de:'ð©ðª',es:'ðªð¸',fr:'ð«ð·'};
  var codeMap = {it:'IT',en:'EN',de:'DE',es:'ES',fr:'FR'};
  var flagEl = document.getElementById('langFlag');
  var codeEl = document.getElementById('langCode');
  if(flagEl) flagEl.textContent = flagMap[l];
  if(codeEl) codeEl.textContent = codeMap[l];
  document.querySelectorAll('.lang-option').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
  document.querySelectorAll('[data-it]').forEach(function(el) {
    var txt = el.getAttribute('data-'+l) || el.getAttribute('data-en');
    if(!txt) return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') {
      el.placeholder = txt;
    } else if(el.tagName==='OPTION') {
      el.textContent = txt;
    } else {
      el.innerHTML = txt;
    }
  });
  renderMenu(currentCat);
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
    {it:'Espresso',en:'Espresso',de:'Espresso',dit:'',den:'',dde:'',price:'â¬1.20'},
    {it:'Decaffeinato',en:'Decaffeinated',de:'Entkoffeiniert',dit:'',den:'',dde:'',price:'â¬1.40'},
    {it:'Cappuccino Classico',en:'Classic Cappuccino',de:'Klassischer Cappuccino',dit:'',den:'',dde:'',price:'â¬2.20'},
    {it:'Cappuccino Special',en:'Special Cappuccino',de:'Special Cappuccino',dit:'Deca / Latte di mandorla / Soia / Senza lattosio',den:'Decaf / Almond milk / Soy / Lactose free',dde:'Deka / Mandelmilch / Soja / Laktosefrei',price:'â¬2.50'},
    {it:'Latte Macchiato Classico',en:'Classic Latte Macchiato',de:'Klassischer Latte Macchiato',dit:'',den:'',dde:'',price:'â¬2.00'},
    {it:'Latte Macchiato Special',en:'Special Latte Macchiato',de:'Special Latte Macchiato',dit:'Deca / Latte di mandorla / Soia / Senza lattosio',den:'Decaf / Almond milk / Soy / Lactose free',dde:'Deka / Mandelmilch / Soja / Laktosefrei',price:'â¬2.30'},
    {it:'Americano',en:'Americano',de:'Americano',dit:'',den:'',dde:'',price:'â¬2.50'},
    {it:'Ginseng Small / Large',en:'Ginseng Small / Large',de:'Ginseng Klein / GroÃ',dit:'',den:'',dde:'',price:'â¬1.80 / 2.50'},
    {it:'Orzo Small / Large',en:'Barley coffee Small / Large',de:'Gerstenkaffee Klein / GroÃ',dit:'',den:'',dde:'',price:'â¬1.80 / 2.50'},
    {it:'TÃ¨ / Infuso Classico / Special',en:'Tea / Infusion Classic / Special',de:'Tee / Aufguss Klassisch / Special',dit:'Servito con biscotti',den:'Served with cookies',dde:'Mit Keksen serviert',price:'â¬2.50 / 3.00'},
    {it:'Crema di CaffÃ¨',en:'Coffee Cream',de:'Kaffeecreme',dit:'',den:'',dde:'',price:'â¬2.00'},
    {it:'CaffÃ¨ Freddo',en:'Iced Coffee',de:'Eiskaffee',dit:'Da giugno a ottobre',den:'June to October',dde:'Juni bis Oktober',price:'â¬1.60'},
    {it:'Cioccolata Calda',en:'Hot Chocolate',de:'HeiÃe Schokolade',dit:'Bianca, Gianduia, Fondente â con panna +0.50',den:'White, Gianduia, Dark â with cream +0.50',dde:'WeiÃ, Gianduia, Dunkel â mit Sahne +0.50',price:'â¬4.00'},
    {it:'Cioccolata Calda Senza Lattosio',en:'Lactose-Free Hot Chocolate',de:'Laktosefreie heiÃe Schokolade',dit:'Da ottobre a marzo',den:'October to March',dde:'Oktober bis MÃ¤rz',price:'â¬5.00'},
    {it:'Diletta',en:'Diletta',de:'Diletta',dit:'TÃ¨ Matcha, latte di mandorla schiumato caldo, senza zuccheri aggiunti',den:'Matcha tea, hot steamed almond milk, no added sugar',dde:'Matcha-Tee, heiÃe aufgeschÃ¤umte Mandelmilch, ohne Zuckerzusatz',price:'â¬6.00'},
    {it:'Hush Cream',en:'Hush Cream',de:'Hush Cream',dit:'Espresso, latte condensato, latte montato',den:'Espresso, condensed milk, whipped milk',dde:'Espresso, Kondensmilch, aufgeschÃ¤umte Milch',price:'â¬5.00'},
  ],
  dolce: [
    {it:'Brioche Vuota / Ripiena',en:'Brioche Plain / Filled',de:'Brioche Leer / GefÃ¼llt',dit:'',den:'',dde:'',price:'â¬1.80 / 2.00'},
    {it:'Cornetto Piccolo Vuoto / Pieno',en:'Small Croissant Plain / Filled',de:'Kleines Croissant Leer / GefÃ¼llt',dit:'',den:'',dde:'',price:'â¬1.30 / 1.60'},
    {it:'Cornetto Grande Vuoto / Pieno',en:'Large Croissant Plain / Filled',de:'GroÃes Croissant Leer / GefÃ¼llt',dit:'',den:'',dde:'',price:'â¬2.00 / 2.20'},
    {it:'Pane Tostato ai Cereali',en:'Toasted Grain Bread',de:'GerÃ¶stetes KÃ¶rnerÂ­brot',dit:'Burro e marmellata / Nutella',den:'Butter and jam / Nutella',dde:'Butter und Marmelade / Nutella',price:'â¬4.00'},
    {it:'French Toast Fatti in Casa',en:'Homemade French Toast',de:'Hausgemachter French Toast',dit:'Sciroppo d\'acero / Nutella / Marmellata',den:'Maple syrup / Nutella / Jam',dde:'Ahornsirup / Nutella / Marmelade',price:'â¬6.00'},
    {it:'Pancake',en:'Pancake',de:'Pancake',dit:'Sciroppo d\'acero / Nutella / Marmellata',den:'Maple syrup / Nutella / Jam',dde:'Ahornsirup / Nutella / Marmelade',price:'â¬6.00'},
    {it:'Le Nostre Crostate',en:'Our Fruit Tarts',de:'Unsere Obstkuchen',dit:'Fatti in casa â Classic â¬4 / Special â¬5',den:'Homemade â Classic â¬4 / Special â¬5',dde:'Hausgemacht â Classic â¬4 / Special â¬5',price:'â¬4.00 / 5.00'},
    {it:'I Nostri Cookies',en:'Our Cookies',de:'Unsere Cookies',dit:'Fatti in casa â Classic â¬3 / Special â¬4',den:'Homemade â Classic â¬3 / Special â¬4',dde:'Hausgemacht â Classic â¬3 / Special â¬4',price:'â¬3.00 / 4.00'},
    {it:'I Nostri Biscotti',en:'Our Biscuits',de:'Unsere Kekse',dit:'Fatti in casa â Shortbread, Danese, Girella, alla Nocciola',den:'Homemade â Shortbread, Danish, Girella, Hazelnut',dde:'Hausgemacht â Shortbread, DÃ¤nisch, Girella, Haselnuss',price:'â¬1.00 / 1.50 / 2.00'},
    {it:'Cinnamon Roll',en:'Cinnamon Roll',de:'Zimtschnecke',dit:'Fatti in casa â Solo nel weekend â Classic â¬4 / Special â¬5',den:'Homemade â Weekends only â Classic â¬4 / Special â¬5',dde:'Hausgemacht â Nur am Wochenende â Classic â¬4 / Special â¬5',price:'â¬4.00 / 5.00'},
    {it:'Yogurt e la Nostra Granola',en:'Yogurt and Our Granola',de:'Joghurt mit unserer Granola',dit:'Classico â¬4 / Greco â¬5 / Special â¬8',den:'Classic â¬4 / Greek â¬5 / Special â¬8',dde:'Klassisch â¬4 / Griechisch â¬5 / Special â¬8',price:'â¬4.00 â 8.00'},
    {it:'Special Double Chocolate',en:'Special Double Chocolate',de:'Special Double Chocolate',dit:'Da ottobre a marzo â Arancia e Cannella â¬7, Caramello Salato â¬7, Black Hush â¬7',den:'October to March â Orange & Cinnamon â¬7, Salted Caramel â¬7, Black Hush â¬7',dde:'Oktober bis MÃ¤rz â Orange & Zimt â¬7, Gesalzenes Karamell â¬7, Black Hush â¬7',price:'â¬7.00'},
  ],
  cucina: [
    {it:'Brioche o Cornetto ai Cereali',en:'Brioche or Grain Croissant',de:'Brioche oder KÃ¶rner-Croissant',dit:'Crema di formaggio, mortadella o prosciutto â¬7 â RagÃ¹ â¬8',den:'Cheese cream, mortadella or ham â¬7 â RagÃ¹ â¬8',dde:'FrischkÃ¤se, Mortadella oder Schinken â¬7 â RagÃ¹ â¬8',price:'â¬7.00 / 8.00'},
    {it:'15x15 Big Toast',en:'15x15 Big Toast',de:'15x15 Big Toast',dit:'Prosciutto cotto e formaggio â¬7 / Pancetta e formaggio fumÃ© â¬8 / Vegetariano â¬7',den:'Ham and cheese â¬7 / Smoked pancetta and cheese â¬8 / Vegetarian â¬7',dde:'Schinken und KÃ¤se â¬7 / Speck und RÃ¤ucherkÃ¤se â¬8 / Vegetarisch â¬7',price:'â¬7.00 / 8.00'},
    {it:'Avocado Toast ai Cereali',en:'Grain Avocado Toast',de:'KÃ¶rner Avocado Toast',dit:'Classico â¬10 / Special â¬12',den:'Classic â¬10 / Special â¬12',dde:'Klassisch â¬10 / Special â¬12',price:'â¬10.00 / 12.00'},
    {it:'Croque Hush',en:'Croque Hush',de:'Croque Hush',dit:'15 min cottura â Gratinato con bÃ©chamelle al formaggio. Prosciutto cotto e formaggio â¬8 / Prosciutto, formaggio e blu â¬8 / Prosciutto, formaggio e miele tartufato â¬10',den:'15 min cooking â Gratinated with cheese bÃ©chamel. Ham & cheese â¬8 / Ham, cheese & blue â¬8 / Ham, cheese & truffle honey â¬10',dde:'15 Min. Garzeit â Mit KÃ¤sebÃ©chamel Ã¼berbacken. Schinken & KÃ¤se â¬8 / Schinken, KÃ¤se & Blauschimmel â¬8 / Schinken, KÃ¤se & TrÃ¼ffelhonig â¬10',price:'â¬8.00 / 10.00'},
    {it:'Insalata del Giorno',en:'Salad of the Day',de:'Tagessalat',dit:'Tonno, uovo sodo, feta, salmone, patate, pollo',den:'Tuna, hard-boiled egg, feta, salmon, potatoes, chicken',dde:'Thunfisch, gekochtes Ei, Feta, Lachs, Kartoffeln, HÃ¤hnchen',price:'â¬8.00 / 10.00 / 12.00'},
    {it:'Piatto o Zuppa del Giorno',en:'Dish or Soup of the Day',de:'Tagesgericht oder Suppe',dit:'',den:'',dde:'',price:'â¬8.00 / 10.00 / 12.00'},
    {it:'Aperitivo Gourmet',en:'Gourmet Aperitif',de:'Gourmet-Aperitif',dit:'Min. 2 persone',den:'Min. 2 people',dde:'Min. 2 Personen',price:'â¬12.00'},
  ],
  cocktails: [
    {it:'Aperol Spritz',en:'Aperol Spritz',de:'Aperol Spritz',dit:'Prosecco Extra Dry, Aperol, Soda',den:'Prosecco Extra Dry, Aperol, Soda',dde:'Prosecco Extra Dry, Aperol, Soda',price:'â¬8.00'},
    {it:'Campari Spritz',en:'Campari Spritz',de:'Campari Spritz',dit:'Prosecco Extra Dry, Campari, Soda',den:'Prosecco Extra Dry, Campari, Soda',dde:'Prosecco Extra Dry, Campari, Soda',price:'â¬8.00'},
    {it:'Hugo Spritz',en:'Hugo Spritz',de:'Hugo Spritz',dit:'Prosecco Extra Dry, Elderflower, Soda',den:'Prosecco Extra Dry, Elderflower, Soda',dde:'Prosecco Extra Dry, HolunderblÃ¼te, Soda',price:'â¬8.00'},
    {it:'Amalfi Spritz',en:'Amalfi Spritz',de:'Amalfi Spritz',dit:'Prosecco Extra Dry, Limoncello, Soda',den:'Prosecco Extra Dry, Limoncello, Soda',dde:'Prosecco Extra Dry, Limoncello, Soda',price:'â¬8.00'},
    {it:'Falltime Spritz',en:'Falltime Spritz',de:'Falltime Spritz',dit:'Prosecco Extra Dry, Nocillo, Soda',den:'Prosecco Extra Dry, Nocillo, Soda',dde:'Prosecco Extra Dry, Nocillo, Soda',price:'â¬8.00'},
    {it:'Black Spritz',en:'Black Spritz',de:'Black Spritz',dit:'Prosecco Extra Dry, Liquirizia, Soda',den:'Prosecco Extra Dry, Liquorice, Soda',dde:'Prosecco Extra Dry, Lakritze, Soda',price:'â¬8.00'},
    {it:'Virgin Spritz',en:'Virgin Spritz',de:'Virgin Spritz',dit:'Succo d\'arancia, Bitter analcolico, Soda',den:'Orange juice, Alcohol-free bitter, Soda',dde:'Orangensaft, Alkoholfreier Bitter, Soda',price:'â¬8.00'},
    {it:'NÂ°5',en:'NÂ°5',de:'NÂ°5',dit:'Bourbon Four Roses, Lime, Sciroppo di zucchero, Campari',den:'Bourbon Four Roses, Lime, Sugar syrup, Campari',dde:'Bourbon Four Roses, Limette, Zuckersirup, Campari',price:'â¬10.00'},
    {it:'Exotic Vesuvius',en:'Exotic Vesuvius',de:'Exotic Vesuvius',dit:'Passoa, Gin Vesuvius, Lime, Top Schweppes Lemon',den:'Passoa, Gin Vesuvius, Lime, Top Schweppes Lemon',dde:'Passoa, Gin Vesuvius, Limette, Top Schweppes Lemon',price:'â¬10.00'},
    {it:'Mr Hush',en:'Mr Hush',de:'Mr Hush',dit:'Tequila bianca, Tequila invecchiata, Triplesec, Lime, Sciroppo di zucchero, Frutto della passione',den:'White tequila, Aged tequila, Triple sec, Lime, Sugar syrup, Passion fruit',dde:'WeiÃer Tequila, Gereifter Tequila, Triple Sec, Limette, Zuckersirup, Maracuja',price:'â¬12.00'},
    {it:'Boulevardier',en:'Boulevardier',de:'Boulevardier',dit:'Whiskey, Vermouth Rosso, Campari',den:'Whiskey, Red Vermouth, Campari',dde:'Whiskey, Roter Wermut, Campari',price:'â¬10.00'},
    {it:'Americano',en:'Americano',de:'Americano',dit:'Vermouth Rosso, Campari, Soda',den:'Red Vermouth, Campari, Soda',dde:'Roter Wermut, Campari, Soda',price:'â¬9.00'},
    {it:'Old Fashioned',en:'Old Fashioned',de:'Old Fashioned',dit:'Bourbon, Zucchero, Angostura, Soda',den:'Bourbon, Sugar, Angostura, Soda',dde:'Bourbon, Zucker, Angostura, Soda',price:'â¬9.00'},
    {it:'Margarita',en:'Margarita',de:'Margarita',dit:'Tequila, Triple Sec, Lime',den:'Tequila, Triple Sec, Lime',dde:'Tequila, Triple Sec, Limette',price:'â¬9.00'},
    {it:'Negroni',en:'Negroni',de:'Negroni',dit:'Gin, Vermouth Rosso, Campari',den:'Gin, Red Vermouth, Campari',dde:'Gin, Roter Wermut, Campari',price:'â¬9.00'},
    {it:'Martini Dry',en:'Martini Dry',de:'Martini Dry',dit:'Gin, Dry Vermouth',den:'Gin, Dry Vermouth',dde:'Gin, Trockener Wermut',price:'â¬9.00'},
    {it:'Paloma',en:'Paloma',de:'Paloma',dit:'Tequila, Soda al pompelmo, Lime, Sale',den:'Tequila, Grapefruit soda, Lime, Salt',dde:'Tequila, Grapefruitsoda, Limette, Salz',price:'â¬9.00'},
    {it:'Gin Tonic 0.0',en:'Gin Tonic 0.0',de:'Gin Tonic 0.0',dit:'Gin Tanqueray 0.0',den:'Gin Tanqueray 0.0',dde:'Gin Tanqueray 0.0',price:'â¬9.00'},
    {it:'Shirley Temple',en:'Shirley Temple',de:'Shirley Temple',dit:'Ginger Ale, Granatina',den:'Ginger Ale, Grenadine',dde:'Ginger Ale, Grenadine',price:'â¬8.00'},
    {it:'Virgin Paloma',en:'Virgin Paloma',de:'Virgin Paloma',dit:'Succo di lime, Soda al pompelmo rosa, Sciroppo d\'agave, Sale',den:'Lime juice, Pink grapefruit soda, Agave syrup, Salt',dde:'Limettensaft, Rosa Grapefruitsoda, Agavensirup, Salz',price:'â¬8.00'},
  ],
  gin: [
    {it:'Tanqueray',en:'Tanqueray',de:'Tanqueray',dit:'London Dry',den:'London Dry',dde:'London Dry',price:'â¬8.00'},
    {it:'Plymouth',en:'Plymouth',de:'Plymouth',dit:'Inghilterra, Plymouth Gin',den:'England, Plymouth Gin',dde:'England, Plymouth Gin',price:'â¬8.00'},
    {it:'Gin Mare',en:'Gin Mare',de:'Gin Mare',dit:'Spagna',den:'Spain',dde:'Spanien',price:'â¬9.00'},
    {it:'Bombay',en:'Bombay',de:'Bombay',dit:'Inghilterra',den:'England',dde:'England',price:'â¬9.00'},
    {it:'Hendrick\'s',en:'Hendrick\'s',de:'Hendrick\'s',dit:'Scozia',den:'Scotland',dde:'Schottland',price:'â¬10.00'},
    {it:'Roku',en:'Roku',de:'Roku',dit:'Giappone',den:'Japan',dde:'Japan',price:'â¬10.00'},
    {it:'Vesuvius',en:'Vesuvius',de:'Vesuvius',dit:'Campania',den:'Campania',dde:'Kampanien',price:'â¬12.00'},
  ],
  vini: [
    {it:'Falanghina',en:'Falanghina',de:'Falanghina',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬6 / 25'},
    {it:'Fiano',en:'Fiano',de:'Fiano',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 28'},
    {it:'Greco di Tufo',en:'Greco di Tufo',de:'Greco di Tufo',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 30'},
    {it:'Chardonnay',en:'Chardonnay',de:'Chardonnay',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 28'},
    {it:'GewÃ¼rztraminer',en:'GewÃ¼rztraminer',de:'GewÃ¼rztraminer',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 30'},
    {it:'Sauvignon',en:'Sauvignon',de:'Sauvignon',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 28'},
    {it:'Ribolla Gialla',en:'Ribolla Gialla',de:'Ribolla Gialla',dit:'Vino Bianco',den:'White Wine',dde:'WeiÃwein',price:'â¬7 / 28'},
    {it:'Vita Nuova',en:'Vita Nuova',de:'Vita Nuova',dit:'Vino RosÃ¨',den:'RosÃ© Wine',dde:'RosÃ©wein',price:'â¬7 / 28'},
    {it:'Pinot Ramato',en:'Pinot Ramato',de:'Pinot Ramato',dit:'Vino RosÃ¨',den:'RosÃ© Wine',dde:'RosÃ©wein',price:'â¬7 / 28'},
    {it:'Aglianico',en:'Aglianico',de:'Aglianico',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬6 / 25'},
    {it:'Taurasi',en:'Taurasi',de:'Taurasi',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬8 / 35'},
    {it:'Piedirosso',en:'Piedirosso',de:'Piedirosso',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬7 / 30'},
    {it:'Pinot Nero',en:'Pinot Nero',de:'Pinot Nero',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬7 / 30'},
    {it:'Morellino',en:'Morellino',de:'Morellino',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬6 / 25'},
    {it:'Valpolicella Classico',en:'Valpolicella Classico',de:'Valpolicella Classico',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬8 / 30'},
    {it:'Chianti',en:'Chianti',de:'Chianti',dit:'Vino Rosso',den:'Red Wine',dde:'Rotwein',price:'â¬6 / 25'},
    {it:'El Sior Prosecco Extra Dry',en:'El Sior Prosecco Extra Dry',de:'El Sior Prosecco Extra Dry',dit:'Veneto â Calice / Bottiglia',den:'Veneto â Glass / Bottle',dde:'Veneto â Glas / Flasche',price:'â¬7 / 28'},
    {it:'Berlucchi Saten',en:'Berlucchi Saten',de:'Berlucchi Saten',dit:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',den:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',dde:'Franciacorta, 70% Chardonnay, 30% Pinot Nero',price:'â¬10 / 40'},
    {it:'Berlucchi RosÃ©',en:'Berlucchi RosÃ©',de:'Berlucchi RosÃ©',dit:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',den:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',dde:'Franciacorta, 60% Pinot Nero, 40% Chardonnay',price:'â¬10 / 40'},
    {it:'Santa Margherita Valdobbiadene',en:'Santa Margherita Valdobbiadene',de:'Santa Margherita Valdobbiadene',dit:'Calice / Bottiglia',den:'Glass / Bottle',dde:'Glas / Flasche',price:'â¬7 / 25'},
    {it:'Ca\' del Bosco',en:'Ca\' del Bosco',de:'Ca\' del Bosco',dit:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',den:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',dde:'Chardonnay 79.5%, Pinot Nero 19%, Pinot Bianco 1.5%',price:'â¬70'},
    {it:'Laurent Perrier Champagne',en:'Laurent Perrier Champagne',de:'Laurent Perrier Champagne',dit:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',den:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',dde:'Chardonnay 55%, Pinot Nero 35%, Pinot Meunier 10%',price:'â¬80'},
    {it:'Louis Roederer â Collection',en:'Louis Roederer â Collection',de:'Louis Roederer â Collection',dit:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',den:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',dde:'42% Chardonnay 36% Pinot Noir 22% Pinot Meunier',price:'â¬115'},
    {it:'Louis Roederer â Vintage',en:'Louis Roederer â Vintage',de:'Louis Roederer â Vintage',dit:'70% Pinot Noir 30% Chardonnay',den:'70% Pinot Noir 30% Chardonnay',dde:'70% Pinot Noir 30% Chardonnay',price:'â¬170'},
    {it:'Louis Roederer â RosÃ©',en:'Louis Roederer â RosÃ©',de:'Louis Roederer â RosÃ©',dit:'65% Pinot Noir 35% Chardonnay',den:'65% Pinot Noir 35% Chardonnay',dde:'65% Pinot Noir 35% Chardonnay',price:'â¬180'},
    {it:'Louis Roederer â Blanc de Blancs',en:'Louis Roederer â Blanc de Blancs',de:'Louis Roederer â Blanc de Blancs',dit:'100% Chardonnay',den:'100% Chardonnay',dde:'100% Chardonnay',price:'â¬185'},
    {it:'Louis Roederer â Cristal',en:'Louis Roederer â Cristal',de:'Louis Roederer â Cristal',dit:'55% Pinot Nero 45% Chardonnay',den:'55% Pinot Nero 45% Chardonnay',dde:'55% Pinot Nero 45% Chardonnay',price:'â¬470'},
  ],
  spirits: [
    {it:'Macallan',en:'Macallan',de:'Macallan',dit:'Whiskey â Ispeyside, Scozia',den:'Whiskey â Ispeyside, Scotland',dde:'Whiskey â Ispeyside, Schottland',price:'â¬14.00'},
    {it:'Lagavulin 16',en:'Lagavulin 16',de:'Lagavulin 16',dit:'Whiskey â Islay, Scozia',den:'Whiskey â Islay, Scotland',dde:'Whiskey â Islay, Schottland',price:'â¬14.00'},
    {it:'Oban 14',en:'Oban 14',de:'Oban 14',dit:'Whiskey â Highland, Scozia',den:'Whiskey â Highland, Scotland',dde:'Whiskey â Highland, Schottland',price:'â¬12.00'},
    {it:'Nikka From The Barrel',en:'Nikka From The Barrel',de:'Nikka From The Barrel',dit:'Whiskey â Giappone',den:'Whiskey â Japan',dde:'Whiskey â Japan',price:'â¬12.00'},
    {it:'Bulleit Rye',en:'Bulleit Rye',de:'Bulleit Rye',dit:'Whiskey â Kentucky, Stati Uniti',den:'Whiskey â Kentucky, USA',dde:'Whiskey â Kentucky, USA',price:'â¬8.00'},
    {it:'Johnnie Walker Black Label',en:'Johnnie Walker Black Label',de:'Johnnie Walker Black Label',dit:'Whiskey â Scozia',den:'Whiskey â Scotland',dde:'Whiskey â Schottland',price:'â¬8.00'},
    {it:'Zacapa 23',en:'Zacapa 23',de:'Zacapa 23',dit:'Rum â Cuba',den:'Rum â Cuba',dde:'Rum â Kuba',price:'â¬12.00'},
    {it:'Havana Club 3',en:'Havana Club 3',de:'Havana Club 3',dit:'Rum â Cuba',den:'Rum â Cuba',dde:'Rum â Kuba',price:'â¬8.00'},
    {it:'Havana Club 7',en:'Havana Club 7',de:'Havana Club 7',dit:'Rum â Cuba',den:'Rum â Cuba',dde:'Rum â Kuba',price:'â¬8.00'},
    {it:'Diplomatico',en:'Diplomatico',de:'Diplomatico',dit:'Rum â Lara, Venezuela',den:'Rum â Lara, Venezuela',dde:'Rum â Lara, Venezuela',price:'â¬10.00'},
    {it:'Agricol J.M. FumÃ©e Volcanique',en:'Agricol J.M. FumÃ©e Volcanique',de:'Agricol J.M. FumÃ©e Volcanique',dit:'Rum â Martinica, Caraibi',den:'Rum â Martinique, Caribbean',dde:'Rum â Martinique, Karibik',price:'â¬10.00'},
    {it:'Don Papa Baroko',en:'Don Papa Baroko',de:'Don Papa Baroko',dit:'Rum â Isola di Negros, Philippine',den:'Rum â Negros Island, Philippines',dde:'Rum â Insel Negros, Philippinen',price:'â¬10.00'},
    {it:'Hors d\'Age Dartigalongue',en:'Hors d\'Age Dartigalongue',de:'Hors d\'Age Dartigalongue',dit:'Cognac & Brandy â Armagnac, Francia',den:'Cognac & Brandy â Armagnac, France',dde:'Cognac & Brandy â Armagnac, Frankreich',price:'â¬10.00'},
    {it:'Nistru XO',en:'Nistru XO',de:'Nistru XO',dit:'Cognac & Brandy â Moldova',den:'Cognac & Brandy â Moldova',dde:'Cognac & Brandy â Moldau',price:'â¬8.00'},
    {it:'Poli Bassano Bianca',en:'Poli Bassano Bianca',de:'Poli Bassano Bianca',dit:'Grappa â Veneto',den:'Grappa â Veneto',dde:'Grappa â Venetien',price:'â¬6.00'},
    {it:'Poli Bassano Barrique',en:'Poli Bassano Barrique',de:'Poli Bassano Barrique',dit:'Grappa â Veneto',den:'Grappa â Veneto',dde:'Grappa â Venetien',price:'â¬6.00'},
    {it:'Espolon Blanco',en:'Espolon Blanco',de:'Espolon Blanco',dit:'Tequila â Jalisco, Messico',den:'Tequila â Jalisco, Mexico',dde:'Tequila â Jalisco, Mexiko',price:'â¬8.00'},
    {it:'Espolon Reposado',en:'Espolon Reposado',de:'Espolon Reposado',dit:'Tequila â Jalisco, Messico',den:'Tequila â Jalisco, Mexico',dde:'Tequila â Jalisco, Mexiko',price:'â¬8.00'},
    {it:'Montelobos Oaxaca',en:'Montelobos Oaxaca',de:'Montelobos Oaxaca',dit:'Tequila â Oaxaca, Messico',den:'Tequila â Oaxaca, Mexico',dde:'Tequila â Oaxaca, Mexiko',price:'â¬10.00'},
    {it:'Stolichnaya Elit',en:'Stolichnaya Elit',de:'Stolichnaya Elit',dit:'Vodka â Tambov, Russia',den:'Vodka â Tambov, Russia',dde:'Vodka â Tambov, Russland',price:'â¬10.00'},
    {it:'Hetman',en:'Hetman',de:'Hetman',dit:'Vodka â Ucraina',den:'Vodka â Ukraine',dde:'Vodka â Ukraine',price:'â¬8.00'},
    {it:'Zubrowka Black',en:'Zubrowka Black',de:'Zubrowka Black',dit:'Vodka â Polonia',den:'Vodka â Poland',dde:'Vodka â Polen',price:'â¬8.00'},
    {it:'Vin Santo Frescobaldi',en:'Vin Santo Frescobaldi',de:'Vin Santo Frescobaldi',dit:'Vini Dolci â Toscana, Frescobaldi',den:'Dessert Wine â Tuscany, Frescobaldi',dde:'Dessertwein â Toskana, Frescobaldi',price:'â¬8.00'},
    {it:'Dios',en:'Dios',de:'Dios',dit:'Amaro â Campania',den:'Amaro â Campania',dde:'Amaro â Kampanien',price:'â¬6.00'},
    {it:'Jefferson',en:'Jefferson',de:'Jefferson',dit:'Amaro â Calabria',den:'Amaro â Calabria',dde:'Amaro â Kalabrien',price:'â¬6.00'},
    {it:'Limoncello',en:'Limoncello',de:'Limoncello',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'â¬5.00'},
    {it:'Liquirizia',en:'Liquorice',de:'Lakritze',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'â¬5.00'},
    {it:'Rucolino',en:'Rucolino',de:'Rucolino',dit:'Amaro',den:'Amaro',dde:'Amaro',price:'â¬5.00'},
    {it:'Nocino',en:'Nocino',de:'Nocino',dit:'Amaro â Campania',den:'Amaro â Campania',dde:'Amaro â Kampanien',price:'â¬5.00'},
  ],
  birre: [
    {it:'Nastro Azzurro',en:'Nastro Azzurro',de:'Nastro Azzurro',dit:'Birra',den:'Beer',dde:'Bier',price:'â¬5.00'},
    {it:'Ichnusa Non Filtrata',en:'Ichnusa Unfiltered',de:'Ichnusa Ungefiltert',dit:'Birra',den:'Beer',dde:'Bier',price:'â¬5.00'},
    {it:'Artigianale',en:'Craft Beer',de:'Handwerksbier',dit:'Birra',den:'Beer',dde:'Bier',price:'â¬6.00'},
    {it:'Corona',en:'Corona',de:'Corona',dit:'Birra',den:'Beer',dde:'Bier',price:'â¬6.00'},
    {it:'Spremuta d\'Arancia',en:'Fresh Orange Juice',de:'Frisch gepresster Orangensaft',dit:'',den:'',dde:'',price:'â¬5.00'},
    {it:'Succhi di Frutta',en:'Fruit Juices',de:'FruchtsÃ¤fte',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Succo di Pomodoro Condito',en:'Seasoned Tomato Juice',de:'GewÃ¼rzter Tomatensaft',dit:'',den:'',dde:'',price:'â¬4.00'},
    {it:'Acqua Filette Piccola / Grande',en:'Filette Water Small / Large',de:'Filette Wasser Klein / GroÃ',dit:'',den:'',dde:'',price:'â¬2.50 / 3.00'},
    {it:'TÃ¨ Freddo / Special',en:'Iced Tea / Special',de:'Eistee / Special',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Coca Cola Original / Zero',en:'Coca Cola Original / Zero',de:'Coca Cola Original / Zero',dit:'',den:'',dde:'',price:'â¬2.50'},
    {it:'Tassoni / Chinotto',en:'Tassoni / Chinotto',de:'Tassoni / Chinotto',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Bitter Bianco / Rosso',en:'White / Red Bitter',de:'WeiÃer / Roter Bitter',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Campari Soda',en:'Campari Soda',de:'Campari Soda',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Fever Tree Acqua Tonica',en:'Fever Tree Tonic Water',de:'Fever Tree Tonic Water',dit:'Indian, Mediterranea, Elderflower',den:'Indian, Mediterranean, Elderflower',dde:'Indian, Mediterran, HolunderblÃ¼te',price:'â¬3.00'},
    {it:'Ginger Beer Fever Tree',en:'Ginger Beer Fever Tree',de:'Ginger Beer Fever Tree',dit:'',den:'',dde:'',price:'â¬3.00'},
    {it:'Ginger Ale Fever Tree',en:'Ginger Ale Fever Tree',de:'Ginger Ale Fever Tree',dit:'',den:'',dde:'',price:'â¬3.00'},
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
// âââ LOCALSTORAGE PERSISTENCE âââââââââââââââââââââââââââââââââââââââââââââ
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
var savedLang = localStorage.getItem('hn_lang') || 'it';
loadFromStorage();
setLang(savedLang);
renderMenu('caffetteria');

const hoursData = [
  {day_it:'LunedÃ¬',day_en:'Monday',day_de:'Montag',time:'07:30 â 22:00'},
  {day_it:'MartedÃ¬',day_en:'Tuesday',day_de:'Dienstag',time:'07:30 â 22:00'},
  {day_it:'MercoledÃ¬',day_en:'Wednesday',day_de:'Mittwoch',time:'07:30 â 22:00'},
  {day_it:'GiovedÃ¬',day_en:'Thursday',day_de:'Donnerstag',time:'07:30 â 22:00'},
  {day_it:'VenerdÃ¬',day_en:'Friday',day_de:'Freitag',time:'07:30 â 23:00'},
  {day_it:'Sabato',day_en:'Saturday',day_de:'Samstag',time:'08:00 â 23:00'},
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
  const occasion= document.getElementById('resOccasion').value || 'â';
  const notes   = document.getElementById('resNotes').value.trim() || 'â';
  if(!name||!contact||!date||!time||!guests){
    alert(lang==='it'?'Compila tutti i campi obbligatori.':'Please fill in all required fields.');
    return;
  }
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;
  const message = 'ð½ <b>NUOVA PRENOTAZIONE</b>\n<b>HUSHNOW CAFÃ Â°5</b>\n\nð¤ <b>Nome:</b> '+name+'\nð <b>Contatto:</b> '+contact+'\nð <b>Data:</b> '+date+'\nð <b>Orario:</b> '+time+'\nð¥ <b>Persone:</b> '+guests+'\nð <b>Occasione:</b> '+occasion+'\nð <b>Note:</b> '+notes;
  Promise.all([
    fetch('https://formspree.io/f/mgoqoyyd', {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({_subject:'Prenotazione HUSHNOW CAFÃ Â°5 â '+date+' ore '+time, nome:name, contatto:contact, data:date, orario:time, persone:guests, occasione:occasion, note:notes})
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
  const ff      = getToggleVal('ffGroup') === 'si' ? 'Si â' : 'No';
  const dj      = getToggleVal('djGroup') === 'si' ? 'Si â' : 'No';
  const notes   = document.getElementById('evNotes').value.trim() || 'â';
  if(!name||!contact||!date||!time||!guests||!type){
    alert(lang==='it'?'Compila tutti i campi obbligatori.':'Please fill in all required fields.');
    return;
  }
  const btn = e.target.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;
  const message = 'ð <b>NUOVO EVENTO</b>\n<b>HUSHNOW CAFÃ Â°5</b>\n\nð¤ <b>Nome:</b> '+name+'\nð <b>Contatto:</b> '+contact+'\nð <b>Data:</b> '+date+'\nð <b>Orario:</b> '+time+'\nð¥ <b>Ospiti:</b> '+guests+'\nð­ <b>Tipo:</b> '+type+'\nð¢ <b>Finger Food:</b> '+ff+'\nðµ <b>DJ Set:</b> '+dj+'\nð <b>Note:</b> '+notes;
  Promise.all([
    fetch('https://formspree.io/f/mnjrjvzn', {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({_subject:'Richiesta Evento HUSHNOW CAFÃ Â°5 â '+date+' â '+type, nome:name, contatto:contact, data:date, orario:time, ospiti:guests, tipo:type, finger_food:ff, dj_set:dj, note:notes})
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
  {key:'tea',         cap_it:'Servizio TÃ¨',          cap_en:'Tea Service'},
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
  { stars:5, text_it:"Un posto meraviglioso nel cuore di Napoli. Il caffÃ¨ Ã¨ eccezionale e l'atmosfera Ã¨ unica. Ci torneremo sicuramente!", text_en:"A wonderful place in the heart of Naples. The coffee is exceptional and the atmosphere is unique. We will definitely come back!", text_de:"Ein wunderbarer Ort im Herzen von Neapel. Der Kaffee ist auÃergewÃ¶hnlich und die AtmosphÃ¤re einzigartig. Wir kommen definitiv wieder!", author:"Sofia M.", flag:"ð®ð¹" },
  { stars:5, text_it:"Il miglior matcha latte che abbia mai assaggiato a Napoli. Il design del locale Ã¨ raffinatissimo.", text_en:"The best matcha latte I've ever had in Naples. The interior design is incredibly refined.", text_de:"Der beste Matcha Latte, den ich je in Neapel getrunken habe. Das Interieur ist unglaublich raffiniert.", author:"Thomas K.", flag:"ð©ðª" },
  { stars:5, text_it:"Aperitivo perfetto, cocktail creativi e personale gentilissimo. Un'esperienza da non perdere!", text_en:"Perfect aperitif, creative cocktails and very kind staff. An experience not to be missed!", text_de:"Perfekter Aperitif, kreative Cocktails und sehr freundliches Personal. Ein Erlebnis, das man nicht verpassen sollte!", author:"Emma L.", flag:"ð¬ð§" },
  { stars:5, text_it:"L'atmosfera Ã¨ magica, sembrava di essere in un set fotografico. I croissant sono deliziosi.", text_en:"The atmosphere is magical, it felt like being in a photo shoot. The croissants are delicious.", text_de:"Die AtmosphÃ¤re ist magisch, es fÃ¼hlte sich an wie in einem Fotoshooting. Die Croissants sind kÃ¶stlich.", author:"Giulia R.", flag:"ð®ð¹" },
  { stars:5, text_it:"Posto unico a Napoli. La colazione qui Ã¨ un rituale, non solo un pasto. TornerÃ² presto!", text_en:"Unique place in Naples. Breakfast here is a ritual, not just a meal. I will be back soon!", text_de:"Einzigartiger Ort in Neapel. Das FrÃ¼hstÃ¼ck hier ist ein Ritual. Ich komme bald wieder!", author:"Marco B.", flag:"ð®ð¹" },
  { stars:5, text_it:"Servizio impeccabile, ambiente elegante e caffÃ¨ napoletano autentico. Consigliatissimo!", text_en:"Impeccable service, elegant atmosphere and authentic Neapolitan coffee. Highly recommended!", text_de:"Tadelloser Service, elegante AtmosphÃ¤re und authentischer neapolitanischer Kaffee. Sehr empfehlenswert!", author:"Hans W.", flag:"ð©ðª" },
];
function renderReviews() {
  const g = document.getElementById('reviewsGrid');
  if(!g) return;
  const key = lang==='de' ? 'text_de' : lang==='en' ? 'text_en' : 'text_it';
  g.innerHTML = reviews.map((r,i) => `
    <div class="review-card" style="animation-delay:${i*0.1}s"> <div class="review-stars">${'â'.repeat(r.stars)}</div> <p class="review-text">"${r[key]}"</p> <div class="review-author">${r.author} <span class="review-flag">${r.flag}</span></div> </div>`).join('');
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
  it: 'Utilizziamo i cookie per migliorare la tua esperienza. Continuando accetti la nostra <a href="#" style="color:var(--gold2)">Privacy Policy</a>. ðªðº GDPR',
  en: 'We use cookies to improve your experience. By continuing you accept our <a href="#" style="color:var(--gold2)">Privacy Policy</a>. ðªðº GDPR',
  de: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern. Durch die weitere Nutzung akzeptieren Sie unsere <a href="#" style="color:var(--gold2)">Datenschutzrichtlinie</a>. ðªðº DSGVO',
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
  // Changes saved to localStorage â
}

function addMenuItem(cat, lang) {
  const newItem = {
    it: 'Nuovo piatto', en: 'New item', de: 'Neues Gericht',
    dit: 'Descrizione', den: 'Description', dde: 'Beschreibung',
    price: 'â¬0.00'
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
    <div class="hours-admin-item"> <div class="day-name">${h.day_it}</div> <div> <div class="admin-label">Apertura</div> <input type="time" class="ha-open" value="${h.time ? h.time.split(' â ')[0] : ''}" /> </div> <div> <div class="admin-label">Chiusura (vuoto = chiuso)</div> <input type="time" class="ha-close" value="${h.time ? h.time.split(' â ')[1] : ''}" /> </div> </div>`).join('');
}

function saveHoursAdmin() {
  const rows = document.querySelectorAll('.hours-admin-item');
  rows.forEach((row, i) => {
    const open = row.querySelector('.ha-open').value;
    const close = row.querySelector('.ha-close').value;
    hoursData[i].time = (open && close) ? open + ' â ' + close : '';
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