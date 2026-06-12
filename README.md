# BrickShare Capital — Website

React + Vite + TypeScript + Tailwind + Framer Motion. Font: **Onest**.
6 pages: Home, About, How It Works, Projects, Education, Contact. Fully responsive + animated.

## Chalane ke liye
```bash
npm install
npm run dev      # local dev  -> http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # built site preview
```

## Sirf 2 cheezein update karni hai

### 1. Images
Apni saari images `public/images/` folder me daal de. Filenames **same rakhne hai**
(jo abhi placeholder pade hai unke naam dekh le — har image pe likha hai usme kya aata hai).

Agar koi filename change karna ho ya naya path dena ho, sirf ek file edit kar:
**`src/config/site.ts`** → `images` object. Bas wahi single source of truth hai.

### 2. Logo
`public/images/logo.png` replace kar de (transparent PNG ya SVG best).
Footer ka logo alag chahiye toh `src/config/site.ts` me `brand.logoFooter` change kar.

> Agar koi image missing rahegi toh site crash nahi hogi — graceful fallback laga hai.

## Content kahan se change hoga
Sab kuch ek jagah: **`src/config/site.ts`**
- `brand` — naam, tagline, logo
- `contact` — address, email, phone, hours
- `projects` — project cards (abhi 6 same hai, yahan se alag-alag kar de)
- `articles` / `articleCategories` — Education page
- `disclosure` — footer wala legal text

## Structure
```
src/
  config/site.ts        <- EDIT THIS (images, logo, content)
  components/           Navbar, Footer, Logo, Reveal, ui (cards/hero), ScrollToTop
  pages/                Home, About, HowItWorks, Projects, Education, Contact
public/images/          <- apni images yahan daal
```

## Note
- ROI Calculator real-time compound interest pe chalta hai (Home page).
- Forms abhi front-end only hai (submit pe success state). Backend/API tu apne hisaab se
  jod lena — handler `onClick` me hai, easy to wire to your Node/Express + n8n.
