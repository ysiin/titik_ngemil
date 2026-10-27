/* /api/applications
   GET  -> daftar pendaftaran (butuh admin token)
   POST -> kirim pendaftaran tenant (publik)
*/
import { json, err, requireDB, readBody, isAdmin } from "../_shared.js";

export async function onRequestGet({ request, env }) {
  const db = requireDB(env);
  if (!isAdmin(request, env)) return err("Unauthorized", 401);
  const { results } = await db
    .prepare("SELECT * FROM applications ORDER BY submitted_at DESC, id DESC")
    .all();
  return json({ applications: results });
}

export async function onRequestPost({ request, env }) {
  const db = requireDB(env);
  const body = await readBody(request);
  const required = ["brand_name", "contact_name", "phone", "pitch"];
  for (const key of required) {
    if (!body[key] || String(body[key]).trim() === "") return err(`Field '${key}' wajib diisi.`, 422);
  }
  const appId = body.app_id || body.id || `APP-${Date.now()}`;
  const stage = body.stage || "terkirim";
  await db
    .prepare(
      `INSERT INTO applications
       (app_id, brand_name, category, contact_name, phone, email, pitch, portfolio_url,
        preferred_zone, site_id, booth, stage, note, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'review', datetime('now'))`
    )
    .bind(
      appId, body.brand_name, body.category || null, body.contact_name, body.phone,
      body.email || null, body.pitch, body.portfolio_url || null,
      body.preferred_zone || null, body.site || null, body.booth || null,
      stage, body.note || null
    )
    .run();
  return json({ ok: true, id: appId, stage, message: "Pendaftaran diterima." }, 201);
}