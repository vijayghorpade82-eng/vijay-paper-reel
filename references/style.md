# The paper-reel look: measured numbers and layout

Matched from a reference reel by sampling its frames. Frame: 1080x1920, 30fps.

## Palette (`PR` in kit.js)
| role | hex |
|---|---|
| mascot (hero, never decoration) | `#d67555`, legs/shade `#c46b4c` |
| slate wall | `#869997` (light `#95a9a7`, dark `#788a89`) |
| navy (sign text, hats) | `#1c2b56`, card behind the sign `#192833` |
| ink | `#181b24`, terminal `#23262c` |
| cream sign / paper | `#f4f1e8`, `#e9e5da`, `#f9f8f4` |
| mustard / counter yellow | `#e6b82a` / `#f2c94c` |
| kicker green | `#3e8a2c`; tick green `#2f9e5b`; stamp red `#d2453a` |
| caption chip | `#d97a5b`, chip text `#f7efe2` |
| floor | concrete `#87857c`, wood `#4c321d` |

Change the wall colour every scene (slate, navy `#2b3b5e`, plum `#583656`, teal `#6c9e8f`, sand `#c9b28a`, dusk `#4a4566`, warm `#c79a5b`).

## Medium
- Flat fills with **no outlines**. Every shape gets a mottled paper texture (an overlay of multi-octave value noise at 0.5–0.8), a soft drop shadow (blur 14–22, 7–12px down), and an optional thin light rim.
- After every frame there's a global soft-light texture pass and a light vignette.
- Motion runs every frame (on 1s), so it's smooth. Things arrive with back-eased pops or playful springs. Nothing boils.

## Layout grid (y in px)
| band | what |
|---|---|
| 140–296 | the sign (x 70–930; a navy card offset up and right behind it) |
| 322–400 | the terminal bar (optional) |
| 420–1300 | the scene's hero props (boards, cards, screens) |
| 1450–1600 | **caption chips**, from x 70 and wrapping at x 930. Keep other text out of this band |
| 1260–1860 | the mascot: body centre x about 880 (cropped by the right edge), legs from y about 1640 |
| > 1620, x > 960 | phone UI (likes, comments, caption). No text there |

## Type
- Headline: Avenir Next 800, 66px, fitted to width, navy. Kicker: 22px 800, green.
- Chips: SuperClarendon 700, 70px, cream on salmon paper, rotated ±0.01–0.04, popping in on each word.
- Terminal: Avenir Next 600, 34px, with an orange block cursor and the Claude spark icon.
- Chalk: Chalkduster. Mono: Menlo.

## Rhythm
- One scene per voice line, with a hard cut 0.1s before the line starts. Optionally a second cut on a key word inside a long line.
- About 3.5 words/s; total 18–25s.
- Audio is about -14 LUFS: a 100 BPM lo-fi bed (pad, plucks, soft kick, hat) ducked under the voice, plus whooshes into cuts, typing clicks, counter ticks, stamp thuds, pops, and a chime on the CTA keyword.
