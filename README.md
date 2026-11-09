# Paper-Reel Studio 🎬✂️

An automated 9:16 vertical video and Instagram Reel creation suite in a cut-paper animation style: flat textured paper shapes, an animated mascot with dynamic hats and moods, headline signs, rubber stamps, counters, and synchronized word-by-word paper caption chips.

Developed and maintained by **Vijay**.

---

## 🌟 Key Features

- **All-in-One Generation**: Generate the voice, align word-level timestamps, build the canvas scenes, and export a high-definition 1080×1920 MP4 video in a **single command**.
- **VoiceStudio & Local AI TTS Integration**: Native support for **VoiceStudio** local voice cloning, custom personas, and 646 languages, plus offline **Kokoro Neural TTS**.
- **Whisper Alignment**: Precise word-by-word timestamps via `whisper.cpp` (`ggml-base.en`).
- **100% Free & Local**: Runs entirely on your own laptop/desktop with **zero API keys, zero cloud fees, and zero data uploads**.
- **Cross-Platform**: Fully compatible with **Windows 11 / 10**, **macOS**, and **Linux**.

---

## 🚀 Quick Start (Single Command)

To render a complete reel from start to finish in one run:

```powershell
# Windows PowerShell
.\bin\reel.ps1 generate examples\vijay-skill my_first_reel.mp4 --voice am_michael
```

Or using Python directly:

```bash
python tools/create_reel.py examples/vijay-skill my_first_reel.mp4 --voice am_michael
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or newer)
- **Python** (3.10+)
- **FFmpeg** (installed and added to PATH)
- **whisper-cli** (whisper.cpp executable)

### 1. Install Node Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Install Python Dependencies
```bash
pip install soundfile numpy kokoro-onnx phonemizer espeakng-loader psutil
```

### 3. Verify System Setup
Run the diagnostic check:
```powershell
.\bin\reel.ps1 doctor
```

---

## 🎬 Workflow & Commands

| Command | Purpose |
|:---|:---|
| `.\bin\reel.ps1 generate <piece> [out.mp4]` | **All-in-One**: Generates voice + aligns words + builds canvas + renders final MP4 |
| `.\bin\reel.ps1 new <piece-dir>` | Creates a new reel project from starter template |
| `.\bin\reel.ps1 voice <piece-dir>` | Generates voice takes with VoiceStudio / Kokoro |
| `.\bin\reel.ps1 build <piece-dir>` | Compiles `index.html` canvas bundle |
| `.\bin\reel.ps1 export <piece-dir> [out.mp4]` | Exports 1080×1920 MP4 video at broadcast-level -14 LUFS |

---

## 📂 Project Structure

```
vijay-paper-reel/
├── bin/
│   ├── reel.ps1              # Windows PowerShell CLI (doctor, generate, export)
│   └── reel                  # macOS / Linux Bash CLI
├── examples/
│   └── vijay-skill/          # Complete worked sample reel project
├── kit/                      # Core HTML5 Canvas animation engine
├── styles/                   # Cut-paper design assets & style definitions
├── templates/
│   └── starter/              # Blank template for creating new reels
├── tools/
│   ├── create_reel.py        # All-in-one automated pipeline runner
│   ├── voicestudio_lines.py  # VoiceStudio & Kokoro speech bridge
│   ├── align.mjs             # whisper.cpp word alignment engine
│   ├── build.mjs             # HTML5 bundle compiler
│   └── export.mjs            # Playwright + FFmpeg video renderer
├── package.json
└── README.md
```

---

## 📄 License

MIT License — Copyright (c) 2026 Vijay.
Feel free to use, modify, and distribute for personal and commercial video creation.
