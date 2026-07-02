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
    if(reduced){ el.textContent = target + suf; return; }
    const t0 = performance.now(), dur = 1600;
    (function tick(t){
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + suf;
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
    const n = Math.min(110, Math.floor(canvas.offsetWidth / 12));
    pts = Array.from({length:n}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.22*devicePixelRatio,
      vy: (Math.random()-.5)*.22*devicePixelRatio,
      r: (Math.random()*1.8+.8)*devicePixelRatio,
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
      ctx.fillStyle = p.gold ? 'rgba(190,167,107,.85)' : 'rgba(244,241,232,.4)';
      ctx.fill();
    }
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const a = pts[i], b = pts[j], d = Math.hypot(a.x-b.x, a.y-b.y);
      if(d < LINK){
        ctx.strokeStyle = (a.gold && b.gold) ? `rgba(190,167,107,${.35*(1-d/LINK)})` : `rgba(244,241,232,${.12*(1-d/LINK)})`;
        ctx.lineWidth = devicePixelRatio*.6;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
    if(!reduced) requestAnimationFrame(drawConst);
  })();
}

/* ---------- carte du monde en points ---------- */
const map = document.getElementById('dotmap');
if(map){
  const MASK = "1ff00180000003fff000201c00000;f0ffffd20c0000001fff01f89f600000;10ffffffffb0007c0001ffe0f627f387f80;ffffffffffffebff00001fe1d3f31ffffc1;fffffffffffffcf7800e07e3e0fffffffef;7ffffffffffffffbc00403c1c57ffffff80;3dfffffffffffffdf0000180303ffffffe0;33fffffffffffe1f0000000701ffff8b80;180fffffffffff880000003f03fffc0400;1c07ffffffffffce1000007f1ffff80080;83ffffffffffffe2c0000ffbffff40000;3fffffffffffffe00000fffffff00000;3fffffffffffffe00001afffffc00000;2fffffffffffffe000011fffffc00000;7fffffff8fbffc000003fffffc00000;63fffffffcc1e5f8000007ffffc00000;fffffff9ddc878000003ffffc00000;10affffff9ff523c000001ffffc00000;10bffffffbfe4a18000000ffffc00000;e8ffffffff003f0000000ffff800000;31ffffffff007f80000007fff000000;1fffffffffdffc0000003ffc000000;1ffffffdf7fffc00000041fe000000;1ffffff9f7fffe00000040f8000000;fffff0bffffff00000000f4000000;7fffe1fefffff00000060e0000000;fcfc1fefffff80000108e0000000;1787c0fdfffff0000040dc0000000;20f838079fffff0000000f80000000;f01801bfffff8000003c00000000;d018007fffff8000003000000000;30d01003ffffff00002e2000000000;40102003fffffe00007fc000000000;48202001fffffc0000ff0000000000;c280001ffff000003ff0000000000;e100000fffc000003ff8000000000;f2000007ffc000003ff8000000000;a166000003ffc00001fff8000000000;3c304000001ffc00007fff8000000000;170000000001ff80000ffffc000000000;b0060000001ff80000ffff8000000000;80000000003ff80000ffff0000000000;20000000003ff800007fff0000000000;27800000003ff800007fff0000000000;67c00000013ff800007ffe0000000000;7fc00000018ff800007ffc0000000000;fff00000018ff800003ff80000000000;fffc0000018ff000003ff80000000000;1fffc0000008ff000000ff80000000000;3fffc00000007f0000007fc0000000000;3fff800000007f0000007fc0000000000;3fff800000003e0000003fc0000000000;1fc7800000001e0000003fc0000000000;1f80800000000200000017c0000000000;f0000000000000000000fc0000000000;400000000000000000000007e0000000000;400000000000000000000003e0000000000;100800000000000000000001c0000000000;180000000000000000000001e0000000000;e0000000000;e0000000000;60000000000;20000000000;1c0000000000".split(";");
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
          mctx.fillStyle = 'rgba(244,241,232,.22)';
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
