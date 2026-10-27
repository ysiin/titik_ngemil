/* Middleware khusus /api/admin/* — wajib admin token */
import { preflight, err, requireAdmin } from "../../_shared.js";

export async function onRequest(context) {
  const { request, env, next } = context;
  if (request.method === "OPTIONS") return preflight();
  try {
    requireAdmin(request, env);
    return await next();
  } catch (e) {
    return err(e && e.message ? e.message : "Unauthorized", (e && e.status) || 401);
  }
}