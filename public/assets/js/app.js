/* =====================================================================
   Titik Ngemil — App core
   ===================================================================== */
(function () {
  "use strict";

  var DB = window.TITIK_DB || { event: {}, categories: [], zones: [], stalls: [], tenants: [], schedule: [] };
  var LS_LANG = "tn_lang";
  var LS_APP = "tn_applications";

  /* ---------------- i18n ---------------- */
  var STRINGS = {
    id: {
      nav_home: "Beranda", nav_about: "Tentang", nav_tenants: "Tenant", nav_map: "Peta Lapak",
      nav_schedule: "Acara", nav_visit: "Kunjungan", nav_join: "Gabung", nav_partner: "Partner",
      hero_eyebrow: "Pop-up market PKL terkurasi",
      hero_title: "Titik jajan favorit warga, kini <span>tertata rapi</span>.",
      hero_sub: "Titik Ngemil merangkul pedagang kaki lima di sekitar Stasiun Gondangdia — dikurasi, ditata, dan diangkat jadi pengalaman jajan yang nyaman.",
      cta_explore: "Jelajahi Tenant", cta_visit: "Cara ke Lokasi",
      stat_tenants: "Tenant terkurasi", stat_stalls: "Lapak tertata", stat_zones: "Zona tematik",
      detail_event: "Detail Acara",
      featured: "Tenant Pilihan", featured_sub: "Cicipi dulu yang paling dicari pengunjung.",
      view_all: "Lihat semua tenant",
      zones_title: "Zona Ngemil", zones_sub: "Setiap zona punya karakter, biar gampang nyari.",
      map_title: "Peta Lapak", map_sub: "Klik lapak di denah untuk lihat tenant-nya.",
      schedule_title: "Jadwal Acara", schedule_sub: "Musik, talkshow, dan workshop sepanjang hari.",
      visit_title: "Kunjungi Kami", visit_sub: "Akses gampang, dekat transportasi publik.",
      partner_title: "Jadi Partner / Sponsor", partner_sub: "Dukung PKL naik kelas, dapatkan exposure.",
      join_title: "Daftar Jadi Tenant", join_sub: "Isi formulir, tim kurasi kami akan menghubungi.",
      search_ph: "Cari tenant, menu, atau kata kunci...",
      all_cat: "Semua Kategori", all_zone: "Semua Zona",
      filtered: "tenant ditemukan",
      no_result: "Tidak ada tenant yang cocok. Coba kata kunci lain.",
      menu_title: "Menu & Harga", signature: "Signature",
      open_hours: "Jam Buka", location: "Lokasi", transport: "Transportasi",
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
      schedule_types: { opening: "Pembukaan", music: "Musik", talk: "Talkshow", workshop: "Workshop", quiz: "Kuis", other: "Acara" }
    },
    en: {
      nav_home: "Home", nav_about: "About", nav_tenants: "Tenants", nav_map: "Stall Map",
      nav_schedule: "Schedule", nav_visit: "Visit", nav_join: "Join", nav_partner: "Partner",
      hero_eyebrow: "Curated street-vendor pop-up market",
      hero_title: "The city's favorite snack spots, now <span>neatly curated</span>.",
      hero_sub: "Titik Ngemil embraces street vendors around Gondangdia Station — curated, organized, and elevated into a comfortable snacking experience.",
      cta_explore: "Explore Tenants", cta_visit: "Get Directions",
      stat_tenants: "Curated tenants", stat_stalls: "Organized stalls", stat_zones: "Themed zones",
      detail_event: "Event Details",
      featured: "Featured Tenants", featured_sub: "Try what visitors hunt for first.",
      view_all: "View all tenants",
      zones_title: "Ngemil Zones", zones_sub: "Each zone has its own character, easy to navigate.",
      map_title: "Stall Map", map_sub: "Click a stall on the map to see its tenant.",
      schedule_title: "Event Schedule", schedule_sub: "Music, talkshows, and workshops all day.",
      visit_title: "Visit Us", visit_sub: "Easy access, close to public transport.",
      partner_title: "Become a Partner / Sponsor", partner_sub: "Support street vendors leveling up, gain exposure.",
      join_title: "Register as a Tenant", join_sub: "Fill the form, our curation team will reach out.",
      search_ph: "Search tenants, menus, or keywords...",
      all_cat: "All Categories", all_zone: "All Zones",
      filtered: "tenants found",
      no_result: "No matching tenants. Try another keyword.",
      menu_title: "Menu & Prices", signature: "Signature",
      open_hours: "Opening Hours", location: "Location", transport: "Transport",
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

  /* ---------------- navigation / shell ---------------- */
  function injectShell() {
    var page = document.body.dataset.page || "home";
    var header = document.getElementById("site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML =
        '<div class="wrap nav">' +
          '<a class="brand" href="' + rootHref("index.html") + '">' +
            '<span class="brand-logo">🍢</span>' +
            '<span>Titik Ngemil<small>Pop-up Market</small></span>' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>' +
          '<nav class="nav-links" id="navLinks">' +
            navLink("index.html", "nav_home", page) +
            navLink("tentang.html", "nav_about", page) +
            navLink("tenant.html", "nav_tenants", page) +
            navLink("peta.html", "nav_map", page) +
            navLink("jadwal.html", "nav_schedule", page) +
            navLink("kunjungan.html", "nav_visit", page) +
            navLink("gabung.html", "nav_join", page) +
            navLink("partner.html", "nav_partner", page) +
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
              '<a href="' + rootHref("tenant.html") + '" data-i18n="nav_tenants"></a>' +
              '<a href="' + rootHref("peta.html") + '" data-i18n="nav_map"></a>' +
              '<a href="' + rootHref("jadwal.html") + '" data-i18n="nav_schedule"></a>' +
              '<a href="' + rootHref("tentang.html") + '" data-i18n="nav_about"></a>' +
            '</div>' +
            '<div><h4 data-i18n="footer_info"></h4>' +
              '<a href="' + rootHref("kunjungan.html") + '" data-i18n="nav_visit"></a>' +
              '<a href="' + rootHref("gabung.html") + '" data-i18n="nav_join"></a>' +
              '<a href="' + rootHref("partner.html") + '" data-i18n="nav_partner"></a>' +
              '<a href="' + rootHref("index.html#faq") + '">FAQ</a>' +
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
    var map = { "index.html": "home", "tentang.html": "about", "tenant.html": "tenants", "peta.html": "map",
      "jadwal.html": "schedule", "kunjungan.html": "visit", "gabung.html": "join", "partner.html": "partner" };
    var active = map[href] === page ? " active" : "";
    return '<a href="' + rootHref(href) + '" class="' + active.trim() + '" data-i18n="' + key + '"></a>';
  }
  // semua halaman berada di root public/, jadi href relatif biasa.
  function rootHref(h) { return h; }

  /* ---------------- tenant card ---------------- */
  function tenantCard(tn) {
    var cat = catById(tn.categoryId);
    var zone = zoneById(tn.zoneId);
    return '<a class="card" href="tenant-detail.html?slug=' + tn.slug + '">' +
      '<div class="thumb" style="background:linear-gradient(135deg,' + cat.color + ',' + shade(cat.color) + ')">' +
        '<span>' + initials(tn.brand) + '</span>' +
        '<span class="badge">' + cat.icon + ' ' + pick(cat.name) + '</span>' +
        '<span class="stall">' + tn.stallCode + '</span>' +
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
      stat(DB.zones.length, "stat_zones");
    el = document.getElementById("hero-meta");
    if (el) el.innerHTML =
      '<div>🗓️ <b>' + pick(DB.event.dayLabel) + ', 30 Okt 2026</b></div>' +
      '<div>🕒 <b>' + DB.event.startTime + "–" + DB.event.endTime + '</b></div>' +
      '<div>📍 <b>' + pick(DB.event.venueName) + '</b></div>';
    el = document.getElementById("featured-grid");
    if (el) el.innerHTML = DB.tenants.slice(0, 6).map(tenantCard).join("");
    el = document.getElementById("zones-grid");
    if (el) {
      el.innerHTML = DB.zones.map(function (z) {
        var count = DB.tenants.filter(function (x) { return x.zoneId === z.id; }).length;
        return '<a class="card" href="peta.html">' +
          '<div class="thumb" style="background:' + z.color + '"><span>' + (z.type === "stage" ? "🎤" : "🍽️") + '</span>' +
          '<span class="badge">' + count + ' tenant</span></div>' +
          '<div class="body"><h3>' + pick(z.name) + '</h3><p class="tagline">' + pick(z.blurb) + '</p>' +
          '<div class="foot"><span class="pill">' + zoneTypeLabel(z.type) + '</span></div></div></a>';
      }).join("");
    }
    el = document.getElementById("home-schedule");
    if (el) el.innerHTML = DB.schedule.slice(0, 4).map(scheduleItem).join("");
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
          '<a href="tenant.html" class="pill" style="margin-bottom:14px;display:inline-flex">← <span data-i18n="nav_tenants"></span></a>' +
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
            '<a class="btn btn-primary btn-block" style="margin-top:16px" href="peta.html?stall=' + tn.stallCode + '">' + t("view_map") + '</a>' +
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
    var W = 1000, H = 700;
    var preselect = qs("stall");
    var sel = preselect || null;

    function draw() {
      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" class="map-svg" xmlns="http://www.w3.org/2000/svg">');
      parts.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fbf5ec"/>');
      // grid
      for (var gx = 0; gx <= W; gx += 50) parts.push('<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="#00000008"/>');
      for (var gy = 0; gy <= H; gy += 50) parts.push('<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="#00000008"/>');
      // zones
      DB.zones.forEach(function (z) {
        var a = z.area;
        parts.push('<rect class="map-zone-rect" x="' + a.x + '" y="' + a.y + '" width="' + a.w + '" height="' + a.h + '" rx="14" stroke="' + z.color + '"/>');
        parts.push('<rect x="' + a.x + '" y="' + a.y + '" width="' + a.w + '" height="' + a.h + '" rx="14" fill="' + z.color + '" opacity="0.07"/>');
        parts.push('<text class="map-zone-label" x="' + (a.x + 14) + '" y="' + (a.y + 26) + '">' + pick(z.name) + '</text>');
        if (z.type === "stage") {
          parts.push('<text x="' + (a.x + a.w / 2) + '" y="' + (a.y + a.h / 2 + 30) + '" text-anchor="middle" font-size="60">🎤</text>');
        }
      });
      // stalls
      DB.stalls.forEach(function (s) {
        var tn = DB.tenants.find(function (x) { return x.stallCode === s.code; });
        var zone = zoneById(s.zoneId);
        var isSel = sel === s.code;
        var label = tn ? shortName(tn.brand) : s.code;
        parts.push('<g class="map-stall' + (isSel ? " sel" : "") + '" data-stall="' + s.code + '">' +
          '<rect x="' + s.x + '" y="' + s.y + '" width="' + s.w + '" height="' + s.h + '" rx="9" stroke="' + zone.color + '"/>' +
          '<text x="' + (s.x + 10) + '" y="' + (s.y + 22) + '" font-size="10" fill="' + shade(zone.color) + '">' + s.code + '</text>' +
          '<text x="' + (s.x + 10) + '" y="' + (s.y + 42) + '" font-weight="700">' + label + '</text>' +
          '</g>');
      });
      parts.push('</svg>');
      svg.innerHTML = parts.join("");
      svg.querySelectorAll(".map-stall").forEach(function (g) {
        g.addEventListener("click", function () { showStall(g.dataset.stall); });
      });
    }
    function shortName(n) { return n.length > 20 ? n.slice(0, 19) + "…" : n; }
    function showStall(code) {
      sel = code; draw();
      var s = stallByCode(code);
      var tn = DB.tenants.find(function (x) { return x.stallCode === code; });
      var info = document.getElementById("stall-info");
      if (!info) return;
      if (!tn) { info.innerHTML = '<p class="muted mb0">' + code + '</p>'; return; }
      var cat = catById(tn.categoryId);
      var zone = zoneById(tn.zoneId);
      info.innerHTML =
        '<div class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</div>' +
        '<h3 style="margin-top:10px">' + tn.brand + '</h3>' +
        '<p class="muted">' + pick(tn.tagline) + '</p>' +
        '<div class="kv">' +
          kv(t("th_stall"), code) +
          kv(t("th_zone"), zone ? pick(zone.name) : "-") +
          kv(t("menu_title"), tn.menu.length + " item") +
        '</div>' +
        '<a class="btn btn-primary btn-block" style="margin-top:14px" href="tenant-detail.html?slug=' + tn.slug + '">' + t("view_detail") + '</a>';
    }
    // legend
    var legend = document.getElementById("map-legend");
    if (legend) legend.innerHTML = DB.zones.map(function (z) {
      return '<div class="legend-item"><span class="legend-dot" style="background:' + z.color + '"></span> <b>' + pick(z.name) + '</b> <span class="muted">· ' + DB.tenants.filter(function (x) { return x.zoneId === z.id; }).length + '</span></div>';
    }).join("");
    // table
    renderStallTable();
    if (preselect) showStall(preselect);
    window.TN_RERENDER = function () { draw(); renderStallTable(); if (sel) showStall(sel); };
  }

  function renderStallTable() {
    var tb = document.getElementById("stall-tbody");
    if (!tb) return;
    tb.innerHTML = DB.tenants.map(function (tn) {
      var cat = catById(tn.categoryId), zone = zoneById(tn.zoneId);
      return '<tr>' +
        '<td><b>' + tn.brand + '</b><br><span class="muted" style="font-size:.82rem">' + pick(tn.tagline) + '</span></td>' +
        '<td><span class="badge-soft" style="background:' + cat.color + '22;color:' + shade(cat.color) + '">' + cat.icon + ' ' + pick(cat.name) + '</span></td>' +
        '<td>' + (zone ? pick(zone.name) : "-") + '</td>' +
        '<td><b>' + tn.stallCode + '</b></td>' +
        '<td class="flex"><a class="btn btn-ghost btn-sm" href="peta.html?stall=' + tn.stallCode + '">🗺️</a>' +
        '<a class="btn btn-ghost btn-sm" href="tenant-detail.html?slug=' + tn.slug + '">→</a></td>' +
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
      kv("🕒 " + t("open_hours"), pick(DB.event.dayLabel) + " · " + DB.event.startTime + "–" + DB.event.endTime) +
      kv("🗓️ Tanggal", "30 Okt 2026") +
      kv("🏙️ Kota", DB.event.city);
    var tr = document.getElementById("visit-transport");
    if (tr) tr.innerHTML = DB.event.transport.map(function (x) {
      return '<div class="card"><div class="body"><h3>' + x.icon + ' ' + pick(x.label) + '</h3></div></div>';
    }).join("");
    var hrs = document.getElementById("visit-hours");
    if (hrs) hrs.innerHTML = kv(t("open_hours"), DB.event.startTime + "–" + DB.event.endTime) + kv("Hari", pick(DB.event.dayLabel) + ", 30 Okt 2026");
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
      payload.submittedAt = new Date().toISOString();
      payload.status = "review";
      try {
        fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
          .then(function () { ok(t("form_ok")); })
          .catch(function () { localSave(payload); ok(t("form_ok_local")); });
      } catch (err) {
        localSave(payload); ok(t("form_ok_local"));
      }
      function ok(msg) {
        form.reset();
        if (alertBox) { alertBox.className = "alert alert-ok"; alertBox.textContent = msg; alertBox.classList.remove("hidden"); }
        toast(msg);
      }
      function localSave(p) {
        var arr = JSON.parse(localStorage.getItem(LS_APP) || "[]");
        arr.push(p); localStorage.setItem(LS_APP, JSON.stringify(arr));
      }
    });
    window.TN_RERENDER = function () {};
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
      map: initMap, schedule: initSchedule, visit: initVisit, join: initJoin }[page] || function () {})();
  }

  window.TN = {
    setLang: setLang, t: t, pick: pick, rupiah: rupiah, DB: DB,
    tenantCard: tenantCard, catById: catById, zoneById: zoneById, tenantById: tenantById,
    applyI18n: applyI18n, toast: toast
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();