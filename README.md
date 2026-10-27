# 🍢 Titik Ngemil

**Pop-up market pedagang kaki lima (PKL) terkurasi** — dimulai di kawasan **Stasiun Gondangdia, Jakarta Pusat**.

> Website publik + Admin Dashboard + Database (Cloudflare D1), siap deploy ke **Cloudflare Pages** lewat Git (commit → otomatis live).

- **Event perdana:** Jumat, **30 Oktober 2026**, 14.00–22.00 WIB
- **Referensi gaya:** Brightspot Market (tenant terkurasi, zona bernama, gratis masuk)
- **Stack:** Static HTML/CSS/JS + Cloudflare Pages Functions + Cloudflare D1

---

## 📁 Struktur Proyek

```
titik_ngemil/
├─ public/                     # Situs statis (build output directory)
│  ├─ index.html               # Beranda
│  ├─ tentang.html             # Tentang / About (misi, cara kurasi, FAQ)
│  ├─ tenant.html              # Direktori tenant (filter kategori/zona + search)
│  ├─ tenant-detail.html       # Detail tenant (menu, harga, lapak, peta)
│  ├─ peta.html                # Peta lapak interaktif + tabel
│  ├─ jadwal.html              # Jadwal acara
│  ├─ kunjungan.html           # Kunjungan & transportasi
│  ├─ gabung.html              # Formulir pendaftaran tenant
│  ├─ partner.html             # Paket sponsor/partner
│  ├─ admin/                   # Admin Dashboard (index.html + admin.js)
│  ├─ assets/css/style.css     # Design system
│  ├─ assets/js/app.js         # App inti (i18n ID/EN, render, peta SVG)
│  └─ data/db.js               # ⭐ Dataset kanonik (juga sumber seed D1)
├─ functions/                  # Cloudflare Pages Functions (API)
│  ├─ _shared.js
│  └─ api/
│     ├─ _middleware.js        # CORS + error handling
│     ├─ event.js              # GET /api/event
│     ├─ tenants.js            # GET /api/tenants[?slug=]
│     ├─ zones.js              # GET /api/zones[?with=stalls]
│     ├─ stalls.js             # GET /api/stalls
│     ├─ schedule.js           # GET /api/schedule
│     ├─ applications.js       # POST (publik) / GET (admin) /api/applications
│     └─ admin/
│        ├─ _middleware.js     # Wajib admin token
│        └─ sync.js            # POST /api/admin/sync (push dataset ke D1)
├─ scripts/gen-seed.mjs        # Generate seed.sql dari public/data/db.js
├─ schema.sql                  # Skema tabel D1
├─ seed.sql                    # Data seed D1 (hasil generate)
├─ wrangler.toml               # Konfigurasi Cloudflare
└─ package.json
```

---

## 🚀 Deploy ke Cloudflare (commit → auto live)

### 1. Push ke GitHub

```bash
cd titik_ngemil
git init
git add .
git commit -m "feat: Titik Ngemil website + admin + D1"
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

Website publik sudah jalan tanpa database (data dari `data/db.js`). D1 diperlukan untuk **pendaftaran tenant** & **push data dari Admin**.

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

---

## 🛠️ Admin Dashboard

Akses: **`/admin/`** (mis. `https://titik-ngemil.pages.dev/admin/`).

- **Demo login:** masukkan kata sandi apa saja (mis. `admin`) — data dikelola di browser (localStorage).
- **Fitur:** kelola tenant & menu, zona & lapak, jadwal acara, inbox pendaftaran, pengaturan, dan **Export/Deploy**.

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
| GET | `/api/tenants` | – | Semua tenant + menu |
| GET | `/api/tenants?slug=...` | – | Satu tenant |
| GET | `/api/zones?with=stalls` | – | Zona (+ lapak) |
| GET | `/api/stalls` | – | Lapak + tenant penghuni |
| GET | `/api/schedule` | – | Jadwal acara |
| POST | `/api/applications` | – | Kirim pendaftaran tenant |
| GET | `/api/applications` | ✅ | Daftar pendaftaran |
| POST | `/api/admin/sync` | ✅ | Sinkron dataset ke D1 |

Auth admin: header `Authorization: Bearer <ADMIN_TOKEN>`.

---

## 🗄️ Model Data (ringkas)

`events` · `categories` · `zones` · `stalls` · `tenants` · `menu_items` · `schedule_items` · `applications`

- Satu **lapak (stall)** = satu **tenant** (1:1) pada event ini.
- Setiap field konten punya versi **ID** dan **EN** (bilingual).
- Detail lengkap: `schema.sql`.

---

## 📊 Ringkasan Data Saat Ini

- **5** zona tematik, **24** lapak, **24** tenant, **71** menu item, **7** item jadwal.
- Kategori: Kuliner, Minuman, Jajanan, Dessert, Non-Food.

---

## 📝 Catatan

- Bagian **flow/alur** pada dokumen perencanaan masih menunggu gambar dari owner.
- Konten tenant bersifat contoh (dummy) untuk keperluan perencanaan & demo.