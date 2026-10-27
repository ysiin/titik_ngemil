/* GET /api/tenants — daftar tenant + menu; ?slug= untuk satu tenant */
import { json, requireDB, mapTenant, mapMenu } from "../_shared.js";

export async function onRequestGet({ env, request }) {
  const db = requireDB(env);
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const t = await db.prepare("SELECT * FROM tenants WHERE slug = ?").bind(slug).first();
    if (!t) return json({ tenant: null }, 404);
    const { results: menus } = await db
      .prepare("SELECT * FROM menu_items WHERE tenant_slug = ? ORDER BY sort, id").bind(slug).all();
    return json({ tenant: mapTenant(t, menus) });
  }

  const { results: tenants } = await db.prepare("SELECT * FROM tenants ORDER BY brand").all();
  const { results: menus } = await db.prepare("SELECT * FROM menu_items ORDER BY sort, id").all();
  const bySlug = {};
  menus.forEach((m) => {
    (bySlug[m.tenant_slug] = bySlug[m.tenant_slug] || []).push(m);
  });
  return json({ tenants: tenants.map((t) => mapTenant(t, bySlug[t.slug])) });
}