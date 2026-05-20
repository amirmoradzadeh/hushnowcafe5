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
  colazione:[
    {it:'Cornetto Artigianale',en:'Artisan Croissant',de:'Handgemachtes Croissant',dit:'Sfogliato al burro, crema o marmellata',den:'Buttery pastry, cream or jam',dde:'Butterblätterteig, Creme oder Marmelade',price:'€2.50'},
    {it:'Espresso Napoletano',en:'Neapolitan Espresso',de:'Neapolitanischer Espresso',dit:'Il vero caffè napoletano',den:'Real Neapolitan espresso',dde:'Echter neapolitanischer Kaffee',price:'€1.20'},
    {it:'Cappuccino',en:'Cappuccino',de:'Cappuccino',dit:'Schiuma di latte montata a mano',den:'Hand-steamed milk foam',dde:'Handaufgeschäumte Milch',price:'€2.00'},
    {it:'Avocado Toast',en:'Avocado Toast',de:'Avocado Toast',dit:'Pane di segale, avocado, uova in camicia',den:'Rye bread, avocado, poached eggs',dde:'Roggenbrot, Avocado, pochierte Eier',price:'€9.50'},
    {it:'Granola Bowl',en:'Granola Bowl',de:'Granola Bowl',dit:'Yogurt greco, granola, frutti rossi',den:'Greek yogurt, granola, berries',dde:'Griechischer Joghurt, Granola, Beeren',price:'€8.00'},
    {it:'Caffè Americano',en:'Americano',de:'Americano',dit:'Espresso allungato con acqua calda',den:'Espresso with hot water',dde:'Espresso mit heißem Wasser',price:'€1.80'},
  ],
  pranzo:[
    {it:'Club Sandwich',en:'Club Sandwich',dit:'Pollo, bacon, lattuga, maionese',den:'Chicken, bacon, lettuce, mayo',de:'Club Sandwich',dde:'Hähnchen, Speck, Salat, Mayonnaise',price:'€12.00'},
    {it:'Insalata Hushnow',en:'Hushnow Salad',dit:'Rucola, noci, grana, pera, miele',den:'Rocket, walnuts, grana, pear, honey',de:'Hushnow Salat',dde:'Rucola, Walnüsse, Grana, Birne, Honig',price:'€11.00'},
    {it:'Pasta del Giorno',en:'Pasta of the Day',dit:'Pasta fresca con ragù napoletano',den:'Fresh pasta with Neapolitan ragù',de:'Pasta des Tages',dde:'Frische Pasta mit neapolitanischem Ragù',price:'€13.00'},
    {it:'Bruschetta Trio',en:'Bruschetta Trio',dit:'Tre bruschette: pomodoro, stracchino, prosciutto',den:'Three bruschette varieties',de:'Bruschetta Trio',dde:'Drei Bruschette Varianten',price:'€9.00'},
    {it:'Tavola Calda',en:'Hot Plate',dit:'Piatto del giorno con contorno',den:'Daily special with seasonal side',de:'Warmes Tagesgericht',dde:'Tagesgericht mit saisonaler Beilage',price:'€14.00'},
  ],
  aperitivo:[
    {it:'Aperol Spritz',en:'Aperol Spritz',dit:'Aperol, Prosecco, seltz, arancia',den:'Aperol, Prosecco, soda, orange',de:'Aperol Spritz',dde:'Aperol, Prosecco, Sodawasser, Orange',price:'€8.00'},
    {it:'Negroni',en:'Negroni',dit:'Gin, Campari, vermouth rosso',den:'Gin, Campari, red vermouth',de:'Negroni',dde:'Gin, Campari, Roter Wermut',price:'€9.00'},
    {it:'Tagliere Hushnow',en:'Hushnow Board',dit:'Salumi, formaggi, olive, frutta secca',den:'Cured meats, cheeses, olives',de:'Hushnow Platte',dde:'Aufschnitt, Käse, Oliven, Trockenfrüchte',price:'€18.00'},
    {it:'Bloody Mary',en:'Bloody Mary',dit:'Vodka, succo pomodoro, spezie',den:'Vodka, tomato juice, spices',de:'Bloody Mary',dde:'Vodka, Tomatensaft, geheime Gewürze',price:'€9.50'},
    {it:'Hugo',en:'Hugo',dit:'Sambuco, Prosecco, menta, lime',den:'Elderflower, Prosecco, mint, lime',de:'Hugo',dde:'Holunderblüte, Prosecco, frische Minze, Limette',price:'€8.50'},
  ],
  drinks:[
    {it:'Espresso',en:'Espresso',dit:'Miscela speciale Hushnow',den:'Hushnow special blend',de:'Espresso',dde:'Hushnow Spezialröstung',price:'€1.20'},
    {it:'Cold Brew',en:'Cold Brew',dit:'Caffè freddo in infusione 24h',den:'24h cold-infused coffee',de:'Cold Brew',dde:'24 Stunden kalt gebrühter Kaffee',price:'€4.50'},
    {it:'Matcha Latte',en:'Matcha Latte',dit:'Matcha cerimonia, latte di avena',den:'Ceremonial matcha, oat milk',de:'Matcha Latte',dde:'Zeremonial-Matcha, Hafermilch',price:'€5.50'},
    {it:'Smoothie Frutta',en:'Fruit Smoothie',dit:'Frutta fresca di stagione',den:'Fresh seasonal fruit',de:'Frucht-Smoothie',dde:'Frische Saisonfrüchte gemixt',price:'€6.00'},
    {it:'Prosecco al Calice',en:'Prosecco',dit:'Prosecco DOC Veneto',den:'Veneto DOC Prosecco',de:'Prosecco',dde:'Prosecco DOC Veneto',price:'€6.00'},
  ],
  dessert:[
    {it:'Tiramisù Hushnow',en:'Hushnow Tiramisù',dit:'Ricetta originale con mascarpone fresco',den:'Original recipe with fresh mascarpone',de:'Hushnow Tiramisù',dde:'Originalrezept mit frischem Mascarpone',price:'€7.00'},
    {it:'Cannolo Siciliano',en:'Sicilian Cannolo',dit:'Croccante, ricotta fresca di pecora',den:'Crispy shell, fresh ricotta',de:'Sizilianisches Cannolo',dde:'Knusprige Hülle, frischer Schafskäse',price:'€5.50'},
    {it:'Torta al Cioccolato',en:'Chocolate Cake',dit:'Fondente 70%, fonduta calda',den:'70% dark chocolate fondant',de:'Schokoladenkuchen',dde:'70% dunkle Schokolade, warmes Fondant',price:'€7.50'},
    {it:'Gelato Artigianale',en:'Artisan Gelato',dit:'Due gusti a scelta',den:'Two flavours of choice',de:'Handgemachtes Gelato',dde:'Zwei Sorten nach Wahl',price:'€5.00'},
  ]
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
renderMenu('colazione');

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
  if(tabId==='menu-it') loadMenuAdmin('colazione','it');
  if(tabId==='menu-en') loadMenuAdmin('colazione','en');
  if(tabId==='menu-de') loadMenuAdmin('colazione','de');
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