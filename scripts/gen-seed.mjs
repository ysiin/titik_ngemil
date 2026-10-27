/**
 * gen-seed.mjs
 * Membuat seed.sql untuk Cloudflare D1 dari dataset kanonik public/data/db.js
 * Jalankan: npm run gen:seed
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// db.js adalah UMD; di Node ia menempelkan data ke globalThis.TITIK_DB
await import(pathToFileURL(join(root, "public/data/db.js")).href);
const DB = globalThis.TITIK_DB;

if (!DB) {
  console.error("Gagal memuat dataset dari public/data/db.js");
  process.exit(1);
}

const q = (v) => (v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

const out = [];
out.push(`-- Titik Ngemil — seed data (generated ${new Date().toISOString()})`);
out.push("-- Jalankan: wrangler d1 execute titik-ngemil-db --remote --file=./seed.sql");
out.push("");
out.push("DELETE FROM tenant_days;");
out.push("DELETE FROM menu_items;");
out.push("DELETE FROM tenants;");
out.push("DELETE FROM stalls;");
out.push("DELETE FROM zones;");
out.push("DELETE FROM sites;");
out.push("DELETE FROM categories;");
out.push("DELETE FROM schedule_items;");
out.push("DELETE FROM applications;");
out.push("DELETE FROM events;");
out.push("");

const e = DB.event;
out.push(`INSERT INTO events (id,slug,name_id,name_en,theme_id,theme_en,event_date,start_time,end_time,venue_id,venue_en,address,city,maps_url,hashtag,status) VALUES (` +
  [e.id, e.slug, e.name.id, e.name.en, e.theme.id, e.theme.en, e.date, e.startTime, e.endTime,
   e.venueName.id, e.venueName.en, e.address, e.city, e.mapsUrl, e.hashtag, e.status].map(q).join(",") + ");");

(DB.sites || []).forEach((s, i) =>
  out.push(`INSERT INTO sites (id,slug,status,city,name_id,name_en,blurb_id,blurb_en,address,maps_url,capacity,open_time,close_time,launch_date,sort) VALUES (` +
    [s.id, s.slug, s.status, s.city, s.name.id, s.name.en, s.blurb.id, s.blurb.en,
     s.address, s.mapsUrl, s.capacity, s.openTime, s.closeTime, s.launchDate, i].map(q).join(",") + ");"));

DB.categories.forEach((c, i) =>
  out.push(`INSERT INTO categories (id,name_id,name_en,icon,color,sort) VALUES (` +
    [c.id, c.name.id, c.name.en, c.icon, c.color, i].map(q).join(",") + ");"));

DB.zones.forEach((z, i) =>
  out.push(`INSERT INTO zones (id,event_id,name_id,name_en,type,color,blurb_id,blurb_en,pos_x,pos_y,pos_w,pos_h,sort) VALUES (` +
    [z.id, e.id, z.name.id, z.name.en, z.type, z.color, z.blurb.id, z.blurb.en,
     z.area.x, z.area.y, z.area.w, z.area.h, i].map(q).join(",") + ");"));

DB.stalls.forEach((s, i) =>
  out.push(`INSERT INTO stalls (code,no,event_id,site_id,zone_id,label,pos_x,pos_y,pos_w,pos_h,status,booth_status) VALUES (` +
    [s.code, s.no || i + 1, e.id, DB.activeSite || "gondangdia", s.zoneId, s.label, s.x, s.y, s.w, s.h,
     "occupied", s.boothStatus || "buka"].map(q).join(",") + ");"));

DB.tenants.forEach((t) => {
  out.push(`INSERT INTO tenants (slug,event_id,brand,category_id,zone_id,stall_code,tagline_id,tagline_en,desc_id,desc_en,story_id,story_en,instagram,whatsapp,halal,tags,site_id,booth_status,verification,status) VALUES (` +
    [t.slug, e.id, t.brand, t.categoryId, t.zoneId, t.stallCode,
     t.tagline.id, t.tagline.en, t.desc.id, t.desc.en,
     (t.story || {}).id || "", (t.story || {}).en || "",
     t.instagram || "", t.whatsapp || "", t.halal ? 1 : 0, (t.tags || []).join(","),
     DB.activeSite || "gondangdia", t.boothStatus || "buka", t.verification || "disetujui", "published"].map(q).join(",") + ");");
  (t.days || []).forEach((d) =>
    out.push(`INSERT INTO tenant_days (tenant_slug,day) VALUES (` + [t.slug, d].map(q).join(",") + ");"));
  (t.menu || []).forEach((m, i) =>
    out.push(`INSERT INTO menu_items (tenant_slug,name,price,desc_id,desc_en,is_signature,is_available,sort) VALUES (` +
      [t.slug, m.name, m.price, m.desc.id, m.desc.en, m.signature ? 1 : 0, m.available === false ? 0 : 1, i].map(q).join(",") + ");"));
});

(DB.applications || []).forEach((a) =>
  out.push(`INSERT INTO applications (app_id,brand_name,category,contact_name,phone,email,pitch,preferred_zone,site_id,booth,stage,note,status,submitted_at) VALUES (` +
    [a.id, a.brand_name, a.category, a.contact_name, a.phone, a.email, a.pitch,
     a.preferred_zone || "", a.site || (DB.activeSite || "gondangdia"), a.booth,
     a.stage || "terkirim", a.note || "", a.stage || "review", a.submitted_at || ""].map(q).join(",") + ");"));

DB.schedule.forEach((it, i) =>
  out.push(`INSERT INTO schedule_items (event_id,day,start_time,end_time,type,stage,title_id,title_en,desc_id,desc_en,sort) VALUES (` +
    [e.id, e.date, it.time, it.endTime, it.type, it.stage, it.title.id, it.title.en, it.desc.id, it.desc.en, i].map(q).join(",") + ");"));

out.push("");
writeFileSync(join(root, "seed.sql"), out.join("\n"), "utf8");
console.log(`seed.sql dibuat: ${(DB.sites||[]).length} titik, ${DB.tenants.length} tenant, ${DB.stalls.length} lapak, ${DB.zones.length} zona, ${(DB.applications||[]).length} pendaftaran.`);