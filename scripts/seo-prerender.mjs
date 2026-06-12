/* eslint-disable no-console */
// ============================================================================
//  SEO PRERENDER  (runs after `vite build`)
//  - har static route ke liye dist/<route>/index.html banata hai unique meta ke saath
//    => view-source har page ka ALAG dikhega (crawlers + social previews ke liye)
//  - sitemap.xml + robots.txt generate karta hai
//  - UI pe koi asar nahi (sirf <head> badalta hai; body wahi SPA root hai)
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const seo = JSON.parse(readFileSync(join(root, "src", "seo.config.json"), "utf8"));
const SITE = seo.siteUrl.replace(/\/$/, "");
const IMG = SITE + seo.defaultImage;

const templatePath = join(dist, "index.html");
if (!existsSync(templatePath)) {
  console.error("✗ dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
const template = readFileSync(templatePath, "utf8");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function applyMeta(html, { title, description, url, image }) {
  const t = esc(title);
  const d = esc(description);
  const u = esc(url);
  const img = esc(image);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[\s\S]*?(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[\s\S]*?(")/, `$1${u}$2`)
    .replace(/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[\s\S]*?(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[\s\S]*?(")/, `$1${u}$2`)
    .replace(/(<meta property="og:image" content=")[\s\S]*?(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:title" content=")[\s\S]*?(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[\s\S]*?(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[\s\S]*?(")/, `$1${img}$2`);
}

// ---- 1) Generate per-route HTML --------------------------------------------
const routes = Object.entries(seo.pages); // [ ["/", {title,description}], ... ]
for (const [route, meta] of routes) {
  const url = SITE + route;
  const html = applyMeta(template, { ...meta, url, image: IMG });
  if (route === "/") {
    writeFileSync(templatePath, html);
  } else {
    const dir = join(dist, route.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
  console.log("✓ page:", route);
}

// ---- 2) Optionally pull dynamic URLs (plans/articles) for the sitemap ------
function readEnv(name) {
  if (process.env[name]) return process.env[name];
  try {
    const env = readFileSync(join(root, ".env"), "utf8");
    const m = env.match(new RegExp(`^${name}\\s*=\\s*(.+)$`, "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
  } catch {
    return "";
  }
}
const apiBase = readEnv("VITE_API_URL").replace(/\/$/, "");
const dynamic = [];
async function pull(path, prefix) {
  if (!apiBase) return;
  try {
    const res = await fetch(apiBase + path);
    if (!res.ok) return;
    const items = await res.json();
    for (const it of items) if (it?._id) dynamic.push(`${prefix}/${it._id}`);
  } catch {
    /* API down at build time — fine, skip */
  }
}
await pull("/api/plans", "/projects");
await pull("/api/articles", "/education");

// ---- 3) sitemap.xml --------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = [...routes.map(([r]) => r), ...dynamic];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u === "/" ? "daily" : "weekly"}</changefreq>\n` +
        `    <priority>${u === "/" ? "1.0" : "0.8"}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
console.log(`✓ sitemap.xml (${urls.length} urls${dynamic.length ? `, ${dynamic.length} dynamic` : ""})`);

// ---- 4) robots.txt ---------------------------------------------------------
const robots =
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/login\n\nSitemap: ${SITE}/sitemap.xml\n`;
writeFileSync(join(dist, "robots.txt"), robots);
console.log("✓ robots.txt");

console.log("✓ SEO prerender complete");
