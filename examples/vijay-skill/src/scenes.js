
// =====================================================================
//  SCENES — one per spoken line (two lines split on a word). World = screen (no cameras).
//  Every scene: a full-bleed world, the sign, the mascot in a scene-specific hat, 3+ details of life, the chips.
// =====================================================================
const CLAWD_X = 880, CLAWD_Y = 1640;
CLAWD_SCALE = 1.12;
// a pointer stick held in the mascot's hand (local coords), aimed at angle a
const stick = (a, len = 360) => (hx, hy, behind) => { if (!behind) return; withT(hx, hy, a, 1, () => { pp(pR(-10, -len, 20, len, 8), PR.char, { key: 'stick', sb: 8, sy: 4, tex: 0.3 }); pp(pR(-12, -len - 6, 24, 70, 8), PR.orange, { key: 'sticktip', shadow: false, tex: 0.4 }); pp(pR(-12, -len + 64, 24, 18, 2), PR.creamL, { shadow: false, tex: false }); }); };
const pencilProp = (a) => (hx, hy, behind) => { if (!behind) return; withT(hx, hy, a, 1, () => { pp(pR(-14, -230, 28, 200, 3), PR.yellow, { key: 'pcl', sb: 6, sy: 3, tex: 0.4 }); pp(pG([[-14, -30], [14, -30], [0, 10]]), PR.tan, { shadow: false, tex: 0.4 }); pp(pR(-14, -250, 28, 26, 4), PR.pink, { shadow: false, tex: 0.4 }); }); };

// ---- 1. HOOK: a classroom. A prompt types, the blackboard draws "why is the sky blue?", a counter ticks.
function sceneHook() {
  const t0 = E0;
  prWall(PR.slate, { streak: 620 });
  prFloor(1560, PR.floor, { studs: true });
  // the blackboard
  pp(pR(60, 450, 720, 640, 10), PR.woodD, { key: 'bbf', sb: 20, sy: 10 });
  pp(pR(84, 474, 672, 592, 4), PR.board, { key: 'bb', shadow: false, tex: 0.8 });
  pp(pR(70, 1084, 700, 26, 4), PR.woodL, { key: 'bbtray', sb: 8, sy: 5 });
  pp(pR(150, 1072, 46, 14, 4), PR.creamL, { shadow: false, tex: false }); pp(pR(230, 1074, 32, 12, 4), PR.yellow, { shadow: false, tex: false });
  chalk('Why is the sky blue?', 120, 560, 46, ev(t0 + 0.5, 1.0));
  const sun = ev(t0 + 1.2, 0.6);
  if (sun > 0) { chalkLine(ellipsePts(230, 760, 70, 70, 0, 40), sun, { color: 'rgba(246,207,85,0.95)', w: 8 }); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; chalkLine([[230 + Math.cos(a) * 92, 760 + Math.sin(a) * 92], [230 + Math.cos(a) * 122, 760 + Math.sin(a) * 122]], seg(TT, t0 + 1.5 + i * 0.04, t0 + 1.7 + i * 0.04), { color: 'rgba(246,207,85,0.95)', w: 7 }); } }
  for (let k = 0; k < 3; k++) { const P = []; for (let i = 0; i <= 30; i++) { const u = i / 30; P.push([330 + u * 270, 740 + k * 34 + Math.sin(u * 18) * 10 + u * 70]); } chalkLine(P, seg(TT, t0 + 1.9 + k * 0.15, t0 + 2.6 + k * 0.15), { color: k === 1 ? 'rgba(130,190,255,0.95)' : 'rgba(244,244,236,0.85)', w: 6 }); }
  chalkLine(ellipsePts(640, 900, 82, 82, 0, 40), ev(t0 + 2.5, 0.6), { color: 'rgba(130,190,255,0.95)', w: 8 });
  chalk('blue scatters most', 360, 1030, 34, ev(t0 + 2.9, 0.7), { color: 'rgba(244,244,236,0.85)' });
  // background life: a clock, an apple and books on the floor
  prClock(960, 1020, 70, 10, 10 + TT * 6, 'clk1');
  pp(pR(110, 1470, 230, 40, 4), PR.blue, { key: 'bk1', sb: 8, sy: 4 }); pp(pR(124, 1432, 200, 40, 4), PR.mustard, { key: 'bk2', sb: 8, sy: 4 }); pp(pR(104, 1394, 216, 40, 4), PR.red, { key: 'bk3', sb: 8, sy: 4 });
  pp(pE(212, 1352, 40, 36), PR.red, { key: 'apple', sb: 8, sy: 4 }); pp(pE(226, 1312, 16, 8, -0.5), PR.green, { shadow: false, tex: 0.4 });
  prCounter('VIDEOS MADE', countUp(t0 + 0.3, 3.4, 1, 7), 860, 640, { w: 290, h: 186, rot: 0.04, s: popS(t0 + 0.15) });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'mortar', key: 'c1', hold: stick(-0.75), mood: TT > t0 + 2.9 ? 'happy' : 'neutral', look: -14 });
  prSign('ANY TOPIC, KHAN STYLE');
  prTerm('/vijay-explainer why is the sky blue', ev(t0 + 0.15, 1.9));
  prChips();
}

// ---- 2a. DESCRIBE: a script page on a desk; the prompt types the brief, beats write themselves on.
function sceneDescribe() {
  const t0 = E0;
  prWall('#2b3b5e', { panel: 'rgba(255,255,255,0.04)', streak: 300 });
  // a departures-style board of lesson topics behind (life)
  pp(pR(60, 440, 960, 150, 6), PR.ink, { key: 'dep', sb: 16, sy: 8 });
  txt('LESSONS', 90, 500, 34, PR.mustard, { weight: 800 });
  [['DNS', 'READY'], ['BLACK HOLES', 'READY'], ['SKY BLUE', 'DRAWING']].forEach(([a, b], i) => { txt(a, 280 + i * 250, 500, 24, '#d9d4c6', { weight: 700 }); txt(b, 280 + i * 250, 552, 24, i === 2 ? PR.orange : PR.green, { weight: 800 }); });
  prFloor(1500, PR.woodD, { trim: false });
  // the script page
  withT(390, 960, -0.035, springMove(t0, 0.6, 1, SPRING.playful), () => {
    pp(pR(-300, -330, 600, 660, 6), PR.paperW, { key: 'page', sb: 22, sy: 12, tex: 0.5 });
    pp(pR(-90, -350, 180, 44, 8), PR.greyD, { key: 'clip', sb: 6, sy: 3 });
    txt('scene.js', -250, -250, 40, PR.navy, { weight: 800 });
    const lines = ['beat 1: the sun', 'beat 2: light scatters', 'beat 3: blue wins', 'voice: explain it'];
    lines.forEach((s, i) => { const f = ev(t0 + 0.25 + i * 0.28, 0.3); if (f <= 0) return; pp(pR(-250, -180 + i * 110, 30, 30, 4), i < 3 ? PR.green : PR.orange, { shadow: false, tex: 0.3 }); txt(s, -200, -154 + i * 110, 36, PR.ink, { weight: 600, frac: f, font: F_MONO }); });
  });
  // a desk lamp and a mug (life)
  pp(pR(860, 1150, 26, 360, 6), PR.char, { key: 'lampst', sb: 8, sy: 4 }); pp(pG([[790, 1120], [960, 1120], [920, 1020], [830, 1020]]), PR.mustard, { key: 'lamps', sb: 10, sy: 6 });
  ctx.save(); const gl = ctx.createRadialGradient(875, 1150, 10, 875, 1250, 260); gl.addColorStop(0, 'rgba(255,230,150,0.35)'); gl.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = gl; ctx.fillRect(600, 1120, 560, 400); ctx.restore();
  clawd(CLAWD_X + 30, CLAWD_Y + 20, { hat: 'beret', key: 'c2', s: 0.9, view: 'side', walk: true, hold: pencilProp(-0.5), mood: 'neutral' });
  prSign('YOU DESCRIBE IT');
  prTerm('/vijay-explainer 30s on why the sky is blue', ev(t0 + 0.05, 1.0));
  prChips();
}

// ---- 2b. BOARD: a wall-wide blackboard; each step is drawn on the word that names it.
function sceneBoard() {
  const t0 = E0, w1 = VW('draw', 'draws').t0, w2 = VW('draw', 'every').t0, w3 = VW('draw', 'step').t0, w4 = VW('draw', 'blackboard').t0;
  prWall(PR.slateD, { streak: 800 });
  prFloor(1600, PR.floor);
  pp(pR(40, 420, 1000, 860, 10), PR.woodD, { key: 'bbf2', sb: 22, sy: 12 });
  pp(pR(66, 446, 948, 808, 4), PR.board, { key: 'bb2', shadow: false, tex: 0.85 });
  const box = (x, y, label, t, col, bw = 300) => { const f = ev(t, 0.45); if (f <= 0) return; chalkLine(rrectPts(x, y, bw, 150, 18, 4).concat([[x + 18, y]]), f, { color: col, w: 7 }); chalk(label, x + bw / 2, y + 92, 38, ev(t + 0.2, 0.35), { align: 'center', color: col }); };
  box(100, 540, '1 SUN', w1, 'rgba(246,207,85,0.95)', 230);
  chalkLine([[350, 615], [450, 615]], ev(w2 - 0.05, 0.25)); chalkLine([[425, 595], [450, 615], [425, 635]], ev(w2 + 0.15, 0.1));
  box(480, 540, '2 SCATTER', w2 + 0.05, 'rgba(244,244,236,0.92)');
  chalkLine([[630, 700], [630, 800]], ev(w3 - 0.05, 0.25)); chalkLine([[610, 775], [630, 800], [650, 775]], ev(w3 + 0.15, 0.1));
  box(480, 820, '3 BLUE', w3 + 0.05, 'rgba(130,190,255,0.95)');
  chalk('= the sky', 300, 1150, 46, ev(w4, 0.5), { color: 'rgba(130,190,255,0.95)' });
  // the chalk itself rides the newest stroke (life)
  const cx = TT < w2 ? 360 : TT < w3 ? 740 : 740, cy = TT < w2 ? 700 : TT < w3 ? 700 : 980;
  if (TT < w4 + 0.6) withT(cx + Math.sin(TT * 14) * 10, cy + Math.cos(TT * 11) * 8, 0.6, 1, () => pp(pR(-14, -50, 28, 100, 8), PR.creamL, { key: 'chk', sb: 8, sy: 4, tex: 0.3 }));
  pp(pR(60, 1278, 960, 24, 4), PR.woodL, { key: 'bbtray2', sb: 8, sy: 5 });
  prCounter('STEPS DRAWN', TT < w2 ? (TT < w1 ? 0 : 1) : TT < w3 ? 2 : 3, 210, 1395, { w: 280, h: 176, rot: -0.05, big: 96 });
  clawd(CLAWD_X, CLAWD_Y + 40, { hat: 'mortar', key: 'c3', s: 0.82, hold: stick(-0.55, 300), look: -12, mood: TT > w4 ? 'happy' : 'neutral' });
  prSign('CLAUDE DRAWS IT');
  prChips();
}

// ---- 3. SYNC: a little studio. The waveform plays; words light up as the pen reaches them.
function sceneSync() {
  const t0 = E0, L = VL('sync');
  prWall(PR.plum, { panel: 'rgba(0,0,0,0.10)', gap: 120, streak: 420 });
  // acoustic foam (life)
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) pp(pR(80 + c * 160, 1080 + r * 130, 130, 110, 6), r % 2 === c % 2 ? '#3c2448' : '#4a2e57', { key: 'foam' + r + c, sb: 6, sy: 4, tex: 0.6 });
  // ON AIR light
  const on = Math.floor(TT * 2) % 2 === 0;
  pp(pR(700, 430, 250, 92, 12), on ? PR.red : PR.redD, { key: 'onair', sb: on ? 30 : 10, sy: 4, shc: on ? 'rgba(255,70,60,0.6)' : undefined });
  txt('ON AIR', 825, 492, 46, PR.creamL, { weight: 800, align: 'center' });
  // the waveform strip with a playhead
  pp(pR(60, 600, 960, 300, 14), PR.char, { key: 'wave', sb: 18, sy: 9, tex: 0.35 });
  const u = seg(TT, L.t0, L.t1), R = RNG('wv');
  for (let i = 0; i < 60; i++) { const x = 92 + i * 15.6, a = (0.25 + 0.75 * Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.23 + 1))) * R.r(0.6, 1), h = 200 * a; ctx.fillStyle = i / 60 < u ? PR.orange : 'rgba(240,235,220,0.45)'; ctx.fillRect(x, 750 - h / 2, 9, h); }
  const px = 92 + u * 936; ctx.fillStyle = PR.yellow; ctx.fillRect(px - 3, 610, 6, 280);
  // the pen riding the playhead
  withT(px + 20, 600, 0.5, 1, () => { pp(pR(-14, -120, 28, 110, 4), PR.yellow, { key: 'pen', sb: 8, sy: 4, tex: 0.4 }); pp(pG([[-14, -10], [14, -10], [0, 24]]), PR.creamL, { shadow: false, tex: false }); });
  // the words of the line as tiles: each lights when spoken
  const ws = ['the', 'pen', 'lands', 'right', 'on', 'the', 'words'];
  let x = 80; ws.forEach((w, i) => { const t = VW('sync', w, i === 5 ? 1 : 0).t0, lit = TT >= t; const tw = txtW(w, 38) + 34; pp(pR(x, 930, tw, 70, 8), lit ? PR.mustard : '#5b4a63', { key: 'wt' + i, sb: 8, sy: 4, tex: 0.5 }); txt(w, x + tw / 2, 978, 38, lit ? PR.ink : '#a99bb0', { align: 'center', weight: 800 }); x += tw + 12; });
  prCounter('IN SYNC', countUp(VW('sync', 'pen').t0, 1.0, 0, 100) + '%', 230, 1400, { w: 300, h: 180, rot: 0.04, big: 92 });
  // the microphone (life)
  pp(pR(470, 1300, 18, 240, 6), PR.greyD, { key: 'micst', sb: 8, sy: 4 }); pp(pR(430, 1180, 98, 140, 46), '#3a3d45', { key: 'mic', sb: 12, sy: 6, tex: 0.5 });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'phones', key: 'c4', mood: TT > VW('sync', 'words').t0 ? 'happy' : 'neutral', look: -10 });
  prSign('THE PEN WAITS FOR THE VOICE');
  prChips();
}

// ---- 4a. KEYS: a security desk. An API key gets NOT NEEDED, credits get $0.
function sceneKeys() {
  const t0 = E0, wk = VW('free', 'keys').t0, wc = VW('free', 'credits').t0;
  prWall(PR.teal, { panel: 'rgba(255,255,255,0.06)', streak: 380 });
  prBunting(-10, [PR.red, PR.cream, PR.blue, PR.mustard, PR.green], 'bunk');
  prClock(940, 470, 78, 3, 40 + TT * 8, 'clk4');
  prFloor(1540, PR.woodD, { trim: false });
  // the key card
  withT(330, 720, -0.04, popS(t0 + 0.05), () => {
    pp(pR(-260, -150, 520, 300, 14), PR.paperW, { key: 'kc', sb: 20, sy: 10 });
    pp(pR(-260, -150, 520, 76, 14), PR.navy, { key: 'kch', shadow: false, tex: 0.5 });
    txt('API KEY', -180, -96, 38, PR.creamL, { weight: 800 }); sparkIcon(-220, -112, 18);
    // a brass key
    pp(pE(-130, 30, 62, 62), PR.mustard, { key: 'kring', sb: 10, sy: 5 }); pp(pE(-130, 30, 26, 26), PR.paperW, { shadow: false, tex: false });
    pp(pR(-74, 16, 270, 30, 4), PR.mustard, { key: 'kshaft', sb: 8, sy: 4 }); pp(pR(140, 40, 26, 46, 3), PR.mustard, { shadow: false, tex: 0.4 }); pp(pR(176, 40, 20, 32, 3), PR.mustard, { shadow: false, tex: 0.4 });
  });
  prStamp('NOT NEEDED', 430, 830, PR.red, wk, { rot: -0.12, size: 58 });
  // the credits card
  withT(400, 1160, 0.05, popS(wc - 0.25), () => {
    pp(pR(-250, -130, 500, 260, 18), PR.orange, { key: 'cc', sb: 20, sy: 10 });
    pp(pR(-250, -70, 500, 50, 0), PR.ink, { shadow: false, tex: 0.3 });
    txt('CREDITS', -210, 90, 42, PR.creamL, { weight: 800 }); pp(pR(110, 40, 90, 64, 8), PR.mustard, { key: 'chipc', shadow: false, tex: 0.4 });
  });
  prStamp('$0', 520, 1120, PR.green, wc + 0.05, { rot: 0.1, size: 76 });
  clawd(CLAWD_X + 20, CLAWD_Y, { hat: 'guard', key: 'c5', s: 0.92, hold: stick(-0.35, 260), look: -12, mood: 'flat' });
  prSign('NO API KEYS, NO CREDITS');
  prChips();
}

// ---- 4b. LAPTOP: it renders at home. A receipt adds up to nothing.
function sceneLaptop() {
  const t0 = E0, wl = VW('free', 'laptop').t0;
  prWall('#c9b28a', { panel: 'rgba(255,255,255,0.07)', streak: 700 });
  // a window with the night outside (life)
  pp(pR(80, 380, 300, 320, 6), PR.woodD, { key: 'win4', sb: 16, sy: 8 }); pp(pR(102, 402, 256, 276, 2), '#24305a', { key: 'win4g', shadow: false, tex: 0.6 });
  for (let i = 0; i < 9; i++) { const R = RNG('st', i); prStar(120 + R.r(0, 220), 430 + R.r(0, 220), R.r(5, 10) * (0.7 + 0.3 * Math.sin(TT * 4 + i)), '#f6e7b0'); }
  pp(pE(290, 480, 34, 34), '#f2ecd0', { key: 'moon4', shadow: false, tex: 0.4 });
  pp(pR(-40, 1180, W + 80, 800, 0), PR.wood, { key: 'desk4', sy: -6, sb: 16, tex: 0.8 });
  // the laptop
  withT(440, 1060, 0, springMove(t0, 0.85, 1, SPRING.playful), () => {
    pp(pR(-330, -300, 660, 420, 18), '#34373f', { key: 'lid', sb: 22, sy: 12 });
    pp(pR(-300, -272, 600, 364, 6), PR.board, { key: 'scr', shadow: false, tex: 0.7 });
    chalk('Why is the sky blue?', -270, -200, 34, 1);
    chalkLine(ellipsePts(-170, -80, 50, 50, 0, 30), 1, { color: 'rgba(246,207,85,0.95)', w: 6 }); chalkLine(ellipsePts(170, -40, 60, 60, 0, 30), 1, { color: 'rgba(130,190,255,0.95)', w: 6 });
    const p = ev(t0 + 0.1, 1.1); pp(pR(-270, 40, 540, 30, 8), '#1a2b22', { shadow: false, tex: false }); pp(pR(-270, 40, 540 * p, 30, 8), PR.green, { shadow: false, tex: false });
    txt(p < 1 ? `rendering ${Math.round(p * 100)}%` : 'saved: sky-blue.mp4', 0, 26, 26, '#e8f0e8', { align: 'center', weight: 700, font: F_MONO });
    pp(pG([[-380, 120], [380, 120], [420, 170], [-420, 170]]), '#9a9ca4', { key: 'base', sb: 14, sy: 8 });
  });
  // the receipt
  withT(830, 560, 0.06, 0.92 * popS(t0 + 0.2), () => {
    pp(pG([[-150, -170], [150, -170], [150, 160], [120, 175], [90, 160], [60, 175], [30, 160], [0, 175], [-30, 160], [-60, 175], [-90, 160], [-120, 175], [-150, 160]]), PR.paperW, { key: 'rcpt', sb: 14, sy: 7 });
    [['API keys', '0'], ['credits', '0'], ['cloud', '0']].forEach(([a, b], i) => { txt(a, -126, -110 + i * 52, 28, PR.ink, { weight: 600, font: F_MONO }); txt(b, 126, -110 + i * 52, 28, PR.ink, { weight: 700, font: F_MONO, align: 'right' }); });
    ctx.fillStyle = PR.ink; ctx.fillRect(-126, 50, 252, 3); txt('TOTAL', -126, 104, 30, PR.ink, { weight: 800, font: F_MONO }); txt('$0.00', 126, 104, 30, PR.green, { weight: 800, font: F_MONO, align: 'right' });
  });
  prStamp('LOCAL', 450, 690, PR.green, wl, { rot: 0.08, size: 70 });
  clawd(CLAWD_X + 30, CLAWD_Y + 30, { hat: 'cap', key: 'c6', s: 0.85, look: -14, mood: TT > wl ? 'happy' : 'neutral' });
  prSign('RUNS ON YOUR LAPTOP');
  prChips();
}

// ---- 5. CATCH: dusk. Diagrams get a tick, faces get a cross.
function sceneCatch() {
  const t0 = E0, wd = VW('catch', 'diagrams').t0, wf = VW('catch', 'faces').t0, wt = VW('catch', 'teaching').t0;
  pp(pR(-40, -40, W + 80, 1100, 0), '#4a4566', { key: 'sky5', shadow: false, tex: 0.7 });
  pp(pR(-40, 700, W + 80, 500, 0), '#6a5873', { key: 'sky5b', shadow: false, tex: 0.6 });
  pp(pG([[-40, 1180], [200, 960], [420, 1100], [700, 900], [1120, 1120], [1120, 1300], [-40, 1300]]), '#3b3855', { key: 'hills', sb: 14, sy: -4 });
  pp(pR(-40, 1260, W + 80, 700, 0), PR.char, { key: 'road', sy: -6, sb: 16, tex: 0.6 });
  for (let i = 0; i < 6; i++) pp(pR(30 + i * 190 - mod(TT * 120, 190), 1560, 110, 16, 3), PR.cream, { key: 'lane' + i, shadow: false, tex: 0.4 });
  // a warning sign (life)
  pp(pR(990, 760, 16, 520, 4), PR.greyD, { key: 'wpost', sb: 8, sy: 4 }); pp(pR(908, 610, 180, 180, 6), PR.mustard, { key: 'wsign', sb: 12, sy: 6 });
  pp(pG([[998, 640], [1060, 760], [936, 760]]), PR.ink, { shadow: false, tex: 0.3 }); pp(pR(992, 680, 12, 46, 3), PR.mustard, { shadow: false, tex: false }); pp(pR(992, 734, 12, 12, 3), PR.mustard, { shadow: false, tex: false });
  // an easel blackboard: diagrams, yes
  pp(pG([[180, 1260], [230, 1260], [300, 760], [270, 760]]), PR.woodD, { key: 'easel1', sb: 10, sy: 5 }); pp(pG([[520, 1260], [470, 1260], [400, 760], [430, 760]]), PR.woodD, { key: 'easel2', sb: 10, sy: 5 });
  withT(350, 860, -0.03, 1, () => { pp(pR(-240, -190, 480, 330, 8), PR.woodD, { key: 'eb', sb: 18, sy: 9 }); pp(pR(-222, -172, 444, 294, 3), PR.board, { key: 'ebb', shadow: false, tex: 0.8 }); chalkLine(ellipsePts(-90, -30, 60, 60, 0, 30), 1, { color: 'rgba(246,207,85,0.95)', w: 7 }); chalkLine([[0, -30], [130, -30]], 1); chalkLine([[110, -50], [130, -30], [110, -10]], 1); chalk('diagram', -150, 100, 38, 1); });
  if (TT >= wd) withT(560, 700, 0.1, popS(wd), () => { pp(pE(0, 0, 66, 66), PR.green, { key: 'tick', sb: 12, sy: 6 }); ctx.save(); ctx.strokeStyle = PR.creamL; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-28, 2); ctx.lineTo(-6, 26); ctx.lineTo(32, -22); ctx.stroke(); ctx.restore(); });
  // a vlog camera on a tripod: faces, no
  withT(790, 470 + 330, 0, popS(t0 + 0.4), () => {
    pp(pG([[-10, 120], [10, 120], [80, 470], [60, 470]]), PR.greyD, { key: 'tp1', sb: 6, sy: 3 }); pp(pG([[-10, 120], [10, 120], [-60, 470], [-80, 470]]), PR.greyD, { key: 'tp2', sb: 6, sy: 3 });
    pp(pR(-130, -60, 260, 180, 16), '#2a2c33', { key: 'cam', sb: 16, sy: 8 }); pp(pE(0, 30, 62, 62), '#41444d', { shadow: false, tex: 0.4 }); pp(pE(0, 30, 36, 36), '#6d8fb5', { shadow: false, tex: 0.4 });
    pp(pE(96, -32, 12, 12), PR.red, { shadow: false, tex: false });
  });
  prStamp('NO FACES', 740, 880, PR.red, wf, { rot: -0.14, size: 56 });
  clawd(CLAWD_X - 10, CLAWD_Y + 60, { hat: 'ranger', key: 'c7', s: 0.82, look: -12, mood: TT > wt ? 'happy' : 'flat' });
  prSign('THE CATCH: NO FACES');
  prChips();
}

// ---- 6. REPO: a corkboard. The GitHub card's star count runs up; FREE is stamped on.
function sceneRepo() {
  const t0 = E0, wo = VW('repo', 'open').t0, wg = VW('repo', 'github').t0, wh = VW('repo', 'stars').t1;
  prWall(PR.slate, { streak: 300 });
  prBunting(0, [PR.red, PR.mustard, PR.blue, PR.green, PR.cream], 'bun6');
  prCorkboard(70, 400, 940, 700, 'cork6');
  prNote(180, 520, 160, 120, '#f3e3a5', -0.08, 'n1'); prNote(900, 980, 150, 150, '#a9cbe0', 0.06, 'n2'); prNote(170, 1000, 150, 120, '#e9a3a3', 0.05, 'n3');
  prFloor(1300, '#4f8a55', { trim: false });
  // the repo card
  withT(560, 760, 0, springMove(t0, 0.7, 1, SPRING.playful), () => {
    pp(pR(-330, -210, 660, 420, 14), PR.paperW, { key: 'gh', sb: 22, sy: 12 });
    pp(pR(-330, -210, 660, 90, 14), PR.char, { key: 'ghh', shadow: false, tex: 0.4 });
    pp(pE(-280, -165, 26, 26), PR.creamL, { shadow: false, tex: false }); pp(pE(-280, -160, 15, 17), PR.char, { shadow: false, tex: false });
    txt('open source on GitHub', -240, -150, 34, PR.creamL, { weight: 700 });
    sparkIcon(-282, -68, 18); txt('vijay / vijay-explainer', -250, -56, 32, PR.ink, { weight: 800 });
    txt('MIT  ·  Claude Code skill', -300, -6, 26, PR.greyD, { weight: 600 });
    const n = countUp(wg, Math.max(0.6, wh - wg), 0, 130); prStar(-250, 120, 46);
    txt(n >= 130 ? '130+' : String(n), -186, 156, 104, PR.ink, { weight: 800 }); txt('stars', 300, 170, 26, PR.greyD, { weight: 600, align: 'right' });
  });
  if (TT > wg) { const R = RNG('st6'); for (let i = 0; i < 8; i++) { const a = R.r(0, TAU), d = 360 + 60 * Math.sin(TT * 3 + i); prStar(560 + Math.cos(a) * d * 0.95, 780 + Math.sin(a) * d * 0.6, 16 + 6 * Math.sin(TT * 6 + i)); } }
  pp(pE(560, 380, 16, 16), PR.red, { key: 'pin', sb: 6, sy: 3 });
  prStamp('FREE', 300, 540, PR.green, wo, { rot: -0.16, size: 76 });
  clawd(CLAWD_X + 40, CLAWD_Y - 20, { hat: 'cap', key: 'c8', s: 0.9, view: 'side', mood: TT > wh ? 'happy' : 'wow', hand: { x: -330, y: -200 } });
  prSign('FREE  ·  OPEN SOURCE');
  prChips();
}

// ---- 7. CTA: comment BOARD. The word types into a comment box; a green card pops with confetti.
function sceneCta() {
  const t0 = E0, wc = VW('cta', 'comment').t0, wb = VW('cta', 'board').t0;
  prWall('#c79a5b', { panel: 'rgba(0,0,0,0.05)', streak: 540 });
  for (let i = 0; i < 6; i++) pp(pR(70 + i * 190, 380, 28, 1300, 4), '#2b2a2e', { key: 'bar' + i, sb: 10, sy: 5, tex: 0.5 });
  pp(pR(-40, 1180, W + 80, 120, 0), '#6a5a8a', { key: 'hill7', shadow: false, tex: 0.6 });
  prFloor(1600, PR.floorD, { trim: false });
  // the comment box
  const typed = 'BOARD', k = Math.floor(typed.length * ev(wc + 0.15, 0.45));
  withT(450, 640, 0, popS(t0 + 0.05), () => {
    pp(pR(-380, -60, 760, 120, 60), PR.paperW, { key: 'cbox', sb: 16, sy: 8, tex: 0.4 });
    if (k === 0) txt('Add a comment...', -330, 14, 38, PR.grey, { weight: 600 }); else txt(typed.slice(0, k), -330, 18, 52, PR.ink, { weight: 800 });
    pp(pE(318, 0, 40, 40), PR.blue, { key: 'send', shadow: false, tex: 0.3 }); pp(pG([[304, -18], [334, 0], [304, 18]]), PR.paperW, { shadow: false, tex: false });
  });
  // the green card: a mini blackboard + tick
  withT(430, 1050, -0.04, popS(wb), () => {
    pp(pR(-100, -200, 140, 50, 8), PR.green, { key: 'gct', sb: 6, sy: 3 });
    pp(pR(-220, -170, 440, 330, 14), PR.green, { key: 'gc', sb: 22, sy: 11, rim: 'rgba(255,255,255,0.35)' });
    pp(pR(-160, -110, 320, 190, 6), PR.board, { shadow: false, tex: 0.6 }); chalk('BOARD', 0, 10, 54, 1, { align: 'center' });
    ctx.save(); ctx.strokeStyle = PR.creamL; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-120, 120); ctx.lineTo(-90, 150); ctx.lineTo(-40, 96); ctx.stroke(); ctx.restore();
  });
  prBurst(430, 1000, wb, { n: 26, life: 1.4 });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'mortar', key: 'c9', look: -16, mood: TT > wb ? 'happy' : 'neutral' });
  prSign('COMMENT BOARD');
  prChips();
}
