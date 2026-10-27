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
  var email = (auth.email || "").toLowerCase();

  // pilih tenant: cocokkan email/instagram, kalau tidak ada ambil tenant pertama
  var tn = DB.tenants.find(function (t) {
    return (t.instagram && ("@" + t.instagram).toLowerCase() === email) ||
           (t.whatsapp && t.whatsapp === auth.email) ||
           t.slug === email;
  }) || DB.tenants[3]; // fallback demo

  function boothStatus() {
    var map = {}; try { map = JSON.parse(localStorage.getItem(LS_BOOTH) || "{}"); } catch (e) {}
    return map[tn.slug] || tn.boothStatus || "buka";
  }
  function setBoothStatus(s) {
    var map = {}; try { map = JSON.parse(localStorage.getItem(LS_BOOTH) || "{}"); } catch (e) {}
    map[tn.slug] = s; localStorage.setItem(LS_BOOTH, JSON.stringify(map));
  }

  document.getElementById("t-name").textContent = tn.brand;
  document.getElementById("t-sub").textContent = (DB.categories.find(function (c) { return c.id === tn.categoryId; }) || {}).name ? "" : "";
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
        '<div class="admin-card"><b style="font-size:1.2rem;color:#06805f">Disetujui</b><span class="muted">Verifikasi</span></div>' +
      '</div>' +
      '<div class="map-layout">' +
        '<div>' +
          '<div class="admin-card"><h3>Toggle Status Booth</h3>' +
            '<p class="muted">Status ini tampil real-time di halaman Titik Gondangdia & denah.</p>' +
            '<div class="flex">' +
              btn("buka", "● BUKA") + btn("tutup", "○ TUTUP") + btn("habis", "✕ HABIS") +
            '</div>' +
          '</div>' +
          '<div class="admin-card"><h3>Jadwal Saya</h3>' +
            '<p class="muted mb0">Hari aktif: ' + (tn.days || []).map(TN.dayLabel).join(", ") + '</p>' +
            '<p class="muted mb0">Titik: Titik Gondangdia · Booth ' + TN.boothNoOf(tn.stallCode) + '</p>' +
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
            '<div class="alert alert-ok">✅ Disetujui</div>' +
            '<div class="kv">' + TN.kv("Nomor booth", TN.boothNoOf(tn.stallCode)) + TN.kv("Titik", "Gondangdia") + TN.kv("Hari", "Senin–Sabtu") + '</div>' +
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