/* GET /api/schedule — jadwal acara */
import { json, requireDB, mapSchedule } from "../_shared.js";

export async function onRequestGet({ env }) {
  const db = requireDB(env);
  const { results } = await db.prepare("SELECT * FROM schedule_items ORDER BY start_time, sort").all();
  return json({ schedule: results.map(mapSchedule) });
}