// =====================================================================
//  styles/paper-reel/kit.js — a faceless "explainer reel" look matched from a reference reel:
//  flat cut-paper shapes with NO outlines, a mottled paper texture inside every shape, soft drop shadows,
//  a muted palette (slate, navy, mustard, cream) with one hero colour (the mascot's terracotta).
//  Pieces: a screwed enamel sign (kicker + headline), a typing terminal bar, counter cards, rubber stamps,
//  word-by-word caption chips on torn salmon paper, and the box mascot ("clawd") with a hat per scene.
//  Built on kit/core.js. Motion on 1s (smooth, code-driven), static paper (no boil).
// =====================================================================
const PR = {
  clawd: '#d67555', clawdD: '#c46b4c', clawdL: '#de8466',
  slate: '#869997', slateL: '#95a9a7', slateD: '#788a89',
  navy: '#1c2b56', navyD: '#192833', ink: '#181b24', char: '#23262c',
  cream: '#e9e5da', creamL: '#f4f1e8', paperW: '#f9f8f4',
  mustard: '#e6b82a', yellow: '#f2c94c', green: '#2f9e5b', greenK: '#3e8a2c', red: '#d2453a', redD: '#a9322a',
  chip: '#d97a5b', chipText: '#f7efe2',
  floor: '#87857c', floorD: '#6f6d66', wood: '#6b4528', woodD: '#4c321d', woodL: '#9a7346',
  board: '#2d4a3d', boardD: '#223a30', teal: '#6c9e8f', tealL: '#86b3a4',
  purple: '#462b59', plum: '#583656', sky: '#a9cbe0', grey: '#9a968c', greyD: '#5f6068', orange: '#e07a4f',
  brown: '#8a5a33', tan: '#c9a46b', blue: '#3f6fb0', pink: '#e9a3a3',
};
const F_HEAD = '"Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif';
const F_CHIP = 'SuperClarendon, Rockwell, Georgia, serif';
const F_CHALK = 'Chalkduster, "Chalkboard SE", "Comic Sans MS", cursive';
const F_MONO = 'Menlo, "SF Mono", Consolas, monospace';

// ---- the paper texture: built once (seeded), layered value noise + speckle. A static cache, so frames stay pure.
const PRTEX = {};
function prTex() {
  if (PRTEX.t) return PRTEX.t;
  const TW = 1600, TH = 2600, c = document.createElement('canvas'); c.width = TW; c.height = TH;
  const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, TW, TH);
  const R = RNG('prtex');
  const octave = (cw, ch, amp) => {
    const s = document.createElement('canvas'); s.width = cw; s.height = ch; const sg = s.getContext('2d'), im = sg.createImageData(cw, ch);
    for (let i = 0; i < cw * ch; i++) { const v = 128 + (R.f() * 2 - 1) * amp; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    sg.putImageData(im, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.globalAlpha = 0.5; g.drawImage(s, 0, 0, TW, TH); g.globalAlpha = 1;
  };
  octave(10, 16, 70); octave(28, 46, 80); octave(80, 130, 70); octave(260, 420, 60);
  const fine = g.createImageData(TW, TH);   // speckle
  for (let i = 0; i < TW * TH; i++) { const v = 128 + (R.f() * 2 - 1) * 46; fine.data[i * 4] = fine.data[i * 4 + 1] = fine.data[i * 4 + 2] = v; fine.data[i * 4 + 3] = 70; }
  const f2 = document.createElement('canvas'); f2.width = TW; f2.height = TH; f2.getContext('2d').putImageData(fine, 0, 0); g.drawImage(f2, 0, 0);
  PRTEX.t = c; return c;
}
// ---- paths
const pR = (x, y, w, h, r = 6) => () => ctx.roundRect(x, y, w, h, r);
const pE = (cx, cy, rx, ry, rot = 0) => () => ctx.ellipse(cx, cy, rx, ry, rot, 0, TAU);
const pG = (P) => () => { ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath(); };
const pA = (cx, cy, r, a0, a1) => () => { ctx.moveTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r); ctx.arc(cx, cy, r, a0, a1); ctx.closePath(); };
// a paper shape: flat fill, soft shadow, mottled texture clipped inside, optional light rim
function pp(path, fill, o = {}) {
  ctx.save();
  if (o.shadow !== false) { ctx.shadowColor = o.shc ?? 'rgba(12,10,8,0.34)'; ctx.shadowBlur = o.sb ?? 16; ctx.shadowOffsetX = o.sx ?? 0; ctx.shadowOffsetY = o.sy ?? 8; }
  ctx.beginPath(); path(); ctx.fillStyle = fill; ctx.fill();
  ctx.restore();
  if (o.tex !== false) {
    const k = hash('pp', o.key ?? fill);
    ctx.save(); ctx.beginPath(); path(); ctx.clip();
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = o.tex ?? 0.55;
    const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(prTex(), -(k % 480), -((k >>> 9) % 640)); ctx.setTransform(m);
    ctx.restore();
  }
  if (o.shade) { ctx.save(); ctx.beginPath(); path(); ctx.clip(); const bb = o.shade; const gr = ctx.createLinearGradient(0, bb[0], 0, bb[1]); gr.addColorStop(0, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(20,10,5,0.16)'); ctx.fillStyle = gr; ctx.fillRect(-4000, -4000, 8000, 8000); ctx.restore(); }
  if (o.rim) { ctx.save(); ctx.beginPath(); path(); ctx.strokeStyle = o.rim; ctx.lineWidth = o.rw ?? 2.5; ctx.stroke(); ctx.restore(); }
}
function withT(x, y, rot, s, fn) { if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); fn(); ctx.restore(); }
function txt(str, x, y, size, color, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 800} ${size}px ${o.font ?? F_HEAD}`; ctx.fillStyle = color; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = o.base ?? 'alphabetic';
  if (o.track) ctx.letterSpacing = o.track + 'px';
  if (o.frac != null && o.frac < 1) { const w = ctx.measureText(str).width, x0 = o.align === 'center' ? x - w / 2 : x; ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.2, Math.max(0, w * o.frac) + 4, size * 1.7); ctx.clip(); }
  ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}
function txtW(str, size, o = {}) { ctx.save(); ctx.font = `${o.weight ?? 800} ${size}px ${o.font ?? F_HEAD}`; if (o.track) ctx.letterSpacing = o.track + 'px'; const w = ctx.measureText(str).width; ctx.restore(); return w; }
const fitSize = (str, maxW, s0, o = {}) => { let s = s0; while (s > 20 && txtW(str, s, o) > maxW) s -= 2; return s; };
// the claude asterisk (the brand spark)
const sparkIcon = (x, y, r, color = PR.orange, rot = 0) => asterisk(x, y, r * 0.18, r, 12, rot, color, Math.max(2, r * 0.2));

// ---- full-bleed backgrounds
function prWall(c, o = {}) {
  pp(pR(-40, -40, W + 80, H + 80, 0), c, { key: 'wall' + c, shadow: false, tex: o.tex ?? 0.7 });
  if (o.panels !== false) { const gap = o.gap ?? 150; ctx.save(); ctx.fillStyle = o.panel ?? 'rgba(255,255,255,0.05)'; for (let x = (o.px ?? 40); x < W; x += gap) ctx.fillRect(x, 0, gap / 2, H); ctx.fillStyle = 'rgba(0,0,0,0.07)'; for (let x = (o.px ?? 40); x < W; x += gap) ctx.fillRect(x - 3, 0, 3, H); ctx.restore(); }
  if (o.streak !== false) { const sx = o.streak ?? 560, gr = ctx.createLinearGradient(sx - 120, 0, sx + 120, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.10)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(sx - 120, 0, 240, H); }
}
function prFloor(y, c = PR.floor, o = {}) {
  pp(pR(-40, y, W + 80, H - y + 40, 0), c, { key: 'floor' + c, sy: -6, sb: 18, tex: 0.75 });
  if (o.trim !== false) pp(pR(-40, y - 10, W + 80, 22, 0), o.trimC ?? PR.greyD, { key: 'ftrim', sb: 8, sy: 3 });
  if (o.studs) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = 20; x < W; x += 46) { ctx.beginPath(); ctx.arc(x, y + 30, 6, 0, TAU); ctx.fill(); } ctx.restore(); }
}

// ---- the sign: cream enamel plate, navy keyline, screws, a navy card behind it; kicker + headline
const SIGN = { x: 70, y: 140, w: 860, h: 156 };
function prSign(head, o = {}) {
  const { x, y, w, h } = SIGN, s = o.s ?? 1;
  withT(x + w / 2, y + h / 2, o.rot ?? 0, s, () => {
    const X = -w / 2, Y = -h / 2;
    if (o.back !== false) pp(pR(X + 30, Y - 24, w + 26, h + 2, 3), PR.navyD, { key: 'signback', sb: 8, sy: 4, tex: 0.5 });
    pp(pR(X, Y, w, h, 14), PR.creamL, { key: 'sign', sb: 18, sy: 9, tex: 0.6, rim: 'rgba(255,255,255,0.6)' });
    ctx.save(); ctx.strokeStyle = PR.navy; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.roundRect(X + 11, Y + 11, w - 22, h - 22, 9); ctx.stroke(); ctx.restore();
    for (const [sx, sy] of [[X + 26, Y + 26], [X + w - 26, Y + 26], [X + 26, Y + h - 26], [X + w - 26, Y + h - 26]]) pp(pE(sx, sy, 7.5, 7.5), '#a3a39d', { key: 'scr' + sx + sy, sb: 2, sy: 1, tex: 0.3 });
    txt(o.kicker ?? 'SKILL SPOTLIGHT', 0, Y + 46, 22, PR.greenK, { align: 'center', weight: 800, track: 0.5 });
    const fs = fitSize(head, w - 90, 66);
    txt(head, 0, Y + 46 + 22 + fs * 0.86, fs, PR.navy, { align: 'center', weight: 800 });
  });
}
// ---- the terminal bar: claude spark, a prompt that types on, an orange block cursor
function prTerm(str, frac, o = {}) {
  const x = o.x ?? 70, y = o.y ?? 322, w = o.w ?? 860, h = o.h ?? 78;
  pp(pR(x, y, w, h, 10), PR.char, { key: 'term', sb: 12, sy: 7, tex: 0.35 });
  sparkIcon(x + 40, y + h / 2, 17, PR.orange, 0.2);
  const n = Math.floor(str.length * clamp(frac)), shown = '> ' + str.slice(0, n), sz = o.size ?? 34;
  const tw = txt(shown, x + 74, y + h / 2 + sz * 0.36, sz, '#f4f1e8', { weight: 600 });
  if (frac < 1 || Math.floor(TT * 2.4) % 2 === 0) pp(pR(x + 82 + tw, y + h / 2 - sz * 0.55, sz * 0.48, sz * 1.1, 1), PR.orange, { shadow: false, tex: false });
}
// ---- a counter card (yellow, black keyline, a label and a big number)
function prCounter(label, val, x, y, o = {}) {
  const w = o.w ?? 330, h = o.h ?? 196;
  withT(x, y, o.rot ?? -0.035, o.s ?? 1, () => {
    pp(pR(-w / 2, -h / 2, w, h, 12), o.fill ?? PR.yellow, { key: 'ctr' + label, sb: 14, sy: 8, tex: 0.5 });
    ctx.save(); ctx.strokeStyle = PR.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 8); ctx.stroke(); ctx.restore();
    txt(label, 0, -h / 2 + 52, fitSize(label, w - 50, 25), PR.ink, { align: 'center', weight: 800 });
    txt(String(val), 0, h / 2 - 30, o.big ?? 104, PR.ink, { align: 'center', weight: 800 });
  });
}
const countUp = (t0, d, a, b) => Math.round(lerp(a, b, EZ.o3(ev(t0, d))));
// ---- a rubber stamp that slams down at t0
function prStamp(str, x, y, color, t0, o = {}) {
  if (TT < t0) return;
  const u = clamp((TT - t0) / 0.16), s = lerp(o.from ?? 1.9, 1, EZ.i2(u)) * (o.s ?? 1), sz = o.size ?? 64;
  const w = txtW(str, sz) + 60, h = sz * 1.45;
  withT(x, y, o.rot ?? -0.07, s, () => {
    if (u >= 1) pp(pR(-w / 2, -h / 2, w, h, 10), o.bg ?? 'rgba(250,248,240,0.94)', { key: 'stb' + str, sb: 10, sy: 5, tex: 0.45 });
    ctx.save(); ctx.globalAlpha = u < 1 ? 0.75 : 1; ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 7); ctx.stroke();
    txt(str, 0, sz * 0.36, sz, color, { align: 'center', weight: 800 }); ctx.restore();
  });
}
// ---- confetti / dots that burst from (x, y) at t0
function prBurst(x, y, t0, o = {}) {
  const u = (TT - t0); if (u < 0 || u > (o.life ?? 1.2)) return;
  const R = RNG('burst', x, y, t0), n = o.n ?? 16, cols = o.cols ?? [PR.yellow, PR.mustard, PR.orange, '#ffffff', PR.green];
  for (let i = 0; i < n; i++) {
    const a = R.r(0, TAU), v = R.r(260, 620) * (o.v ?? 1), px = x + Math.cos(a) * v * u, py = y + Math.sin(a) * v * u + 520 * u * u, r = R.r(7, 13) * (1 - u / (o.life ?? 1.2));
    ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, r), 0, TAU); ctx.fill();
  }
}
// ---- caption chips: every spoken word on its own scrap of salmon paper, 1–3 words at a time (from VOICE)
let CHIP_GROUPS = null;
function chipGroups() {
  if (CHIP_GROUPS) return CHIP_GROUPS;
  CHIP_GROUPS = [];
  if (typeof VOICE === 'undefined') return CHIP_GROUPS;
  for (const L of VOICE.lines) {
    let g = [];
    L.words.forEach((w, i) => {
      g.push(w);
      const end = /[,.:;!?]$/.test(w.w) || g.length >= (CHIP_MAX ?? 3) || i === L.words.length - 1 || (L.words[i + 1].t0 - w.t1 > 0.32);
      if (end) { CHIP_GROUPS.push(g); g = []; }
    });
  }
  CHIP_GROUPS.forEach((g, i) => { g.t0 = g[0].t0 - 0.03; g.t1 = i + 1 < CHIP_GROUPS.length ? CHIP_GROUPS[i + 1][0].t0 - 0.03 : VOICE.duration; });
  return CHIP_GROUPS;
}
var CHIP_MAX = 3, CHIP_Y = 1520, CHIP_X = 70, CHIP_MAXX = 930;
function prChips() {
  const draw = () => {
    const g = chipGroups().find((q) => TT >= q.t0 && TT < q.t1); if (!g) return;
    const sz = 70, h = 112; let x = CHIP_X, y = CHIP_Y;
    g.forEach((w, i) => {
      if (TT < w.t0 - 0.03) return;
      const word = w.w.replace(/^[^\w']+|[^\w']+$/g, ''); if (!word) return;
      const cw = txtW(word, sz, { font: F_CHIP, weight: 700 }) + 46;
      if (x + cw > CHIP_MAXX) { x = CHIP_X; y += h + 14; }
      const R = RNG('chip', word, w.t0), rot = (i % 2 ? 1 : -1) * R.r(0.012, 0.04), s = EZ.back(clamp((TT - w.t0 + 0.03) / 0.16));
      withT(x + cw / 2, y, rot, s, () => {
        pp(pG([[-cw / 2 + R.n(3), -h / 2 + R.n(3)], [cw / 2 + R.n(3), -h / 2 + R.n(3)], [cw / 2 + R.n(3), h / 2 + R.n(3)], [-cw / 2 + R.n(3), h / 2 + R.n(3)]]), PR.chip, { key: 'chip' + word + w.t0, sb: 12, sy: 7, tex: 0.6, rim: 'rgba(255,236,220,0.38)', rw: 3 });
        txt(word, 0, sz * 0.33, sz, PR.chipText, { font: F_CHIP, weight: 700, align: 'center' });
      });
      x += cw + 12;
    });
  };
  if (DEFER) DEFER.push(draw); else draw();
}

// ---- THE MASCOT: a terracotta box with square eyes, four legs and a diamond hand. (x, y) = where body meets legs.
//  o: s (scale), hat ('guard'|'mortar'|'boater'|'ranger'|'cap'|'phones'|'beret'|null), mood ('neutral'|'happy'|'wow'|'flat'),
//     look (eye shift, px), hand: { x, y } local hand position (default at the left side), hold(hx, hy) draws a prop in the hand,
//     pop (0..1 scale-in), lean (rad), key
var CLAWD_SCALE = 1;
function clawd(x, y, o = {}) {
  const s = (o.s ?? 1) * (o.pop ?? 1) * CLAWD_SCALE; if (s <= 0.01) return;
  const key = o.key ?? 'cl', ph = hash(key) % 100 / 100 * TAU;
  const bob = Math.sin(TT * TAU * 1.15 + ph) * 7, sq = 1 + Math.sin(TT * TAU * 2.3 + ph) * 0.012;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.lean ?? 0); ctx.scale(o.flip ? -s : s, s);
  // legs (behind the body), a little walk-cycle sway when o.walk
  [-176, -84, 84, 176].forEach((lx, i) => { const sw = o.walk ? Math.sin(TT * TAU * 2.4 + i * Math.PI / 2) * 10 : 0; pp(pR(lx - 30 + sw, -20, 60, 186 - (o.walk && i % 2 ? Math.abs(sw) : 0), 3), PR.clawdD, { key: key + 'leg' + i, sb: 10, sy: 5, tex: 0.55 }); });
  ctx.translate(0, bob * 0.6); ctx.scale(1 / sq, sq);
  const side = o.view === 'side', BW = side ? 520 : 440, BH = side ? 300 : 340;
  // the hand: a diamond at the side, with its arm hidden behind the body
  const hx = o.hand?.x ?? (side ? -300 : -262), hy = o.hand?.y ?? -150 + Math.sin(TT * TAU * 1.3 + ph) * 6;
  if (o.hold) o.hold(hx, hy, true);
  withT(hx, hy, Math.PI / 4 + (o.handRot ?? 0), 1, () => pp(pR(-38, -38, 76, 76, 4), PR.clawd, { key: key + 'hand', sb: 10, sy: 6, tex: 0.55 }));
  if (o.hold) o.hold(hx, hy, false);
  pp(pR(-BW / 2, -BH, BW, BH, 5), PR.clawd, { key: key + 'body', sb: 22, sy: 10, tex: 0.6, rim: 'rgba(255,225,205,0.28)', rw: 3 });
  // eyes
  const lk = o.look ?? 0, blink = (Math.floor(TT * FPS) + Math.round(ph * 10)) % 96 < 4, mood = o.mood ?? 'neutral';
  for (const ex of (side ? [-232, -128] : [-112, 70])) {
    const cx = ex + lk;
    if (mood === 'happy') { ctx.save(); ctx.strokeStyle = PR.ink; ctx.lineWidth = 15; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(cx - 6, -222); ctx.lineTo(cx + 22, -252); ctx.lineTo(cx + 50, -222); ctx.stroke(); ctx.restore(); }
    else { const eh = blink ? 10 : mood === 'wow' ? 78 : 66; pp(pR(cx, -250 + (66 - eh) / 2, 46, eh, 2), PR.ink, { shadow: false, tex: 0.25, key: key + 'eye' + ex }); }
  }
  if (mood === 'wow') pp(pR((side ? -170 : -30) + lk, -128, 52, 40, 6), PR.ink, { shadow: false, tex: 0.2, key: key + 'mouth' });
  if (mood === 'flat') pp(pR((side ? -170 : -26) + lk, -124, 60, 13, 2), PR.ink, { shadow: false, tex: 0.2, key: key + 'mouthf' });
  if (mood === 'happy') pp(pA(-10 + lk + 12, -150, 30, 0, Math.PI), PR.ink, { shadow: false, tex: 0.2, key: key + 'smile' });
  if (o.hat) { if (side) ctx.translate(-30, 40); clawdHat(o.hat, key); }
  ctx.restore();
}
function clawdHat(h, key) {
  const top = -340;
  if (h === 'guard') {
    pp(pA(0, top + 4, 225, Math.PI, TAU), PR.navy, { key: key + 'gdome', sb: 14, sy: 6, tex: 0.6 });
    pp(pR(-250, top - 12, 500, 48, 10), PR.navyD, { key: key + 'gband', sb: 10, sy: 5, tex: 0.5 });
    pp(pE(0, top - 120, 44, 44), PR.mustard, { key: key + 'gbadge', sb: 6, sy: 3, tex: 0.5 });
  } else if (h === 'mortar') {
    pp(pR(-170, top - 70, 340, 82, 8), PR.ink, { key: key + 'mcap', sb: 12, sy: 6, tex: 0.4 });
    pp(pG([[0, top - 170], [300, top - 96], [0, top - 30], [-300, top - 96]]), '#262a3a', { key: key + 'mboard', sb: 16, sy: 8, tex: 0.45 });
    ctx.save(); ctx.strokeStyle = PR.mustard; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, top - 100); ctx.quadraticCurveTo(170, top - 80, 210 + Math.sin(TT * 5) * 6, top + 10); ctx.stroke(); ctx.restore();
    pp(pR(196 + Math.sin(TT * 5) * 6, top + 6, 30, 64, 6), PR.mustard, { key: key + 'mtas', sb: 6, sy: 3, tex: 0.5 });
  } else if (h === 'boater') {
    pp(pE(0, top - 6, 270, 46), PR.cream, { key: key + 'bbrim', sb: 14, sy: 7, tex: 0.6 });
    pp(pR(-160, top - 150, 320, 142, 26), PR.cream, { key: key + 'bcrown', sb: 10, sy: 4, tex: 0.6 });
    pp(pR(-160, top - 64, 320, 36, 2), PR.red, { key: key + 'bband', shadow: false, tex: 0.5 });
  } else if (h === 'ranger') {
    pp(pE(0, top - 4, 290, 50), PR.tan, { key: key + 'rbrim', sb: 14, sy: 7, tex: 0.6 });
    pp(pG([[-150, top - 20], [-130, top - 150], [-40, top - 180], [0, top - 150], [40, top - 180], [130, top - 150], [150, top - 20]]), '#b8925b', { key: key + 'rcrown', sb: 10, sy: 4, tex: 0.6 });
    pp(pR(-152, top - 62, 304, 34, 3), PR.brown, { key: key + 'rband', shadow: false, tex: 0.5 });
  } else if (h === 'cap') {
    pp(pA(10, top + 4, 210, Math.PI, TAU), PR.red, { key: key + 'cdome', sb: 14, sy: 6, tex: 0.6 });
    pp(pR(-330, top - 18, 260, 36, 18), PR.redD, { key: key + 'cbill', sb: 10, sy: 6, tex: 0.5 });
    pp(pE(10, top - 206, 22, 14), PR.redD, { key: key + 'cbtn', sb: 4, sy: 2, tex: 0.4 });
  } else if (h === 'phones') {
    ctx.save(); ctx.strokeStyle = PR.char; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, top + 60, 250, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.restore();
    pp(pR(-282, top + 40, 74, 150, 22), PR.char, { key: key + 'pl', sb: 10, sy: 6, tex: 0.4 });
    pp(pR(208, top + 40, 74, 150, 22), PR.char, { key: key + 'pr', sb: 10, sy: 6, tex: 0.4 });
    pp(pE(245, top + 116, 14, 14), PR.green, { shadow: false, tex: false });
  } else if (h === 'beret') {
    pp(pE(-30, top - 30, 230, 70, -0.12), '#7b2d3a', { key: key + 'beret', sb: 14, sy: 7, tex: 0.6 });
    pp(pR(-46, top - 120, 24, 36, 8), '#7b2d3a', { key: key + 'bnub', sb: 4, sy: 2, tex: 0.4 });
  }
}
// ---- props
function prClock(x, y, r, hh, mm, key = 'clk') {
  pp(pE(x, y, r, r), PR.woodD, { key: key + 'o', sb: 14, sy: 7 });
  pp(pE(x, y, r * 0.84, r * 0.84), PR.creamL, { key: key + 'i', shadow: false, tex: 0.5 });
  const ah = (hh % 12 + mm / 60) / 12 * TAU - Math.PI / 2, am = mm / 60 * TAU - Math.PI / 2;
  ctx.save(); ctx.strokeStyle = PR.ink; ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ah) * r * 0.42, y + Math.sin(ah) * r * 0.42); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(am) * r * 0.62, y + Math.sin(am) * r * 0.62); ctx.stroke(); ctx.restore();
}
function prBunting(y, cols = [PR.red, PR.cream, PR.blue, PR.mustard, PR.green], key = 'bun') {
  ctx.save(); ctx.strokeStyle = PR.woodD; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-20, y); ctx.quadraticCurveTo(W / 2, y + 40, W + 20, y); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 7; i++) { const x = 40 + i * 160, yy = y + 4 + Math.sin(i / 6 * Math.PI) * 26, sw = Math.sin(TT * 3 + i) * 5; pp(pG([[x, yy], [x + 120, yy + 2], [x + 60 + sw, yy + 104]]), cols[i % cols.length], { key: key + i, sb: 8, sy: 5, tex: 0.5 }); }
}
function prFolder(x, y, s, fill = PR.yellow, o = {}) {
  withT(x, y, o.rot ?? 0, s, () => {
    pp(pR(-110, -92, 96, 34, 6), fill, { key: 'fdt' + fill, sb: 6, sy: 3, tex: 0.5 });
    pp(pR(-110, -70, 220, 150, 8), fill, { key: 'fd' + fill, sb: 12, sy: 6, tex: 0.55, rim: 'rgba(255,255,255,0.3)' });
    txt(o.label ?? 'SKILL.md', -96, -76, 18, PR.ink, { weight: 800 });
    sparkIcon(0, 6, 30, o.icon ?? PR.orange, 0.1);
  });
}
function prCorkboard(x, y, w, h, key = 'cork') {
  pp(pR(x - 22, y - 22, w + 44, h + 44, 6), PR.woodD, { key: key + 'f', sb: 18, sy: 9 });
  pp(pR(x, y, w, h, 2), '#b78a55', { key: key + 'c', shadow: false, tex: 0.9 });
  const R = RNG(key); ctx.save(); ctx.fillStyle = 'rgba(70,40,15,0.35)'; for (let i = 0; i < 500; i++) { ctx.fillRect(x + R.r(0, w), y + R.r(0, h), 3, 3); } ctx.restore();
}
function prNote(x, y, w, h, fill, rot, key) { withT(x, y, rot, 1, () => { pp(pR(-w / 2, -h / 2, w, h, 3), fill, { key, sb: 8, sy: 4, tex: 0.5 }); ctx.save(); ctx.strokeStyle = 'rgba(40,40,60,0.35)'; ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 16, -h / 2 + i * h / 5.2); ctx.lineTo(w / 2 - 16, -h / 2 + i * h / 5.2); ctx.stroke(); } ctx.restore(); }); }
function prStar(x, y, r, c = PR.mustard) { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.restore(); }
// chalk text written on (frac 0..1) with a soft chalk dust
function chalk(str, x, y, size, frac = 1, o = {}) {
  txt(str, x, y, size, o.color ?? 'rgba(244,244,236,0.92)', { font: F_CHALK, weight: 400, frac, align: o.align });
}
function chalkLine(P, frac, o = {}) {
  const S = subPath(P, clamp(frac)); if (S.length < 2) return;
  ctx.save(); ctx.strokeStyle = o.color ?? 'rgba(244,244,236,0.9)'; ctx.lineWidth = o.w ?? 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(o.dash ?? []);
  ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (const p of S) ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.restore();
}


// =====================================================================
//  COMPONENTS — ready-made scene parts (all in world = screen coords, 1080x1920)
// =====================================================================
// props for clawd({ hold }): a pointer stick (angle a, length len) and a pencil
const propStick = (a, len = 360) => (hx, hy, behind) => { if (!behind) return; withT(hx, hy, a, 1, () => { pp(pR(-10, -len, 20, len, 8), PR.char, { key: 'stick', sb: 8, sy: 4, tex: 0.3 }); pp(pR(-12, -len - 6, 24, 70, 8), PR.orange, { key: 'sticktip', shadow: false, tex: 0.4 }); pp(pR(-12, -len + 64, 24, 18, 2), PR.creamL, { shadow: false, tex: false }); }); };
const propPencil = (a) => (hx, hy, behind) => { if (!behind) return; withT(hx, hy, a, 1, () => { pp(pR(-14, -230, 28, 200, 3), PR.yellow, { key: 'pcl', sb: 6, sy: 3, tex: 0.4 }); pp(pG([[-14, -30], [14, -30], [0, 10]]), PR.tan, { shadow: false, tex: 0.4 }); pp(pR(-14, -250, 28, 26, 4), PR.pink, { shadow: false, tex: 0.4 }); }); };
// a framed blackboard with a chalk tray; draw on it afterwards with chalk() / chalkLine()
function prBoard(x, y, w, h, key = 'board') {
  pp(pR(x, y, w, h, 10), PR.woodD, { key: key + 'f', sb: 20, sy: 10 });
  pp(pR(x + 24, y + 24, w - 48, h - 48, 4), PR.board, { key: key + 'b', shadow: false, tex: 0.8 });
  pp(pR(x + 10, y + h - 6, w - 20, 26, 4), PR.woodL, { key: key + 't', sb: 8, sy: 5 });
  pp(pR(x + 90, y + h - 18, 46, 14, 4), PR.creamL, { shadow: false, tex: false });
}
// a green tick badge / a red cross badge that pop in at t
function prCheck(x, y, t, r = 66) { if (TT < t) return; withT(x, y, 0.1, popS(t), () => { pp(pE(0, 0, r, r), PR.green, { key: 'tick' + x, sb: 12, sy: 6 }); ctx.save(); ctx.strokeStyle = PR.creamL; ctx.lineWidth = r * 0.24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.42, 0); ctx.lineTo(-r * 0.09, r * 0.38); ctx.lineTo(r * 0.48, -r * 0.33); ctx.stroke(); ctx.restore(); }); }
function prCross(x, y, t, r = 66) { if (TT < t) return; withT(x, y, -0.1, popS(t), () => { pp(pE(0, 0, r, r), PR.red, { key: 'cross' + x, sb: 12, sy: 6 }); ctx.save(); ctx.strokeStyle = PR.creamL; ctx.lineWidth = r * 0.24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.36, -r * 0.36); ctx.lineTo(r * 0.36, r * 0.36); ctx.moveTo(r * 0.36, -r * 0.36); ctx.lineTo(-r * 0.36, r * 0.36); ctx.stroke(); ctx.restore(); }); }
// a dark checklist panel (like a scanner screen): items tick off one by one from t0, every dt seconds
function prChecklist(x, y, w, title, items, t0, dt = 0.3) {
  pp(pR(x, y, w, 120 + items.length * 96, 14), PR.char, { key: 'cl' + title, sb: 18, sy: 9, tex: 0.35 });
  txt(title, x + 36, y + 66, 30, PR.green, { weight: 800 });
  items.forEach((it, i) => { const yy = y + 100 + i * 96; pp(pR(x + 30, yy, w - 60, 78, 8), '#2c3a33', { key: 'cli' + i + title, shadow: false, tex: 0.3 }); txt(it, x + 56, yy + 50, 30, '#eef2ea', { weight: 700 }); if (TT >= t0 + i * dt) { ctx.save(); ctx.strokeStyle = PR.green; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w - 104, yy + 40); ctx.lineTo(x + w - 86, yy + 58); ctx.lineTo(x + w - 54, yy + 22); ctx.stroke(); ctx.restore(); } });
}
// a GitHub repo card: owner/name, a subtitle, a star count that runs to `stars` between ta and tb
function prRepoCard(x, y, repo, sub, stars, ta, tb, o = {}) {
  withT(x, y, 0, o.s ?? 1, () => {
    pp(pR(-330, -210, 660, 420, 14), PR.paperW, { key: 'gh', sb: 22, sy: 12 });
    pp(pR(-330, -210, 660, 90, 14), PR.char, { key: 'ghh', shadow: false, tex: 0.4 });
    pp(pE(-280, -165, 26, 26), PR.creamL, { shadow: false, tex: false }); pp(pE(-280, -160, 15, 17), PR.char, { shadow: false, tex: false });
    txt(o.head ?? 'open source on GitHub', -240, -150, 34, PR.creamL, { weight: 700 });
    sparkIcon(-282, -68, 18); txt(repo, -250, -56, fitSize(repo, 560, 32), PR.ink, { weight: 800 });
    txt(sub, -300, -6, 26, PR.greyD, { weight: 600 });
    const n = countUp(ta, Math.max(0.6, tb - ta), 0, stars); prStar(-250, 120, 46);
    txt(n >= stars ? (o.label ?? stars + '+') : String(n), -186, 156, 104, PR.ink, { weight: 800 }); txt('stars', 300, 170, 26, PR.greyD, { weight: 600, align: 'right' });
  });
  if (TT > ta) { const R = RNG('st' + repo); for (let i = 0; i < 8; i++) { const a = R.r(0, TAU), d = 360 + 60 * Math.sin(TT * 3 + i); prStar(x + Math.cos(a) * d * 0.95, y + 20 + Math.sin(a) * d * 0.6, 16 + 6 * Math.sin(TT * 6 + i)); } }
}
// an Instagram-style comment box that types `word` from t (then a send button); returns nothing
function prCommentBox(x, y, word, t, o = {}) {
  const k = Math.floor(word.length * ev(t, 0.45));
  withT(x, y, 0, o.s ?? 1, () => {
    pp(pR(-380, -60, 760, 120, 60), PR.paperW, { key: 'cbox', sb: 16, sy: 8, tex: 0.4 });
    if (k === 0) txt('Add a comment...', -330, 14, 38, PR.grey, { weight: 600 }); else txt(word.slice(0, k), -330, 18, 52, PR.ink, { weight: 800 });
    pp(pE(318, 0, 40, 40), PR.blue, { key: 'send', shadow: false, tex: 0.3 }); pp(pG([[304, -18], [334, 0], [304, 18]]), PR.paperW, { shadow: false, tex: false });
  });
}
// a receipt with rows [[label, value], ...] and a total
function prReceipt(x, y, rows, total, o = {}) {
  withT(x, y, o.rot ?? 0.06, o.s ?? 1, () => {
    const h = 120 + rows.length * 52;
    pp(pG([[-150, -h / 2 - 40], [150, -h / 2 - 40], [150, h / 2], [120, h / 2 + 15], [90, h / 2], [60, h / 2 + 15], [30, h / 2], [0, h / 2 + 15], [-30, h / 2], [-60, h / 2 + 15], [-90, h / 2], [-120, h / 2 + 15], [-150, h / 2]]), PR.paperW, { key: 'rcpt', sb: 14, sy: 7 });
    rows.forEach(([a, b], i) => { txt(a, -126, -h / 2 + 20 + i * 52, 28, PR.ink, { weight: 600, font: F_MONO }); txt(b, 126, -h / 2 + 20 + i * 52, 28, PR.ink, { weight: 700, font: F_MONO, align: 'right' }); });
    ctx.fillStyle = PR.ink; ctx.fillRect(-126, h / 2 - 90, 252, 3); txt('TOTAL', -126, h / 2 - 36, 30, PR.ink, { weight: 800, font: F_MONO }); txt(total, 126, h / 2 - 36, 30, PR.green, { weight: 800, font: F_MONO, align: 'right' });
  });
}

// =====================================================================
//  STYLE hooks (kit/morph.js). This look cuts hard between scenes (one per spoken line), so the bridge hooks are plain.
// =====================================================================
const STYLE = {
  name: 'paper-reel',
  paper: '#e9e5da',
  backdrop(c) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); },
  window(P, key, src) { ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); },
  blob(P, c, key) { pp(() => trace(P, true), c, { key }); },
  hero(x, y, r) { clawd(x, y + r * 0.4, { s: r / 300, key: 'herobr' }); },
  heroColor: PR.clawd,
  post() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.35; ctx.drawImage(prTex(), -200, -300);
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.3, W / 2, H * 0.5, H * 0.8); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(150,140,130,1)');
    ctx.globalAlpha = 0.35; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  },
  ones: true,
};
