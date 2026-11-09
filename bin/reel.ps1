<#
.SYNOPSIS
  reel.ps1 — the paper-reel pipeline for Windows PowerShell.
  Free and local: Kokoro voice, whisper.cpp timing, canvas + Playwright + ffmpeg.
.DESCRIPTION
  Commands:
    .\reel.ps1 doctor                             Check all dependencies
    .\reel.ps1 new <piece-dir> [--from <example>] Copy starter or example into <piece-dir>
    .\reel.ps1 voice <piece-dir> [options]         Kokoro takes -> voice.wav + word times
    .\reel.ps1 build <piece-dir>                  Assemble index.html
    .\reel.ps1 still <piece-dir> <times> <out.png> Render frames to look at
    .\reel.ps1 check <piece-dir>                  Text overlap / safe-zone check + determinism
    .\reel.ps1 export <piece-dir> [out.mp4]       Render final MP4 (-14 LUFS)
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = "help",

    [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
    [string[]]$RemainingArgs
)

$ErrorActionPreference = "Stop"
$SkillDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ToolsDir = Join-Path $SkillDir "tools"

# Set NODE_PATH
$nodeModules = Join-Path $SkillDir "node_modules"
if (Test-Path $nodeModules) {
    if ($env:NODE_PATH) {
        $env:NODE_PATH = "$nodeModules;$env:NODE_PATH"
    } else {
        $env:NODE_PATH = $nodeModules
    }
}

# Determine Python for Kokoro
if (-not $env:KOKORO_PY) {
    $env:KOKORO_PY = "python"
}

# Kokoro & Whisper model paths
$userProfile = if ($env:USERPROFILE) { $env:USERPROFILE } else { [Environment]::GetFolderPath("UserProfile") }
if (-not $env:KOKORO_DIR) {
    $env:KOKORO_DIR = Join-Path $userProfile ".cache\hyperframes\tts"
}
if (-not $env:WHISPER_MODEL) {
    $env:WHISPER_MODEL = Join-Path $userProfile ".cache\whisper\ggml-base.en.bin"
}

function Show-Help {
    @"
reel — paper-reel video generation pipeline

Usage:
  reel doctor                              Check all dependencies
  reel generate <piece-dir> [out.mp4]      All-in-one: VoiceStudio voice + align + build + export MP4
  reel new <piece-dir> [--from <example>]  Copy starter or example into <piece-dir>
  reel voice <piece-dir> [options]         VoiceStudio takes -> voice.wav + word times
  reel build <piece-dir>                   Assemble index.html
  reel still <piece-dir> <times> <out.png> Render frames to check
  reel check <piece-dir>                   Text overlap and safe-zone check + determinism
  reel export <piece-dir> [out.mp4]        Render final MP4 (-14 LUFS)
"@
}

switch ($Command.ToLower()) {
    "doctor" {
        Write-Host "paper-reel doctor ($SkillDir)" -ForegroundColor Cyan
        $ok = $true
        function Check-Item($name, [scriptblock]$test, $fix) {
            try {
                $res = & $test
                if ($res) {
                    Write-Host "  ok      $name" -ForegroundColor Green
                } else {
                    Write-Host "  MISSING $name -> $fix" -ForegroundColor Red
                    $script:ok = $false
                }
            } catch {
                Write-Host "  MISSING $name -> $fix" -ForegroundColor Red
                $script:ok = $false
            }
        }

        Check-Item "node 18+" {
            $v = (node -e "process.stdout.write(process.versions.node.split('.')[0])")
            [int]$v -ge 18
        } "Install Node.js 18+ from https://nodejs.org"

        Check-Item "ffmpeg" {
            (Get-Command ffmpeg -ErrorAction SilentlyContinue) -ne $null
        } "Install ffmpeg and ensure it is in PATH"

        Check-Item "playwright (skill)" {
            $p = node -e "try { require('playwright'); process.stdout.write('1'); } catch(e) { process.stdout.write('0'); }"
            $p -eq "1"
        } "cd '$SkillDir'; npm install"

        Check-Item "chromium" {
            $c = node -e "const fs=require('fs'); try { const ep=require('playwright').chromium.executablePath(); process.stdout.write(fs.existsSync(ep)?'1':'0'); } catch(e) { process.stdout.write('0'); }"
            $c -eq "1"
        } "cd '$SkillDir'; npx playwright install chromium"

        Check-Item "whisper-cli" {
            (Get-Command whisper-cli -ErrorAction SilentlyContinue) -ne $null
        } "Download whisper-cli.exe and place in PATH"

        Check-Item "whisper model" {
            Test-Path $env:WHISPER_MODEL
        } "Download ggml-base.en.bin to $env:WHISPER_MODEL"

        Check-Item "kokoro python ($env:KOKORO_PY)" {
            & $env:KOKORO_PY -c "import kokoro_onnx, soundfile, espeakng_loader; print('1')" 2>$null | Select-String "1"
        } "pip install kokoro-onnx soundfile espeakng-loader"

        Check-Item "kokoro model" {
            (Test-Path (Join-Path $env:KOKORO_DIR "models\kokoro-v1.0.onnx")) -and (Test-Path (Join-Path $env:KOKORO_DIR "voices\voices-v1.0.bin"))
        } "Download kokoro-v1.0.onnx and voices-v1.0.bin into $env:KOKORO_DIR"

        Check-Item "fonts" {
            $true
        } "Fallback fonts: Arial, Helvetica, Georgia, Rockwell"

        if ($ok) {
            Write-Host "all good! Everything is configured and ready." -ForegroundColor Green
        } else {
            Write-Host "Fix the MISSING lines above." -ForegroundColor Yellow
            exit 1
        }
    }

    "new" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel new <piece-dir> [--from <example>]"
            exit 1
        }
        $dest = $RemainingArgs[0]
        $from = "templates/starter"
        if ($RemainingArgs.Length -ge 3 -and $RemainingArgs[1] -eq "--from") {
            $from = "examples/$($RemainingArgs[2])"
        }
        if (Test-Path $dest) {
            Write-Error "$dest already exists"
            exit 1
        }
        $sourcePath = Join-Path $SkillDir $from
        $parent = Split-Path -Parent $dest
        if ($parent -and -not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Copy-Item -Path $sourcePath -Destination $dest -Recurse -Force
        Write-Host "new piece: $dest (from $from). Next: edit voice/script.json and src/scenes.js, then: reel voice $dest" -ForegroundColor Green
    }

    "voice" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel voice <piece> [--voice V] [--speed S] [--only ids] [--say]"
            exit 1
        }
        $piece = $RemainingArgs[0]
        $extraArgs = $RemainingArgs[1..($RemainingArgs.Length - 1)]

        if ($extraArgs -contains "--say") {
            node (Join-Path $ToolsDir "voice.mjs") $piece --scratch
        } else {
            & $env:KOKORO_PY -u (Join-Path $ToolsDir "kokoro_lines.py") $piece @extraArgs
            node (Join-Path $ToolsDir "voice.mjs") $piece
        }
        node (Join-Path $ToolsDir "align.mjs") $piece
    }

    "build" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel build <piece>"
            exit 1
        }
        node (Join-Path $ToolsDir "build.mjs") $RemainingArgs[0]
    }

    "still" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 3) {
            Write-Error "usage: reel still <piece> <times> <out.png> [--scale 0.4]"
            exit 1
        }
        $piece = $RemainingArgs[0]
        $ts = $RemainingArgs[1]
        $out = $RemainingArgs[2]
        $scale = "0.4"
        if ($RemainingArgs.Length -ge 5 -and $RemainingArgs[3] -eq "--scale") {
            $scale = $RemainingArgs[4]
        }
        node (Join-Path $ToolsDir "build.mjs") $piece | Out-Null
        node (Join-Path $ToolsDir "still.mjs") $piece $ts $out --scale $scale
    }

    "check" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel check <piece>"
            exit 1
        }
        $piece = $RemainingArgs[0]
        node (Join-Path $ToolsDir "build.mjs") $piece | Out-Null
        node (Join-Path $ToolsDir "textcheck.mjs") $piece
        $tempTile = Join-Path ([System.IO.Path]::GetTempPath()) "reel-tile.png"
        node (Join-Path $ToolsDir "tile.mjs") $piece $tempTile 30 300 600
    }

    "generate" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel generate <piece> [out.mp4] [--voice V] [--speed S]"
            exit 1
        }
        $piece = $RemainingArgs[0]
        $out = if ($RemainingArgs.Length -ge 2 -and -not $RemainingArgs[1].StartsWith("--")) { $RemainingArgs[1] } else { "$piece.mp4" }
        $extraArgs = @()
        for ($i = 1; $i -lt $RemainingArgs.Length; $i++) {
            if ($i -eq 1 -and -not $RemainingArgs[$i].StartsWith("--")) { continue }
            $extraArgs += $RemainingArgs[$i]
        }

        Write-Host "`n============================================================" -ForegroundColor Cyan
        Write-Host "ALL-IN-ONE REEL GENERATION (VOICESTUDIO + PAPER-REEL)" -ForegroundColor Cyan
        Write-Host "============================================================" -ForegroundColor Cyan

        Write-Host "`n[1/4] Generating VoiceStudio Speech Takes..." -ForegroundColor Yellow
        python (Join-Path $ToolsDir "voicestudio_lines.py") $piece @extraArgs
        node (Join-Path $ToolsDir "voice.mjs") $piece

        Write-Host "`n[2/4] Aligning Word-by-Word Timestamps (whisper.cpp)..." -ForegroundColor Yellow
        node (Join-Path $ToolsDir "align.mjs") $piece

        Write-Host "`n[3/4] Compiling Cut-Paper HTML5 Canvas & Scenes..." -ForegroundColor Yellow
        node (Join-Path $ToolsDir "build.mjs") $piece

        Write-Host "`n[4/4] Rendering 1080x1920 30FPS MP4 Video (Playwright + FFmpeg)..." -ForegroundColor Yellow
        $workers = if ($env:WORKERS) { $env:WORKERS } else { "6" }
        node (Join-Path $ToolsDir "export.mjs") $piece --workers $workers --no-captions

        $framesDir = Join-Path $piece "frames"
        if (Test-Path $framesDir) {
            Remove-Item -Recurse -Force $framesDir
        }

        $finalMp4 = Join-Path $piece "renders\final.mp4"
        if (Test-Path $finalMp4) {
            Copy-Item -Path $finalMp4 -Destination $out -Force
            Write-Host "`n============================================================" -ForegroundColor Green
            Write-Host "[OK] SUCCESS! Complete Reel generated in one single run:" -ForegroundColor Green
            Write-Host "  Video output: $out" -ForegroundColor Green
            Write-Host "============================================================" -ForegroundColor Green
        }
    }

    "export" {
        if (-not $RemainingArgs -or $RemainingArgs.Length -lt 1) {
            Write-Error "usage: reel export <piece> [out.mp4]"
            exit 1
        }
        $piece = $RemainingArgs[0]
        $out = if ($RemainingArgs.Length -ge 2) { $RemainingArgs[1] } else { "" }
        $workers = if ($env:WORKERS) { $env:WORKERS } else { "6" }

        node (Join-Path $ToolsDir "build.mjs") $piece | Out-Null
        node (Join-Path $ToolsDir "export.mjs") $piece --workers $workers --no-captions
        $framesDir = Join-Path $piece "frames"
        if (Test-Path $framesDir) {
            Remove-Item -Recurse -Force $framesDir
        }
        $finalMp4 = Join-Path $piece "renders\final.mp4"
        if ($out -and (Test-Path $finalMp4)) {
            Copy-Item -Path $finalMp4 -Destination $out -Force
            Write-Host "-> $out" -ForegroundColor Green
        }
        ffmpeg -nostats -i $finalMp4 -af "ebur128=framelog=quiet" -f null - 2>&1 | Select-String 'I:'
    }

    Default {
        Show-Help
    }
}
