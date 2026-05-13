const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function parseRoomPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  // /api/room/:roomCode/:kind
  if (parts.length < 4 || parts[0] !== "api" || parts[1] !== "room") return null;
  const roomCode = decodeURIComponent(parts[2] || "").trim().toUpperCase();
  const kind = decodeURIComponent(parts[3] || "").trim();
  if (!roomCode || !kind) return null;
  return { roomCode, kind };
}

export class ResonanceRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: JSON_HEADERS });

    const url = new URL(request.url);
    const parsed = parseRoomPath(url.pathname);
    if (!parsed) return json({ ok: false, error: "bad room path" }, 400);

    const { kind } = parsed;
    const allowed = new Set(["presence", "chord", "live", "reaction"]);
    if (!allowed.has(kind)) return json({ ok: false, error: "unknown room stream" }, 404);

    if (request.method === "GET") {
      if (kind === "presence") {
        const presence = (await this.state.storage.get("presence")) || {};
        const now = Date.now();
        const pruned = Object.fromEntries(
          Object.entries(presence).filter(([, p]) => p && p.active && now - Number(p.joined || 0) < 15000),
        );
        await this.state.storage.put("presence", pruned);
        return json({ ok: true, data: pruned });
      }

      const data = (await this.state.storage.get(kind)) || null;
      return json({ ok: true, data });
    }

    if (request.method === "POST") {
      let body = {};
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid json" }, 400);
      }

      if (kind === "presence") {
        const presence = (await this.state.storage.get("presence")) || {};
        if (!body.id) return json({ ok: false, error: "presence id required" }, 400);
        presence[body.id] = {
          id: String(body.id),
          role: String(body.role || "family"),
          name: String(body.name || body.role || "Family"),
          joined: Number(body.joined || Date.now()),
          active: Boolean(body.active),
        };
        await this.state.storage.put("presence", presence);
        return json({ ok: true, data: presence });
      }

      await this.state.storage.put(kind, body);
      return json({ ok: true, data: body });
    }

    return json({ ok: false, error: "method not allowed" }, 405);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: JSON_HEADERS });

    if (url.pathname.startsWith("/api/room/")) {
      const parsed = parseRoomPath(url.pathname);
      if (!parsed) return json({ ok: false, error: "bad room path" }, 400);
      const id = env.RESONANCE_ROOMS.idFromName(parsed.roomCode);
      const stub = env.RESONANCE_ROOMS.get(id);
      return stub.fetch(request);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return json({ ok: true, service: "resonanx-relay" });
  },
};
