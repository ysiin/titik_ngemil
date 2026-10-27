/* GET /api/stalls — daftar lapak (+ tenant yang menempati) */
import { json, requireDB, mapStall } from "../_shared.js";

export async function onRequestGet({ env }) {
  const db = requireDB(env);
  const { results: stalls } = await db
    .prepare(
      `SELECT s.*, t.brand AS tenant_brand
       FROM stalls s
       LEFT JOIN tenants t ON t.stall_code = s.code
       ORDER BY s.code`
    )
    .all();
  return json({
    stalls: stalls.map((s) => ({ ...mapStall(s), tenantBrand: s.tenant_brand || null })),
  });
}