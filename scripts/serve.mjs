/**
 * serve.mjs — dev server ringan (tanpa wrangler/D1)
 *
 * Meniru perilaku Cloudflare Pages:
 *   - clean URL  : /tenant        -> public/tenant.html
 *   - index      : /dashboard/    -> public/dashboard/index.html
 *   - 404        : public/404.html
 *   - redirect   : peta.html / gabung.html / admin/ tetap jalan (client-side)
 *
 * Jalankan: npm run dev:static   (atau: node scripts/serve.mjs)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const PORT = Number(process.env.PORT) || 8788;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".sql": "text/plain; charset=utf-8",
};

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

/** Petakan URL -> file di public/ (aturan clean URL). */
async function resolveFile(urlPath) {
  let p = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const abs = join(ROOT, p);

  // cegah path traversal keluar dari public/
  if (!abs.startsWith(ROOT + sep) && abs !== ROOT) return null;

  if (await isFile(abs) && extname(abs)) return abs;
  if (await isFile(abs + ".html")) return abs + ".html";
  if (await isFile(join(abs, "index.html"))) return join(abs, "index.html");
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = (req.url || "/").split("?")[0].split("#")[0];
  const started = Date.now();

  let file = await resolveFile(urlPath);

  // /api/* tidak tersedia di dev server statis
  if (urlPath.startsWith("/api/")) {
    res.writeHead(501, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      ok: false,
      error: "API tidak aktif di dev server statis. Jalankan `npm run dev` (wrangler) untuk Functions + D1.",
    }, null, 2));
    console.log(`501  ${urlPath}  (api tidak tersedia)`);
    return;
  }

  if (!file) {
    const notFound = join(ROOT, "404.html");
    const body = existsSync(notFound) ? await readFile(notFound) : "404 Not Found";
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(body);
    console.log(`404  ${urlPath}`);
    return;
  }

  const body = await readFile(file);
  res.writeHead(200, {
    "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  res.end(body);
  console.log(`200  ${urlPath}  -> ${file.replace(ROOT, "public").replace(/\\/g, "/")}  ${Date.now() - started}ms`);
});

server.listen(PORT, () => {
  console.log("");
  console.log("  🍢 Titik Ngemil — dev server");
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log("");
  console.log("  Halaman cepat:");
  console.log(`     http://localhost:${PORT}/`);
  console.log(`     http://localhost:${PORT}/titik`);
  console.log(`     http://localhost:${PORT}/titik/gondangdia/denah`);
  console.log(`     http://localhost:${PORT}/masuk   (login: pilih peran, sandi apa saja)`);
  console.log(`     http://localhost:${PORT}/dashboard/admin`);
  console.log("");
  console.log("  Tekan Ctrl+C untuk berhenti.");
  console.log("");
});