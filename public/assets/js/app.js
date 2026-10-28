/* =====================================================================
   Titik Ngemil — App core
   ===================================================================== */
(function () {
  "use strict";

  var DB = window.TITIK_DB || { event: {}, sites: [], days: [], categories: [], zones: [], stalls: [], tenants: [], applications: [], schedule: [] };
  var LS_LANG = "tn_lang";
  var LS_APP = "tn_applications";

  /* ---------------- i18n ---------------- */
  var STRINGS = {
    id: {
      nav_home: "Beranda", nav_about: "Tentang", nav_tenants: "Tenant", nav_map: "Peta Lapak",
      nav_sites: "Titik", nav_denah: "Denah Booth", nav_login: "Masuk",
      nav_schedule: "Acara", nav_visit: "Kunjungan", nav_join: "Gabung", nav_partner: "Partner",
      hero_eyebrow: "Pop-up market PKL terkurasi",
      hero_title: "Titik jajan favorit warga, kini <span>tertata rapi</span>.",
      hero_sub: "Titik Ngemil merangkul pedagang kaki lima di sekitar Stasiun Gondangdia — dikurasi, ditata, dan diangkat jadi pengalaman jajan yang nyaman. Event perdana: satu hari, satu lorong, 24 booth.",
      cta_explore: "Jelajahi Tenant", cta_visit: "Cara ke Lokasi",
      stat_tenants: "Tenant terkurasi", stat_stalls: "Lapak tertata", stat_zones: "Zona tematik",
      stat_sites: "Titik aktif",
      detail_event: "Detail Acara",
      featured: "Tenant Pilihan", featured_sub: "Cicipi dulu yang paling dicari pengunjung.",
      view_all: "Lihat semua tenant",
      zones_title: "Zona Ngemil", zones_sub: "Satu lorong, 24 booth bernomor — semua tenant ada di sini.",
      map_title: "Peta Lapak", map_sub: "Klik lapak di denah untuk lihat tenant-nya.",
      schedule_title: "Jadwal Acara", schedule_sub: "Musik, talkshow, dan workshop di satu hari event.",
      visit_title: "Kunjungi Kami", visit_sub: "Akses gampang, dekat transportasi publik.",
      partner_title: "Jadi Partner / Sponsor", partner_sub: "Dukung PKL naik kelas, dapatkan exposure.",
      join_title: "Daftar Jadi Tenant", join_sub: "Isi formulir, tim kurasi kami akan menghubungi.",
      search_ph: "Cari tenant, menu, atau kata kunci...",
      all_cat: "Semua Kategori", all_zone: "Semua Zona",
      filtered: "tenant ditemukan",
      no_result: "Tidak ada tenant yang cocok. Coba kata kunci lain.",
      menu_title: "Menu & Harga", signature: "Signature",
      open_hours: "Jam Buka", location: "Lokasi", transport: "Transportasi", open_maps: "🧭 Buka di Google Maps",
      stall_table: "Daftar Titik Lapak", stall_table_sub: "Data lengkap tenant beserta zona dan nomor lapak.",
      th_tenant: "Tenant", th_cat: "Kategori", th_zone: "Zona", th_stall: "No. Lapak", th_action: "Aksi",
      view_map: "Lihat di Peta", view_detail: "Lihat Detail",
      about_title: "Tentang Titik Ngemil",
      other_tenants: "Tenant Lain di Zona Ini",
      submit_join: "Kirim Pendaftaran",
      form_ok: "Pendaftaran terkirim! Tim kurasi akan menghubungi kamu.",
      form_ok_local: "Pendaftaran tersimpan di perangkat (mode demo tanpa server).",
      form_err: "Gagal mengirim. Coba lagi atau hubungi kami.",
      required: "Wajib diisi",
      footer_tagline: "Pop-up market PKL terkurasi. Dimulai dari Gondangdia.",
      footer_nav: "Navigasi", footer_info: "Info", footer_contact: "Kontak",
      language: "Bahasa",
      back: "Kembali", free_entry: "Gratis masuk", curated: "Terkurasi",
      partner_cta: "Hubungi Partnership",
      sites_title: "Titik Ngemil", sites_sub: "Satu titik aktif, sisanya segera hadir.",
      site_active: "Aktif", site_pending: "Segera Hadir", status_label: "Status",
      hub_title: "Hub Titik", booth_list: "Daftar Tenant", booths_total: "Booth",
      day_active: "Hari aktif", day_closed: "Libur", operating_hours: "Jam operasional",
      lihat_denah: "Lihat Denah Booth", lihat_denah_lengkap: "Lihat Denah Lengkap",
      tenant_di_titik: "tenant di titik ini", tampilkan_lagi: "Tampilkan lebih banyak ↓",
      panel_booth: "Panel Booth", booth: "Booth", booth_kosong: "Booth kosong",
      menu_lengkap: "Lihat Menu Lengkap", petunjuk_arah: "Petunjuk Arah",
      kembali_daftar: "Kembali ke daftar tenant", status_booth: "Status booth",
      st_buka: "BUKA", st_tutup: "TUTUP", st_habis: "HABIS",
      hari_ini: "Hari ini", jadwal_saya: "Jadwal saya", profil_menu: "Profil & menu",
      status_verifikasi: "Status verifikasi", toggle_booth: "Ubah status booth",
      menu_index: "Indeks Menu", menu_index_sub: "Semua menu tenant dalam satu halaman.",
      schedule_types: { opening: "Pembukaan", music: "Musik", talk: "Talkshow", workshop: "Workshop", quiz: "Kuis", other: "Acara" }
    },
    en: {
      nav_home: "Home", nav_about: "About", nav_tenants: "Tenants", nav_map: "Stall Map",
      nav_sites: "Points", nav_denah: "Booth Map", nav_login: "Sign in",
      nav_schedule: "Schedule", nav_visit: "Visit", nav_join: "Join", nav_partner: "Partner",
      hero_eyebrow: "Curated street-vendor pop-up market",
      hero_title: "The city's favorite snack spots, now <span>neatly curated</span>.",
      hero_sub: "Titik Ngemil embraces street vendors around Gondangdia Station — curated, organized, and elevated into a comfortable snacking experience. Debut event: one day, one lane, 24 booths.",
      cta_explore: "Explore Tenants", cta_visit: "Get Directions",
      stat_tenants: "Curated tenants", stat_stalls: "Organized stalls", stat_zones: "Themed zones",
      stat_sites: "Active points",
      detail_event: "Event Details",
      featured: "Featured Tenants", featured_sub: "Try what visitors hunt for first.",
      view_all: "View all tenants",
      zones_title: "Ngemil Zones", zones_sub: "One lane, 24 numbered booths — every tenant lives here.",
      map_title: "Stall Map", map_sub: "Click a stall on the map to see its tenant.",
      schedule_title: "Event Schedule", schedule_sub: "Music, talkshows, and workshops across the single event day.",
      visit_title: "Visit Us", visit_sub: "Easy access, close to public transport.",
      partner_title: "Become a Partner / Sponsor", partner_sub: "Support street vendors leveling up, gain exposure.",
      join_title: "Register as a Tenant", join_sub: "Fill the form, our curation team will reach out.",
      search_ph: "Search tenants, menus, or keywords...",
      all_cat: "All Categories", all_zone: "All Zones",
      filtered: "tenants found",
      no_result: "No matching tenants. Try another keyword.",
      menu_title: "Menu & Prices", signature: "Signature",
      open_hours: "Opening Hours", location: "Location", transport: "Transport", open_maps: "🧭 Open in Google Maps",
      stall_table: "Stall List", stall_table_sub: "Full tenant data with zone and stall number.",
      th_tenant: "Tenant", th_cat: "Category", th_zone: "Zone", th_stall: "Stall No.", th_action: "Action",
      view_map: "View on Map", view_detail: "View Detail",
      about_title: "About Titik Ngemil",
      other_tenants: "Other Tenants in This Zone",
      submit_join: "Submit Application",
      form_ok: "Application sent! Our curation team will contact you.",
      form_ok_local: "Application saved on this device (demo mode without server).",
      form_err: "Failed to send. Try again or contact us.",
      required: "Required",
      footer_tagline: "Curated street-vendor pop-up market. Starting from Gondangdia.",
      footer_nav: "Navigation", footer_info: "Info", footer_contact: "Contact",
      language: "Language",
      back: "Back", free_entry: "Free entry", curated: "Curated",
      partner_cta: "Contact Partnership",
      sites_title: "Titik Ngemil", sites_sub: "One active point, the rest coming soon.",
      site_active: "Active", site_pending: "Coming Soon", status_label: "Status",
      hub_title: "Point Hub", booth_list: "Tenant List", booths_total: "Booths",
      day_active: "Active days", day_closed: "Closed", operating_hours: "Operating hours",
      lihat_denah: "View Booth Map", lihat_denah_lengkap: "View Full Map",
      tenant_di_titik: "tenants at this point", tampilkan_lagi: "Show more ↓",
      panel_booth: "Booth Panel", booth: "Booth", booth_kosong: "Empty booth",
      menu_lengkap: "View Full Menu", petunjuk_arah: "Get Directions",
      kembali_daftar: "Back to tenant list", status_booth: "Booth status",
      st_buka: "OPEN", st_tutup: "CLOSED", st_habis: "SOLD OUT",
      hari_ini: "Today", jadwal_saya: "My schedule", profil_menu: "Profile & menu",
      status_verifikasi: "Verification status", toggle_booth: "Change booth status",
      menu_index: "Menu Index", menu_index_sub: "All tenant menus on one page.",
      schedule_types: { opening: "Opening", music: "Music", talk: "Talkshow", workshop: "Workshop", quiz: "Quiz", other: "Event" }
    }
  };

  var lang = localStorage.getItem(LS_LANG) || "id";
  function t(key) {
    if (key.indexOf("schedule_types.") === 0) {
      var k = key.split(".")[1];
      return (STRINGS[lang].schedule_types || {})[k] || k;
    }
    return STRINGS[lang][key] || STRINGS.id[key] || key;
  }
  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] != null ? obj[lang] : (obj.id != null ? obj.id : "");
  }
  // Escape untuk menyisipkan teks ke innerHTML / atribut SVG.
  function escHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escAttr(s) { return escHtml(s); }
  function setLang(l) {
    lang = l; localStorage.setItem(LS_LANG, l);
    document.documentElement.lang = l;
    applyI18n();
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) { b.classList.toggle("on", b.dataset.langBtn === l); });
    if (typeof window.TN_RERENDER === "function") window.TN_RERENDER();
  }
  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.dataset.i18n);
      if (el.dataset.i18nHtml === "1") el.innerHTML = v; else el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
  }

  /* ---------------- helpers ---------------- */
  function rupiah(n) { return "Rp " + Number(n).toLocaleString("id-ID"); }
  function initials(str) {
    return String(str).replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
  }
  function catById(id) { return DB.categories.find(function (c) { return c.id === id; }) || { name: { id: "-", en: "-" }, icon: "🍽️", color: "#999" }; }
  function tenantById(slug) { return DB.tenants.find(function (x) { return x.slug === slug; }); }
  function stallByCode(code) { return DB.stalls.find(function (s) { return s.code === code; }); }
  function zoneById(id) { return DB.zones.find(function (z) { return z.id === id; }); }
  function qs(name) { return new URLSearchParams(location.search).get(name); }

  /* ---------------- sites / days / booth ---------------- */
  function sites() { return DB.sites || []; }
  function siteBySlug(s) { return sites().find(function (x) { return x.slug === s; }) || sites()[0]; }
  function days() { return DB.days || []; }
  function dayLabel(id) {
    var d = days().find(function (x) { return x.id === id; });
    return d ? pick(d.label) : id;
  }
  function boothStatusOf(tn) {
    var s = tn.boothStatus || "buka";
    var m = { buka: { cls: "st-buka", col: "#06805f", key: "st_buka" },
      tutup: { cls: "st-tutup", col: "#8a817a", key: "st_tutup" },
      habis: { cls: "st-habis", col: "#b3203c", key: "st_habis" } };
    return m[s] || m.buka;
  }
  function boothNoOf(code) { var s = stallByCode(code); return s && s.no ? s.no : code; }
  function tenantByBooth(no) { return DB.tenants.find(function (t) { return String(boothNoOf(t.stallCode)) === String(no); }); }

  /* ---------------- navigation / shell ---------------- */
  function injectShell() {
    var page = document.body.dataset.page || "home";
    var header = document.getElementById("site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML =
        '<div class="wrap nav">' +
          '<a class="brand" href="/">' +
            '<span class="brand-logo">🍢</span>' +
            '<span>Titik Ngemil<small>Pop-up Market</small></span>' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>' +
          '<nav class="nav-links" id="navLinks">' +
            navLink("/", "nav_home", page) +
            navLink("/titik", "nav_sites", page) +
            navLink("/tenant", "nav_tenants", page) +
            navLink("/titik/gondangdia/denah", "nav_denah", page) +
            navLink("/jadwal", "nav_schedule", page) +
            navLink("/daftar-tenant", "nav_join", page) +
            navLink("/masuk", "nav_login", page) +
            '<div class="lang-toggle">' +
              '<button data-lang-btn="id" onclick="TN.setLang(\'id\')">ID</button>' +
              '<button data-lang-btn="en" onclick="TN.setLang(\'en\')">EN</button>' +
            '</div>' +
          '</nav>' +
        '</div>';
      var tg = document.getElementById("navToggle");
      if (tg) tg.onclick = function () { document.getElementById("navLinks").classList.toggle("open"); };
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.innerHTML =
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<div class="brand" style="margin-bottom:12px"><span class="brand-logo">🍢</span><span style="color:#fff">Titik Ngemil</span></div>' +
              '<p class="muted" data-i18n="footer_tagline"></p>' +
              '<p style="font-size:.85rem">' + pick(DB.event.venueName) + '<br>' + DB.event.address + '</p>' +
            '</div>' +
            '<div><h4 data-i18n="footer_nav"></h4>' +
              '<a href="/tenant" data-i18n="nav_tenants"></a>' +
              '<a href="/titik/gondangdia/denah" data-i18n="nav_denah"></a>' +
              '<a href="/jadwal" data-i18n="nav_schedule"></a>' +
              '<a href="/tentang" data-i18n="nav_about"></a>' +
            '</div>' +
            '<div><h4 data-i18n="footer_info"></h4>' +
              '<a href="/kunjungan" data-i18n="nav_visit"></a>' +
              '<a href="/daftar-tenant" data-i18n="nav_join"></a>' +
              '<a href="/partner" data-i18n="nav_partner"></a>' +
              '<a href="/syarat">Syarat &amp; Ketentuan</a>' +
              '<a href="/privasi">Kebijakan Privasi</a>' +
              '<a href="/kontak">Kontak</a>' +
            '</div>' +
            '<div><h4 data-i18n="footer_contact"></h4>' +
              '<a href="mailto:halo@titikngemil.id">halo@titikngemil.id</a>' +
              '<a href="https://instagram.com/titikngemil" target="_blank" rel="noopener">@titikngemil</a>' +
              '<a href="https://wa.me/6281200000000" target="_blank" rel="noopener">WhatsApp</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom"><span>© 2026 Titik Ngemil. Pop-up market PKL terkurasi.</span>' +
          '<span>' + DB.event.hashtag + ' · ' + pick(DB.event.theme) + '</span></div>' +
        '</div>';
    }
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) { b.classList.toggle("on", b.dataset.langBtn === lang); });
    applyI18n();
  }
  function navLink(href, key, page) {
    var map = { "/": "home", "/titik": "sites", "/tenant": "tenants", "tenant-detail": "tenant-detail",
      "/titik/gondangdia/denah": "map", "/jadwal": "schedule", "/kunjungan": "visit",
      "/daftar-tenant": "join", "/masuk": "login", "/tentang": "about", "/partner": "partner" };
    var active = map[href] === page ? " active" : "";
    return '<a href="' + href + '" class="' + active.trim() + '" data-i18n="' + key + '"></a>';
  }
  // Semua tautan internal memakai path absolut (clean URL, didukung static assets Worker).
  function rootHref(h) { return "/" + h; }

  /* ---------------- tenant card ---------------- */
  function tenantCard(tn) {
    var cat = catById(tn.categoryId);
    var zone = zoneById(tn.zoneId);
    var st = boothStatusOf(tn);
    return '<a class="card" href="/tenant-detail?slug=' + tn.slug + '">' +
      '<div class="thumb" style="background:linear-gradient(135deg,' + cat.color + ',' + shade(cat.color) + ')">' +
        '<span>' + initials(tn.brand) + '</span>' +
        '<span class="badge">' + cat.icon + ' ' + pick(cat.name) + '</span>' +
        '<span class="stall">Booth ' + boothNoOf(tn.stallCode) + '</span>' +
        '<span class="badge" style="left:auto;right:12px;top:12px;background:' + st.col + ';color:#fff">' + t(st.key) + '</span>' +
      '</div>' +
      '<div class="body">' +
        '<h3>' + tn.brand + '</h3>' +
        '<p class="tagline">' + pick(tn.tagline) + '</p>' +
        '<div class="foot">' +
          '<span class="pill">' + (zone ? pick(zone.name) : "-") + '</span>' +
          '<span class="stall-code">' + t("view_detail") + ' →</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }
  function shade(hex) {
    try {
      var c = hex.replace("#", "");
      var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
      r = Math.max(0, r - 45); g = Math.max(0, g - 45); b = Math.max(0, b - 45);
      return "rgb(" + r + "," + g + "," + b + ")";
    } catch (e) { return hex; }
  }

  /* ---------------- pages ---------------- */
  function initHome() {
    var el;
    el = document.getElementById("home-stats");
    if (el) el.innerHTML =
      stat(DB.tenants.length, "stat_tenants") +
      stat(DB.stalls.length, "stat_stalls") +
      stat(sites().filter(function (s) { return s.status === "active"; }).length + "/" + sites().length, "stat_sites");
    el = document.getElementById("hero-meta");
    if (el) el.innerHTML =
      '<div>📅 <b>' + pick(DB.event.dayLabel) + ', 30 Okt 2026</b> — satu hari</div>' +
      '<div>🕒 <b>' + DB.event.startTime + "–" + DB.event.endTime + '</b> WIB</div>' +
      '<div>📍 <b>' + pick(siteBySlug(DB.activeSite).name) + '</b> · ' + DB.event.city + '</div>';
    // Titik (points): 1 aktif + 3 pending
    el = document.getElementById("points-grid");
    if (el) el.innerHTML = sites().map(siteCard).join("");
    // Hari aktif
    el = document.getElementById("home-days");
    if (el) {
      var activeSite = siteBySlug(DB.activeSite || "gondangdia");
      el.innerHTML = daysPills(activeSite.days);
    }
    // Featured + load more
    el = document.getElementById("featured-grid");
    if (el) {
      var shown = 6;
      var drawFeatured = function () {
        el.innerHTML = DB.tenants.slice(0, shown).map(tenantCard).join("");
        var more = document.getElementById("featured-more");
        if (more) more.style.display = shown >= DB.tenants.length ? "none" : "";
      };
      drawFeatured();
      var more = document.getElementById("featured-more");
      if (more) more.onclick = function () { shown += 6; drawFeatured(); };
    }
    el = document.getElementById("zones-grid");
    if (el) {
      el.innerHTML = DB.zones.map(function (z) {
        var count = DB.tenants.filter(function (x) { return x.zoneId === z.id; }).length;
        return '<a class="card" href="/titik/gondangdia/denah">' +
          '<div class="thumb" style="background:' + z.color + '"><span>' + (z.type === "stage" ? "🎤" : "🍽️") + '</span>' +
          '<span class="badge">' + count + ' tenant</span></div>' +
          '<div class="body"><h3>' + pick(z.name) + '</h3><p class="tagline">' + pick(z.blurb) + '</p>' +
          '<div class="foot"><span class="pill">' + zoneTypeLabel(z.type) + '</span></div></div></a>';
      }).join("");
    }
    el = document.getElementById("home-schedule");
    if (el) el.innerHTML = DB.schedule.slice(0, 4).map(scheduleItem).join("");
    window.TN_RERENDER = function () { initHome(); };
  }
  function stat(n, key) { return '<div class="stat"><b>' + n + '</b><small data-i18n="' + key + '"></small></div>'; }
  function zoneTypeLabel(type) {
    var m = { gate: { id: "Area Masuk", en: "Entrance" }, stage: { id: "Panggung", en: "Stage" },
      indoor: { id: "Indoor", en: "Indoor" }, outdoor: { id: "Outdoor", en: "Outdoor" } };
    return pick(m[type] || { id: type, en: type });
  }
  function scheduleItem(s) {
    return '<div class="tl-item">' +
      '<div class="tl-time">' + s.time + '</div>' +
      '<div class="tl-card"><span class="type">' + t("schedule_types." + s.type) + '</span>' +
      '<h4>' + pick(s.title) + '</h4><p class="mb0 muted">' + pick(s.desc) + '</p>' +
      '<p class="mb0" style="font-size:.8rem;color:var(--ink-faint);margin-top:.4em">📍 ' + s.stage + ' · ' + s.time + "–" + s.endTime + '</p>' +
      '</div></div>';
  }

  function initTenantDirectory() {
    var state = { q: "", cat: "all", zone: "all" };
    var catWrap = document.getElementById("cat-filters");
    var zoneWrap = document.getElementById("zone-filters");
    var search = document.getElementById("search");
    if (search) search.placeholder = t("search_ph");
    if (catWrap) {
      catWrap.innerHTML = '<button class="chip on" data-cat="all">' + t("all_cat") + '</button>' +
        DB.categories.map(function (c) { return '<button class="chip" data-cat="' + c.id + '">' + c.icon + " " + pick(c.name) + '</button>'; }).join("");
      catWrap.onclick = function (e) { var b = e.target.closest("[data-cat]"); if (!b) return; state.cat = b.dataset.cat; syncChips(catWrap, "cat", b); render(); };
    }
    if (zoneWrap) {
      zoneWrap.innerHTML = '<button class="chip on" data-zone="all">' + t("all_zone") + '</button>' +
        DB.zones.map(function (z) { return '<button class="chip" data-zone="' + z.id + '">' + pick(z.name) + '</button>'; }).join("");
      zoneWrap.onclick = function (e) { var b = e.target.closest("[data-zone]"); if (!b) return; state.zone = b.dataset.zone; syncChips(zoneWrap, "zone", b); render(); };
    }
    if (search) search.oninput = function () { state.q = search.value.toLowerCase(); render(); };

    function syncChips(wrap, attr, btn) {
      wrap.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c === btn); });
    }
    function render() {
      var list = DB.tenants.filter(function (tn) {
        if (state.cat !== "all" && tn.categoryId !== state.cat) return false;
        if (state.zone !== "all" && tn.zoneId !== state.zone) return false;
        if (state.q) {
          var hay = (tn.brand + " " + pick(tn.tagline) + " " + pick(tn.desc) + " " +
            tn.menu.map(function (m) { return m.name; }).join(" ") + " " + (tn.tags || []).join(" ") + " " + tn.stallCode).toLowerCase();
          if (hay.indexOf(state.q) === -1) return false;
        }
        return true;
      });
      var grid = document.getElementById("tenant-grid");
      var note = document.getElementById("result-note");
      if (note) note.textContent = list.length + " " + t("filtered");
      if (grid) grid.innerHTML = list.length ? list.map(tenantCard).join("") : '<div class="panel center" style="grid-column:1/-1"><p class="mb0">' + t("no_result") + '</p></div>';
    }
    window.TN_RERENDER = function () {
      if (search) search.placeholder = t("search_ph");
      if (catWrap) catWrap.querySelector('[data-cat="all"]').textContent = t("all_cat");
      if (zoneWrap) zoneWrap.querySelector('[data-zone="all"]').textContent = t("all_zone");
      render();
    };
    render();
  }

  function initTenantDetail() {
    var slug = qs("slug");
    var tn = tenantById(slug) || DB.tenants[0];
    var cat = catById(tn.categoryId);
    var zone = zoneById(tn.zoneId);
    var root = document.getElementById("tenant-detail");
    if (!root) return;
    root.innerHTML =
      '<div class="detail-hero">' +
        '<div>' +
          '<a href="/tenant" class="pill" style="margin-bottom:14px;display:inline-flex">← <span data-i18n="nav_tenants"></span></a>' +
          '<div class="thumb" style="background:linear-gradient(135deg,' + cat.color + ',' + shade(cat.color) + ');border-radius:var(--radius);aspect-ratio:16/6;display:grid;place-items:center;font-size:4rem;color:#fff;font-weight:800">' + initials(tn.brand) + '</div>' +
          '<div style="margin-top:22px">' +
            '<span class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</span>' +
            '<h1 style="margin-top:12px">' + tn.brand + '</h1>' +
            '<p class="muted" style="font-size:1.1rem">' + pick(tn.tagline) + '</p>' +
            '<p>' + pick(tn.desc) + '</p>' +
            (pick(tn.story) ? '<p class="muted" style="font-style:italic">“' + pick(tn.story) + '”</p>' : '') +
          '</div>' +
          '<div class="panel" style="margin-top:22px">' +
            '<h3 data-i18n="menu_title"></h3>' +
            tn.menu.map(function (m) {
              return '<div class="menu-item"><div><div class="mi-name">' + m.name + (m.signature ? '<span class="sig">' + t("signature") + '</span>' : '') + '</div>' +
                '<div class="mi-desc">' + pick(m.desc) + '</div></div>' +
                '<div class="mi-price">' + rupiah(m.price) + '</div></div>';
            }).join("") +
          '</div>' +
        '</div>' +
        '<div class="map-side">' +
          '<div class="panel"><h3 style="margin-bottom:1em">' + pick(DB.event.name) + '</h3>' +
            '<div class="kv">' +
              kv("📍 " + t("location"), pick(DB.event.venueName)) +
              kv("🕒 " + t("open_hours"), pick(DB.event.dayLabel) + " · " + DB.event.startTime + "–" + DB.event.endTime) +
              kv("🏷️ " + t("nav_map"), (zone ? pick(zone.name) : "-")) +
              kv("🔢 " + t("th_stall"), tn.stallCode) +
            '</div>' +
            '<a class="btn btn-primary btn-block" style="margin-top:16px" href="/titik/gondangdia/denah?booth=' + boothNoOf(tn.stallCode) + '">' + t("view_map") + '</a>' +
          '</div>' +
          '<div class="panel"><h3 data-i18n="transport"></h3>' +
            DB.event.transport.map(function (x) { return '<div class="legend-item" style="margin-bottom:8px">' + x.icon + ' <span>' + pick(x.label) + '</span></div>'; }).join("") +
            '<a class="btn btn-ghost btn-block" style="margin-top:12px" href="' + DB.event.mapsUrl + '" target="_blank" rel="noopener">' + t("cta_visit") + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var others = DB.tenants.filter(function (x) { return x.zoneId === tn.zoneId && x.slug !== tn.slug; }).slice(0, 3);
    if (others.length) {
      var wrap = document.getElementById("other-tenants");
      if (wrap) {
        wrap.innerHTML = '<div class="section-head"><div><h2 data-i18n="other_tenants"></h2></div></div><div class="grid grid-3">' + others.map(tenantCard).join("") + '</div>';
      }
    } else {
      var w2 = document.getElementById("other-tenants"); if (w2) w2.innerHTML = "";
    }
    window.TN_RERENDER = function () { initTenantDetail(); };
  }
  function kv(k, v) { return '<div class="kv-row"><span>' + k + '</span><b>' + v + '</b></div>'; }

  function initMap() {
    var svg = document.getElementById("map-svg");
    if (!svg) return;
    // Kanvas 820x1360: 24 booth = 2 kolom x 12 mengapit lorong membujur ke bawah.
    var W = 820, H = 1360;
    var preselect = qs("booth");
    var sel = preselect ? String(preselect) : null;

    // Kecilkan font label sampai muat di dalam kotak booth (anti-overflow).
    function fitLabels(root) {
      root.querySelectorAll(".map-stall").forEach(function (g) {
        var rect = g.querySelector("rect");
        if (!rect) return;
        var boxW = +rect.getAttribute("width") - 22;
        g.querySelectorAll(".booth-name, .booth-tag").forEach(function (tx) {
          var start = tx.classList.contains("booth-name") ? 15 : 12;
          var size = start;
          tx.removeAttribute("textLength");
          tx.setAttribute("font-size", size);
          var guard = 0;
          while (guard++ < 16) {
            var w = 0;
            try { w = tx.getBBox().width; } catch (e) { return; }
            if (w <= boxW) return;
            size -= 0.5;
            if (size < 7) break;
            tx.setAttribute("font-size", size);
          }
          // masih tidak muat: rapatkan glyph agar pas tanpa keluar kotak
          tx.setAttribute("textLength", boxW);
          tx.setAttribute("lengthAdjust", "spacingAndGlyphs");
        });
      });
    }

    function draw() {
      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" class="map-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + escAttr(t("map_title")) + '">');
      parts.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fbf5ec"/>');
      // grid halus
      for (var gx = 0; gx <= W; gx += 50) parts.push('<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="#00000008"/>');
      for (var gy = 0; gy <= H; gy += 50) parts.push('<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="#00000008"/>');
      // zona (satu lorong)
      DB.zones.forEach(function (z) {
        var a = z.area;
        parts.push('<rect class="map-zone-rect" x="' + a.x + '" y="' + a.y + '" width="' + a.w + '" height="' + a.h + '" rx="16" stroke="' + z.color + '"/>');
        parts.push('<rect x="' + a.x + '" y="' + a.y + '" width="' + a.w + '" height="' + a.h + '" rx="16" fill="' + z.color + '" opacity="0.06"/>');
        parts.push('<text class="map-zone-label" x="' + (a.x + 16) + '" y="' + (a.y + 28) + '">' + escHtml(pick(z.name)) + '</text>');
      });
      // lorong / jalan tengah (vertikal)
      var walkX = 330, walkW = 160;
      parts.push('<rect class="map-walkway" x="' + walkX + '" y="30" width="' + walkW + '" height="' + (H - 60) + '" rx="10"/>');
      parts.push('<line class="map-walkway-line" x1="' + (walkX + walkW / 2) + '" y1="46" x2="' + (walkX + walkW / 2) + '" y2="' + (H - 46) + '"/>');
      parts.push('<text class="map-walkway-label" x="' + (walkX + walkW / 2) + '" y="' + (H / 2) + '" text-anchor="middle" transform="rotate(-90 ' + (walkX + walkW / 2) + ' ' + (H / 2) + ')">' + escHtml(pick(DB.zones[0].name)) + ' · jalan tengah</text>');
      // booth
      DB.stalls.forEach(function (s) {
        var tn = DB.tenants.find(function (x) { return x.stallCode === s.code; });
        var zone = zoneById(s.zoneId);
        var isSel = String(sel) === String(s.no);
        var label = tn ? tn.brand : t("booth_kosong");
        var stCol = tn ? boothStatusOf(tn).col : "#c9bfb3";
        parts.push('<g class="map-stall' + (isSel ? " sel" : "") + '" data-stall="' + s.code + '" data-booth="' + s.no + '" tabindex="0" role="button" aria-label="Booth ' + s.no + (tn ? ' — ' + escAttr(tn.brand) : "") + '">' +
          '<rect x="' + s.x + '" y="' + s.y + '" width="' + s.w + '" height="' + s.h + '" rx="10" stroke="' + zone.color + '"/>' +
          '<circle class="booth-dot" cx="' + (s.x + s.w - 14) + '" cy="' + (s.y + 16) + '" r="4.5" fill="' + stCol + '"/>' +
          '<text class="booth-no" x="' + (s.x + 11) + '" y="' + (s.y + 19) + '" font-size="12">#' + s.no + '</text>' +
          '<text class="booth-no-lg" x="' + (s.x + s.w / 2) + '" y="' + (s.y + s.h / 2 + 12) + '" text-anchor="middle" font-size="38">' + s.no + '</text>' +
          '<text class="booth-name" x="' + (s.x + 11) + '" y="' + (s.y + 44) + '" font-weight="700" font-size="15">' + escHtml(label) + '</text>' +
          (tn ? '<text class="booth-tag" x="' + (s.x + 11) + '" y="' + (s.y + 66) + '" font-size="12">' + escHtml(catById(tn.categoryId).icon + " " + pick(catById(tn.categoryId).name)) + '</text>' : '') +
          '</g>');
      });
      parts.push('</svg>');
      svg.innerHTML = parts.join("");
      fitLabels(svg);
      svg.querySelectorAll(".map-stall").forEach(function (g) {
        g.addEventListener("click", function () { showStall(g.dataset.booth); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showStall(g.dataset.booth); }
        });
      });
    }
    function showStall(no) {
      sel = String(no); draw();
      // simpan pilihan booth di URL supaya bisa dibagikan / di-refresh
      try {
        var u = new URL(location.href);
        u.searchParams.set("booth", no);
        history.replaceState(null, "", u);
      } catch (e) {}
      var tn = tenantByBooth(no);
      var info = document.getElementById("stall-info");
      if (!info) return;
      if (!tn) { info.innerHTML = '<div class="badge-soft">' + t("booth") + ' ' + no + '</div><p class="muted mb0" style="margin-top:10px">' + t("booth_kosong") + '</p>'; return; }
      var cat = catById(tn.categoryId);
      var zone = zoneById(tn.zoneId);
      var st = boothStatusOf(tn);
      info.innerHTML =
        '<div class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</div>' +
        '<h3 style="margin-top:10px">' + tn.brand + '</h3>' +
        '<p class="muted">' + pick(tn.tagline) + '</p>' +
        '<div class="kv">' +
          kv(t("booth"), String(no)) +
          kv(t("th_zone"), zone ? pick(zone.name) : "-") +
          kv(t("status_booth"), '<span style="color:' + st.col + ';font-weight:800">' + t(st.key) + '</span>') +
          kv(t("menu_title"), tn.menu.length + " item") +
        '</div>' +
        '<a class="btn btn-primary btn-block" style="margin-top:14px" href="/menu?slug=' + tn.slug + '">' + t("menu_lengkap") + '</a>' +
        '<a class="btn btn-ghost btn-block" style="margin-top:8px" href="' + DB.event.mapsUrl + '" target="_blank" rel="noopener">📍 ' + t("petunjuk_arah") + '</a>' +
        '<a class="pill" style="margin-top:12px;display:inline-flex" href="/titik/gondangdia">← ' + t("kembali_daftar") + '</a>';
    }
    // legend
    var legend = document.getElementById("map-legend");
    if (legend) legend.innerHTML = DB.zones.map(function (z) {
      return '<div class="legend-item"><span class="legend-dot" style="background:' + z.color + '"></span> <b>' + pick(z.name) + '</b> <span class="muted">· ' + DB.tenants.filter(function (x) { return x.zoneId === z.id; }).length + '</span></div>';
    }).join("");
    // table
    renderStallTable();
    draw(); // gambar denah sejak awal (bukan hanya saat ada ?booth=)
    if (preselect) showStall(preselect);
    // tombol kembali/forward browser ikut mengubah booth terpilih
    window.addEventListener("popstate", function () {
      var b = qs("booth");
      if (b) showStall(b); else { sel = null; draw(); }
    });
    window.TN_RERENDER = function () { draw(); renderStallTable(); if (sel) showStall(sel); };
  }

  function renderStallTable() {
    var tb = document.getElementById("stall-tbody");
    if (!tb) return;
    tb.innerHTML = DB.tenants.map(function (tn) {
      var cat = catById(tn.categoryId), zone = zoneById(tn.zoneId);
      return '<tr>' +
        '<td data-label="Tenant"><b>' + tn.brand + '</b><br><span class="muted" style="font-size:.82rem">' + pick(tn.tagline) + '</span></td>' +
        '<td data-label="Kategori"><span class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</span></td>' +
        '<td data-label="Zona">' + (zone ? pick(zone.name) : "-") + '</td>' +
        '<td data-label="Booth"><b>Booth ' + boothNoOf(tn.stallCode) + '</b></td>' +
        '<td class="cell-actions"><a class="btn btn-ghost btn-sm" href="/titik/gondangdia/denah?booth=' + boothNoOf(tn.stallCode) + '" aria-label="Lihat booth di denah">🗺️ <span class="cell-actions-txt">Denah</span></a>' +
        '<a class="btn btn-ghost btn-sm" href="/tenant-detail?slug=' + tn.slug + '" aria-label="Lihat detail tenant">→</a></td>' +
      '</tr>';
    }).join("");
  }

  function initSchedule() {
    var el = document.getElementById("schedule-list");
    if (el) el.innerHTML = DB.schedule.map(scheduleItem).join("");
    window.TN_RERENDER = function () { initSchedule(); };
  }

  function initVisit() {
    var el = document.getElementById("visit-info");
    if (!el) return;
    el.innerHTML =
      kv("📍 " + t("location"), pick(DB.event.venueName)) +
      kv("🗓️ Tanggal", pick(DB.event.dayLabel) + ", 30 Okt 2026") +
      kv("🏙️ Kota", DB.event.city) +
      kv("🎪 Acara", pick(DB.event.theme));
    var tr = document.getElementById("visit-transport");
    if (tr) tr.innerHTML = DB.event.transport.map(function (x) {
      return '<div class="card"><div class="body"><h3>' + x.icon + ' ' + pick(x.label) + '</h3></div></div>';
    }).join("");
    var hrs = document.getElementById("visit-hours");
    if (hrs) hrs.innerHTML =
      kv(t("open_hours"), DB.event.startTime + "–" + DB.event.endTime + " WIB") +
      kv(t("day_active"), pick(DB.event.dayLabel)) +
      kv("Durasi", "8 jam (satu hari)");
    window.TN_RERENDER = function () { initVisit(); };
  }

  function initJoin() {
    var form = document.getElementById("join-form");
    if (!form) return;
    var alertBox = document.getElementById("join-alert");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = {}; fd.forEach(function (v, k) { payload[k] = v; });
      payload.id = "APP-" + Date.now().toString().slice(-8);
      payload.submittedAt = new Date().toISOString().slice(0, 10);
      payload.stage = "terkirim";
      payload.site = (DB.activeSite || "gondangdia");
      payload.booth = null;
      payload.note = "";
      function save(p) {
        var arr = JSON.parse(localStorage.getItem(LS_APP) || "[]");
        arr.push(p); localStorage.setItem(LS_APP, JSON.stringify(arr));
      }
      function ok(msg) {
        if (alertBox) { alertBox.className = "alert alert-ok"; alertBox.textContent = msg; alertBox.classList.remove("hidden"); }
        toast(msg);
        setTimeout(function () { location.href = "/daftar-tenant/status?id=" + payload.id; }, 900);
      }
      fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function () { save(payload); form.reset(); ok(t("form_ok")); })
        .catch(function () { save(payload); form.reset(); ok(t("form_ok_local")); });
    });
    window.TN_RERENDER = function () {};
  }

  /* ---------------- titik (sites) ---------------- */
  function siteCard(s) {
    var active = s.status === "active";
    var badge = active
      ? '<span class="badge-soft" style="background:#e6fbf3;color:#06805f">● ' + t("site_active") + '</span>'
      : '<span class="badge-soft" style="background:#f0ece6;color:#8a817a">' + t("site_pending") + '</span>';
    var inner = '<div class="card"' + (active ? "" : ' style="opacity:.7"') + '>' +
      '<div class="thumb" style="background:' + (active ? "#06d6a0" : "#c9bfb3") + '"><span>' + (active ? "📍" : "🗺️") + '</span>' +
        '<span class="badge">' + s.city + '</span></div>' +
      '<div class="body"><h3>' + pick(s.name) + '</h3>' +
        '<p class="tagline">' + pick(s.blurb) + '</p>' +
        '<div class="foot">' + badge + (active ? '<span class="stall-code">' + t("lihat_denah") + ' →</span>' : "") + '</div>' +
      '</div></div>';
    return active ? '<a href="/titik/' + s.slug + '">' + inner + '</a>' : inner;
  }
  function initSites() {
    var el = document.getElementById("sites-grid");
    if (el) el.innerHTML = sites().map(siteCard).join("");
    var pi = document.getElementById("site-pending-info");
    if (pi) pi.textContent = sites().filter(function (s) { return s.status === "pending"; }).length;
    window.TN_RERENDER = function () { initSites(); };
  }
  function daysPills(active) {
    return '<div class="filters">' + days().map(function (d) {
      var isActive = (active || []).indexOf(d.id) !== -1 && !d.closed;
      return '<span class="chip' + (isActive ? " on" : "") + '" ' + (isActive ? "" : 'style="opacity:.55"') + '>' +
        pick(d.label) + (d.closed ? ' · ' + t("day_closed") : "") + '</span>';
    }).join("") + '</div>';
  }
  function initSiteHub() {
    var s = siteBySlug("gondangdia");
    var el = document.getElementById("hub");
    if (!el) return;
    var list = DB.tenants.slice(0, 4);
    el.innerHTML =
      '<div class="panel" style="background:linear-gradient(135deg,var(--brand-soft),#e6fbf3);margin-bottom:26px">' +
        '<div class="flex between">' +
          '<div><span class="badge-soft" style="background:#e6fbf3;color:#06805f">● ' + t("site_active") + '</span>' +
            '<h1 style="margin:.3em 0 .1em">' + pick(s.name) + '</h1>' +
            '<p class="muted mb0">' + pick(s.blurb) + '</p></div>' +
          '<div class="flex"><a class="btn btn-primary" href="/titik/' + s.slug + '/denah">🗺️ ' + t("lihat_denah") + '</a>' +
            '<a class="btn btn-ghost" href="' + s.mapsUrl + '" target="_blank" rel="noopener">📍 ' + t("petunjuk_arah") + '</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="map-layout">' +
        '<div><div class="section-head"><div><h2>' + t("day_active") + '</h2>' +
          '<p>' + t("operating_hours") + ': ' + s.openTime + '–' + s.closeTime + ' WIB</p></div></div>' + daysPills(s.days) +
          '<div class="grid grid-2" style="margin-top:20px">' +
            '<div class="panel"><h3>📍 ' + t("location") + '</h3><p class="muted mb0">' + s.address + '</p></div>' +
            '<div class="panel"><h3>🧾 ' + t("booths_total") + '</h3><p class="muted mb0">' + s.capacity + ' booth · ' + DB.tenants.length + ' ' + t("tenant_di_titik") + '</p></div>' +
          '</div>' +
        '</div>' +
        '<div class="panel"><h3>' + t("status_label") + '</h3><div class="kv">' +
          kv(t("status_label"), t("site_active")) +
          kv(t("day_active"), dayLabel("jumat")) +
          kv("Kapasitas", s.capacity + " booth") +
          kv("Terisi", DB.tenants.length + " booth") +
          kv("Tanggal", "30 Okt 2026") +
        '</div><a class="btn btn-primary btn-block" style="margin-top:14px" href="/daftar-tenant">' + t("join_title") + '</a></div>' +
      '</div>' +
      '<div class="section-head" style="margin-top:40px"><div><h2>' + t("booth_list") + '</h2>' +
        '<p><a href="/tenant">' + t("view_all") + '</a></p></div></div>' +
      '<div class="grid grid-3" id="hub-tenants">' + list.map(tenantCard).join("") + '</div>' +
      '<div class="filters" style="margin-top:18px"><button class="btn btn-ghost" id="hub-more">' + t("tampilkan_lagi") + '</button></div>';
    var more = document.getElementById("hub-more");
    if (more) more.onclick = function () {
      var g = document.getElementById("hub-tenants");
      g.innerHTML = DB.tenants.map(tenantCard).join("");
      more.style.display = "none";
    };
    window.TN_RERENDER = function () { initSiteHub(); };
  }

  /* ---------------- menu (indeks + detail) ---------------- */
  function initMenu() {
    var slug = qs("slug");
    var wrap = document.getElementById("menu-wrap");
    if (!wrap) return;
    if (slug) {
      var tn = tenantById(slug) || DB.tenants[0];
      var cat = catById(tn.categoryId);
      wrap.innerHTML =
        '<a href="/tenant" class="pill" style="margin-bottom:14px;display:inline-flex">← <span data-i18n="nav_tenants"></span></a>' +
        '<div class="panel"><div class="flex between"><div><h1 class="mb0">' + tn.brand + '</h1>' +
          '<p class="muted">' + pick(tn.tagline) + ' · Booth ' + boothNoOf(tn.stallCode) + '</p></div>' +
          '<span class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</span></div>' +
          '<h3 style="margin-top:1em" data-i18n="menu_title"></h3>' +
          tn.menu.map(function (m) {
            return '<div class="menu-item"><div><div class="mi-name">' + m.name + (m.signature ? '<span class="sig">' + t("signature") + '</span>' : '') + '</div>' +
              '<div class="mi-desc">' + pick(m.desc) + '</div></div><div class="mi-price">' + rupiah(m.price) + '</div></div>';
          }).join("") +
        '</div>';
    } else {
      wrap.innerHTML = DB.tenants.map(function (tn) {
        var cat = catById(tn.categoryId);
        return '<div class="panel" style="margin-bottom:16px"><div class="flex between"><div>' +
          '<a href="/menu?slug=' + tn.slug + '"><h3 class="mb0">' + tn.brand + '</h3></a>' +
          '<span class="muted" style="font-size:.85rem">' + cat.icon + ' ' + pick(cat.name) + ' · Booth ' + boothNoOf(tn.stallCode) + '</span></div>' +
          '<span class="pill">' + tn.menu.length + ' item</span></div>' +
          tn.menu.slice(0, 3).map(function (m) {
            return '<div class="menu-item"><div class="mi-name">' + m.name + (m.signature ? '<span class="sig">' + t("signature") + '</span>' : '') + '</div><div class="mi-price">' + rupiah(m.price) + '</div></div>';
          }).join("") +
          (tn.menu.length > 3 ? '<a class="pill" style="margin-top:12px;display:inline-flex" href="/menu?slug=' + tn.slug + '">' + t("menu_lengkap") + ' →</a>' : '') +
        '</div>';
      }).join("");
    }
    window.TN_RERENDER = function () { initMenu(); };
  }

  /* ---------------- toast ---------------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    document.documentElement.lang = lang;
    injectShell();
    var page = document.body.dataset.page;
    ({ home: initHome, tenants: initTenantDirectory, "tenant-detail": initTenantDetail,
      map: initMap, schedule: initSchedule, visit: initVisit, join: initJoin,
      sites: initSites, hub: initSiteHub, menu: initMenu }[page] || function () {})();
  }

  window.TN = {
    setLang: setLang, t: t, pick: pick, rupiah: rupiah, DB: DB,
    tenantCard: tenantCard, catById: catById, zoneById: zoneById, tenantById: tenantById,
    applyI18n: applyI18n, toast: toast,
    sites: sites, siteBySlug: siteBySlug, days: days, dayLabel: dayLabel,
    boothNoOf: boothNoOf, tenantByBooth: tenantByBooth, boothStatusOf: boothStatusOf,
    daysPills: daysPills, kv: kv, shade: shade, initials: initials, qs: qs
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();