/* POST /api/admin/sync — replace seluruh data dari Admin Dashboard
   Body: { event, categories, zones, stalls, tenants, schedule }  (bentuk db.js)
*/
import { json, err, requireDB, readBody } from "../../_shared.js";

export async function onRequestPost({ request, env }) {
  const db = requireDB(env);
  const body = await readBody(request);
  if (!body || !Array.isArray(body.tenants)) return err("Payload tidak valid: butuh objek dataset db.js.", 422);

  const e = body.event || {};
  const statements = [
    db.prepare("DELETE FROM menu_items"),
    db.prepare("DELETE FROM tenants"),
    db.prepare("DELETE FROM stalls"),
    db.prepare("DELETE FROM zones"),
    db.prepare("DELETE FROM categories"),
    db.prepare("DELETE FROM schedule_items"),
    db.prepare("DELETE FROM events"),
  ];

  statements.push(
    db.prepare(
      `INSERT INTO events (id,slug,name_id,name_en,theme_id,theme_en,event_date,start_time,end_time,venue_id,venue_en,address,city,maps_url,hashtag,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      e.id, e.slug, (e.name || {}).id, (e.name || {}).en, (e.theme || {}).id, (e.theme || {}).en,
      e.date, e.startTime, e.endTime, (e.venueName || {}).id, (e.venueName || {}).en,
      e.address, e.city, e.mapsUrl, e.hashtag, e.status || "published"
    )
  );

  (body.categories || []).forEach((c, i) =>
    statements.push(
      db.prepare("INSERT INTO categories (id,name_id,name_en,icon,color,sort) VALUES (?,?,?,?,?,?)")
        .bind(c.id, c.name.id, c.name.en, c.icon, c.color, i)
    )
  );

  (body.zones || []).forEach((z, i) => {
    const a = z.area || {};
    statements.push(
      db.prepare(
        `INSERT INTO zones (id,event_id,name_id,name_en,type,color,blurb_id,blurb_en,pos_x,pos_y,pos_w,pos_h,sort)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(z.id, e.id, z.name.id, z.name.en, z.type, z.color, z.blurb.id, z.blurb.en, a.x, a.y, a.w, a.h, i)
    );
  });

  (body.stalls || []).forEach((s) =>
    statements.push(
      db.prepare(
        "INSERT INTO stalls (code,event_id,zone_id,label,pos_x,pos_y,pos_w,pos_h) VALUES (?,?,?,?,?,?,?,?)"
      ).bind(s.code, e.id, s.zoneId, s.label, s.x, s.y, s.w, s.h)
    )
  );

  (body.tenants || []).forEach((t) => {
    statements.push(
      db.prepare(
        `INSERT INTO tenants (slug,event_id,brand,category_id,zone_id,stall_code,tagline_id,tagline_en,desc_id,desc_en,story_id,story_en,instagram,whatsapp,halal,tags,status)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'published')`
      ).bind(
        t.slug, e.id, t.brand, t.categoryId, t.zoneId, t.stallCode,
        (t.tagline || {}).id, (t.tagline || {}).en, (t.desc || {}).id, (t.desc || {}).en,
        (t.story || {}).id || "", (t.story || {}).en || "", t.instagram || "", t.whatsapp || "",
        t.halal ? 1 : 0, (t.tags || []).join(",")
      )
    );
    (t.menu || []).forEach((m, i) =>
      statements.push(
        db.prepare(
          "INSERT INTO menu_items (tenant_slug,name,price,desc_id,desc_en,is_signature,is_available,sort) VALUES (?,?,?,?,?,?,?,?)"
        ).bind(t.slug, m.name, m.price, (m.desc || {}).id, (m.desc || {}).en, m.signature ? 1 : 0, m.available === false ? 0 : 1, i)
      )
    );
  });

  (body.schedule || []).forEach((it, i) =>
    statements.push(
      db.prepare(
        `INSERT INTO schedule_items (event_id,day,start_time,end_time,type,stage,title_id,title_en,desc_id,desc_en,sort)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(e.id, e.date, it.time, it.endTime, it.type, it.stage, it.title.id, it.title.en, it.desc.id, it.desc.en, i)
    )
  );

  await db.batch(statements);
  return json({ ok: true, synced: { tenants: (body.tenants || []).length, stalls: (body.stalls || []).length, zones: (body.zones || []).length } });
}