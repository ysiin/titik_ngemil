# 🍢 Titik Ngemil

**Pop-up market PKL terkurasi** — titik perdana di **Lorong Srikaya, Gondangdia, Jakarta Pusat**.
Event perdana berlangsung **satu hari**: Jumat, **30 Oktober 2026**, 14.00–22.00 WIB. Titik lain masih berstatus **Coming Soon**.

> Website publik + 2 Dashboard (Tenant & Admin) + Database (Cloudflare D1), siap deploy sebagai **Cloudflare Worker** lewat Git (commit → otomatis live).

- **Event:** 1 acara, **1 hari** (Jumat, 30 Oktober 2026), 14.00–22.00 WIB
- **Titik:** 1 aktif (**Lorong Srikaya**, nama bisa diubah admin) + 3 Coming Soon
- **Booth:** 1 lorong, **24 booth** bernomor (B01–B24)
- **Referensi gaya:** Brightspot Market (tenant terkurasi, booth bernomor, gratis masuk)
- **Stack:** Static HTML/CSS/JS + Cloudflare Worker (API) + Cloudflare D1

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

> URL bersih (tanpa `.html`) — didukung static assets Worker (`html_handling` bawaan). File lama `peta.html` & `gabung.html` otomatis dialihkan ke route baru.

---

## 📁 Struktur Proyek

```
titik_ngemil/
├─ public/                        # Static assets (HTML/CSS/JS)
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
├─ worker/                        # Cloudflare Worker (API + static assets)
│  ├─ index.js                    # Router /api/* + fallback ke ASSETS
│  └─ _shared.js                  # Helper: json/err/CORS, auth admin, row mapper
├─ scripts/gen-seed.mjs           # Generate seed.sql dari public/data/db.js
├─ schema.sql                     # Skema tabel D1
├─ seed.sql                       # Data seed D1 (hasil generate)
├─ wrangler.toml                  # Konfigurasi Cloudflare
├─ docs/PERENCANAAN.md            # Dokumen perencanaan (termasuk flow asli)
└─ package.json
```

---

## 🚀 Deploy ke Cloudflare (commit → auto live)

> Repo: **https://github.com/ysiin/titik_ngemil** — branch `main` sudah berisi kode siap deploy.

### 1. Push perubahan

Repo sudah terhubung ke GitHub. Setelah mengubah kode:

```bash
git add -A
git commit -m "pesan perubahan"
git push
```

### 2. Sambungkan ke Cloudflare Worker

Repo ini adalah **Worker + static assets**, jadi deploy command **default**
(`npx wrangler deploy`) langsung dipakai — tidak ada yang perlu diubah.

1. Buka **Cloudflare Dashboard → Workers & Pages → Create application**.
2. Pilih **Import a repository** (bagian **Workers**, bukan tab Pages).
3. Pilih repo `titik-ngemil`, branch `main`.
4. Build command: **kosongkan**. Deploy command: biarkan **`npx wrangler deploy`**.
5. **Save and Deploy.** Situs live di `https://titik-ngemil.<akun>.workers.dev`.

> Setiap `git push` ke `main` otomatis deploy ulang. ✅
> `wrangler.toml` mengatur semuanya: `main = worker/index.js` untuk API dan
> `[assets] directory = "./public"` untuk seluruh halaman.

Nama Worker di `wrangler.toml` (`name = "titik-ngemil"`) harus sama dengan nama
project di dashboard. Kalau project kamu bernama lain, ubah baris itu lalu push.

### 3. Buat database D1 + isi data

D1 dipakai untuk **pendaftaran tenant**, **status booth**, dan **push data dari Admin**.
Situs publik tetap jalan tanpa D1 (data dibaca dari `public/data/db.js`).

**Cara A — lewat dashboard (tanpa install apa pun):**

1. **Cloudflare Dashboard → Storage & Databases → D1 SQL Database → Create**
   - Name: `titik-ngemil-db`
2. Buka database itu → tab **Console**, lalu tempel isi `schema.sql` → **Execute**.
3. Ulangi: tempel isi `seed.sql` → **Execute**.
4. Cek: jalankan `SELECT COUNT(*) FROM tenants;` → harus **24**.

**Cara B — lewat terminal:**

```bash
npx.cmd wrangler d1 create titik-ngemil-db   # salin database_id yang muncul
npx.cmd wrangler d1 execute titik-ngemil-db --remote --file=./schema.sql
npx.cmd wrangler d1 execute titik-ngemil-db --remote --file=./seed.sql
```

### 4. Hubungkan D1 ke Worker

**Worker project → Settings → Bindings → Add → D1 database**

| Field | Isi |
|---|---|
| Variable name | `DB` |
| D1 database | `titik-ngemil-db` |

Lalu **Settings → Variables and Secrets → Add**:

| Name | Value |
|---|---|
| `ADMIN_TOKEN` | token rahasia buatan kamu (dipakai tombol "Push ke API" di admin) |

Setelah binding disimpan, **redeploy** (Deployments → ⋯ → Retry deployment) agar binding aktif.

> Alternatif: buka komentar blok `[[d1_databases]]` di `wrangler.toml` lalu isi
> `database_id`, dan taruh `ADMIN_TOKEN` di `[vars]`. Perubahan via file ikut
> ter-deploy otomatis, tanpa perlu setting manual di dashboard.

### 5. Cek hasilnya

- `https://titik-ngemil.<akun>.workers.dev/api/sites` → JSON berisi 4 titik.
  Kalau muncul `Database D1 belum terhubung` → binding `DB` belum aktif.
- Kirim formulir di `/daftar-tenant` → lalu cek `SELECT COUNT(*) FROM applications;` bertambah.

### 6. Troubleshooting

**`[ERROR] It looks like you've run a Workers-specific command in a Pages project`**

Error ini muncul kalau project dibuat sebagai **Pages**, padahal repo ini Worker.
Sejak migrasi ke Worker, `npx wrangler deploy` adalah perintah yang benar.

Perbaikan: pastikan project dibuat lewat **Workers → Import a repository**,
bukan **Pages → Connect to Git**. Kalau project yang ada bertipe Pages, hapus
lalu buat ulang sebagai Worker (nama project dipakai bersama, jadi harus dihapus dulu).

**`The version of Wrangler you are using is now out-of-date`**
Sudah tidak muncul: `package.json` memakai `wrangler ^4`, dan Workers Builds
memakai versi dari `package.json`.

**`Could not detect a directory of static assets` / `[assets] directory not found`**
Pastikan folder `public/` ada di root repo (bukan dipindah), dan `main` menunjuk
ke `worker/index.js`.

### 7. Local development (opsional)

```bash
npm.cmd install
npm.cmd run dev        # wrangler dev — Worker + static assets
# buka http://localhost:8787
```

> ⚠️ PowerShell di mesin ini memblokir `npm`/`npx` (ExecutionPolicy `Restricted`), jadi **pakai `npm.cmd` / `npx.cmd`**.
> Untuk preview tanpa wrangler: `npm.cmd run dev:static` (API `/api/*` balas 501, sisanya normal).

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