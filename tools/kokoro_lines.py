"""Free local voice: Kokoro (kokoro-onnx) takes, one wav per script line.
usage: $KOKORO_PY tools/kokoro_lines.py pieces/<name> [--voice am_michael] [--speed 1.15] [--only id1,id2]
Writes <piece>/voice/<id>.wav and sets "file" on each line in script.json.
The patch below symlinks espeak's dylib instead of copying it to a temp dir (sandboxed macOS refuses to dlopen the copy)."""
import os, sys, json, shutil
_orig = shutil.copy
def _cp(src, dst, follow_symlinks=True):
    if str(src).endswith('.dylib'):
        os.symlink(os.path.realpath(src), dst); return dst
    return _orig(src, dst, follow_symlinks=follow_symlinks)
shutil.copy = _cp
import espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
from kokoro_onnx import Kokoro
import soundfile as sf
a = sys.argv[1:]; piece = a[0]
opt = lambda k, d: a[a.index(k) + 1] if k in a else d
voice, speed, only = opt('--voice', 'am_michael'), float(opt('--speed', '1.15')), opt('--only', '')
C = os.path.expanduser(os.environ.get('KOKORO_DIR', '~/.cache/hyperframes/tts'))
k = Kokoro(f'{C}/models/kokoro-v1.0.onnx', f'{C}/voices/voices-v1.0.bin')
sp = os.path.join(piece, 'voice', 'script.json'); S = json.load(open(sp))
for L in S['lines']:
    if L['id'] == 'voice': sys.exit('a line id cannot be "voice" (voice/voice.wav is the assembled track); rename it')
    if only and L['id'] not in only.split(','): continue
    text = L.get('say', L['text'])
    s, sr = k.create(text, voice=L.get('voice', voice), speed=L.get('speed', speed), lang='en-us')
    sf.write(os.path.join(piece, 'voice', L['id'] + '.wav'), s, sr); L['file'] = L['id'] + '.wav'
    print(f"{L['id']}: {len(s)/sr:.2f}s  {len(text.split())/(len(s)/sr):.2f} w/s", flush=True)
json.dump(S, open(sp, 'w'), indent=1)
