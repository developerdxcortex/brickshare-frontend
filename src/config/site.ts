// ============================================================================
//  BRICKSHARE CAPITAL — STATIC SITE CONFIG (frontend)
// ============================================================================

export const brand = {
  name: "BRICKSHARE",
  sub: "CAPITAL LLC",
  tagline: "Own real estate. Grow your wealth.",
  logo: "/images/logo.jpeg",
  logoFooter: "/images/logo.jpeg",
};

export const contact = {
  location: "820 Gessner Rd suite 300, Houston, TX 77024, United States",
  emails: ["mia@brickscapital.com", "aziz@brickscapital.com"],
  phones: ["+1 832 563 0920", "+1 832 774 1231"],
  hours: ["Monday – Friday |", "9:00 AM – 6:00 PM"],
};

export const images = {
  heroHome: "/images/hero-home.webp",
  heroHowItWorks: "/images/hero-howitworks.jpg",
  heroProjects: "/images/hero-projects.webp",
  heroAbout: "/images/hero-about.webp",
  heroEducation: "/images/hero-education.webp",
  heroContact: "/images/contact-building.webp",
  heroOurWork: "/images/hero-ourwork.webp",
  heroEvents: "/images/hero-home.webp", // TODO: replace with an events-specific image

  homeFocus: "/images/home-focus.webp",
  homeHowItWorks: "/images/home-howitworks.webp",

  hiwWhyChoose: "/images/hiw-why.jpeg",

  projectsRender: "/images/projects-render.png",

  aboutIntro: "/images/about-intro.webp",
  aboutFounders: "/images/about-founders.webp",
  aboutWhatWeDo: "/images/about-whatwedo.webp",
  aboutApproach: "/images/about-approach.webp",

  eduCta: "/images/edu-cta.webp",
};

export const articleCategories = [
  { name: "Investing Basics", count: "12 Articles" },
  { name: "Houston Market Trends", count: "8 Articles" },
  { name: "Tax Tips", count: "6 Articles" },
  { name: "Wealth Mindset", count: "10 Articles" },
];

export const documents = {
  investorPitchDeck: "/documents/Radiant_Retreat_Pitch_Deck.pdf",
};

export const disclosure =
  "BrickShare Capital LLC is a Houston-based real-estate participation platform. The company does not act as a broker-dealer, registered investment advisor, crowdfunding portal, or securities exchange. All information provided is for informational purposes only and should not be interpreted as financial, legal, or investment advice. Participation in real-estate projects involves risk, including potential loss of capital, lack of liquidity, market fluctuations, and project-specific risks. Past outcomes do not guarantee future results. Participants should consult their own professional advisors before making financial decisions.";

// "Our Work" completed-projects gallery
export interface OurWorkProject {
  slug: string;
  number: string;
  address: string;
  location: string;
  image: string;
  gallery: string[];
  projectType: string;
  title: string;
  description: string;
  features: string[];
}

export const ourWorkProjects: OurWorkProject[] = [
  {
    slug: "w-39th-street",
    number: "01",
    address: "701 W 39th Street · Houston, TX 77018",
    location: "Oak Forest, Houston",
    image: "/images/our-work/w-39th-street/hero.jpg",
    gallery: [
      "/images/our-work/w-39th-street/gallery-1.jpg",
      "/images/our-work/w-39th-street/gallery-2.jpg",
      "/images/our-work/w-39th-street/gallery-3.jpg",
      "/images/our-work/w-39th-street/gallery-4.jpg",
      "/images/our-work/w-39th-street/gallery-5.jpg",
      "/images/our-work/w-39th-street/gallery-6.jpg",
      "/images/our-work/w-39th-street/gallery-7.jpg",
      "/images/our-work/w-39th-street/gallery-8.jpg",
      "/images/our-work/w-39th-street/gallery-9.jpg",
      "/images/our-work/w-39th-street/gallery-10.jpg",
      "/images/our-work/w-39th-street/gallery-11.jpg",
      "/images/our-work/w-39th-street/gallery-12.jpg",
      "/images/our-work/w-39th-street/gallery-13.jpg",
      "/images/our-work/w-39th-street/gallery-14.jpg",
    ],
    projectType: "Full Designer Renovation",
    title: "A designer renovation, start to finish",
    description:
      "Every wall, surface and sightline in this Oak Forest home was reconsidered. The interior now opens into one continuous living, dining and kitchen space beneath stained exposed beams, grounded by wide-plank white oak floors. At the centre sits a navy and brass kitchen with a waterfall stone island that seats six. The primary suite reads like a hotel — freestanding tub, marble-clad walk-in shower, twin vanities under brass sconces. Outside, a cedar pergola, paver terrace and pool finish the property.",
    features: [
      "Open-plan reconfiguration",
      "Exposed beam ceilings",
      "White oak floors",
      "Custom navy kitchen",
      "Spa primary suite",
      "Pool & pergola",
    ],
  },
  {
    slug: "paula-street",
    number: "02",
    address: "4810 Paula Street · Houston, TX 77033",
    location: "Sunnyside, Houston",
    image: "/images/our-work/paula-street/hero.jpg",
    gallery: [
      "/images/our-work/paula-street/gallery-1.jpg",
      "/images/our-work/paula-street/gallery-2.jpg",
      "/images/our-work/paula-street/gallery-3.jpg",
      "/images/our-work/paula-street/gallery-4.jpg",
      "/images/our-work/paula-street/gallery-5.jpg",
      "/images/our-work/paula-street/gallery-6.jpg",
      "/images/our-work/paula-street/gallery-7.jpg",
      "/images/our-work/paula-street/gallery-8.jpg",
    ],
    projectType: "Ground-Up New Construction",
    title: "Built from an empty lot to move-in ready",
    description:
      "Two homes raised from bare ground and delivered complete. Marble-look porcelain tile runs through the living areas and baths, tray ceilings lift the main rooms, and each unit carries a full shaker kitchen with granite counters and a stainless appliance package. Tiled walk-in showers, soaking tubs, double vanities, walk-in closets and private laundry — nothing left to finish.",
    features: [
      "Ground-up construction",
      "Two complete units",
      "Porcelain tile throughout",
      "Granite & shaker kitchens",
      "Tray ceilings",
      "Private laundry",
    ],
  },
  {
    slug: "idaho-street",
    number: "03",
    address: "5102 Idaho Street · Houston, TX 77021",
    location: "Houston, TX 77021",
    image: "/images/our-work/idaho-street/hero.jpg",
    gallery: [
      "/images/our-work/idaho-street/gallery-1.jpg",
      "/images/our-work/idaho-street/gallery-2.jpg",
      "/images/our-work/idaho-street/gallery-3.jpg",
      "/images/our-work/idaho-street/gallery-4.jpg",
      "/images/our-work/idaho-street/gallery-5.jpg",
      "/images/our-work/idaho-street/gallery-6.jpg",
      "/images/our-work/idaho-street/gallery-7.jpg",
    ],
    projectType: "Full Rebuild & Renovation",
    title: "Rebuilt from the structure out",
    description:
      "This one needed more than paint. New roof, new siding, a new covered carport on black steel columns and a fresh concrete drive replaced everything that had failed. Inside, an espresso shaker kitchen with granite counters and a pendant-lit island anchors the plan, with wood-look plank flooring carried throughout and two full baths finished in marble-look tile — including a neo-angle glass shower with a rainfall head.",
    features: [
      "New roof & siding",
      "Steel-column carport",
      "New concrete drive",
      "Espresso shaker kitchen",
      "Two full baths",
      "Rainfall shower",
    ],
  },
  {
    slug: "teton-street",
    number: "04",
    address: "4914 Teton Street · Houston, TX 77033",
    location: "Sunnyside, Houston",
    image: "/images/our-work/teton-street/hero.jpg",
    gallery: [
      "/images/our-work/teton-street/gallery-1.jpg",
      "/images/our-work/teton-street/gallery-2.jpg",
      "/images/our-work/teton-street/gallery-3.jpg",
      "/images/our-work/teton-street/gallery-4.jpg",
      "/images/our-work/teton-street/gallery-5.jpg",
    ],
    projectType: "Interior Gut Renovation",
    title: "A mid-century ranch, completely reimagined",
    description:
      "Taken back to the studs inside and rebuilt with a clean contemporary palette. White shaker cabinetry meets granite counters and a subway tile backsplash, softened by custom black open shelving and a suspended pot rack. New flooring runs throughout, the bath was rebuilt around a tiled shower with a terracotta penny-tile accent, and a dedicated laundry room was added.",
    features: [
      "Full interior gut",
      "White shaker kitchen",
      "Custom open shelving",
      "Penny-tile bath",
      "New flooring",
      "Dedicated laundry",
    ],
  },
  {
    slug: "black-locust-drive",
    number: "05",
    address: "4202 Black Locust Drive",
    location: "Greater Houston",
    image: "/images/our-work/black-locust-drive/hero.jpg",
    gallery: [
      "/images/our-work/black-locust-drive/gallery-1.jpg",
      "/images/our-work/black-locust-drive/gallery-2.jpg",
      "/images/our-work/black-locust-drive/gallery-3.jpg",
      "/images/our-work/black-locust-drive/gallery-4.jpg",
      "/images/our-work/black-locust-drive/gallery-5.jpg",
      "/images/our-work/black-locust-drive/gallery-6.jpg",
      "/images/our-work/black-locust-drive/gallery-7.jpg",
    ],
    projectType: "Whole-Home Renovation",
    title: "A family ranch brought into the present",
    description:
      "A dated single-story brick ranch on a mature pool lot, modernized room by room. The kitchen was rebuilt in white shaker cabinetry around a granite island with double wall ovens; hardwood was refinished throughout and the fireplace resurfaced in contemporary stone. The primary bath tells the story best — the paired photographs show dated tile and glass block replaced by a frameless glass shower and soaking tub.",
    features: [
      "Whole-home renovation",
      "Granite island kitchen",
      "Double wall ovens",
      "Refinished hardwood",
      "Before & after bath",
      "Pool yard restored",
    ],
  },
  {
    slug: "kings-court",
    number: "06",
    address: "106 Kings Court · Stafford, TX 77477",
    location: "Stafford, TX",
    image: "/images/our-work/kings-court/hero.jpg",
    gallery: [
      "/images/our-work/kings-court/gallery-1.jpg",
      "/images/our-work/kings-court/gallery-2.jpg",
      "/images/our-work/kings-court/gallery-3.jpg",
      "/images/our-work/kings-court/gallery-4.jpg",
    ],
    projectType: "Interior Renovation",
    title: "Character added, not just surfaces replaced",
    description:
      "The double-height living room was the opportunity here, and custom board-and-batten wainscot now carries the full height of the room and up through the stair hall. Hardwood was refinished throughout, the brick fireplace kept and refreshed as the focal point, and the kitchen reworked with granite counters, hexagonal tile and a full stainless package. The pool and grounds were restored in the same pass.",
    features: [
      "Custom wainscot millwork",
      "Double-height living room",
      "Refinished hardwood",
      "Reworked kitchen",
      "Pool restored",
      "Fresh landscaping",
    ],
  },
  {
    slug: "shady-gardens-drive",
    number: "07",
    address: "5322 Shady Gardens Drive · Kingwood, TX 77339",
    location: "Kingwood, TX",
    image: "/images/our-work/shady-gardens-drive/hero.jpg",
    gallery: [
      "/images/our-work/shady-gardens-drive/gallery-1.jpg",
      "/images/our-work/shady-gardens-drive/gallery-2.jpg",
      "/images/our-work/shady-gardens-drive/gallery-3.jpg",
      "/images/our-work/shady-gardens-drive/gallery-4.jpg",
      "/images/our-work/shady-gardens-drive/gallery-5.jpg",
      "/images/our-work/shady-gardens-drive/gallery-6.jpg",
    ],
    projectType: "Kitchen, Bath & Interior Renovation",
    title: "A kitchen worth gathering around",
    description:
      "This Kingwood home was updated around its vaulted open-plan great room. An oversized granite island with breakfast seating now anchors the kitchen, cabinetry was refinished in a rich cherry stain with new hardware, and a full stainless package went in. Wood-look flooring runs through the main living areas, and both bathrooms were rebuilt — including a dual granite vanity and tiled walk-in shower beneath a skylight.",
    features: [
      "Oversized granite island",
      "Vaulted great room",
      "Refinished cabinetry",
      "Stainless package",
      "Two baths rebuilt",
      "Skylit walk-in shower",
    ],
  },
  {
    slug: "calloway-court",
    number: "08",
    address: "400 Calloway Court",
    location: "Mid-Atlantic",
    image: "/images/our-work/calloway-court/hero.jpg",
    gallery: [
      "/images/our-work/calloway-court/gallery-1.jpg",
      "/images/our-work/calloway-court/gallery-2.jpg",
      "/images/our-work/calloway-court/gallery-3.jpg",
      "/images/our-work/calloway-court/gallery-4.jpg",
      "/images/our-work/calloway-court/gallery-5.jpg",
      "/images/our-work/calloway-court/gallery-6.jpg",
      "/images/our-work/calloway-court/gallery-7.jpg",
      "/images/our-work/calloway-court/gallery-8.jpg",
    ],
    projectType: "Full Interior Renovation",
    title: "Executive scale, finished to match",
    description:
      "The largest home in the portfolio — a brick colonial with a two-story great room, a wall of palladian windows and a walkout lower level. All three finished levels were renovated: hardwood refinished across the main floor, a granite and stainless kitchen opened to the great room, crown molding and trim restored throughout, and a primary bath built around a soaking tub and frameless glass corner shower.",
    features: [
      "Three finished levels",
      "Two-story great room",
      "Palladian window wall",
      "Granite kitchen",
      "Spa primary bath",
      "Deck & grounds restored",
    ],
  },
];