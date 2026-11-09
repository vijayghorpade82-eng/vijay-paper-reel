#!/usr/bin/env python3
"""
VoiceStudio integration for paper-reel.
Generates voice lines for a piece using VoiceStudio's local speech / cloning engine.

Usage:
  python tools/voicestudio_lines.py pieces/<name> [--voice <name_or_clone_id>] [--speed <float>] [--server <url>]

Contract:
  Reads <piece>/voice/script.json
  Writes <piece>/voice/<id>.wav for each line
  Updates "file" field in script.json for downstream align.mjs and export.mjs
"""
import os
import sys
import json
import urllib.request
import urllib.parse
import shutil
from pathlib import Path

# Ensure utf-8 output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print("Usage: python tools/voicestudio_lines.py pieces/<name> [--voice <voice>] [--speed <speed>] [--server <url>]")
        sys.exit(1)

    piece_path = args[0]
    opt = lambda k, d: args[args.index(k) + 1] if k in args and args.index(k) + 1 < len(args) else d
    voice = opt("--voice", "am_michael")
    speed = float(opt("--speed", 1.15))
    server_url = opt("--server", os.environ.get("VOICESTUDIO_URL", "http://localhost:8000"))
    only = opt("--only", "")

    voice_dir = os.path.join(piece_path, "voice")
    script_path = os.path.join(voice_dir, "script.json")

    if not os.path.exists(script_path):
        print(f"Error: {script_path} not found.")
        sys.exit(1)

    with open(script_path, "r", encoding="utf-8") as f:
        script = json.load(f)

    print(f"[VoiceStudio Bridge] Generating voice takes for '{piece_path}'...")
    print(f"  Voice: {voice} | Speed: {speed}")

    # Check if VoiceStudio API is live
    server_online = False
    try:
        req = urllib.request.Request(f"{server_url}/health", headers={"User-Agent": "paper-reel-bridge"})
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            if resp.status == 200:
                server_online = True
    except Exception:
        server_online = False

    if server_online:
        print(f"  Connected to live VoiceStudio server at {server_url}")
    else:
        print(f"  VoiceStudio server not running at {server_url}. Using local ONNX engine fallback...")

    kokoro_instance = None
    if not server_online:
        # Load local Kokoro / VoiceStudio engine
        try:
            import espeakng_loader
            from phonemizer.backend.espeak.wrapper import EspeakWrapper
            EspeakWrapper.set_library(espeakng_loader.get_library_path())
            EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
            from kokoro_onnx import Kokoro
            cache_dir = os.path.expanduser(os.environ.get("KOKORO_DIR", "~/.cache/hyperframes/tts"))
            kokoro_instance = Kokoro(
                os.path.join(cache_dir, "models", "kokoro-v1.0.onnx"),
                os.path.join(cache_dir, "voices", "voices-v1.0.bin")
            )
        except Exception as e:
            print(f"Warning: Failed to load local ONNX engine: {e}")

    for idx, line in enumerate(script.get("lines", [])):
        line_id = line.get("id", f"l{idx+1}")
        if line_id == "voice":
            print(f"Error: line id cannot be 'voice' (reserved for final mixed track). Rename line '{line_id}'.")
            sys.exit(1)

        if only and line_id not in only.split(","):
            continue

        text = line.get("say", line.get("text", ""))
        line_voice = line.get("voice", voice)
        line_speed = float(line.get("speed", speed))
        out_file = f"{line_id}.wav"
        out_path = os.path.join(voice_dir, out_file)

        generated = False
        if server_online:
            # Generate via VoiceStudio OpenAI-compatible endpoint
            try:
                payload = json.dumps({
                    "model": "voicestudio",
                    "input": text,
                    "voice": line_voice,
                    "response_format": "wav",
                    "speed": line_speed
                }).encode("utf-8")
                api_req = urllib.request.Request(
                    f"{server_url}/v1/audio/speech",
                    data=payload,
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(api_req, timeout=30) as r:
                    with open(out_path, "wb") as f_out:
                        f_out.write(r.read())
                generated = True
            except Exception as e:
                print(f"  VoiceStudio API call failed for '{line_id}': {e}. Falling back to local engine...")

        if not generated and kokoro_instance:
            import soundfile as sf
            samples, sample_rate = kokoro_instance.create(text, voice=line_voice, speed=line_speed, lang="en-us")
            sf.write(out_path, samples, sample_rate)
            generated = True

        if not generated:
            print(f"Error: Could not generate audio for line '{line_id}'")
            sys.exit(1)

        line["file"] = out_file
        print(f"  [OK] {line_id}: Generated {out_file} ({text[:35]}...)")

    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(script, f, indent=2)

    print("\n[VoiceStudio Bridge] Complete. Next run:")
    print(f"  node tools/voice.mjs {piece_path}")
    print(f"  node tools/align.mjs {piece_path}")
    print(f"  node tools/build.mjs {piece_path}")

if __name__ == "__main__":
    main()
