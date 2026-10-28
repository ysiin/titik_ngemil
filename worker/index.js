/* Titik Ngemil — Cloudflare Worker (static assets + API)
 *
 * Semua route /api/* ditangani di sini; sisanya dilayani sebagai static
 * asset dari folder public/ (lihat wrangler.toml -> [assets]).
 *
 * Logika handler dipindah apa adanya dari functions/api/* (Pages Functions),
 * jadi bentuk respons API tidak berubah.
 */
import {
  json,
  err,
  preflight,
  requireDB,
  readBody,
  isAdmin,
  requireAdmin,
  mapSite,
  mapZone,
  mapStall,
  mapTenant,
  mapSchedule,
} from "./_shared.js";

/* ---------------------------------------------------------------- sites */
async function getSites({ env }) {
  const db = requireDB(env);
  const { results: sites } = await db.prepare("SELECT * FROM sites ORDER BY sort, id").all();
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

/* ---------------------------------------------------------------- event */
async function getEvent({ env }) {
  const db = requireDB(env);
  const row = await db
    .prepare("SELECT * FROM events WHERE status = 'published' ORDER BY event_date DESC LIMIT 1")
    .first();
  if (!row) return json({ event: null });
  return json({
    event: {
      id: row.id,
      slug: row.slug,
      name: { id: row.name_id, en: row.name_en },
      theme: { id: row.theme_id, en: row.theme_en },
      date: row.event_date,
      startTime: row.start_time,
      endTime: row.end_time,
      venueName: { id: row.venue_id, en: row.venue_en },
      address: row.address,
      city: row.city,
      mapsUrl: row.maps_url,
      hashtag: row.hashtag,
      status: row.status,
    },
  });
}

/* --------------------------------------------------------------- zones */
async function getZones({ env, url }) {
  const db = requireDB(env);
  const withStalls = url.searchParams.get("with") === "stalls";
  const { results: zones } = await db.prepare("SELECT * FROM zones ORDER BY sort, id").all();
  const payload = { zones: zones.map(mapZone) };
  if (withStalls) {
    const { results: stalls } = await db.prepare("SELECT * FROM stalls ORDER BY code").all();
    payload.stalls = stalls.map(mapStall);
  }
  return json(payload);
}

/* -------------------------------------------------------------- stalls */
async function getStalls({ env }) {
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

/* ------------------------------------------------------------- tenants */
async function daysBySlug(db) {
  const { results } = await db.prepare("SELECT tenant_slug, day FROM tenant_days ORDER BY day").all();
  const map = {};
  for (const r of results) (map[r.tenant_slug] = map[r.tenant_slug] || []).push(r.day);
  return map;
}

async function getTenants({ env, url }) {
  const db = requireDB(env);
  const slug = url.searchParams.get("slug");
  const dayMap = await daysBySlug(db);

  if (slug) {
    const t = await db.prepare("SELECT * FROM tenants WHERE slug = ?").bind(slug).first();
    if (!t) return json({ tenant: null }, 404);
    const { results: menus } = await db
      .prepare("SELECT * FROM menu_items WHERE tenant_slug = ? ORDER BY sort, id")
      .bind(slug)
      .all();
    t.days = (dayMap[slug] || []).join(",");
    return json({ tenant: mapTenant(t, menus) });
  }

  const { results: tenants } = await db.prepare("SELECT * FROM tenants ORDER BY brand").all();
  const { results: menus } = await db.prepare("SELECT * FROM menu_items ORDER BY sort, id").all();
  const bySlug = {};
  menus.forEach((m) => {
    (bySlug[m.tenant_slug] = bySlug[m.tenant_slug] || []).push(m);
  });
  tenants.forEach((t) => {
    t.days = (dayMap[t.slug] || []).join(",");
  });
  return json({ tenants: tenants.map((t) => mapTenant(t, bySlug[t.slug])) });
}

/* ------------------------------------------------------------ schedule */
async function getSchedule({ env }) {
  const db = requireDB(env);
  const { results } = await db.prepare("SELECT * FROM schedule_items ORDER BY start_time, sort").all();
  return json({ schedule: results.map(mapSchedule) });
}

/* -------------------------------------------------------- applications */
async function getApplications({ request, env }) {
  const db = requireDB(env);
  if (!isAdmin(request, env)) return err("Unauthorized", 401);
  const { results } = await db
    .prepare("SELECT * FROM applications ORDER BY submitted_at DESC, id DESC")
    .all();
  return json({ applications: results });
}

async function postApplication({ request, env }) {
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
      appId,
      body.brand_name,
      body.category || null,
      body.contact_name,
      body.phone,
      body.email || null,
      body.pitch,
      body.portfolio_url || null,
      body.preferred_zone || null,
      body.site || null,
      body.booth || null,
      stage,
      body.note || null
    )
    .run();
  return json({ ok: true, id: appId, stage, message: "Pendaftaran diterima." }, 201);
}

async function patchApplication({ request, env }, params) {
  const db = requireDB(env);
  try {
    requireAdmin(request, env);
  } catch (e) {
    return err(e.message || "Unauthorized", e.status || 401);
  }

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

/* ---------------------------------------------------------- admin sync */
async function postAdminSync({ request, env }) {
  requireAdmin(request, env);
  const db = requireDB(env);
  const body = await readBody(request);
  if (!body || !Array.isArray(body.tenants)) {
    return err("Payload tidak valid: butuh objek dataset db.js.", 422);
  }

  const e = body.event || {};
  const statements = [
    db.prepare("DELETE FROM tenant_days"),
    db.prepare("DELETE FROM menu_items"),
    db.prepare("DELETE FROM tenants"),
    db.prepare("DELETE FROM stalls"),
    db.prepare("DELETE FROM applications"),
    db.prepare("DELETE FROM zones"),
    db.prepare("DELETE FROM schedule_items"),
    db.prepare("DELETE FROM sites"),
    db.prepare("DELETE FROM categories"),
    db.prepare("DELETE FROM events"),
  ];

  statements.push(
    db
      .prepare(
        `INSERT INTO events (id,slug,name_id,name_en,theme_id,theme_en,event_date,start_time,end_time,venue_id,venue_en,address,city,maps_url,hashtag,status)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      )
      .bind(
        e.id,
        e.slug,
        (e.name || {}).id,
        (e.name || {}).en,
        (e.theme || {}).id,
        (e.theme || {}).en,
        e.date,
        e.startTime,
        e.endTime,
        (e.venueName || {}).id,
        (e.venueName || {}).en,
        e.address,
        e.city,
        e.mapsUrl,
        e.hashtag,
        e.status || "published"
      )
  );

  const activeSite = body.activeSite || "gondangdia";

  (body.sites || []).forEach((s, i) =>
    statements.push(
      db
        .prepare(
          `INSERT INTO sites (id,slug,status,city,name_id,name_en,blurb_id,blurb_en,address,maps_url,capacity,open_time,close_time,launch_date,sort)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        )
        .bind(
          s.id,
          s.slug,
          s.status,
          s.city,
          s.name.id,
          s.name.en,
          s.blurb.id,
          s.blurb.en,
          s.address,
          s.mapsUrl,
          s.capacity,
          s.openTime,
          s.closeTime,
          s.launchDate,
          i
        )
    )
  );

  (body.categories || []).forEach((c, i) =>
    statements.push(
      db
        .prepare("INSERT INTO categories (id,name_id,name_en,icon,color,sort) VALUES (?,?,?,?,?,?)")
        .bind(c.id, c.name.id, c.name.en, c.icon, c.color, i)
    )
  );

  (body.zones || []).forEach((z, i) => {
    const a = z.area || {};
    statements.push(
      db
        .prepare(
          `INSERT INTO zones (id,event_id,name_id,name_en,type,color,blurb_id,blurb_en,pos_x,pos_y,pos_w,pos_h,sort)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
        )
        .bind(z.id, e.id, z.name.id, z.name.en, z.type, z.color, z.blurb.id, z.blurb.en, a.x, a.y, a.w, a.h, i)
    );
  });

  (body.stalls || []).forEach((s, i) =>
    statements.push(
      db
        .prepare(
          `INSERT INTO stalls (code,no,event_id,site_id,zone_id,label,pos_x,pos_y,pos_w,pos_h,status,booth_status)
           VALUES (?,?,?,?,?,?,?,?,?,?, 'occupied', ?)`
        )
        .bind(s.code, s.no || i + 1, e.id, activeSite, s.zoneId, s.label, s.x, s.y, s.w, s.h, s.boothStatus || "buka")
    )
  );

  (body.tenants || []).forEach((t) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO tenants (slug,event_id,brand,category_id,zone_id,stall_code,tagline_id,tagline_en,desc_id,desc_en,story_id,story_en,instagram,whatsapp,halal,tags,site_id,booth_status,verification,status)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'published')`
        )
        .bind(
          t.slug,
          e.id,
          t.brand,
          t.categoryId,
          t.zoneId,
          t.stallCode,
          (t.tagline || {}).id,
          (t.tagline || {}).en,
          (t.desc || {}).id,
          (t.desc || {}).en,
          (t.story || {}).id || "",
          (t.story || {}).en || "",
          t.instagram || "",
          t.whatsapp || "",
          t.halal ? 1 : 0,
          (t.tags || []).join(","),
          activeSite,
          t.boothStatus || "buka",
          t.verification || "disetujui"
        )
    );
    (t.days || []).forEach((d) =>
      statements.push(db.prepare("INSERT INTO tenant_days (tenant_slug,day) VALUES (?,?)").bind(t.slug, d))
    );
    (t.menu || []).forEach((m, i) =>
      statements.push(
        db
          .prepare(
            "INSERT INTO menu_items (tenant_slug,name,price,desc_id,desc_en,is_signature,is_available,sort) VALUES (?,?,?,?,?,?,?,?)"
          )
          .bind(t.slug, m.name, m.price, (m.desc || {}).id, (m.desc || {}).en, m.signature ? 1 : 0, m.available === false ? 0 : 1, i)
      )
    );
  });

  (body.schedule || []).forEach((it, i) =>
    statements.push(
      db
        .prepare(
          `INSERT INTO schedule_items (event_id,day,start_time,end_time,type,stage,title_id,title_en,desc_id,desc_en,sort)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)`
        )
        .bind(e.id, e.date, it.time, it.endTime, it.type, it.stage, it.title.id, it.title.en, it.desc.id, it.desc.en, i)
    )
  );

  await db.batch(statements);
  return json({
    ok: true,
    synced: {
      tenants: (body.tenants || []).length,
      stalls: (body.stalls || []).length,
      zones: (body.zones || []).length,
    },
  });
}

/* ---------------------------------------------------------------- table */
const ROUTES = [
  { match: /^\/api\/sites\/?$/, GET: getSites },
  { match: /^\/api\/event\/?$/, GET: getEvent },
  { match: /^\/api\/zones\/?$/, GET: getZones },
  { match: /^\/api\/stalls\/?$/, GET: getStalls },
  { match: /^\/api\/tenants\/?$/, GET: getTenants },
  { match: /^\/api\/schedule\/?$/, GET: getSchedule },
  { match: /^\/api\/applications\/?$/, GET: getApplications, POST: postApplication },
  { match: /^\/api\/applications\/([^/]+)\/?$/, PATCH: patchApplication },
  { match: /^\/api\/admin\/sync\/?$/, POST: postAdminSync },
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Selain /api/* biarkan static assets yang melayani.
    if (!path.startsWith("/api/")) {
      return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
    }

    if (request.method === "OPTIONS") return preflight();

    try {
      for (const route of ROUTES) {
        const m = path.match(route.match);
        if (!m) continue;

        const handler = route[request.method];
        if (!handler) {
          if (request.method === "HEAD" && route.GET) continue;
          return err(`Method ${request.method} tidak didukung untuk ${path}.`, 405);
        }

        const params = m[1] ? { id: decodeURIComponent(m[1]) } : {};
        const res = await handler({ request, env, url, params }, params);
        // CORS untuk semua respons API (setara middleware Pages)
        res.headers.set("Access-Control-Allow-Origin", "*");
        return res;
      }
      return err(`Endpoint tidak ditemukan: ${path}`, 404);
    } catch (e) {
      return err(e && e.message ? e.message : "Internal error", (e && e.status) || 500);
    }
  },
};