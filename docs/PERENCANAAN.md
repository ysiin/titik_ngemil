# Titik Ngemil — Perencanaan Awal

> Pop-up market terkurasi untuk pedagang kaki lima (PKL), dimulai di kawasan Stasiun Gondangdia, Jakarta Pusat.
> Referensi pola: Brightspot Market (tenant terkurasi, zona bernama, gratis masuk, satu sistem pembayaran).
> Status dokumen: **draft awal v0.1** — bagian bertanda `TBD` menunggu detail tambahan dari owner.

---

## 1. Ringkasan Konsep

**Titik Ngemil** adalah pasar pop-up dadakan yang **merapikan PKL** di spot yang sehari-hari memang sudah jadi titik jualan PKL, tapi belum tertata. Alih-alih menertibkan dan mengusir, Titik Ngemil **mengkurasi, menata, dan mengangkat** mereka: lapak ditata rapi, tenant dikurasi, brand dibuat lebih menarik, dan pengunjung datang karena pengalamannya menyenangkan.

**Pembeda utama dari Brightspot:**
- Brightspot = brand retail/fashion lokal terkurasi di mall/venue premium.
- Titik Ngemil = **PKL (kuliner & jajanan) di ruang publik nyata** (trotoar, area transit, taman) → dampak sosial lebih kuat, bukan sekadar festival jualan.

**Nilai jual (value proposition):**
- Untuk PKL: tempat aman, tertata, legal-ish, penghasilan lebih stabil, brand diangkat.
- Untuk pengunjung: pengalaman kuliner jalanan yang rapi, bersih, terkurasi, gampang dicari.
- Untuk pemerintah/kawasan: mengurangi kesemrawutan, mengangkat citra kawasan transit (contoh: penataan Stasiun Gondangdia oleh Pemprov DKI + KCI).
- Untuk sponsor/partner: platform dampak sosial + visibility.

**Model bisnis tenant:** sewa lapak per tenant dengan tarif **ramah UMKM** (bukan bagi hasil). Detail tarif: *TBD* — perlu penetapan paket (mis. harian vs paket event, dengan tier ukuran lapak). Prinsip: hasil sewa menutup biaya operasional + konsumsi event; bukan mencari margin besar dari PKL.

**Kenapa Gondangdia (tahap awal):**
- Kawasan dengan volume PKL tinggi & sejarah panjang penertiban (PKL, Lokbin, penataan trotoar oleh Pemprov DKI & PT KAI/KCI).
- Titik transit (KRL Gondangdia) → traffic tinggi, akses transportasi publik mudah.
- Ada ruang publik pendukung: Taman Cut Meutia, pedestrian plaza, area transit.
- Narasi "menata PKL agar rapi & tidak kumuh" sudah sejalan dengan agenda Pemprov DKI → potensi kolaborasi.

---

## 2. Positioning & Branding

| Item | Usulan |
|---|---|
| Nama | **Titik Ngemil** |
| Tagline (ID) | "Titik-titik jajan, kini tertata." *(alternatif: "Rapi, enak, jadi cerita.")* |
| Tagline (EN) | "Snack spots, neatly curated." |
| Karakter brand | Hangat, lokal, ramah, rapi, bukan mewah/menakutkan |
| Nada bicara | Akrab, tidak korporat-kaku; bangga sama PKL |
| Logo/identitas | Belum ada — perlu sesi desain (ikon "titik/pin" + elemen jajan) |

**Prinsip pengalaman:** pengunjung harus merasa ini "jajan street food tapi rapi" — bukan "mall." Jangan sampai terasa steril atau mengancam PKL.

---

## 2.5 Detail Event Perdana

| Item | Detail |
|---|---|
| Edisi | #1 (perdana) |
| Hari/Tanggal | **Jumat, 30 Oktober 2026** |
| Durasi | 1 hari |
| Lokasi | Kawasan **Stasiun Gondangdia**, Menteng, Jakarta Pusat |
| Model | Sewa lapak, tarif ramah UMKM |
| Jam buka | **14.00 – 22.00 WIB** — lihat catatan di bawah |
| Puncak ramai | 16.30 – 19.30 WIB (pulang kerja + makan malam) |

**Catatan penentuan jam (mengikuti pola traffic Gondangdia):**
- **Pagi 06.00–09.00**: peak commuter KRL ke kantor → *sesi jajanan sarapan*, tapi risikonya berebut ruang dengan alur commuter & area transit.
- **Siang 11.30–13.30**: lonjakan makan siang pekerja sekitar (kawasan perkantoran Menteng/Jl. Srikaya).
- **Sore–malam 16.30–21.00**: onset commuter pulang + warga sekitar cari jajan/makan malam → **ini jam paling potensial untuk event pop-up.**

**Rekomendasi final (opsi):**
- **Opsi A – "Ngemil Sore" (rekomendasi utama):** 14.00–22.00 WIB dalam satu blok, dengan *peak setup* tenant siap 15.30 sebelum arus pulang kantor. Paling simpel (1 shift), jam pulang kantor tertangkap, jajanan malam tetap kebuka, dan risiko bentrok alur commuter pagi lebih rendah.
- **Opsi B – Dua sesi:** Pagi 06.00–09.00 (sarapan) + Sore 16.00–21.00 (makan malam). Traffic lebih besar total, tapi butuh 2× setup/bongkar → lebih berat untuk PKL dan tim.
- **Opsi C – "Maraton":** 11.00–22.00, satu blok panjang. Menutup siang sampai malam sekaligus, tapi tuntutan stamina PKL tinggi & biaya operasional naik.

→ Usulan: mulai dengan **Opsi A**, evaluasi di event berikutnya. (Final: *TBD*, menunggu konfirmasi owner.)

**Dampak timeline:** event hanya **3 hari dari sekarang (27 → 30 Okt 2026)**. Lihat §8 Roadmap — perlu penyesuaian strategi "barengan vs bertahap".

---

## 3. Struktur Website (Information Architecture)

Bilingual: **ID (default) + EN**. Struktur URL: `/id/...` dan `/en/...`.

### 3.1 Halaman Publik

1. **Home**
   - Hero: nama event, tanggal, lokasi, CTA ("Lihat Tenant", "Cara ke Lokasi").
   - Highlight: jumlah tenant, kategori, zona.
   - Cuplikan tenant unggulan / "Tenant Pilihan".
   - Preview peta lapak.
   - Cuplikan jadwal acara (musik, talkshow, workshop).
   - Info kunjungan singkat + jam buka.
   - CTA sponsor/partner & "Daftar jadi Tenant".

2. **Tentang / About**
   - Cerita & misi (angkat PKL jadi naik kelas).
   - Cara kerja kurasi.
   - Dampak sosial (angka target: tenant, lapak, estimasi pengunjung).
   - Tim & status entitas (PT/startup).
   - Kolaborator (Pemprov DKI, KCI/KAI, sponsor).

3. **Tenant Directory** (halaman inti)
   - Kartu tenant: logo/foto, nama, kategori, zona/lapak.
   - **Filter**: kategori (Kuliner/Minuman/Snack/Non-Food), zona, kata kunci.
   - Search bar.
   - Grid responsif.

4. **Detail Tenant** (`/tenant/[slug]`)
   - Nama, deskripsi (ID/EN), cerita PKL-nya (opsional & powerful).
   - Foto galeri.
   - **Menu & harga** (list item, harga, tanda "signature").
   - Zona + nomor lapak + tombol "Lihat di Peta".
   - Sosial media / kontak.
   - Tenant lain di zona yang sama (rekomendasi).

5. **Peta Lapak** (`/peta`)
   - **Peta interaktif**: denah visual, klik lapak → popup tenant + menu.
   - **Tabel data**: daftar lengkap (Tenant | Kategori | Zona | No. Lapak), searchable & sortable.

6. **Jadwal Acara** (`/jadwal`)
   - Per hari & per jam.
   - Jenis: musik, talkshow, workshop, bazar khusus.

7. **Kunjungan / Visit** (`/kunjungan`)
   - Jam buka per hari.
   - Alamat + Google Maps embed.
   - Akses transportasi: KRL Gondangdia, TransJakarta, ojol, parkir.
   - Tata tertib & tips.

8. **Daftar jadi Tenant** (`/gabung`)
   - Formulir pendaftaran tenant.
   - Syarat & kriteria kurasi.
   - Timeline seleksi & FAQ.

9. **Sponsor / Partner** (`/partner`)
   - Paket sponsorship (tier).
   - Kontak partnership.

10. **FAQ** & **Kontak** (`/faq`, `/kontak`)
    - Pertanyaan umum pengunjung & calon tenant.

11. **Halaman pendukung**: Privacy Policy, Terms, 404.

### 3.2 Admin Dashboard

Dipakai oleh tim Titik Ngemil untuk kelola konten tanpa developer.

- **Auth & role**: super admin, editor, kurator (viewer-only untuk approve).
- **Modul Tenant**: CRUD tenant, upload logo/foto, status (draft/published/rejected), field bilingual.
- **Modul Menu**: CRUD menu per tenant (nama, harga, foto, signature).
- **Modul Zona & Lapak**: buat zona, nomor lapak, atur posisi di denah peta (koordinat/shape), assign tenant ke lapak.
- **Modul Event**: tanggal, jam buka, tema, status aktif/arsip.
- **Modul Jadwal Acara**: CRUD item acara per hari/jam/stage.
- **Modul Pendaftaran**: lihat aplikasi tenant, ubah status (review → interview → accepted → rejected), catatan internal.
- **Modul Media**: library gambar.
- **Modul Pengaturan**: konten umum, kontak, link sosial, analytics ID.
- **Dukungan bilingual**: input ID + EN per field (dengan fallback).
- **Audit log** dasar (siapa mengubah apa).

---

## 4. Model Data (usulan skema)

```
Event        (id, slug, name_id, name_en, theme, start_date, end_date,
              hours[], location, maps_url, status, hero_image)

Zone         (id, event_id, name_id, name_en, type[outdoor/indoor],
              color, map_svg_ref, order)

StallLapak   (id, event_id, zone_id, code, label, tenant_id(nullable),
              x, y, w, h, shape, capacity, status)

Tenant       (id, event_id, brand_name, slug, category_id, subcategory,
              description_id, description_en, story_id, story_en,
              logo, photos[], instagram, whatsapp, status, stall_id)

Category     (id, name_id, name_en, icon, order)

MenuItem     (id, tenant_id, name, price, description_id, description_en,
              photo, is_signature, is_available, order)

ScheduleItem (id, event_id, day, start_time, end_time, title_id, title_en,
              description_id, description_en, type, stage, speaker)

Application  (id, brand_name, contact_name, phone, email, category,
              pitch, portfolio_url, status, internal_notes, submitted_at)

Media        (id, url, alt_id, alt_en, type, uploaded_by)

User         (id, name, email, role, last_login)
AuditLog     (id, user_id, action, entity, entity_id, diff, created_at)
```

Catatan: setiap entitas konten memiliki field `_id` dan `_en` untuk bilingual. `StallLapak` menyimpan posisi untuk peta interaktif (denah disimpan sebagai SVG/koordinat relatif).

---

## 5. Rekomendasi Tech Stack

Kebutuhan: situs publik cepat + SEO + bilingual + **admin dashboard** + peta interaktif + CRUD data.

**Rekomendasi utama (yang DIIMPLEMENTASIKAN):**
- **Static HTML/CSS/JS** untuk situs publik — tanpa build step, deploy instan ke Cloudflare Pages, SEO-friendly.
- **Cloudflare Pages Functions** untuk API (`/functions/api/*`).
- **Cloudflare D1** (SQLite) sebagai database.
- **Admin Dashboard** client-side (`/admin/`) dengan opsi sinkron ke D1.

**Alternatif (untuk pengembangan lanjutan):**
- **Astro + Directus/Strapi** — situs ringan, admin terpisah.
- **Next.js + Payload CMS + Postgres** — bila butuh CMS penuh, RBAC, media library, audit log.

**Keputusan:** untuk kebutuhan event 30 Okt 2026 (3 hari), dipilih stack Cloudflare-native di atas
karena paling cepat live, tanpa build, dan sudah termasuk database + admin.

---

## 6. Flow / Alur Pengguna

> Sumber: **`Disinting Kel 5.png`** (ditemukan & dibaca). Gambar adalah **sitemap + flow lengkap**.
> Isi di bawah adalah hasil ekstraksi. Tanda ⚠️ = bagian yang perlu konfirmasi (kemungkinan OCR kurang presisi).

### 6.1 Peta Halaman (Route)

| Route | Halaman |
|---|---|
| `/` | Beranda (section: `#peta`, `#jadwal`, `#tenant`) |
| `/titik` | Indeks Titik (opsional) |
| `/titik/gondangdia` | Hub Titik Aktif |
| `/titik/gondangdia/denah` | Denah Booth |
| `/titik/gondangdia/hari-ini` | Titik Hari Ini (QR check-in) |
| `/menu` | Indeks Menu (opsional) |
| `/menu/slug` | Menu Lengkap Tenant |
| `/q/kode` | Validasi QR (redirect) |
| `/daftar-tenant` | Form Pendaftaran Tenant |
| `/daftar-tenant/status/id` | Status Verifikasi Pendaftar |
| `/masuk` | Login Tenant & Admin |
| `/dashboard/tenant` | Dashboard Tenant |
| `/dashboard/admin` | Dashboard Admin |
| `/dashboard/admin/persetujuan` | Persetujuan Tenant |
| `/dashboard/admin/jadwal` | Jadwal Rotasi & Slot |
| `/dashboard/admin/statistik` | Statistik Pengunjung |
| `/tentang` | Tentang Kami |
| `/syarat` | Syarat & Ketentuan |
| `/privasi` | Kebijakan Privasi |
| `/kontak` | Kontak Pengelola |
| `404` | Halaman tidak ditemukan |

### 6.2 Flow Pengunjung (dengan QR check-in anonim)

```
/titik/gondangdia/hari-ini
      │
   Banner privasi ──▶ /privasi
      │
   Scan QR di lokasi ──▶ /q/kode
      │
   Validasi kode di server
      ├── Kedaluwarsa ──▶ State 3: QR kedaluwarsa ──▶ Scan ulang QR
      └── Valid
            │
         "Loading: mencatat kunjungan anonim"
            │
         Pencatatan berhasil?
            ├── Tidak ──▶ Banner gagal: "Kunjungan belum tercatat" ──▶ [Coba lagi]
            └── Ya ──▶ Toast: "Kunjungan tercatat (anonim)" (hilang 3 detik)
                        │
                   Konten lengkap: denah + daftar tenant
                        │
                   /titik/gondangdia/denah
                        ├── Klik booth ──▶ Panel booth ?booth=04
                        │                     ├── Lihat Menu Lengkap ──▶ /menu/slug
                        │                     ├── Petunjuk Arah (Google Maps, tab baru)
                        │                     └── Kembali ke daftar tenant ──▶ /titik/gondangdia
                        └── Lihat jadwal hari ini
```
Tersedia juga: **"Lanjut tanpa mencatat / Browse saja"** → konten tampil tanpa pencatatan.

### 6.3 Flow Beranda (Pengunjung)

- **Hero**: chip kategori atau cari (search) di hero.
- Scroll ke **Peta Titik** (`#peta`) → "Lihat Denah Lapak" → Titik Gondangdia (aktif) → `/titik/gondangdia/denah`.
- Scroll ke **Tenant** (`#tenant`) → preview hasil; "Lihat semua 16 tenant"; **"Tampilkan 8 kartu berikutnya"** (load more, halaman sama).
- Tab titik: **Gondangdia aktif**; **"3 Titik Lain (pending)"** tidak bisa diklik (badge Pending).
- **Hari**: "Hari aktif Senin–Sabtu"; **"Minggu (libur)"** tidak bisa diklik.
- Scroll ke **Jadwal** (`#jadwal`).
- Tenant card → "Lihat Menu (kartu)" → `/menu/slug`; "Lihat di Peta (kartu aktif)".

### 6.4 Flow Calon Tenant (Pendaftaran → Verifikasi)

```
Tombol "Daftar Tenant" (navbar, CTA Beranda, footer)
      │
   /daftar-tenant  ──[Simpan Draf]
      │
   Data wajib lengkap + checkbox S&K dicentang?
      ├── Tidak ──▶ (tetap di form / validasi)
      └── Ya ──▶ Kirim pendaftaran ──▶ /daftar-tenant/status/id
                    │
                 Stage: Terkirim
                    │
                 Stage: Ditinjau pengelola
                    │
                 Stage: Verifikasi (catat hasil verifikasi lapangan)
                    │
                 Keputusan admin
                    ├── Disetujui ──▶ Status: Disetujui (nomor booth, titik, hari)
                    ├── Tolak     ──▶ Status: Ditolak (alasan ditampilkan) ──▶ Hubungi Pengelola /kontak
                    └── Minta Revisi ──▶ Status: Perlu revisi ──▶ tombol "Perbaiki Data" ──▶ /daftar-tenant
```

### 6.5 Flow Dashboard Tenant

```
/masuk (login tenant)
   ├── Login gagal ──▶ tampilkan error
   └── Berhasil ──▶ /dashboard/tenant
        ├── Jadwal saya
        ├── Profil & menu
        ├── Status verifikasi
        └── Toggle status booth: BUKA / TUTUP / HABIS
              └── Tampil real-time di /titik/gondangdia & denah
Guard: akses /dashboard/tenant tanpa login ──▶ Redirect /masuk
```

### 6.6 Flow Dashboard Admin

```
/masuk (login admin)
   └── /dashboard/admin
        ├── Ringkasan (jumlah menunggu persetujuan)
        ├── Persetujuan Tenant
        │     ├── Catat hasil verifikasi lapangan
        │     └── Keputusan: Setujui / Tolak / Minta Revisi
        ├── Jadwal Rotasi & Slot
        │     ├── Pilih titik dan hari
        │     ├── Slot terisi x/16 booth
        │     ├── Isi nomor booth, titik, dan hari
        │     └── Ubah Pola Rotasi
        ├── Statistik Pengunjung
        │     ├── Estimasi pengunjung unik per titik dan hari
        │     ├── Jam ramai
        │     └── Digital (QR) vs hitungan manual
        ├── Pengaturan QR
        │     ├── Generate QR dinamis per titik (per jam atau per hari)
        │     └── Cetak dan tempel di lokasi
        └── Keluar
```

### 6.7 Konsep Kunci (yang membedakan dari asumsi awal)

1. **QR check-in anonim** untuk statistik pengunjung (privasi dijaga, ada opsi tanpa pencatatan).
2. **Multi-titik**: Gondangdia aktif + 3 titik lain berstatus *pending*.
3. **Rotasi PKL per hari**: hari aktif Senin–Sabtu, Minggu libur; tiap titik punya kuota (contoh 16 booth) yang berubah per hari.
4. **Booth** sebagai unit: `?booth=04`, panel booth, status booth (BUKA/TUTUP/HABIS) yang diubah tenant & tampil real-time.
5. **Dua dashboard** (tenant & admin) dengan login + guard.
6. **Alur verifikasi pendaftaran** berjenjang (Terkirim → Ditinjau → Verifikasi → Keputusan).

> ⚠️ **Perlu konfirmasi owner:** (a) angka kuota booth final per titik (contoh di gambar: 16), (b) pola rotasi pastinya (berapa tenant per hari), (c) apakah "3 titik lain" sudah difinalkan namanya, (d) apakah statistik pengunjung wajib berfungsi (butuh backend) atau cukup simulasi.

---

## 7. Zonasi & Tata Lapak (FINAL untuk event #1)

Mengikuti pola Brightspot (zona bernama, bukan sekadar nomor kios). **Sudah diimplementasikan:**

| Zona | Tipe | Isi | Jumlah Lapak |
|---|---|---|---|
| **Pintu Gondangdia** | gate | Gerbang masuk & titik temu; kopi, minuman, merchandise | 4 (A01–A04) |
| **Panggung Ngemil** | stage | Musik, talkshow, workshop (non-jualan) | – |
| **Lorong Srikaya** | indoor | Jalur kuliner utama, porsi berat | 6 (B01–B06) |
| **Taman Cut Meutia** | outdoor | Area terbuka untuk jajan santai | 8 (C01–C08) |
| **Pelataran Transit** | outdoor | Dekat area transit & drop off | 6 (D01–D06) |

Total: **5 zona, 24 lapak, 24 tenant (1 lapak = 1 tenant).**

---

## 7.5 Status Implementasi

| Komponen | Status |
|---|---|
| 8 halaman publik (Home, Tentang, Tenant, Detail Tenant, Peta, Jadwal, Kunjungan, Gabung, Partner) | ✅ Selesai |
| Bilingual ID/EN (toggle, tersimpan di browser) | ✅ Selesai |
| Peta lapak interaktif (SVG, klik → popup tenant) + tabel | ✅ Selesai |
| Admin Dashboard (tenant, menu, zona, lapak, jadwal, pendaftaran, export) | ✅ Selesai |
| Database D1 (schema + seed + 9 endpoint API) | ✅ Selesai |
| Deploy: Cloudflare Pages via Git (commit → auto live) | ✅ Siap |
| Gambar flow `Disinting Kel 5.png` | ⏳ Belum diterima |

---

## 8. Roadmap Bertahap

> ⚠️ **Realitas waktu:** event perdana **Jumat, 30 Okt 2026**, sementara hari ini **27 Okt 2026** → sisa **~3 hari kerja**. Website full (CMS + admin + peta interaktif) **tidak realistis** selesai dalam 3 hari. Karena itu roadmap di bawah punya dua jalur.

### Jalur A — Sprint 3 hari (buat event 30 Okt)

Target minim tapi cukup buat peluncuran: **microsite statis + data tenant**.

- **Hari 1 (27 Okt, hari ini):** kunci konsep, daftar tenant awal, kumpulkan aset (logo/foto/menu), finalisasi jam & layout zona. Set up repo + Next.js/Astro skeleton.
- **Hari 2 (28 Okt):** bangun Home, Tenant Directory, Detail Tenant, Kunjungan (soft-code data JSON), bilingual ID/EN dasar. Isi data tenant yang sudah fix.
- **Hari 3 (29 Okt):** finishing, responsif, SEO dasar, deploy (Vercel). Buffer untuk perbaikan data jam-jaman.
- **30 Okt:** event kick-off. Website versi "live info" sudah jalan; update real-time manual kalau ada perubahan.

**Ditunda ke pasca-event:** CMS/admin dashboard, peta interaktif, form pendaftaran online, jadwal acara detail, sponsor page.

### Jalur B — Build penuh (pasca event perdana)

Setelah event, bangun versi lengkap bertahap:

- **Fase 1 — MVP statis (yang jalan di event) dipermanenkan.** Rapikan & lengkapi.
- **Fase 2 — CMS & Admin Dashboard (2–4 minggu).** Payload/Supabase, model data, role, migrasi data.
- **Fase 3 — Peta Interaktif & Pendaftaran (2–3 minggu).** Denah lapak + tabel, form pendaftaran tenant + verifikasi, jadwal acara, sponsor.
- **Fase 4 — Iterasi & Ekspansi.** Evaluasi event #1, siapkan event ke-2 di titik/stasiun lain.

### Fase 0 — Discovery & Brand (paralel, dipadatkan)
- Finalisasi tagline, identitas visual minimum (logo teks + palet warna).
- Pastikan koordinasi lokasi Gondangdia (izin pemakaian ruang / pengelola / KCI).
- Tentukan tech stack final (idealnya diputuskan Hari 1).

---

## 9. Metrik Keberhasilan (usulan)

- **Dampak PKL**: jumlah tenant terkurasi, kenaikan omzet rata-rata tenant, jumlah tenant yang lanjut.
- **Pengunjung**: kunjungan situs, view tenant, klik "cara ke lokasi", jumlah hadir.
- **Digital**: halaman populer, pencarian teratas, konversi pendaftaran tenant.
- **Kemitraan**: sponsor terekrut, kolaborasi pemerintah.

---

## 10. Pertanyaan Terbuka

1. **Gambar flow** — belum ditemukan di folder (folder kosong). Perlu disimpan ulang / dikasih path.
2. Skala tenant event #1: berapa tenant target untuk 30 Okt? (usulan realistis perdana: **15–25 tenant**, 4–5 zona)
3. **Tarif sewa** — angka final per lapak (usulan: paket harian terjangkau, mis. tier kecil/sedang/besar).
4. Koordinasi lokasi: apakah sudah ada izin/persetujuan pemakaian ruang di Gondangdia (pengelola/KCI/Pemprov)?
5. Apakah butuh sistem pembayaran terpusat (cashless) untuk event #1, atau biarkan masing-masing tenant?
6. Domain & nama resmi situs (mis. titikngemil.id)?
7. Sponsor: apakah ada target sponsor untuk event #1, atau murni dari hasil sewa?

**Sudah terjawab:**
- ✅ Tanggal event perdana: **Jumat, 30 Okt 2026**.
- ✅ Model bisnis: **sewa lapak ramah UMKM** (bukan bagi hasil).
- ✅ Bahasa: **bilingual ID + EN**.
- ✅ Admin dashboard: **ya, diperlukan**.
- ✅ Peta lapak: **peta interaktif + tabel**.
- ✅ Entitas: **startup/PT sendiri**.
- ✅ Tech: **Next.js/Astro** (final: *TBD*, lihat §5).

---

## 11. Langkah Selanjutnya

- [ ] Simpan ulang **gambar flow** ke `D:\Tugas Kuliah\desting\titik_ngemil` → isi §6.
- [ ] Konfirmasi **jam buka final** (usulan Opsi A: 14.00–22.00 WIB).
- [ ] Tetapkan **jumlah & daftar tenant awal** + zona.
- [ ] Tetapkan **tech stack final** + set up repo.
- [ ] Mulai Sprint 3 hari (Jalur A, §8) untuk mengejar 30 Okt.
- [ ] Setelah keluar dari Plan mode, pindahkan dokumen ini ke `D:\Tugas Kuliah\desting\titik_ngemil`.

---

## 12. Risiko & Catatan

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Waktu cuma 3 hari ke event | Website penuh mustahil | Fokus microsite statis; CMS/peta pasca-event |
| Izin lokasi belum jelas | Event bisa dibatalkan/ditertibkan | Konfirmasi ke pengelola/KCI/Pemprov hari ini |
| Data tenant belum lengkap (foto/menu) | Web terasa kosong | Template placeholder + update jam-jaman |
| Cuaca (Jumat sore bisa hujan) | Kunjungan turun | Siapkan tenda/area beratap; info cuaca di web |
| Aktivitas commuter peak | Ruang sempit & risiko komplain | Atur zona tidak menutup alur utama transit |