
// =====================================================================
//  SCENES — one function per voice line id (SCENES below). World = screen, 1080x1920. Each scene draws, in order:
//  a full-bleed world, 3+ details of background life, the main prop(s) cued on spoken words (VW), the mascot
//  in a scene-specific hat, the sign, (optional) the terminal bar, and the caption chips (prChips).
//  Sound cues live in SFX_CUES() at the bottom (static, computed from VOICE) — src/score.js plays them.
// =====================================================================
CLAWD_SCALE = 1.12;
const CLAWD_X = 880, CLAWD_Y = 1640;
const SCENES = {};

SCENES.hook = () => {   // a classroom: the prompt types, the board writes, a counter ticks
  const t0 = E0;
  prWall(PR.slate, { streak: 620 });
  prFloor(1560, PR.floor, { studs: true });
  prBoard(60, 450, 720, 640, 'b1');
  chalk('How do tides work?', 120, 560, 46, ev(t0 + 0.4, 1.0));
  chalkLine(ellipsePts(260, 800, 110, 110, 0, 40), ev(t0 + 1.2, 0.7), { color: 'rgba(130,190,255,0.95)', w: 8 });
  chalkLine(ellipsePts(600, 760, 50, 50, 0, 30), ev(t0 + 1.8, 0.5), { color: 'rgba(246,207,85,0.95)', w: 7 });
  chalkLine([[400, 790], [530, 770]], ev(t0 + 2.2, 0.3)); chalkLine([[505, 752], [530, 770], [508, 790]], ev(t0 + 2.4, 0.15));
  prClock(960, 1020, 70, 10, 10 + TT * 6, 'clk1');
  pp(pR(110, 1470, 230, 40, 4), PR.blue, { key: 'bk1', sb: 8, sy: 4 }); pp(pR(124, 1432, 200, 40, 4), PR.mustard, { key: 'bk2', sb: 8, sy: 4 });
  pp(pE(212, 1392, 40, 36), PR.red, { key: 'apple', sb: 8, sy: 4 });
  prCounter('REELS MADE', countUp(t0 + 0.3, 3.0, 1, 9), 860, 640, { w: 290, h: 186, rot: 0.04, s: popS(t0 + 0.15) });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'mortar', key: 'c1', hold: propStick(-0.75), mood: TT > t0 + 2.6 ? 'happy' : 'neutral', look: -14 });
  prSign('ANY TOPIC, PAPER STYLE');
  prTerm('/paper-reel how tides work', ev(t0 + 0.15, 1.6));
  prChips();
};
SCENES.how = () => {   // a desk: six lines on a script page tick off; the mascot walks in side-on with a pencil
  const t0 = E0;
  prWall('#2b3b5e', { panel: 'rgba(255,255,255,0.04)', streak: 300 });
  prFloor(1500, PR.woodD, { trim: false });
  prChecklist(70, 420, 640, 'script.json · 6 lines', ['hook', 'how it works', 'proof', 'the catch'], VW('how', 'scene').t0 - 0.6, 0.22);
  pp(pR(860, 1150, 26, 360, 6), PR.char, { key: 'lampst', sb: 8, sy: 4 }); pp(pG([[790, 1120], [960, 1120], [920, 1020], [830, 1020]]), PR.mustard, { key: 'lamps', sb: 10, sy: 6 });
  prNote(870, 560, 170, 150, '#f3e3a5', 0.06, 'n1'); prNote(860, 790, 150, 130, '#a9cbe0', -0.05, 'n2');
  clawd(CLAWD_X + 30, CLAWD_Y + 20, { hat: 'beret', key: 'c2', s: 0.9, view: 'side', walk: true, hold: propPencil(-0.5) });
  prSign('SIX LINES, SIX SCENES');
  prChips();
};
SCENES.read = () => {   // a studio: the voice reads, words light up, a tick lands
  const t0 = E0, L = VL('read');
  prWall(PR.plum, { panel: 'rgba(0,0,0,0.10)', gap: 120, streak: 420 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) pp(pR(80 + c * 160, 1080 + r * 130, 130, 110, 6), r % 2 === c % 2 ? '#3c2448' : '#4a2e57', { key: 'foam' + r + c, sb: 6, sy: 4, tex: 0.6 });
  pp(pR(60, 600, 960, 300, 14), PR.char, { key: 'wave', sb: 18, sy: 9, tex: 0.35 });
  const u = seg(TT, L.t0, L.t1); for (let i = 0; i < 60; i++) { const a = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.23 + 1)), h = 200 * a; ctx.fillStyle = i / 60 < u ? PR.orange : 'rgba(240,235,220,0.45)'; ctx.fillRect(92 + i * 15.6, 750 - h / 2, 9, h); }
  ctx.fillStyle = PR.yellow; ctx.fillRect(92 + u * 936 - 3, 610, 6, 280);
  prCheck(900, 560, VW('read', 'screen').t0);
  clawd(CLAWD_X, CLAWD_Y, { hat: 'phones', key: 'c3', mood: TT > VW('read', 'screen').t0 ? 'happy' : 'neutral', look: -10 });
  prSign('A FREE LOCAL VOICE');
  prChips();
};
SCENES.catch = () => {   // dusk: what it does (tick) vs what it doesn't (cross)
  const t0 = E0;
  pp(pR(-40, -40, W + 80, 1100, 0), '#4a4566', { key: 'sky5', shadow: false, tex: 0.7 });
  pp(pG([[-40, 1180], [200, 960], [420, 1100], [700, 900], [1120, 1120], [1120, 1300], [-40, 1300]]), '#3b3855', { key: 'hills', sb: 14, sy: -4 });
  pp(pR(-40, 1260, W + 80, 700, 0), PR.char, { key: 'road', sy: -6, sb: 16, tex: 0.6 });
  pp(pR(908, 610, 150, 150, 6), PR.mustard, { key: 'wsign', sb: 12, sy: 6 }); pp(pG([[983, 636], [1036, 736], [930, 736]]), PR.ink, { shadow: false, tex: 0.3 });
  prBoard(90, 560, 440, 330, 'b4'); chalk('scenes', 150, 720, 46, 1);
  prCheck(520, 560, t0 + 0.6);
  withT(740, 880, 0.04, popS(t0 + 0.3), () => { pp(pR(-130, -90, 260, 180, 10), PR.creamL, { key: 'joke', sb: 14, sy: 7 }); txt('jokes', 0, 18, 52, PR.ink, { align: 'center', weight: 800 }); });
  prCross(850, 790, VW('catch', 'jokes').t0);
  clawd(CLAWD_X - 10, CLAWD_Y + 60, { hat: 'ranger', key: 'c4', s: 0.82, look: -12, mood: 'flat' });
  prSign('THE CATCH: WRITE IT WELL');
  prChips();
};
SCENES.payoff = () => {   // a receipt that adds to nothing; FREE is stamped on the word
  const t0 = E0, w = VW('payoff', 'pay').t0;
  prWall(PR.teal, { panel: 'rgba(255,255,255,0.06)', streak: 380 });
  prBunting(-10, undefined, 'bun5');
  prClock(940, 470, 78, 3, 40 + TT * 8, 'clk5');
  prFloor(1540, PR.woodD, { trim: false });
  prReceipt(330, 820, [['API keys', '0'], ['credits', '0'], ['plan', '0']], '$0.00', { s: 1.4 * popS(t0 + 0.1) });
  prStamp('FREE', 480, 1060, PR.green, w, { rot: -0.12, size: 80 });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'cap', key: 'c5', s: 0.92, look: -12, mood: TT > w ? 'happy' : 'neutral' });
  prSign('NOTHING TO PAY');
  prChips();
};
SCENES.cta = () => {   // the comment box types the keyword; a green card pops with confetti
  const wc = VW('cta', 'comment').t0, wk = VL('cta').words[VL('cta').words.length - 1].t0;
  prWall('#c79a5b', { panel: 'rgba(0,0,0,0.05)', streak: 540 });
  for (let i = 0; i < 6; i++) pp(pR(70 + i * 190, 380, 28, 1300, 4), '#2b2a2e', { key: 'bar' + i, sb: 10, sy: 5, tex: 0.5 });
  prFloor(1600, PR.floorD, { trim: false });
  prCommentBox(450, 640, 'PAPER', wc + 0.15, { s: popS(E0 + 0.05) });
  prFolder(430, 1040, 1.8 * popS(wk), PR.green, { label: 'paper-reel', icon: PR.creamL });
  prBurst(430, 1000, wk, { n: 26, life: 1.4 });
  clawd(CLAWD_X, CLAWD_Y, { hat: 'guard', key: 'c6', look: -16, mood: TT > wk ? 'happy' : 'neutral' });
  prSign('COMMENT PAPER');
  prChips();
};

// =====================================================================
//  SHOTS + TIMELINE — one shot per line (in script order); SPLITS = [[lineId, word, n, sceneKey]] cut again on a word
// =====================================================================
const SPLITS = [];
// sound cues: 'type' (n clicks over d s), 'tick', 'pop', 'thud' (stamp), 'chime'. Static: computed from VOICE, never during a frame.
function SFX_CUES() {
  const last = (id) => VL(id).words[VL(id).words.length - 1].t0;
  const c = [{ k: 'type', t: 0.15, n: 26, d: 1.6 }];
  for (let i = 1; i < 9; i++) c.push({ k: 'tick', t: 0.3 + 3.0 * (1 - Math.cbrt(1 - i / 8)) });
  c.push({ k: 'pop', t: VW('read', 'screen').t0 }, { k: 'thud', t: VW('catch', 'jokes').t0 }, { k: 'thud', t: VW('payoff', 'pay').t0 + 0.16 });
  c.push({ k: 'type', t: VW('cta', 'comment').t0 + 0.15, n: 5, d: 0.45 }, { k: 'chime', t: last('cta') });
  return c;
}
const SHOT_LIST = VOICE.lines.map((l, i) => [i === 0 ? 0 : CUT(l.id), l.id])
  .concat(SPLITS.map(([id, w, n, key]) => [VW(id, w, n).t0 - 0.08, key])).sort((a, b) => a[0] - b[0]);
const ERA_LIST = SHOT_LIST.map(([t0, sc], i) => [t0, i + 1 < SHOT_LIST.length ? SHOT_LIST[i + 1][0] : DURATION, () => SCENES[sc]()]);
const TIMELINE = {
  width: W, height: H, fps: FPS, duration: DURATION, frames: NFRAMES, loop: LOOP_T, safe: SAFE, format: 'voice-cut',
  shots: SHOT_LIST.map(([t0, sc], i) => ({ id: i + 1, key: sc, era: i, t0, t1: ERA_LIST[i][1], title: sc })),
  cuts: SHOT_LIST.slice(1).map(([t0]) => t0), morphs: [], cues: {},
  acts: [{ name: 'reel', role: 'journey', t0: 0, t1: DURATION }],
  board: SHOT_LIST.map(([t0, sc], i) => ({ t: (t0 + ERA_LIST[i][1]) / 2 + 0.3, title: sc, sound: '', next: 'cut' })),
  narration: VOICE.lines.map((l) => ({ t0: l.t0, t1: l.t1, text: l.text })),
};
window.TIMELINE = TIMELINE;
