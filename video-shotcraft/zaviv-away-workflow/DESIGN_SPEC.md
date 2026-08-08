# Zaviv — Away From Your Computer

## Brief

- Format: 1080×1920, 30 fps, 33 seconds.
- Audience: developers already using local and cloud coding agents.
- Problem: development becomes painful the instant a developer steps away from the desk, even though agents, builds, and decisions keep moving.
- Promise: Zaviv puts machines, terminals, live sessions, coding agents, and tracked work on the phone.
- CTA: “Keep shipping from anywhere.”

## Voiceover

“Your development workflow shouldn’t hurt the moment you step away from your computer. Agents keep running. They ask questions. Builds finish. Decisions wait. Without access, progress stalls, or you rush back to your desk. Zaviv puts every machine, terminal, and coding agent in your pocket. See what’s running. Jump into a live session. Send the next instruction. Turn an idea into a tracked task. So leaving your computer doesn’t mean leaving your workflow. Zaviv. Keep shipping from anywhere.”

Voice: local macOS Samantha, 182 wpm. Duration: 28.43s. It starts at frame 12, leaving a four-second brand hold at the end.

## Visual direction

- Reuse the existing Zaviv social system: near-black field, electric orange on the left, electric blue on the right, warm white type, and the campaign network background.
- Avenir Next is the primary display family, with system sans fallbacks.
- Real product claims use the supplied Zaviv screens (`zaviv-02`, `zaviv-04`, `zaviv-07`). Conceptual status rows are intentionally stylized and do not impersonate a specific live screen.
- Headlines are 74–88px; captions are 42px. All critical content stays inside vertical-social safe zones.
- Styleframe production is skipped because the repository already contains a verified, strict campaign system and 45+ finished assets. The video reuses its exact background, palette, typography, and source screens.

## Motion tokens

- Primary ease: cubic-bezier equivalent `Easing.bezier(0.2, 0.75, 0.25, 1)`.
- Section entrances: 14–22 frames; readable holds: at least 18 frames.
- UI elevation: 12–28px plus blur resolving to zero.
- Product camera movement remains frontal so real UI stays legible.
- Every animation is deterministic and driven by Remotion frames; no CSS transitions or runtime randomness.

## Shot Craft records and adaptations

| Shot | Record / style key | Function | Zaviv adaptation |
|---|---|---|---|
| 1 | `tension-camera-moves` / `slow-push-in` | Accumulate pressure before the problem lands | 1.00→1.12 accelerating push and deepening vignette over a single “away” status panel. |
| 2 | `ai-stream-response` / `ai-stream-response` | Show work continuing as a readable causal chain | Summary appears first, four status rows arrive with lagged icons, then one completion pulse and a static hold. |
| 3 | `tension-camera-moves` / hard-cut release from `slow-push-in` | Release accumulated pressure | Immediate bright orange/blue contrast title card: away from desk does not equal away from development. |
| 4 | `canvas-materialize-moves` / `panel-to-canvas` | Connect machines to the phone | The migration direction is adapted: machine cards travel on arcs into Zaviv’s pocket hub while their connectors draw in. |
| 5 | `spotlight-hero-card` / `spotlight-hero-card` | Give the live terminal one main-actor hero moment | Front-on product card gets one roving light lock, one lift, and a still readable hold. No repeated glints. |
| 6 | `canvas-materialize-moves` / `panel-to-canvas` | Turn ideas into concrete work | Three idea cards arc and compress toward the real Work/Tasks screen, preserving the “same content changes form” meaning. |
| 7 | `ui-to-brand-morph` / `input-morph-assemble` | Prove the input/workflow resolves into the brand | The final instruction field sends, compresses into Zaviv’s orange/blue underline, and particles settle around the real wordmark. No invented logo mark. |

## Timeline

| Frames | Time | Picture | Copy / narration intent | Sound |
|---:|---:|---|---|---|
| 0–134 | 0–4.5s | Slow push on away-status panel | “Your workflow shouldn’t hurt…” | Low BGM, soft whoosh |
| 135–284 | 4.5–9.5s | Status summary + rows | Agents run; questions/builds/decisions wait | Soft transition, restrained row clicks |
| 285–389 | 9.5–13s | High-contrast thesis card | Progress stalls or you rush back | Fast whoosh, impact |
| 390–539 | 13–18s | Machines arc into pocket hub | Zaviv puts machines and agents in your pocket | Riser under materialization |
| 540–689 | 18–23s | Live terminal hero | See, join, respond | Big whoosh, sparkle, soft reseat |
| 690–839 | 23–28s | Ideas become tracked tasks | Turn an idea into a tracked task | Fast whoosh, completion click |
| 840–989 | 28–33s | Instruction field morphs to wordmark | Leaving the computer ≠ leaving the workflow | Riser → deep impact → sparkle |

## Audio

- VO is the anchor.
- BGM: Mixkit “House Vibez” by Lily J, Mixkit Stock Music Free License; kept below narration and faded at both ends.
- SFX are selected from the Shot Craft audio library and licensed under Mixkit Sound Effects Free License.
- Two outputs come from the same timeline: one with BGM, one with VO + SFX only.
