/* Dashboard Tenant — jadwal, profil & menu, status verifikasi, toggle status booth */
(function () {
  "use strict";
  var LS_BOOTH = "tn_booth_status";

  // guard: wajib login sebagai tenant
  var auth = {};
  try { auth = JSON.parse(localStorage.getItem("tn_auth") || "{}"); } catch (e) {}
  if (!auth || !auth.role) { location.href = "/masuk"; return; }
  if (auth.role === "admin") { location.href = "/dashboard/admin"; return; }

  var DB = window.TITIK_DB;
  var rawId = String(auth.email || auth.slug || "").trim().toLowerCase();
  var id = rawId.replace(/^@/, "");

  // pilih tenant: cocokkan slug, instagram, atau WhatsApp. Kalau tidak ada, pakai tenant pertama (mode demo).
  var tn = DB.tenants.find(function (t) {
    return t.slug.toLowerCase() === id ||
           String(t.instagram || "").toLowerCase().replace(/^@/, "") === id ||
           String(t.whatsapp || "").replace(/\D/g, "") === id.replace(/\D/g, "");
  });
  var isFallback = !tn;
  tn = tn || DB.tenants[0];

  // verifikasi ikut data tenant, bukan hardcode
  var VERIF = {
    "disetujui": { label: "Disetujui", cls: "alert-ok", icon: "✅" },
    "perlu-revisi": { label: "Perlu Revisi", cls: "alert-err", icon: "⚠️" },
    "ditolak": { label: "Ditolak", cls: "alert-err", icon: "✕" },
    "ditinjau": { label: "Sedang Ditinjau", cls: "alert-warn", icon: "⏳" },
    "terkirim": { label: "Menunggu Verifikasi", cls: "alert-warn", icon: "📨" }
  };
  var verif = VERIF[tn.verification] || VERIF["ditinjau"];

  function boothStatus() {
    var map = {}; try { map = JSON.parse(localStorage.getItem(LS_BOOTH) || "{}"); } catch (e) {}
    return map[tn.slug] || tn.boothStatus || "buka";
  }
  function setBoothStatus(s) {
    var map = {}; try { map = JSON.parse(localStorage.getItem(LS_BOOTH) || "{}"); } catch (e) {}
    map[tn.slug] = s; localStorage.setItem(LS_BOOTH, JSON.stringify(map));
  }

  document.getElementById("t-name").textContent = tn.brand;
  document.getElementById("t-sub").textContent = "Booth " + TN.boothNoOf(tn.stallCode) + " · " + TN.pick(TN.siteBySlug("gondangdia").name);
  if (isFallback && rawId) {
    TN.toast("ID \"" + rawId + "\" tidak cocok — menampilkan tenant demo.");
  }
  document.getElementById("t-logout").onclick = function () { localStorage.removeItem("tn_auth"); location.href = "/masuk"; };

  function render() {
    var cur = boothStatus();
    var stColor = { buka: "#06805f", tutup: "#8a817a", habis: "#b3203c" };
    var stLabel = { buka: "BUKA", tutup: "TUTUP", habis: "HABIS" };
    var cat = TN.catById(tn.categoryId);
    var zone = TN.zoneById(tn.zoneId);

    document.getElementById("t-content").innerHTML =
      '<div class="stat-cards">' +
        '<div class="admin-card"><b style="color:' + stColor[cur] + '">' + stLabel[cur] + '</b><span class="muted">Status booth</span></div>' +
        '<div class="admin-card"><b>' + TN.boothNoOf(tn.stallCode) + '</b><span class="muted">Nomor booth</span></div>' +
        '<div class="admin-card"><b>' + tn.menu.length + '</b><span class="muted">Item menu</span></div>' +
        '<div class="admin-card"><b style="font-size:1.2rem;color:' + (verif.cls === "alert-ok" ? "#06805f" : verif.cls === "alert-err" ? "#b3203c" : "#8a6d1f") + '">' + verif.label + '</b><span class="muted">Verifikasi</span></div>' +
      '</div>' +
      '<div class="map-layout">' +
        '<div>' +
          '<div class="admin-card"><h3>Toggle Status Booth</h3>' +
            '<p class="muted">Status ini tampil real-time di halaman titik & denah.</p>' +
            '<div class="flex">' +
              btn("buka", "● BUKA") + btn("tutup", "○ TUTUP") + btn("habis", "✕ HABIS") +
            '</div>' +
          '</div>' +
          '<div class="admin-card"><h3>Jadwal Saya</h3>' +
            '<p class="muted mb0">Hari aktif: ' + (tn.days || []).map(TN.dayLabel).join(", ") + '</p>' +
            '<p class="muted mb0">Titik: ' + TN.pick(TN.siteBySlug("gondangdia").name) + ' · Booth ' + TN.boothNoOf(tn.stallCode) + '</p>' +
          '</div>' +
          '<div class="admin-card"><h3>Profil & Menu (' + tn.menu.length + ')</h3>' +
            '<div class="kv">' +
              TN.kv("Kategori", cat.icon + " " + TN.pick(cat.name)) +
              TN.kv("Zona", zone ? TN.pick(zone.name) : "-") +
              TN.kv("Instagram", "@" + (tn.instagram || "-")) +
              TN.kv("WhatsApp", tn.whatsapp || "-") +
            '</div>' +
            '<a class="btn btn-primary" style="margin-top:14px" href="/menu?slug=' + tn.slug + '">Lihat Menu Lengkap</a>' +
          '</div>' +
        '</div>' +
        '<div class="map-side">' +
          '<div class="admin-card"><h3>Status Verifikasi</h3>' +
            '<div class="alert ' + verif.cls + '">' + verif.icon + ' ' + verif.label + '</div>' +
            '<div class="kv">' + TN.kv("Nomor booth", TN.boothNoOf(tn.stallCode)) + TN.kv("Titik", TN.pick(TN.siteBySlug("gondangdia").name)) + TN.kv("Hari", TN.dayLabel((tn.days || [])[0])) + '</div>' +
          '</div>' +
          '<div class="admin-card"><h3>Pratinjau Kartu</h3>' + TN.tenantCard(tn) + '</div>' +
        '</div>' +
      '</div>';

    document.querySelectorAll("[data-booth-set]").forEach(function (b) {
      b.classList.toggle("btn-primary", b.dataset.boothSet === cur);
      b.classList.toggle("btn-ghost", b.dataset.boothSet !== cur);
      b.onclick = function () { setBoothStatus(b.dataset.boothSet); TN.toast("Status booth: " + stLabel[b.dataset.boothSet]); render(); };
    });
    function btn(val, label) { return '<button class="btn" data-booth-set="' + val + '">' + label + '</button>'; }
  }
  render();
})();