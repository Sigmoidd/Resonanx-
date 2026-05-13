# Resonanx

**Resonanx** is the Cloudflare-ready family music room for **Resonance** and **Exodia Stage Hand**.

It is designed to connect families through music. The player sees a warm stage interface, while family members can join by room code, watch the live performance glow, and send gentle encouragement that feeds directly into the sensory experience.

## Core modes

- **Player session** — the main player view with chord targets, bloom/glow, session logging, and favorite performance saves.
- **Lead side** — a family musician or caregiver can send lead chord changes to the room.
- **Family join-in** — family can watch live progress and send Spark, Applause, or Love.

## Sensory feedback

Family feedback is not just a chat message:

- **Spark** creates a bloom pulse, soft tone, and optional device vibration.
- **Applause** creates a stronger bloom/audio/haptic pulse.
- **Love** creates a warmer halo, softer tone, and longer haptic pulse.

The language stays compassionate: player, family, performance, room, session, join-in. No clinical family UI.

## Cloudflare deploy

This repo is set up as one Cloudflare Worker deployment:

- Vite builds the React app into `dist/`.
- Wrangler uploads `dist/` as Worker static assets.
- The Worker exposes a room relay under `/api/room/:roomCode/:stream`.
- The room relay uses a Durable Object named `ResonanceRoom`.

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

## Local dev

```bash
npm install
npm run dev
```

Local development still works without the relay. If `/api/room` is unavailable, the app falls back to local prototype storage so the UI can be tested.

## Repo structure

```txt
src/App.jsx          Main Resonanx app
src/main.jsx         Vite React entrypoint
worker/index.js      Cloudflare Worker + Durable Object relay
wrangler.toml        Cloudflare Worker config
docs/cloudflare.md   Deployment notes
```

## Cloudflare routes

```txt
/api/room/:roomCode/presence
/api/room/:roomCode/live
/api/room/:roomCode/chord
/api/room/:roomCode/reaction
```

Each room code maps to its own Durable Object instance.
