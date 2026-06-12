# SEO Setup — BrickShare Capital (helmet-free)

React 18 pe helmet ki zaroorat nahi. SEO 3 cheezon se handle hota hai:

## 1. Per-page meta (runtime) — `useSeo` hook
Har page apna title/description/canonical/OG `<head>` me set karta hai bina helmet ke
(`src/lib/seo.ts`). Client navigation pe bhi title badalta hai. UI pe koi asar nahi.

## 2. Per-page static source (build) — prerender
`npm run build` ke baad `scripts/seo-prerender.mjs` chalta hai aur har route ka
**alag `dist/<route>/index.html`** banata hai unique meta ke saath. Matlab
**view-source har page ka alag dikhega** (Google, Twitter/WhatsApp preview, etc.).

Verify (build ke baad):
```bash
grep -o '<title>[^<]*</title>' dist/index.html
grep -o '<title>[^<]*</title>' dist/about/index.html   # alag title
```

## 3. sitemap.xml + robots.txt
Build pe auto-generate hote hai (`dist/` me). robots admin ko block karta hai.

---

## ⚙️ Setup — bas ye karna hai

### A) Apna domain daalo (ek hi jagah)
`src/seo.config.json` → `"siteUrl"` ko apne real domain se replace karo
(e.g. `https://www.yourdomain.com`). Yahi se canonical, OG, sitemap sab bante hai.

`index.html` aur structured-data (JSON-LD) me bhi domain hardcoded hai — wahan bhi
`https://www.bricksharecapital.com` ko apne domain se replace kar dena (find & replace).

### B) Per-page text edit karni ho
`src/seo.config.json` → `pages` me har route ka title/description. Bas yahan badlo.

### C) OG image (social share preview)
`public/images/og-default.jpg` daal do (1200×630px recommended). Ye WhatsApp/Twitter/
LinkedIn pe link share karne par dikhegi.

### D) Dynamic project/article URLs sitemap me (optional)
Agar build ke time `VITE_API_URL` set hai (`.env` me), to prerender script automatically
saare `/projects/:id` aur `/education/:id` URLs sitemap me jod dega (API se fetch karke).
API down ho to bhi build fail nahi hoga — static 6 pages to aate hi hai.

---

## 🚀 Deploy notes (zaroori — warna per-page source kaam nahi karega)

Per-route HTML files tabhi kaam karenge jab host pehle **static file** serve kare,
phir SPA fallback de. Configs already included:

- **Netlify / Cloudflare Pages** → `public/_redirects` (filesystem-first, prerendered files win)
- **Vercel** → `vercel.json` (`cleanUrls` se `/about` → `/about/index.html`, baaki dynamic routes `/index.html` pe fallback)

> Agar tu **purana SPA catch-all** (`/* -> /index.html`) bina filesystem-priority ke use karega,
> to saare routes root index.html serve karenge aur per-page meta chala jayega. Upar wale
> configs isiliye diye hai.

---

## Quick reference
| Cheez | Kahan |
|---|---|
| Site domain | `src/seo.config.json` → siteUrl (+ index.html find/replace) |
| Page titles/descriptions | `src/seo.config.json` → pages |
| Hook (runtime meta) | `src/lib/seo.ts` (`useSeo`, `pageSeo`) |
| Prerender + sitemap + robots | `scripts/seo-prerender.mjs` (build pe auto) |
| OG image | `public/images/og-default.jpg` |
| Deploy fallback | `public/_redirects`, `vercel.json` |
