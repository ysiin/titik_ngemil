# 🍢 Titik Ngemil

**Pop-up market PKL terkurasi** — titik perdana di **Lorong Srikaya, Gondangdia, Jakarta Pusat**.
Event perdana berlangsung **satu hari**: Jumat, **30 Oktober 2026**, 14.00–22.00 WIB. Titik lain masih berstatus **Coming Soon**.

> Website publik + 2 Dashboard (Tenant & Admin) + Database (Cloudflare D1), siap deploy ke **Cloudflare Pages** lewat Git (commit → otomatis live).

- **Event:** 1 acara, **1 hari** (Jumat, 30 Oktober 2026), 14.00–22.00 WIB
- **Titik:** 1 aktif (**Lorong Srikaya**, nama bisa diubah admin) + 3 Coming Soon
- **Booth:** 1 lorong, **24 booth** bernomor (B01–B24)
- **Referensi gaya:** Brightspot Market (tenant terkurasi, booth bernomor, gratis masuk)
- **Stack:** Static HTML/CSS/JS + Cloudflare Pages Functions + Cloudflare D1

---

## 🗺️ Peta Halaman (Route)

| Route | Halaman |
|---|---|
| `/` | Beranda (`#peta`, `#jadwal`, `#tenant`) |
| `/titik` | Indeks titik (1 aktif + 3 Coming Soon) |
| `/titik/gondangdia` | Hub titik aktif (nama tampilan: **Lorong Srikaya**) |
| `/titik/gondangdia/denah` | Denah booth interaktif, 24 booth (`?booth=7`) |
| `/menu` · `/menu?slug=` | Indeks menu · menu lengkap tenant |
| `/tenant` · `/tenant-detail?slug=` | Direktori tenant · detail tenant |
| `/daftar-tenant` | Form pendaftaran tenant (+ Simpan Draf) |
| `/daftar-tenant/status?id=` | Status verifikasi pendaftar |
| `/masuk` | Login tenant & admin |
| `/dashboard/tenant` | Dashboard tenant (toggle booth BUKA/TUTUP/HABIS) |
| `/dashboard/admin?tab=` | Dashboard admin (ringkasan, titik, persetujuan, slot, statistik) |
| `/jadwal` · `/kunjungan` · `/partner` · `/tentang` | Halaman pendukung |
| `/syarat` · `/privasi` · `/kontak` · `404` | Halaman statis & error |

> URL bersih (tanpa `.html`) — didukung Cloudflare Pages. File lama `peta.html` & `gabung.html` otomatis dialihkan ke route baru.

---

## 📁 Struktur Proyek

```
titik_ngemil/
├─ public/                        # Situs statis (build output directory)
│  ├─ index.html                  # Beranda
│  ├─ titik.html                  # Indeks titik
│  ├─ titik/gondangdia.html       # Hub titik aktif
│  ├─ titik/gondangdia/denah.html # Denah booth (?booth=N)
│  ├─ menu.html                   # Indeks & detail menu
│  ├─ tenant.html                 # Direktori tenant
│  ├─ tenant-detail.html          # Detail tenant
│  ├─ daftar-tenant.html          # Pendaftaran tenant
│  ├─ daftar-tenant/status.html   # Status pendaftaran
│  ├─ masuk.html                  # Login tenant & admin
│  ├─ dashboard/tenant.html       # Dashboard tenant
│  ├─ dashboard/admin.html        # Dashboard admin
│  ├─ tentang.html / jadwal.html / kunjungan.html / partner.html
│  ├─ syarat.html / privasi.html / kontak.html / 404.html
│  ├─ peta.html / gabung.html     # Redirect ke route baru
│  ├─ assets/css/style.css        # Design system
│  ├─ assets/js/app.js            # App inti (i18n ID/EN, render, denah SVG)
│  ├─ assets/js/admin.js          # Logika dashboard admin
│  ├─ assets/js/tenant-dash.js    # Logika dashboard tenant
│  └─ data/db.js                  # ⭐ Dataset kanonik (juga sumber seed D1)
├─ functions/                     # Cloudflare Pages Functions (API)
│  ├─ _shared.js
│  └─ api/
│     ├─ _middleware.js           # CORS + error handling
│     ├─ event.js                 # GET /api/event
│     ├─ sites.js                 # GET /api/sites
│     ├─ tenants.js               # GET /api/tenants[?slug=]
│     ├─ zones.js                 # GET /api/zones[?with=stalls]
│     ├─ stalls.js                # GET /api/stalls
│     ├─ schedule.js              # GET /api/schedule
│     ├─ applications/index.js    # POST (publik) / GET (admin) /api/applications
│     ├─ applications/[id].js     # PATCH keputusan admin
│     └─ admin/
│        ├─ _middleware.js        # Wajib admin token
│        └─ sync.js               # POST /api/admin/sync (push dataset ke D1)
├─ scripts/gen-seed.mjs           # Generate seed.sql dari public/data/db.js
├─ schema.sql                     # Skema tabel D1
├─ seed.sql                       # Data seed D1 (hasil generate)
├─ wrangler.toml                  # Konfigurasi Cloudflare
├─ docs/PERENCANAAN.md            # Dokumen perencanaan (termasuk flow asli)
└─ package.json
```

---

## 🚀 Deploy ke Cloudflare (commit → auto live)

### 1. Push ke GitHub

```bash
cd titik_ngemil
git init
git add .
git commit -m "feat: Titik Ngemil website + dashboard + D1"
git branch -M main
git remote add origin https://github.com/<username>/titik-ngemil.git
git push -u origin main
```

### 2. Sambungkan ke Cloudflare Pages

1. Buka **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Pilih repo `titik-ngemil`.
3. Isi **Build settings**:
   - **Framework preset:** `None`
   - **Build command:** *(kosongkan — tidak ada build step)*
   - **Build output directory:** `public`
4. **Save and Deploy.** Situs langsung live di `https://<nama>.pages.dev`.
   > Setiap `git push` ke `main` akan otomatis men-deploy ulang. ✅

### 3. (Opsional) Aktifkan Database D1

Website publik sudah jalan tanpa database (data dari `data/db.js`). D1 diperlukan untuk **pendaftaran tenant**, **status booth**, dan **push data dari Admin**.

```bash
# a. Buat database
npx wrangler d1 create titik-ngemil-db
#    → salin "database_id" yang muncul

# b. Buat tabel
npx wrangler d1 execute titik-ngemil-db --remote --file=./schema.sql

# c. Isi data awal
npx wrangler d1 execute titik-ngemil-db --remote --file=./seed.sql
```

**Bind ke Pages:** Dashboard → project → **Settings → Functions → D1 database bindings**
→ **Variable name: `DB`** → pilih database `titik-ngemil-db`.

**Set token admin:** Dashboard → **Settings → Environment variables**
→ tambah `ADMIN_TOKEN` = token rahasia pilihan kamu (Production).

### 4. Local development (opsional)

```bash
npm install
npm run dev            # wrangler pages dev public --d1=DB
# buka http://localhost:8788
```

> ⚠️ Di Windows, jika PowerShell memblokir `npm`, gunakan `npm.cmd` / `npx.cmd`.
> Jika `wrangler d1 execute --local` kehabisan memori, gunakan `--remote` atau `npx.cmd --yes wrangler@3`.

---

## 🛠️ Dashboard

### Dashboard Tenant — `/dashboard/tenant`
Login dulu di `/masuk` (pilih peran **Tenant**). Berisi: jadwal saya, profil & menu, status verifikasi, dan **toggle status booth BUKA / TUTUP / HABIS** yang tampil real-time di denah.

### Dashboard Admin — `/dashboard/admin`
Login dulu di `/masuk` (pilih peran **Admin**). Tab:
- **Ringkasan** — jumlah tenant, lapak, pendaftaran.
- **Titik** — ubah **nama titik** (ID & EN), kota, status (Aktif / Coming Soon), dan kapasitas booth. Perubahan langsung dipakai di beranda, halaman titik, denah, dan dashboard tenant.
- **Persetujuan** — keputusan **Setujui / Minta Revisi / Tolak** + catatan verifikasi lapangan.
- **Jadwal Rotasi & Slot** — hari event (Jumat), counter **`x/24 slot terisi`**, checklist "beroperasi hari ini" per tenant.
- **Tenant / Acara** — kelola konten.
- **Statistik** — estimasi pengunjung unik per titik.
- **Export / Deploy** — unduh `db.js`/`seed.sql` atau push ke API/D1.

> **Demo login:** sandi apa saja. Sesi & data dashboard disimpan di browser (localStorage) sehingga berfungsi tanpa D1.

### Alur update konten

| Cara | Langkah |
|---|---|
| **A. Lokal (tanpa D1)** | Edit di Admin → tab **Export/Deploy** → unduh `db.js` → timpa `public/data/db.js` → `git commit && git push` → Cloudflare deploy otomatis. |
| **B. API/D1** | Isi **API Base URL** + **Admin Token** di tab Pengaturan → tombol **Push ke API/D1** mengirim data ke `/api/admin/sync`. |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/event` | – | Info event |
| GET | `/api/sites` | – | Titik (multi-titik) + jumlah terisi |
| GET | `/api/tenants` | – | Semua tenant + menu + hari rotasi |
| GET | `/api/tenants?slug=...` | – | Satu tenant |
| GET | `/api/zones?with=stalls` | – | Zona (+ lapak) |
| GET | `/api/stalls` | – | Lapak + tenant penghuni + status booth |
| GET | `/api/schedule` | – | Jadwal acara |
| POST | `/api/applications` | – | Kirim pendaftaran tenant |
| GET | `/api/applications` | ✅ | Daftar pendaftaran |
| PATCH | `/api/applications/:id` | ✅ | Keputusan admin (setujui/revisi/tolak) |
| POST | `/api/admin/sync` | ✅ | Sinkron dataset ke D1 |

Auth admin: header `Authorization: Bearer <ADMIN_TOKEN>`.

---

## 🗄️ Model Data (ringkas)

`sites` · `events` · `categories` · `zones` · `stalls` · `tenants` · `tenant_days` · `menu_items` · `schedule_items` · `applications`

- Satu **lapak (stall)** = satu **tenant** (1:1) pada titik ini; booth bernomor **1–24**.
- **`tenant_days`** menyimpan pola rotasi (hari beroperasi tiap tenant).
- Status booth (`buka`/`tutup`/`habis`) tersimpan di `stalls.booth_status` & `tenants.booth_status`.
- Setiap field konten punya versi **ID** dan **EN** (bilingual).
- Detail lengkap: `schema.sql`.

---

## 📊 Ringkasan Data Saat Ini

- **4** titik (1 aktif **Lorong Srikaya** + 3 Coming Soon), **1** zona (lorong), **24** booth, **24** tenant, **24** entri hari operasional, **71** menu item, **7** item jadwal.
- Kategori: Kuliner, Minuman, Jajanan, Dessert, Non-Food.

---

## 📝 Catatan

- **QR check-in sengaja belum diaktifkan** karena titik berada di area stasiun (bukan venue khusus). Kolom statistik digital disiapkan untuk pengaktifan nanti.
- **Kuota booth: 24 lapak** per titik (disesuaikan dengan tenant yang ada).
- Konten tenant bersifat contoh (dummy) untuk keperluan perencanaan & demo.
- Alur/flow lengkap ada di [`docs/PERENCANAAN.md`](docs/PERENCANAAN.md) §6.