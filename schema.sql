-- =====================================================================
-- Titik Ngemil — Cloudflare D1 schema
-- Jalankan: wrangler d1 execute titik-ngemil-db --remote --file=./schema.sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL,
  name_id     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  theme_id    TEXT,
  theme_en    TEXT,
  event_date  TEXT NOT NULL,
  start_time  TEXT,
  end_time    TEXT,
  venue_id    TEXT,
  venue_en    TEXT,
  address     TEXT,
  city        TEXT,
  maps_url    TEXT,
  hashtag     TEXT,
  status      TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  name_id  TEXT NOT NULL,
  name_en  TEXT NOT NULL,
  icon     TEXT,
  color    TEXT,
  sort     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS zones (
  id        TEXT PRIMARY KEY,
  event_id  TEXT NOT NULL REFERENCES events(id),
  name_id   TEXT NOT NULL,
  name_en   TEXT NOT NULL,
  type      TEXT,               -- gate | stage | indoor | outdoor
  color     TEXT,
  blurb_id  TEXT,
  blurb_en  TEXT,
  pos_x     INTEGER, pos_y INTEGER, pos_w INTEGER, pos_h INTEGER,
  sort      INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stalls (
  code      TEXT PRIMARY KEY,
  event_id  TEXT NOT NULL REFERENCES events(id),
  zone_id   TEXT NOT NULL REFERENCES zones(id),
  label     TEXT,
  tenant_id INTEGER,            -- logical link ke tenants.id
  pos_x     INTEGER, pos_y INTEGER, pos_w INTEGER, pos_h INTEGER,
  status    TEXT DEFAULT 'available'  -- available | occupied | reserved
);

CREATE TABLE IF NOT EXISTS tenants (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  event_id    TEXT NOT NULL REFERENCES events(id),
  brand       TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  zone_id     TEXT REFERENCES zones(id),
  stall_code  TEXT REFERENCES stalls(code),
  tagline_id  TEXT, tagline_en TEXT,
  desc_id     TEXT, desc_en    TEXT,
  story_id    TEXT, story_en   TEXT,
  instagram   TEXT,
  whatsapp    TEXT,
  halal       INTEGER DEFAULT 1,
  tags        TEXT,
  status      TEXT DEFAULT 'published',  -- draft | review | published | rejected
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_slug  TEXT NOT NULL REFERENCES tenants(slug),
  name         TEXT NOT NULL,
  price        INTEGER NOT NULL DEFAULT 0,
  desc_id      TEXT, desc_en TEXT,
  photo        TEXT,
  is_signature INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  sort         INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id   TEXT NOT NULL REFERENCES events(id),
  day        TEXT,
  start_time TEXT,
  end_time   TEXT,
  type       TEXT,             -- opening | music | talk | workshop | quiz | other
  stage      TEXT,
  title_id   TEXT, title_en TEXT,
  desc_id    TEXT, desc_en  TEXT,
  speaker    TEXT,
  sort       INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_name     TEXT NOT NULL,
  category       TEXT,
  contact_name   TEXT,
  phone          TEXT,
  email          TEXT,
  pitch          TEXT,
  portfolio_url  TEXT,
  preferred_zone TEXT,
  status         TEXT DEFAULT 'review',  -- review | interview | accepted | rejected
  internal_notes TEXT,
  submitted_at   TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tenants_event   ON tenants(event_id);
CREATE INDEX IF NOT EXISTS idx_tenants_zone    ON tenants(zone_id);
CREATE INDEX IF NOT EXISTS idx_tenants_cat     ON tenants(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_tenant     ON menu_items(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_stalls_zone     ON stalls(zone_id);
CREATE INDEX IF NOT EXISTS idx_sched_event     ON schedule_items(event_id);
CREATE INDEX IF NOT EXISTS idx_apps_status     ON applications(status);