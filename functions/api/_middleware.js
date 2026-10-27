/* Middleware: CORS + error handling untuk semua /api/* */
import { preflight, err } from "../_shared.js";

export async function onRequest(context) {
  const { request, next } = context;
  if (request.method === "OPTIONS") return preflight();
  try {
    const res = await next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (e) {
    return err(e && e.message ? e.message : "Internal error", (e && e.status) || 500);
  }
}