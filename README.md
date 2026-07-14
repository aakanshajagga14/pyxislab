# Pyxis Lab

**Your device. Your OR.**

AI-powered laparoscopic surgical simulation that runs entirely in the
browser — no VR headset, no proprietary hardware, no installation. Just a
webcam.

Pyxis Lab turns real-time hand tracking into laparoscopic instrument
control, giving medical trainees deliberate, repeatable practice on core
laparoscopic skills before their first live OR or cadaver exposure.

---

## Why

India produces 1.29L+ new medical practitioners a year, but surgical
simulation access remains scarce — most trainees get no structured
practice before operating on real patients. Existing simulators cost
₹55K–50L per unit and require dedicated hardware and lab space. Pyxis Lab
removes that barrier entirely: any laptop with a webcam becomes a
training station.

## What it does

- **Webcam-only dual-hand instrument tracking** — MediaPipe hand landmarks
  mapped to laparoscopic instrument behavior, no external sensors or
  gloves required.
- **Training and Assessment modes** — free practice with live feedback, or
  timed, scored evaluation runs.
- **Real, actionable metrics** — instrument stability, economy of motion,
  smoothness, idle time, and dual-hand coordination. Not gamified praise —
  data a trainee and instructor can actually act on.
- **Session reports** — per-attempt performance breakdowns to track
  progress over time.

### Supported tasks

| Task | Focus |
|---|---|
| Peg Transfer | Bimanual coordination and economy of motion |
| Pattern Cutting | Traction stability and procedural accuracy |
| Knot Tying | Confined-space alignment and knot security |

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/training` | Select a task for a training session |
| `/training/[taskId]` | Live training workspace |
| `/assessment` | Select a task for a timed assessment |
| `/assessment/[taskId]` | Live assessment workspace |
| `/report` | Session report index |
| `/report/[sessionId]` | Individual performance report |

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe) — hand
  landmark detection
- Custom hand-tracking signal pipeline: EMA smoothing, dead-zone
  filtering, velocity gating, and pinch debouncing for stable,
  low-latency instrument control from raw webcam input

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev     # Local development
npm run build   # Production build + type checks
npm run start   # Production server
npm run lint    # ESLint
npm run check   # Lint + production build
```

## Project structure

```
src/
  app/
    assessment/
    report/
    training/
  components/
    analytics/
    laparoscopic/
    landing/
    layout/
  hooks/
  lib/
    engines/
    hand-tracking/
    laparoscopic/
    types/
```

## Demo flow

1. Open `/training` or `/assessment`.
2. Select a laparoscopic task.
3. Click **Begin Task** and position both hands in frame — a short
   calibration step confirms lighting and hand-tracking confidence before
   the session starts.
4. Complete the guided or free practice session.
5. Review performance metrics at `/report`.

## Requirements

- A modern browser with webcam access (Chrome/Edge recommended).
- HTTPS or `localhost` — required by the browser for camera access.
- Network on first load, if the MediaPipe model/WASM assets aren't
  self-hosted in this deployment.

## Deploy

Deployed on [Vercel](https://vercel.com). Webcam access requires HTTPS,
which Vercel provides by default on every deployment.

```bash
vercel deploy
```

## Disclaimer

Pyxis Lab is for educational simulation only. It is not a medical device
and is not intended for diagnosis, treatment, or credentialing decisions.

---

<sub>Formerly LaparoSim.</sub>
