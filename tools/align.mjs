// Word times for voice.json from whisper.cpp (free, local): replaces the letter-count estimate voice.mjs writes
// when faster-whisper is unavailable. usage: node tools/align.mjs pieces/<name>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(process.argv[2]), VJ = path.join(ROOT, 'voice.json'), V = JSON.parse(fs.readFileSync(VJ, 'utf8'));
const HOME = process.env.HOME || process.env.USERPROFILE || '';
const MODEL = process.env.WHISPER_MODEL || path.join(HOME, '.cache', 'whisper', 'ggml-base.en.bin'), tmp = path.join(ROOT, 'voice', '_16k.wav');
spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(ROOT, 'voice', 'voice.wav'), '-ar', '16000', '-ac', '1', tmp]);
const r = spawnSync('whisper-cli', ['-m', MODEL, '-f', tmp, '-ml', '1', '-sow', '-oj', '-of', tmp.replace('.wav', ''), '-np', '-ng'], { maxBuffer: 1 << 26 });
const J = JSON.parse(fs.readFileSync(tmp.replace('.wav', '.json'), 'utf8'));
const heard = J.transcription.map((s) => ({ w: s.text.trim(), t0: s.offsets.from / 1000, t1: s.offsets.to / 1000 })).filter((h) => h.w);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
let matched = 0, total = 0;
for (const L of V.lines) {
  const W = L.words; total += W.length;
  const H = heard.filter((h) => (h.t0 + h.t1) / 2 >= L.t0 - 0.2 && (h.t0 + h.t1) / 2 <= L.t1 + 0.2);
  const a = W.map((w) => norm(w.w)), b = H.map((h) => norm(h.w)), n = a.length, m = b.length;
  const D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  W.forEach((w) => (w.est = true));
  for (let i = n, j = m; i > 0 && j > 0;) {
    if (D[i][j] === D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] === b[j - 1]) { Object.assign(W[i - 1], { t0: +H[j - 1].t0.toFixed(3), t1: +H[j - 1].t1.toFixed(3) }); delete W[i - 1].est; matched++; } i--; j--; }
    else if (D[i][j] === D[i - 1][j] + 1) i--; else j--;
  }
  for (let i = 0; i < W.length; i++) if (W[i].est) {
    let j = i; while (j < W.length && W[j].est) j++;
    const s = i > 0 ? W[i - 1].t1 : L.t0, e = j < W.length ? W[j].t0 : L.t1, k = j - i;
    for (let q = 0; q < k; q++) Object.assign(W[i + q], { t0: +(s + (e - s) * q / k).toFixed(3), t1: +(s + (e - s) * (q + 1) / k).toFixed(3) });
    i = j - 1;
  }
}
fs.writeFileSync(VJ, JSON.stringify(V, null, 1)); for (const f of ['_16k.wav', '_16k.json']) fs.rmSync(path.join(ROOT, 'voice', f), { force: true });
console.log(`align: ${matched}/${total} words heard by whisper.cpp; heard: "${heard.map((h) => h.w).join(' ')}"`);
