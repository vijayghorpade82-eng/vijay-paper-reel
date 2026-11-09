#!/usr/bin/env python3
"""
create_reel.py — Unified All-in-One Paper-Reel Generator.
Integrates VoiceStudio speech generation with paper-reel video rendering in a single command.

Usage:
  python tools/create_reel.py pieces/<name> [out.mp4] [--voice am_michael] [--speed 1.15]
"""
import os
import sys
import shutil
import subprocess
from pathlib import Path

# Windows console encoding fix
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print("Usage: python tools/create_reel.py pieces/<name> [out.mp4] [--voice <voice>] [--speed <speed>]")
        sys.exit(1)

    piece_path = os.path.abspath(args[0])
    tools_dir = os.path.dirname(os.path.abspath(__file__))
    skill_dir = os.path.dirname(tools_dir)

    out_mp4 = None
    voice_args = []
    
    i = 1
    while i < len(args):
        arg = args[i]
        if not arg.startswith("--") and out_mp4 is None:
            out_mp4 = os.path.abspath(arg)
        else:
            voice_args.append(arg)
            if i + 1 < len(args) and not args[i+1].startswith("--"):
                voice_args.append(args[i+1])
                i += 1
        i += 1

    if not out_mp4:
        out_mp4 = os.path.join(piece_path, "reel_output.mp4")

    print("=" * 60)
    print("UNIFIED PAPER-REEL GENERATOR (VOICESTUDIO + CANVAS)")
    print(f"Piece: {piece_path}")
    print(f"Target Video Output: {out_mp4}")
    print("=" * 60)

    # Step 1: VoiceStudio lines generation
    print("\n[Step 1/4] Generating AI Voice Takes with VoiceStudio...")
    vs_script = os.path.join(tools_dir, "voicestudio_lines.py")
    subprocess.run([sys.executable, vs_script, piece_path] + voice_args, check=True)

    # Step 2: Assemble voice track & align words with whisper.cpp
    print("\n[Step 2/4] Joining Voice & Whisper Word-by-Word Alignment...")
    voice_mjs = os.path.join(tools_dir, "voice.mjs")
    align_mjs = os.path.join(tools_dir, "align.mjs")
    subprocess.run(["node", voice_mjs, piece_path], check=True)
    subprocess.run(["node", align_mjs, piece_path], check=True)

    # Step 3: Build HTML5 canvas scene bundle
    print("\n[Step 3/4] Building Paper Animation Bundle...")
    build_mjs = os.path.join(tools_dir, "build.mjs")
    subprocess.run(["node", build_mjs, piece_path], check=True)

    # Step 4: Render frames & export 1080x1920 MP4
    print("\n[Step 4/4] Rendering 1080x1920 30FPS MP4 Video (Playwright + FFmpeg)...")
    export_mjs = os.path.join(tools_dir, "export.mjs")
    workers = os.environ.get("WORKERS", "6")
    subprocess.run(["node", export_mjs, piece_path, "--workers", workers, "--no-captions"], check=True)

    # Copy to desired output
    final_render = os.path.join(piece_path, "renders", "final.mp4")
    if os.path.exists(final_render):
        os.makedirs(os.path.dirname(out_mp4), exist_ok=True)
        shutil.copyfile(final_render, out_mp4)
        print("\n" + "=" * 60)
        print("✓ SUCCESS! Video created together in one run:")
        print(f"  Final Reel: {out_mp4}")
        print("=" * 60)
    else:
        print(f"Error: Final render file not found at {final_render}")
        sys.exit(1)

if __name__ == "__main__":
    main()
