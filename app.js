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

function toggleLangMenu(e) {
  if(e) e.stopPropagation();
  document.getElementById('langMenu').classList.toggle('open');
}

function setLang(l) {
  lang = l;
  localStorage.setItem('hn_lang', l);
  var flagMap = {it:'🇮🇹',en:'🇬🇧',de:'🇩🇪',es:'🇪🇸',fr:'🇫🇷'};
  var codeMap = {it:'IT',en:'EN',de:'DE',es:'ES',fr:'FR'};
  var flagEl = document.getElementById('langFlag');
  if(flagEl) flagEl.textContent = flagMap[l];
  
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
  if(typeof renderMenu === 'function') renderMenu(activeCat);
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

/* [در اینجا بقیه کدهای منو (menuData) و توابع رزرو و ادمین خود را که در فایل اصلی داشتی قرار بده] */
/* توجه: فایل اصلی شما بسیار طولانی است، من فقط بخش توابعِ پایه و منوی زبان را اصلاح کردم */
