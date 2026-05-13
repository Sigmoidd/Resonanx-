# Resonanx

**Resonanx** is the Cloudflare-ready build of the Resonance family music room for **Exodia Stage Hand**.

It is a performance-first, family-first app for music connection:

- family join-in rooms by code
- live player glow / target chord / session pulse
- gentle family reactions that feed into the sensory experience
- favorite performance saves
- solo, local duo, remote lead, remote player, and family join-in modes
- optional thermal band BLE support

## What changed in this patch

The previous family room prototype could fall back to local/shared storage. This patch adds a real Cloudflare relay path:

```txt
/api/room/:roomCode/presence
/api/room/:roomCode/live
/api/room/:roomCode/chord
/api/room/:roomCode/reaction
```

The Worker uses a Durable Object per room code. Family feedback is no longer just text:

- ✦ Spark creates a bloom pulse and soft chime.
- 👏 Applause creates a stronger bloom/audio/haptic/thermal pulse.
- ❤️ Love creates a warm halo, softer harmonic chime, haptic pattern, and optional thermal success pulse.

The language stays compassionate: family, player, performance, session, room, join-in. No medicalized family UI.

## Local dev

```bash
npm install
npm run dev
```

Local dev uses the app normally. If the `/api/room` relay is unavailable, room state falls back to local prototype storage so the UI can still be tested.

## Cloudflare deploy

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

This deploys one Cloudflare Worker that serves both:

1. the React/Vite static app from `dist/`
2. the Durable Object family relay under `/api/room/...`

## Repo structure

```txt
src/App.jsx          Main Resonance / Resonanx app
src/main.jsx         Vite React entrypoint
worker/index.js      Cloudflare Worker + Durable Object relay
wrangler.toml        Cloudflare Worker config
docs/cloudflare.md   Deployment notes
```

## Cloudflare binding

`wrangler.toml` defines:

```toml
[[durable_objects.bindings]]
name = "RESONANCE_ROOMS"
class_name = "ResonanceRoom"
```

Each room code maps to its own Durable Object instance.

## GitHub quick start

```bash
git init
git add .
git commit -m "Launch Resonanx family relay build"
git branch -M main
git remote add origin https://github.com/Sigmoidd/resonanx.git
git push -u origin main
```

If the GitHub repo does not exist yet, create `Sigmoidd/resonanx` first, then run the push commands.
