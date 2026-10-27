/* GET /api/zones — daftar zona; GET /api/stalls — daftar lapak */
import { json, requireDB, mapZone, mapStall } from "../_shared.js";

export async function onRequestGet({ env, request }) {
  const db = requireDB(env);
  const url = new URL(request.url);
  const withStalls = url.searchParams.get("with") === "stalls";

  const { results: zones } = await db.prepare("SELECT * FROM zones ORDER BY sort, id").all();
  const payload = { zones: zones.map(mapZone) };

  if (withStalls) {
    const { results: stalls } = await db.prepare("SELECT * FROM stalls ORDER BY code").all();
    payload.stalls = stalls.map(mapStall);
  }
  return json(payload);
}