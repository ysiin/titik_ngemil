/* PATCH /api/applications/:id — keputusan admin (setujui / revisi / tolak)
   Body: { stage, note?, booth? }  — butuh admin token */
import { json, err, requireDB, requireAdmin, readBody, preflight } from "../../_shared.js";

export async function onRequestPatch({ request, env, params }) {
  const db = requireDB(env);
  try { requireAdmin(request, env); } catch (e) { return err(e.message || "Unauthorized", e.status || 401); }

  const id = params.id;
  const body = await readBody(request);
  const stage = body.stage;
  const allowed = ["terkirim", "ditinjau", "verifikasi", "disetujui", "perlu-revisi", "ditolak"];
  if (!allowed.includes(stage)) return err(`stage tidak valid: ${stage}`, 422);

  const statusMap = { disetujui: "accepted", ditolak: "rejected" };
  await db
    .prepare(
      `UPDATE applications
       SET stage = ?, note = ?, booth = COALESCE(?, booth), status = ?
       WHERE app_id = ? OR id = ?`
    )
    .bind(stage, body.note || null, body.booth || null, statusMap[stage] || "review", id, Number(id) || -1)
    .run();
  return json({ ok: true, id, stage });
}

export async function onRequestOptions() {
  return preflight();
}