/* /api/applications
   GET  -> daftar pendaftaran (butuh admin token)
   POST -> kirim pendaftaran tenant (publik)
*/
import { json, err, requireDB, requireAdmin, readBody, isAdmin } from "../_shared.js";

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
  await db
    .prepare(
      `INSERT INTO applications
       (brand_name, category, contact_name, phone, email, pitch, portfolio_url, preferred_zone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'review')`
    )
    .bind(
      body.brand_name, body.category || null, body.contact_name, body.phone,
      body.email || null, body.pitch, body.portfolio_url || null, body.preferred_zone || null
    )
    .run();
  return json({ ok: true, message: "Pendaftaran diterima." }, 201);
}