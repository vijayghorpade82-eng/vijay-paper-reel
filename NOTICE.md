# Notices

`kit/` (core.js, morph.js, board.js, score-head.js, score-tail.js) and `tools/` (build, still, tile, textcheck, export, gpu, voice, storyboard) are vendored from **animate** by cth9191 (https://github.com/cth9191/animate), MIT License. `tools/voice.mjs` was changed to skip faster-whisper unless `REEL_FASTER_WHISPER=1` is set.

New in paper-reel: `styles/paper-reel/kit.js`, `tools/kokoro_lines.py`, `tools/align.mjs`, `bin/reel`, `templates/starter`, `examples/vijay-skill`.

Third-party runtime pieces, installed separately: Kokoro (kokoro-onnx, Apache-2.0), whisper.cpp (MIT), Playwright (Apache-2.0), ffmpeg.

## animate licence

```
MIT License

Copyright (c) 2026 cth9191

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
