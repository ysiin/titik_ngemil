/* Titik Ngemil — shared helpers for the Cloudflare Worker */

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

export function err(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

export function preflight() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}

export function getDB(env) {
  return env && env.DB ? env.DB : null;
}

export function requireDB(env) {
  const db = getDB(env);
  if (!db) {
    const e = new Error("Database D1 belum terhubung. Bind D1 dengan nama variable 'DB' di project Worker.");
    e.status = 503;
    throw e;
  }
  return db;
}

export function isAdmin(request, env) {
  const expected = env && env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  return token.length > 0 && token === expected;
}

export function requireAdmin(request, env) {
  if (!isAdmin(request, env)) {
    const e = new Error("Unauthorized: token admin tidak valid.");
    e.status = 401;
    throw e;
  }
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/* --- row mappers: DB row -> API shape (mirip db.js) --- */
export function mapTenant(t, menus) {
  return {
    slug: t.slug,
    brand: t.brand,
    categoryId: t.category_id,
    zoneId: t.zone_id,
    stallCode: t.stall_code,
    tagline: { id: t.tagline_id, en: t.tagline_en },
    desc: { id: t.desc_id, en: t.desc_en },
    story: { id: t.story_id, en: t.story_en },
    instagram: t.instagram,
    whatsapp: t.whatsapp,
    halal: !!t.halal,
    tags: t.tags ? String(t.tags).split(",").filter(Boolean) : [],
    siteId: t.site_id,
    boothStatus: t.booth_status || "buka",
    verification: t.verification || "disetujui",
    days: t.days ? String(t.days).split(",").filter(Boolean) : [],
    menu: (menus || []).map(mapMenu),
  };
}

export function mapMenu(m) {
  return {
    id: m.id,
    name: m.name,
    price: m.price,
    desc: { id: m.desc_id, en: m.desc_en },
    signature: !!m.is_signature,
    available: !!m.is_available,
  };
}

export function mapZone(z) {
  return {
    id: z.id,
    type: z.type,
    color: z.color,
    name: { id: z.name_id, en: z.name_en },
    blurb: { id: z.blurb_id, en: z.blurb_en },
    area: { x: z.pos_x, y: z.pos_y, w: z.pos_w, h: z.pos_h },
  };
}

export function mapStall(s) {
  return {
    code: s.code,
    no: s.no,
    zoneId: s.zone_id,
    siteId: s.site_id,
    label: s.label,
    x: s.pos_x, y: s.pos_y, w: s.pos_w, h: s.pos_h,
    status: s.status,
    boothStatus: s.booth_status || "buka",
  };
}

export function mapSite(s) {
  return {
    id: s.id,
    slug: s.slug,
    status: s.status,
    city: s.city,
    name: { id: s.name_id, en: s.name_en },
    blurb: { id: s.blurb_id, en: s.blurb_en },
    address: s.address,
    mapsUrl: s.maps_url,
    capacity: s.capacity,
    openTime: s.open_time,
    closeTime: s.close_time,
    launchDate: s.launch_date,
  };
}

export function mapSchedule(s) {
  return {
    id: s.id,
    time: s.start_time,
    endTime: s.end_time,
    type: s.type,
    stage: s.stage,
    title: { id: s.title_id, en: s.title_en },
    desc: { id: s.desc_id, en: s.desc_en },
  };
}