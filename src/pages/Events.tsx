import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  transform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { api } from "../lib/api";
import { useSeo, pageSeo } from "../lib/seo";

/* ============================================================================
   EVENTS PAGE  —  BrickShare Launch Evening  (single file)
   ----------------------------------------------------------------------------
   SECTION 1: HERO  (scroll-scrubbed, 4 chapters, ek hi tower image ka drone shot)
   SECTION 2: MARQUEE strip
   SECTION 3: A ROOM FULL OF POSSIBILITIES      (scene)
   SECTION 4: WHY ATTEND                        (scene)
   SECTION 5: THE RIGHT ROOM CAN CHANGE EVERYTHING (scene)
   SECTION 6: THE PEOPLE BEHIND IT              (scene)
   SECTION 7: THE EVENING  (timeline, sticky heading + blur reveal)
   SECTION 8: THE EXPERIENCE                    (scene)
   SECTION 9: THE SETTING                       (scene)
   SECTION 10: THE ROOM  (drag carousel)        (scene)
   SECTION 11: YOU'RE INVITED                   (scene)

   NOTE: Section 3 -> 11 ab pin nahi hote. Section screen me aate hi content
   ek baar blur + rise + fade se aata hai aur phir tika rehta hai.
   ========================================================================== */

/* ------------------------------ DATA --------------------------------------- */
const IMG = {
  arrival: "/images/events/journey-1-arrival.webp",
  room: "/images/events/journey-2-room.webp",
  idea: "/images/events/journey-3-idea.webp",
  invitation: "/images/events/journey-4-invitation.webp",
  badge: "/images/events/rotating-badge.webp",
  roomArch: "/images/events/room-possibilities.webp",
  // Hero ki single tower image (high-res, 3000px+ wide rakho)
  heroTower: "/images/events/hero-tower.webp",
  // Hero ke end wali finale image. Apni file ka path yahan likho
  // (khaali "" chhodoge to finale layer skip ho jayega).
  skyline: "",

  // ---- NEW SECTIONS ----
  rightRoomMark: "/images/events/right-room-building.webp", // Section 5 — faint building logo (background)
  experience: "/images/events/experience-food.webp", // Section 8 — food image
  setting: "/images/events/setting-gallery-steps.webp", // Section 9 — full background
  roomPeople: "/images/events/ideas-people.webp", // Section 10 — card 1
  roomConversations: "/images/events/ideas-conversations.webp", // Section 10 — card 2
  roomIdeas: "/images/events/ideas-ideas.webp", // Section 10 — card 3
  roomFuture: "/images/events/ideas-future.webp", // Section 10 — card 4
  invite: "/images/events/be-in-the-room.webp", // Section 11 — full background
};

const EVENT = {
  date: "Thursday, December 3, 2026",
  time: "6:00 PM — 9:00 PM",
  venue: "The Cannon West Houston",
  address: "Gallery Steps · 1534 Brittmoore Rd, Suite 1000",
  note: "Limited guest list  ·  Food & beverages included  ·  RSVP required",
  handwritten: "Be there when it begins.",
};

// Hero chapters — har chapter = ek text block (image ab ek hi hai: IMG.heroTower)
const chapters = [
  {
    nav: "Arrival",
    image: IMG.arrival,
    eyebrow: "BrickShare Capital presents",
    lead: "Something new",
    accent: "is taking shape.",
    body: "An evening of real estate, entrepreneurship, and conversations that could lead somewhere — in the heart of Houston.",
  },
  {
    nav: "The Room",
    image: IMG.room,
    eyebrow: "More than an event",
    lead: "A room full of",
    accent: "possibilities.",
    body: "The best opportunities don't begin in a boardroom. They begin with a conversation, a shared idea, or the right person across the room.",
  },
  {
    nav: "The Idea",
    image: IMG.idea,
    eyebrow: "One introduction. One conversation. One idea.",
    lead: "The right room",
    accent: "can change everything.",
    body: "You never know what comes next. That is exactly why you should be there when it does.",
  },
  {
    nav: "Invitation",
    image: IMG.invitation,
    eyebrow: "The Cannon West Houston · Gallery Steps",
    lead: "Be there",
    accent: "before the story begins.",
    body: "Limited guest list. Food and beverages included. RSVP required.",
  },
];

/* ---- Section 4: Why attend ---- */
const REASONS = [
  { n: "I", title: "Inside BrickShare", text: "Get an inside look at what we're building — and where we're going next." },
  { n: "II", title: "Meet the people", text: "Connect with founders, investors, operators, and professionals building Houston's future." },
  { n: "III", title: "Ideas that move markets", text: "Hear perspectives, ideas, and opportunities beyond the usual pitch. Real estate. Real talk." },
  { n: "IV", title: "An evening well spent", text: "Cocktails, curated bites, and conversations worth remembering long after the night ends." },
];

/* ---- Section 6: People ---- */
// photo: "" chhodoge to initials wala arch card dikhega. Photo lagani ho to webp path daalo.
const PEOPLE = [
  { initials: "AD", name: "Amit Dubey", role: "Founder & Investor", photo: "" },
  { initials: "MR", name: "Mia Rose", role: "Strategy & Partnerships", photo: "" },
  { initials: "AR", name: "Aziz Ross", role: "Real Estate & Investments", photo: "" },
  { initials: "AS", name: "Alfredo J. Salvi F", role: "Business Development", photo: "" },
];

/* ---- Section 7: Evening timeline ---- */
const TIMELINE = [
  { time: "6:00 PM", title: "Doors open", text: "Arrive, grab a drink and settle into the evening." },
  { time: "6:00 to 6:45 PM", title: "Welcome and reception", text: "Appetizers. Beverages. Networking." },
  { time: "6:45 PM", title: "The BrickShare story", text: "Where we started, what we're building, and what lies ahead." },
  {
    time: "7:10 PM",
    title: "Houston real estate: what is next",
    text: "A focused conversation on the market, the opportunities and what lies ahead.",
  },
  { time: "7:35 PM", title: "The launch moment", text: "A closer look at BrickShare Capital and what is taking shape." },
  {
    time: "7:45 to 9:00 PM",
    title: "The room is yours.",
    text: "Meet the people, exchange ideas and continue the conversations that matter.",
  },
];

/* ---- Section 8: Experience ---- */
const EXPERIENCE = [
  { label: "Appetizers", text: "Thoughtfully prepared bites throughout the evening." },
  { label: "Beverages", text: "A curated selection to enjoy through the night." },
  { label: "Atmosphere", text: "An intimate setting designed for genuine connection." },
];

/* ---- Section 9: Setting ---- */
const VENUE_ADDRESS = "1334 Brittmoore Rd, Suite 1008 · Houston, TX 77043";
/* ---- Sponsor section ---- */
const SPONSOR_PLANS = [
  { key: "community", label: "Community Sponsor", price: "$100", amount: 100, desc: "Support the launch and receive recognition across event materials." },
  { key: "bronze", label: "Bronze Sponsor", price: "$250", amount: 250, desc: "Build visibility with event and social media recognition." },
  { key: "silver", label: "Silver Sponsor", price: "$500", amount: 500, desc: "Expand your reach through event, social, and verbal recognition." },
  { key: "gold", label: "Gold Sponsor", price: "$1,000", amount: 1000, desc: "Stand out with prominent event visibility and VIP recognition." },
  { key: "founding", label: "Founding Sponsor", price: "$1,500+", amount: 1500, limited: true, desc: "Become a premier partner and founding supporter of BrickShare Capital." },
] as const;
const LUMA_LINK = "https://luma.com/2cn4a2ir";
const VENUE_LINK = LUMA_LINK;

/* ---- Section 10: The Room cards ---- */
const ROOM_CARDS = [
  { tag: "The People", title: "Meet someone worth knowing.", image: IMG.roomPeople },
  { tag: "The Conversations", title: "Talk beyond the small talk.", image: IMG.roomConversations },
  { tag: "The Ideas", title: "Discover what's taking shape.", image: IMG.roomIdeas },
  { tag: "The Future", title: "See where it leads.", image: IMG.roomFuture },
];

/* ------------------------- SCROLL TIMING ----------------------------------- */
const N = chapters.length; // 4
const F = 0.07; // transition width (fraction of total hero scroll)
const SCROLL_HEIGHT = "500svh"; // total hero scroll distance (pinned)
const at = (i: number) => i / N; // chapter boundary i

// text chapter i: boundary se pehle purana text upar nikalta hai, baad me naya neeche se aata hai
function textRange(i: number) {
  if (i === 0)
    return { input: [0, at(1) - F, at(1)], op: [1, 1, 0], y: ["0vh", "0vh", "-55vh"], blur: [0, 0, 10] };
  if (i === N - 1)
    return { input: [at(i), at(i) + F, 1], op: [0, 1, 1], y: ["55vh", "0vh", "0vh"], blur: [10, 0, 0] };
  return {
    input: [at(i), at(i) + F, at(i + 1) - F, at(i + 1)],
    op: [0, 1, 1, 0],
    y: ["55vh", "0vh", "0vh", "-55vh"],
    blur: [10, 0, 0, 10],
  };
}

// Drone shot: progress [base -> neeche-beech -> upar-beech -> top -> zoom-out -> full view]
const KEY_P = [0, 0.25, 0.5, 0.72, 0.95, 1];
const FOCUS_Y = [0.78, 0.55, 0.3, 0.19]; // tower ka base -> top (image ka fraction)

// zoom (s) aur tower ki screen position (tx) ke hisaab se keyframes banata hai
function towerKeys(s: number, tx: number) {
  const lim = ((s - 1) / 2) * 100;
  const cl = (v: number) => Math.max(-lim, Math.min(lim, v));
  const X = cl((tx - 0.5 - (0.66 - 0.5) * s) * 100);
  return {
    S: [s, s, s, s, 1, 1],
    X: [X, X, X, X, 0, 0],
    Y: [...FOCUS_Y.map((fy) => cl(-(fy - 0.5) * s * 100)), 0, 0],
  };
}

/* ------------------------------ STYLES ------------------------------------- */
// Fonts + colours (Figma values). Sab classes `ev-` prefix se, kisi aur page pe asar nahi.
const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Instrument+Serif:ital@0;1&family=Montserrat:wght@500;600;700&display=swap');

.ev-root{
  --ev-ivory:#F3ECDD; --ev-ivory-muted:#B9B3A6;
  --ev-gold-500:#D9A93F; --ev-gold-300:#F6DD8E; --ev-navy:#0A0E1F;
  background:var(--ev-navy); color:var(--ev-ivory);
  font-family:'Montserrat',sans-serif;
}
.ev-root{ --ev-navy-950:#0A0C17; --ev-navy-900:#0F1325; --ev-navy-800:#131627; }

/* soft glow sirf text ke peeche */
.ev-textglow{
  width:fit-content; max-width:100%;
  padding:56px 72px; margin:-56px -72px;
  background:radial-gradient(ellipse closest-side, rgba(10,14,31,.5) 0%, rgba(10,14,31,.28) 55%, rgba(10,14,31,0) 100%);
}
@media (max-width:767px){ .ev-textglow{ padding:40px 24px; margin:-40px -24px; } }

/* "BRICKSHARE CAPITAL PRESENTS" / eyebrow / labels */
.ev-eyebrow{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px; line-height:1.4;
  letter-spacing:.26em; text-transform:uppercase; color:var(--ev-gold-500);
}
/* Heading — Instrument Serif Italic */
.ev-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(32px, min(5.2vw, 9vh), 78px);
  line-height:.92; letter-spacing:-.02em; color:var(--ev-ivory);
}
.ev-h > span{ display:block; }
@media (max-width:767px){ .ev-h{ font-size:clamp(34px,10vw,52px); } }
.ev-h-gold{
  width:fit-content; max-width:100%;
  background:linear-gradient(90deg,#9C7321 0%,#F6DD8E 35%,#D9A93F 62%,#F6DD8E 100%);
  -webkit-background-clip:text; background-clip:text;
  color:transparent; -webkit-text-fill-color:transparent;
  padding:0 .08em .14em 0; margin-bottom:-.14em; /* italic/descender clipping fix */
}
/* chapter 1 heading — sabse bada */
.ev-h-xl{ font-size:clamp(40px, min(8vw, 13.5vh), 120px); }
@media (max-width:767px){ .ev-h-xl{ font-size:clamp(40px,12vw,64px); } }

/* chapter 2, 3, 4 ka pura text bada */
.ev-chbig .ev-eyebrow{ font-size:14px; }
.ev-chbig .ev-h{ font-size:clamp(40px, min(7.4vw, 12.5vh), 110px); }
.ev-chbig .ev-body{ font-size:clamp(15px,1.3vw,19px); max-width:36rem; }
@media (max-width:767px){
  .ev-chbig .ev-h{ font-size:clamp(36px,11vw,58px); }
}

/* Paragraph — Montserrat Medium */
.ev-body{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(13px,1vw,15px); line-height:1.6; color:var(--ev-ivory-muted);
  max-width:30rem;
}
/* When / Where */
.ev-meta-label{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:10px; line-height:1.4;
  letter-spacing:.26em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-meta-value{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(16px,1.35vw,20px); line-height:1.12; letter-spacing:-.005em; color:var(--ev-ivory);
}
.ev-meta-sub{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:12px; line-height:1.5;
  color:var(--ev-ivory-muted);
}
/* "Limited guest list · ..." */
.ev-note{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:10px; line-height:1.4;
  letter-spacing:.24em; text-transform:uppercase; color:var(--ev-ivory-muted);
}
/* "Be there when it begins." — Caveat Bold */
.ev-hand{
  font-family:'Caveat',cursive; font-weight:700; font-size:clamp(22px,2.1vw,30px);
  line-height:1; letter-spacing:0; color:var(--ev-gold-300);
}
/* Reserve Your Place — gold gradient pill */
.ev-btn-gold{
  display:inline-flex; align-items:center; justify-content:center; gap:12px;
  width:230px; max-width:100%; height:48px; padding:0 24px; border-radius:999px;
  background:linear-gradient(90deg,#9C7222 0%,#F6DD8E 35%,#D9A93F 60%,#F6DD8E 100%);
  color:var(--ev-navy); font-family:'Montserrat',sans-serif; font-weight:700; font-size:11px;
  letter-spacing:.18em; text-transform:uppercase; white-space:nowrap;
  box-shadow:0 12px 32px -12px rgba(217,169,63,.65);
  transition:transform .3s ease, box-shadow .3s ease;
}
.ev-btn-gold:hover{ transform:translateY(-2px); box-shadow:0 16px 38px -10px rgba(217,169,63,.8); }
.ev-btn-ghost{
  display:inline-flex; align-items:center; justify-content:center; gap:12px;
  height:48px; padding:0 24px; border-radius:999px;
  border:1px solid rgba(217,169,63,.55); color:var(--ev-ivory);
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px;
  letter-spacing:.18em; text-transform:uppercase; white-space:nowrap;
  transition:background .3s ease, border-color .3s ease;
}
.ev-btn-ghost:hover{ background:rgba(217,169,63,.12); border-color:var(--ev-gold-500); }
/* chapter nav (ARRIVAL / THE ROOM / ...) — ab use nahi hota */
.ev-chnav{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; padding-bottom:6px;
  border-bottom:1px solid transparent; color:rgba(185,179,166,.7);
  transition:color .3s ease, border-color .3s ease;
}
.ev-chnav:hover{ color:var(--ev-ivory); }
.ev-chnav[data-active="true"]{ color:var(--ev-gold-300); border-color:var(--ev-gold-300); }

/* marquee strip */
.ev-marquee{
  overflow:hidden; background:#131627; padding:22px 0;
  border-style:solid; border-color:#9C7222; border-width:1px 0 1px 0;
}
.ev-marquee-track{ display:flex; width:max-content; animation:ev-marquee 38s linear infinite; }
.ev-marquee-item{
  display:flex; align-items:center; gap:36px; padding-right:36px; white-space:nowrap;
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(22px,2.2vw,32px); line-height:1.1; color:var(--ev-ivory);
}
.ev-marquee-star{ color:var(--ev-gold-500); font-style:normal; font-size:.55em; }
.ev-marquee-text{
  display:inline-block;
  background:linear-gradient(90deg,#9C7321 0%,#F6DD8E 35%,#D9A93F 62%,#F6DD8E 100%);
  -webkit-background-clip:text; background-clip:text;
  color:transparent; -webkit-text-fill-color:transparent;
  padding:0 .08em .14em 0; margin-bottom:-.14em; /* italic clipping fix */
}
@keyframes ev-marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
@media (prefers-reduced-motion:reduce){ .ev-marquee-track{ animation:none; } }

/* SECTION 3: A room full of possibilities */
.ev-room{ background:var(--ev-navy-950); }
.ev-room-eyebrow{
  display:flex; align-items:center; gap:14px;
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-room-eyebrow::before{ content:""; width:40px; height:1px; background:var(--ev-gold-500); }
.ev-room-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(44px,6.1vw,88px); line-height:.96; letter-spacing:-.015em; color:var(--ev-ivory);
}
.ev-room-h > span{ display:block; }
.ev-room-p1{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(15px,1.25vw,18px); line-height:1.6; color:var(--ev-ivory-muted);
}
.ev-room-p2{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:15px; line-height:1.6; color:var(--ev-ivory-muted);
}
.ev-room-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:12px;
  height:56px; padding:0 26px; border-radius:999px; border:1px solid var(--ev-gold-500);
  font-family:'Montserrat',sans-serif; font-weight:700; font-size:14px; line-height:1;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ev-gold-300); white-space:nowrap;
  transition:background .3s ease, border-color .3s ease;
}
.ev-room-btn:hover{ background:rgba(217,169,63,.12); border-color:var(--ev-gold-300); }
.ev-room-btn svg{ transition:transform .3s ease; }
.ev-room-btn:hover svg{ transform:translateX(4px); }

/* ---- arch image (size Tailwind classes se aata hai, yahan sirf look + animation) ---- */
.ev-arch{ --ev-off:0px; }
.ev-arch-shape{ position:absolute; border-radius:50% 50% 0 0 / 29% 29% 0 0; }

/* gold frame: image ke peeche (offset 0 = image ke bilkul barabar) */
.ev-arch-box{
  inset:0; z-index:0; pointer-events:none;
  border:1px solid rgba(217,169,63,.8); opacity:0;
  transition:opacity .8s ease .7s, transform 1.3s cubic-bezier(.22,1,.36,1) .7s;
}
/* image: neeche se upar khulti hai */
.ev-arch-img{
  inset:0; z-index:1; overflow:hidden; background:var(--ev-navy-950);
  clip-path:inset(100% 0 0 0);
  transition:clip-path 1.3s cubic-bezier(.22,1,.36,1) .25s;
}
.ev-arch-zoom{
  position:absolute; inset:-2px; transform:scale(1.22);
  transition:transform 2s cubic-bezier(.22,1,.36,1) .25s;
}
/* image ka apna patla gold border */
.ev-arch-img::after{
  content:""; position:absolute; inset:0; border-radius:inherit; z-index:3;
  border:1px solid rgba(217,169,63,.8); pointer-events:none;
}
/* ek baar golden shine image ke upar se guzarti hai */
.ev-arch-img::before{
  content:""; position:absolute; top:0; bottom:0; left:-60%; width:45%; z-index:2;
  pointer-events:none; opacity:0; transform:skewX(-12deg);
  background:linear-gradient(100deg, transparent, rgba(246,221,142,.28), transparent);
}
/* tower ke peeche halka glow pulse */
.ev-arch-glow{
  position:absolute; left:50%; top:46%; width:70%; aspect-ratio:1; z-index:1;
  transform:translate(-50%,-50%); opacity:0; pointer-events:none; mix-blend-mode:screen;
  background:radial-gradient(circle, rgba(246,221,142,.38) 0%, rgba(246,221,142,0) 62%);
}

.ev-arch[data-in="true"] .ev-arch-box{ opacity:1; transform:translate(var(--ev-off),var(--ev-off)); }
.ev-arch[data-in="true"] .ev-arch-img{ clip-path:inset(0 0 0 0); }
.ev-arch[data-in="true"] .ev-arch-zoom{ transform:scale(1); }
.ev-arch[data-in="true"] .ev-arch-img::before{ animation:ev-shine 1.8s ease 1.3s 1 both; }
.ev-arch[data-in="true"] .ev-arch-glow{ animation:ev-glow 4.5s ease-in-out 1.6s infinite; }
@keyframes ev-shine{ 0%{ left:-60%; opacity:0; } 20%{ opacity:1; } 100%{ left:130%; opacity:0; } }
@keyframes ev-glow{
  0%,100%{ opacity:.25; transform:translate(-50%,-50%) scale(.92); }
  50%{ opacity:.85; transform:translate(-50%,-50%) scale(1.08); }
}

/* text: heading line-by-line reveal + eyebrow line draw (sirf is section me) */
.ev-room-lines > span{ overflow:hidden; padding:0 .1em .14em 0; margin-bottom:-.14em; }
.ev-room-lines > span > i{
  display:block; font-style:inherit; transform:translateY(105%);
  transition:transform 1.1s cubic-bezier(.22,1,.36,1);
}
.ev-room-lines > span:nth-child(2) > i{ transition-delay:.12s; }
.ev-room-col[data-in="true"] .ev-room-lines > span > i{ transform:none; }
.ev-room-col .ev-room-eyebrow::before{
  transform:scaleX(0); transform-origin:left; transition:transform .9s ease .1s;
}
.ev-room-col[data-in="true"] .ev-room-eyebrow::before{ transform:none; }

@media (prefers-reduced-motion:reduce){
  .ev-arch-box,.ev-arch-img,.ev-arch-zoom,.ev-room-lines > span > i,.ev-room-col .ev-room-eyebrow::before{ transition:none !important; }
  .ev-arch-box{ opacity:1; transform:translate(var(--ev-off),var(--ev-off)); }
  .ev-arch-img{ clip-path:inset(0 0 0 0); } .ev-arch-zoom{ transform:none; }
  .ev-room-lines > span > i,.ev-room-col .ev-room-eyebrow::before{ transform:none; }
  .ev-arch-glow,.ev-arch-img::before{ animation:none !important; }
  .ev-arch-glow{ opacity:.4; }
}

/* =====================================================================
   NEW SECTIONS (4 → 11)
   ===================================================================== */
.ev-pad{ --ev-pad:clamp(20px,6.67vw,96px); }
.ev-sec{ padding-top:clamp(56px,6.7vw,96px); padding-bottom:clamp(56px,6.7vw,96px); }
.ev-bg-800{ background:var(--ev-navy-800); }
.ev-bg-900{ background:var(--ev-navy-900); }
.ev-bg-950{ background:var(--ev-navy-950); }

/* gold gradient text (centered / inline use) */
.ev-gold-text{
  display:inline-block;
  background:linear-gradient(90deg,#9C7321 0%,#F6DD8E 35%,#D9A93F 62%,#F6DD8E 100%);
  -webkit-background-clip:text; background-clip:text;
  color:transparent; -webkit-text-fill-color:transparent;
  padding:0 .08em .14em 0; margin-bottom:-.14em;
}

/* SECTION 4: Why attend */
.ev-why-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:40px; }
@media (max-width:1023px){ .ev-why-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:599px){ .ev-why-grid{ grid-template-columns:1fr; gap:36px; } }
.ev-why-item{ border-top:1px solid rgba(217,169,63,.75); padding-top:36px; }
.ev-numeral{
  display:inline-block; font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(48px,4.7vw,68px); line-height:1; padding:0 .1em .06em 0;
  background:linear-gradient(135deg,#F6DD8E 0%,#D9A93F 55%,#9C7321 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
}
.ev-why-label{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; line-height:1.4;
  letter-spacing:.24em; text-transform:uppercase; color:var(--ev-ivory);
}
.ev-why-text{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:16px; line-height:1.6; color:var(--ev-ivory-muted);
}

/* SECTION 5: The right room */
.ev-right{ position:relative; overflow:hidden; text-align:center; background:#080B16; }
.ev-scene-stick.ev-right{
  display:flex; align-items:center;
  /* image ratio 2160/1410 = 1.532 -> height kabhi isse kam nahi, to upar/neeche se nahi kategi */
  min-height:calc(100vw / 1.532);
  padding-top:clamp(56px,8vw,140px); padding-bottom:clamp(56px,8vw,140px);
}
@media (min-width:1024px){
  .ev-scene-stick.ev-right{ min-height:min(calc(100vw / 1.532), 1000px); }
}
  @media (min-width:1600px){
  /* image ke upar/neeche khali margin hai, 1.85 ratio par bhi tower poora dikhta hai */
  .ev-scene-stick.ev-right{ min-height:max(calc(100vw / 1.85), calc(100svh - 72px)); }
}
.ev-right-mark{
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; object-position:50% 50%;
  pointer-events:none; user-select:none;
  opacity:0; transform:scale(1.06);
  transition:opacity 1.6s ease, transform 2.8s cubic-bezier(.22,1,.36,1);
}
.ev-right-mark[data-in="true"]{ opacity:1; transform:scale(1); }

/* heading: Instrument Serif Italic 148px / lh 92% / ls -2% */
.ev-right-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(40px,9.2vw,132px); line-height:.92; letter-spacing:-.02em; color:var(--ev-ivory);
}
.ev-rr-line{ display:block; overflow:hidden; padding:.08em .1em .16em; margin:-.08em 0 -.16em; }
.ev-rr-line > i{
  display:block; font-style:inherit; opacity:0; transform:translateY(110%); filter:blur(12px);
  transition:transform 1.2s cubic-bezier(.22,1,.36,1), opacity 1s ease, filter 1.2s ease;
}
.ev-rr-line:nth-child(2) > i{ transition-delay:.16s; }
.ev-rr-line > i.ev-gold-text{ width:fit-content; margin-left:auto; margin-right:auto; }
@media (min-width:1024px){ .ev-right-h{ white-space:nowrap; } }

/* sub line: Instrument Serif Italic 34px / lh 112% / ls -0.5% */
.ev-right-sub{
  display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:14px clamp(16px,2.4vw,34px);
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(20px,2.36vw,34px); line-height:1.12; letter-spacing:-.005em; color:var(--ev-ivory);
}
.ev-right-star{ color:var(--ev-gold-500); font-style:normal; font-size:.55em; }
.ev-rr-pop{
  opacity:0; transform:translateY(18px); filter:blur(8px);
  transition:opacity .9s ease, transform 1s cubic-bezier(.22,1,.36,1), filter .9s ease;
}
.ev-right-sub > .ev-rr-pop:nth-child(1){ transition-delay:.7s; }
.ev-right-sub > .ev-rr-pop:nth-child(2){ transition-delay:.8s; }
.ev-right-sub > .ev-rr-pop:nth-child(3){ transition-delay:.95s; }
.ev-right-sub > .ev-rr-pop:nth-child(4){ transition-delay:1.05s; }
.ev-right-sub > .ev-rr-pop:nth-child(5){ transition-delay:1.2s; }

/* eyebrow: Montserrat SemiBold 13px / lh 140% / ls 28% / uppercase / gold-500 */
.ev-right-eyebrow{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-gold-500);
  opacity:0; transform:translateY(14px); filter:blur(6px);
  transition:opacity .9s ease 1.45s, transform 1s cubic-bezier(.22,1,.36,1) 1.45s, filter .9s ease 1.45s;
}

/* section screen me aate hi sab ek baar chalta hai */
.ev-right-body[data-in="true"] .ev-rr-line > i,
.ev-right-body[data-in="true"] .ev-rr-pop,
.ev-right-body[data-in="true"] .ev-right-eyebrow{ opacity:1; transform:none; filter:none; }

@media (prefers-reduced-motion:reduce){
  .ev-right-mark,.ev-rr-line > i,.ev-rr-pop,.ev-right-eyebrow{ transition:none !important; }
  .ev-right-mark{ opacity:1; transform:none; }
  .ev-rr-line > i,.ev-rr-pop,.ev-right-eyebrow{ opacity:1; transform:none; filter:none; }
}

/* SECTION 6: People */
.ev-pp-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(38px,6.5vw,94px); line-height:.96; letter-spacing:-.015em; color:var(--ev-ivory);
}
.ev-pp-h > span{ display:inline-block; overflow:hidden; vertical-align:top; padding:0 .1em .16em 0; margin:0 -.1em -.16em 0; }
.ev-pp-h > span > i{
  display:block; font-style:inherit; opacity:0; transform:translateY(105%); filter:blur(8px);
  transition:transform 1.1s cubic-bezier(.22,1,.36,1), filter 1s ease, opacity .8s ease;
}
.ev-pp-h > span:nth-child(2) > i{ transition-delay:.14s; }
.ev-pp-head[data-in="true"] .ev-pp-h > span > i{ opacity:1; transform:none; filter:none; }

.ev-pp-sub{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(15px,1.25vw,18px); line-height:1.6; letter-spacing:0;
  color:var(--ev-ivory-muted); max-width:34rem;
}

.ev-people-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:clamp(16px,2.8vw,40px); }
@media (max-width:1023px){ .ev-people-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); gap:32px 20px; } }

.ev-person{ --d:0s; }

/* arch card: neeche se upar khulta hai */
.ev-person-arch{
  position:relative; aspect-ratio:296/380; overflow:hidden;
  border-radius:999px 999px 0 0; border:1px solid rgba(217,169,63,.55);
  background:linear-gradient(180deg,#2A2F52 0%,#0A0C17 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
  clip-path:inset(100% 0 0 0);
  transition:clip-path 1.2s cubic-bezier(.22,1,.36,1) var(--d), border-color .6s ease;
}
.ev-person-arch img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  transform:scale(1.15); transition:transform 1.8s cubic-bezier(.22,1,.36,1) var(--d);
}
.ev-person-initials{
  display:inline-block; position:relative;
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(64px,7.5vw,108px); line-height:.92; letter-spacing:-.02em; padding:0 .1em .08em 0;
  background:linear-gradient(90deg,#9C7321 0%,#F6DD8E 35%,#D9A93F 62%,#F6DD8E 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
  opacity:0; transform:translateY(22px) scale(.94); filter:blur(10px);
  transition:opacity .9s ease calc(var(--d) + .55s), transform 1.1s cubic-bezier(.22,1,.36,1) calc(var(--d) + .55s), filter 1s ease calc(var(--d) + .55s);
}
.ev-person-co{
  position:relative; font-family:'Montserrat',sans-serif; font-weight:600; font-size:8px; letter-spacing:.3em;
  text-transform:uppercase; color:rgba(217,169,63,.7);
  opacity:0; transition:opacity .9s ease calc(var(--d) + .95s);
}
.ev-person-meta{
  opacity:0; transform:translateY(14px); filter:blur(6px);
  transition:opacity .9s ease calc(var(--d) + .75s), transform 1s cubic-bezier(.22,1,.36,1) calc(var(--d) + .75s), filter .9s ease calc(var(--d) + .75s);
}
.ev-person[data-in="true"] .ev-person-arch{ clip-path:inset(0 0 0 0); }
.ev-person[data-in="true"] .ev-person-arch img{ transform:none; }
.ev-person[data-in="true"] .ev-person-initials{ opacity:1; transform:none; filter:none; }
.ev-person[data-in="true"] .ev-person-co{ opacity:1; }
.ev-person[data-in="true"] .ev-person-meta{ opacity:1; transform:none; filter:none; }

.ev-person-name{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(22px,2.1vw,30px); line-height:1.12; letter-spacing:-.005em; color:var(--ev-ivory);
}
.ev-person-role{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-person-link{
  display:inline-flex; align-items:center; gap:6px;
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:14px; line-height:1.6; letter-spacing:0;
  color:var(--ev-ivory-muted); transition:color .3s ease;
}
.ev-person-link svg{ transition:transform .3s ease; }
.ev-person-link:hover{ color:var(--ev-gold-300); }
.ev-person-link:hover svg{ transform:translateX(4px); }
@media (hover:hover){ .ev-person:hover .ev-person-arch{ border-color:rgba(217,169,63,.95); } }

@media (max-width:1023px){ .ev-person-initials{ font-size:clamp(72px,11vw,104px); } }
@media (max-width:599px){
  .ev-people-grid{ gap:28px 14px; }
  .ev-person-initials{ font-size:clamp(46px,15vw,72px); }
  .ev-person-co{ font-size:7px; letter-spacing:.24em; }
  .ev-person-name{ font-size:21px; }
  .ev-person-role{ font-size:9.5px; letter-spacing:.2em; }
  .ev-person-link{ font-size:13px; }
}

@media (prefers-reduced-motion:reduce){
  .ev-pp-h > span > i,.ev-person-arch,.ev-person-arch img,.ev-person-initials,.ev-person-co,.ev-person-meta{ transition:none !important; }
  .ev-pp-h > span > i,.ev-person-initials,.ev-person-meta{ opacity:1; transform:none; filter:none; }
  .ev-person-arch{ clip-path:none; } .ev-person-arch img{ transform:none; } .ev-person-co{ opacity:1; }
}

/* SECTION 7: Evening timeline */
.ev-evening-grid{ display:grid; gap:48px; grid-template-columns:1fr; }
@media (min-width:1024px){
  .ev-evening-grid{ grid-template-columns:minmax(0,5fr) minmax(0,7fr); gap:clamp(40px,6vw,96px); }
  .ev-evening-stick{ position:sticky; top:clamp(96px,14vh,150px); align-self:start; }
}

/* heading: Instrument Serif Italic 100.8px / lh 98% / ls -2% */
.ev-ev-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(40px,7vw,100.8px); line-height:.98; letter-spacing:-.02em; color:var(--ev-ivory);
}
.ev-ev-h > span{ display:block; overflow:hidden; padding:0 .1em .16em 0; margin-bottom:-.16em; }
.ev-ev-h > span > i{
  display:block; font-style:inherit; opacity:0; transform:translateY(105%); filter:blur(8px);
  transition:transform 1.1s cubic-bezier(.22,1,.36,1), filter 1s ease, opacity .8s ease;
}
.ev-ev-h > span:nth-child(2) > i{ transition-delay:.12s; }
.ev-ev-h > span:nth-child(3) > i{ transition-delay:.24s; }
.ev-ev-head[data-in="true"] .ev-ev-h > span > i{ opacity:1; transform:none; filter:none; }

/* sub: Montserrat Medium 18.72px / lh 160% */
.ev-ev-sub{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(15px,1.3vw,18.72px); line-height:1.6; letter-spacing:0; color:var(--ev-ivory-muted);
}

/* timeline */
.ev-tl{ position:relative; list-style:none; margin:0; display:flex; flex-direction:column; gap:clamp(24px,2.6vw,40px); padding-left:28px; }

/* rail: dim track + gold fill + moving tip */
.ev-tl-rail{ position:absolute; left:4px; top:8px; bottom:8px; width:1px; background:rgba(217,169,63,.22); }
.ev-tl-fill{
  position:absolute; inset:0; transform-origin:top;
  background:linear-gradient(180deg,#F6DD8E 0%,#D9A93F 60%,#9C7321 100%);
}
.ev-tl-tip{
  position:absolute; left:50%; width:11px; height:11px; margin-left:-5.5px; margin-top:-5.5px; border-radius:999px;
  background:radial-gradient(circle,#FFF3C4 0%,#F6DD8E 45%,#D9A93F 100%);
  box-shadow:0 0 0 5px rgba(217,169,63,.16), 0 0 22px 4px rgba(246,221,142,.55);
}

.ev-tl-li{ position:relative; }
/* dot: pehle halka ring, line pahunchte hi gold bhar jata hai */
.ev-tl-li::before{
  content:""; position:absolute; left:-28px; top:4px; width:9px; height:9px; border-radius:999px;
  background:var(--ev-navy-950); border:1px solid rgba(217,169,63,.5); box-sizing:border-box;
}
.ev-tl-dot{
  position:absolute; left:-28px; top:4px; width:9px; height:9px; border-radius:999px; opacity:0;
  background:var(--ev-gold-500); box-shadow:0 0 0 4px rgba(217,169,63,.18), 0 0 14px rgba(246,221,142,.6);
}

.ev-tl-item{
  display:grid; grid-template-columns:1fr; gap:6px 24px;
  padding-bottom:clamp(24px,2.6vw,40px);
  border-bottom:1px solid var(--color-gold-700, #9C7222);
}
.ev-tl-time{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; line-height:1.4;
  letter-spacing:.18em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-tl-title{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(26px,2.8vw,40.32px); line-height:1.1; letter-spacing:-.01em; color:var(--ev-ivory);
}
.ev-tl-text{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:16px; line-height:1.6; letter-spacing:0;
  color:var(--ev-ivory-muted); margin-top:8px; max-width:34rem;
}
@media (min-width:640px){
  .ev-tl-item{ grid-template-columns:clamp(176px,15vw,210px) 1fr; }
  .ev-tl-time{ padding-top:10px; }
  .ev-tl-li::before,.ev-tl-dot{ top:14px; }
}
@media (max-width:420px){ .ev-tl-text{ font-size:15px; } }

@media (prefers-reduced-motion:reduce){
  .ev-ev-h > span > i{ transition:none !important; opacity:1; transform:none; filter:none; }
}

/* SECTION 8: Experience */
.ev-exp-grid{ display:grid; gap:48px; grid-template-columns:1fr; align-items:center; }
@media (min-width:1024px){ .ev-exp-grid{ grid-template-columns:minmax(0,1fr) minmax(0,560px); gap:clamp(40px,6vw,96px); } }
.ev-exp-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(48px,6.9vw,100px); line-height:.98; letter-spacing:-.02em; color:var(--ev-ivory);
}
.ev-exp-h > span{ display:block; }
.ev-exp-lead{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:clamp(16px,1.4vw,20px); line-height:1.6;
  color:var(--ev-ivory-muted); max-width:34rem;
}
.ev-exp-cols{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; max-width:34rem; }
@media (max-width:599px){ .ev-exp-cols{ grid-template-columns:1fr; } }
.ev-exp-label{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-exp-text{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:14px; line-height:1.6; color:var(--ev-ivory-muted);
}
.ev-exp-img{ width:100%; max-height:calc(100svh - 160px); aspect-ratio:560/740; object-fit:cover; border-radius:4px; display:block; margin-left:auto; }
/* SECTION 8: Experience (naya) */
.ev-xp-grid{
  display:grid; gap:48px; grid-template-columns:1fr; align-items:center;
}
@media (min-width:1024px){
  .ev-xp-grid{ grid-template-columns:minmax(0,1fr) minmax(0,min(560px,44%)); gap:clamp(40px,6vw,96px); }
}

/* heading: Instrument Serif Italic 104px / lh 96% / ls -1.5% */
.ev-xp-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(44px,7.2vw,104px); line-height:.96; letter-spacing:-.015em; color:var(--ev-ivory);
}
.ev-xp-h > span{ display:block; overflow:hidden; padding:0 .1em .16em 0; margin-bottom:-.16em; }
.ev-xp-h > span > i{
  display:block; font-style:inherit; opacity:0; transform:translateY(105%); filter:blur(8px);
  transition:transform 1.1s cubic-bezier(.22,1,.36,1), filter 1s ease, opacity .8s ease;
}
.ev-xp-h > span:nth-child(2) > i{ transition-delay:.12s; }
.ev-xp-h > span:nth-child(3) > i{ transition-delay:.24s; }

/* lead: Montserrat Medium 20px / lh 160% */
.ev-xp-lead{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(16px,1.4vw,20px); line-height:1.6; letter-spacing:0;
  color:var(--ev-ivory-muted); max-width:34rem;
}

/* 3 columns: label 12px gold-300, text 14px */
.ev-xp-cols{
  display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:24px; max-width:34rem;
}
.ev-xp-label{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:12px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-gold-300);
}
.ev-xp-text{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:14px; line-height:1.6; letter-spacing:0;
  color:var(--ev-ivory-muted); margin-top:12px;
}

/* handwritten: Caveat Bold 34px / lh 100% */
.ev-xp-hand{
  display:inline-block; transform:rotate(-2deg); transform-origin:left center;
  font-family:'Caveat',cursive; font-weight:700; font-size:clamp(24px,2.36vw,34px);
  line-height:1; letter-spacing:0; color:var(--ev-gold-300);
  clip-path:inset(-10% 100% -10% 0);
  transition:clip-path 1.6s cubic-bezier(.65,0,.35,1) 1.5s;
}

/* text ke chhote items */
.ev-xp-pop{
  opacity:0; transform:translateY(16px); filter:blur(6px);
  transition:opacity .9s ease var(--xd,0s), transform 1s cubic-bezier(.22,1,.36,1) var(--xd,0s), filter .9s ease var(--xd,0s);
}

/* text column trigger */
.ev-xp-col[data-in="true"] .ev-xp-h > span > i{ opacity:1; transform:none; filter:none; }
.ev-xp-col[data-in="true"] .ev-xp-pop{ opacity:1; transform:none; filter:none; }
.ev-xp-col[data-in="true"] .ev-xp-hand{ clip-path:inset(-10% 0 -10% 0); }

/* image: neeche se upar khulti hai + zoom-out + ek baar gold shine */
.ev-xp-frame{
  position:relative; width:100%; aspect-ratio:560/740; max-height:calc(100svh - 120px);
  margin-left:auto; border-radius:4px; overflow:hidden; background:var(--ev-navy-950);
  clip-path:inset(100% 0 0 0);
  transition:clip-path 1.5s cubic-bezier(.22,1,.36,1) .1s;
}
.ev-xp-zoom{
  position:absolute; inset:-2px; transform:scale(1.25);
  transition:transform 2.4s cubic-bezier(.22,1,.36,1) .1s;
}
.ev-xp-zoom img{ width:100%; height:100%; object-fit:cover; display:block; user-select:none; will-change:transform; }
.ev-xp-frame::after{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:3;
  border:1px solid rgba(217,169,63,.35);
}
.ev-xp-frame::before{
  content:""; position:absolute; top:0; bottom:0; left:-60%; width:45%; z-index:2;
  pointer-events:none; opacity:0; transform:skewX(-12deg);
  background:linear-gradient(100deg, transparent, rgba(246,221,142,.26), transparent);
}
.ev-xp-media[data-in="true"] .ev-xp-frame{ clip-path:inset(0 0 0 0); }
.ev-xp-media[data-in="true"] .ev-xp-zoom{ transform:scale(1); }
.ev-xp-media[data-in="true"] .ev-xp-frame::before{ animation:ev-shine 1.8s ease 1.2s 1 both; }

/* tablet / mobile: image text ke neeche, center me */
@media (max-width:1023px){
  .ev-xp-frame{ max-width:min(100%,520px); margin-left:auto; margin-right:auto; max-height:none; }
}
@media (max-width:599px){
  .ev-xp-cols{ grid-template-columns:1fr; gap:20px; }
  .ev-xp-hand{ transform:rotate(-1.5deg); }
}
@media (max-width:420px){ .ev-xp-h{ font-size:40px; } }

@media (prefers-reduced-motion:reduce){
  .ev-xp-h > span > i,.ev-xp-pop,.ev-xp-hand,.ev-xp-frame,.ev-xp-zoom{ transition:none !important; }
  .ev-xp-h > span > i,.ev-xp-pop{ opacity:1; transform:none; filter:none; }
  .ev-xp-hand{ clip-path:none; }
  .ev-xp-frame{ clip-path:none; } .ev-xp-zoom{ transform:none; }
  .ev-xp-frame::before{ animation:none !important; }
}

/* SECTION 9: Setting */
.ev-scene-stick.ev-setting{ display:flex; align-items:stretch; overflow:hidden; min-height:520px; background:var(--ev-navy-950); }
@media (min-width:1024px){ .ev-scene-stick.ev-setting{ min-height:max(640px,62.5vw); } }
.ev-setting .ev-scene-body{ display:flex; align-items:flex-end; }

/* background image + zoom-out */
.ev-setting-media{ position:absolute; inset:0; overflow:hidden; }
.ev-setting-zoom{ position:absolute; inset:0; will-change:transform; }
.ev-setting-bg{
  display:block; width:100%; height:100%; object-fit:cover; object-position:50% 50%;
  will-change:transform; user-select:none;
}
.ev-setting-shade{
  position:absolute; inset:0;
  background:linear-gradient(90deg, rgba(10,14,31,.55) 0%, rgba(10,14,31,.2) 50%, rgba(10,14,31,.1) 100%);
}
@media (max-width:1023px){
  .ev-setting-shade{ background:linear-gradient(180deg, rgba(10,14,31,.35) 0%, rgba(10,14,31,.6) 100%); }
}

/* content: card left-bottom, tag right-bottom */
.ev-scene-body .ev-setting-wrap{
  width:100%; display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between;
  gap:28px 40px; padding-top:clamp(48px,5.5vw,80px); padding-bottom:clamp(48px,5.5vw,80px);
}

.ev-setting-card{
  position:relative; width:618px; max-width:100%; padding:clamp(28px,3.4vw,48px);
  background:rgba(10,12,26,.82); border:1px solid rgba(217,169,63,.7);
  -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
  opacity:0; transform:translateY(32px);
  transition:opacity 1s ease .2s, transform 1.2s cubic-bezier(.22,1,.36,1) .2s;
}
.ev-setting-wrap .ev-room-eyebrow::before{ transform:scaleX(0); transform-origin:left; transition:transform .9s ease .6s; }

/* heading: Instrument Serif Italic 88px */
.ev-setting-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(40px,6.1vw,88px); line-height:.96; letter-spacing:-.015em; color:var(--ev-ivory);
}
.ev-setting-h > span{ display:block; overflow:hidden; padding:0 .1em .16em 0; margin-bottom:-.16em; }
.ev-setting-h > span > i{
  display:block; font-style:inherit; opacity:0; transform:translateY(105%); filter:blur(8px);
  transition:transform 1.1s cubic-bezier(.22,1,.36,1) .55s, filter 1s ease .55s, opacity .8s ease .55s;
}
.ev-setting-h > span:nth-child(2) > i{ transition-delay:.69s; }

/* Gallery Steps: Instrument Serif Italic 40px, gold gradient */
.ev-setting-sub{
  display:inline-block;
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(28px,2.78vw,40px); line-height:1.12; letter-spacing:-.005em;
  background:linear-gradient(90deg,#9C7321 0%,#F6DD8E 35%,#D9A93F 62%,#F6DD8E 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
  padding:0 .08em .14em 0; margin-bottom:-.14em;
}
.ev-setting-p{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:16px; line-height:1.6; color:var(--ev-ivory-muted);
}
.ev-setting-addr{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; line-height:1.4;
  letter-spacing:.2em; text-transform:uppercase; color:var(--ev-ivory);
}

/* button: border #D9A93F, Montserrat Bold 14px, ls 14%, color #F6DD8E */
.ev-setting-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:12px;
  height:60px; padding:0 30px; border-radius:999px; border:1px solid #D9A93F; color:#F6DD8E;
  font-family:'Montserrat',sans-serif; font-weight:700; font-size:14px; line-height:1;
  letter-spacing:.14em; text-transform:uppercase; white-space:nowrap;
  transition:background .3s ease, border-color .3s ease;
}
.ev-setting-btn:hover{ background:rgba(217,169,63,.12); border-color:#F6DD8E; }
.ev-setting-btn svg{ transition:transform .3s ease; }
.ev-setting-btn:hover svg{ transform:translateX(4px); }

/* tag: Instrument Serif Italic 40px */
.ev-setting-tag{
  margin-left:auto; max-width:100%; text-align:right;
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(24px,2.78vw,40px); line-height:1.12; letter-spacing:-.005em; color:var(--ev-ivory);
  text-shadow:0 2px 24px rgba(0,0,0,.55);
}
@media (max-width:1023px){
  .ev-setting-tag{ margin-left:0; text-align:left; flex:1 1 100%; }
}

/* chhote items ek ke baad ek */
.ev-st-pop{
  opacity:0; transform:translateY(14px); filter:blur(6px);
  transition:opacity .9s ease var(--xd,0s), transform 1s cubic-bezier(.22,1,.36,1) var(--xd,0s), filter .9s ease var(--xd,0s);
}

/* trigger */
.ev-setting-wrap[data-in="true"] .ev-setting-card{ opacity:1; transform:none; }
.ev-setting-wrap[data-in="true"] .ev-room-eyebrow::before{ transform:none; }
.ev-setting-wrap[data-in="true"] .ev-setting-h > span > i{ opacity:1; transform:none; filter:none; }
.ev-setting-wrap[data-in="true"] .ev-st-pop{ opacity:1; transform:none; filter:none; }

@media (prefers-reduced-motion:reduce){
  .ev-setting-card,.ev-setting-h > span > i,.ev-st-pop,.ev-setting-wrap .ev-room-eyebrow::before{ transition:none !important; }
  .ev-setting-card,.ev-st-pop,.ev-setting-h > span > i{ opacity:1; transform:none; filter:none; }
  .ev-setting-wrap .ev-room-eyebrow::before{ transform:none; }
}

/* SECTION 10: The room carousel */
.ev-ideas-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(38px,5.55vw,80px); line-height:.96; letter-spacing:-.015em;
  color:var(--ev-ivory); max-width:8.6em;
}
.ev-ideas-p{
  font-family:'Montserrat',sans-serif; font-weight:500;
  font-size:clamp(14px,1.2vw,17px); line-height:1.6; letter-spacing:0; color:var(--ev-ivory-muted);
}
.ev-drag{
  position:relative; overflow:hidden; padding:20px 0; margin:-20px 0;
  touch-action:pan-y; cursor:grab; user-select:none;
}
.ev-drag[data-dragging="true"]{ cursor:grabbing; }
.ev-track{
  --ev-gutter:20px;
  position:relative; display:flex; width:max-content; gap:clamp(16px,1.95vw,28px);
  padding-left:var(--ev-gutter); will-change:transform;
}
.ev-card{
  position:relative; flex:0 0 auto; width:clamp(220px,23.6vw,340px); aspect-ratio:400/440;
  overflow:hidden; border-radius:4px; background:var(--ev-navy-950);
  transition:transform .7s cubic-bezier(.22,1,.36,1), box-shadow .7s ease, opacity .5s ease;
}
.ev-card img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover; user-select:none;
  transform:scale(1); transition:transform 1.2s cubic-bezier(.22,1,.36,1);
}
.ev-card-shade{
  position:absolute; inset:0; transition:opacity .6s ease;
  background:linear-gradient(180deg, rgba(10,12,23,0) 45%, rgba(10,12,23,.85) 100%);
}
.ev-card::after{
  content:""; position:absolute; inset:0; border-radius:4px; pointer-events:none;
  border:1px solid rgba(217,169,63,0); transition:border-color .6s ease;
}
.ev-card-body{
  position:absolute; left:20px; right:20px; bottom:20px;
  transition:transform .7s cubic-bezier(.22,1,.36,1);
}
.ev-card-tag{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:10px; line-height:1.4;
  letter-spacing:.26em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-card-title{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(18px,1.55vw,22px); line-height:1.12; letter-spacing:-.005em;
  color:var(--ev-ivory); margin-top:6px;
}
.ev-hint{
  display:flex; align-items:center; gap:10px;
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:10px; letter-spacing:.24em;
  text-transform:uppercase; color:var(--ev-gold-500); white-space:nowrap;
}
@media (hover:hover){
  .ev-drag:hover .ev-card:not(:hover){ opacity:.55; }
  .ev-card:hover{ transform:translateY(-10px); box-shadow:0 30px 60px -28px rgba(0,0,0,.8); }
  .ev-card:hover img{ transform:scale(1.1); }
  .ev-card:hover::after{ border-color:rgba(217,169,63,.65); }
  .ev-card:hover .ev-card-body{ transform:translateY(-8px); }
}
@media (prefers-reduced-motion:reduce){
  .ev-card,.ev-card img,.ev-card-body,.ev-card::after{ transition:none !important; }
}

/* SECTION 11: You're invited */
.ev-invite{
  position:relative; overflow:hidden; text-align:center; background:var(--ev-navy-950);
  min-height:clamp(680px,69.4vw,calc(1000px * var(--ev-k)));
  display:flex; align-items:center; justify-content:center;
  padding:clamp(72px,8vw,120px) 0;
}
.ev-invite-media{ position:absolute; inset:0; overflow:hidden; }
.ev-invite-bg{
  width:100%; height:100%; object-fit:cover; object-position:50% 45%;
  transform-origin:50% 52%; /* zoom gate ke opening ke beech me */
  will-change:transform; user-select:none;
}
.ev-invite-content{ position:relative; z-index:1; width:100%; }
.ev-invite-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(48px,9.2vw,132px); line-height:.92; letter-spacing:-.02em;
  text-align:center; color:var(--ev-ivory);
}
.ev-invite-date{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(32px,3.9vw,56px); line-height:1.04; letter-spacing:-.01em; text-align:center;
}
.ev-invite-p{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:clamp(14px,1.25vw,18px); line-height:1.6;
  letter-spacing:0; text-align:center; color:var(--ev-ivory-muted);
  max-width:34rem; margin-left:auto; margin-right:auto;
}
.ev-invite-q{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(18px,1.85vw,26px); line-height:1.12; letter-spacing:-.005em;
  text-align:center; color:var(--ev-ivory);
}
.ev-invite-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:12px;
  width:346px; max-width:100%; height:60px; padding:20px 30px; border-radius:999px;
  background:linear-gradient(90deg,#9C7222 0%,#F6DD8E 35%,#D9A93F 60%,#F6DD8E 100%);
  color:#0A0C17; font-family:'Montserrat',sans-serif; font-weight:700; font-size:14px; line-height:1;
  letter-spacing:.14em; text-transform:uppercase; white-space:nowrap;
  transition:transform .3s ease, filter .3s ease;
}
.ev-invite-btn:hover{ transform:translateY(-2px); filter:brightness(1.06); }
.ev-invite-meta{
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:11px; line-height:1.4;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ev-ivory-muted);
}

/* ===== SCENES (section 3 -> 11) — ab pin nahi, normal scroll ===== */
.ev-scene{ position:relative; }
.ev-scene-stick{ position:relative; }
.ev-scene-body{ position:relative; width:100%; }
@media (min-width:1024px){
  .ev-scene-stick{
    min-height:min(calc(100svh - 72px), calc(clamp(560px,50vw,900px) * var(--ev-k)));
    overflow:hidden; display:flex; align-items:center;
    .ev-right.ev-scene-stick{ width:100%; }
  }
    

}

/* =====================================================================
   HERO RESPONSIVE — --hu = ek unit, sab text isi se scale hota hai
   ===================================================================== */
.ev-hero{ --hu:clamp(7px, min(1.15vw, 1.7vh), 40px); }
.ev-hero-pad{
  padding-left:max(clamp(20px,6.5vw,96px), calc((100vw - 1280px) / 2 + 48px));
  padding-right:clamp(20px,6.5vw,96px);
}
@media (max-width:1023px){ .ev-hero{ --hu:clamp(8px, 1.3vw, 14px); } }
@media (max-width:767px){ .ev-hero{ --hu:clamp(5px, 1.4vw, 9px); } }

/* headings */
.ev-hero .ev-h.ev-h-xl{ font-size:max(34px, calc(var(--hu)*7.2)); }
.ev-hero .ev-chbig .ev-h{ font-size:max(31px, calc(var(--hu)*6.5)); }
.ev-hero .ev-h{ margin-top:calc(var(--hu)*1.4); }

/* eyebrow + paragraph */
.ev-hero .ev-eyebrow,
.ev-hero .ev-chbig .ev-eyebrow{ font-size:max(11px, calc(var(--hu)*.95)); }
.ev-hero .ev-body,
.ev-hero .ev-chbig .ev-body{
  font-size:max(14px, calc(var(--hu)*1.25));
  max-width:calc(var(--hu)*36);
  margin-top:calc(var(--hu)*1.6);
}

/* When / Where */
.ev-hero .ev-meta-label{ font-size:max(10px, calc(var(--hu)*.75)); }
.ev-hero .ev-meta-value{ font-size:max(17px, calc(var(--hu)*1.6)); }
.ev-hero .ev-meta-sub{ font-size:max(12px, calc(var(--hu)*.95)); }

/* buttons */
.ev-hero .ev-btn-gold{
  width:max(220px, calc(var(--hu)*17)); height:max(44px, calc(var(--hu)*3.5));
  padding:0 calc(var(--hu)*2); font-size:max(11px, calc(var(--hu)*.82));
}
.ev-hero .ev-btn-ghost{
  height:max(44px, calc(var(--hu)*3.5)); padding:0 calc(var(--hu)*2);
  font-size:max(11px, calc(var(--hu)*.82));
}

/* note + handwritten */
.ev-hero .ev-note{ font-size:max(10px, calc(var(--hu)*.75)); }
.ev-hero .ev-hand{ font-size:max(22px, calc(var(--hu)*2.2)); }

/* hero container = footer ka .section; yahan sirf vertical spacing */
.ev-hero-inner{ padding-top:32px; padding-bottom:32px; }
.ev-hero-shade{
  background:linear-gradient(90deg, rgba(10,12,23,.85) 0%, rgba(10,12,23,.65) 42%, rgba(10,12,23,.08) 75%, rgba(10,12,23,0) 100%);
}

/* mobile */
@media (max-width:767px){
  .ev-hero-inner{ padding-top:24px; padding-bottom:72px; }
  .ev-hero-shade{
    background:linear-gradient(180deg, rgba(10,12,23,.5) 0%, rgba(10,12,23,.78) 55%, rgba(10,12,23,.92) 100%);
  }
  .ev-textglow{ padding:20px 0; margin:-20px 0; }

  .ev-hero .ev-h.ev-h-xl{ font-size:clamp(31px,9.6vw,44px); }
  .ev-hero .ev-chbig .ev-h{ font-size:clamp(29px,9.2vw,42px); }
  .ev-hero .ev-h{ margin-top:12px; }
  .ev-hero .ev-eyebrow,
  .ev-hero .ev-chbig .ev-eyebrow{ font-size:10.5px; letter-spacing:.2em; }
  .ev-hero .ev-body,
  .ev-hero .ev-chbig .ev-body{ font-size:13.5px; line-height:1.5; margin-top:14px; max-width:100%; }
  .ev-hero .ev-meta-value{ font-size:15px; }

  .ev-hero .ev-btn-gold{ width:auto; flex:0 0 auto; min-width:220px; height:44px; padding:0 24px; }
}

/* chhoti height wale phones: chapter 1 ka paragraph hata do taaki kuch kate nahi */
@media (max-width:767px) and (max-height:700px){
  .ev-hero .ev-ch1 .ev-body{ display:none; }
}

/* landscape phone / kam height wali screen */
@media (max-height:520px){
  .ev-hero{ --hu:clamp(4px, 1.5vh, 7px); }
  .ev-hero .ev-h.ev-h-xl,
  .ev-hero .ev-chbig .ev-h{ font-size:calc(var(--hu)*6.3); }
  .ev-hero .ev-body{ font-size:12px; }
}

/* ===== BADI SCREENS (1800px+): text bada + elements ke beech gap bada ===== */
@media (min-width:1800px){
  .ev-hero{ --hu:clamp(20px, min(1.5vw, 2vh), 60px); }

  /* text ko thoda aur left se shuru karo taaki page pe achhe se failey */
  .ev-hero-pad{
    padding-left:max(96px, calc((100vw - 1600px) / 2 + 48px));
    padding-right:96px;
  }

  /* eyebrow, heading, paragraph, meta, buttons, note — sabke beech ka gap */
  .ev-hero .ev-textglow > *:not(.absolute) + *:not(.absolute){
    margin-top:calc(var(--hu) * 1.3) !important;
  }
  /* When / Where ke beech ka gap */
  .ev-hero .ev-textglow .grid{
    column-gap:calc(var(--hu) * 4);
    row-gap:calc(var(--hu) * 1.3);
  }
  /* buttons ke beech ka gap */
  .ev-hero .ev-textglow .flex{ gap:calc(var(--hu) * 1); }
}

/* =====================================================================
   ALL SECTIONS RESPONSIVE (3 -> 11)
   --ev-k = scale factor, --ev-max = content ki max width
   ===================================================================== */
.ev-root{ --ev-k:1; --ev-max:1440px; }
@media (min-width:1600px){ .ev-root{ --ev-k:1.1; --ev-max:1584px; } }
@media (min-width:1920px){ .ev-root{ --ev-k:1.3; --ev-max:1872px; } }
@media (min-width:2200px){ .ev-root{ --ev-k:1.5; --ev-max:2160px; } }
@media (min-width:2560px){ .ev-root{ --ev-k:1.75; --ev-max:2520px; } }

/* tablet: experience image ab poori width nahi lega */
@media (max-width:1023px){
  .ev-exp-img{ max-width:min(100%,520px); margin-left:auto; margin-right:auto; }
}

/* chhote phones (320 - 420px) */
@media (max-width:420px){
  .ev-room-h,.ev-right-h{ font-size:38px; }
  .ev-exp-h,.ev-setting-h{ font-size:40px; }
  .ev-ideas-h{ font-size:36px; }
  .ev-invite-h{ font-size:42px; }
  .ev-numeral{ font-size:44px; }
}

/* badi screens: sab kuch scale hota hai (1440 ka design bada hokar) */
@media (min-width:1600px){
  .ev-pad{ --ev-pad:calc(96px * var(--ev-k)); }
  .ev-sec{ padding-top:calc(96px * var(--ev-k)); padding-bottom:calc(96px * var(--ev-k)); }

  /* marquee */
  .ev-marquee{ padding:calc(22px * var(--ev-k)) 0; }
  .ev-marquee-item{ font-size:calc(32px * var(--ev-k)); gap:calc(36px * var(--ev-k)); padding-right:calc(36px * var(--ev-k)); }

  /* section 3 + common */
  .ev-room-eyebrow{ font-size:calc(13px * var(--ev-k)); gap:calc(14px * var(--ev-k)); }
  .ev-room-eyebrow::before{ width:calc(40px * var(--ev-k)); }
  .ev-room-h{ font-size:calc(88px * var(--ev-k)); }
  .ev-room-p1{ font-size:calc(18px * var(--ev-k)); max-width:calc(32rem * var(--ev-k)) !important; }
  .ev-room-p2{ font-size:calc(15px * var(--ev-k)); max-width:calc(32rem * var(--ev-k)) !important; }
  .ev-room-btn{ height:calc(56px * var(--ev-k)); padding:0 calc(26px * var(--ev-k)); font-size:calc(14px * var(--ev-k)); }

  /* section 4 */
  .ev-why-grid{ gap:calc(40px * var(--ev-k)); }
  .ev-why-item{ padding-top:calc(36px * var(--ev-k)); }
  .ev-numeral{ font-size:calc(68px * var(--ev-k)); }
  .ev-why-label{ font-size:calc(13px * var(--ev-k)); }
  .ev-why-text{ font-size:calc(16px * var(--ev-k)); }

  /* section 5 */
  .ev-scene-stick.ev-right .ev-right-body{ max-width:none; width:100%; padding-left:3vw; padding-right:3vw; }
  .ev-right-h{ font-size:calc(148px * var(--ev-k)); }
  .ev-right-sub{ font-size:calc(34px * var(--ev-k)); }
  .ev-right-eyebrow{ font-size:calc(13px * var(--ev-k)); }

  /* section 6 */
  .ev-people-grid{ gap:calc(40px * var(--ev-k)); }
  .ev-pp-h{ font-size:calc(94px * var(--ev-k)); }
  .ev-pp-sub{ font-size:calc(18px * var(--ev-k)); max-width:calc(34rem * var(--ev-k)); }
  .ev-person-initials{ font-size:calc(108px * var(--ev-k)); }
  .ev-person-co{ font-size:calc(8px * var(--ev-k)); }
  .ev-person-name{ font-size:calc(30px * var(--ev-k)); }
  .ev-person-role{ font-size:calc(11px * var(--ev-k)); }
  .ev-person-link{ font-size:calc(14px * var(--ev-k)); }

  /* section 7 */
  .ev-ev-h{ font-size:calc(100.8px * var(--ev-k)); }
  .ev-ev-sub{ font-size:calc(18.72px * var(--ev-k)); }
  .ev-tl{ gap:calc(40px * var(--ev-k)); }
  .ev-tl-item{ gap:calc(6px * var(--ev-k)) calc(24px * var(--ev-k)); grid-template-columns:calc(210px * var(--ev-k)) 1fr; padding-bottom:calc(40px * var(--ev-k)); }
  .ev-tl-time{ font-size:calc(13px * var(--ev-k)); padding-top:calc(10px * var(--ev-k)); }
  .ev-tl-title{ font-size:calc(40.32px * var(--ev-k)); }
  .ev-tl-text{ font-size:calc(16px * var(--ev-k)); max-width:calc(34rem * var(--ev-k)); margin-top:calc(8px * var(--ev-k)); }
  .ev-tl-tip{ transform:scale(var(--ev-k)); }

  /* section 8 */
  .ev-exp-h{ font-size:calc(100px * var(--ev-k)); }
  .ev-exp-lead{ font-size:calc(20px * var(--ev-k)); max-width:calc(34rem * var(--ev-k)); }
  .ev-exp-cols{ max-width:calc(34rem * var(--ev-k)); gap:calc(24px * var(--ev-k)); }
  .ev-exp-label{ font-size:calc(11px * var(--ev-k)); }
  .ev-exp-text{ font-size:calc(14px * var(--ev-k)); }

  /* section 9 */
  .ev-setting-card{ width:calc(618px * var(--ev-k)); padding:calc(48px * var(--ev-k)); }
  .ev-setting-h{ font-size:calc(88px * var(--ev-k)); }
  .ev-setting-sub{ font-size:calc(40px * var(--ev-k)); }
  .ev-setting-p{ font-size:calc(16px * var(--ev-k)); max-width:calc(28rem * var(--ev-k)) !important; }
  .ev-setting-addr{ font-size:calc(13px * var(--ev-k)); max-width:calc(28rem * var(--ev-k)) !important; }
  .ev-setting-btn{ height:calc(60px * var(--ev-k)); padding:0 calc(30px * var(--ev-k)); font-size:calc(14px * var(--ev-k)); }
  .ev-setting-tag{ font-size:calc(40px * var(--ev-k)); }

  /* section 10 */
  .ev-ideas-h{ font-size:calc(80px * var(--ev-k)); }
  .ev-ideas-p{ font-size:calc(17px * var(--ev-k)); }
  .ev-hint{ font-size:calc(10px * var(--ev-k)); }
  .ev-track{ gap:calc(28px * var(--ev-k)); }
  .ev-card{ width:calc(340px * var(--ev-k)); }
  .ev-card-body{ left:calc(20px * var(--ev-k)); right:calc(20px * var(--ev-k)); bottom:calc(20px * var(--ev-k)); }
  .ev-card-tag{ font-size:calc(10px * var(--ev-k)); }
  .ev-card-title{ font-size:calc(22px * var(--ev-k)); }

  /* section 11 */
  .ev-invite-h{ font-size:calc(132px * var(--ev-k)); }
  .ev-invite-date{ font-size:calc(56px * var(--ev-k)); }
  .ev-invite-p{ font-size:calc(18px * var(--ev-k)); max-width:calc(34rem * var(--ev-k)); }
  .ev-invite-q{ font-size:calc(26px * var(--ev-k)); }
  .ev-invite-btn{ width:calc(346px * var(--ev-k)); height:calc(60px * var(--ev-k)); font-size:calc(14px * var(--ev-k)); }
  .ev-invite-meta{ font-size:calc(11px * var(--ev-k)); }
}

/* grids jinke column width fixed px me hain (sirf 1024+ par) */
@media (min-width:1600px) and (min-width:1024px){
  .ev-exp-grid{ grid-template-columns:minmax(0,1fr) minmax(0,calc(560px * var(--ev-k))); }
}
 

/* ===== SECTION 10.5: SPONSOR ===== */
.ev-sponsor{
  position:relative; overflow:hidden;
  padding-top:clamp(72px,8vw,128px); padding-bottom:clamp(72px,8vw,128px);
  background:
    radial-gradient(ellipse 60% 50% at 30% 45%, rgba(40,44,92,.55) 0%, rgba(40,44,92,0) 70%),
    var(--ev-navy-900);
}
.ev-sp-grid{ display:grid; grid-template-columns:minmax(0,1fr); gap:28px; }
.ev-sp-head{ order:1; }
.ev-sp-tagwrap{ order:2; }
.ev-sp-cards{ order:3; }
.ev-sp-formwrap{ order:4; display:flex; }
@media (min-width:1024px){
  .ev-sp-grid{
    grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);
    grid-template-rows:auto 1fr;
    column-gap:clamp(48px,5.5vw,96px); row-gap:40px;
  }
  .ev-sp-head{ grid-column:1; grid-row:1; }
  .ev-sp-tagwrap{ grid-column:2; grid-row:1; align-self:end; text-align:right; }
  .ev-sp-cards{ grid-column:1; grid-row:2; }
  .ev-sp-formwrap{ grid-column:2; grid-row:2; }
}

.ev-sp-eyebrow{
  display:flex; align-items:center; gap:18px;
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:12px;
  letter-spacing:.3em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-sp-line{ display:block; width:40px; height:1px; background:var(--ev-gold-500); }
.ev-sp-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(44px,6.2vw,92px); line-height:.95; letter-spacing:-.02em; color:var(--ev-ivory);
}
.ev-sp-h > span{ display:block; }
.ev-sp-lead{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:clamp(14px,1.25vw,18px);
  line-height:1.65; color:var(--ev-ivory-muted); max-width:34rem;
}
.ev-sp-tag{ font-size:clamp(24px,2.6vw,38px); transform:rotate(-3deg); transform-origin:right center; display:inline-block; }
@media (max-width:1023px){ .ev-sp-tag{ transform-origin:left center; } }

/* plan cards */
.ev-sp-list{ display:flex; flex-direction:column; gap:14px; height:100%; }
.ev-sp-card{
  flex:1; display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:20px;
  width:100%; text-align:left; cursor:pointer; color:inherit;
  padding:20px 28px; border-radius:6px;
  background:rgba(10,12,23,.55); border:1px solid rgba(217,169,63,.4);
  transition:transform .3s ease, border-color .3s ease, background .3s ease, box-shadow .3s ease;
}
.ev-sp-card:hover{ transform:translateY(-2px); border-color:rgba(246,221,142,.8); }
.ev-sp-card:focus-visible{ outline:2px solid var(--ev-gold-300); outline-offset:3px; }
.ev-sp-card.is-on{
  background:linear-gradient(180deg, rgba(217,169,63,.28), rgba(217,169,63,.14));
  border-color:var(--ev-gold-300); box-shadow:0 18px 44px -22px rgba(217,169,63,.7);
}
.ev-sp-radio{
  width:20px; height:20px; border-radius:50%; border:1.5px solid var(--ev-ivory-muted);
  display:grid; place-items:center; flex:none; transition:border-color .3s ease;
}
.ev-sp-radio::after{
  content:""; width:10px; height:10px; border-radius:50%; background:var(--ev-gold-300);
  transform:scale(0); transition:transform .25s ease;
}
.ev-sp-card.is-on .ev-sp-radio{ border-color:var(--ev-gold-300); }
.ev-sp-card.is-on .ev-sp-radio::after{ transform:scale(1); }
.ev-sp-card-main{ display:flex; flex-direction:column; gap:6px; min-width:0; }
.ev-sp-card-title{
  display:flex; align-items:center; gap:12px; flex-wrap:wrap;
  font-family:'Instrument Serif',serif; font-style:italic; font-size:clamp(22px,2vw,28px); line-height:1.05; color:var(--ev-ivory);
}
.ev-sp-badge{
  font-style:normal; font-family:'Montserrat',sans-serif; font-weight:700; font-size:9px; letter-spacing:.2em;
  text-transform:uppercase; color:var(--ev-navy); padding:4px 10px; border-radius:999px;
  background:linear-gradient(90deg,#9C7222 0%,#F6DD8E 55%,#D9A93F 100%);
}
.ev-sp-card-desc{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:clamp(12px,.95vw,14px);
  line-height:1.5; color:var(--ev-ivory-muted); max-width:26rem;
}
.ev-sp-card-price{
  font-family:'Instrument Serif',serif; font-style:italic; font-size:clamp(28px,2.7vw,40px);
  line-height:1; color:var(--ev-gold-500); white-space:nowrap;
}
.ev-sp-card.is-on .ev-sp-card-price{ color:var(--ev-gold-300); }
@media (max-width:520px){
  .ev-sp-card{ padding:16px 16px; gap:14px; }
}

/* form */
.ev-sp-form{
  flex:1; display:flex; flex-direction:column;
  padding:clamp(24px,3vw,44px); border-radius:6px;
  background:var(--ev-navy-950); border:1px solid rgba(217,169,63,.55);
}
.ev-sp-form-h{
  font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(28px,2.7vw,38px); line-height:1; color:var(--ev-ivory);
}
.ev-sp-form-p{
  font-family:'Montserrat',sans-serif; font-weight:500; font-size:13px; line-height:1.6;
  color:var(--ev-ivory-muted); margin-top:14px; margin-bottom:8px;
}
.ev-sp-label{
  display:block; margin-top:18px; margin-bottom:8px;
  font-family:'Montserrat',sans-serif; font-weight:600; font-size:10px;
  letter-spacing:.26em; text-transform:uppercase; color:var(--ev-gold-500);
}
.ev-sp-input{
  width:100%; height:56px; padding:0 18px; border-radius:4px;
  background:var(--ev-navy-950); border:1px solid rgba(217,169,63,.45);
  color:var(--ev-ivory); font-family:'Montserrat',sans-serif; font-weight:500; font-size:14px;
  transition:border-color .25s ease, box-shadow .25s ease;
}
.ev-sp-input::placeholder{ color:rgba(185,179,166,.5); }
.ev-sp-input:focus{ outline:none; border-color:var(--ev-gold-300); box-shadow:0 0 0 3px rgba(246,221,142,.14); }
.ev-sp-select{
  appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:44px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23F3ECDD'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 18px center;
  margin-bottom:28px;
}
.ev-sp-select option{ background:#0A0C17; color:#F3ECDD; }
.ev-sp-error{ margin-top:14px; font-family:'Montserrat',sans-serif; font-weight:600; font-size:12px; color:#F2A39B; }
.ev-sp-submit{
  margin-top:auto; /* form ko cards ki height tak stretch karta hai */
  min-height:62px;
  display:flex; align-items:center; justify-content:space-between;
  width:100%; height:62px; padding:0 28px; border-radius:4px; cursor:pointer;
  background:linear-gradient(90deg,#9C7222 0%,#F6DD8E 55%,#D9A93F 100%);
  color:var(--ev-navy-950); font-family:'Montserrat',sans-serif; font-weight:700; font-size:13px;
  letter-spacing:.2em; text-transform:uppercase;
  box-shadow:0 14px 36px -14px rgba(217,169,63,.75);
  transition:transform .3s ease, filter .3s ease;
}

.ev-sp-submit:hover{ transform:translateY(-2px); filter:brightness(1.06); }
.ev-sp-submit:disabled{ opacity:.6; cursor:wait; transform:none; }
.ev-sp-fine{
  margin-top:16px; font-family:'Montserrat',sans-serif; font-weight:500; font-size:11px;
  line-height:1.6; color:var(--ev-ivory-muted);
}

/* success popup */
.ev-sp-overlay{
  position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:20px;
  background:rgba(5,7,14,.74); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
}
.ev-sp-pop{
  position:relative; width:100%; max-width:540px; padding:clamp(28px,4vw,44px); border-radius:8px;
  background:var(--ev-navy-950); border:1px solid var(--ev-gold-500);
  box-shadow:0 40px 90px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(246,221,142,.08);
}
.ev-sp-close{
  position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%;
  display:grid; place-items:center; cursor:pointer; color:var(--ev-ivory-muted);
  border:1px solid rgba(217,169,63,.35); transition:color .25s ease, border-color .25s ease;
}
.ev-sp-close:hover{ color:var(--ev-ivory); border-color:var(--ev-gold-300); }
.ev-sp-check{
  display:grid; place-items:center; width:56px; height:56px; border-radius:50%;
  background:linear-gradient(135deg,#9C7222 0%,#F6DD8E 55%,#D9A93F 100%); color:var(--ev-navy-950);
}
.ev-sp-pop-h{
  margin-top:24px; font-family:'Instrument Serif',serif; font-style:italic; font-weight:400;
  font-size:clamp(34px,4.2vw,46px); line-height:1; color:var(--ev-ivory);
}
.ev-sp-pop-p{
  margin-top:16px; font-family:'Montserrat',sans-serif; font-weight:500; font-size:16px;
  line-height:1.7; color:var(--ev-ivory-muted);
}
.ev-sp-pop-next{
  margin-top:18px; font-family:'Montserrat',sans-serif; font-weight:500; font-size:14px;
  line-height:1.6; color:var(--ev-gold-300);
}
@media (prefers-reduced-motion:reduce){
  .ev-sp-card,.ev-sp-submit,.ev-sp-radio::after{ transition:none !important; }
}
  
/* ===== SPONSOR: compact sizes (purani values ko override karta hai) ===== */
.ev-sponsor{ padding-top:clamp(56px,5.5vw,88px); padding-bottom:clamp(56px,5.5vw,88px); }
.ev-sp-grid{ gap:20px; }
@media (min-width:1024px){
  .ev-sp-grid{ column-gap:clamp(32px,4vw,64px); row-gap:28px; }
}
.ev-sp-eyebrow{ font-size:11px; gap:14px; }
.ev-sp-line{ width:32px; }
.ev-sp-h{ font-size:clamp(34px,4.4vw,64px); }
.ev-sp-lead{ font-size:clamp(13px,1vw,15px); max-width:30rem; }
.ev-sp-tag{ font-size:clamp(20px,1.9vw,28px); }

/* cards */
.ev-sp-list{ gap:10px; }
.ev-sp-card{ padding:14px 20px; gap:16px; }
.ev-sp-radio{ width:16px; height:16px; }
.ev-sp-radio::after{ width:8px; height:8px; }
.ev-sp-card-main{ gap:4px; }
.ev-sp-card-title{ font-size:clamp(18px,1.5vw,22px); }
.ev-sp-badge{ font-size:8px; padding:3px 8px; }
.ev-sp-card-desc{ font-size:clamp(11px,.8vw,12.5px); line-height:1.45; }
.ev-sp-card-price{ font-size:clamp(22px,2vw,30px); }
@media (max-width:520px){
  .ev-sp-card{ padding:12px 12px; gap:12px; }
}

/* form */
.ev-sp-form{ padding:clamp(20px,2.2vw,32px); }
.ev-sp-form-h{ font-size:clamp(24px,2vw,30px); }
.ev-sp-form-p{ font-size:12px; margin-top:10px; margin-bottom:4px; }
.ev-sp-label{ margin-top:14px; margin-bottom:6px; font-size:9px; }
.ev-sp-input{ height:46px; padding:0 14px; font-size:13px; }
.ev-sp-select{ padding-right:38px; margin-bottom:20px; background-position:right 14px center; }
.ev-sp-submit{
  justify-content:center; gap:12px;
  height:48px; min-height:48px; padding:0 24px; border-radius:999px;
  background:linear-gradient(90deg,#9C7222 0%,#F6DD8E 35%,#D9A93F 60%,#F6DD8E 100%);
  font-size:11px; font-weight:700; letter-spacing:.18em; white-space:nowrap;
  box-shadow:0 12px 32px -12px rgba(217,169,63,.65);
}
.ev-sp-submit:hover{ box-shadow:0 16px 38px -10px rgba(217,169,63,.8); }
.ev-sp-fine{ font-size:10px; margin-top:12px; }

/* popup */
.ev-sp-pop{ max-width:440px; padding:clamp(22px,3vw,32px); }
.ev-sp-check{ width:46px; height:46px; }
.ev-sp-pop-h{ margin-top:18px; font-size:clamp(28px,3.4vw,36px); }
.ev-sp-pop-p{ margin-top:12px; font-size:14px; line-height:1.65; }
.ev-sp-pop-next{ margin-top:14px; font-size:13px; }

/* ===== SECTION 5 (The right room): sabhi screens ===== */

/* chhota laptop: heading ek hi line mein hoti hai, isliye thoda chhota taaki kate nahi */
@media (min-width:1024px) and (max-width:1279px){
  .ev-right-h{ font-size:8.4vw; }
}

/* tablet */
@media (min-width:600px) and (max-width:1023px){
  .ev-scene-stick.ev-right{ padding-top:88px; padding-bottom:88px; }
}

/* phone */
@media (max-width:599px){
  .ev-scene-stick.ev-right{ padding-top:64px; padding-bottom:64px; }
  .ev-right-sub{ flex-direction:column; gap:6px; font-size:clamp(20px,6vw,26px); }
  .ev-right-star{ display:none; }
  .ev-right-eyebrow{ font-size:11px; letter-spacing:.2em; padding:0 8px; }
}

/* badi screens (1600px+): button bhi baaki section ki tarah scale ho */
@media (min-width:1600px){
  .ev-right .ev-btn-gold{
    width:calc(230px * var(--ev-k)); height:calc(48px * var(--ev-k));
    font-size:calc(11px * var(--ev-k)); gap:calc(12px * var(--ev-k));
  }
}
`;

/* ---------------- SCENE + REVEAL HELPERS ------------------ */

/** Normal section (pin nahi). bg = background layer (image/shade). */
function Scene({
  id,
  className = "",
  bg,
  children,
}: {
  id?: string;
  className?: string;
  bg?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ev-scene">
      <div className={`ev-scene-stick ${className}`}>
        {bg}
        <div className="ev-scene-body">{children}</div>
      </div>
    </section>
  );
}

/** Section screen me aate hi: blur + niche se upar + fade-in. Ek baar chalta hai, phir tika rehta hai.
 *  d = stagger delay (0 se 0.1). y = kitna neeche se aaye. */
function Rise({
  children,
  className,
  d = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  d?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: y * 3, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: d * 6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Evening timeline ke liye scroll-scrubbed reveal: aate waqt blur + rise. */
function Reveal({
  children,
  className,
  tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tag?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 62%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["8vh", "0vh"]);
  const blur = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const Comp = tag === "li" ? motion.li : motion.div;
  return (
    <Comp
      ref={ref as never}
      style={reduce ? undefined : { opacity, y, filter }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------ HELPERS ------------------------------------ */
function ReserveButton({ className = "" }: { className?: string }) {
  return (
<a href={LUMA_LINK} target="_blank" rel="noopener noreferrer" className={`ev-btn-gold ${className}`}>
      Reserve Your Place <ArrowRight size={16} />
    </a>
  );
}

/** Ek chapter ka text block — scroll ke saath fade + slide + blur. */
function ChapterText({ i, progress, children }: { i: number; progress: MotionValue<number>; children: ReactNode }) {
  const reduce = useReducedMotion();
  const r = textRange(i);
  const opacity = useTransform(progress, r.input, r.op);
  const y = useTransform(progress, r.input, reduce ? r.y.map(() => "0vh") : r.y);
  const blur = useTransform(progress, r.input, reduce ? r.blur.map(() => 0) : r.blur);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <motion.div
      style={{ opacity, y, filter, pointerEvents }}
      className={`absolute inset-0 flex items-start md:items-center ${i > 0 ? "ev-chbig" : "ev-ch1"}`}
    >
      <div className="section ev-hero-inner my-auto w-full md:my-0">
        <div className="ev-textglow">{children}</div>
      </div>
    </motion.div>
  );
}

/** Hero ki single tower image — scroll ke saath drone shot: base se top tak, phir zoom-out full view. */
function TowerLayer({ src, progress }: { src: string; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const keys = useRef(towerKeys(2.6, 0.72));

  useEffect(() => {
    const set = () => {
      const a = window.innerWidth / window.innerHeight;
      // wide screen: bada zoom | square/tall screen: kam zoom taaki tower text par na chadhe
      const [s, tx] = a >= 1.5 ? [2.6, 0.72] : a >= 0.9 ? [1.8, 0.76] : [2.1, 0.6];
      keys.current = towerKeys(s, tx);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const scale = useTransform(progress, (p) => (reduce ? 1 : transform(p, KEY_P, keys.current.S)));
  const x = useTransform(progress, (p) => (reduce ? "0%" : `${transform(p, KEY_P, keys.current.X)}%`));
  const y = useTransform(progress, (p) => (reduce ? "0%" : `${transform(p, KEY_P, keys.current.Y)}%`));

  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      style={{ scale, x, y, objectPosition: "66% 50%" }}
      className="absolute inset-0 h-full w-full select-none object-cover will-change-transform"
    />
  );
}

/** Aakhri image — hero ke end me zoom-out hoke khulti hai (video jaisa finale). */
function FinaleLayer({ src, progress }: { src: string; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, [0.86, 0.98], [0, 1]);
  const scale = useTransform(progress, [0.86, 1], reduce ? [1, 1] : [1.3, 1]);
  const y = useTransform(progress, [0.86, 1], reduce ? ["0%", "0%"] : ["-8%", "0%"]);

  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      style={{ opacity, scale, y }}
      className="absolute inset-0 h-full w-full select-none object-cover will-change-transform"
    />
  );
}

/* ------------------------------ HERO --------------------------------------- */
function useHeaderH() {
  const [h, setH] = useState(72);
  useEffect(() => {
    const m = () => {
      const el = document.querySelector("header");
      const v = el ? Math.round(el.getBoundingClientRect().height) : 72;
      setH(v || 72);
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  return h;
}
function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 72px", "end end"] });

  return (
    <section ref={ref} id="arrival" style={{ height: SCROLL_HEIGHT }} className="relative">
      <div className="ev-hero sticky top-[72px] h-[calc(100svh-72px)] overflow-hidden bg-[#0A0E1F]">
        {/* background: ek hi tower image (drone shot) */}
        <TowerLayer src={IMG.heroTower} progress={scrollYProgress} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,12,23,0.85) 0%, rgba(10,12,23,0.65) 42%, rgba(10,12,23,0.08) 75%, rgba(10,12,23,0) 100%)",
          }}
        />
        {IMG.skyline && <FinaleLayer src={IMG.skyline} progress={scrollYProgress} />}

        {/* Chapter 1 — Arrival */}
        <ChapterText i={0} progress={scrollYProgress}>
          <p className="ev-eyebrow">{chapters[0].eyebrow}</p>
          <h1 className="ev-h ev-h-xl mt-5">
            <span>{chapters[0].lead}</span>
            <span className="ev-h-gold">{chapters[0].accent}</span>
          </h1>
          <p className="ev-body mt-6">{chapters[0].body}</p>

          <div className="mt-7 grid gap-x-12 gap-y-5 sm:grid-cols-[auto_auto] sm:justify-start">
            <div>
              <p className="ev-meta-label">When</p>
              <p className="ev-meta-value mt-1">{EVENT.date}</p>
              <p className="ev-meta-sub hidden sm:block">{EVENT.time}</p>
            </div>
            <div>
              <p className="ev-meta-label">Where</p>
              <p className="ev-meta-value mt-1">{EVENT.venue}</p>
              <p className="ev-meta-sub hidden sm:block">{EVENT.address}</p>
            </div>
          </div>

           <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
            <ReserveButton />
          </div>
          <p className="ev-note mt-5 hidden sm:block">{EVENT.note}</p>

          {/* handwritten tag — desktop right side (design wale position pe) */}
          <p className="ev-hand pointer-events-none absolute bottom-[14%] right-[clamp(24px,16vw,260px)] hidden -rotate-3 lg:block">
            {EVENT.handwritten}
          </p>
        </ChapterText>

        {/* Chapter 2 — The Room */}
        <ChapterText i={1} progress={scrollYProgress}>
          <p className="ev-eyebrow">{chapters[1].eyebrow}</p>
          <h2 className="ev-h mt-5">
            <span>{chapters[1].lead}</span>
            <span className="ev-h-gold">{chapters[1].accent}</span>
          </h2>
          <p className="ev-body mt-6">{chapters[1].body}</p>
        </ChapterText>

        {/* Chapter 3 — The Idea */}
        <ChapterText i={2} progress={scrollYProgress}>
          <p className="ev-eyebrow">{chapters[2].eyebrow}</p>
          <h2 className="ev-h mt-5">
            <span>{chapters[2].lead}</span>
            <span className="ev-h-gold">{chapters[2].accent}</span>
          </h2>
          <p className="ev-body mt-6">{chapters[2].body}</p>
        </ChapterText>

        {/* Chapter 4 — Invitation */}
        <ChapterText i={3} progress={scrollYProgress}>
          <p className="ev-eyebrow">{chapters[3].eyebrow}</p>
          <h2 className="ev-h mt-5">
            <span>{chapters[3].lead}</span>
            <span className="ev-h-gold">{chapters[3].accent}</span>
          </h2>
          <p className="ev-body mt-6">{chapters[3].body}</p>
          <p className="ev-hand mt-5 -rotate-2">{EVENT.handwritten}</p>
          <div className="mt-6">
            <ReserveButton />
          </div>
        </ChapterText>

        {/* rotating badge — bottom right */}
        <motion.img
          src={IMG.badge}
          alt=""
          aria-hidden
          draggable={false}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          className="pointer-events-none absolute bottom-6 right-5 z-20 h-[clamp(84px,calc(var(--hu)*8.5),200px)] w-[clamp(84px,calc(var(--hu)*8.5),200px)] select-none sm:bottom-9 sm:right-9"
        />
      </div>
    </section>
  );
}

/* ---------------------------- MARQUEE -------------------------------------- */
const MARQUEE = ["Real people", "Real conversations", "Real opportunities", "Houston real estate", "One room"];

function Marquee() {
  return (
    <section className="ev-marquee" aria-label="BrickShare Capital">
      <div className="ev-marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="ev-marquee-item" aria-hidden={k === 1}>
            {MARQUEE.map((t) => (
              <span key={t} style={{ display: "contents" }}>
                <span className="ev-marquee-text">{t}</span>
                <span className="ev-marquee-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------ SECTION 3: A ROOM FULL ---------------------------- */
function Room() {
  const reduce = useReducedMotion();
  const archRef = useRef<HTMLDivElement>(null);
  // arch thoda andar aaye tab animation chalu (sirf ek baar)
  const inView = useInView(archRef, { once: true, amount: 0.25, margin: "0px 0px -8% 0px" });
  const textRef = useRef<HTMLDivElement>(null);
  const textIn = useInView(textRef, { once: true, amount: 0.3 });

  // scroll ke saath image arch ke andar dheere upar-neeche hoti hai (parallax)
  const { scrollYProgress } = useScroll({ target: archRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-4%", "4%"]);

  return (
    <Scene id="more-than-an-event" className="ev-room">
      <div className="section grid items-center gap-10 py-[clamp(48px,5vw,calc(72px*var(--ev-k)))] lg:grid-cols-[min(calc(450px*var(--ev-k)),34vw)_1fr] lg:gap-x-[clamp(40px,6vw,calc(96px*var(--ev-k)))]">
        <Rise y={18} className="mx-auto w-full max-w-[calc(450px*var(--ev-k))] lg:mx-0">
          <div ref={archRef} data-in={inView} className="ev-arch relative aspect-[540/760] w-full">
            <div aria-hidden className="ev-arch-shape ev-arch-box" />
            <div className="ev-arch-shape ev-arch-img">
              <div className="ev-arch-zoom">
                <motion.img
                  src={IMG.roomArch}
                  alt="Two hands reaching toward a glowing golden tower"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{ y: imgY, scale: 1.1 }}
                  className="h-full w-full select-none object-cover will-change-transform"
                />
              </div>
              <div aria-hidden className="ev-arch-glow" />
            </div>
          </div>
        </Rise>

        <div ref={textRef} data-in={textIn} className="ev-room-col">
          <Rise d={0.03}>
            <p className="ev-room-eyebrow">More than an event</p>
          </Rise>
          <h2 className="ev-room-h ev-room-lines mt-6">
            <span><i>A room full of</i></span>
            <span><i>possibilities.</i></span>
          </h2>
          <Rise d={0.07}>
            <p className="ev-room-p1 mt-7 max-w-[30rem]">
              Some of the best opportunities don't begin in a boardroom. They begin with a conversation, a shared idea, or the right person across the room.
            </p>
            <p className="ev-room-p2 mt-6 max-w-[30rem]">
              Join BrickShare Capital for an intimate evening bringing together investors, entrepreneurs, real estate professionals, and forward-thinking minds shaping what comes next.
            </p>
          </Rise>
          <Rise d={0.09}>
            <a href={LUMA_LINK} target="_blank" rel="noopener noreferrer" className="ev-room-btn mt-7">
              Reserve Your Place <ArrowRight size={14} />
            </a>
          </Rise>
        </div>
      </div>
    </Scene>
  );
}

/* ------------------------ SECTION 4: WHY ATTEND ----------------------------- */
function WhyAttend() {
  return (
    <Scene id="the-people" className="ev-pad ev-sec ev-bg-800">
     <div className="section">
        <Rise>
          <p className="ev-room-eyebrow">Why attend</p>
        </Rise>
        <Rise d={0.02}>
          <h2 className="ev-room-h mt-6 max-w-[16ch]">Four reasons to be in the room.</h2>
        </Rise>

        <div className="ev-why-grid mt-[clamp(40px,5vw,72px)]">
          {REASONS.map((r, i) => (
            <Rise key={r.n} d={0.05 + i * 0.03} y={18}>
              <div className="ev-why-item">
                <span className="ev-numeral">{r.n}</span>
                <h3 className="ev-why-label mt-5">{r.title}</h3>
                <p className="ev-why-text mt-4">{r.text}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/* --------------------- SECTION 5: THE RIGHT ROOM ---------------------------- */
function RightRoom() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(bodyRef, { once: true, amount: 0.35 });

  return (
    <Scene
      className="ev-pad ev-right py-24 lg:py-0"
      bg={
        IMG.rightRoomMark ? (
          <img
            src={IMG.rightRoomMark}
            alt=""
            aria-hidden
            draggable={false}
            data-in={inView}
            className="ev-right-mark"
          />
        ) : null
      }
    >
      <div ref={bodyRef} data-in={inView} className="section ev-right-body relative">
        <h2 className="ev-right-h">
          <span className="ev-rr-line"><i>The right room</i></span>
          <span className="ev-rr-line"><i className="ev-gold-text">can change everything.</i></span>
        </h2>

        <p className="ev-right-sub mt-[clamp(28px,3.4vw,48px)]">
          <span className="ev-rr-pop">One introduction.</span>
          <span className="ev-rr-pop ev-right-star" aria-hidden>✦</span>
          <span className="ev-rr-pop">One conversation.</span>
          <span className="ev-rr-pop ev-right-star" aria-hidden>✦</span>
          <span className="ev-rr-pop">One idea.</span>
        </p>

        <p className="ev-right-eyebrow mt-[clamp(24px,2.6vw,40px)]">You never know what comes next.</p>

        <Rise className="mt-[clamp(28px,3vw,44px)]" d={0.2}>
          <ReserveButton />
        </Rise>
      </div>
    </Scene>
  );
}

/* ----------------------- SECTION 6: THE PEOPLE ------------------------------ */
function PersonCard({ p, i }: { p: (typeof PEOPLE)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <article
      ref={ref}
      data-in={inView}
      className="ev-person"
      style={{ "--d": `${i * 0.12}s` } as CSSProperties}
    >
      <div className="ev-person-arch">
        {p.photo ? (
          <img src={p.photo} alt={p.name} loading="lazy" decoding="async" draggable={false} />
        ) : (
          <>
            <span className="ev-person-initials">{p.initials}</span>
            <span className="ev-person-co">BrickShare Capital</span>
          </>
        )}
      </div>
      <div className="ev-person-meta">
        <h3 className="ev-person-name mt-5">{p.name}</h3>
        <p className="ev-person-role mt-2">{p.role}</p>
        <a href={LUMA_LINK} target="_blank" rel="noopener noreferrer" className="ev-person-link mt-3">
          Meet them <ArrowRight size={12} />
        </a>
      </div>
    </article>
  );
}

function People() {
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, amount: 0.5 });

  return (
    <Scene className="ev-pad ev-sec ev-bg-800">
      <div className="section">
        <div ref={headRef} data-in={headIn} className="ev-pp-head">
          <Rise>
            <p className="ev-room-eyebrow">The people behind it</p>
          </Rise>
          <h2 className="ev-pp-h mt-6">
            <span><i>Four minds.</i></span>{" "}
            <span><i>One vision.</i></span>
          </h2>
          <Rise d={0.04}>
            <p className="ev-pp-sub mt-6">
              Meet the people shaping BrickShare Capital and hear the story behind what we are building.
            </p>
          </Rise>
        </div>

        <div className="ev-people-grid mt-[clamp(40px,6vw,88px)]">
          {PEOPLE.map((p, i) => (
            <PersonCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </Scene>
  );
}

/* ----------------------- SECTION 7: THE EVENING ----------------------------- */
/* ----------------------- SECTION 7: THE EVENING ----------------------------- */
function TimelineItem({ t }: { t: (typeof TIMELINE)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 58%"] });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["7vh", "0vh"]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [10, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  // dot tab bharta hai jab gold line us tak pahunchti hai
  const dot = useTransform(scrollYProgress, [0.75, 1], [0, 1]);
  const dotScale = useTransform(dot, [0, 1], [0.4, 1]);

  return (
    <li ref={ref} className="ev-tl-li">
      <motion.span
        aria-hidden
        className="ev-tl-dot"
        style={reduce ? { opacity: 1 } : { opacity: dot, scale: dotScale }}
      />
      <motion.div className="ev-tl-item" style={reduce ? undefined : { opacity, y, filter }}>
        <span className="ev-tl-time">{t.time}</span>
        <div>
          <h3 className="ev-tl-title">{t.title}</h3>
          <p className="ev-tl-text">{t.text}</p>
        </div>
      </motion.div>
    </li>
  );
}

function Evening() {
  const reduce = useReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, amount: 0.4 });

  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 58%", "end 58%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const tipTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const tipOpacity = useTransform(scrollYProgress, [0, 0.03], [0, 1]);

  return (
    <section id="the-evening" className="ev-pad ev-sec ev-bg-950">
      <div className="section ev-evening-grid">
        <div className="ev-evening-stick">
          <div ref={headRef} data-in={headIn} className="ev-room-col ev-ev-head">
            <p className="ev-room-eyebrow">The evening</p>
            <h2 className="ev-ev-h mt-6">
              <span><i>An evening</i></span>
              <span><i>worth</i></span>
              <span><i>staying for.</i></span>
            </h2>
            <Rise d={0.05}>
              <p className="ev-ev-sub mt-6">Thursday, December 3, 2026. Six to nine.</p>
            </Rise>
          </div>
        </div>

        <ol ref={listRef} className="ev-tl">
          <div aria-hidden className="ev-tl-rail">
            <motion.span className="ev-tl-fill" style={{ scaleY: reduce ? 1 : fill }} />
            {!reduce && <motion.span className="ev-tl-tip" style={{ top: tipTop, opacity: tipOpacity }} />}
          </div>
          {TIMELINE.map((t) => (
            <TimelineItem key={t.title} t={t} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------- SECTION 8: THE EXPERIENCE --------------------------- */
function Experience() {
  const reduce = useReducedMotion();
  const colRef = useRef<HTMLDivElement>(null);
  const colIn = useInView(colRef, { once: true, amount: 0.35 });

  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaIn = useInView(mediaRef, { once: true, amount: 0.25, margin: "0px 0px -8% 0px" });

  // scroll ke saath image frame ke andar dheere upar-neeche hoti hai (parallax)
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-4%", "4%"]);

  const d = (s: number) => ({ "--xd": `${s}s` }) as CSSProperties;

  return (
    <Scene className="ev-pad ev-sec ev-bg-800">
      <div className="section ev-xp-grid">
        <div ref={colRef} data-in={colIn} className="ev-room-col ev-xp-col">
          <p className="ev-room-eyebrow">The experience</p>

          <h2 className="ev-xp-h mt-6">
            <span><i>Good food.</i></span>
            <span><i>Better</i></span>
            <span><i>conversations.</i></span>
          </h2>

          <p className="ev-xp-lead ev-xp-pop mt-8" style={d(0.5)}>
            Curated bites. Crafted drinks. A beautiful setting — and a room filled with interesting people.
          </p>

          <div className="ev-xp-cols mt-8">
            {EXPERIENCE.map((e, i) => (
              <div key={e.label} className="ev-xp-pop" style={d(0.7 + i * 0.12)}>
                <p className="ev-xp-label">{e.label}</p>
                <p className="ev-xp-text">{e.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-[clamp(40px,6vw,88px)]">
            <span className="ev-xp-hand">Come for the evening. Stay for the conversation.</span>
          </p>
        </div>

        <div ref={mediaRef} data-in={mediaIn} className="ev-xp-media">
          <div className="ev-xp-frame">
            <div className="ev-xp-zoom">
              <motion.img
                src={IMG.experience}
                alt="Champagne, canapés and figs on a marble table"
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ y: imgY, scale: 1.1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* ----------------------- SECTION 9: THE SETTING ----------------------------- */
function Setting() {
  const reduce = useReducedMotion();

  // image: chhoti box se scroll ke saath poori section tak badi hoti hai
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start end", "start 15%"] });

  const inset = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, 0]);
  const side = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${side}% ${inset}% ${side}% round ${radius}px)`;
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.6, 1]);

  // card + text tab aate hain jab image lagbhag poori khul jaye (ek baar)
  const [show, setShow] = useState(!!reduce);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.88) setShow(true);
  });

  const d = (s: number) => ({ "--xd": `${s}s` }) as CSSProperties;

  return (
    <Scene
      id="the-setting"
      className="ev-pad ev-setting"
      bg={
        <motion.div ref={mediaRef} className="ev-setting-media" aria-hidden style={{ clipPath }}>
          <div className="ev-setting-zoom">
            <motion.img
              src={IMG.setting}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ scale: imgScale }}
              className="ev-setting-bg"
            />
          </div>
          <div className="ev-setting-shade" />
        </motion.div>
      }
    >
      <div data-in={show} className="section ev-setting-wrap">
        <div className="ev-setting-card">
          <p className="ev-room-eyebrow">The setting</p>
          <h2 className="ev-setting-h mt-6">
            <span><i>The Cannon</i></span>
            <span><i>West Houston</i></span>
          </h2>
          <p className="ev-setting-sub ev-st-pop mt-6" style={d(0.5)}>Gallery Steps</p>
          <p className="ev-setting-p ev-st-pop mt-5 max-w-[28rem]" style={d(0.65)}>
            A modern Houston setting for people who think differently, build boldly, and connect meaningfully.
          </p>
          <p className="ev-setting-addr ev-st-pop mt-6 max-w-[28rem]" style={d(0.8)}>{VENUE_ADDRESS}</p>
          <div className="ev-st-pop mt-7" style={d(0.95)}>
           <a href={VENUE_LINK} target="_blank" rel="noopener noreferrer" className="ev-setting-btn">
              Explore the venue <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <p className="ev-setting-tag ev-st-pop" style={d(1.2)}>
          One room. Hundreds of possibilities.
        </p>
      </div>
    </Scene>
  );
}

/* ----------------------- SECTION 10: THE ROOM (drag) ------------------------ */
const ROOM_SPEED = 50; // px/second — cards kitni tez chalein

/** Cards hamesha chalte rehte hain (infinite loop). Mouse aaye to dheere ruk jaate hain. */
function DragRow({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const st = useRef({ pos: 0, speed: 0, hover: false, down: false, lastX: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const s = st.current;
    let raf = 0;
    let last = performance.now();
    let period = 0;

    const measure = () => {
            const sec = track.closest(".ev-scene")?.querySelector<HTMLElement>(".section");
      if (sec) {
        const left = sec.getBoundingClientRect().left + parseFloat(getComputedStyle(sec).paddingLeft || "0");
        track.style.setProperty("--ev-gutter", `${left}px`);
      }
      const cards = track.querySelectorAll<HTMLElement>(".ev-card");
      const n = cards.length / 3;
      if (!n) return;
      const p = cards[n].offsetLeft - cards[0].offsetLeft;
      if (p !== period) {
        s.pos = p + (period ? (s.pos - period) % p : 0);
        period = p;
      }
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const target = reduce || s.hover || s.down ? 0 : ROOM_SPEED;
      s.speed += (target - s.speed) * (1 - Math.exp(-dt / 220));
      if (!s.down) s.pos += (s.speed * dt) / 1000;
      if (period) {
        while (s.pos >= period * 2) s.pos -= period;
        while (s.pos < period) s.pos += period;
      }
      track.style.transform = `translate3d(${-s.pos}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    st.current.down = true;
    st.current.lastX = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!st.current.down) return;
    st.current.pos -= e.clientX - st.current.lastX;
    st.current.lastX = e.clientX;
  };
  const end = () => {
    st.current.down = false;
    setDragging(false);
  };

  return (
    <div
      className="ev-drag"
      data-dragging={dragging}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") st.current.hover = true; }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") st.current.hover = false; end(); }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div ref={trackRef} className="ev-track">{children}</div>
    </div>
  );
}

function IdeasMeetPeople() {
  return (
    <Scene className="ev-pad ev-sec ev-bg-800">
      <div className="section">
        <Rise>
          <p className="ev-room-eyebrow">The room</p>
        </Rise>
        <Rise d={0.02}>
          <h2 className="ev-ideas-h mt-6">This is where ideas meet people.</h2>
        </Rise>
        <Rise d={0.04}>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <p className="ev-ideas-p max-w-[34rem]">
              Entrepreneurs, investors, builders — and people who believe the next opportunity could be sitting right beside them.
            </p>
            <p className="ev-hint">
              Hover to pause · Drag to explore <ArrowRight size={12} />
            </p>
          </div>
        </Rise>
      </div>

      <Rise d={0.07} y={20} className="mt-[clamp(32px,4vw,56px)]">
        <DragRow>
          {[0, 1, 2].map((copy) =>
            ROOM_CARDS.map((c) => (
              <article key={`${copy}-${c.tag}`} className="ev-card" aria-hidden={copy !== 1}>
                <img src={c.image} alt="" loading="eager" decoding="async" draggable={false} />
                <div className="ev-card-shade" aria-hidden />
                <div className="ev-card-body">
                  <p className="ev-card-tag">{c.tag}</p>
                  <h3 className="ev-card-title">{c.title}</h3>
                </div>
              </article>
            ))
          )}
        </DragRow>
      </Rise>
    </Scene>
  );
}

/* ----------------------- SECTION 10.5: SPONSOR ------------------------- */
function Sponsor() {
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
    const onKey = (e: KeyboardEvent) => {
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
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="sponsor" className="ev-pad ev-sponsor">
      <div className="section">
        <div className="ev-sp-grid">
          <Rise className="ev-sp-head">
            <p className="ev-sp-eyebrow">
              <span className="ev-sp-line" />
              Sponsorship
            </p>
            <h2 className="ev-sp-h mt-6">
              <span>Put your brand</span>
              <span className="ev-h-gold">in the room.</span>
            </h2>
            <p className="ev-sp-lead mt-6">
              Support the BrickShare Capital Business Launch &amp; Grand Opening and be recognized in front of
              Houston's business owners, investors and professionals.
            </p>
          </Rise>

          <Rise className="ev-sp-tagwrap" d={0.02}>
            <p className="ev-hand ev-sp-tag">Choose a level, we handle the rest.</p>
          </Rise>

          <Rise className="ev-sp-cards" d={0.03}>
            <div role="radiogroup" aria-label="Sponsor type" className="ev-sp-list">
              {SPONSOR_PLANS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={plan === p.key}
                  onClick={() => setPlan(p.key)}
                  className={`ev-sp-card ${plan === p.key ? "is-on" : ""}`}
                >
                  <span className="ev-sp-radio" aria-hidden />
                  <span className="ev-sp-card-main">
                    <span className="ev-sp-card-title">
                      {p.label}
                      {"limited" in p && p.limited && <em className="ev-sp-badge">Limited</em>}
                    </span>
                    <span className="ev-sp-card-desc">{p.desc}</span>
                  </span>
                  <span className="ev-sp-card-price">{p.price}</span>
                </button>
              ))}
            </div>
          </Rise>

          <Rise className="ev-sp-formwrap" d={0.05}>
            <form className="ev-sp-form" onSubmit={submit} noValidate>
              <h3 className="ev-sp-form-h">Register as a sponsor</h3>
              <p className="ev-sp-form-p">
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
                  <option key={p.key} value={p.key}>{p.label} — {p.price}</option>
                ))}
              </select>

              {error && <p className="ev-sp-error" role="alert">{error}</p>}

              <button type="submit" className="ev-sp-submit" disabled={busy}>
                {busy ? "Please wait..." : "Confirm & Register"} <ArrowRight size={16} />
              </button>
              <p className="ev-sp-fine">
                No payment is taken on this form. By registering you agree to be contacted about your sponsorship.
              </p>
            </form>
          </Rise>
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            className="ev-sp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDone(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="ev-sp-pop"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="ev-sp-close" aria-label="Close" onClick={() => setDone(null)}>
                <X size={16} />
              </button>
              <span className="ev-sp-check"><Check size={30} strokeWidth={3} /></span>
              <h3 className="ev-sp-pop-h">Thank you, {done.first}.</h3>
              <p className="ev-sp-pop-p">
                Your {done.label} ({done.price}) registration is received. Our events team will contact you with
                payment options and invoice details.
              </p>
              <p className="ev-sp-pop-next">
                Next: send your logo and materials once your sponsorship is confirmed.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ----------------------- SECTION 11: YOU'RE INVITED ------------------------- */
function Invite() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // scroll karte hi image gate ke andar zoom hoti jaati hai (1x -> 1.65x)
  // [0.25, 0.85] = kab se kab tak zoom ho, [1, 1.65] = kitna zoom ho (apne hisaab se badal sakti ho)
 const scale = useTransform(scrollYProgress, [0.15, 0.95], reduce ? [1, 1] : [1, 2.4]);

  return (
    <section ref={ref} id="rsvp" className="ev-pad ev-invite">
      <div className="ev-invite-media" aria-hidden>
        <motion.img
          src={IMG.invite}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ scale }}
          className="ev-invite-bg"
        />
      </div>

      <div className="section ev-invite-content">
        <Rise>
          <p className="ev-room-eyebrow justify-center">You're invited</p>
        </Rise>
        <Rise d={0.02}>
          <h2 className="ev-invite-h mt-6">Be in the room.</h2>
        </Rise>
        <Rise d={0.04}>
          <p className="ev-invite-date mt-3">
            <span className="ev-gold-text">December 3, 2026.</span>
          </p>
        </Rise>
        <Rise d={0.06}>
          <p className="ev-invite-p mt-6">
            An evening of people, ideas, real estate, and possibilities all coming together under one roof.
          </p>
          <p className="ev-invite-q mt-6">Something new is taking shape. Will you be there when it does?</p>
        </Rise>
        <Rise d={0.08}>
          <a href={LUMA_LINK} target="_blank" rel="noopener noreferrer" className="ev-invite-btn mt-[52px]">
            RSVP <ArrowRight size={14} />
          </a>
          <p className="ev-invite-meta mt-5">
            6:00 — 9:00 PM &nbsp;·&nbsp; The Cannon West Houston &nbsp;·&nbsp; Gallery Steps
          </p>
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------ PAGE --------------------------------------- */
export default function Events() {
  useSeo(pageSeo("/events"));

  return (
    <div className="ev-root">
      <style>{css}</style>
      <Hero />
      <Marquee />
      <Room />
      <WhyAttend />
      <RightRoom />
      <People />
      <Evening />
      <Experience />
      <Setting />
      <IdeasMeetPeople />
      <Sponsor />
      <Invite />
      {/* footer yahan nahi — site ka common Footer already page ke baahar hai */}
    </div>
  );
}