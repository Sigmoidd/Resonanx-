# Cloudflare deployment

This repo is set up for a single Cloudflare Worker deployment:

- Vite builds the React app into `dist/`.
- Wrangler uploads `dist/` as Worker static assets.
- The Worker also exposes `/api/room/:roomCode/:stream`.
- The room relay uses a Durable Object named `ResonanceRoom`.

## Commands

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

The app uses the same origin relay by default. Do not set `VITE_RELAY_URL` unless you host the relay Worker separately from the frontend.

## Cloudflare resource used

The Worker creates one Durable Object instance per room code. That gives each family music room a tiny shared state machine for:

- `presence`
- `live`
- `chord`
- `reaction`

The frontend still falls back to local prototype storage if `/api/room/...` is unavailable, so local dev does not break.
