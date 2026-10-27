/* GET /api/event — info event */
import { json, requireDB } from "../_shared.js";

export async function onRequestGet({ env }) {
  const db = requireDB(env);
  const row = await db.prepare("SELECT * FROM events WHERE status = 'published' ORDER BY event_date DESC LIMIT 1").first();
  if (!row) return json({ event: null });
  return json({
    event: {
      id: row.id, slug: row.slug,
      name: { id: row.name_id, en: row.name_en },
      theme: { id: row.theme_id, en: row.theme_en },
      date: row.event_date, startTime: row.start_time, endTime: row.end_time,
      venueName: { id: row.venue_id, en: row.venue_en },
      address: row.address, city: row.city, mapsUrl: row.maps_url,
      hashtag: row.hashtag, status: row.status,
    },
  });
}