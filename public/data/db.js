/*
 * Titik Ngemil - Dataset kanonik (canonical dataset)
 * Format UMD: bisa dipakai di browser (window.TITIK_DB) maupun Node (module.exports).
 * File ini adalah sumber data untuk situs statis, dan sumber untuk membuat seed.sql (D1).
 */
(function (root, factory) {
  var DB = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = DB;
  if (typeof root !== "undefined") root.TITIK_DB = DB;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var EVENT = {
    id: "tn-2026-01",
    slug: "titik-ngemil-1",
    edition: 1,
    name: { id: "Titik Ngemil #1", en: "Titik Ngemil #1" },
    theme: { id: "Rapi Rasa Gondangdia", en: "Tidy Tastes of Gondangdia" },
    date: "2026-10-30",
    dayLabel: { id: "Jumat", en: "Friday" },
    startTime: "14:00",
    endTime: "22:00",
    venueName: { id: "Kawasan Stasiun Gondangdia", en: "Gondangdia Station Area" },
    address: "Jl. Srikaya II, Kebon Sirih, Kec. Menteng, Jakarta Pusat 10340",
    city: "Jakarta Pusat",
    mapsUrl: "https://maps.google.com/?q=Stasiun+Gondangdia+Jakarta",
    status: "published",
    hashtag: "#TitikNgemil",
    transport: [
      { icon: "🚉", label: { id: "KRL - Stasiun Gondangdia (langsung)", en: "Commuter Line - Gondangdia Station (direct)" } },
      { icon: "🚌", label: { id: "TransJakarta / Mikrotrans Menteng", en: "TransJakarta / Menteng Microtrans" } },
      { icon: "🛵", label: { id: "Ojek online - titik drop off sisi selatan", en: "Ride-hailing - drop off at south side" } },
      { icon: "🚗", label: { id: "Parkir terbatas di sekitar Jl. Srikaya", en: "Limited parking around Jl. Srikaya" } }
    ]
  };

  var CATEGORIES = [
    { id: "kuliner", name: { id: "Kuliner", en: "Food" }, icon: "🍜", color: "#ff6b35" },
    { id: "minuman", name: { id: "Minuman", en: "Drinks" }, icon: "🥤", color: "#3aa8c1" },
    { id: "jajanan", name: { id: "Jajanan", en: "Street Snacks" }, icon: "🥟", color: "#f4a259" },
    { id: "dessert", name: { id: "Dessert", en: "Dessert" }, icon: "🍧", color: "#c77dff" },
    { id: "nonfood", name: { id: "Non-Food", en: "Non-Food" }, icon: "🛍️", color: "#7bb662" }
  ];

  // Denah peta: kanvas 1000 x 700 (viewBox). Zona = area, stall = kotak di dalamnya.
  var ZONES = [
    {
      id: "gate", mapKey: "gate", type: "gate", color: "#ffd166",
      name: { id: "Pintu Gondangdia", en: "Gondangdia Gate" },
      blurb: { id: "Gerbang masuk & titik temu utama.", en: "Main entrance & meeting point." },
      area: { x: 20, y: 20, w: 200, h: 360 }
    },
    {
      id: "stage", mapKey: "stage", type: "stage", color: "#ef476f",
      name: { id: "Panggung Ngemil", en: "Ngemil Stage" },
      blurb: { id: "Musik, talkshow, dan workshop.", en: "Music, talkshow, and workshops." },
      area: { x: 20, y: 400, w: 200, h: 280 }
    },
    {
      id: "srikaya", mapKey: "srikaya", type: "indoor", color: "#06d6a0",
      name: { id: "Lorong Srikaya", en: "Srikaya Lane" },
      blurb: { id: "Jalur kuliner utama, porsi berat.", en: "Main food lane for hearty portions." },
      area: { x: 240, y: 20, w: 300, h: 660 }
    },
    {
      id: "cutmeutia", mapKey: "cutmeutia", type: "outdoor", color: "#8ecae6",
      name: { id: "Taman Cut Meutia", en: "Cut Meutia Park" },
      blurb: { id: "Area terbuka untuk jajan santai.", en: "Open area for relaxed snacking." },
      area: { x: 560, y: 20, w: 420, h: 330 }
    },
    {
      id: "transit", mapKey: "transit", type: "outdoor", color: "#b5179e",
      name: { id: "Pelataran Transit", en: "Transit Yard" },
      blurb: { id: "Dekat area transit & drop off.", en: "Near the transit & drop-off area." },
      area: { x: 560, y: 370, w: 420, h: 310 }
    }
  ];

  // Stall: satu lapak = satu tenant (1:1 pada event ini).
  var STALLS = [
    { code: "A01", zoneId: "gate", label: "Lapak A01", x: 40, y: 40, w: 160, h: 70 },
    { code: "A02", zoneId: "gate", label: "Lapak A02", x: 40, y: 120, w: 160, h: 70 },
    { code: "A03", zoneId: "gate", label: "Lapak A03", x: 40, y: 200, w: 160, h: 70 },
    { code: "A04", zoneId: "gate", label: "Lapak A04", x: 40, y: 280, w: 160, h: 70 },

    { code: "B01", zoneId: "srikaya", label: "Lapak B01", x: 260, y: 40, w: 260, h: 90 },
    { code: "B02", zoneId: "srikaya", label: "Lapak B02", x: 260, y: 150, w: 260, h: 90 },
    { code: "B03", zoneId: "srikaya", label: "Lapak B03", x: 260, y: 260, w: 260, h: 90 },
    { code: "B04", zoneId: "srikaya", label: "Lapak B04", x: 260, y: 370, w: 260, h: 90 },
    { code: "B05", zoneId: "srikaya", label: "Lapak B05", x: 260, y: 480, w: 260, h: 90 },
    { code: "B06", zoneId: "srikaya", label: "Lapak B06", x: 260, y: 590, w: 260, h: 90 },

    { code: "C01", zoneId: "cutmeutia", label: "Lapak C01", x: 580, y: 40, w: 190, h: 65 },
    { code: "C02", zoneId: "cutmeutia", label: "Lapak C02", x: 790, y: 40, w: 190, h: 65 },
    { code: "C03", zoneId: "cutmeutia", label: "Lapak C03", x: 580, y: 120, w: 190, h: 65 },
    { code: "C04", zoneId: "cutmeutia", label: "Lapak C04", x: 790, y: 120, w: 190, h: 65 },
    { code: "C05", zoneId: "cutmeutia", label: "Lapak C05", x: 580, y: 200, w: 190, h: 65 },
    { code: "C06", zoneId: "cutmeutia", label: "Lapak C06", x: 790, y: 200, w: 190, h: 65 },
    { code: "C07", zoneId: "cutmeutia", label: "Lapak C07", x: 580, y: 280, w: 190, h: 65 },
    { code: "C08", zoneId: "cutmeutia", label: "Lapak C08", x: 790, y: 280, w: 190, h: 65 },

    { code: "D01", zoneId: "transit", label: "Lapak D01", x: 580, y: 400, w: 190, h: 80 },
    { code: "D02", zoneId: "transit", label: "Lapak D02", x: 790, y: 400, w: 190, h: 80 },
    { code: "D03", zoneId: "transit", label: "Lapak D03", x: 580, y: 500, w: 190, h: 80 },
    { code: "D04", zoneId: "transit", label: "Lapak D04", x: 790, y: 500, w: 190, h: 80 },
    { code: "D05", zoneId: "transit", label: "Lapak D05", x: 580, y: 600, w: 190, h: 80 },
    { code: "D06", zoneId: "transit", label: "Lapak D06", x: 790, y: 600, w: 190, h: 80 }
  ];

  function m(name, price, descId, descEn, signature) {
    return { name: name, price: price, desc: { id: descId, en: descEn }, signature: !!signature, available: true };
  }

  var TENANTS = [
    {
      slug: "kopi-titik-ngemil", brand: "Kopi Titik Ngemil", categoryId: "minuman", zoneId: "gate", stallCode: "A01",
      tagline: { id: "Kopi susu gula aren khas Gondangdia", en: "Gondangdia's signature palm-sugar milk coffee" },
      desc: { id: "Kopi susu gula aren dengan biji lokal, diseduh langsung di depan pengunjung.", en: "Palm-sugar milk coffee with local beans, brewed right in front of you." },
      story: { id: "Dimulai dari gerobak kopi keliling di sekitar stasiun sejak 2019.", en: "Started as a mobile coffee cart around the station in 2019." },
      instagram: "kopititikngemil", whatsapp: "081200000101", halal: true, tags: ["kopi", "signature"],
      menu: [
        m("Kopi Susu Gula Aren", 18000, "Kopi susu manis legit", "Sweet palm-sugar milk coffee", true),
        m("Americano Dingin", 15000, "Kopi hitam dingin", "Iced black coffee", false),
        m("Kopi Tubruk Klasik", 12000, "Kopi tubruk tradisional", "Traditional brewed coffee", false),
        m("Es Cokelat", 17000, "Cokelat dingin creamy", "Creamy iced chocolate", false)
      ]
    },
    {
      slug: "es-teh-jumbo", brand: "Es Teh Jumbo Pakde", categoryId: "minuman", zoneId: "gate", stallCode: "A02",
      tagline: { id: "Segelas sejumbo seember, harga kaki lima", en: "Giant glass, street-side price" },
      desc: { id: "Es teh manis ukuran jumbo, favorit pelepas dahaga commuter.", en: "Jumbo sweet iced tea, a commuter favorite." },
      story: { id: "Legendaris di trotoar Gondangdia sebelum penataan.", en: "A Gondangdia sidewalk legend before the rearrangement." },
      instagram: "estehjumbopakde", whatsapp: "081200000102", halal: true, tags: ["murah", "jumbo"],
      menu: [
        m("Es Teh Manis Jumbo", 8000, "Ukuran 1 liter", "1 litre size", true),
        m("Es Teh Tawar Jumbo", 6000, "Tanpa gula", "Without sugar", false),
        m("Es Lemon Tea", 12000, "Teh lemon segar", "Fresh lemon tea", false)
      ]
    },
    {
      slug: "kue-cubit-rangi-bu-iyem", brand: "Kue Cubit & Kue Rangi Bu Iyem", categoryId: "jajanan", zoneId: "gate", stallCode: "A03",
      tagline: { id: "Jajanan pasar yang bikin kangen", en: "Traditional snacks that bring nostalgia" },
      desc: { id: "Kue cubit setengah matang dan kue rangi kelapa bakar.", en: "Half-cooked mini pancakes and grilled coconut wafers." },
      story: { id: "Resep warisan tiga generasi keluarga Bu Iyem.", en: "A recipe passed down through three generations." },
      instagram: "kuecubitbu.iyem", whatsapp: "081200000103", halal: true, tags: ["tradisional", "manis"],
      menu: [
        m("Kue Cubit Setengah Matang", 12000, "Isi 6, topping meises", "6 pcs with chocolate sprinkles", true),
        m("Kue Rangi Kelapa", 10000, "Kelapa bakar gula jawa", "Grilled coconut with palm sugar", false),
        m("Kue Cubit Keju", 15000, "Topping keju melimpah", "Loaded cheese topping", false)
      ]
    },
    {
      slug: "titik-merch-store", brand: "Titik Merch Store", categoryId: "nonfood", zoneId: "gate", stallCode: "A04",
      tagline: { id: "Suvenir resmi Titik Ngemil", en: "Official Titik Ngemil merchandise" },
      desc: { id: "Kaus, totebag, dan pin edisi perdana event.", en: "T-shirts, totes, and pins from the debut edition." },
      story: { id: "Hasil kolaborasi dengan perajin lokal Menteng.", en: "Made in collaboration with local Menteng artisans." },
      instagram: "titikngemil.store", whatsapp: "081200000104", halal: false, tags: ["merch", "souvenir"],
      menu: [
        m("Kaus Titik Ngemil", 95000, "Katun combed 30s", "Combed cotton 30s", true),
        m("Totebag Kanvas", 55000, "Kanvas tebal", "Heavy canvas", false),
        m("Pin Enamel", 25000, "Pin logam edisi terbatas", "Limited enamel pin", false)
      ]
    },

    {
      slug: "sate-ayam-pak-kumis", brand: "Sate Ayam Pak Kumis", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B01",
      tagline: { id: "Sate ayam madura, bumbu kacang pekat", en: "Madura chicken satay, rich peanut sauce" },
      desc: { id: "Sate ayam bakar arang dengan bumbu kacang khas Madura.", en: "Charcoal-grilled chicken satay with Madura peanut sauce." },
      story: { id: "50 tusuk per porsi, dibakar setelah dipesan.", en: "Grilled to order." },
      instagram: "satepakumis", whatsapp: "081200000105", halal: true, tags: ["bakar", "halal"],
      menu: [
        m("Sate Ayam (10 tusuk)", 30000, "Plus lontong", "With rice cake", true),
        m("Sate Ayam (5 tusuk)", 18000, "Porsi kecil", "Small portion", false),
        m("Lontong", 5000, "Lontong tambahan", "Extra rice cake", false)
      ]
    },
    {
      slug: "bakso-urat-mas-yanto", brand: "Bakso Urat Mas Yanto", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B02",
      tagline: { id: "Bakso urat sapi, kuah kaldu gurih", en: "Beef tendon meatballs, savory broth" },
      desc: { id: "Bakso urat sapi dengan kuah kaldu sapi asli dan mie kuning.", en: "Beef tendon meatballs in authentic beef broth with noodles." },
      story: { id: "Kuah direbus sejak subuh setiap hari.", en: "Broth simmered from dawn daily." },
      instagram: "baksomasyanto", whatsapp: "081200000106", halal: true, tags: ["kuah", "sapi"],
      menu: [
        m("Bakso Urat Campur", 25000, "Bakso + mie + tahu", "Meatballs + noodles + tofu", true),
        m("Bakso Urat Saja", 20000, "5 butir bakso", "5 meatballs", false),
        m("Mie Ayam Bakso", 23000, "Mie ayam + bakso", "Chicken noodles + meatball", false)
      ]
    },
    {
      slug: "nasi-goreng-gila-bang-jek", brand: "Nasi Goreng Gila Bang Jek", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B03",
      tagline: { id: "Nasgor pedas level gila", en: "Crazy-spicy fried rice" },
      desc: { id: "Nasi goreng dengan sosis, ayam, telur, dan sambal pedas.", en: "Fried rice with sausage, chicken, egg, and spicy chili." },
      story: { id: "Menu favorit anak kos sekitar Menteng.", en: "A favorite among Menteng students." },
      instagram: "nasgorgilabangjek", whatsapp: "081200000107", halal: true, tags: ["pedas", "nasgor"],
      menu: [
        m("Nasi Goreng Gila", 25000, "Lengkap, pedas", "Complete, spicy", true),
        m("Nasi Goreng Biasa", 18000, "Tanpa sosis", "No sausage", false),
        m("Kwetiau Goreng", 23000, "Kwetiau pedas", "Spicy flat noodles", false)
      ]
    },
    {
      slug: "sate-taichan-gondangdia", brand: "Sate Taichan Gondangdia", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B04",
      tagline: { id: "Tanpa bumbu kacang, sambal pedas", en: "No peanut sauce, just spicy sambal" },
      desc: { id: "Sate ayam tanpa bumbu kacang, disajikan dengan sambal dan jeruk nipis.", en: "Chicken satay without peanut sauce, served with sambal and lime." },
      story: { id: "Tren sate taichan yang hits di kalangan muda.", en: "The trendy taichan satay popular with young crowds." },
      instagram: "sate.taichan.gdd", whatsapp: "081200000108", halal: true, tags: ["pedas", "bakar"],
      menu: [
        m("Sate Taichan (10 tusuk)", 30000, "Plus lontong", "With rice cake", true),
        m("Sate Taichan (5 tusuk)", 18000, "Porsi kecil", "Small portion", false),
        m("Sambal Extra", 3000, "Sambal pedas tambahan", "Extra spicy sambal", false)
      ]
    },
    {
      slug: "mie-ayam-jamur-pak-agus", brand: "Mie Ayam Jamur Pak Agus", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B05",
      tagline: { id: "Mie ayam jamur, pangsit goreng", en: "Mushroom chicken noodles with fried wontons" },
      desc: { id: "Mie ayam dengan topping jamur dan pangsit goreng renyah.", en: "Chicken noodles topped with mushrooms and crispy fried wontons." },
      story: { id: "Gerobak keluarga sejak 2008.", en: "A family cart since 2008." },
      instagram: "mieayampakagus", whatsapp: "081200000109", halal: true, tags: ["mie", "pangsit"],
      menu: [
        m("Mie Ayam Jamur", 22000, "Plus pangsit goreng", "With fried wontons", true),
        m("Mie Ayam Original", 18000, "Tanpa jamur", "No mushroom", false),
        m("Pangsit Goreng", 8000, "5 buah", "5 pieces", false)
      ]
    },
    {
      slug: "ketoprak-bu-nani", brand: "Ketoprak Bu Nani", categoryId: "kuliner", zoneId: "srikaya", stallCode: "B06",
      tagline: { id: "Ketoprak Betawi, bumbu kacang ulek", en: "Betawi ketoprak, hand-ground peanut sauce" },
      desc: { id: "Ketoprak tahu, bihun, dan lontong dengan bumbu kacang ulek kasar.", en: "Tofu, vermicelli, and rice cake with coarsely ground peanut sauce." },
      story: { id: "Bumbu diulek langsung di depan pembeli.", en: "Sauce ground fresh in front of customers." },
      instagram: "ketoprakbunani", whatsapp: "081200000110", halal: true, tags: ["sehat", "tradisional"],
      menu: [
        m("Ketoprak Lengkap", 20000, "Plus telur", "With egg", true),
        m("Ketoprak Biasa", 15000, "Tanpa telur", "No egg", false),
        m("Gado-Gado", 22000, "Sayur segar", "Fresh vegetables", false)
      ]
    },

    {
      slug: "martabak-bang-doel", brand: "Martabak Bang Doel", categoryId: "kuliner", zoneId: "cutmeutia", stallCode: "C01",
      tagline: { id: "Martabak telor & manis jumbo", en: "Giant savory & sweet martabak" },
      desc: { id: "Martabak telor isi daging dan martabak manis aneka topping.", en: "Meat-filled savory martabak and sweet martabak with assorted toppings." },
      story: { id: "Antrean panjang setiap akhir pekan.", en: "Long queues every weekend." },
      instagram: "martabakbangdoel", whatsapp: "081200000111", halal: true, tags: ["manis", "gurih"],
      menu: [
        m("Martabak Telor", 35000, "Isi daging + daun bawang", "Meat + scallion filling", true),
        m("Martabak Manis Cokelat Keju", 40000, "Topping cokelat & keju", "Chocolate & cheese", true),
        m("Martabak Manis Kacang", 30000, "Kacang sangrai", "Roasted peanut", false)
      ]
    },
    {
      slug: "pempek-yu-nina", brand: "Pempek Yu Nina", categoryId: "kuliner", zoneId: "cutmeutia", stallCode: "C02",
      tagline: { id: "Pempek Palembang asli, cuko mantap", en: "Authentic Palembang pempek, bold vinegar sauce" },
      desc: { id: "Pempek kapal selam, lenjer, dan adaan dengan cuko pedas manis.", en: "Submarine, lenjer, and adaan pempek with sweet-spicy vinegar sauce." },
      story: { id: "Dibuat fresh dari ikan tenggiri.", en: "Made fresh from mackerel." },
      instagram: "pempekyunina", whatsapp: "081200000112", halal: true, tags: ["ikan", "cuko"],
      menu: [
        m("Paket Pempek Campur", 35000, "5 jenis pempek + cuko", "5 pempek types + sauce", true),
        m("Pempek Kapal Selam", 18000, "Isi telur", "Egg-filled", false),
        m("Pempek Lenjer", 12000, "2 buah", "2 pieces", false)
      ]
    },
    {
      slug: "siomay-batagor-abang-ican", brand: "Siomay & Batagor Abang Ican", categoryId: "kuliner", zoneId: "cutmeutia", stallCode: "C03",
      tagline: { id: "Siomay kukus & batagor goreng", en: "Steamed siomay & fried batagor" },
      desc: { id: "Siomay ikan kukus dan batagor goreng dengan saus kacang.", en: "Steamed fish dumplings and fried batagor with peanut sauce." },
      story: { id: "Tiga dekade jualan di Menteng.", en: "Three decades selling in Menteng." },
      instagram: "siomayabangican", whatsapp: "081200000113", halal: true, tags: ["kukus", "goreng"],
      menu: [
        m("Siomay Lengkap", 22000, "Kentang, tahu, telur, kol", "Potato, tofu, egg, cabbage", true),
        m("Batagor Goreng", 20000, "5 buah", "5 pieces", false),
        m("Siomay + Batagor", 25000, "Kombinasi", "Combination", false)
      ]
    },
    {
      slug: "kerak-telor-betawi-zaki", brand: "Kerak Telor Betawi Zaki", categoryId: "jajanan", zoneId: "cutmeutia", stallCode: "C04",
      tagline: { id: "Kerak telor betawi otentik", en: "Authentic Betawi kerak telor" },
      desc: { id: "Kerak telor dengan beras ketan, telur bebek, dan serundeng.", en: "Kerak telor with glutinous rice, duck egg, and coconut floss." },
      story: { id: "Dibuat di atas wajan arang, ala Betawi asli.", en: "Cooked on a charcoal pan, truly Betawi style." },
      instagram: "keraktelorzaki", whatsapp: "081200000114", halal: true, tags: ["betawi", "otentik"],
      menu: [
        m("Kerak Telor Telur Bebek", 25000, "Serundeng & bawang goreng", "Coconut floss & fried shallots", true),
        m("Kerak Telor Telur Ayam", 20000, "Versi telur ayam", "Chicken egg version", false)
      ]
    },
    {
      slug: "pisang-goreng-keju-munir", brand: "Pisang Goreng Keju Munir", categoryId: "jajanan", zoneId: "cutmeutia", stallCode: "C05",
      tagline: { id: "Pisang goreng crispy topping keju", en: "Crispy banana fritters with cheese" },
      desc: { id: "Pisang goreng renyah dengan topping keju, cokelat, dan susu.", en: "Crispy banana fritters topped with cheese, chocolate, and milk." },
      story: { id: "Camilan favorit sore hari.", en: "A favorite afternoon snack." },
      instagram: "pisanggorengmunir", whatsapp: "081200000115", halal: true, tags: ["goreng", "keju"],
      menu: [
        m("Pisang Goreng Keju", 18000, "Topping keju & susu", "Cheese & milk topping", true),
        m("Pisang Goreng Cokelat", 17000, "Topping cokelat", "Chocolate topping", false),
        m("Paket Mix (6 pcs)", 30000, "Aneka topping", "Assorted toppings", false)
      ]
    },
    {
      slug: "cendol-dawet-ayu-mbok-sri", brand: "Cendol & Dawet Ayu Mbok Sri", categoryId: "dessert", zoneId: "cutmeutia", stallCode: "C06",
      tagline: { id: "Cendol & dawet ayu segar", en: "Fresh cendol & dawet ayu" },
      desc: { id: "Es cendol gula jawa dan dawet ayu santan, pelepas dahaga.", en: "Palm-sugar cendol and coconut dawet, refreshing." },
      story: { id: "Resep dawet dari Banjarnegara.", en: "A dawet recipe from Banjarnegara." },
      instagram: "cendolmboksri", whatsapp: "081200000116", halal: true, tags: ["dingin", "segar"],
      menu: [
        m("Es Cendol Gula Jawa", 15000, "Porsi jumbo", "Jumbo portion", true),
        m("Dawet Ayu Santan", 15000, "Santan kental", "Rich coconut milk", false),
        m("Es Campur", 20000, "Aneka isian", "Assorted fillings", false)
      ]
    },
    {
      slug: "tahu-gejrot-cirebon", brand: "Tahu Gejrot Cirebon", categoryId: "jajanan", zoneId: "cutmeutia", stallCode: "C07",
      tagline: { id: "Tahu gejrot kuah asam pedas manis", en: "Tahu gejrot in sweet-sour-spicy broth" },
      desc: { id: "Tahu pong digoreng, disiram kuah gula jawa, cabai, dan bawang.", en: "Fried puffed tofu in palm sugar, chili, and shallot broth." },
      story: { id: "Kuah diulek dadakan sesuai pesanan.", en: "Broth ground to order." },
      instagram: "tahugejrotcirebon", whatsapp: "081200000117", halal: true, tags: ["pedas", "asam"],
      menu: [
        m("Tahu Gejrot Original", 12000, "Kuah asam pedas", "Sweet-sour-spicy broth", true),
        m("Tahu Gejrot Jumbo", 18000, "Porsi besar", "Large portion", false)
      ]
    },
    {
      slug: "risoles-pastel-bu-tuti", brand: "Risoles & Pastel Bu Tuti", categoryId: "jajanan", zoneId: "cutmeutia", stallCode: "C08",
      tagline: { id: "Risoles & pastel goreng homemade", en: "Homemade fried risoles & pastel" },
      desc: { id: "Risoles isi ragout ayam dan pastel sayur, digoreng fresh.", en: "Chicken ragout risoles and veggie pastel, fried fresh." },
      story: { id: "Dibuat setiap pagi di rumah Bu Tuti.", en: "Made every morning at Bu Tuti's home." },
      instagram: "risolesbututi", whatsapp: "081200000118", halal: true, tags: ["goreng", "homemade"],
      menu: [
        m("Risoles Mayo (5 pcs)", 20000, "Isi ragout ayam", "Chicken ragout filling", true),
        m("Pastel Sayur (4 pcs)", 16000, "Isi sayur & bihun", "Veggie & vermicelli filling", false),
        m("Paket Mix (8 pcs)", 30000, "Risoles + pastel", "Risoles + pastel", false)
      ]
    },

    {
      slug: "soto-betawi-h-mamat", brand: "Soto Betawi H. Mamat", categoryId: "kuliner", zoneId: "transit", stallCode: "D01",
      tagline: { id: "Soto betawi kuah santan", en: "Betawi soto with coconut milk broth" },
      desc: { id: "Soto daging sapi kuah santan dengan kentang dan tomat.", en: "Beef soto in coconut milk broth with potato and tomato." },
      story: { id: "Meracik kuah sejak 1995.", en: "Cooking the broth since 1995." },
      instagram: "sotobetawihmamat", whatsapp: "081200000119", halal: true, tags: ["santan", "daging"],
      menu: [
        m("Soto Betawi Daging", 35000, "Plus nasi & emping", "With rice & crackers", true),
        m("Soto Betawi Ayam", 28000, "Versi ayam", "Chicken version", false),
        m("Nasi Tambahan", 6000, "Nasi putih", "Steamed rice", false)
      ]
    },
    {
      slug: "gado-gado-mbok-nah", brand: "Gado-Gado Mbok Nah", categoryId: "kuliner", zoneId: "transit", stallCode: "D02",
      tagline: { id: "Gado-gado sayur segar", en: "Gado-gado with fresh vegetables" },
      desc: { id: "Gado-gado sayur, tahu, tempe, dan lontong dengan bumbu kacang.", en: "Vegetables, tofu, tempeh, and rice cake with peanut sauce." },
      story: { id: "Sayur dipetik dari pasar pagi.", en: "Vegetables sourced from the morning market." },
      instagram: "gadogadomboknah", whatsapp: "081200000120", halal: true, tags: ["vegetarian", "segar"],
      menu: [
        m("Gado-Gado Lengkap", 22000, "Plus lontong & kerupuk", "With rice cake & crackers", true),
        m("Gado-Gado Sayur", 18000, "Tanpa lontong", "No rice cake", false),
        m("Karedok", 20000, "Sayur mentah bumbu kacang", "Raw veggies, peanut sauce", false)
      ]
    },
    {
      slug: "es-kelapa-muda-segar", brand: "Es Kelapa Muda Segar", categoryId: "minuman", zoneId: "transit", stallCode: "D03",
      tagline: { id: "Kelapa muda asli, dingin menyegarkan", en: "Real young coconut, refreshingly cold" },
      desc: { id: "Es kelapa muda dengan daging kelapa utuh dan gula batu.", en: "Young coconut ice with full coconut meat and rock sugar." },
      story: { id: "Kelapa datang langsung dari pasar Indramayu.", en: "Coconuts arrive fresh from Indramayu market." },
      instagram: "eskelapamudasegar", whatsapp: "081200000121", halal: true, tags: ["dingin", "asli"],
      menu: [
        m("Es Kelapa Muda", 15000, "Kelapa utuh", "Full coconut", true),
        m("Es Kelapa Sirup", 17000, "Plus sirup gula", "With sugar syrup", false),
        m("Es Kelapa Jeruk Nipis", 18000, "Perasan jeruk nipis", "Squeezed lime", false)
      ]
    },
    {
      slug: "polaroid-foto-kenangan", brand: "Polaroid & Foto Kenangan", categoryId: "nonfood", zoneId: "transit", stallCode: "D04",
      tagline: { id: "Abadikan momen ngemil kamu", en: "Capture your snacking moments" },
      desc: { id: "Foto polaroid instan dengan latar panggung Titik Ngemil.", en: "Instant polaroid photos with the Titik Ngemil backdrop." },
      story: { id: "Layanan foto untuk kenang-kenangan event.", en: "Photo service for event keepsakes." },
      instagram: "titikngemil.photo", whatsapp: "081200000122", halal: false, tags: ["foto", "kenang-kenangan"],
      menu: [
        m("Foto Polaroid", 25000, "1 lembar + frame", "1 photo + frame", true),
        m("Foto Polaroid Strip (2)", 40000, "2 lembar", "2 photos", false),
        m("Cetak Foto A4", 35000, "Cetak satuan", "Single print", false)
      ]
    },
    {
      slug: "kebab-shawarma-al-arabi", brand: "Kebab & Shawarma Al-Arabi", categoryId: "kuliner", zoneId: "transit", stallCode: "D05",
      tagline: { id: "Kebab & shawarma daging melimpah", en: "Loaded kebab & shawarma" },
      desc: { id: "Kebab dan shawarma ayam/sapi dengan saus spesial.", en: "Chicken or beef kebab and shawarma with special sauce." },
      story: { id: "Favorit makan malam para pekerja sekitar.", en: "A dinner favorite for nearby workers." },
      instagram: "kebabalarabi", whatsapp: "081200000123", halal: true, tags: ["daging", "malam"],
      menu: [
        m("Kebab Ayam", 25000, "Isi ayam + sayur", "Chicken + veggies", true),
        m("Shawarma Daging", 30000, "Isi daging sapi", "Beef filling", false),
        m("Kebab Keju Jumbo", 35000, "Extra keju", "Extra cheese", false)
      ]
    },
    {
      slug: "lumpia-semarang-yu-iis", brand: "Lumpia Semarang Yu Iis", categoryId: "jajanan", zoneId: "transit", stallCode: "D06",
      tagline: { id: "Lumpia goreng isi rebung", en: "Fried spring rolls with bamboo shoots" },
      desc: { id: "Lumpia isi rebung, ayam, dan telur, saus bawang khas Semarang.", en: "Spring rolls with bamboo shoots, chicken, and egg, Semarang-style." },
      story: { id: "Resep asli Semarang yang dibawa ke Jakarta.", en: "An authentic Semarang recipe brought to Jakarta." },
      instagram: "lumpiayu.iis", whatsapp: "081200000124", halal: true, tags: ["goreng", "rebung"],
      menu: [
        m("Lumpia Rebung (2 pcs)", 20000, "Saus bawang", "Onion sauce", true),
        m("Lumpia Ayam (2 pcs)", 22000, "Isi ayam", "Chicken filling", false),
        m("Paket Mix (4 pcs)", 38000, "Rebung + ayam", "Bamboo + chicken", false)
      ]
    }
  ];

  var SCHEDULE = [
    { id: "s1", time: "14:00", endTime: "14:30", type: "opening", stage: "Panggung Ngemil",
      title: { id: "Opening & Sambutan", en: "Opening & Welcome" },
      desc: { id: "Pembukaan resmi Titik Ngemil #1 bersama perwakilan tenant.", en: "Official opening of Titik Ngemil #1 with tenant representatives." } },
    { id: "s2", time: "15:00", endTime: "16:00", type: "music", stage: "Panggung Ngemil",
      title: { id: "Akustik Sore", en: "Afternoon Acoustic" },
      desc: { id: "Penampilan musisi akustik lokal Menteng.", en: "Local Menteng acoustic musicians." } },
    { id: "s3", time: "16:30", endTime: "17:00", type: "talk", stage: "Panggung Ngemil",
      title: { id: "Talkshow: PKL Naik Kelas", en: "Talkshow: Street Vendors Level Up" },
      desc: { id: "Diskusi penataan PKL bersama pelaku usaha & komunitas.", en: "Discussion on organizing street vendors with businesses & communities." } },
    { id: "s4", time: "17:00", endTime: "18:30", type: "music", stage: "Panggung Ngemil",
      title: { id: "DJ Set Sore", en: "Sunset DJ Set" },
      desc: { id: "Musik santai menemani jam pulang kantor.", en: "Chill music for the commute-home hours." } },
    { id: "s5", time: "18:30", endTime: "19:15", type: "workshop", stage: "Panggung Ngemil",
      title: { id: "Demo Masak: Signature Tenant", en: "Cooking Demo: Tenant Signatures" },
      desc: { id: "Demo masak menu andalan dari tenant pilihan.", en: "Cooking demo of signature dishes from selected tenants." } },
    { id: "s6", time: "19:15", endTime: "20:00", type: "quiz", stage: "Panggung Ngemil",
      title: { id: "Kuis & Doorprize", en: "Quiz & Doorprize" },
      desc: { id: "Kuis berhadiah voucher tenant Titik Ngemil.", en: "Quiz with Titik Ngemil tenant vouchers." } },
    { id: "s7", time: "20:00", endTime: "22:00", type: "music", stage: "Panggung Ngemil",
      title: { id: "Musik Penutup", en: "Closing Music" },
      desc: { id: "Penampilan penutup hingga pasar tutup.", en: "Closing performance until the market closes." } }
  ];

  return {
    updatedAt: "2026-10-27",
    event: EVENT,
    categories: CATEGORIES,
    zones: ZONES,
    stalls: STALLS,
    tenants: TENANTS,
    schedule: SCHEDULE
  };
});