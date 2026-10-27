/* =====================================================================
   Titik Ngemil — Admin Dashboard (client-side, optional D1 sync)
   ===================================================================== */
(function () {
  "use strict";

  var LS_DATA = "tn_admin_data";
  var LS_CFG = "tn_admin_cfg";
  var LS_AUTH = "tn_admin_auth";

  var cfg = JSON.parse(localStorage.getItem(LS_CFG) || '{"apiBase":"","apiToken":""}');
  var db = loadData();
  var firstRun = !localStorage.getItem(LS_DATA);

  function loadData() {
    var raw = localStorage.getItem(LS_DATA);
    if (raw) { try { return JSON.parse(raw); } catch (e) {} }
    return JSON.parse(JSON.stringify(window.TITIK_DB));
  }
  function persist() { localStorage.setItem(LS_DATA, JSON.stringify(db)); }
  function resetData() { db = JSON.parse(JSON.stringify(window.TITIK_DB)); persist(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------------- gate ---------------- */
  function initGate() {
    var auth = {};
    try { auth = JSON.parse(localStorage.getItem("tn_auth") || "{}"); } catch (e) {}
    if (!auth || !auth.role) { location.href = "/masuk"; return; }
    if (auth.role !== "admin") { location.href = "/dashboard/tenant"; return; }
    showApp();
  }
  function showApp() {
    document.getElementById("loginGate").classList.add("hidden");
    document.getElementById("adminApp").classList.remove("hidden");
    boot();
  }

  /* ---------------- boot ---------------- */
  function boot() {
    document.getElementById("logoutBtn").onclick = function () {
      localStorage.removeItem("tn_auth");
      location.href = "/masuk";
    };
    document.getElementById("tabs").onclick = function (e) {
      var b = e.target.closest("[data-tab]"); if (!b) return;
      document.querySelectorAll("#tabs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.querySelectorAll(".tab-pane").forEach(function (p) { p.classList.add("hidden"); });
      document.getElementById("tab-" + b.dataset.tab).classList.remove("hidden");
      renderTab(b.dataset.tab);
    };
    document.getElementById("modalBack").addEventListener("click", function (e) { if (e.target.id === "modalBack") closeModal(); });
    updateModeBadge();
    // dukung deep-link ?tab=persetujuan
    var initial = new URLSearchParams(location.search).get("tab") || "dashboard";
    var btn = document.querySelector('#tabs [data-tab="' + initial + '"]');
    if (btn) { document.querySelectorAll("#tabs button").forEach(function (x) { x.classList.toggle("on", x === btn); });
      document.querySelectorAll(".tab-pane").forEach(function (p) { p.classList.add("hidden"); });
      document.getElementById("tab-" + initial).classList.remove("hidden"); }
    renderTab(initial);
  }
  function updateModeBadge() {
    var b = document.getElementById("modeBadge");
    if (cfg.apiBase) { b.textContent = "Terhubung API"; b.style.background = "#06805f"; b.style.color = "#fff"; }
    else { b.textContent = "Mode Lokal"; b.style.background = "#322d28"; b.style.color = "#ffd166"; }
  }

  function renderTab(tab) {
    ({ dashboard: renderDashboard, sites: renderSites, tenants: renderTenants, stalls: renderStalls,
      schedule: renderSchedule, applications: renderApplications, export: renderExport,
      settings: renderSettings, stats: renderStats }[tab] || function () {})();
  }

  /* ---------------- titik (nama titik editable) ---------------- */
  function renderSites() {
    var el = document.getElementById("tab-sites");
    var list = db.sites || [];
    var rows = list.map(function (s, i) {
      var active = s.status === "active";
      return '<tr>' +
        '<td><b>' + esc(s.name.id) + '</b><br><span class="muted" style="font-size:.82rem">' + esc(s.name.en) + '</span></td>' +
        '<td><span class="pill" style="' + (active ? "background:#e6fbf3;color:#06805f" : "background:#f3eee7;color:#8a817a") + '">' +
          (active ? "Aktif" : "Coming Soon") + '</span></td>' +
        '<td>' + esc(s.city || "—") + '</td>' +
        '<td><b>' + (s.capacity || 0) + '</b> booth</td>' +
        '<td><code style="font-size:.8rem">/titik/' + esc(s.slug) + '</code></td>' +
        '<td><button class="btn btn-ghost btn-sm" data-site-edit="' + i + '">✏️ Ubah</button></td>' +
      '</tr>';
    }).join("");

    el.innerHTML = '<h2>Titik &amp; Nama Lokasi</h2>' +
      '<div class="admin-card" style="padding:0;overflow:hidden"><div class="table-wrap" style="box-shadow:none;border:0">' +
      '<table><thead><tr><th>Nama titik</th><th>Status</th><th>Kota</th><th>Kapasitas</th><th>URL</th><th>Aksi</th></tr></thead><tbody>' +
      rows + '</tbody></table></div></div>' +
      '<div class="admin-card"><h3>Catatan</h3>' +
      '<p class="muted mb0">Saat ini hanya <b>1 titik aktif</b>. Nama titik yang diubah di sini langsung dipakai di beranda, halaman titik, denah, dan dashboard tenant. Titik lain ditampilkan sebagai <b>Coming Soon</b>.</p></div>';

    el.querySelectorAll("[data-site-edit]").forEach(function (b) {
      b.onclick = function () { editSite(+b.dataset.siteEdit); };
    });
  }

  function editSite(i) {
    var s = db.sites[i];
    if (!s) return;
    openModal('<h3>Ubah Titik</h3>' +
      '<p class="muted" style="font-size:.88rem">Slug <code>' + esc(s.slug) + '</code> tidak diubah agar tautan lama tetap jalan.</p>' +
      field("Nama titik (Indonesia)", "siteNameId", s.name.id) +
      field("Nama titik (English)", "siteNameEn", s.name.en) +
      field("Kota", "siteCity", s.city) +
      '<div><label>Status</label><select id="siteStatus">' +
        '<option value="active"' + (s.status === "active" ? " selected" : "") + '>Aktif (tampil sebagai titik berjalan)</option>' +
        '<option value="pending"' + (s.status === "pending" ? " selected" : "") + '>Coming Soon</option>' +
      '</select></div>' +
      field("Kapasitas booth", "siteCap", s.capacity) +
      '<div class="flex" style="margin-top:16px"><button class="btn btn-primary" id="saveSite">Simpan</button>' +
      '<button class="btn btn-ghost" onclick="TNAdmin.closeModal()">Batal</button></div>');
    document.getElementById("saveSite").onclick = function () {
      s.name.id = val("siteNameId").trim() || s.name.id;
      s.name.en = val("siteNameEn").trim() || s.name.id;
      s.city = val("siteCity").trim() || "—";
      s.status = val("siteStatus");
      s.capacity = +val("siteCap") || s.capacity;
      touch(); closeModal(); renderSites(); toast("Titik disimpan.");
    };
  }

  /* ---------------- stats (statistik pengunjung) ---------------- */
  function renderStats() {
    var el = document.getElementById("tab-stats");
    var sites = db.sites || [];
    var rows = sites.map(function (s, i) {
      var unik = s.status === "active" ? 42 + (i * 7) : 0;
      var busy = s.status === "active" ? "17.00–19.00" : "—";
      var qr = s.status === "active" ? 128 : 0, man = s.status === "active" ? 37 : 0;
      return '<tr><td><b>' + s.name.id + '</b></td><td>' + (s.status === "active" ? "Aktif" : "Pending") + '</td>' +
        '<td>' + unik + '</td><td>' + busy + '</td><td>' + qr + '</td><td>' + man + '</td></tr>';
    }).join("");
    el.innerHTML = '<h2>Statistik Pengunjung</h2>' +
      '<div class="admin-card"><p class="muted">Data indikatif (tanpa QR check-in; QR dinonaktifkan untuk titik di area stasiun).</p>' +
      '<div class="table-wrap" style="box-shadow:none"><table><thead><tr><th>Titik</th><th>Status</th><th>Est. pengunjung unik</th><th>Jam ramai</th><th>Digital (QR)</th><th>Manual</th></tr></thead><tbody>' +
      rows + '</tbody></table></div></div>' +
      '<div class="admin-card"><h3>Catatan</h3><p class="muted mb0">Karena QR check-in belum diaktifkan, kolom digital/manual diisi manual. Saat QR diaktifkan, data akan terisi otomatis dari endpoint <code>/q/[kode]</code>.</p></div>';
  }

  /* ---------------- persetujuan (approval) ---------------- */
  function getApprovals() {
    var local = JSON.parse(localStorage.getItem("tn_applications") || "[]");
    var seed = (db.applications || []);
    // gabung: seed aplikasi + pendaftaran lokal
    var all = seed.concat(local);
    return all;
  }
  function saveApprovals(list) {
    // simpan hanya yang berasal dari seed (agar tidak duplikat), lokal tetap di tn_applications
    var seed = list.filter(function (a) { return String(a.id).indexOf("APP-2026-") === 0; });
    db.applications = seed;
    persist();
  }
  function renderApplications() {
    var el = document.getElementById("tab-applications");
    var apps = getApprovals();
    var stageBadge = { terkirim: "#8a817a", ditinjau: "#3aa8c1", verifikasi: "#f4a259",
      "disetujui": "#06805f", "perlu-revisi": "#b3203c", "ditolak": "#b3203c" };
    el.innerHTML = '<div class="flex between" style="margin-bottom:14px"><h2 class="mb0">Persetujuan Tenant</h2>' +
      '<span class="pill">' + apps.filter(function (a) { return ["terkirim","ditinjau","verifikasi"].indexOf(a.stage) !== -1; }).length + ' menunggu</span></div>' +
      (apps.length ? '<div class="table-wrap"><table><thead><tr><th>Brand</th><th>Kategori</th><th>Kontak</th><th>Tahap</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody>' +
        apps.map(function (a, i) {
          var col = stageBadge[a.stage] || "#8a817a";
          return '<tr><td><b>' + esc(a.brand_name) + '</b><br><span class="muted" style="font-size:.78rem">' + esc(a.id) + '</span></td>' +
            '<td>' + esc(a.category) + '</td>' +
            '<td>' + esc(a.contact_name) + '<br><span class="muted" style="font-size:.78rem">' + esc(a.phone) + '</span></td>' +
            '<td><span class="badge-soft" style="background:' + col + '22;color:' + col + '">' + esc(a.stage) + '</span></td>' +
            '<td style="max-width:200px"><span class="muted" style="font-size:.82rem">' + esc(a.note || a.pitch || "") + '</span></td>' +
            '<td class="flex">' +
              '<button class="btn btn-ghost btn-sm" data-approve="' + i + '" style="color:#06805f">Setujui</button>' +
              '<button class="btn btn-ghost btn-sm" data-revise="' + i + '" style="color:#b3203c">Revisi</button>' +
              '<button class="btn btn-ghost btn-sm" data-reject="' + i + '" style="color:#b3203c">Tolak</button>' +
            '</td></tr>';
        }).join("") + '</tbody></table></div>'
        : '<div class="admin-card"><p class="muted mb0">Belum ada pendaftaran.</p></div>');
    function setStage(i, stage, note) {
      var list = getApprovals(); list[i].stage = stage;
      if (note !== undefined) list[i].note = note;
      db.applications = list.filter(function (a) { return String(a.id).indexOf("APP-2026-") === 0; }); persist();
      var idx = i; // if index beyond db.applications, it's a local one
      if (String(list[i].id).indexOf("APP-2026-") !== 0) {
        var local = JSON.parse(localStorage.getItem("tn_applications") || "[]");
        var j = local.findIndex(function (x) { return x.id === list[i].id; });
        if (j >= 0) { local[j].stage = stage; if (note !== undefined) local[j].note = note; localStorage.setItem("tn_applications", JSON.stringify(local)); }
      }
      toast("Status diubah: " + stage); renderApplications();
    }
    el.querySelectorAll("[data-approve]").forEach(function (b) { b.onclick = function () {
      var list = getApprovals(); var a = list[+b.dataset.approve];
      var booth = prompt("Nomor booth untuk " + a.brand_name + ":", a.booth || "26");
      setStage(+b.dataset.approve, "disetujui", a.note || ""); 
      var l2 = getApprovals(); l2[+b.dataset.approve].booth = booth ? +booth : null; db.applications = l2.filter(function (x){ return String(x.id).indexOf("APP-2026-")===0; }); persist();
    }; });
    el.querySelectorAll("[data-revise]").forEach(function (b) { b.onclick = function () {
      var note = prompt("Alasan revisi:", "Data belum lengkap");
      setStage(+b.dataset.revise, "perlu-revisi", note || "Data belum lengkap");
    }; });
    el.querySelectorAll("[data-reject]").forEach(function (b) { b.onclick = function () {
      var note = prompt("Alasan penolakan:", "Tidak sesuai kriteria kurasi");
      setStage(+b.dataset.reject, "ditolak", note || "Tidak sesuai kriteria");
    }; });
  }

  /* ---------------- dashboard ---------------- */
  function renderDashboard() {
    var el = document.getElementById("tab-dashboard");
    var byCat = db.categories.map(function (c) { return { name: c.name.id, n: db.tenants.filter(function (t) { return t.categoryId === c.id; }).length, icon: c.icon }; });
    var byZone = db.zones.map(function (z) { return { name: z.name.id, n: db.tenants.filter(function (t) { return t.zoneId === z.id; }).length }; });
    var apps = getApplications().length;
    el.innerHTML =
      '<h2 style="margin-bottom:1em">Dashboard</h2>' +
      '<div class="stat-cards">' +
        statCard(db.tenants.length, "Tenant") +
        statCard(db.stalls.length, "Lapak") +
        statCard(db.zones.length, "Zona") +
        statCard(apps, "Pendaftaran") +
      '</div>' +
      '<div class="admin-card"><h3>Distribusi Kategori</h3>' + barList(byCat, "icon") + '</div>' +
      '<div class="admin-card"><h3>Distribusi Zona</h3>' + barList(byZone) + '</div>' +
      '<div class="admin-card"><h3>Info Event</h3>' +
        '<div class="kv">' +
          kvRow("Edisi", db.event.name.id) +
          kvRow("Tanggal", "30 Oktober 2026, " + db.event.startTime + "–" + db.event.endTime) +
          kvRow("Lokasi", db.event.venueName.id) +
          kvRow("Data terakhir diubah", db.updatedAt) +
        '</div></div>';
  }
  function statCard(n, label) { return '<div class="admin-card"><b>' + n + '</b><span class="muted">' + label + '</span></div>'; }
  function barList(items, iconKey) {
    var max = Math.max.apply(null, items.map(function (i) { return i.n; }).concat([1]));
    return items.map(function (i) {
      return '<div style="margin-bottom:10px"><div class="flex between" style="font-size:.86rem"><span>' + (iconKey ? i[iconKey] + " " : "") + i.name + '</span><b>' + i.n + '</b></div>' +
        '<div style="height:8px;background:#f0e6d8;border-radius:99px;overflow:hidden"><div style="width:' + (i.n / max * 100) + '%;height:100%;background:var(--brand)"></div></div></div>';
    }).join("");
  }
  function kvRow(k, v) { return '<div class="kv-row"><span>' + k + '</span><b>' + v + '</b></div>'; }

  /* ---------------- tenants ---------------- */
  function renderTenants() {
    var el = document.getElementById("tab-tenants");
    el.innerHTML =
      '<div class="flex between" style="margin-bottom:14px"><h2 class="mb0">Kelola Tenant</h2>' +
      '<button class="btn btn-primary btn-sm" id="addTenant">+ Tambah Tenant</button></div>' +
      '<div class="admin-card" style="padding:0;overflow:hidden"><div class="table-wrap" style="box-shadow:none;border:0">' +
      '<table><thead><tr><th>Brand</th><th>Kategori</th><th>Zona</th><th>Lapak</th><th>Menu</th><th></th></tr></thead><tbody>' +
      db.tenants.map(function (t, i) {
        var c = db.categories.find(function (x) { return x.id === t.categoryId; }) || { name: { id: "-" }, icon: "" };
        var z = db.zones.find(function (x) { return x.id === t.zoneId; }) || { name: { id: "-" } };
        return '<tr><td><b>' + t.brand + '</b><br><span class="muted" style="font-size:.78rem">/' + t.slug + '</span></td>' +
          '<td>' + c.icon + ' ' + c.name.id + '</td><td>' + z.name.id + '</td><td><b>' + t.stallCode + '</b></td>' +
          '<td>' + t.menu.length + '</td>' +
          '<td class="flex"><button class="btn btn-ghost btn-sm" data-edit="' + i + '">Edit</button>' +
          '<button class="btn btn-ghost btn-sm" data-del="' + i + '" style="color:#b3203c">Hapus</button></td></tr>';
      }).join("") +
      '</tbody></table></div></div>';
    document.getElementById("addTenant").onclick = function () { editTenant(-1); };
    el.querySelectorAll("[data-edit]").forEach(function (b) { b.onclick = function () { editTenant(+b.dataset.edit); }; });
    el.querySelectorAll("[data-del]").forEach(function (b) { b.onclick = function () {
      if (!confirm("Hapus tenant ini?")) return;
      db.tenants.splice(+b.dataset.del, 1); touch(); renderTenants();
    }; });
  }

  function editTenant(index) {
    var isNew = index < 0;
    var t = isNew ? blankTenant() : clone(db.tenants[index]);
    var cats = db.categories.map(function (c) { return '<option value="' + c.id + '"' + (c.id === t.categoryId ? " selected" : "") + '>' + c.icon + " " + c.name.id + '</option>'; }).join("");
    var zones = db.zones.map(function (z) { return '<option value="' + z.id + '"' + (z.id === t.zoneId ? " selected" : "") + '>' + z.name.id + '</option>'; }).join("");
    var stalls = db.stalls.map(function (s) { return '<option value="' + s.code + '"' + (s.code === t.stallCode ? " selected" : "") + '>' + s.code + " · " + s.zoneId + '</option>'; }).join("");
    openModal(
      '<h3>' + (isNew ? "Tambah Tenant" : "Edit Tenant") + '</h3>' +
      '<div class="editor-row">' +
        field("Brand", "f_brand", t.brand) +
        field("Slug (URL)", "f_slug", t.slug) +
        select("Kategori", "f_cat", cats) +
        select("Zona", "f_zone", zones) +
        select("Lapak", "f_stall", stalls) +
        field("Instagram", "f_ig", t.instagram || "") +
        field("WhatsApp", "f_wa", t.whatsapp || "") +
        field("Tagline (ID)", "f_tagid", t.tagline.id) +
        field("Tagline (EN)", "f_tagen", t.tagline.en) +
      '</div>' +
      '<label style="margin-top:12px">Deskripsi (ID)</label><textarea id="f_descid">' + esc(t.desc.id) + '</textarea>' +
      '<label style="margin-top:12px">Deskripsi (EN)</label><textarea id="f_descen">' + esc(t.desc.en) + '</textarea>' +
      '<label style="margin-top:12px">Cerita (ID)</label><textarea id="f_storyid">' + esc((t.story && t.story.id) || "") + '</textarea>' +
      '<label style="margin-top:12px">Cerita (EN)</label><textarea id="f_storyen">' + esc((t.story && t.story.en) || "") + '</textarea>' +
      '<h4 style="margin-top:20px">Menu (' + t.menu.length + ')</h4>' +
      '<div id="menuRows"></div>' +
      '<button class="btn btn-ghost btn-sm" id="addMenu" style="margin-top:8px">+ Tambah Menu</button>' +
      '<div class="flex" style="margin-top:22px;justify-content:flex-end"><button class="btn btn-ghost" onclick="TNAdmin.closeModal()">Batal</button>' +
      '<button class="btn btn-primary" id="saveTenant">Simpan</button></div>'
    );
    var menuRows = document.getElementById("menuRows");
    function drawMenu() {
      menuRows.innerHTML = t.menu.map(function (m, i) {
        return '<div class="admin-card" style="padding:12px;margin-bottom:8px;background:#faf6f0">' +
          '<div class="editor-row">' +
          '<input placeholder="Nama menu" value="' + esc(m.name) + '" data-mn="' + i + '">' +
          '<input placeholder="Harga (angka)" type="number" value="' + m.price + '" data-mp="' + i + '">' +
          '</div><div class="flex" style="margin-top:6px">' +
          '<label style="font-weight:600;font-size:.82rem"><input type="checkbox" style="width:auto;margin-right:6px"' + (m.signature ? " checked" : "") + ' data-ms="' + i + '"> Signature</label>' +
          '<button class="btn btn-ghost btn-sm" data-md="' + i + '" style="margin-left:auto;color:#b3203c">Hapus</button></div></div>';
      }).join("") || '<p class="muted" style="font-size:.88rem">Belum ada menu.</p>';
      menuRows.querySelectorAll("[data-mn]").forEach(function (inp) { inp.oninput = function () { t.menu[+inp.dataset.mn].name = inp.value; }; });
      menuRows.querySelectorAll("[data-mp]").forEach(function (inp) { inp.oninput = function () { t.menu[+inp.dataset.mp].price = +inp.value || 0; }; });
      menuRows.querySelectorAll("[data-ms]").forEach(function (inp) { inp.onchange = function () { t.menu[+inp.dataset.ms].signature = inp.checked; }; });
      menuRows.querySelectorAll("[data-md]").forEach(function (b) { b.onclick = function () { t.menu.splice(+b.dataset.md, 1); persist(); drawMenu(); }; });
    }
    drawMenu();
    document.getElementById("addMenu").onclick = function () {
      t.menu.push({ name: "Menu Baru", price: 0, desc: { id: "", en: "" }, signature: false, available: true }); persist(); drawMenu();
    };
    document.getElementById("saveTenant").onclick = function () {
      t.brand = val("f_brand"); t.slug = val("f_slug") || slugify(t.brand);
      t.categoryId = val("f_cat"); t.zoneId = val("f_zone"); t.stallCode = val("f_stall");
      t.instagram = val("f_ig"); t.whatsapp = val("f_wa");
      t.tagline = { id: val("f_tagid"), en: val("f_tagen") };
      t.desc = { id: val("f_descid"), en: val("f_descen") };
      t.story = { id: val("f_storyid"), en: val("f_storyen") };
      if (isNew) db.tenants.push(t); else db.tenants[index] = t;
      touch(); closeModal(); renderTenants(); toast("Tenant disimpan.");
    };
  }
  function blankTenant() {
    return { slug: "", brand: "", categoryId: db.categories[0].id, zoneId: db.zones[0].id, stallCode: db.stalls[0].code,
      tagline: { id: "", en: "" }, desc: { id: "", en: "" }, story: { id: "", en: "" }, instagram: "", whatsapp: "",
      halal: true, tags: [], menu: [] };
  }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function field(label, id, v) { return '<div><label>' + label + '</label><input id="' + id + '" value="' + esc(v) + '"></div>'; }
  function select(label, id, opts) { return '<div><label>' + label + '</label><select id="' + id + '">' + opts + '</select></div>'; }
  function val(id) { var e = document.getElementById(id); if (!e) return ""; if (e.tagName === "SELECT") return e.value; return e.value; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // admin memakai bahasa Indonesia untuk label data bilingual
  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj.id != null ? obj.id : (obj.en != null ? obj.en : "");
  }

  /* ---------------- stalls → Jadwal Rotasi & Slot ---------------- */
  var rotDay = (function () {
    var open = (db.days || []).filter(function (d) { return !d.closed; });
    var saved = localStorage.getItem("tn_rot_day");
    // abaikan hari tersimpan yang sekarang sudah libur (mis. sisa sesi lama)
    if (saved && open.some(function (d) { return d.id === saved; })) return saved;
    return (open[0] || { id: "jumat" }).id;
  })();
  function renderStalls() {
    var el = document.getElementById("tab-stalls");
    var days = db.days || [];
    var tenants = db.tenants || [];
    var active = tenants.filter(function (t) { return (t.days || []).indexOf(rotDay) !== -1; });
    var capacity = (db.sites && db.sites[0] && db.sites[0].capacity) || db.stalls.length || 24;
    var filled = active.length;

    var pills = days.map(function (d) {
      var on = d.id === rotDay;
      var closed = !!d.closed;
      return '<button class="btn ' + (on ? "btn-primary" : "btn-ghost") + ' btn-sm" ' +
        (closed ? 'disabled style="opacity:.45;cursor:not-allowed"' : 'data-rotday="' + d.id + '"') + '>' +
        d.label.id + (closed ? " (libur)" : "") + '</button>';
    }).join("");

    var rows = db.stalls.map(function (s) {
      var t = tenants.find(function (x) { return x.stallCode === s.code; });
      var onThisDay = t && (t.days || []).indexOf(rotDay) !== -1;
      var st = { buka: "BUKA", tutup: "TUTUP", habis: "HABIS" }[(t && t.boothStatus) || "buka"];
      var stCol = { buka: "#06805f", tutup: "#8a817a", habis: "#b3203c" }[(t && t.boothStatus) || "buka"];
      return '<tr><td><b>Booth ' + s.no + '</b><br><span class="muted" style="font-size:.75rem">' + s.code + '</span></td>' +
        '<td>' + (t ? t.brand : '<span class="muted">— kosong —</span>') + '</td>' +
        '<td>' + (t ? '<span class="badge-soft" style="background:' + stCol + '22;color:' + stCol + '">' + st + '</span>' : "-") + '</td>' +
        '<td>' + (t ? '<input type="checkbox" style="width:auto"' + (onThisDay ? " checked" : "") + ' data-rotd="' + s.code + '">' : "-") + '</td>' +
        '<td class="flex"><button class="btn btn-ghost btn-sm" data-rotedit="' + s.code + '">Ubah Pola</button></td></tr>';
    }).join("");

    el.innerHTML =
      '<div class="flex between" style="margin-bottom:14px"><h2 class="mb0">Jadwal Rotasi &amp; Slot</h2>' +
      '<span class="pill"><b>' + filled + '</b>/' + capacity + ' slot terisi</span></div>' +
      '<div class="admin-card"><h3>Pilih titik dan hari</h3>' +
        '<p class="muted" style="font-size:.88rem">Titik: <b>' + pick(siteBySlug("gondangdia").name) + '</b> · Hari event: Jumat (satu hari).</p>' +
        '<div class="flex">' + pills + '</div></div>' +
      '<div class="admin-card" style="padding:0;overflow:hidden"><div class="table-wrap" style="box-shadow:none;border:0">' +
        '<table><thead><tr><th>Booth</th><th>Tenant</th><th>Status</th><th>Beroperasi hari ini</th><th>Aksi</th></tr></thead><tbody>' +
        rows + '</tbody></table></div></div>' +
      '<div class="admin-card"><h3>Zona &amp; Sebaran Lapak</h3>' +
        db.zones.map(function (z) {
          var n = db.stalls.filter(function (s) { return s.zoneId === z.id; }).length;
          return '<div class="flex between" style="font-size:.88rem;padding:6px 0"><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' + z.color + ';margin-right:8px"></span>' + z.name.id + '</span><span class="pill">' + n + ' lapak</span></div>';
        }).join("") +
      '</div>';

    el.querySelectorAll("[data-rotday]").forEach(function (b) { b.onclick = function () {
      rotDay = b.dataset.rotday; localStorage.setItem("tn_rot_day", rotDay); renderStalls();
    }; });
    el.querySelectorAll("[data-rotd]").forEach(function (c) { c.onchange = function () {
      var t = tenants.find(function (x) { return x.stallCode === c.dataset.rotd; });
      if (!t) return;
      t.days = t.days || [];
      var i = t.days.indexOf(rotDay);
      if (c.checked && i === -1) t.days.push(rotDay);
      if (!c.checked && i !== -1) t.days.splice(i, 1);
      touch(); renderStalls();
    }; });
    el.querySelectorAll("[data-rotedit]").forEach(function (b) { b.onclick = function () {
      var t = tenants.find(function (x) { return x.stallCode === b.dataset.rotedit; });
      if (!t) { alert("Booth kosong, tidak ada pola rotasi."); return; }
      openModal('<h3>Ubah Pola Rotasi — ' + esc(t.brand) + '</h3>' +
        '<p class="muted" style="font-size:.88rem">Booth ' + boothNoOf(t.stallCode) + ' · ' + pick(siteBySlug("gondangdia").name) + '</p>' +
        '<div class="flex" style="flex-wrap:wrap;gap:8px">' +
          days.filter(function (d) { return !d.closed; }).map(function (d) {
            return '<label style="font-weight:600"><input type="checkbox" style="width:auto;margin-right:6px" data-modald="' + d.id + '"' + ((t.days || []).indexOf(d.id) !== -1 ? " checked" : "") + '>' + d.label.id + '</label>';
          }).join("") +
        '</div>' +
        '<div class="flex" style="margin-top:22px;justify-content:flex-end"><button class="btn btn-ghost" onclick="TNAdmin.closeModal()">Batal</button>' +
        '<button class="btn btn-primary" id="saveRot">Simpan Pola</button></div>');
      document.getElementById("saveRot").onclick = function () {
        t.days = [].slice.call(document.querySelectorAll("[data-modald]")).filter(function (c) { return c.checked; }).map(function (c) { return c.dataset.modald; });
        touch(); closeModal(); renderStalls(); toast("Pola rotasi diperbarui.");
      };
    }; });
  }
  function boothNoOf(code) { var s = (db.stalls || []).find(function (x) { return x.code === code; }); return s && s.no ? s.no : code; }
  function siteBySlug(slug) {
    var list = db.sites || [];
    return list.find(function (x) { return x.slug === slug; }) || list[0] || { name: { id: "-", en: "-" } };
  }

  /* ---------------- schedule ---------------- */
  function renderSchedule() {
    var el = document.getElementById("tab-schedule");
    el.innerHTML =
      '<div class="flex between" style="margin-bottom:14px"><h2 class="mb0">Jadwal Acara</h2>' +
      '<button class="btn btn-primary btn-sm" id="addSched">+ Tambah Acara</button></div>' +
      db.schedule.map(function (s, i) {
        return '<div class="admin-card"><div class="flex between"><div>' +
          '<div class="type" style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--brand)">' + s.type + ' · ' + s.time + '–' + s.endTime + '</div>' +
          '<h3 class="mb0">' + s.title.id + '</h3><p class="muted mb0" style="font-size:.88rem">' + s.desc.id + '</p></div>' +
          '<div class="flex"><button class="btn btn-ghost btn-sm" data-se="' + i + '">Edit</button>' +
          '<button class="btn btn-ghost btn-sm" data-sd="' + i + '" style="color:#b3203c">Hapus</button></div></div></div>';
      }).join("");
    document.getElementById("addSched").onclick = function () { editSchedule(-1); };
    el.querySelectorAll("[data-se]").forEach(function (b) { b.onclick = function () { editSchedule(+b.dataset.se); }; });
    el.querySelectorAll("[data-sd]").forEach(function (b) { b.onclick = function () { if (confirm("Hapus acara?")) { db.schedule.splice(+b.dataset.sd, 1); touch(); renderSchedule(); } }; });
  }
  function editSchedule(i) {
    var isNew = i < 0;
    var s = isNew ? { id: "s" + Date.now(), time: "14:00", endTime: "15:00", type: "music", stage: "Panggung Ngemil", title: { id: "", en: "" }, desc: { id: "", en: "" } } : clone(db.schedule[i]);
    var types = ["opening", "music", "talk", "workshop", "quiz", "other"].map(function (x) { return '<option' + (x === s.type ? " selected" : "") + '>' + x + '</option>'; }).join("");
    openModal('<h3>' + (isNew ? "Tambah Acara" : "Edit Acara") + '</h3>' +
      '<div class="editor-row">' +
      field("Jam Mulai", "s_time", s.time) + field("Jam Selesai", "s_end", s.endTime) +
      select("Jenis", "s_type", types) + field("Panggung/Area", "s_stage", s.stage) +
      field("Judul (ID)", "s_tid", s.title.id) + field("Judul (EN)", "s_ten", s.title.en) +
      '</div>' +
      '<label style="margin-top:12px">Deskripsi (ID)</label><textarea id="s_did">' + esc(s.desc.id) + '</textarea>' +
      '<label style="margin-top:12px">Deskripsi (EN)</label><textarea id="s_den">' + esc(s.desc.en) + '</textarea>' +
      '<div class="flex" style="margin-top:22px;justify-content:flex-end"><button class="btn btn-ghost" onclick="TNAdmin.closeModal()">Batal</button>' +
      '<button class="btn btn-primary" id="saveSched">Simpan</button></div>');
    document.getElementById("saveSched").onclick = function () {
      s.time = val("s_time"); s.endTime = val("s_end"); s.type = val("s_type"); s.stage = val("s_stage");
      s.title = { id: val("s_tid"), en: val("s_ten") }; s.desc = { id: val("s_did"), en: val("s_den") };
      if (isNew) db.schedule.push(s); else db.schedule[i] = s;
      db.schedule.sort(function (a, b) { return a.time.localeCompare(b.time); });
      touch(); closeModal(); renderSchedule(); toast("Jadwal disimpan.");
    };
  }

  /* ---------------- applications ---------------- */
  function getApplications() { return JSON.parse(localStorage.getItem("tn_applications") || "[]"); }

  /* ---------------- export ---------------- */
  function renderExport() {
    var el = document.getElementById("tab-export");
    el.innerHTML =
      '<h2>Export & Deploy</h2>' +
      '<div class="admin-card"><h3>1. Unduh data situs (<code>db.js</code>)</h3>' +
      '<p class="muted">Timpa file <code>public/data/db.js</code> di repo dengan file ini, lalu commit. Cloudflare akan otomatis men-deploy ulang.</p>' +
      '<div class="flex"><button class="btn btn-primary" id="dlDb">⬇️ Unduh db.js</button>' +
      '<button class="btn btn-ghost" id="copyDb">📋 Copy isi db.js</button></div></div>' +
      '<div class="admin-card"><h3>2. Unduh seed database (<code>seed.sql</code>)</h3>' +
      '<p class="muted">Jalankan ke Cloudflare D1: <code>wrangler d1 execute titik-ngemil-db --remote --file=./seed.sql</code></p>' +
      '<button class="btn btn-primary" id="dlSql">⬇️ Unduh seed.sql</button></div>' +
      '<div class="admin-card"><h3>3. Push langsung ke D1 (opsional)</h3>' +
      '<p class="muted">Butuh API Base URL & Token di Pengaturan.</p>' +
      '<button class="btn btn-ghost" id="pushApi">⬆️ Push ke API/D1</button></div>';
    document.getElementById("dlDb").onclick = function () { download("db.js", genDbJs()); };
    document.getElementById("dlSql").onclick = function () { download("seed.sql", genSeedSql()); };
    document.getElementById("copyDb").onclick = function () { navigator.clipboard.writeText(genDbJs()).then(function () { toast("Isi db.js disalin."); }); };
    document.getElementById("pushApi").onclick = pushToApi;
  }

  function genDbJs() {
    var payload = clone(db); payload.updatedAt = new Date().toISOString().slice(0, 10);
    return '/* Titik Ngemil - dataset (dibuat dari Admin Dashboard ' + new Date().toISOString() + ') */\n' +
      '(function (root, factory) {\n' +
      '  var DB = factory();\n' +
      '  if (typeof module !== "undefined" && module.exports) module.exports = DB;\n' +
      '  if (typeof root !== "undefined") root.TITIK_DB = DB;\n' +
      '})(typeof globalThis !== "undefined" ? globalThis : this, function () {\n' +
      '  "use strict";\n' +
      '  return ' + JSON.stringify(payload, null, 2) + ';\n' +
      '});\n';
  }
  function genSeedSql() {
    var s = [];
    s.push("-- Titik Ngemil — seed data (generated " + new Date().toISOString() + ")");
    s.push("DELETE FROM menu_items; DELETE FROM tenants; DELETE FROM stalls; DELETE FROM zones; DELETE FROM categories; DELETE FROM schedule_items; DELETE FROM events;");
    s.push(sqlEvent(db.event));
    // titik (multi-lokasi) — nama titik bisa diubah admin
    (db.sites || []).forEach(function (st, i) {
      s.push("INSERT INTO sites (id,slug,status,city,name_id,name_en,blurb_id,blurb_en,address,maps_url,capacity,open_time,close_time,launch_date,sort) VALUES (" +
        [q(st.id), q(st.slug), q(st.status), q(st.city), q(st.name.id), q(st.name.en), q((st.blurb || {}).id || ""), q((st.blurb || {}).en || ""),
         q(st.address || ""), q(st.mapsUrl || ""), st.capacity, q(st.openTime || ""), q(st.closeTime || ""), q(st.launchDate), i].join(",") + ");");
    });
    db.categories.forEach(function (c) { s.push("INSERT INTO categories (id,name_id,name_en,icon,color) VALUES (" + q(c.id) + "," + q(c.name.id) + "," + q(c.name.en) + "," + q(c.icon) + "," + q(c.color) + ");"); });
    db.zones.forEach(function (z) { s.push("INSERT INTO zones (id,event_id,name_id,name_en,type,color,blurb_id,blurb_en,pos_x,pos_y,pos_w,pos_h) VALUES (" + q(z.id) + "," + q(db.event.id) + "," + q(z.name.id) + "," + q(z.name.en) + "," + q(z.type) + "," + q(z.color) + "," + q(z.blurb.id) + "," + q(z.blurb.en) + "," + z.area.x + "," + z.area.y + "," + z.area.w + "," + z.area.h + ");"); });
    db.stalls.forEach(function (st) { s.push("INSERT INTO stalls (code,no,event_id,site_id,zone_id,label,pos_x,pos_y,pos_w,pos_h,booth_status) VALUES (" + q(st.code) + "," + (st.no || 0) + "," + q(db.event.id) + "," + q(db.activeSite || "gondangdia") + "," + q(st.zoneId) + "," + q(st.label) + "," + st.x + "," + st.y + "," + st.w + "," + st.h + "," + q(st.boothStatus || "buka") + ");"); });
    db.tenants.forEach(function (t) {
      s.push("INSERT INTO tenants (slug,event_id,brand,category_id,zone_id,stall_code,tagline_id,tagline_en,desc_id,desc_en,story_id,story_en,instagram,whatsapp,halal,tags,site_id,booth_status,verification) VALUES (" +
        [q(t.slug), q(db.event.id), q(t.brand), q(t.categoryId), q(t.zoneId), q(t.stallCode), q(t.tagline.id), q(t.tagline.en), q(t.desc.id), q(t.desc.en), q((t.story || {}).id || ""), q((t.story || {}).en || ""), q(t.instagram || ""), q(t.whatsapp || ""), t.halal ? 1 : 0, q((t.tags || []).join(",")), q(db.activeSite || "gondangdia"), q(t.boothStatus || "buka"), q(t.verification || "disetujui")].join(",") + ");");
      (t.days || []).forEach(function (d) {
        s.push("INSERT INTO tenant_days (tenant_slug,day) VALUES (" + q(t.slug) + "," + q(d) + ");");
      });
      t.menu.forEach(function (m, i) {
        s.push("INSERT INTO menu_items (tenant_slug,name,price,desc_id,desc_en,is_signature,is_available,sort) VALUES (" +
          [q(t.slug), q(m.name), m.price, q(m.desc.id), q(m.desc.en), m.signature ? 1 : 0, m.available === false ? 0 : 1, i].join(",") + ");");
      });
    });
    db.schedule.forEach(function (it, i) {
      s.push("INSERT INTO schedule_items (event_id,day,start_time,end_time,type,stage,title_id,title_en,desc_id,desc_en,sort) VALUES (" +
        [q(db.event.id), q(db.event.date), q(it.time), q(it.endTime), q(it.type), q(it.stage), q(it.title.id), q(it.title.en), q(it.desc.id), q(it.desc.en), i].join(",") + ");");
    });
    return s.join("\n") + "\n";
  }
  function sqlEvent(e) {
    return "INSERT INTO events (id,slug,name_id,name_en,theme_id,theme_en,event_date,start_time,end_time,venue_id,venue_en,address,city,maps_url,hashtag,status) VALUES (" +
      [q(e.id), q(e.slug), q(e.name.id), q(e.name.en), q(e.theme.id), q(e.theme.en), q(e.date), q(e.startTime), q(e.endTime), q(e.venueName.id), q(e.venueName.en), q(e.address), q(e.city), q(e.mapsUrl), q(e.hashtag), q(e.status)].join(",") + ");";
  }
  function q(v) { if (v === null || v === undefined) return "NULL"; return "'" + String(v).replace(/'/g, "''") + "'"; }

  function pushToApi() {
    if (!cfg.apiBase) { alert("Atur API Base URL & Token di tab Pengaturan dulu."); return; }
    fetch(cfg.apiBase + "/api/admin/sync", { method: "POST", headers: authHeaders(), body: JSON.stringify(db) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function () { toast("Data berhasil di-push ke API/D1."); })
      .catch(function () { alert("Gagal push ke API. Cek URL/token."); });
  }
  function authHeaders() { return { "Content-Type": "application/json", "Authorization": "Bearer " + (cfg.apiToken || "") }; }
  function download(name, content) {
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
    toast(name + " diunduh.");
  }

  /* ---------------- settings ---------------- */
  function renderSettings() {
    var el = document.getElementById("tab-settings");
    el.innerHTML = '<h2>Pengaturan</h2>' +
      '<div class="admin-card"><h3>Koneksi API / D1</h3>' +
      '<label>API Base URL</label><input id="cfgBase" placeholder="https://titik-ngemil.pages.dev" value="' + esc(cfg.apiBase) + '">' +
      '<label style="margin-top:12px">Admin Token</label><input id="cfgToken" placeholder="token rahasia" value="' + esc(cfg.apiToken) + '">' +
      '<p class="form-note">Token disimpan di browser ini & dikirim sebagai header Authorization ke endpoint admin.</p>' +
      '<button class="btn btn-primary" id="saveCfg" style="margin-top:12px">Simpan Pengaturan</button></div>' +
      '<div class="admin-card"><h3>Data</h3>' +
      '<p class="muted">Data admin tersimpan di browser (localStorage). Reset akan mengembalikan ke data awal dari <code>db.js</code>.</p>' +
      '<div class="flex"><button class="btn btn-ghost" id="exportJson">⬇️ Backup JSON</button>' +
      '<button class="btn btn-ghost" id="importJson">⬆️ Restore JSON</button>' +
      '<button class="btn btn-ghost" id="resetBtn" style="color:#b3203c;border-color:#ffc4cf">Reset ke Data Awal</button></div>' +
      '<input type="file" id="fileInput" accept=".json" class="hidden"></div>' +
      '<div class="admin-card"><h3>Info</h3><div class="kv">' +
      kvRow("Versi", "Admin v1.0") + kvRow("Mode", cfg.apiBase ? "API/D1" : "Lokal") + kvRow("Jumlah tenant", db.tenants.length) +
      '</div></div>';
    document.getElementById("saveCfg").onclick = function () {
      cfg.apiBase = val("cfgBase").replace(/\/$/, ""); cfg.apiToken = val("cfgToken");
      localStorage.setItem(LS_CFG, JSON.stringify(cfg)); updateModeBadge(); toast("Pengaturan disimpan.");
    };
    document.getElementById("exportJson").onclick = function () { download("titik-ngemil-backup.json", JSON.stringify(db, null, 2)); };
    document.getElementById("resetBtn").onclick = function () { if (confirm("Reset ke data awal?")) { resetData(); renderSettings(); toast("Data direset."); } };
    document.getElementById("importJson").onclick = function () { document.getElementById("fileInput").click(); };
    document.getElementById("fileInput").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { try { db = JSON.parse(r.result); persist(); renderSettings(); toast("Data dipulihkan."); } catch (err) { alert("File tidak valid."); } };
      r.readAsText(f);
    };
  }

  /* ---------------- modal & utils ---------------- */
  function openModal(html) { document.getElementById("modalBody").innerHTML = html; document.getElementById("modalBack").classList.add("open"); }
  function closeModal() { document.getElementById("modalBack").classList.remove("open"); }
  function touch() { db.updatedAt = new Date().toISOString().slice(0, 10); persist(); }
  var toastEl;
  function toast(m) {
    toastEl = toastEl || document.getElementById("toast");
    toastEl.textContent = m; toastEl.classList.add("show");
    setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  window.TNAdmin = { closeModal: closeModal, reset: resetData, db: function () { return db; } };
  if (firstRun) { /* data awal dari db.js sudah dimuat */ }
  initGate();
})();