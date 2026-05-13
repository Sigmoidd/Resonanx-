# Cloudflare deployment

This repo deploys as a single Cloudflare Worker:

- the React/Vite app is built into `dist/`
- Worker static assets serve the frontend
- Durable Objects provide the family room relay

## Deploy commands

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

## Room relay

The frontend uses same-origin requests by default:

```txt
/api/room/:roomCode/presence
/api/room/:roomCode/live
/api/room/:roomCode/chord
/api/room/:roomCode/reaction
```

If the relay is unavailable in local dev, the app falls back to local storage so the UI remains testable.

## Durable Object binding

`wrangler.toml` defines:

```toml
[[durable_objects.bindings]]
name = "RESONANCE_ROOMS"
class_name = "ResonanceRoom"
```

Each room code gets its own tiny shared state machine.
