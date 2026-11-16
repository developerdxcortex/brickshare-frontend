import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useSeo, pageSeo } from "../lib/seo";
import { api } from "../lib/api";

/* ============================================================================
   EVENTS PAGE — BrickShare Capital Launch Evening (single file; sirf Sponsor form backend use karta hai)
   ----------------------------------------------------------------------------
   1. HERO                       "Something new is taking shape."
   2. A ROOM FULL OF POSSIBILITIES
   3. MEET THE PEOPLE BEHIND IT
   4. THE RIGHT ROOM CAN CHANGE EVERYTHING
   5. FOUR REASONS TO BE IN THE ROOM
   6. THE EVENING, HOUR BY HOUR  (carousel)
   7. SPONSORSHIP                "Put your brand in the room." (backend: POST /api/sponsors)
   8. THE INVITATION             "Be in the room."
   (Navbar + Footer site ke common components hain, page ke bahar.)

   Event ki date / venue / RSVP link sirf EVENT object me badlo —
   poore page me wahi se aata hai.
   Animations: plain CSS + IntersectionObserver (koi extra library nahi).
   ========================================================================== */

/* ------------------------------ EVENT DATA --------------------------------- */
const EVENT = {
  date: "14 Jan 2027", // poore page pe yahi date
  day: "Thursday",
  time: "6:00 — 9:00 PM",
  venue: "The Cannon West Houston",
  place: "Gallery Steps",
  address: "1334 Brittmoore Rd, Suite 1008",
  shortAddress: "1334 Brittmoore Rd, Houston",
  guestList: "Limited · RSVP required",
  rsvpLink: "https://luma.com/2cn4a2ir", // page ke saare buttons (Reserve, About the evening, Meet them) yahi link kholte hain
};

const IMG = {
  hero: "/images/events/hero-house.webp",
  room: "/images/events/room-networking.webp",
  right: [
    "/images/events/rr-1.webp",
    "/images/events/rr-2.webp",
    "/images/events/rr-3.webp",
    "/images/events/rr-4.webp",
  ],
  invite: "/images/events/evening-launch.webp",
};

const PEOPLE = [
  { name: "Amit Dubey", photo: "/images/team/amit-dubey.jpg", pos: "50% 15%" },
  { name: "Mia Rose", photo: "/images/team/mia-rose-greco.jpeg", pos: "50% 20%" },
  { name: "Aziz Ross", photo: "/images/team/aziz-ross.jpeg", pos: "50% 20%" },
  { name: "Alfredo J. Salvi F", photo: "/images/team/alfredo-salvi.jpg", pos: "50% 12%" },
];

const ROOM_POINTS = [
  { title: "Inside BrickShare", text: "An inside look at what we are building, and where we are going next." },
  { title: "Ideas that move markets", text: "Perspectives beyond the usual pitch. Real estate. Real talk." },
  { title: "An evening well spent", text: "Cocktails, curated bites and conversations worth remembering." },
];

const REASONS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Inside BrickShare",
    text: "Get an inside look at what we're building — and where we're going next.",
    icon: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M9 6h.01M12 6h.01M15 6h.01M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01" />
      </>
    ),
  },
  {
    title: "Meet the people",
    text: "Connect with founders, investors, operators, and professionals building Houston's future.",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Ideas that move markets",
    text: "Hear perspectives, ideas, and opportunities beyond the usual pitch. Real estate. Real talk.",
    icon: (
      <>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6M10 22h4" />
      </>
    ),
  },
  {
    title: "An evening well spent",
    text: "Cocktails, curated bites, and conversations worth remembering long after the night ends.",
    icon: (
      <>
        <path d="M8 22h8M7 10h10M12 15v7" />
        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
      </>
    ),
  },
];

const MOMENTS = [
  {
    short: "Doors open",
    time: "6:00 PM",
    title: "Doors open",
    text: "Arrive, grab a drink and settle into the evening.",
    image: "/images/events/hero-house.webp",
    tag: "Arrival · Gallery Steps",
  },
  {
    short: "Welcome & reception",
    time: "6:00 – 6:40",
    title: "Welcome & reception",
    text: "Appetizers. Beverages. Networking.",
    image: "/images/events/room-networking.webp",
    tag: "Reception",
  },
  {
    short: "The BrickShare story",
    time: "6:50 PM",
    title: "The BrickShare story",
    text: "Where we started, where we are headed, and why now.",
    image: "/images/events/evening-story.webp",
    tag: "Stage · Gallery Steps",
  },
  {
    short: "Houston real estate",
    time: "7:10 PM",
    title: "Houston real estate",
    text: "A focused conversation on the market and the opportunities ahead.",
    image: "/images/hero-home.webp",
    tag: "Stage · Gallery Steps",
  },
  {
    short: "The launch",
    time: "7:30 PM",
    title: "The launch moment",
    text: "A closer look at BrickShare Capital and what is taking shape.",
    image: "/images/events/evening-launch.webp",
    tag: "Stage · Gallery Steps",
    highlight: true,
  },
  {
    short: "The room is yours",
    time: "7:40 – 9:00",
    title: "The room is yours",
    text: "Meet the people and continue the conversations that matter.",
    image: "/images/events/evening-room.webp",
    tag: "Lounge",
  },
];

/* ---- Sponsorship (keys/amount backend ke PLANS se match hone chahiye) ---- */
const SPONSOR_PLANS = [
  { key: "community", label: "Community Sponsor", price: "$100", desc: "Support the launch and receive recognition across event materials." },
  { key: "bronze", label: "Bronze Sponsor", price: "$250", desc: "Build visibility with event and social media recognition." },
  { key: "silver", label: "Silver Sponsor", price: "$500", desc: "Expand your reach through event, social, and verbal recognition." },
  { key: "gold", label: "Gold Sponsor", price: "$1,000", desc: "Stand out with prominent event visibility and VIP recognition." },
  { key: "founding", label: "Founding Sponsor", price: "$1,500+", desc: "Become a premier partner and founding supporter of BrickShare Capital.", limited: true },
];

/* ------------------------------ ICONS -------------------------------------- */
function Icon({ children, size = 18, sw = 1.8 }: { children: ReactNode; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <Icon size={size}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
const ArrowLeft = ({ size = 16 }: { size?: number }) => (
  <Icon size={size}><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>
);
const ArrowUpRight = ({ size = 16 }: { size?: number }) => (
  <Icon size={size}><path d="M7 17 17 7M8 7h9v9" /></Icon>
);
const Check = () => <Icon size={13} sw={2.4}><path d="M20 6 9 17l-5-5" /></Icon>;

/* ------------------------- ANIMATION HELPERS ------------------------------- */

/** Element screen me aate hi ek baar `is-in` class lagta hai. */
function useInView<T extends Element>(threshold = 0.2) {
  // Har baar section screen pe aane par animation dobara chale:
  // kaafi hissa dikhe to `true`, poora bahar chala jaye to `false` (taaki agli baar phir chale).
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const steps = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          setInView(false);
          return;
        }
        const need = Math.min(e.boundingClientRect.height * threshold, window.innerHeight * 0.3);
        if (e.intersectionRect.height >= need) setInView(true);
      },
      { threshold: steps },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Fade + rise + blur reveal. `d` = delay (seconds). */
function Reveal({
  as: Tag = "div",
  className = "",
  d = 0,
  children,
  style,
}: {
  as?: ElementType;
  className?: string;
  d?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [ref, inView] = useInView<HTMLElement>(0.15);
  return (
    <Tag
      ref={ref}
      className={`ev-rv ${inView ? "is-in" : ""} ${className}`}
      style={{ ...style, transitionDelay: `${d}s` }}
    >
      {children}
    </Tag>
  );
}

/** Heading ke words ek-ek karke blur se saaf hote hain (video jaisa). */
function Words({ text, className = "", d = 0, step = 0.07, on }: {
  text: string; className?: string; d?: number; step?: number; on: boolean;
}) {
  return (
    <span className={`ev-words ${on ? "is-in" : ""} ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="ev-w" style={{ transitionDelay: `${d + i * step}s` }}>
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Scroll ke saath halka parallax (translateY). speed: -0.2 .. 0.2 */
function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      const v = Math.max(-80, Math.min(80, -mid * speed)); // zyada door na khiske
      el.style.setProperty("--py", `${v.toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

/* ------------------------------ STYLES ------------------------------------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:wght@600;700;800&family=Space+Mono:wght@400;700&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

.ev{
  /* Header/Footer jaisa content width: max-w-7xl (1280) - 2 x 32px padding = 1216px.
     --vw = scrollbar ke bina screen width (JS se set), --cw = content width. */
  --vw:100vw; --cw:min(calc(var(--vw) - 64px), 1216px); --hg:calc((var(--vw) - var(--cw)) / 2);
  --navy:#10121f; --navy2:#151933; --cream:#f1ede5; --ink:#161a2b; --muted:#6b6f7d;
  --gold:#f5c518; --mustard:#d29f24; --line:rgba(22,26,43,.18);
  --serif:'Instrument Serif',Georgia,serif;
  --display:'Libre Caslon Text',Georgia,serif;
  --wide:'Montserrat','Onest',system-ui,sans-serif;
  --sans:'Onest',system-ui,sans-serif;
  --mono:'Space Mono',ui-monospace,monospace;
  --ease:cubic-bezier(.2,.7,.1,1);
  font-family:var(--sans); color:var(--ink); overflow-x:clip;
}
.ev *{ box-sizing:border-box; }
.ev-wrap{ width:100%; max-width:1320px; margin:0 auto; padding:0 clamp(20px,4vw,48px); }

/* ---------- reveal primitives ---------- */
.ev-rv{ opacity:0; transform:translateY(28px); filter:blur(8px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); }
.ev-rv.is-in{ opacity:1; transform:none; filter:none; }
.ev-words .ev-w{ display:inline-block; opacity:0; transform:translateY(.35em); filter:blur(10px);
  transition:opacity .8s var(--ease), transform .8s var(--ease), filter .8s var(--ease); }
.ev-words.is-in .ev-w{ opacity:1; transform:none; filter:none; }

/* ---------- buttons ---------- */
.ev-pill{ display:inline-flex; align-items:center; gap:10px; border-radius:999px; font-weight:600;
  transition:transform .35s var(--ease), box-shadow .35s var(--ease), background .3s, color .3s; text-decoration:none; }
.ev-pill:hover{ transform:translateY(-2px); }
.ev-pill .ev-pill-ic{ display:grid; place-items:center; width:30px; height:30px; border-radius:999px;
  transition:transform .4s var(--ease); }
.ev-pill:hover .ev-pill-ic{ transform:translateX(3px) rotate(-45deg); }

/* =========================== 1. HERO =========================== */
/* Figma: 1440 x 700 frame. Sab size clamp() se scale hote hain (mobile -> 4K). */
.ev-hero{ position:relative; isolation:isolate; overflow:hidden; color:#fff; background:#0d1024;
  min-height:max(640px, min(calc(100svh - 72px), 52vw)); display:flex; flex-direction:column; }
.ev-hero-media{ position:absolute; inset:-3%; z-index:-2;
  transform:translate3d(var(--mx,0px),var(--my,0px),0); transition:transform 1.2s cubic-bezier(.2,.7,.1,1); }
.ev-hero-img{ width:100%; height:100%; object-fit:cover; object-position:center 28%; display:block;
  opacity:0; transform:scale(1.14); filter:blur(6px) brightness(.8);
  animation:evHeroImg 2.4s var(--ease) .05s forwards, evKen 26s ease-in-out 2.4s infinite alternate; }
@keyframes evHeroImg{ to{ opacity:1; transform:scale(1.04); filter:none; } }
@keyframes evKen{ from{ transform:scale(1.04); } to{ transform:scale(1.1) translate3d(-1%, -1%, 0); } }
.ev-hero::before{ content:""; position:absolute; inset:0; z-index:-1; pointer-events:none;
  background:
    linear-gradient(180deg, rgba(13,16,36,0) 0%, rgba(13,16,36,.04) 30%, rgba(13,16,36,.38) 58%, rgba(13,16,36,.86) 84%, #0d1024 100%),
    radial-gradient(60% 46% at 50% 50%, rgba(8,10,26,.3), transparent 72%); }
/* chamakti roshni jo dheere se gujarti hai */
.ev-hero-sheen{ position:absolute; inset:0; z-index:-1; pointer-events:none; mix-blend-mode:soft-light;
  background:linear-gradient(105deg, transparent 35%, rgba(255,223,120,.35) 50%, transparent 65%);
  transform:translateX(-100%); animation:evSheen 9s ease-in-out 2.6s infinite; }
@keyframes evSheen{ 0%{ transform:translateX(-100%) } 45%,100%{ transform:translateX(100%) } }

.ev-hero-in{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
  padding-top:clamp(40px, 7.5vw, 130px); padding-bottom:clamp(20px, 3.056vw, 56px); }

/* top box: BrickShare Capital presents · date */
.ev-eyebrow-box{ margin:0; font-family:'JetBrains Mono',ui-monospace,monospace; font-weight:800; font-style:normal;
  font-size:clamp(11px, 1.389vw, 24px); line-height:1; letter-spacing:clamp(1.2px, 0.181vw, 3px);
  text-align:center; text-transform:uppercase; color:#000627; background:#FFFFFF3B;
  padding:clamp(10px, 0.972vw, 18px) clamp(14px, 1.25vw, 24px);
  backdrop-filter:blur(10px) saturate(1.2); -webkit-backdrop-filter:blur(10px) saturate(1.2);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35), 0 10px 30px -12px rgba(0,0,0,.35);
  position:relative; overflow:hidden; }
.ev-eyebrow-box span{ display:block; }
.ev-eyebrow-box span + span{ margin-top:clamp(5px, 0.556vw, 10px); }
.ev-eyebrow-box::after{ content:""; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(110deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%);
  transform:translateX(-120%); animation:evGlint 1.4s var(--ease) 1.3s forwards; }
@keyframes evGlint{ to{ transform:translateX(120%) } }

/* heading */
.ev-hero-h{ margin:clamp(22px, 3.333vw, 60px) 0 0; font-family:'Libre Baskerville',Georgia,serif;
  font-weight:600; font-style:normal; text-transform:uppercase; text-align:center; color:#FFFFFF;
  font-size:clamp(32px, 6.25vw, 112px); line-height:1.156; letter-spacing:clamp(.8px, 0.181vw, 3.2px);
  text-shadow:0 8px 40px rgba(0,0,0,.35); }
.ev-hero-h .ev-line{ display:block; white-space:nowrap; }
.ev-hero-h .ev-gold{ font-style:italic; color:#F2C230;
  background:linear-gradient(100deg,#d9a52a 0%,#f6cf3a 30%,#fff1a8 45%,#f6cf3a 60%,#e2ae2c 100%);
  background-size:250% 100%; background-position:100% 0;
  -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; text-shadow:none;
  padding-right:.06em; }
.ev-hero .ev-w.ev-gold{ animation:evIn 1.1s var(--ease) forwards, evShine 6s ease-in-out 2.4s infinite; }
@keyframes evShine{ 0%,100%{ background-position:100% 0 } 50%{ background-position:0% 0 } }

/* facts box */
.ev-facts{ margin-top:clamp(26px, 2.778vw, 50px); width:min(54.167vw, 100%); min-width:min(640px,100%);
  display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(8px, 0.833vw, 14px);
  padding:clamp(12px, 0.972vw, 16px) clamp(12px, 1.042vw, 18px) clamp(12px, 1.042vw, 18px);
  border-radius:clamp(12px, 1.111vw, 18px); background:#FFFFFF1A; border:1px solid #FFFFFF33;
  backdrop-filter:blur(14px) saturate(1.2); -webkit-backdrop-filter:blur(14px) saturate(1.2); text-align:left;
  box-shadow:0 30px 60px -30px rgba(0,0,0,.55); }
.ev-fact{ min-width:0; }
.ev-fact small{ display:block; padding-left:4px; font-family:var(--sans); font-size:clamp(9px, 0.694vw, 11px);
  letter-spacing:.16em; font-weight:500; color:rgba(255,255,255,.72); }
.ev-fact b{ display:block; margin-top:clamp(8px, 0.833vw, 14px); padding:clamp(11px, 0.903vw, 15px) clamp(12px, 0.972vw, 16px);
  border-radius:clamp(8px, 0.625vw, 10px); background:rgba(14,17,38,.62); border:1px solid rgba(255,255,255,.04);
  font-family:var(--sans); font-weight:600; font-style:normal; font-size:clamp(13px, 1.042vw, 17px);
  line-height:1; letter-spacing:0; color:#FEDF27; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  transition:background .35s, transform .35s var(--ease), border-color .35s; }
.ev-fact:hover b{ background:rgba(14,17,38,.82); border-color:rgba(254,223,39,.35); transform:translateY(-2px); }

/* bottom row */
.ev-hero-foot{ display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:16px;
  padding-bottom:clamp(24px, 3.333vw, 60px);
  font-family:var(--sans); font-size:clamp(11px, 0.833vw, 14px); color:rgba(255,255,255,.7); }
.ev-hero-foot .r{ text-align:right; }
.ev-wrap.ev-hero-foot{ max-width:none; padding-left:var(--hg); padding-right:var(--hg); }
@media (max-width:1023px){ .ev-wrap.ev-hero-foot{ padding-left:32px; padding-right:32px; } }
.ev-btn-cream{ position:relative; background:#F3EFE6; color:#131627; font-family:var(--sans); font-weight:500; font-style:normal;
  font-size:clamp(13px, 0.972vw, 16px); line-height:1; letter-spacing:.4px;
  padding:clamp(6px, 0.486vw, 8px) clamp(6px, 0.486vw, 8px) clamp(6px, 0.486vw, 8px) clamp(20px, 1.806vw, 30px);
  gap:clamp(12px, 1.25vw, 20px); box-shadow:0 14px 34px -10px rgba(0,0,0,.45); }
.ev-btn-cream .ev-pill-ic{ width:clamp(30px, 2.361vw, 38px); height:clamp(30px, 2.361vw, 38px);
  background:#d9d6cf; color:#131627; }
.ev-btn-cream::before{ content:""; position:absolute; inset:-1px; border-radius:inherit; pointer-events:none;
  box-shadow:0 0 0 0 rgba(243,239,230,.55); animation:evRing 2.8s ease-out 3s infinite; }
@keyframes evRing{ 0%{ box-shadow:0 0 0 0 rgba(243,239,230,.5) } 70%,100%{ box-shadow:0 0 0 14px rgba(243,239,230,0) } }
.ev-btn-cream:hover{ background:#fff; box-shadow:0 18px 44px -10px rgba(254,223,39,.45); }
.ev-btn-cream:hover .ev-pill-ic{ background:#FEDF27; }

/* load sequence */
.ev-hero .ev-in{ opacity:0; transform:translateY(22px); filter:blur(8px); animation:evIn 1s var(--ease) forwards; }
.ev-hero .ev-drop{ opacity:0; transform:translateY(-18px) scale(.96); filter:blur(6px); animation:evIn 1s var(--ease) forwards; }
@keyframes evIn{ to{ opacity:1; transform:none; filter:none; } }
.ev-hero .ev-w{ display:inline-block; opacity:0; transform:translateY(.35em) rotate(1.5deg); filter:blur(14px);
  animation:evIn 1.1s var(--ease) forwards; }
.ev-facts .ev-fact{ opacity:0; transform:translateY(12px); animation:evIn .9s var(--ease) forwards; }

/* tablet */
@media (max-width:1023px){
  .ev-hero{ min-height:max(620px, min(calc(100svh - 72px), 80vw)); }
  .ev-facts{ min-width:0; width:min(680px,100%); }
}
/* phone */
@media (max-width:767px){
  .ev-hero{ min-height:calc(100svh - 72px); }
  .ev-hero-img{ object-position:58% 30%; }
  .ev-hero-h{ font-size:clamp(28px, 9.4vw, 46px); letter-spacing:.6px; }
  .ev-eyebrow-box{ font-size:clamp(10px, 3vw, 13px); letter-spacing:1.4px; }
  .ev-facts{ grid-template-columns:1fr; width:100%; }
  .ev-fact b{ white-space:normal; line-height:1.25; }
  .ev-hero-foot{ grid-template-columns:1fr; justify-items:center; text-align:center; }
  .ev-hero-foot .l,.ev-hero-foot .r{ display:none; }
}
@media (max-width:359px){
  .ev-hero-h{ font-size:26px; }
  .ev-hero-h .ev-line{ white-space:normal; }
}

/* =========================== 2. ROOM =========================== */
/* Figma frame 1440 x 802. Values vw me scale hote hain (1px @1440 = 0.0694vw). */
.ev-cream{ background:var(--cream); }
.ev-room{ --rg:#D69E1E; --rgt:#C8961B; background:#F1EDE5;
  padding:clamp(56px, 5.6vw, 110px) 0 clamp(56px, 3.75vw, 80px); overflow:hidden; }

/* animation base: .rm-a item "is-in" parent ke andar aate hi dikhte hain, delay = --d */
.ev-room .rm-a{ opacity:0; transform:translateY(26px); filter:blur(10px);
  transition:opacity .95s var(--ease), transform .95s var(--ease), filter .95s var(--ease); transition-delay:var(--d,0s); }
.ev-room .is-in .rm-a, .ev-room .is-in.rm-a{ opacity:1; transform:none; filter:none; }

/* ---- title row: line + HOUSTON | heading | LIMITED + line ---- */
.rm-head{ display:grid; grid-template-columns:1fr auto 1fr; align-items:stretch;
  padding-left:clamp(16px, 3.333vw, 64px); }
.rm-side{ display:flex; align-items:center; min-width:0; }
.rm-side.l{ align-self:end; padding-bottom:clamp(14px, 1.7vw, 34px); gap:clamp(8px, 1.04vw, 20px); padding-right:clamp(14px, 2.64vw, 50px); }
.rm-side.r{ align-self:center; margin-top:clamp(10px, 1.1vw, 22px); gap:clamp(6px, .694vw, 14px); padding-left:clamp(4px, .42vw, 8px); }
.rm-line{ flex:1; height:1px; background:#8F8F8F; transform:scaleX(0);
  transition:transform 1.5s var(--ease); transition-delay:var(--d,0s); }
.rm-side.l .rm-line{ transform-origin:left center; }
.rm-side.r .rm-line{ transform-origin:right center; }
.is-in .rm-line{ transform:scaleX(1); }
.rm-pill{ flex:none; font-family:var(--sans); font-size:clamp(9px, .833vw, 15px); font-weight:500; letter-spacing:.14em; text-transform:uppercase;
  color:#1B1D29; border:1px solid #8F8F8F; border-radius:999px; line-height:1;
  padding:clamp(6px, .555vw, 10px) clamp(10px, 1.04vw, 18px); background:#F1EDE5;
  opacity:0; transform:scale(.6); transition:opacity .6s var(--ease), transform .8s cubic-bezier(.3,1.6,.4,1), background .3s, color .3s;
  transition-delay:var(--d,0s); }
.is-in .rm-pill{ opacity:1; transform:none; }
.rm-pill:hover{ background:#1B1D29; color:#F1EDE5; }

.rm-h{ margin:0; text-align:center; line-height:1; }
/* Figma: Libre Bodoni 400, 62px, line-height 100%, letter-spacing 2.6px, center */
.rm-h .a{ display:block; font-family:'Libre Bodoni','Instrument Serif',Georgia,serif; font-weight:400; font-style:normal;
  text-transform:uppercase; text-align:center; font-size:clamp(28px, 4.306vw, 82px); line-height:1;
  letter-spacing:clamp(1px, .181vw, 3.4px); color:#161A2B; }
.rm-h .b{ display:block; margin-top:clamp(6px, .9vw, 16px); font-family:var(--sans); font-weight:700; text-transform:uppercase;
  font-size:clamp(28px, 4.31vw, 82px); line-height:1; letter-spacing:.045em; color:var(--rg); }
/* words / letters: bade + blur se apni jagah pe aate hain (video jaisa) */
.rm-h .w, .rm-h .c{ display:inline-block; opacity:0; filter:blur(14px); transform:translateY(.18em) scale(1.18);
  transition:opacity 1s var(--ease), filter 1s var(--ease), transform 1.1s var(--ease); transition-delay:var(--d,0s); }
.rm-h .c{ transform:translateY(.45em) scale(1); filter:blur(8px); transition-duration:.8s; }
.is-in .rm-h .w, .is-in .rm-h .c{ opacity:1; filter:none; transform:none; }

/* ---- 3 column body ---- */
.rm-grid{ width:var(--cw); max-width:none; margin:clamp(40px, 4.31vw, 86px) auto 0;
  padding:0; box-sizing:border-box;
  display:grid; grid-template-columns:minmax(0,408fr) minmax(0,384fr) minmax(0,408fr);
  grid-template-rows:1fr auto; grid-template-areas:"lt img rt" "lb img rb"; column-gap:0; }
.rm-lt{ grid-area:lt; padding-top:clamp(12px, 1.39vw, 28px); padding-right:clamp(24px, 3.5vw, 70px); }
.rm-lb{ grid-area:lb; padding-bottom:clamp(30px, 3.1vw, 60px); padding-right:16px; }
.rm-rt{ grid-area:rt; padding-top:clamp(14px, 1.25vw, 26px); padding-left:clamp(40px, 5.42vw, 104px); }
.rm-rb{ grid-area:rb; padding-bottom:clamp(14px, 1.39vw, 28px); padding-left:clamp(40px, 5.42vw, 104px); }

.rm-lt h3{ margin:0; font-family:var(--sans); font-weight:500; color:#141621; font-size:clamp(18px, 1.39vw, 27px); line-height:1.25; }
/* Figma: Onest 400, 13.5px, line-height 21px, #6E7180 */
.rm-lt p{ margin:clamp(10px, 1.04vw, 18px) 0 0; font-family:'Onest',system-ui,sans-serif; font-weight:400; color:#6E7180;
  max-width:23.5em; font-size:clamp(13px, .9375vw, 17px); line-height:1.5556; letter-spacing:0; }
.rm-btn{ display:inline-flex; align-items:center; margin-top:clamp(28px, 3.3vw, 60px); height:clamp(34px, 2.36vw, 44px);
  padding:0 clamp(16px, 1.25vw, 24px); border-radius:999px; background:#111216; color:#fff; text-decoration:none;
  font-family:var(--sans); font-weight:500; font-size:clamp(12px, .903vw, 16px); letter-spacing:.01em; position:relative; overflow:hidden; }
.rm-btn::before{ content:""; position:absolute; inset:0; background:var(--rg); transform:translateY(101%);
  transition:transform .45s var(--ease); border-radius:inherit; }
.rm-btn span{ position:relative; transition:color .3s; }
.rm-btn:hover::before{ transform:none; }
.rm-btn:hover span{ color:#111216; }

.rm-label{ margin:0; font-family:var(--sans); font-weight:500; color:#141621; font-size:clamp(13px, .972vw, 18px); }
.rm-dots{ display:flex; flex-wrap:wrap; gap:6px clamp(12px, 1.11vw, 20px); margin-top:clamp(12px, 1.25vw, 22px); }
.rm-dots span{ display:inline-flex; align-items:center; gap:7px; font-family:var(--sans); color:var(--rgt);
  font-size:clamp(11.5px, .868vw, 16px); }
.rm-dots span::before{ content:""; width:clamp(7px, .555vw, 10px); height:clamp(7px, .555vw, 10px); border-radius:50%; background:var(--rg);
  transform:scale(0); transition:transform .6s cubic-bezier(.3,1.8,.4,1); transition-delay:calc(var(--d,0s) + .15s); }
.is-in .rm-dots span::before{ transform:none; }

/* ---- photo ---- */
.rm-img{ grid-area:img; position:relative; border-radius:clamp(10px, .833vw, 16px); overflow:hidden; aspect-ratio:384/456;
  background:#e3ddd2; box-shadow:0 40px 70px -40px rgba(22,26,43,.5);
  clip-path:inset(10% 8% 10% 8% round 14px); opacity:.35; filter:saturate(0) brightness(1.25);
  transition:clip-path 1.5s var(--ease), opacity 1.1s var(--ease), filter 1.6s var(--ease); transition-delay:.15s; }
.rm-grid.is-in .rm-img{ clip-path:inset(0 0 0 0 round clamp(10px, .833vw, 16px)); opacity:1; filter:none; }
.rm-img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;
  transform:translate3d(0, var(--py,0px), 0) scale(1.14); transition:transform 1.2s var(--ease); }
.rm-img:hover img{ transform:translate3d(0, var(--py,0px), 0) scale(1.2); }

/* ---- right points ---- */
.rm-pt h4{ margin:0; font-family:var(--sans); font-weight:500; color:var(--rgt); font-size:clamp(15px, 1.11vw, 21px); line-height:1.3; }
.rm-pt p{ margin:clamp(5px, .42vw, 8px) 0 0; font-family:var(--sans); color:#6F7280; font-size:clamp(12px, .868vw, 16px); line-height:1.5; max-width:26em; }
.rm-sep{ height:1px; margin:clamp(16px, 1.39vw, 26px) 0; background:rgba(214,158,30,.28);
  transform:scaleX(0); transform-origin:left; transition:transform 1.2s var(--ease); transition-delay:var(--d,0s); }
.is-in .rm-sep{ transform:scaleX(1); }

.rm-hosts{ display:flex; align-items:center; gap:clamp(6px, .555vw, 10px); margin-top:clamp(10px, 1.1vw, 20px); }
.rm-avs{ display:flex; }
.rm-avs img{ width:clamp(32px, 2.5vw, 46px); height:clamp(32px, 2.5vw, 46px); border-radius:50%; object-fit:cover;
  border:2px solid #fff; margin-left:calc(-1 * clamp(9px, .69vw, 13px)); background:#ddd;
  opacity:0; transform:scale(.3) translateX(-10px);
  transition:opacity .5s var(--ease), transform .7s cubic-bezier(.3,1.6,.4,1); transition-delay:var(--d,0s); }
.rm-avs img:first-child{ margin-left:0; }
.is-in .rm-avs img{ opacity:1; transform:none; }
.rm-avs:hover img{ transform:translateX(calc(var(--i) * 4px)); transition-delay:0s; }
.rm-hosts b{ display:block; font-family:var(--sans); font-weight:500; color:#141621; font-size:clamp(13px, .972vw, 18px); line-height:1.2; }
.rm-hosts small{ display:block; font-family:var(--sans); color:#6F7280; font-size:clamp(11px, .8vw, 14px); }

/* ---- tablet ---- */
@media (max-width:1023px){
  .rm-grid{ width:auto; padding:0 32px; box-sizing:content-box; grid-template-columns:minmax(0,1fr) minmax(0,1fr); grid-template-rows:auto auto auto;
    grid-template-areas:"img lt" "img rt" "lb rb"; column-gap:clamp(28px,4vw,48px); max-width:860px; }
  .rm-lt,.rm-rt,.rm-lb,.rm-rb{ padding-left:0; padding-right:0; }
  .rm-lt{ padding-top:0; }
  .rm-rt{ padding-top:28px; }
  .rm-lb,.rm-rb{ padding-top:36px; padding-bottom:0; }
  .rm-btn{ margin-top:24px; }
}
/* ---- phone ---- */
@media (max-width:640px){
  .rm-head{ grid-template-columns:1fr; padding:0 20px; }
  .rm-side{ display:none; }
  .rm-tags{ display:flex !important; justify-content:center; gap:10px; margin-top:18px; }
  .rm-h .a{ font-size:clamp(26px, 8.2vw, 40px); letter-spacing:1.2px; }
  .rm-h .b{ font-size:clamp(26px, 8.4vw, 40px); letter-spacing:.03em; }
  .rm-grid{ grid-template-columns:1fr; grid-template-areas:"lt" "img" "rt" "lb" "rb"; max-width:520px; padding:0 20px; }
  .rm-img{ margin-top:32px; aspect-ratio:4/4.4; }
  .rm-rt{ padding-top:32px; }
  .rm-lb{ padding-top:32px; }
  .rm-rb{ padding-top:24px; }
}
.rm-tags{ display:none; }

/* =========================== 3. PEOPLE =========================== */
/* Figma frame 1440 x 560: photos 4 x (196 x 250), gap 16 | 62 | text column. */
.ev-dark{ background:var(--navy); color:#fff; }
.pp{ background:#0E0F14; color:#fff; padding:clamp(64px, 9.5vw, 170px) 0 clamp(64px, 9.65vw, 172px); overflow:hidden; }
.pp-wrap{ width:var(--cw); margin:0 auto; display:grid;
  grid-template-columns:minmax(0,800fr) minmax(0,372fr); column-gap:clamp(32px, 4.306vw, 62px); align-items:start; }

/* photos */
.pp-faces{ display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:clamp(10px, 1.111vw, 20px); }
.pp-face{ margin:0; cursor:default; }
.pp-ph{ position:relative; overflow:hidden; aspect-ratio:196/250; border-radius:clamp(10px, .833vw, 16px); background:#1b1d25;
  clip-path:inset(100% 0 0 0 round clamp(10px, .833vw, 16px)); transform:translateY(40px);
  transition:clip-path 1.2s var(--ease), transform 1.2s var(--ease); transition-delay:var(--d,0s); }
.pp-ph img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;
  transform:scale(1.25); transition:transform 1.6s var(--ease); transition-delay:var(--d,0s); }
.pp-ph::after{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  box-shadow:inset 0 0 0 1px rgba(254,223,39,0); transition:box-shadow .45s;
  background:linear-gradient(180deg, transparent 60%, rgba(14,15,20,.35)); opacity:0; }
.pp.is-in .pp-ph{ clip-path:inset(0 0 0 0 round clamp(10px, .833vw, 16px)); transform:none; }
.pp.is-in .pp-ph img{ transform:scale(1); }
.pp-face figcaption{ margin-top:clamp(14px, 1.39vw, 26px); padding-left:2px; font-family:var(--sans); font-weight:400;
  font-size:clamp(12px, .903vw, 17px); line-height:1.2; color:#fff; position:relative; display:inline-block;
  opacity:0; transform:translateY(10px); transition:opacity .8s var(--ease), transform .8s var(--ease), color .3s;
  transition-delay:calc(var(--d,0s) + .45s); }
.pp-face figcaption::after{ content:""; position:absolute; left:2px; right:0; bottom:-5px; height:1px; background:#FEDF27;
  transform:scaleX(0); transform-origin:left; transition:transform .45s var(--ease); }
.pp.is-in .pp-face figcaption{ opacity:1; transform:none; }
/* hover */
.pp-face:hover .pp-ph img{ transform:scale(1.07); transition-delay:0s; transition-duration:.9s; }
.pp-face:hover .pp-ph::after{ opacity:1; box-shadow:inset 0 0 0 1px rgba(254,223,39,.65); }
.pp-face:hover figcaption{ color:#FEDF27; transition-delay:0s; }
.pp-face:hover figcaption::after{ transform:scaleX(1); }

/* text column */
.pp-copy{ padding-top:2px; }
.pp-h{ margin:0; font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:max(40px, calc(var(--cw) * 56 / 1216));
  line-height:.87; letter-spacing:-.005em; color:#fff; }
.pp-h > span{ display:block; white-space:nowrap; }
.pp-h .g{ color:#FEDF27; }
.pp-p{ margin:clamp(28px, 2.92vw, 52px) 0 0; max-width:23.5em; font-family:var(--sans); font-weight:400;
  font-size:clamp(13px, .9375vw, 17px); line-height:1.5556; color:#B8B9BD; }
.pp-btn{ display:inline-flex; align-items:center; justify-content:center; margin-top:clamp(22px, 2.01vw, 36px);
  height:clamp(34px, 2.43vw, 44px); padding:0 clamp(17px, 1.25vw, 24px); border-radius:999px; background:#fff; color:#0E0F14;
  font-family:var(--sans); font-weight:500; font-size:clamp(12px, .868vw, 16px); text-decoration:none; position:relative; overflow:hidden;
  transition:transform .35s var(--ease), box-shadow .35s var(--ease); }
.pp-btn::before{ content:""; position:absolute; inset:0; background:#FEDF27; transform:translateY(101%);
  transition:transform .45s var(--ease); border-radius:inherit; }
.pp-btn span{ position:relative; }
.pp.is-in .pp-btn:hover{ transform:translateY(-2px); box-shadow:0 12px 30px -10px rgba(254,223,39,.5); }
.pp-btn:hover::before{ transform:none; }
.pp .rm-a{ opacity:0; transform:translateY(22px); filter:blur(8px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); transition-delay:var(--d,0s); }
.pp.is-in .rm-a{ opacity:1; transform:none; filter:none; }
.pp-h .w{ display:inline-block; opacity:0; filter:blur(12px); transform:translateY(.25em);
  transition:opacity 1s var(--ease), filter 1s var(--ease), transform 1s var(--ease); transition-delay:var(--d,0s); }
.pp.is-in .pp-h .w{ opacity:1; filter:none; transform:none; }

/* tablet: text upar, photos niche */
@media (max-width:1023px){
  .pp-wrap{ grid-template-columns:1fr; width:auto; padding:0 32px; max-width:860px; }
  .pp-copy{ order:-1; display:grid; grid-template-columns:auto 1fr; column-gap:40px; align-items:end; }
  .pp-h{ font-size:clamp(40px, 6.4vw, 60px); }
  .pp-p{ margin-top:0; }
  .pp-btn{ grid-column:2; justify-self:start; }
  .pp-faces{ margin-top:clamp(36px, 5vw, 56px); }
}
/* phone: 2 x 2 photos */
@media (max-width:640px){
  .pp-copy{ display:block; }
  .pp-h{ font-size:clamp(38px, 11vw, 52px); }
  .pp-p{ margin-top:22px; }
  .pp-faces{ grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px 12px; margin-top:36px; }
}

/* =========================== 4. RIGHT ROOM =========================== */
/* Figma frame 1440 x 747. --u = 1 Figma px (1440 pe), screen ke saath scale hota hai,
   isliye text aur photos ki jagah har desktop size pe same rehti hai. */
.ev-eyebrow{ font-size:11px; font-weight:700; letter-spacing:.32em; color:var(--mustard); text-transform:uppercase; }
.rr{ --u:calc(var(--cw) / 1320); position:relative; overflow:hidden; background:#F2EEE5; color:#131627;
  padding:calc(94 * var(--u)) 0 calc(70 * var(--u)); text-align:center; }
.rr-in{ position:relative; z-index:2; }
.rr-eye{ margin:0; font-family:var(--sans); font-weight:600; font-size:max(11px, calc(13 * var(--u))); line-height:1;
  letter-spacing:.27em; text-transform:uppercase; color:#AD970E; }
.rr-h{ margin:calc(30 * var(--u)) 0 0; line-height:1; }
.rr-h .a{ display:block; font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:calc(62 * var(--u));
  line-height:1; letter-spacing:0; color:#131627; white-space:nowrap; }
.rr-h .b{ display:block; margin-top:calc(18 * var(--u)); font-family:var(--sans); font-weight:600; font-size:calc(64 * var(--u));
  line-height:1; letter-spacing:.005em; text-transform:uppercase; color:#D39A1B; white-space:nowrap; }

/* staircase lines: 1440 wide box, har line ka left Figma jaisa */
.rr-lines{ list-style:none; padding:0; width:calc(1440 * var(--u)); margin:calc(66 * var(--u)) 0 0 calc(50% - 720 * var(--u)); text-align:left; }
.rr-lines li{ display:flex; align-items:center; gap:calc(23 * var(--u)); font-family:'Instrument Serif',Georgia,serif;
  font-size:calc(46 * var(--u)); line-height:1; color:#131627; white-space:nowrap; }
.rr-lines li:nth-child(1){ padding-left:calc(322 * var(--u)); }
.rr-lines li:nth-child(2){ padding-left:calc(577 * var(--u)); margin-top:calc(54 * var(--u)); }
.rr-lines li:nth-child(3){ padding-left:calc(927 * var(--u)); margin-top:calc(40 * var(--u)); }
.rr-star{ flex:none; width:calc(23 * var(--u)); height:calc(23 * var(--u)); color:#E4C300; }
.rr-foot{ margin-top:calc(52 * var(--u)); }
.rr-foot i{ display:block; width:calc(260 * var(--u)); height:1px; margin:0 auto;
  background:linear-gradient(90deg, rgba(228,195,1,0), #E4C301 50%, rgba(228,195,1,0)); }
.rr-foot p{ margin:calc(26 * var(--u)) 0 0; font-family:var(--sans); font-weight:400; font-size:max(15px, calc(19 * var(--u)));
  line-height:1.2; color:#3A3D4F; }

/* floating photos: center se Figma jaisi doori pe */
.rr-ph{ position:absolute; z-index:1; overflow:hidden; background:#e3ddd2;
  box-shadow:0 calc(22 * var(--u)) calc(40 * var(--u)) calc(-18 * var(--u)) rgba(19,22,39,.38); }
.rr-ph img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; transition:transform .9s var(--ease); }
.rr-ph:hover img{ transform:scale(1.08); }
.rr-ph.p1{ left:calc(50% - 600 * var(--u)); top:calc(76 * var(--u)); width:calc(132 * var(--u)); height:calc(121 * var(--u)); }
.rr-ph.p2{ left:calc(50% + 482 * var(--u)); top:calc(119 * var(--u)); width:calc(171 * var(--u)); height:calc(171 * var(--u)); }
.rr-ph.p3{ left:calc(50% - 646 * var(--u)); top:calc(450 * var(--u)); width:calc(171 * var(--u)); height:calc(171 * var(--u)); }
.rr-ph.p4{ left:calc(50% + 521 * var(--u)); top:calc(574 * var(--u)); width:calc(132 * var(--u)); height:calc(121 * var(--u)); }
.rr-ph{ translate:0 var(--py,0px); }
.rr-ph-in{ position:absolute; inset:0; animation:rrBob 7s ease-in-out infinite; }
.rr-ph.p2 .rr-ph-in{ animation-delay:-2.2s; } .rr-ph.p3 .rr-ph-in{ animation-delay:-4.1s; } .rr-ph.p4 .rr-ph-in{ animation-delay:-1.3s; }
@keyframes rrBob{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(calc(-9 * var(--u))) } }
.rr-tiles{ display:none; }

/* animations (section screen pe aate hi) */
.rr .an{ opacity:0; transform:translateY(calc(24 * var(--u))); filter:blur(8px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); transition-delay:var(--d,0s); }
.rr.is-in .an{ opacity:1; transform:none; filter:none; }
.rr-eye.an{ letter-spacing:.6em; transition-property:opacity, transform, filter, letter-spacing; }
.rr.is-in .rr-eye.an{ letter-spacing:.27em; }
.rr .w{ display:inline-block; opacity:0; filter:blur(12px); transform:translateY(.3em) scale(1.08);
  transition:opacity 1s var(--ease), filter 1s var(--ease), transform 1.1s var(--ease); transition-delay:var(--d,0s); }
.rr.is-in .w{ opacity:1; filter:none; transform:none; }
.rr-lines li{ opacity:0; transform:translateX(calc(-40 * var(--u))); filter:blur(8px);
  transition:opacity 1s var(--ease), transform 1.1s var(--ease), filter 1s var(--ease); transition-delay:var(--d,0s); }
.rr.is-in .rr-lines li{ opacity:1; transform:none; filter:none; }
.rr-lines li .rr-star{ transform:scale(0) rotate(-120deg); transition:transform 1s cubic-bezier(.3,1.6,.4,1); transition-delay:calc(var(--d,0s) + .2s); }
.rr.is-in .rr-lines li .rr-star{ transform:none; animation:rrTwinkle 3.8s ease-in-out calc(var(--d,0s) + 1.4s) infinite; }
@keyframes rrTwinkle{ 0%,100%{ transform:scale(1) rotate(0) } 50%{ transform:scale(.75) rotate(45deg) } }
.rr-foot i{ transform:scaleX(0); transition:transform 1.4s var(--ease); transition-delay:var(--d,0s); }
.rr.is-in .rr-foot i{ transform:scaleX(1); }
.rr-ph{ clip-path:inset(50% 50% 50% 50%); opacity:0;
  transition:clip-path 1.3s var(--ease), opacity .6s var(--ease); transition-delay:var(--d,0s); }
.rr.is-in .rr-ph{ clip-path:inset(0 0 0 0); opacity:1; }

/* tablet */
@media (max-width:1023px){
  .rr{ --u:.72px; padding:96px 0 72px; }
  .rr-eye{ font-size:12px; }
  .rr-h .a{ font-size:clamp(44px, 6vw, 56px); }
  .rr-h .b{ font-size:clamp(30px, 5.2vw, 48px); white-space:normal; padding:0 24px; }
  .rr-lines{ width:min(640px, calc(100% - 64px)); margin:56px auto 0; }
  .rr-lines li{ font-size:clamp(32px, 4.6vw, 42px); gap:16px; }
  .rr-lines li:nth-child(1){ padding-left:0; }
  .rr-lines li:nth-child(2){ padding-left:24%; margin-top:34px; }
  .rr-lines li:nth-child(3){ padding-left:52%; margin-top:30px; }
  .rr-star{ width:20px; height:20px; }
  .rr-foot{ margin-top:46px; }
  .rr-foot i{ width:220px; }
  .rr-foot p{ font-size:17px; margin-top:20px; }
  .rr-ph.p1{ left:3%; top:24px; width:96px; height:88px; }
  .rr-ph.p2{ left:auto; right:3%; top:40px; width:110px; height:110px; }
  .rr-ph.p3{ left:3%; top:auto; bottom:120px; width:110px; height:110px; }
  .rr-ph.p4{ left:auto; right:3%; top:auto; bottom:40px; width:96px; height:88px; }
}
/* phone: floating photos hata ke niche 4 tiles */
@media (max-width:640px){
  .rr{ padding:72px 0 64px; }
  .rr-h .a{ font-size:clamp(38px, 11vw, 46px); }
  .rr-h .b{ font-size:clamp(26px, 7.6vw, 34px); padding:0 20px; }
  .rr-lines{ width:calc(100% - 40px); margin-left:auto; margin-right:auto; }
  .rr-lines li{ font-size:clamp(26px, 8vw, 34px); gap:12px; }
  .rr-lines li:nth-child(2){ padding-left:10%; margin-top:22px; }
  .rr-lines li:nth-child(3){ padding-left:22%; margin-top:22px; }
  .rr-star{ width:16px; height:16px; }
  .rr-ph{ display:none; }
  .rr-tiles{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:36px 20px 0; }
  .rr-tiles img{ width:100%; aspect-ratio:1; object-fit:cover; display:block; }
  .rr-foot p{ font-size:16px; padding:0 20px; }
}

/* =========================== 5. REASONS =========================== */
/* Figma frame 1440 x 685: 4 cards 318 x 330, gap 24. */
.rs{ --u:calc(var(--cw) / 1320); background:#0E0F14; color:#fff; overflow:hidden;
  padding:calc(80 * var(--u)) 0 calc(90 * var(--u)); text-align:center; }
.rs-h{ margin:0; line-height:1; white-space:nowrap; }
.rs-h .a{ font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:calc(64 * var(--u)); letter-spacing:-.005em; color:#fff; }
.rs-h .b{ font-family:var(--sans); font-weight:700; font-size:calc(60 * var(--u)); letter-spacing:-.005em; color:#FEDF27; }
.rs-h .grp{ white-space:nowrap; }
.rs-line{ display:block; width:calc(840 * var(--u)); max-width:90%; height:1px; margin:calc(24 * var(--u)) auto 0;
  background:linear-gradient(90deg, rgba(228,195,1,0), #E4C301 50%, rgba(228,195,1,0)); }
.rs-sub{ margin:calc(36 * var(--u)) 0 0; font-family:var(--sans); font-weight:400; font-size:max(14px, calc(17 * var(--u))); line-height:1.2; color:#C9CCDA; }
.rs-grid{ width:calc(1320 * var(--u)); margin:calc(44 * var(--u)) auto 0; display:grid;
  grid-template-columns:repeat(4, minmax(0,1fr)); gap:calc(24 * var(--u)); text-align:left; }
.rs-card{ position:relative; overflow:hidden; min-height:calc(330 * var(--u)); border-radius:calc(8 * var(--u));
  padding:calc(28 * var(--u)) calc(28 * var(--u)) calc(32 * var(--u)); color:#131627;
  background:linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 22%, #FFF6E6 55%, #FFE7BB 100%);
  display:flex; flex-direction:column;
  transition:transform .6s var(--ease), box-shadow .6s var(--ease); }
.rs-card::after{ content:""; position:absolute; top:0; bottom:0; left:-60%; width:45%; pointer-events:none;
  background:linear-gradient(105deg, transparent, rgba(255,255,255,.75), transparent); transform:skewX(-12deg); transition:left .9s var(--ease); }
.rs-card:hover{ transform:translateY(calc(-10 * var(--u))); box-shadow:0 calc(30 * var(--u)) calc(60 * var(--u)) calc(-24 * var(--u)) rgba(254,223,39,.45); }
.rs-card:hover::after{ left:120%; }
.rs-top{ display:flex; justify-content:space-between; align-items:flex-start; }
.rs-ic{ display:grid; place-items:center; width:calc(72 * var(--u)); height:calc(72 * var(--u)); border-radius:calc(12 * var(--u));
  background:#131627; color:#D9B60F; transition:transform .6s cubic-bezier(.3,1.5,.4,1), color .3s; }
.rs-ic svg{ width:calc(32 * var(--u)); height:calc(32 * var(--u)); }
.rs-card:hover .rs-ic{ transform:rotate(-8deg) scale(1.06); color:#FEDF27; }
.rs-n{ font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:calc(58 * var(--u)); line-height:1;
  margin-top:calc(2 * var(--u)); margin-right:calc(2 * var(--u)); color:#131627; }
.rs-div{ height:1px; margin-top:calc(50 * var(--u)); background:#DCD4C9; transform-origin:left; }
.rs-card h3{ margin:calc(26 * var(--u)) 0 0; font-family:var(--sans); font-weight:600; font-size:max(17px, calc(24 * var(--u)));
  line-height:1.15; color:#131627; }
.rs-card p{ margin:calc(22 * var(--u)) 0 0; font-family:var(--sans); font-weight:400; font-size:max(13px, calc(16 * var(--u)));
  line-height:1.5625; color:#23263A; }

/* animations */
.rs .w{ display:inline-block; opacity:0; filter:blur(12px); transform:translateY(.3em);
  transition:opacity 1s var(--ease), filter 1s var(--ease), transform 1s var(--ease); transition-delay:var(--d,0s); }
.rs.is-in .w{ opacity:1; filter:none; transform:none; }
.rs-line{ transform:scaleX(0); transition:transform 1.4s var(--ease); transition-delay:var(--d,0s); }
.rs.is-in .rs-line{ transform:scaleX(1); }
.rs .an{ opacity:0; transform:translateY(calc(20 * var(--u))); filter:blur(6px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); transition-delay:var(--d,0s); }
.rs.is-in .an{ opacity:1; transform:none; filter:none; }
.rs-card.an{ transform:translateY(calc(60 * var(--u))) scale(.96); filter:blur(4px);
  transition:opacity 1s var(--ease), transform 1.1s var(--ease), filter 1s var(--ease), box-shadow .6s var(--ease);
  transition-delay:var(--d,0s), var(--d,0s), var(--d,0s), 0s; }
.rs.is-in .rs-card.an{ transform:none; }
.rs.is-in .rs-card.an:hover{ transform:translateY(calc(-10 * var(--u))); transition-delay:0s; }
.rs-ic{ scale:.4; opacity:0; transition:scale .8s cubic-bezier(.3,1.6,.4,1), opacity .5s, transform .6s cubic-bezier(.3,1.5,.4,1), color .3s;
  transition-delay:calc(var(--d,0s) + .35s), calc(var(--d,0s) + .35s), 0s, 0s; }
.rs.is-in .rs-ic{ scale:1; opacity:1; }
.rs-n{ opacity:0; translate:calc(16 * var(--u)) 0; transition:opacity .8s var(--ease), translate .8s var(--ease);
  transition-delay:calc(var(--d,0s) + .45s); }
.rs.is-in .rs-n{ opacity:1; translate:0 0; }
.rs-div{ transform:scaleX(0); transition:transform 1s var(--ease); transition-delay:calc(var(--d,0s) + .5s); }
.rs.is-in .rs-div{ transform:scaleX(1); }

/* tablet: 2 x 2 */
@media (max-width:1023px){
  .rs{ --u:.92px; padding:88px 0 88px; }
  .rs-h{ white-space:normal; padding:0 32px; }
  .rs-h .a{ font-size:clamp(40px, 6vw, 56px); }
  .rs-h .b{ font-size:clamp(38px, 5.6vw, 52px); }
  .rs-grid{ width:auto; max-width:760px; margin-left:auto; margin-right:auto; padding:0 32px; grid-template-columns:repeat(2, minmax(0,1fr)); }
  .rs-card{ min-height:0; }
}
/* phone: 1 column */
@media (max-width:640px){
  .rs{ --u:.9px; padding:72px 0; }
  .rs-h .a{ font-size:clamp(34px, 10vw, 44px); }
  .rs-h .b{ font-size:clamp(32px, 9.4vw, 42px); }
  .rs-h .grp{ display:inline-block; }
  .rs-grid{ grid-template-columns:1fr; padding:0 20px; gap:16px; }
  .rs-div{ margin-top:32px; }
}

/* =========================== 6. EVENING =========================== */
/* Figma frame 1440 x 900. 3 cards loop me ghoomte hain: left | center | right.
   --u = 1 Figma px @1440. Center card saaf, side cards safed (washed). */
.ev-white{ background:#fff; }
.eh{ --u:calc(var(--cw) / 1320); background:#fff; color:#131627; overflow:hidden;
  padding:calc(78 * var(--u)) 0 calc(56 * var(--u)); }
.eh-box{ width:calc(1320 * var(--u)); margin:0 auto; }
.eh-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:calc(40 * var(--u));
  padding:0 calc(66 * var(--u)) 0 calc(64 * var(--u)); }
.eh-h{ margin:0; }
.eh-h .a{ display:block; font-family:var(--sans); font-weight:700; font-size:max(38px, calc(62 * var(--u))); line-height:1;
  letter-spacing:-.02em; color:#131627; white-space:nowrap; }
.eh-h .b{ display:block; margin-top:calc(-2 * var(--u)); font-family:'Instrument Serif',Georgia,serif; font-weight:400;
  font-size:max(40px, calc(68 * var(--u))); line-height:1; color:#131627; white-space:nowrap; }
.eh-p{ margin:calc(32 * var(--u)) 0 0; max-width:max(260px, calc(330 * var(--u))); font-family:var(--sans); font-weight:400;
  font-size:max(13px, calc(14 * var(--u))); line-height:1.5; color:#6E7180; }

.eh-strip{ display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:6px 0;
  margin-top:calc(34 * var(--u)); font-family:var(--sans); font-size:max(11px, calc(12 * var(--u))); line-height:1.2; color:#6E7180; }
.eh-strip .it{ display:inline-flex; gap:.45em; padding:4px calc(10 * var(--u)); border-radius:999px; border:0; background:none;
  font:inherit; color:inherit; white-space:nowrap; transition:background .35s, color .35s; }
.eh-strip button.it{ cursor:pointer; }
.eh-strip button.it:hover{ color:#131627; }
.eh-strip .it.on{ color:#131627; font-weight:500; }
.eh-strip .dot{ opacity:.6; }

/* track + 3 slots */
.eh-track{ position:relative; height:calc(452 * var(--u)); margin-top:calc(16 * var(--u)); perspective:1400px; }
.ec{ position:absolute; top:0; left:0; width:calc(340 * var(--u)); cursor:pointer; transform-style:preserve-3d;
  transition:left 1s var(--ease), top 1s var(--ease), width 1s var(--ease), transform 1s var(--ease), opacity .8s var(--ease); }
.ec-im{ position:relative; overflow:hidden; height:calc(250 * var(--u)); border-radius:calc(16 * var(--u)); background:#eef0f4;
  transition:height 1s var(--ease), box-shadow 1s var(--ease); }
.ec-im img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; display:block; transform:scale(1.06);
  transition:transform 1.4s var(--ease); }
.ec-wash{ position:absolute; inset:0; background:#fff; opacity:.55; transition:opacity 1s var(--ease); pointer-events:none; }
.ec h3{ margin:calc(20 * var(--u)) 0 0; font-family:var(--sans); font-weight:600; font-size:max(14px, calc(16 * var(--u)));
  line-height:1.25; color:#B8BAC3; transition:color .8s, font-size 1s var(--ease), margin 1s var(--ease); }
.ec p{ margin:calc(8 * var(--u)) 0 0; max-width:calc(300 * var(--u)); font-family:var(--sans); font-size:max(12px, calc(13 * var(--u)));
  line-height:1.4; color:#D3D5DB; transition:color .8s, max-width 1s var(--ease); }
.ec-bdg{ position:absolute; z-index:2; top:calc(16 * var(--u)); display:inline-flex; align-items:center; gap:6px; border-radius:999px;
  font-family:var(--sans); font-size:max(10.5px, calc(12 * var(--u))); line-height:1; padding:calc(7 * var(--u)) calc(13 * var(--u));
  transition:opacity .6s; }
.ec-bdg.l{ left:calc(16 * var(--u)); background:#fff; color:#131627; font-weight:500; }
.ec-bdg.r{ right:calc(16 * var(--u)); border:1px solid rgba(255,255,255,.85); color:#fff; background:rgba(10,12,28,.34);
  backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }
.ec-bdg.l svg{ width:12px; height:12px; }

/* slots */
.ec.s-1{ left:0; top:calc(60 * var(--u)); transform:rotateY(4deg); transform-origin:right center; z-index:2; }
.ec.s1{ left:calc(980 * var(--u)); top:calc(60 * var(--u)); transform:rotateY(-4deg); transform-origin:left center; z-index:2; }
.ec.s-1 .ec-wash{ opacity:.6; }
.ec.s1 .ec-wash{ opacity:.32; }
.ec.s1 h3{ color:#8D909C; } .ec.s1 p{ color:#B9BCC5; }
.ec.s0{ left:calc(380 * var(--u)); top:0; width:calc(560 * var(--u)); transform:none; z-index:3; cursor:default; }
.ec.s0 .ec-im{ height:calc(380 * var(--u)); box-shadow:0 calc(40 * var(--u)) calc(70 * var(--u)) calc(-40 * var(--u)) rgba(19,22,39,.5); }
.ec.s0 .ec-im img{ transform:scale(1.02); }
.ec.s0 .ec-wash{ opacity:0; }
.ec.s0 h3{ margin-top:calc(24 * var(--u)); font-size:max(16px, calc(19 * var(--u))); color:#131627; }
.ec.s0 p{ max-width:none; color:#6E7180; }
.ec:not(.s0) .ec-bdg.r{ opacity:0; }
.ec:not(.s0):hover .ec-wash{ opacity:.2; }
.ec:not(.s0):hover .ec-im img{ transform:scale(1.08); }
.ec.s0:hover .ec-im img{ transform:scale(1.06); }
/* jo card peeche se ghoom ke aata hai */
.ec.in-r{ animation:ecInR 1s var(--ease) backwards; }
.ec.in-l{ animation:ecInL 1s var(--ease) backwards; }
@keyframes ecInR{ from{ opacity:0; transform:translateX(calc(120 * var(--u))) rotateY(-50deg) scale(.86); } to{ opacity:1; transform:rotateY(-4deg); } }
@keyframes ecInL{ from{ opacity:0; transform:translateX(calc(-120 * var(--u))) rotateY(50deg) scale(.86); } to{ opacity:1; transform:rotateY(4deg); } }

/* nav */
.eh-nav{ display:flex; justify-content:center; align-items:center; gap:calc(14 * var(--u)); margin-top:calc(80 * var(--u)); }
.eh-arr{ display:grid; place-items:center; width:max(40px, calc(44 * var(--u))); height:max(40px, calc(44 * var(--u))); border-radius:50%;
  border:1px solid rgba(19,22,39,.3); background:#fff; color:#131627; cursor:pointer; padding:0;
  transition:transform .3s var(--ease), background .3s, color .3s, border-color .3s; }
.eh-arr.dk{ background:#131627; color:#fff; border-color:#131627; }
.eh-arr:hover{ transform:scale(1.08); background:#FEDF27; color:#131627; border-color:#FEDF27; }
.eh-dots{ display:flex; align-items:center; gap:6px; }
.eh-dots button{ position:relative; overflow:hidden; width:6px; height:6px; padding:0; border:0; border-radius:999px; cursor:pointer;
  background:rgba(19,22,39,.22); transition:width .5s var(--ease); }
.eh-dots button.on{ width:24px; }
.eh-dots button.on::after{ content:""; position:absolute; inset:0; background:#131627; transform-origin:left; transform:scaleX(1); }
.eh-dots.play button.on::after{ animation:ehProg var(--dur) linear both; }
@keyframes ehProg{ from{ transform:scaleX(0) } to{ transform:scaleX(1) } }

/* reveal */
.eh .an{ opacity:0; transform:translateY(calc(24 * var(--u))); filter:blur(8px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); transition-delay:var(--d,0s); }
.eh.is-in .an{ opacity:1; transform:none; filter:none; }
.eh .w{ display:inline-block; opacity:0; filter:blur(12px); transform:translateY(.3em);
  transition:opacity 1s var(--ease), filter 1s var(--ease), transform 1s var(--ease); transition-delay:var(--d,0s); }
.eh.is-in .w{ opacity:1; filter:none; transform:none; }
/* entry (har baar section pe aane par): pehle beech wala card, phir side cards bahar se paas aate hain */
.eh:not(.is-in) .ec.s0{ opacity:0; transform:translateY(calc(50 * var(--u))) scale(.94); }
.eh:not(.is-in) .ec.s-1{ opacity:0; left:calc(-260 * var(--u)); }
.eh:not(.is-in) .ec.s1{ opacity:0; left:calc(1240 * var(--u)); }
.eh.fresh .ec.s-1,.eh.fresh .ec.s1{ transition-delay:.3s; }

/* tablet: wahi 3-card layout, screen ke hisaab se chhota */
@media (max-width:1023px){
  .eh{ --u:calc((var(--vw) - 64px) / 1320); padding:72px 0 56px; }
  .eh-head{ padding:0; flex-wrap:wrap; }
  .eh-strip{ margin-top:28px; }
  .eh-track{ margin-top:20px; height:calc(380 * var(--u) + 110px); }
  .eh-nav{ margin-top:28px; }
}
/* phone: ek card poori width, baaki swipe / auto */
@media (max-width:767px){
  .eh{ padding:64px 0 52px; }
  .eh-box{ width:auto; padding:0 20px; }
  .eh-head{ flex-direction:column; gap:0; }
  .eh-h .a{ font-size:clamp(34px, 10vw, 44px); }
  .eh-h .b{ font-size:clamp(36px, 10.6vw, 46px); }
  .eh-p{ margin-top:18px; max-width:none; }
  .eh-strip{ display:none; }
  .eh-track{ height:auto; margin-top:28px; perspective:none; }
  .ec{ position:relative; display:none; width:100% !important; left:auto !important; top:auto !important; transform:none !important; }
  .ec.s0{ display:block; animation:ecMob .7s var(--ease) both; }
  .ec.s0 .ec-im{ height:auto; aspect-ratio:4/3; }
  .ec.s0 h3{ font-size:18px; margin-top:18px; }
  .ec.s0 p{ font-size:13px; }
  .eh-nav{ margin-top:28px; gap:12px; }
}
@keyframes ecMob{ from{ opacity:0; transform:translateX(30px); } to{ opacity:1; transform:none; } }

/* =========================== 7. SPONSORSHIP =========================== */
/* Baaki sections jaisa: --u = 1 Figma px @1440, Instrument Serif + Onest. */
.ev-sponsor{ --u:calc(var(--cw) / 1320); background:#F2EEE5; color:#131627;
  padding:calc(100 * var(--u)) 0 calc(100 * var(--u)); }
.ev-sponsor .ev-wrap{ max-width:none; width:calc(1320 * var(--u)); padding:0; }
.ev-sponsor .ev-eyebrow{ font-family:var(--sans); font-weight:600; font-size:max(11px, calc(13 * var(--u))); line-height:1;
  letter-spacing:.27em; color:#AD970E; }
.ev-sp-head{ display:flex; justify-content:space-between; align-items:flex-end; gap:calc(40 * var(--u)); }
.ev-sp-h{ margin:calc(24 * var(--u)) 0 0; line-height:1; }
.ev-sp-h .a{ display:block; font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:max(40px, calc(62 * var(--u)));
  line-height:1; color:#131627; white-space:nowrap; }
.ev-sp-h .b{ display:block; margin-top:calc(14 * var(--u)); font-family:var(--sans); font-weight:600; text-transform:uppercase;
  font-size:max(30px, calc(56 * var(--u))); line-height:1; letter-spacing:.005em; color:#D39A1B; white-space:nowrap; }
.ev-sp-lead{ max-width:max(280px, calc(380 * var(--u))); margin:0; font-family:var(--sans); font-weight:400;
  font-size:max(13px, calc(14 * var(--u))); line-height:1.5; color:#6E7180; }
.ev-sp-hand{ margin:calc(16 * var(--u)) 0 0; font-family:'Onest',system-ui,sans-serif; font-style:normal; font-weight:600;
  font-size:max(17px, calc(22 * var(--u))); line-height:1.2; letter-spacing:-.005em; color:#D39A1B; }

/* list + form: dono ki height barabar, 5 cards ek jaisi height ke */
.ev-sp-grid{ display:grid; grid-template-columns:minmax(0, 1.12fr) minmax(0, 1fr); gap:calc(32 * var(--u));
  margin-top:calc(52 * var(--u)); align-items:stretch; }
.ev-sp-list{ display:grid; grid-template-rows:repeat(5, minmax(0, 1fr)); gap:calc(12 * var(--u)); }
.ev-sp-list > *{ display:flex; min-height:0; }
.ev-sp-card{ all:unset; box-sizing:border-box; width:100%; min-height:calc(92 * var(--u)); cursor:pointer;
  display:grid; grid-template-columns:calc(22 * var(--u)) minmax(0, 1fr) calc(130 * var(--u)); align-items:center;
  column-gap:calc(20 * var(--u)); padding:calc(18 * var(--u)) calc(26 * var(--u)) calc(18 * var(--u)) calc(24 * var(--u));
  border-radius:calc(12 * var(--u)); background:#fff; border:1px solid rgba(19,22,39,.08); color:#131627;
  transition:background .45s var(--ease), border-color .45s, transform .45s var(--ease), box-shadow .45s var(--ease); }
.ev-sp-card > span:nth-child(2){ display:flex; flex-direction:column; justify-content:center; min-width:0; }
.ev-sp-card:hover{ transform:translateX(calc(6 * var(--u))); border-color:rgba(211,154,27,.55);
  box-shadow:0 calc(16 * var(--u)) calc(30 * var(--u)) calc(-22 * var(--u)) rgba(19,22,39,.5); }
.ev-sp-card:focus-visible{ outline:2px solid #D39A1B; outline-offset:2px; }
.ev-sp-radio{ width:max(18px, calc(22 * var(--u))); height:max(18px, calc(22 * var(--u))); border-radius:50%;
  border:1.5px solid rgba(19,22,39,.35); display:grid; place-items:center; transition:border-color .3s; }
.ev-sp-radio::after{ content:""; width:50%; height:50%; border-radius:50%; background:#FEDF27; transform:scale(0);
  transition:transform .45s cubic-bezier(.3,1.6,.4,1); }
.ev-sp-title{ display:flex; align-items:center; flex-wrap:wrap; gap:calc(10 * var(--u)); font-family:var(--sans); font-weight:600;
  font-size:max(15px, calc(18 * var(--u))); line-height:1.2; }
.ev-sp-desc{ display:block; margin-top:calc(6 * var(--u)); font-family:var(--sans); font-weight:400;
  font-size:max(12.5px, calc(13.5 * var(--u))); line-height:1.5; color:#6E7180; transition:color .3s; }
.ev-sp-price{ justify-self:end; text-align:right; white-space:nowrap; font-family:'Onest',system-ui,sans-serif; font-weight:600;
  font-size:max(22px, calc(30 * var(--u))); line-height:1; letter-spacing:-.01em; color:#131627; transition:color .3s; }
.ev-sp-badge{ font-style:normal; font-family:var(--sans); font-size:max(9px, calc(10 * var(--u))); font-weight:700; letter-spacing:.18em;
  text-transform:uppercase; line-height:1; padding:calc(5 * var(--u)) calc(10 * var(--u)); border-radius:999px;
  background:rgba(211,154,27,.14); color:#B98515; }
.ev-sp-card.is-on{ background:#131627; border-color:#131627; color:#fff; }
.ev-sp-card.is-on .ev-sp-radio{ border-color:#FEDF27; }
.ev-sp-card.is-on .ev-sp-radio::after{ transform:scale(1); }
.ev-sp-card.is-on .ev-sp-desc{ color:rgba(255,255,255,.62); }
.ev-sp-card.is-on .ev-sp-price{ color:#FEDF27; }
.ev-sp-card.is-on .ev-sp-badge{ background:rgba(254,223,39,.16); color:#FEDF27; }

/* form */
.ev-sp-grid > .ev-rv{ display:flex; }
.ev-sp-form{ position:relative; overflow:hidden; width:100%; box-sizing:border-box; border-radius:calc(16 * var(--u));
  background:#131627; color:#fff; padding:calc(38 * var(--u)) calc(38 * var(--u)) calc(32 * var(--u));
  box-shadow:0 calc(40 * var(--u)) calc(80 * var(--u)) calc(-40 * var(--u)) rgba(16,18,31,.7); }
.ev-sp-form::before{ content:""; position:absolute; width:340px; height:340px; right:-140px; top:-160px; border-radius:50%;
  background:radial-gradient(circle, rgba(254,223,39,.18), transparent 65%); pointer-events:none; animation:evGlow 9s ease-in-out infinite; }
.ev-sp-form > *{ position:relative; }
.ev-sp-form h3{ margin:0; font-family:'Onest',system-ui,sans-serif; font-weight:600; font-size:max(24px, calc(32 * var(--u))); line-height:1.1; letter-spacing:-.01em; }
.ev-sp-form > p{ margin:calc(12 * var(--u)) 0 calc(10 * var(--u)); font-family:var(--sans); font-size:max(12.5px, calc(13.5 * var(--u)));
  line-height:1.5; color:rgba(255,255,255,.62); }
.ev-sp-label{ display:block; font-family:var(--sans); font-size:max(10px, calc(11 * var(--u))); letter-spacing:.18em; font-weight:600;
  text-transform:uppercase; color:rgba(255,255,255,.55); margin:calc(18 * var(--u)) 0 calc(8 * var(--u)); }
.ev-sp-input{ width:100%; box-sizing:border-box; font-family:var(--sans); font-size:max(14px, calc(15 * var(--u))); color:#fff;
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14); border-radius:calc(10 * var(--u));
  height:max(44px, calc(48 * var(--u))); padding:0 calc(16 * var(--u)); outline:none;
  transition:border-color .3s, background .3s, box-shadow .3s; }
.ev-sp-input::placeholder{ color:rgba(255,255,255,.32); }
.ev-sp-input:focus{ border-color:#FEDF27; background:rgba(255,255,255,.08); box-shadow:0 0 0 4px rgba(254,223,39,.12); }
.ev-sp-select{ appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:40px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FEDF27' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 16px center; }
.ev-sp-select option{ color:#131627; }
.ev-sp-error{ margin:14px 0 0; font-size:12.5px; color:#ff9b8a; }
.ev-sp-submit{ all:unset; box-sizing:border-box; cursor:pointer; margin-top:calc(28 * var(--u)); width:100%; display:flex; justify-content:space-between;
  align-items:center; gap:10px; border-radius:999px; background:#FEDF27; color:#131627; font-family:var(--sans); font-weight:600;
  font-size:max(12px, calc(13 * var(--u))); letter-spacing:.12em; text-transform:uppercase; padding:7px 7px 7px 24px; transition:background .3s, transform .35s var(--ease), box-shadow .35s; }
.ev-sp-submit .ev-pill-ic{ display:grid; place-items:center; border-radius:999px; background:var(--ink); color:#fff;
  width:36px; height:36px; flex:none; transition:transform .4s var(--ease); }
.ev-sp-submit:hover{ background:#ffe85c; transform:translateY(-2px); box-shadow:0 14px 30px -12px rgba(245,197,24,.6); }
.ev-sp-submit:hover .ev-pill-ic{ transform:translateX(3px) rotate(-45deg); }
.ev-sp-submit:disabled{ opacity:.6; pointer-events:none; }
.ev-sp-fine{ margin:14px 0 0; font-family:var(--sans); font-size:max(11px, calc(11.5 * var(--u))); line-height:1.55; color:rgba(255,255,255,.42); text-align:center; }
.ev-sp-overlay{ position:fixed; inset:0; z-index:100; display:grid; place-items:center; padding:20px;
  background:rgba(10,12,24,.6); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); animation:evFade .35s ease forwards; }
@keyframes evFade{ from{ opacity:0 } to{ opacity:1 } }
.ev-sp-pop{ position:relative; width:min(440px,100%); border-radius:20px; background:var(--cream); color:var(--ink);
  text-align:center; padding:44px 32px 34px; box-shadow:0 40px 80px -30px rgba(0,0,0,.6);
  animation:evPop .6s cubic-bezier(.3,1.4,.4,1) forwards; }
@keyframes evPop{ from{ opacity:0; transform:translateY(24px) scale(.9) } to{ opacity:1; transform:none } }
.ev-sp-close{ all:unset; cursor:pointer; position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%;
  display:grid; place-items:center; color:var(--ink); background:rgba(22,26,43,.06); transition:background .3s, transform .3s; }
.ev-sp-close:hover{ background:rgba(22,26,43,.12); transform:rotate(90deg); }
.ev-sp-check{ display:inline-grid; place-items:center; width:64px; height:64px; border-radius:50%; background:var(--navy); color:var(--gold);
  animation:evPop .7s cubic-bezier(.3,1.6,.4,1) .15s both; }
.ev-sp-pop h3{ margin:20px 0 0; font-family:'Onest',system-ui,sans-serif; font-weight:600; font-size:28px; line-height:1.15; }
.ev-sp-pop p{ margin:12px 0 0; font-family:var(--sans); font-size:13.5px; line-height:1.65; color:var(--muted); }
.ev-sp-pop p.next{ margin-top:16px; padding-top:16px; border-top:1px solid var(--line); color:var(--mustard); font-weight:500; font-size:12.5px; }

/* =========================== 8. INVITATION =========================== */
/* Scroll ke saath card chhota + feeka se poora + gehra hota hai (video jaisa), phir text aata hai.
   --p (0 -> 1) JS se set hota hai. */
.iv{ --u:calc(var(--cw) / 1320); --p:0; background:#F2EEE5; padding:calc(10 * var(--u)) 0 calc(40 * var(--u)); }
.iv-card{ width:var(--cw); margin:0 auto; }
.iv-card{ position:relative; isolation:isolate; overflow:hidden; color:#fff; min-height:calc(560 * var(--u));
  border-radius:calc(22 * var(--u) + (1 - var(--p)) * 10px); display:flex;
  transform:translateY(calc((1 - var(--p)) * 60px)) scale(calc(.88 + var(--p) * .12)); transform-origin:50% 100%;
  box-shadow:0 calc(40 * var(--u)) calc(90 * var(--u)) calc(-40 * var(--u)) rgba(14,15,20,calc(var(--p) * .55)); will-change:transform; }
.iv-bg{ position:absolute; inset:-6% 0; width:100%; height:112%; object-fit:cover; z-index:-3;
  transform:scale(calc(1.3 - var(--p) * .22)); filter:saturate(calc(.4 + var(--p) * .55)); will-change:transform; }
.iv-shade{ position:absolute; inset:0; z-index:-2; pointer-events:none;
  background:
    linear-gradient(90deg, rgba(12,13,20,.9) 0%, rgba(12,13,20,.7) 40%, rgba(12,13,20,.38) 72%, rgba(12,13,20,.6) 100%),
    linear-gradient(0deg, rgba(12,13,20,.72) 0%, transparent 55%); }
.iv-wash{ position:absolute; inset:0; z-index:-1; background:#E9E6E0; opacity:calc((1 - var(--p)) * .85); pointer-events:none; }
.iv-glow{ position:absolute; z-index:-1; width:calc(620 * var(--u)); height:calc(620 * var(--u)); right:calc(-140 * var(--u)); top:calc(-260 * var(--u));
  border-radius:50%; background:radial-gradient(circle, rgba(254,223,39,.2), transparent 65%); pointer-events:none;
  animation:ivGlow 9s ease-in-out infinite; }
@keyframes ivGlow{ 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(calc(-80 * var(--u)), calc(80 * var(--u))) } }

.iv-in{ width:100%; display:flex; justify-content:space-between; align-items:flex-end; gap:calc(40 * var(--u));
  padding:calc(64 * var(--u)) calc(64 * var(--u)) calc(60 * var(--u)); }
.iv-ey{ display:block; font-family:var(--sans); font-weight:600; font-size:max(10px, calc(11.5 * var(--u))); line-height:1;
  letter-spacing:.3em; color:rgba(255,255,255,.72); text-transform:uppercase; }
.iv-h{ margin:calc(26 * var(--u)) 0 0; font-family:'Instrument Serif',Georgia,serif; font-weight:400; line-height:.95;
  font-size:max(48px, calc(104 * var(--u))); letter-spacing:-.01em; color:#fff; white-space:nowrap; }
.iv-when{ display:flex; flex-wrap:wrap; align-items:center; column-gap:.65em; row-gap:4px; margin:calc(28 * var(--u)) 0 0;
  font-family:'Onest',system-ui,sans-serif; font-weight:600; font-size:max(14px, calc(16 * var(--u))); line-height:1.3;
  letter-spacing:.01em; color:#fff; }
.iv-when .sep{ display:inline-block; width:5px; height:5px; border-radius:50%; background:#FFFFFF; flex:none; }
.iv-when .t{ color:#FFFFFF; }
.iv-where{ margin:calc(10 * var(--u)) 0 0; font-family:'Onest',system-ui,sans-serif; font-weight:600; font-size:max(14px, calc(16 * var(--u)));
  line-height:1.3; letter-spacing:.01em; color:#FFFFFF; }
.iv-chips{ display:flex; flex-wrap:wrap; gap:calc(10 * var(--u)); margin-top:calc(24 * var(--u)); }
.iv-chips span{ font-family:var(--sans); font-size:max(11px, calc(12.5 * var(--u))); line-height:1; color:rgba(255,255,255,.92);
  border:1px solid rgba(255,255,255,.45); border-radius:999px; padding:calc(8 * var(--u)) calc(14 * var(--u));
  transition:background .3s, border-color .3s, color .3s; }
.iv-chips span:hover{ background:rgba(254,223,39,.12); border-color:#FEDF27; color:#FEDF27; }
.iv-btn{ display:inline-flex; align-items:center; gap:calc(16 * var(--u)); margin-top:calc(36 * var(--u)); text-decoration:none;
  background:#fff; color:#131627; border-radius:999px; padding:calc(7 * var(--u)) calc(7 * var(--u)) calc(7 * var(--u)) calc(26 * var(--u));
  font-family:var(--sans); font-weight:700; font-size:max(11.5px, calc(13 * var(--u))); letter-spacing:.12em; line-height:1;
  position:relative; overflow:hidden; transition:transform .35s var(--ease), box-shadow .35s var(--ease); }
.iv-btn::before{ content:""; position:absolute; inset:0; background:#FEDF27; border-radius:inherit; transform:translateX(-101%);
  transition:transform .5s var(--ease); }
.iv-btn > *{ position:relative; }
.iv-btn i{ display:grid; place-items:center; width:max(32px, calc(38 * var(--u))); height:max(32px, calc(38 * var(--u)));
  border-radius:50%; background:#131627; color:#fff; transition:transform .45s var(--ease); }
.iv.is-in .iv-btn:hover{ transform:translateY(-2px); box-shadow:0 16px 36px -12px rgba(254,223,39,.55); }
.iv-btn:hover::before{ transform:none; }
.iv-btn:hover i{ transform:rotate(45deg); }
.iv-btn::after{ content:""; position:absolute; inset:-1px; border-radius:inherit; pointer-events:none; animation:ivRing 2.8s ease-out 2s infinite; }
@keyframes ivRing{ 0%{ box-shadow:0 0 0 0 rgba(255,255,255,.45) } 70%,100%{ box-shadow:0 0 0 14px rgba(255,255,255,0) } }
.iv-q{ margin:0; text-align:right; font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:max(20px, calc(32 * var(--u)));
  line-height:1.12; color:rgba(255,255,255,.94); }

/* text reveal jab card khul jaye */
.iv .an{ opacity:0; transform:translateY(calc(22 * var(--u))); filter:blur(8px);
  transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease); transition-delay:var(--d,0s); }
.iv.is-in .an{ opacity:1; transform:none; filter:none; }
.iv .w{ display:inline-block; opacity:0; filter:blur(14px); transform:translateY(.25em) scale(1.06);
  transition:opacity 1.1s var(--ease), filter 1.1s var(--ease), transform 1.1s var(--ease); transition-delay:var(--d,0s); }
.iv.is-in .w{ opacity:1; filter:none; transform:none; }
.iv-ey.an{ letter-spacing:.6em; transition-property:opacity, transform, filter, letter-spacing; }
.iv.is-in .iv-ey.an{ letter-spacing:.3em; }

@media (max-width:1023px){
  .iv{ --u:.8px; padding:8px 32px 32px; }
  .iv-card{ width:auto; }
  .iv-in{ flex-direction:column; align-items:flex-start; padding:56px 40px 44px; }
  .iv-q{ text-align:left; }
}
@media (max-width:640px){
  .iv{ padding:6px 20px 24px; }
  .iv-card{ min-height:0; }
  .iv-in{ padding:44px 24px 34px; gap:28px; }
  .iv-h{ font-size:clamp(46px, 14vw, 60px); white-space:normal; }
  .iv-btn{ margin-top:28px; }
}

/* =========================== RESPONSIVE =========================== */
@media (max-width:1023px){
  .ev-sponsor{ --u:.8px; padding:88px 0; }
  .ev-sponsor .ev-wrap{ width:auto; padding:0 32px; max-width:760px; }
  .ev-sp-grid{ grid-template-columns:1fr; }
  .ev-sp-list{ grid-template-rows:none; grid-auto-rows:1fr; }
  .ev-sp-head{ flex-direction:column; align-items:flex-start; gap:18px; }
}
@media (max-width:767px){
  .ev-sponsor{ padding:72px 0; }
  .ev-sponsor .ev-wrap{ padding:0 20px; }
  .ev-sp-h .b{ font-size:clamp(28px, 8.6vw, 38px); }
  .ev-sp-h .a{ font-size:clamp(38px, 11vw, 48px); }
  .ev-sp-list{ grid-auto-rows:auto; }
  .ev-sp-card{ grid-template-columns:20px minmax(0,1fr) auto; column-gap:14px; padding:16px; align-items:start; }
  .ev-sp-radio{ margin-top:1px; }
  .ev-sp-price{ font-size:20px; }
  .ev-sp-card:hover{ transform:none; }
  .ev-sp-form{ padding:28px 20px 24px; }
}

/* chhoti screen: multi-line headings me thodi zyada line spacing, taaki lines aapas me na takrayein */
@media (max-width:767px){
  .pp-h{ line-height:.98; }
  .eh-h .b{ margin-top:6px; }
  .rs-h{ line-height:1.12; }
  .rr-h .b{ line-height:1.12; }
  .iv-h{ line-height:1.04; }
  .ev-sp-h .b{ line-height:1.1; }
  .rm-h .b{ line-height:1.1; }
}

@media (prefers-reduced-motion:reduce){
  .ev *,.ev *::before,.ev *::after{ animation:none !important; transition:none !important; }
  .ev-rv,.ev-words .ev-w,.ev-hero .ev-in,.ev-hero .ev-drop,.ev-hero .ev-w,.ev-hero-img,.ev-facts .ev-fact{ opacity:1 !important; transform:none !important; filter:none !important; }
  .ev-room .rm-a,.rm-h .w,.rm-h .c,.rm-pill,.rm-avs img{ opacity:1 !important; transform:none !important; filter:none !important; }
  .rm-line,.rm-sep,.rm-dots span::before{ transform:none !important; }
  .rm-img{ clip-path:none !important; opacity:1 !important; filter:none !important; }
  .pp-ph{ clip-path:none !important; transform:none !important; }
  .pp .rm-a,.pp-h .w,.pp-face figcaption{ opacity:1 !important; transform:none !important; filter:none !important; }
  .ev-hero-sheen,.ev-eyebrow-box::after{ display:none; }
  .rr .an,.rr .w,.rr-lines li,.rs .w,.rs .an,.rs-n{ opacity:1 !important; transform:none !important; filter:none !important; translate:none !important; }
  .rr-foot i,.rs-line,.rs-div,.rr-lines li .rr-star{ transform:none !important; }
  .rr-ph{ clip-path:none !important; opacity:1 !important; }
  .rs-ic{ scale:1 !important; opacity:1 !important; }
  .eh .an,.eh .w,.eh-track,.eh .ec.s0{ opacity:1 !important; transform:none !important; filter:none !important; }
  .eh:not(.is-in) .ec.s-1,.eh:not(.is-in) .ec.s1{ opacity:1 !important; }
  .eh:not(.is-in) .ec.s-1{ left:0; } .eh:not(.is-in) .ec.s1{ left:calc(980 * var(--u)); }
  .ec.s-1,.ec.s1{ transform:none !important; }
  .iv{ --p:1 !important; }
  .iv .an,.iv .w{ opacity:1 !important; transform:none !important; filter:none !important; }
  .rr.is-in .rr-eye.an{ letter-spacing:.27em; }
}
`;

/* =========================== 1. HERO =========================== */
function Hero() {
  const [ref, on] = useInView<HTMLElement>(0.35);
  // hero se bahar jaa ke wapas aaye to poori entry animation dobara chale
  const [run, setRun] = useState(0);
  const wasOut = useRef(false);
  useEffect(() => {
    if (!on) wasOut.current = true;
    else if (wasOut.current) {
      wasOut.current = false;
      setRun((r) => r + 1);
    }
  }, [on]);
  const t = (d: number): CSSProperties => ({ animationDelay: `${d}s` });
  const word = (w: string, d: number, gold = false) => (
    <span className={`ev-w ${gold ? "ev-gold" : ""}`} style={t(d)}>{w}</span>
  );

  // mouse ke saath image halki si khiskti hai (sirf desktop / mouse wale devices)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", `${(-x * 18).toFixed(1)}px`);
      el.style.setProperty("--my", `${(-y * 12).toFixed(1)}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className="ev-hero" aria-label="BrickShare Capital launch evening">
      <div key={`m${run}`} className="ev-hero-media" aria-hidden>
        <img className="ev-hero-img" src={IMG.hero} alt="" decoding="async" />
      </div>
      <span key={`s${run}`} className="ev-hero-sheen" aria-hidden />

      <div key={`c${run}`} className="ev-wrap ev-hero-in">
        <p className="ev-eyebrow-box ev-drop" style={t(0.45)}>
          <span>BrickShare Capital presents</span>
          <span>·{EVENT.date}</span>
        </p>
        <h1 className="ev-hero-h">
          <span className="ev-line">{word("Something", 0.8, true)} {word("new", 0.95)}</span>
          <span className="ev-line">{word("is", 1.08)} {word("taking", 1.16)} {word("shape.", 1.3, true)}</span>
        </h1>
        <div className="ev-facts ev-in" style={t(1.55)}>
          <div className="ev-fact" style={t(1.7)}><small>WHEN</small><b>{EVENT.date}, {EVENT.day}</b></div>
          <div className="ev-fact" style={t(1.8)}><small>WHERE</small><b>{EVENT.venue}</b></div>
          <div className="ev-fact" style={t(1.9)}><small>GUEST LIST</small><b>{EVENT.guestList}</b></div>
        </div>
      </div>

      <div key={`f${run}`} className="ev-wrap ev-hero-foot">
        <span className="l ev-in" style={t(2.05)}>Own real estate. Grow your wealth.</span>
        <span className="ev-in" style={t(1.95)}>
          <a className="ev-pill ev-btn-cream" href={EVENT.rsvpLink} target="_blank" rel="noopener noreferrer">
            Reserve Your Place
            <span className="ev-pill-ic"><ArrowRight size={16} /></span>
          </a>
        </span>
        <span className="r ev-in" style={t(2.05)}>{EVENT.place} · {EVENT.shortAddress}</span>
      </div>
    </section>
  );
}

/* ====================== 2. A ROOM FULL OF POSSIBILITIES ===================== */
const dl = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Room() {
  const [headRef, headIn] = useInView<HTMLDivElement>(0.35);
  const [gridRef, gridIn] = useInView<HTMLDivElement>(0.2);
  const imgRef = useParallax<HTMLDivElement>(0.05);
  const word = "Possibilities";

  return (
    <section className="ev-room" id="about-evening">
      {/* ---- heading row ---- */}
      <div ref={headRef} className={`rm-head ${headIn ? "is-in" : ""}`}>
        <div className="rm-side l">
          <span className="rm-line" style={dl(0.1)} aria-hidden />
          <span className="rm-pill" style={dl(0.95)}>Houston</span>
        </div>
        <h2 className="rm-h">
          <span className="a">
            {["A", "Room", "Full", "Of"].map((w, i) => (
              <span key={w} className="w" style={dl(0.05 + i * 0.13)}>
                {w}
                {i < 3 ? "\u00A0" : ""}
              </span>
            ))}
          </span>
          <span className="b" aria-label={word}>
            {word.split("").map((c, i) => (
              <span key={i} className="c" aria-hidden style={dl(0.55 + i * 0.035)}>{c}</span>
            ))}
          </span>
        </h2>
        <div className="rm-side r">
          <span className="rm-pill" style={dl(1.05)}>Limited</span>
          <span className="rm-line" style={dl(0.1)} aria-hidden />
        </div>
        <div className="rm-tags">
          <span className="rm-pill" style={dl(0.9)}>Houston</span>
          <span className="rm-pill" style={dl(1)}>Limited</span>
        </div>
      </div>

      {/* ---- 3 columns ---- */}
      <div ref={gridRef} className={`rm-grid ${gridIn ? "is-in" : ""}`}>
        <div className="rm-lt">
          <h3 className="rm-a" style={dl(0.25)}>More than an event</h3>
          <p className="rm-a" style={dl(0.37)}>
            Some of the best opportunities don't begin in a boardroom. They begin with a conversation, a shared idea,
            or the right person across the room.
          </p>
          <a href={EVENT.rsvpLink} target="_blank" rel="noopener noreferrer" className="rm-btn rm-a" style={dl(0.5)}><span>About the evening</span></a>
        </div>

        <div className="rm-lb">
          <p className="rm-label rm-a" style={dl(0.75)}>Who's in the room:</p>
          <div className="rm-dots">
            {["Investors", "Entrepreneurs", "Real estate pros"].map((t, i) => (
              <span key={t} className="rm-a" style={dl(0.85 + i * 0.12)}>{t}</span>
            ))}
          </div>
        </div>

        <div ref={imgRef} className="rm-img">
          <img src={IMG.room} alt="Guests networking at a BrickShare evening" loading="lazy" decoding="async" />
        </div>

        <div className="rm-rt">
          {ROOM_POINTS.map((p, i) => (
            <div key={p.title}>
              {i > 0 && <div className="rm-sep" style={dl(0.45 + i * 0.16)} aria-hidden />}
              <div className="rm-pt rm-a" style={dl(0.35 + i * 0.16)}>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rm-rb">
          <p className="rm-label rm-a" style={dl(0.85)}>Your hosts:</p>
          <div className="rm-hosts">
            <div className="rm-avs">
              {PEOPLE.map((p, i) => (
                <img key={p.name} src={p.photo} alt={p.name} title={p.name} loading="lazy"
                  style={{ objectPosition: p.pos, ...dl(0.95 + i * 0.1), ["--i" as string]: i } as CSSProperties} />
              ))}
            </div>
            <div className="rm-a" style={dl(1.35)}>
              <b>4 hosts</b>
              <small>One vision</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================== 3. MEET THE PEOPLE ============================== */
function People() {
  const [ref, on] = useInView<HTMLElement>(0.25);
  return (
    <section ref={ref} className={`pp ${on ? "is-in" : ""}`} id="people">
      <div className="pp-wrap">
        <div className="pp-faces">
          {PEOPLE.map((p, i) => (
            <figure key={p.name} className="pp-face" style={dl(0.1 + i * 0.13)}>
              <div className="pp-ph">
                <img src={p.photo} alt={p.name} loading="lazy" decoding="async" style={{ objectPosition: p.pos }} />
              </div>
              <figcaption>{p.name}</figcaption>
            </figure>
          ))}
        </div>

        <div className="pp-copy">
          <h2 className="pp-h">
            <span>
              {["Meet", "the", "people"].map((w, i) => (
                <span key={w} className="w" style={dl(0.35 + i * 0.1)}>{w}{i < 2 ? "\u00A0" : ""}</span>
              ))}
            </span>
            <span className="g">
              {["behind", "it."].map((w, i) => (
                <span key={w} className="w" style={dl(0.7 + i * 0.1)}>{w}{i < 1 ? "\u00A0" : ""}</span>
              ))}
            </span>
          </h2>
          <p className="pp-p rm-a" style={dl(0.9)}>
            Four minds, one vision. Meet the people shaping BrickShare Capital and hear the story behind what we are
            building.
          </p>
          <a href={EVENT.rsvpLink} target="_blank" rel="noopener noreferrer" className="pp-btn rm-a" style={dl(1.05)}><span>Meet them</span></a>
        </div>
      </div>
    </section>
  );
}

/* ====================== 4. THE RIGHT ROOM ================================== */
const Star = () => (
  <svg className="rr-star" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="currentColor" />
  </svg>
);

function FloatPhoto({ cls, src, speed, d }: { cls: string; src: string; speed: number; d: number }) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <div ref={ref} className={`rr-ph ${cls}`} style={dl(d)} aria-hidden>
      <div className="rr-ph-in"><img src={src} alt="" loading="lazy" decoding="async" /></div>
    </div>
  );
}

const splitWords = (text: string, start: number, step: number) =>
  text.split(" ").map((w, i, arr) => (
    <span key={i} className="w" style={dl(start + i * step)}>
      {w}
      {i < arr.length - 1 ? "\u00A0" : ""}
    </span>
  ));

function RightRoom() {
  const [ref, on] = useInView<HTMLElement>(0.25);
  const lines = ["One Introduction.", "One Conversation.", "One Idea."];
  return (
    <section ref={ref} className={`rr ${on ? "is-in" : ""}`} id="right-room">
      <FloatPhoto cls="p1" src={IMG.right[0]} speed={0.1} d={0.2} />
      <FloatPhoto cls="p2" src={IMG.right[1]} speed={-0.06} d={0.35} />
      <FloatPhoto cls="p3" src={IMG.right[2]} speed={0.08} d={0.5} />
      <FloatPhoto cls="p4" src={IMG.right[3]} speed={-0.1} d={0.65} />

      <div className="rr-in">
        <p className="rr-eye an" style={dl(0)}>The right room</p>
        <h2 className="rr-h">
          <span className="a">{splitWords("The right room", 0.15, 0.1)}</span>
          <span className="b">{splitWords("Can change everything.", 0.45, 0.1)}</span>
        </h2>

        <ul className="rr-lines">
          {lines.map((l, i) => (
            <li key={l} style={dl(0.85 + i * 0.25)}>
              <Star />
              <span>{l}</span>
            </li>
          ))}
        </ul>

        <div className="rr-tiles" aria-hidden>
          {IMG.right.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
        </div>

        <div className="rr-foot">
          <i style={dl(1.5)} />
          <p className="an" style={dl(1.65)}>You never know what comes next.</p>
        </div>
      </div>
    </section>
  );
}

/* ====================== 5. FOUR REASONS ==================================== */
function Reasons() {
  const [ref, on] = useInView<HTMLElement>(0.25);
  return (
    <section ref={ref} className={`rs ${on ? "is-in" : ""}`} id="why-attend">
      <h2 className="rs-h">
        <span className="a grp">{splitWords("Four reasons to", 0, 0.1)}{"\u00A0"}</span>
        <span className="b grp">{splitWords("be in the room.", 0.3, 0.09)}</span>
      </h2>
      <span className="rs-line" style={dl(0.6)} aria-hidden />
      <p className="rs-sub an" style={dl(0.75)}>Why Attend</p>

      <div className="rs-grid">
        {REASONS.map((r, i) => (
          <article key={r.title} className="rs-card an" style={dl(0.85 + i * 0.14)}>
            <div className="rs-top">
              <span className="rs-ic"><Icon size={32} sw={1.5}>{r.icon}</Icon></span>
              <span className="rs-n">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="rs-div" />
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ====================== 6. THE EVENING (carousel) ========================== */
// Carousel me sirf ye 3 cards ghoomte hain (MOMENTS ke index). Strip me poora schedule dikhta hai.
const EVENING_CARDS = [2, 4, 5];
const AUTOPLAY_MS = 4500;

function Evening() {
  const [ref, on] = useInView<HTMLElement>(0.2);
  const n = EVENING_CARDS.length;
  const [active, setActive] = useState(1); // "The launch moment" beech me
  const [dir, setDir] = useState<1 | -1>(1);
  const [spins, setSpins] = useState<number[]>(() => EVENING_CARDS.map(() => 0)); // wrap hone par card dobara mount
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const startX = useRef<number | null>(null);

  const slotOf = (i: number, a = active) => {
    const o = (((i - a) % n) + n) % n; // 0,1,2
    return o === 0 ? 0 : o === 1 ? 1 : -1;
  };

  // Section pe aate hi side cards bahar se beech wale card ke paas aate hain (CSS: .eh:not(.is-in)),
  // uske baad cards pehle jaise loop me ghoomte rehte hain.
  // section pe aate hi thodi der "fresh": side cards beech wale ke baad aate hain
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    if (!on) return;
    setFresh(true);
    const t = window.setTimeout(() => setFresh(false), 1500);
    return () => window.clearTimeout(t);
  }, [on]);

  const rotate = (target: number) => {
    const d: 1 | -1 = slotOf(target, active) === 1 ? 1 : -1; // right wala aage aaye to "next"
    // jo card ek side se dusri side jaata hai use naya key do (beech ke peeche se nikal ke aaye)
    setSpins((prev) =>
      prev.map((c, i) => {
        const from = slotOf(i, active);
        const to = slotOf(i, target);
        return from !== 0 && to !== 0 && from !== to ? c + 1 : c;
      }),
    );
    setDir(d);
    setActive(target);
    setTick((t) => t + 1);
  };

  const go = (to: number) => {
    const target = ((to % n) + n) % n;
    if (target === active) return;
    rotate(target); // seedha ghoomna (gather sirf section pe aate waqt hota hai)
  };
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  // autoplay: section screen pe aate hi har AUTOPLAY_MS me agla card (hamesha chalta hai)
  useEffect(() => {
    if (!on || paused) return;
    const t = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, paused, active, tick]);

  // browser tab chhupa ho to ruk jaye, wapas aaye to phir chale
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const activeStrip = EVENING_CARDS[active];

  return (
    <section ref={ref} className={`eh ${on ? "is-in" : ""} ${fresh ? "fresh" : ""}`} id="evening">
      <div className="eh-box">
        <div className="eh-head">
          <h2 className="eh-h">
            <span className="a">{splitWords("The evening,", 0, 0.1)}</span>
            <span className="b">{splitWords("hour by hour.", 0.25, 0.1)}</span>
          </h2>
          <p className="eh-p an" style={dl(0.35)}>
            {EVENT.day}, {EVENT.date}. Six to nine at {EVENT.venue}. Six moments, one room, and conversations worth
            staying for.
          </p>
        </div>

        <div className="eh-strip an" style={dl(0.45)}>
          {MOMENTS.map((m, i) => {
            const card = EVENING_CARDS.indexOf(i);
            const label = (
              <>
                <span>{m.time.replace(" PM", "")}{i === 0 ? " PM" : ""}</span>
                <span>{m.short}</span>
              </>
            );
            return (
              <span key={m.short} style={{ display: "contents" }}>
                {i > 0 && <span className="dot" aria-hidden>·</span>}
                {card >= 0 ? (
                  <button type="button" className={`it ${i === activeStrip ? "on" : ""}`}
                    onClick={() => go(card)}>
                    {label}
                  </button>
                ) : (
                  <span className="it">{label}</span>
                )}
              </span>
            );
          })}
        </div>

        <div
          className="eh-track"
          role="region"
          aria-roledescription="carousel"
          aria-label="Evening schedule"
          tabIndex={0}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current == null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
            startX.current = null;
          }}
        >
          {EVENING_CARDS.map((mi, i) => {
            const m = MOMENTS[mi];
            const slot = slotOf(i);
            const entering = spins[i] > 0 && slot !== 0 && slot === (dir === 1 ? 1 : -1);
            const cls = `ec s${slot} ${entering ? (dir === 1 ? "in-r" : "in-l") : ""}`;
            return (
              <article
                key={`${mi}-${spins[i]}`}
                className={cls}
                aria-hidden={slot !== 0}
                onClick={() => slot !== 0 && (slot === 1 ? next() : prev())}
              >
                <div className="ec-im">
                  <img src={m.image} alt={m.title} loading="lazy" decoding="async" />
                  <span className="ec-wash" aria-hidden />
                  {slot === 0 ? (
                    m.highlight && <span className="ec-bdg l"><Check /> Highlight of the night</span>
                  ) : (
                    <span className="ec-bdg l">Up next</span>
                  )}
                  <span className="ec-bdg r">{m.tag}</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </article>
            );
          })}
        </div>

        <div className="eh-nav">
          <button type="button" className="eh-arr" aria-label="Previous" onClick={prev}><ArrowLeft /></button>
          <div className={`eh-dots ${on && !paused ? "play" : ""}`} style={{ ["--dur" as string]: `${AUTOPLAY_MS}ms` } as CSSProperties}>
            {EVENING_CARDS.map((mi, i) => (
              <button key={`${mi}-${i === active ? tick : "x"}`} type="button" aria-label={MOMENTS[mi].title}
                className={i === active ? "on" : ""} onClick={() => go(i)} />
            ))}
          </div>
          <button type="button" className="eh-arr dk" aria-label="Next" onClick={next}><ArrowRight /></button>
        </div>
      </div>
    </section>
  );
}

/* ====================== 7. SPONSORSHIP ===================================== */
function Sponsor() {
  const [ref, on] = useInView<HTMLHeadingElement>(0.4);
  const [plan, setPlan] = useState<string>("gold");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ first: string; label: string; price: string } | null>(null);

  // popup khulne par: Esc se band, background scroll lock
  useEffect(() => {
    if (!done) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setDone(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [done]);

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email.");
    setBusy(true);
    try {
      const res = await api.submitSponsor({ name: name.trim(), phone: phone.trim(), email: email.trim(), plan });
      const p = SPONSOR_PLANS.find((x) => x.key === plan)!;
      setDone({ first: name.trim().split(" ")[0], label: res.planLabel, price: p.price });
      setName("");
      setPhone("");
      setEmail("");
    } catch (err: any) {
      const msg = String(err?.message || "");
      // internet / server band ho to "Failed to fetch" jaisa technical message na dikhe
      setError(
        !msg || /failed to fetch|networkerror|load failed|network request failed/i.test(msg)
          ? "We couldn't reach the server. Please check your connection and try again."
          : msg,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ev-cream ev-sponsor" id="sponsor">
      <div className="ev-wrap">
        <div className="ev-sp-head">
          <div>
            <Reveal className="ev-eyebrow">Sponsorship</Reveal>
            <h2 ref={ref} className="ev-sp-h">
              <Words className="a" text="Put your brand" on={on} d={0.1} />
              <Words className="b" text="in the room." on={on} d={0.35} step={0.09} />
            </h2>
          </div>
          <Reveal d={0.3}>
            <p className="ev-sp-lead">
              Support the BrickShare Capital Business Launch &amp; Grand Opening and be recognized in front of
              Houston's business owners, investors and professionals.
            </p>
            <p className="ev-sp-hand">Choose a level, we handle the rest.</p>
          </Reveal>
        </div>

        <div className="ev-sp-grid">
          <div role="radiogroup" aria-label="Sponsor type" className="ev-sp-list">
            {SPONSOR_PLANS.map((p, i) => (
              <Reveal key={p.key} d={0.08 + i * 0.08}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={plan === p.key}
                  onClick={() => setPlan(p.key)}
                  className={`ev-sp-card ${plan === p.key ? "is-on" : ""}`}
                >
                  <span className="ev-sp-radio" aria-hidden />
                  <span>
                    <span className="ev-sp-title">
                      {p.label}
                      {p.limited && <em className="ev-sp-badge">Limited</em>}
                    </span>
                    <span className="ev-sp-desc">{p.desc}</span>
                  </span>
                  <span className="ev-sp-price">{p.price}</span>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal d={0.2}>
            <form className="ev-sp-form" onSubmit={submit} noValidate>
              <h3>Register as a sponsor</h3>
              <p>
                Reserve your sponsorship level. Our events team will follow up with payment options and invoice
                details.
              </p>

              <label className="ev-sp-label" htmlFor="sp-name">Full name</label>
              <input id="sp-name" className="ev-sp-input" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Avery" autoComplete="name" maxLength={120} />

              <label className="ev-sp-label" htmlFor="sp-phone">Phone number</label>
              <input id="sp-phone" className="ev-sp-input" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="(713) 555 0148" autoComplete="tel" inputMode="tel" maxLength={40} />

              <label className="ev-sp-label" htmlFor="sp-email">Email</label>
              <input id="sp-email" className="ev-sp-input" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="jordan@company.com"
                autoComplete="email" maxLength={160} />

              <label className="ev-sp-label" htmlFor="sp-type">Sponsor type</label>
              <select id="sp-type" className="ev-sp-input ev-sp-select" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {SPONSOR_PLANS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}, {p.price}</option>
                ))}
              </select>

              {error && <p className="ev-sp-error" role="alert">{error}</p>}

              <button type="submit" className="ev-sp-submit" disabled={busy}>
                {busy ? "Please wait..." : "Confirm & Register"}
                <span className="ev-pill-ic"><ArrowRight size={15} /></span>
              </button>
              <p className="ev-sp-fine">
                No payment is taken on this form. By registering you agree to be contacted about your sponsorship.
              </p>
            </form>
          </Reveal>
        </div>
      </div>

      {done && (
        <div className="ev-sp-overlay" onClick={() => setDone(null)}>
          <div role="dialog" aria-modal="true" className="ev-sp-pop" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ev-sp-close" aria-label="Close" onClick={() => setDone(null)}>
              <Icon size={16} sw={2}><path d="M18 6 6 18M6 6l12 12" /></Icon>
            </button>
            <span className="ev-sp-check"><Icon size={30} sw={3}><path d="M20 6 9 17l-5-5" /></Icon></span>
            <h3>Thank you, {done.first}.</h3>
            <p>
              Your {done.label} ({done.price}) registration is received. Our events team will contact you with
              payment options and invoice details.
            </p>
            <p className="next">Next: send your logo and materials once your sponsorship is confirmed.</p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ====================== 8. THE INVITATION ================================== */
function Invitation() {
  const secRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  // scroll progress: card neeche se aate hue 0 -> 1 (chhota/feeka -> poora/gehra)
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      setOn(true);
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // card ka top viewport ke neeche (vh) se 35% tak aaye => 0..1
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.65)));
      el.style.setProperty("--p", p.toFixed(3));
      if (p > 0.72) setOn(true);
      else if (p < 0.2) setOn(false); // neeche chala gaya, agli baar phir animation
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secRef} className={`iv ${on ? "is-in" : ""}`} id="rsvp">
      <div className="iv-card">
        <img className="iv-bg" src={IMG.invite} alt="" loading="lazy" decoding="async" />
        <span className="iv-shade" aria-hidden />
        <span className="iv-wash" aria-hidden />
        <span className="iv-glow" aria-hidden />

        <div className="iv-in">
          <div>
            <span className="iv-ey an" style={dl(0)}>The invitation</span>
            <h2 className="iv-h">{splitWords("Be in the room.", 0.1, 0.12)}</h2>
            <p className="iv-when an" style={dl(0.55)}>
              <span>{EVENT.date}, {EVENT.day}</span>
              <span className="sep" aria-hidden />
              <span className="t">{EVENT.time}</span>
            </p>
            <p className="iv-where an" style={dl(0.65)}>
              {EVENT.venue} · {EVENT.place}, {EVENT.address}
            </p>
            <div className="iv-chips">
              {["RSVP required", "Limited guest list", "Food & beverages included"].map((c, i) => (
                <span key={c} className="an" style={dl(0.75 + i * 0.08)}>{c}</span>
              ))}
            </div>
            <a className="iv-btn an" style={dl(1)} href={EVENT.rsvpLink} target="_blank" rel="noopener noreferrer">
              <span>RESERVE YOUR PLACE</span>
              <i><ArrowUpRight size={16} /></i>
            </a>
          </div>
          <p className="iv-q an" style={dl(1.15)}>
            Something new is taking shape.
            <br />
            Will you be there when it does?
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PAGE --------------------------------------- */
export default function Events() {
  useSeo(pageSeo("/events"));
  const rootRef = useRef<HTMLDivElement>(null);
  // scrollbar ke bina asli width, taaki content header/footer ke saath bilkul seedh me rahe
  useEffect(() => {
    const set = () => rootRef.current?.style.setProperty("--vw", `${document.documentElement.clientWidth}px`);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return (
    <div className="ev" ref={rootRef}>
      <style>{css}</style>
      <Hero />
      <Room />
      <People />
      <RightRoom />
      <Reasons />
      <Evening />
      <Sponsor />
      <Invitation />
    </div>
  );
}