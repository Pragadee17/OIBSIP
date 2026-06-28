/* ── CANVAS BACKGROUND ANIMATION ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], connections = [];
const NODE_COUNT = 20;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', () => { resize(); initNodes(); });

class Node {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .35; this.vy = (Math.random() - .5) * .35;
    this.r = Math.random() * 2 + 1;
    this.type = Math.random() < .3 ? 'square' : Math.random() < .5 ? 'diamond' : 'circle';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.fillStyle = 'rgba(126,184,212,0.28)';
    ctx.strokeStyle = 'rgba(126,184,212,0.22)';
    ctx.lineWidth = 1;
    if (this.type === 'circle') { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); }
    else if (this.type === 'square') { ctx.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2); }
    else { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.PI / 4); ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2); ctx.restore(); }
  }
}

/* Circuit-like nodes with extra components */
const components = ['resistor', 'capacitor', 'led', 'wire'];
class CircuitNode extends Node {
  constructor() { super(); this.comp = components[Math.floor(Math.random() * components.length)]; this.angle = Math.random() * Math.PI * 2; this.pulse = Math.random() * Math.PI * 2; }
  draw() {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
    this.pulse += .012;
    const glow = .14 + .07 * Math.sin(this.pulse);
    ctx.strokeStyle = `rgba(126,184,212,${glow})`; ctx.lineWidth = 1;
    if (this.comp === 'resistor') {
      ctx.strokeRect(-6, -3, 12, 6);
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-6, 0); ctx.moveTo(6, 0); ctx.lineTo(10, 0); ctx.stroke();
    } else if (this.comp === 'capacitor') {
      ctx.beginPath(); ctx.moveTo(-2, -6); ctx.lineTo(-2, 6); ctx.moveTo(2, -6); ctx.lineTo(2, 6); ctx.moveTo(-8, 0); ctx.lineTo(-2, 0); ctx.moveTo(2, 0); ctx.lineTo(8, 0); ctx.stroke();
    } else if (this.comp === 'led') {
      ctx.fillStyle = `rgba(126,184,212,${glow})`;
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, -5); ctx.lineTo(5, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5, -6); ctx.lineTo(5, 6); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(126,184,212,${glow})`; ctx.fill();
    }
    ctx.restore();
  }
}

function initNodes() {
  nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) nodes.push(Math.random() < .3 ? new CircuitNode() : new Node());
}
initNodes();

function drawConnections() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const op = (1 - dist / 110) * .06;
        ctx.strokeStyle = `rgba(126,184,212,${op})`;
        ctx.lineWidth = .6;
        ctx.beginPath();
        /* right-angle circuit style */
        const mx = (nodes[i].x + nodes[j].x) / 2;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mx, nodes[i].y);
        ctx.lineTo(mx, nodes[j].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
}

/* Scanning line */
let scanY = 0;
function drawScan() {
  scanY = (scanY + .4) % H;
  const g = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
  g.addColorStop(0, 'rgba(126,184,212,0)');
  g.addColorStop(.5, 'rgba(126,184,212,0.03)');
  g.addColorStop(1, 'rgba(126,184,212,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, scanY - 40, W, 80);
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawScan();
  drawConnections();
  nodes.forEach(n => { n.update(); n.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* ── FLOATING CODE SYMBOLS ── */
const syms = ['<', '/>', '{', '}', '( )', '=>', ';', '#', '//', '&&', '||', '!=', '==', '0x', '1;', 'if', 'fn', 'IoT', '[ ]', '++', '--', '::', 'Pi', '∑', 'λ', 'Ω', '≈', '⊕'];
const layer = document.getElementById('symLayer');
function spawnSym() {
  const el = document.createElement('div');
  el.className = 'sym';
  el.textContent = syms[Math.floor(Math.random() * syms.length)];
  el.style.left = Math.random() * 96 + 'vw';
  el.style.fontSize = (Math.random() * 14 + 10) + 'px';
  const dur = Math.random() * 18 + 12;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = (Math.random() * 6) + 's';
  layer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 6) * 1000);
}
for (let i = 0; i < 10; i++)setTimeout(spawnSym, i * 700);
setInterval(spawnSym, 3200);

/* ── TYPED ── */
const roles = ["CSE Student", "IoT Developer", "Embedded Systems Enthusiast"];
let ri = 0, ci = 0, del = false;
function typeLoop() {
  const r = roles[ri];
  document.getElementById('typed').textContent = r.slice(0, ci);
  if (!del && ci < r.length) { ci++; setTimeout(typeLoop, 80); }
  else if (!del) { del = true; setTimeout(typeLoop, 1800); }
  else if (del && ci > 0) { ci--; setTimeout(typeLoop, 40); }
  else { del = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 400); }
}
typeLoop();

/* ── SCROLL FADE ── */
const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: .1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

/* ── SKILL BARS ── */
const bobs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.sk-fill').forEach(b => { b.style.width = b.dataset.w + '%'; }); }); }, { threshold: .2 });
document.querySelectorAll('.skill-panel').forEach(el => bobs.observe(el));

/* ── TABS ── */
function switchTab(id, btn) {
  document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  setTimeout(() => document.querySelectorAll('#tab-' + id + ' .sk-fill').forEach(b => { b.style.width = '0'; setTimeout(() => b.style.width = b.dataset.w + '%', 50); }), 10);
}

/* ── PROJECT FILTER ── */
function filterProj(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.proj-card').forEach(c => { c.style.display = (cat === 'all' || c.dataset.cat.includes(cat)) ? 'flex' : 'none'; });
}

/* ── RESUME OVERLAY ── */
function openResume() { document.getElementById('resumeOverlay').classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeResume() { document.getElementById('resumeOverlay').classList.remove('show'); document.body.style.overflow = ''; }
document.getElementById('resumeOverlay').addEventListener('click', function (e) { if (e.target === this) closeResume(); });
function previewResume() {
  const w = window.open('', '_blank');
  const html = document.getElementById('resumeContent').innerHTML;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pragadeeswaran H — Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;background:#fff;color:#1a1a1a;padding:2rem 3rem;max-width:900px;margin:0 auto;}
  .fr-name{font-size:2rem;font-weight:700;color:#1a1a2e;text-align:center;letter-spacing:.5px;margin-bottom:.5rem;}
  .fr-links{text-align:center;font-size:.78rem;color:#4A4A8A;margin:.3rem 0 1.2rem;display:flex;justify-content:center;gap:1.2rem;flex-wrap:wrap;}
  .fr-sec{font-size:.78rem;font-weight:700;color:#7EB8D4;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #7EB8D4;padding-bottom:3px;margin:1.2rem 0 .6rem;}
  .fr-item{margin-bottom:.6rem;}.fr-item-title{font-size:.9rem;font-weight:600;color:#1a1a2e;}
  .fr-item-sub{font-size:.8rem;color:#555;}.fr-item-desc{font-size:.8rem;color:#666;line-height:1.7;margin-top:.2rem;}
  .fr-skills-row{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.4rem;}
  .fr-skill{background:#e8f4fb;color:#185FA5;font-size:.72rem;padding:.2rem .55rem;border-radius:3px;font-weight:500;}
  </style></head><body>${html}</body></html>`);
  w.document.close();
}
function downloadResume() {
  /* Replace the URL below with your actual hosted resume PDF */
  const link = document.createElement('a');
  link.href = '#';
  link.download = 'Pragadeeswaran_H_Resume.pdf';
  alert('Replace the href in downloadResume() with your PDF link to enable download.');
}

/* ── MOBILE NAV ── */
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* ── BACK TO TOP ── */
window.addEventListener('scroll', () => { document.getElementById('btt').classList.toggle('show', window.scrollY > 400); });

/* ── CONTACT INPUT VALIDATION ── */
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('contactName');
  const mobileInput = document.getElementById('contactMobile');

  if (nameInput) {
    // Allow letters, spaces, apostrophes and hyphens only
    nameInput.addEventListener('input', () => {
      nameInput.value = nameInput.value.replace(/[^A-Za-z\s'\-\.]/g, '');
    });
    // Prevent paste of invalid characters
    nameInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const filtered = text.replace(/[^A-Za-z\s'\-\.]/g, '');
      document.execCommand('insertText', false, filtered);
    });
  }

  if (mobileInput) {
    // Allow digits only
    mobileInput.addEventListener('input', () => {
      mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
    });
    mobileInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const filtered = text.replace(/[^0-9]/g, '');
      document.execCommand('insertText', false, filtered);
    });
  }
});

/* ── SKILL PERCENT LABELS (hover reveal) ── */
document.addEventListener('DOMContentLoaded', () => {
  // For each skill card, read the .sk-fill[data-w] and add a .skill-pct element
  document.querySelectorAll('.skill-card').forEach(card => {
    const fill = card.querySelector('.sk-fill');
    if (!fill) return;
    const w = fill.dataset.w;
    const pct = document.createElement('div');
    pct.className = 'skill-pct';
    pct.textContent = w ? `${w}%` : '';
    card.appendChild(pct);
  });
});
