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
    if (localStorage.getItem(LS_AUTH) === "1") return showApp();
    document.getElementById("gateBtn").onclick = function () {
      var v = document.getElementById("gatePass").value.trim();
      if (!v) { alert("Masukkan kata sandi (apa saja untuk demo)."); return; }
      localStorage.setItem(LS_AUTH, "1");
      showApp();
    };
    document.getElementById("gatePass").addEventListener("keydown", function (e) { if (e.key === "Enter") document.getElementById("gateBtn").click(); });
  }
  function showApp() {
    document.getElementById("loginGate").classList.add("hidden");
    document.getElementById("adminApp").classList.remove("hidden");
    boot();
  }

  /* ---------------- boot ---------------- */
  function boot() {
    document.getElementById("logoutBtn").onclick = function () {
      localStorage.removeItem(LS_AUTH);
      location.reload();
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
    renderTab("dashboard");
  }
  function updateModeBadge() {
    var b = document.getElementById("modeBadge");
    if (cfg.apiBase) { b.textContent = "Terhubung API"; b.style.background = "#06805f"; b.style.color = "#fff"; }
    else { b.textContent = "Mode Lokal"; b.style.background = "#322d28"; b.style.color = "#ffd166"; }
  }

  function renderTab(tab) {
    ({ dashboard: renderDashboard, tenants: renderTenants, stalls: renderStalls,
      schedule: renderSchedule, applications: renderApplications, export: renderExport, settings: renderSettings }[tab] || function () {})();
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

  /* ---------------- stalls ---------------- */
  function renderStalls() {
    var el = document.getElementById("tab-stalls");
    el.innerHTML = '<h2>Zona & Lapak</h2>' +
      db.zones.map(function (z) {
        var zStalls = db.stalls.filter(function (s) { return s.zoneId === z.id; });
        return '<div class="admin-card"><div class="flex between"><h3 class="mb0"><span style="display:inline-block;width:12px;height:12px;border-radius:4px;background:' + z.color + ';margin-right:8px"></span>' + z.name.id + '</h3>' +
          '<span class="pill">' + zStalls.length + ' lapak</span></div>' +
          '<p class="muted" style="font-size:.88rem">' + z.blurb.id + '</p>' +
          '<div class="table-wrap" style="box-shadow:none"><table><thead><tr><th>Kode</th><th>Label</th><th>Tenant</th></tr></thead><tbody>' +
          zStalls.map(function (s) {
            var t = db.tenants.find(function (x) { return x.stallCode === s.code; });
            return '<tr><td><b>' + s.code + '</b></td><td>' + s.label + '</td><td>' + (t ? t.brand : '<span class="muted">— kosong —</span>') + '</td></tr>';
          }).join("") +
          '</tbody></table></div></div>';
      }).join("");
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
  function renderApplications() {
    var el = document.getElementById("tab-applications");
    var apps = getApplications();
    el.innerHTML = '<div class="flex between" style="margin-bottom:14px"><h2 class="mb0">Pendaftaran Tenant</h2>' +
      '<button class="btn btn-ghost btn-sm" id="pullApps">' + (cfg.apiBase ? "Tarik dari API" : "Mode Lokal") + '</button></div>' +
      (apps.length ? '<div class="table-wrap"><table><thead><tr><th>Brand</th><th>Kategori</th><th>Kontak</th><th>Pitch</th><th>Status</th><th></th></tr></thead><tbody>' +
        apps.map(function (a, i) {
          return '<tr><td><b>' + esc(a.brand_name || "-") + '</b></td><td>' + esc(a.category || "-") + '</td>' +
            '<td>' + esc(a.contact_name || "") + '<br><span class="muted" style="font-size:.78rem">' + esc(a.phone || "") + '</span></td>' +
            '<td style="max-width:280px"><span class="muted" style="font-size:.84rem">' + esc((a.pitch || "").slice(0, 120)) + '</span></td>' +
            '<td><span class="pill">' + esc(a.status || "review") + '</span></td>' +
            '<td><button class="btn btn-ghost btn-sm" data-da="' + i + '" style="color:#b3203c">Hapus</button></td></tr>';
        }).join("") + '</tbody></table></div>'
        : '<div class="admin-card"><p class="muted mb0">Belum ada pendaftaran masuk. Pendaftaran dari halaman <b>Gabung</b> akan muncul di sini (mode lokal) atau dari API/D1 bila terhubung.</p></div>');
    el.querySelectorAll("[data-da]").forEach(function (b) { b.onclick = function () {
      if (!confirm("Hapus pendaftaran ini?")) return;
      var arr = getApplications(); arr.splice(+b.dataset.da, 1); localStorage.setItem("tn_applications", JSON.stringify(arr)); renderApplications();
    }; });
    var pull = document.getElementById("pullApps");
    if (pull) pull.onclick = function () {
      if (!cfg.apiBase) { alert("Mode lokal: pendaftaran disimpan di perangkat ini. Atur API Base URL di Pengaturan untuk sinkron ke D1."); return; }
      fetch(cfg.apiBase + "/api/applications").then(function (r) { return r.json(); }).then(function (j) {
        var list = j.applications || j || [];
        localStorage.setItem("tn_applications", JSON.stringify(list)); renderApplications(); toast("Pendaftaran ditarik dari API.");
      }).catch(function () { alert("Gagal menarik dari API."); });
    };
  }

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
    db.categories.forEach(function (c) { s.push("INSERT INTO categories (id,name_id,name_en,icon,color) VALUES (" + q(c.id) + "," + q(c.name.id) + "," + q(c.name.en) + "," + q(c.icon) + "," + q(c.color) + ");"); });
    db.zones.forEach(function (z) { s.push("INSERT INTO zones (id,event_id,name_id,name_en,type,color,blurb_id,blurb_en,pos_x,pos_y,pos_w,pos_h) VALUES (" + q(z.id) + "," + q(db.event.id) + "," + q(z.name.id) + "," + q(z.name.en) + "," + q(z.type) + "," + q(z.color) + "," + q(z.blurb.id) + "," + q(z.blurb.en) + "," + z.area.x + "," + z.area.y + "," + z.area.w + "," + z.area.h + ");"); });
    db.stalls.forEach(function (st) { s.push("INSERT INTO stalls (code,event_id,zone_id,label,pos_x,pos_y,pos_w,pos_h) VALUES (" + q(st.code) + "," + q(db.event.id) + "," + q(st.zoneId) + "," + q(st.label) + "," + st.x + "," + st.y + "," + st.w + "," + st.h + ");"); });
    db.tenants.forEach(function (t) {
      s.push("INSERT INTO tenants (slug,event_id,brand,category_id,zone_id,stall_code,tagline_id,tagline_en,desc_id,desc_en,story_id,story_en,instagram,whatsapp,halal,tags) VALUES (" +
        [q(t.slug), q(db.event.id), q(t.brand), q(t.categoryId), q(t.zoneId), q(t.stallCode), q(t.tagline.id), q(t.tagline.en), q(t.desc.id), q(t.desc.en), q((t.story || {}).id || ""), q((t.story || {}).en || ""), q(t.instagram || ""), q(t.whatsapp || ""), t.halal ? 1 : 0, q((t.tags || []).join(","))].join(",") + ");");
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