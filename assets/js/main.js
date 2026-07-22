const LICTER_MASK = "1ff00180000003fff000201c00000;f0ffffd20c0000001fff01f89f600000;10ffffffffb0007c0001ffe0f627f387f80;ffffffffffffebff00001fe1d3f31ffffc1;fffffffffffffcf7800e07e3e0fffffffef;7ffffffffffffffbc00403c1c57ffffff80;3dfffffffffffffdf0000180303ffffffe0;33fffffffffffe1f0000000701ffff8b80;180fffffffffff880000003f03fffc0400;1c07ffffffffffce1000007f1ffff80080;83ffffffffffffe2c0000ffbffff40000;3fffffffffffffe00000fffffff00000;3fffffffffffffe00001afffffc00000;2fffffffffffffe000011fffffc00000;7fffffff8fbffc000003fffffc00000;63fffffffcc1e5f8000007ffffc00000;fffffff9ddc878000003ffffc00000;10affffff9ff523c000001ffffc00000;10bffffffbfe4a18000000ffffc00000;e8ffffffff003f0000000ffff800000;31ffffffff007f80000007fff000000;1fffffffffdffc0000003ffc000000;1ffffffdf7fffc00000041fe000000;1ffffff9f7fffe00000040f8000000;fffff0bffffff00000000f4000000;7fffe1fefffff00000060e0000000;fcfc1fefffff80000108e0000000;1787c0fdfffff0000040dc0000000;20f838079fffff0000000f80000000;f01801bfffff8000003c00000000;d018007fffff8000003000000000;30d01003ffffff00002e2000000000;40102003fffffe00007fc000000000;48202001fffffc0000ff0000000000;c280001ffff000003ff0000000000;e100000fffc000003ff8000000000;f2000007ffc000003ff8000000000;a166000003ffc00001fff8000000000;3c304000001ffc00007fff8000000000;170000000001ff80000ffffc000000000;b0060000001ff80000ffff8000000000;80000000003ff80000ffff0000000000;20000000003ff800007fff0000000000;27800000003ff800007fff0000000000;67c00000013ff800007ffe0000000000;7fc00000018ff800007ffc0000000000;fff00000018ff800003ff80000000000;fffc0000018ff000003ff80000000000;1fffc0000008ff000000ff80000000000;3fffc00000007f0000007fc0000000000;3fff800000007f0000007fc0000000000;3fff800000003e0000003fc0000000000;1fc7800000001e0000003fc0000000000;1f80800000000200000017c0000000000;f0000000000000000000fc0000000000;400000000000000000000007e0000000000;400000000000000000000003e0000000000;100800000000000000000001c0000000000;180000000000000000000001e0000000000;e0000000000;e0000000000;60000000000;20000000000;1c0000000000";
/* Licter — main.js : chaque module ne s'active que si la page contient ses éléments */
(function(){
"use strict";
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav + barre de progression ---------- */
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
addEventListener('scroll', () => {
  if(nav) nav.classList.toggle('scrolled', scrollY > 40);
  if(progress) progress.style.width =
    (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, {passive:true});

const burger = document.getElementById('burger');
const links = document.getElementById('navlinks');
if(burger && links){
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------- halo curseur ---------- */
const halo = document.getElementById('halo');
if(halo && !reduced){
  addEventListener('mousemove', e => {
    halo.style.opacity = 1;
    halo.style.left = e.clientX + 'px';
    halo.style.top = e.clientY + 'px';
  }, {passive:true});
}

/* ---------- reveal au scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:.15});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---------- compteurs animés ---------- */
const cio = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    cio.unobserve(entry.target);
    const el = entry.target, target = +el.dataset.count, suf = el.dataset.suffix || '';
    if(reduced){ el.textContent = target.toLocaleString('fr-FR') + suf; return; }
    const t0 = performance.now(), dur = 1600;
    (function tick(t){
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString('fr-FR') + suf;
      if(p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, {threshold:.6});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ---------- marquees : duplication du contenu ---------- */
document.querySelectorAll('.marquee-track').forEach(m => { m.innerHTML += m.innerHTML; });

/* ---------- constellation (accueil / contact) ---------- */
const canvas = document.getElementById('constellation');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], mouse = {x:-9999, y:-9999};
  function resize(){
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const n = Math.min(130, Math.floor(canvas.offsetWidth / 10));
    pts = Array.from({length:n}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.22*devicePixelRatio,
      vy: (Math.random()-.5)*.22*devicePixelRatio,
      r: (Math.random()*2.2+1.2)*devicePixelRatio,
      gold: Math.random() < .28
    }));
  }
  resize(); addEventListener('resize', resize);
  canvas.parentElement.addEventListener('mousemove', e => {
    const b = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - b.left) * devicePixelRatio;
    mouse.y = (e.clientY - b.top) * devicePixelRatio;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  const LINK = 130 * devicePixelRatio;
  (function drawConst(){
    ctx.clearRect(0,0,W,H);
    for(const p of pts){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > W) p.vx *= -1;
      if(p.y < 0 || p.y > H) p.vy *= -1;
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if(dm < 180*devicePixelRatio){ p.x += (p.x - mouse.x)/dm * .6; p.y += (p.y - mouse.y)/dm * .6; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = p.gold ? 'rgba(190,167,107,1)' : 'rgba(19,22,45,.55)';
      ctx.fill();
    }
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const a = pts[i], b = pts[j], d = Math.hypot(a.x-b.x, a.y-b.y);
      if(d < LINK){
        ctx.strokeStyle = (a.gold && b.gold) ? `rgba(190,167,107,${.55*(1-d/LINK)})` : `rgba(19,22,45,${.2*(1-d/LINK)})`;
        ctx.lineWidth = devicePixelRatio*.8;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
    if(!reduced) requestAnimationFrame(drawConst);
  })();
}

/* ---------- carte du monde en points ---------- */
const map = document.getElementById('dotmap');
if(map){
  const MASK = LICTER_MASK.split(";");
  const COLS = 140, ROWS = 64, LAT_TOP = 75, LAT_BOT = -56;
  const mctx = map.getContext('2d');
  const tooltip = document.getElementById('tooltip');
  const hotspots = [
    {nom:'Paris',      lon:2.35,   lat:48.85,  m:'12 400 mentions/h', s:'Sentiment +68 % · pic à 9h'},
    {nom:'New York',   lon:-74.0,  lat:40.7,   m:'9 850 mentions/h',  s:'Sujet chaud : lancement produit'},
    {nom:'São Paulo',  lon:-46.6,  lat:-23.5,  m:'7 300 mentions/h',  s:'Croissance +34 % sur 7 jours'},
    {nom:'Lagos',      lon:3.4,    lat:6.45,   m:'4 100 mentions/h',  s:'Signal émergent détecté'},
    {nom:'Dubaï',      lon:55.3,   lat:25.2,   m:'3 650 mentions/h',  s:'Veille CEO active'},
    {nom:'Singapour',  lon:103.8,  lat:1.35,   m:'5 900 mentions/h',  s:'Analyse concurrentielle en cours'},
    {nom:'Tokyo',      lon:139.7,  lat:35.7,   m:'8 200 mentions/h',  s:'20+ langues surveillées'},
    {nom:'Sydney',     lon:151.2,  lat:-33.9,  m:'2 800 mentions/h',  s:'Couverture 24/7 assurée'}
  ];
  let mw, mh, t0map = performance.now();
  function mapResize(){
    mw = map.width = map.offsetWidth * devicePixelRatio;
    mh = map.height = map.offsetHeight * devicePixelRatio;
  }
  function proj(lon, lat){
    return { x: (lon + 180) / 360 * mw, y: (LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * mh };
  }
  function drawMap(now){
    mctx.clearRect(0,0,mw,mh);
    const cw = mw / COLS, ch = mh / ROWS, r = Math.min(cw, ch) * .3;
    for(let ry=0; ry<ROWS; ry++){
      const bits = BigInt('0x' + MASK[ry]);
      for(let cx=0; cx<COLS; cx++){
        if((bits >> BigInt(cx)) & 1n){
          mctx.beginPath();
          mctx.arc(cx*cw + cw/2, ry*ch + ch/2, r, 0, 7);
          mctx.fillStyle = 'rgba(244,241,232,.3)';
          mctx.fill();
        }
      }
    }
    const t = (now - t0map) / 1000;
    hotspots.forEach((h, i) => {
      const p = proj(h.lon, h.lat);
      const phase = (t * .8 + i * .45) % 1;
      mctx.beginPath();
      mctx.arc(p.x, p.y, (6 + phase*22) * devicePixelRatio, 0, 7);
      mctx.strokeStyle = `rgba(190,167,107,${.5*(1-phase)})`;
      mctx.lineWidth = devicePixelRatio;
      mctx.stroke();
      mctx.beginPath();
      mctx.arc(p.x, p.y, 3.4*devicePixelRatio, 0, 7);
      mctx.fillStyle = '#BEA76B';
      mctx.fill();
    });
    if(!reduced) requestAnimationFrame(drawMap);
  }
  mapResize(); requestAnimationFrame(drawMap);
  addEventListener('resize', mapResize);
  if(tooltip){
    map.addEventListener('mousemove', e => {
      const b = map.getBoundingClientRect();
      const mx = (e.clientX - b.left) * devicePixelRatio, my = (e.clientY - b.top) * devicePixelRatio;
      let best = null, bd = 26 * devicePixelRatio;
      hotspots.forEach(h => {
        const p = proj(h.lon, h.lat), d = Math.hypot(p.x - mx, p.y - my);
        if(d < bd){ bd = d; best = h; }
      });
      if(best){
        tooltip.innerHTML = `<b>${best.nom}</b>${best.m}<br><small>${best.s}</small>`;
        tooltip.style.opacity = 1;
        tooltip.style.left = Math.min(e.clientX - b.left + 18, b.width - 190) + 'px';
        tooltip.style.top = (e.clientY - b.top - 14) + 'px';
      } else tooltip.style.opacity = 0;
    });
    map.addEventListener('mouseleave', () => tooltip.style.opacity = 0);
  }
}

/* ---------- flux de veille simulé ---------- */
const feed = document.getElementById('feed-list');
if(feed){
  const mentions = [
    {src:'X / Twitter · Paris',    sent:'pos', t:'« Franchement bluffé par le nouveau service client, réponse en 10 min. »'},
    {src:'Presse · Les Échos',     sent:'neu', t:'La marque annonce un partenariat stratégique dans la distribution.'},
    {src:'TikTok · São Paulo',     sent:'pos', t:'Une créatrice (890K abonnés) publie un unboxing spontané.'},
    {src:'Forum · Reddit',         sent:'neg', t:'Un fil de discussion signale un problème de livraison récurrent.'},
    {src:'Instagram · Dubaï',      sent:'pos', t:'La campagne locale dépasse les 2M d\'impressions organiques.'},
    {src:'Google · Search',        sent:'neu', t:'Les recherches « avis + marque » progressent de 18 % cette semaine.'},
    {src:'LinkedIn · France',      sent:'pos', t:'Le post RH de la marque devient viral auprès des jeunes diplômés.'},
    {src:'YouTube · Tokyo',        sent:'neg', t:'Un comparatif produit pointe un défaut : alerte envoyée en 12 min.'}
  ];
  let mi = 0;
  const labels = {pos:'Positif', neg:'Négatif', neu:'Neutre'};
  function pushMention(){
    const m = mentions[mi++ % mentions.length];
    const div = document.createElement('div');
    div.className = 'mention';
    div.innerHTML = `<div class="meta"><span>${m.src}</span><span class="${m.sent}">● ${labels[m.sent]}</span></div><p>${m.t}</p>`;
    feed.prepend(div);
    while(feed.children.length > 4) feed.removeChild(feed.lastChild);
  }
  pushMention(); pushMention(); pushMention();
  if(!reduced) setInterval(pushMention, 3400);
}

/* ---------- tilt cartes ---------- */
if(!reduced && matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.case').forEach(card => {
    card.addEventListener('mousemove', e => {
      const b = card.getBoundingClientRect();
      const rx = ((e.clientY - b.top) / b.height - .5) * -7;
      const ry = ((e.clientX - b.left) / b.width - .5) * 7;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* ---------- FAQ accordéon (offres) ---------- */
document.querySelectorAll('.qa').forEach(qa => {
  const btn = qa.querySelector('button'), rep = qa.querySelector('.rep');
  if(!btn || !rep) return;
  btn.addEventListener('click', () => {
    const open = qa.classList.toggle('open');
    rep.style.maxHeight = open ? rep.scrollHeight + 'px' : '0';
  });
});

/* ---------- filtres blog ---------- */
const filtres = document.querySelectorAll('.filtres button');
if(filtres.length){
  filtres.forEach(btn => btn.addEventListener('click', () => {
    filtres.forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.articles .article').forEach(a => {
      a.classList.toggle('cache', cat !== 'tous' && a.dataset.cat !== cat);
    });
  }));
}

/* ---------- formulaire contact (démo front) ---------- */
const form = document.getElementById('form-contact');
if(form){
  form.querySelector('.btn').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('form-ok').style.display = 'block';
  });
}
})();


/* ================= GLOBE 3D (accueil) ================= */
(function(){
"use strict";
const cv = document.getElementById('globe');
if(!cv) return;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ctx = cv.getContext('2d');
const COLS = 140, ROWS = 64, LAT_TOP = 75, LAT_BOT = -56;
const D2R = Math.PI / 180;

/* points terrestres -> vecteurs unitaires 3D (1 colonne sur 2 pour la perf) */
const land = [];
LICTER_MASK.split(";").forEach((row, ry) => {
  const bits = BigInt('0x' + row);
  const lat = (LAT_TOP + (LAT_BOT - LAT_TOP) * (ry + .5) / ROWS) * D2R;
  for(let cx = 0; cx < COLS; cx += 2){
    if((bits >> BigInt(cx)) & 1n){
      const lon = (-180 + 360 * (cx + .5) / COLS) * D2R;
      land.push({x: Math.cos(lat) * Math.cos(lon), y: Math.sin(lat), z: Math.cos(lat) * Math.sin(lon)});
    }
  }
});
const CITY = [
  ['Paris', 48.85, 2.35], ['New York', 40.7, -74], ['São Paulo', -23.5, -46.6],
  ['Lagos', 6.45, 3.4], ['Dubaï', 25.2, 55.3], ['Singapour', 1.35, 103.8],
  ['Tokyo', 35.7, 139.7], ['Sydney', -33.9, 151.2]
].map(([n, la, lo]) => ({n, x: Math.cos(la*D2R)*Math.cos(lo*D2R), y: Math.sin(la*D2R), z: Math.cos(la*D2R)*Math.sin(lo*D2R)}));
const ARCS = [[0,1],[0,6],[1,2],[6,7],[0,4],[5,0],[4,5],[1,3]];

function slerp(a, b, t){
  let d = a.x*b.x + a.y*b.y + a.z*b.z;
  d = Math.min(1, Math.max(-1, d));
  const w = Math.acos(d), sw = Math.sin(w) || 1e-6;
  const ka = Math.sin((1-t)*w)/sw, kb = Math.sin(t*w)/sw;
  return {x: ka*a.x + kb*b.x, y: ka*a.y + kb*b.y, z: ka*a.z + kb*b.z};
}

let W, H, R, CX, CY, rotY = .6, vel = .0018, drag = false, lastX = 0, mx = 0;
function resize(){
  W = cv.width = cv.offsetWidth * devicePixelRatio;
  H = cv.height = cv.offsetHeight * devicePixelRatio;
  R = Math.min(W, H) * .44;
  CX = W * (cv.offsetWidth > 860 ? .72 : .5);
  CY = H * .5;
}
resize(); addEventListener('resize', resize);

cv.addEventListener('mousedown', e => { drag = true; lastX = e.clientX; });
addEventListener('mouseup', () => drag = false);
addEventListener('mousemove', e => {
  if(drag){ rotY += (e.clientX - lastX) * .005; lastX = e.clientX; }
  mx = (e.clientX / innerWidth - .5);
}, {passive:true});

const TILT = .42, cosT = Math.cos(TILT), sinT = Math.sin(TILT);
function proj(p){
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const x1 = p.x*cy + p.z*sy, z1 = -p.x*sy + p.z*cy;
  const y2 = p.y*cosT - z1*sinT, z2 = p.y*sinT + z1*cosT;
  const s = 1.4 / (1.4 - z2 * .42);
  return {sx: CX + x1*R*s, sy: CY - y2*R*s, z: z2, s};
}

let t0 = performance.now();
function draw(now){
  const t = (now - t0) / 1000;
  if(!drag) rotY += vel + mx * .0012;
  ctx.clearRect(0, 0, W, H);
  /* halo de la planète */
  const g = ctx.createRadialGradient(CX, CY, R*.55, CX, CY, R*1.25);
  g.addColorStop(0, 'rgba(19,22,45,.06)');
  g.addColorStop(1, 'rgba(19,22,45,0)');
  ctx.fillStyle = g;
  ctx.fillRect(CX-R*1.3, CY-R*1.3, R*2.6, R*2.6);
  /* points terrestres */
  for(const p of land){
    const q = proj(p);
    if(q.z < -.25) continue;
    const a = .12 + .42 * (q.z + 1) / 2;
    const sz = (q.z > 0 ? 2 : 1.3) * devicePixelRatio * q.s;
    ctx.fillStyle = `rgba(190,167,107,${a + .1})`;
    ctx.fillRect(q.sx, q.sy, sz, sz);
  }
  /* arcs de données entre capitales */
  ARCS.forEach((pair, i) => {
    const A = CITY[pair[0]], B = CITY[pair[1]];
    ctx.beginPath();
    let visible = false;
    for(let k = 0; k <= 36; k++){
      const tt = k / 36;
      const m = slerp(A, B, tt);
      const lift = 1 + .22 * Math.sin(Math.PI * tt);
      const q = proj({x: m.x*lift, y: m.y*lift, z: m.z*lift});
      if(k === 0) ctx.moveTo(q.sx, q.sy); else ctx.lineTo(q.sx, q.sy);
      if(q.z > 0) visible = true;
    }
    if(!visible) return;
    ctx.strokeStyle = 'rgba(190,167,107,.42)';
    ctx.lineWidth = devicePixelRatio;
    ctx.stroke();
    /* paquet de données voyageant sur l'arc */
    const tp = (t * .22 + i * .13) % 1;
    const m = slerp(A, B, tp);
    const lift = 1 + .22 * Math.sin(Math.PI * tp);
    const q = proj({x: m.x*lift, y: m.y*lift, z: m.z*lift});
    if(q.z > -.05){
      ctx.beginPath();
      ctx.arc(q.sx, q.sy, 2.4 * devicePixelRatio * q.s, 0, 7);
      ctx.fillStyle = '#13162D';
      ctx.fill();
    }
  });
  /* capitales : pulsations dorées */
  CITY.forEach((c, i) => {
    const q = proj(c);
    if(q.z < .05) return;
    const phase = (t * .8 + i * .4) % 1;
    ctx.beginPath();
    ctx.arc(q.sx, q.sy, (4 + phase * 16) * devicePixelRatio * q.s, 0, 7);
    ctx.strokeStyle = `rgba(19,22,45,${.55 * (1 - phase)})`;
    ctx.lineWidth = devicePixelRatio;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q.sx, q.sy, 2.6 * devicePixelRatio * q.s, 0, 7);
    ctx.fillStyle = '#BEA76B';
    ctx.fill();
  });
  if(!reduced) requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
})();

/* ================= EFFETS DE SCROLL (fade hero + parallaxe dashboard) ================= */
(function(){
"use strict";
if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const fade = document.getElementById('hero-fade');
const dash = document.getElementById('dash-panel');
if(!fade && !dash) return;
addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    const y = scrollY;
    if(fade){
      fade.style.opacity = Math.max(1 - Math.max(0, y - 150) / 620, 0);
      fade.style.transform = `translateY(${y * .18}px)`;
    }
    if(dash){
      dash.style.transform = `translateY(${-Math.min(y, 420) * .09}px)`;
    }
  });
}, {passive:true});
})();

/* ================= SÉLECTEUR D'ÉTUDES DU DASHBOARD ================= */
(function(){
"use strict";
const sel = document.getElementById('dash-select');
if(!sel) return;
const live = document.querySelector('.dash-live');
const title = document.querySelector('.dash-title');
const kpis = document.querySelectorAll('.dkpi b');
const notes = document.querySelectorAll('.dkpi span');
const line = document.querySelector('.dash-chart .line');
const area = document.querySelector('.dash-chart .area');
const srcList = document.getElementById('src-list');
const pick = document.querySelector('.dash-pick');
const panel = document.getElementById('dash-panel');
const pieSegs = {
  pos: document.querySelector('.donut .seg.pos'),
  neu: document.querySelector('.donut .seg.neu'),
  neg: document.querySelector('.donut .seg.neg')
};
const pieCenter = document.getElementById('pie-center');
const pieLegend = {
  pos: document.querySelector('[data-p="pos"]'),
  neu: document.querySelector('[data-p="neu"]'),
  neg: document.querySelector('[data-p="neg"]')
};
const verbQuote = document.getElementById('verb-quote');

/* logos réseaux (SVG inline, monochromes) */
const ICONS = {
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 3H21l-7.3 8.3L22.2 21h-6.8l-5.3-6.2L4 21H.8l7.8-8.9L.5 3h7l4.8 5.7L17.7 3zm-1.2 16h1.9L6.9 4.9H4.9L16.5 19z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.1 1.8 3.7 4 4v3c-1.6 0-3-.5-4-1.3v6.6c0 3.4-2.6 5.7-5.7 5.7A5.6 5.6 0 0 1 5.2 15c0-3.2 2.6-5.6 5.9-5.5v3.1c-1.6-.2-2.9.9-2.9 2.4 0 1.4 1.1 2.5 2.6 2.5 1.6 0 2.8-1.2 2.8-3V3h3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.4 8.4h4.6V23H.4V8.4zm7.6 0h4.4v2h.1c.6-1.2 2.1-2.4 4.4-2.4 4.7 0 5.6 3.1 5.6 7.1V23h-4.6v-6.9c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V23H8V8.4z"/></svg>',
  presse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M7 9.5h10M7 13h10M7 16.5h6"/></svg>',
  forums: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.6A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>'
};
const NAMES = {x:'X / Twitter', tiktok:'TikTok', instagram:'Instagram', linkedin:'LinkedIn', presse:'Presse en ligne', forums:'Forums & avis'};

/* données par étude (démo) — sujets trendy */
const DATA = {
  '': {t:'VIGIE360 · Salle de veille — démo',
    k:[[48213,''],[68,' %'],[7,'']],
    n:[['up','▲ +12 % vs hier'],['up','▲ +4 pts / 7 j'],['','Délai max : 15 min']],
    curve:[.2,.28,.24,.4,.48,.55,.72,.68],
    src:[['x',78],['tiktok',64],['instagram',52],['linkedin',31]],
    pie:[68,22,10],
    verb:[
      ['x','« Service client au top, réponse en 10 minutes chrono. »','pos'],
      ['tiktok','« L\'unboxing le plus satisfaisant de l\'année 😍 »','pos'],
      ['forums','« Quelqu\'un a comparé avec la concurrence ? Je suis mitigé. »','neu']
    ],
    live:true},
  sfr: {t:'Étude · Rachat de SFR — télécoms',
    k:[[214380,''],[41,' %'],[18,'']],
    n:[['up','▲ +146 % depuis l\'annonce'],['down','▼ -6 pts / 7 j'],['','Pic : 9 alertes / jour']],
    curve:[.15,.2,.3,.75,.9,.7,.6,.65],
    src:[['x',82],['presse',77],['forums',54],['linkedin',43]],
    pie:[41,38,21],
    verb:[
      ['x','« Client SFR depuis 10 ans, j\'espère que le rachat va enfin améliorer le réseau… »','neu'],
      ['presse','« Le démantèlement de SFR redessine le paysage télécom français. »','neu'],
      ['forums','« Vers qui migrer si les prix augmentent après le rachat ? »','neg'],
      ['linkedin','« Consolidation historique pour le secteur : les enjeux d\'infrastructure sont colossaux. »','pos']
    ],
    live:true},
  cdm: {t:'Étude · Coupe du Monde 2026 — ferveur',
    k:[[612540,''],[74,' %'],[12,'']],
    n:[['up','▲ record en approche'],['up','▲ +11 pts vs qualifs'],['','15 min tenus, 24/7']],
    curve:[.2,.3,.42,.5,.62,.7,.82,.95],
    src:[['x',89],['tiktok',84],['instagram',71],['presse',58]],
    pie:[74,19,7],
    verb:[
      ['x','« On y croit pour 2026, cette génération a tout pour aller au bout 🇫🇷 »','pos'],
      ['tiktok','« Le montage sur les buts des qualifs : 2M de vues en 24 h. »','pos'],
      ['instagram','« Les maillots 2026 sont magnifiques, rupture de stock partout. »','pos'],
      ['forums','« Les horaires des matchs côté US vont être compliqués pour l\'Europe… »','neu']
    ],
    live:true},
  shein: {t:'Étude · Shein vs BHV — crise digitale',
    k:[[132480,''],[22,' %'],[31,'']],
    n:[['up','▲ +212 % pendant la crise'],['down','▼ -29 pts en 72 h'],['','Pic : 11 alertes / jour']],
    curve:[.12,.15,.2,.85,.95,.7,.5,.38],
    src:[['x',84],['tiktok',71],['presse',66],['forums',24]],
    pie:[22,34,44],
    verb:[
      ['x','« Bravo aux marques qui se retirent du BHV, cohérence avant tout. »','neg'],
      ['presse','« La polémique enfle autour du partenariat avec le grand magasin parisien. »','neu'],
      ['forums','« Le BHV qui accueille Shein, je ne comprends plus la stratégie. »','neg']
    ],
    live:true},
  huda: {t:'Étude · Bad buzz Huda Beauty',
    k:[[96340,''],[18,' %'],[24,'']],
    n:[['up','▲ +164 % en 48 h'],['down','▼ -33 pts au pic'],['','Retour au calme : 9 jours']],
    curve:[.18,.9,.75,.55,.4,.3,.24,.2],
    src:[['tiktok',88],['x',76],['instagram',49],['forums',33]],
    pie:[18,37,45],
    verb:[
      ['tiktok','« La vidéo d\'excuses la plus commentée de la semaine. »','neu'],
      ['x','« La réponse de la marque arrive trop tard, dommage. »','neg'],
      ['instagram','« Les stories de créatrices qui prennent leurs distances s\'enchaînent. »','neg']
    ],
    live:true},
  x: {t:'Étude · Départs de X — migration',
    k:[[74210,''],[54,' %'],[9,'']],
    n:[['up','▲ +38 % sur 30 jours'],['up','▲ sentiment stable'],['','Signal faible confirmé']],
    curve:[.2,.26,.34,.4,.5,.58,.7,.82],
    src:[['forums',72],['x',66],['presse',58],['tiktok',31]],
    pie:[54,31,15],
    verb:[
      ['forums','« Migration réussie, toute la communauté a suivi en une semaine. »','pos'],
      ['x','« Encore un exode annoncé… on verra dans six mois. »','neu'],
      ['presse','« Les plateformes alternatives enregistrent des inscriptions record. »','pos']
    ],
    live:true}
};

function makePath(v, close){
  const n = v.length, pts = v.map((y, i) => [i/(n-1)*320, 84 - y*72]);
  let d = `M${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for(let i = 1; i < n; i++){
    const [x0,y0] = pts[i-1], [x1,y1] = pts[i], mx = ((x0+x1)/2).toFixed(1);
    d += ` C${mx},${y0.toFixed(1)} ${mx},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return close ? d + ' L320,90 L0,90 Z' : d;
}
function tween(el, to, suf){
  const from = parseInt(el.textContent.replace(/\D/g, '')) || 0;
  const t0 = performance.now(), dur = 900;
  (function tick(t){
    const p = Math.min((t - t0)/dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from)*e).toLocaleString('fr-FR') + suf;
    if(p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* camembert : 3 arcs animés (stroke-dasharray sur un cercle r=40) */
const CIRC = 2 * Math.PI * 40;
function setPie(p){
  const [pos, neu, neg] = p;
  let off = 0;
  [['pos', pos], ['neu', neu], ['neg', neg]].forEach(([k, v]) => {
    const seg = pieSegs[k];
    seg.style.strokeDasharray = (v/100*CIRC) + ' ' + CIRC;
    seg.style.strokeDashoffset = -off/100*CIRC;
    off += v;
    pieLegend[k].textContent = v + ' %';
  });
  pieCenter.textContent = pos + ' %';
}

/* réseaux sociaux : lignes avec logo + part de voix */
function setSources(src){
  srcList.innerHTML = src.map(([net, w], i) =>
    `<div class="src"><span class="s-head"><span class="s-ico">${ICONS[net]}</span>${NAMES[net]}<em>${w} %</em></span><div><i style="--w:${w}%;transition-delay:${.15*i + .3}s"></i></div></div>`
  ).join('');
}

/* verbatims : rotation avec animation d'apparition */
let verbs = [], verbIdx = 0, verbTimer = null;
function showVerb(){
  if(!verbs.length) return;
  const [net, txt, tone] = verbs[verbIdx % verbs.length];
  verbQuote.querySelector('.v-ico').innerHTML = ICONS[net];
  verbQuote.querySelector('p').textContent = txt;
  verbQuote.querySelector('cite').textContent = NAMES[net];
  verbQuote.className = 'show ' + tone;
  verbQuote.getBoundingClientRect();
  verbIdx++;
}
function cycleVerb(){
  verbQuote.className = '';
  verbQuote.getBoundingClientRect();  /* reflow : relance la transition d'apparition */
  showVerb();
}
function startVerbs(list){
  verbs = list; verbIdx = 0;
  clearInterval(verbTimer);
  cycleVerb();
  verbTimer = setInterval(() => { if(!document.hidden) cycleVerb(); }, 4500);
}

function render(d){
  title.textContent = d.t;
  d.k.forEach((kv, i) => tween(kpis[i], kv[0], kv[1]));
  d.n.forEach((nn, i) => { notes[i].className = nn[0]; notes[i].textContent = nn[1]; });
  line.setAttribute('d', makePath(d.curve, false));
  area.setAttribute('d', makePath(d.curve, true));
  [line, area].forEach(p => { p.style.animation = 'none'; p.getBoundingClientRect(); p.style.animation = ''; });
  setSources(d.src);
  setPie(d.pie);
  startVerbs(d.verb);
  live.classList.toggle('on', d.live);
}

sel.addEventListener('change', () => {
  if(pick) pick.classList.add('used');   /* l'indice disparaît après le 1er clic */
  render(DATA[sel.value] || DATA['']);
});

/* premier rendu quand le panneau devient visible (déclenche les animations) */
const pio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    pio.unobserve(e.target);
    render(DATA['']);
  });
}, {threshold:.3});
if(panel) pio.observe(panel);

/* la salle de veille vit : les mentions grimpent doucement en continu */
let liveBase = null;
setInterval(() => {
  if(document.hidden || !kpis[0]) return;
  const cur = parseInt(kpis[0].textContent.replace(/\D/g, '')) || 0;
  if(cur < 100) return; /* pas encore rendu */
  tween(kpis[0], cur + 7 + Math.floor(Math.random()*23), '');
}, 6000);
})();

/* ================= CAPTURE D'EMAILS (leads) ================= */
(function(){
"use strict";
/* ↓ pour la collecte réelle : renseigner un endpoint Formspree (https://formspree.io/f/xxxx) ou équivalent */
const ENDPOINT = '';
const RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function send(email, source, extra, cb){
  if(ENDPOINT){
    fetch(ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({email, source, extra, page: location.pathname})
    }).then(() => cb()).catch(() => cb());
  } else setTimeout(cb, 600); /* mode démo */
}
document.querySelectorAll('.lead-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input'), btn = form.querySelector('button');
    if(!RX.test(input.value.trim())){ form.classList.add('err'); input.focus(); return; }
    form.classList.remove('err');
    btn.disabled = true; btn.textContent = 'Envoi…';
    send(input.value.trim(), form.dataset.source || 'site', form.dataset.extra || '', () => {
      try { sessionStorage.setItem('licter_lead', '1'); } catch(e){}
      form.style.display = 'none';
      const ok = form.parentElement.querySelector('.lead-ok');
      if(ok) ok.style.display = 'block';
    });
  });
});

/* études gated : modale */
const back = document.getElementById('modal-gate');
if(back){
  const titre = back.querySelector('.modal-titre');
  const form = back.querySelector('.lead-form');
  const ok = back.querySelector('.lead-ok');
  const btn = form.querySelector('button');
  function open(t){
    titre.textContent = t;
    form.style.display = 'flex'; form.classList.remove('err');
    btn.disabled = false; btn.textContent = 'Recevoir le PDF';
    ok.style.display = 'none';
    back.classList.add('open');
    form.querySelector('input').focus();
  }
  function close(){ back.classList.remove('open'); }
  document.querySelectorAll('.gate').forEach(g =>
    g.addEventListener('click', e => { e.preventDefault(); open(g.dataset.titre); }));
  back.addEventListener('click', e => { if(e.target === back) close(); });
  back.querySelector('.close').addEventListener('click', close);
  addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
}
})();

/* ================= MINI-AUDIT INSTANTANÉ ================= */
(function(){
"use strict";
const input = document.getElementById('audit-input');
if(!input) return;
const btn = document.getElementById('audit-btn');
const res = document.getElementById('audit-res');
const nom = document.getElementById('audit-nom');
const vMentions = res.querySelector('[data-v="mentions"]');
const vSent = res.querySelector('[data-v="sent"]');
const vVis = res.querySelector('[data-v="vis"]');
const bSent = res.querySelector('[data-b="sent"]');
const bVis = res.querySelector('[data-b="vis"]');
const form = res.querySelector('.lead-form');

function hash(s){ let h = 7; for(const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function tweenNum(el, to, fmt){
  const t0 = performance.now(), dur = 1100;
  (function tick(t){
    const p = Math.min((t - t0)/dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(to * e));
    if(p < 1) requestAnimationFrame(tick);
  })(t0);
}
/* phase d'analyse simulée : décompte avant l'affichage des chiffres */
const load = document.getElementById('audit-load');
const stepEl = document.getElementById('audit-step');
const timerEl = document.getElementById('audit-timer');
const STEPS = [
  'Interrogation des réseaux sociaux…',
  'Collecte des mentions…',
  'Analyse du sentiment…',
  'Calcul du score de visibilité…'
];
const ANALYSE_MS = 5000;
let running = false;

function reveal(marque){
  const h = hash(marque.toLowerCase());
  const mentions = 2400 + h % 78000;          /* simulation stable par marque */
  const sent = 38 + h % 38;                   /* 38–75 % */
  const vis = 42 + (h >> 3) % 49;             /* 42–90 /100 */
  nom.textContent = marque;
  form.dataset.extra = 'marque : ' + marque;
  res.classList.add('on');
  tweenNum(vMentions, mentions, n => n.toLocaleString('fr-FR'));
  tweenNum(vSent, sent, n => n + ' %');
  tweenNum(vVis, vis, n => n + ' /100');
  bSent.style.width = sent + '%';
  bVis.style.width = vis + '%';
  res.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

function go(){
  const marque = input.value.trim();
  if(marque.length < 2){ input.focus(); return; }
  if(running) return;
  running = true;
  btn.disabled = true;
  res.classList.remove('on');
  bSent.style.width = '0';
  bVis.style.width = '0';
  stepEl.textContent = STEPS[0];
  timerEl.textContent = (ANALYSE_MS/1000).toFixed(1).replace('.', ',') + ' s';
  load.classList.add('on');
  load.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  const t0 = performance.now();
  const iv = setInterval(() => {
    const left = Math.max(0, ANALYSE_MS - (performance.now() - t0));
    timerEl.textContent = (left/1000).toFixed(1).replace('.', ',') + ' s';
    stepEl.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor((ANALYSE_MS - left) / (ANALYSE_MS / STEPS.length)))];
    if(left <= 0){
      clearInterval(iv);
      load.classList.remove('on');
      btn.disabled = false;
      running = false;
      reveal(marque);
    }
  }, 100);
}
btn.addEventListener('click', go);
input.addEventListener('keydown', e => { if(e.key === 'Enter') go(); });
})();

/* ================= EXIT-INTENT (1 fois par session) ================= */
(function(){
"use strict";
const modal = document.getElementById('modal-exit');
if(!modal) return;
if(matchMedia('(pointer:coarse)').matches) return; /* desktop uniquement */
let armed = false;
setTimeout(() => armed = true, 12000); /* ne s'arme qu'après 12 s sur la page */
function seen(){ try { return sessionStorage.getItem('licter_exit') || sessionStorage.getItem('licter_lead'); } catch(e){ return true; } }
function close(){ modal.classList.remove('open'); }
document.addEventListener('mouseout', e => {
  if(!armed || e.relatedTarget || e.clientY > 0 || seen()) return;
  try { sessionStorage.setItem('licter_exit', '1'); } catch(e){}
  modal.classList.add('open');
});
modal.addEventListener('click', e => { if(e.target === modal) close(); });
modal.querySelector('.close').addEventListener('click', close);
addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
})();

/* ---------- Liquid Glass : filtre de réfraction + couches de verre ---------- */
(function(){
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('style', 'display:none');
  svg.innerHTML =
    '<filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence"/>' +
      '<feComponentTransfer in="turbulence" result="mapped">' +
        '<feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5"/>' +
        '<feFuncG type="gamma" amplitude="0" exponent="1" offset="0"/>' +
        '<feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5"/>' +
      '</feComponentTransfer>' +
      '<feGaussianBlur in="turbulence" stdDeviation="3" result="softMap"/>' +
      '<feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">' +
        '<fePointLight x="-200" y="-200" z="300"/>' +
      '</feSpecularLighting>' +
      '<feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="softMap" scale="90" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>';
  document.body.appendChild(svg);

  const GLASS = '.modal';
  document.querySelectorAll(GLASS).forEach(el => {
    const g = document.createElement('i');
    g.className = 'lg';
    g.setAttribute('aria-hidden', 'true');
    const e = document.createElement('i');
    e.className = 'lg-edge';
    e.setAttribute('aria-hidden', 'true');
    el.prepend(g, e);
  });
})();
