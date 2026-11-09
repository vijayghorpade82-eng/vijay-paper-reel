  const E_ = (sc) => SHOT_LIST.find((s) => s[1] === sc)[0];
  // SCORE BODY — a light lo-fi bed under the voice (ducked by score-head), plus sound effects tied to the picture.
  const BPMs = 100, BT = 60 / BPMs, END = DURATION;
  const prog = [['D3', 'Fs3', 'A3'], ['B2', 'D3', 'Fs3'], ['G2', 'B2', 'D3'], ['A2', 'Cs3', 'E3']];
  to = 'm';
  for (let bar = 0; bar * 4 * BT < END; bar++) {
    const t = bar * 4 * BT, ch = prog[bar % 4];
    pad(t, Math.min(END + 0.2, t + 4 * BT + 0.05), ch, 0.022, { type: 'triangle', cut: 1100, att: 0.08, rel: 0.12, send: 0.3 });
    bass(t, nz(ch[0].replace(/\d/, (d) => String(+d - 1))), 0.22); bass(t + 2 * BT, nz(ch[0].replace(/\d/, (d) => String(+d - 1))), 0.16);
    for (let k = 0; k < 8; k++) { const tk = t + k * BT / 2; if (tk > END) break; pluck(tk, nz(ch[k % 3].replace(/\d/, (d) => String(+d + 2))), k % 2 ? 0.045 : 0.07, 0, 0.22, 2600, 0.15); }
    for (let b = 0; b < 4; b++) { const tb = t + b * BT; if (tb > END) break; if (b % 2 === 0) sub(tb, 0.16); noiseHit(tb + BT / 2, 0.035, 'highpass', 7000, 0.7, 0.05); }
  }
  // sound effects (sfx bus)
  to = 's';
  for (const [t0] of SHOT_LIST.slice(1)) sweep(t0 - 0.16, t0, 0.02, 900, 4200, 0);                          // a soft whoosh into every cut
  const typing = (a, b, n) => { for (let i = 0; i < n; i++) noiseHit(a + (b - a) * i / n, 0.018, 'bandpass', 3800 + (i % 3) * 600, 2, 0.06); };
  typing(E_('hook') + 0.15, E_('hook') + 2.05, 30); typing(E_('describe') + 0.05, E_('describe') + 1.05, 18);
  for (let i = 1; i < 7; i++) blip(E_('hook') + 0.3 + 3.4 * (1 - Math.cbrt(1 - i / 6)), 1300, 1700, 0.05, 0.07);   // the counter ticks
  for (const w of ['draws', 'every', 'step']) blip(VW('draw', w).t0, 900, 1400, 0.07, 0.08);
  const thud = (t) => { sub(t, 0.35); noiseHit(t, 0.09, 'lowpass', 1600, 0.8, 0.22); };              // stamps
  thud(VW('free', 'keys').t0 + 0.16); thud(VW('free', 'credits').t0 + 0.21); thud(VW('free', 'laptop').t0 + 0.16); thud(VW('catch', 'faces').t0 + 0.16); thud(VW('repo', 'open').t0 + 0.16);
  blip(VW('catch', 'diagrams').t0, 700, 1400, 0.12, 0.1);
  { const a = VW('repo', 'github').t0, b = VW('repo', 'stars').t1; for (let i = 0; i < 14; i++) blip(a + (b - a) * (1 - (1 - i / 14) ** 3), 1500 + i * 40, 1900 + i * 40, 0.04, 0.05); }
  chime(VW('cta', 'board').t0, [nz('D5'), nz('Fs5'), nz('A5')], 0.09);
  for (let i = 0; i < 5; i++) noiseHit(VW('cta', 'comment').t0 + 0.15 + i * 0.09, 0.018, 'bandpass', 4000, 2, 0.06);
