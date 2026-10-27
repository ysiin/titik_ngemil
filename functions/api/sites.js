/* GET /api/sites — daftar titik (multi-titik) + kapasitas terisi */
import { json, requireDB, mapSite } from "../_shared.js";

export async function onRequestGet({ env }) {
  const db = requireDB(env);
  const { results: sites } = await db
    .prepare("SELECT * FROM sites ORDER BY sort, id")
    .all();
  const { results: counts } = await db
    .prepare(
      `SELECT site_id, COUNT(*) AS n
       FROM tenants
       WHERE status = 'published'
       GROUP BY site_id`
    )
    .all();
  const bySite = {};
  for (const c of counts) bySite[c.site_id] = c.n;
  return json({
    sites: sites.map((s) => ({ ...mapSite(s), filled: bySite[s.id] || 0 })),
    activeSite: (sites.find((s) => s.status === "active") || {}).id || null,
  });
}