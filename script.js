'use strict';
/* ===== Editable business details ===== */
const CONFIG = {
  name: "KGN Computer's and Mobile Service's",
  phone: "+917758958060",          // digits for tel: link
  whatsapp: "917758958060",        // country code + number, no +
  email: "Parvejpathan745@gmail.com",
  address: "Gala No. 10, Near Bank of India ATM, Balaji Vishwa Building, Main Road, Palshi, Shirwal, Maharashtra 412801, India",
  waGreeting: "Hello KGN Computer's and Mobile Service's, I need a repair.",
  /* Add your own photos: { src: "img/your-photo.jpg", alt: "...", caption: "..." } */
  gallery: [
    { caption: "Laptop motherboard repair" },
    { caption: "Desktop hardware troubleshooting" },
    { caption: "Circuit-level work bench" },
    { caption: "Mobile hardware repair" },
    { caption: "Our workshop" },
    { caption: "Tested and ready for pickup" }
  ]
};

/* Apply config to page */
document.querySelectorAll('[data-call]').forEach(a => a.href = 'tel:' + CONFIG.phone);
document.querySelectorAll('[data-wa]').forEach(a => a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.waGreeting));
const mail = document.getElementById('email-link');
mail.href = 'mailto:' + CONFIG.email; mail.textContent = CONFIG.email;
document.getElementById('map-link').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent("KGN COMPUTER'S AND MOBILE SERVICE'S, " + CONFIG.address);
document.getElementById('year').textContent = new Date().getFullYear();

/* Gallery */
const grid = document.getElementById('gallery-grid');
CONFIG.gallery.forEach(g => {
  const f = document.createElement('figure');
  f.className = 'shot' + (g.src ? '' : ' ph');
  if (g.src) {
    const i = document.createElement('img');
    i.src = g.src; i.alt = g.alt || g.caption; i.loading = 'lazy'; i.width = 800; i.height = 600;
    f.appendChild(i);
  } else {
    const s = document.createElement('span');
    s.textContent = 'Photo placeholder';
    f.appendChild(s);
  }
  const c = document.createElement('figcaption');
  c.textContent = g.caption; f.appendChild(c);
  grid.appendChild(f);
});

/* Mobile menu */
const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* Contact form: opens WhatsApp with the details (free, no server needed) */
const form = document.getElementById('contact-form'), msg = document.getElementById('form-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const name = d.get('name').trim(), phone = d.get('phone').trim(), service = d.get('service'), note = d.get('message').trim();
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    const bad = !el.value.trim() || (el.name === 'phone' && !/^[+\d][\d\s-]{6,}$/.test(el.value.trim()));
    el.classList.toggle('bad', bad); if (bad) ok = false;
  });
  msg.className = 'form-msg';
  if (!ok) { msg.textContent = 'Enter your name, a valid phone number and the service you need.'; return; }
  const text = `Hello, I'm ${name}.\nPhone: ${phone}\nService: ${service}\nMessage: ${note || '-'}`;
  window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  msg.classList.add('ok'); msg.textContent = 'Opening WhatsApp with your details. Press send there to finish.';
  form.reset();
});

/* Gentle reveal on scroll (section headings and cards only) */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .15 });
  document.querySelectorAll('.card,.why li,.shot').forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

/* 3D laptop: lid opens with scroll, headline fades as it opens */
(() => {
  const lap = document.getElementById('laptop'), track = document.querySelector('.hero-track'), hint = document.getElementById('scroll-hint'), h1 = document.querySelector('.hero-copy h1'), keys = document.getElementById('keys');
  if (!lap || !track) return;
  for (let r = 0; r < 5; r++) {
    if (r === 4) { for (let c = 0; c < 3; c++) keys.appendChild(document.createElement('i')); const s = document.createElement('i'); s.className = 'sp'; keys.appendChild(s); for (let c = 0; c < 3; c++) keys.appendChild(document.createElement('i')); }
    else for (let c = 0; c < 14; c++) keys.appendChild(document.createElement('i'));
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update() {
    const range = Math.max(track.offsetHeight - window.innerHeight, 1);
    let p = reduce ? 1 : Math.min(Math.max(window.scrollY / (range * .8), 0), 1);
    p = p * p * (3 - 2 * p); // smoothstep
    lap.style.setProperty('--a', (104 * p).toFixed(1) + 'deg');
    h1.style.opacity = (1 - .78 * p).toFixed(2);
    hint.style.opacity = p > .1 ? 0 : 1;
  }
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Exploded laptop: layers separate on scroll, list items highlight parts, dashed line follows */
(() => {
  const track = document.querySelector('.parts-track'), rig = document.getElementById('xrig');
  if (!track || !rig) return;
  const items = [...document.querySelectorAll('#plist li')], stick = track.querySelector('.parts-stick');
  const path = document.getElementById('pline-path'), dotS = document.getElementById('pline-s'), dotE = document.getElementById('pline-e');
  const q = s => rig.querySelector(s);
  const part = { cs: q('.case'), board: q('.board'), deck: q('.deck'), scr: q('.scr'), batt: q('.batt'), ram: q('.ram'), ssd: q('.ssd'), fan: q('.fan'), kb: q('.kb'), pad: q('.pad'), hng: [...rig.querySelectorAll('.hng')] };
  /* one entry per list item, in the same order as the list */
  const sets = [['cs'], ['scr'], ['hng'], ['kb'], ['pad'], ['batt'], ['ram'], ['ssd'], ['fan']];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function line(i) {
    const li = items[i], a = li && document.getElementById(li.dataset.target);
    if (!a || getComputedStyle(path.ownerSVGElement).display === 'none') return;
    const st = stick.getBoundingClientRect(), l = li.querySelector('h3'), r = document.createRange();
    r.selectNodeContents(l);
    const lr = r.getBoundingClientRect(), t = a.getBoundingClientRect();
    const x1 = lr.right + 14 - st.left, y1 = lr.top + lr.height / 2 - st.top, x2 = t.left + t.width / 2 - st.left, y2 = t.top + t.height / 2 - st.top;
    path.setAttribute('d', `M${x1} ${y1} C${x1 + 140} ${y1}, ${x2 - 160} ${y2}, ${x2} ${y2}`);
    dotS.setAttribute('cx', x1); dotS.setAttribute('cy', y1); dotE.setAttribute('cx', x2); dotE.setAttribute('cy', y2);
  }
  const all = Object.values(part).flat();
  let last = -1;
  function update() {
    const range = Math.max(track.offsetHeight - window.innerHeight, 1);
    const p = reduce ? .5 : Math.min(Math.max(-track.getBoundingClientRect().top / range, 0), 1);
    const s = Math.min(p / .1, 1);
    rig.style.setProperty('--s', (reduce ? 1 : s * s * (3 - 2 * s)).toFixed(3));
    const idx = Math.min(items.length - 1, Math.floor(Math.max(p - .08, 0) / .92 * items.length));
    if (idx !== last) {
      last = idx;
      items.forEach((li, k) => li.classList.toggle('on', k === idx));
      all.forEach(el => el.classList.remove('on', 'live'));
      sets[idx].forEach(k => [].concat(part[k]).forEach(el => { el.classList.add('on'); const L = el.closest('.lyr'); if (L) L.classList.add('live'); }));
    }
    line(idx);
  }
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  setTimeout(update, 300);
  update();
})();
