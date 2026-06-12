// ============================================================================
//  BRICKSHARE CAPITAL — STATIC SITE CONFIG (frontend)
//  NOTE: Plans, Articles, Reviews ab BACKEND/ADMIN se aate hai (dynamic).
//  Yahan sirf static cheezein hai: brand, logo, hero/section images,
//  contact details, category counts, footer disclosure.
//  Apni images "public/images/" me daal — filenames niche match kar de.
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

// Static page/section images (NOT the dynamic plan/article images)
export const images = {
  heroHome: "/images/hero-home.webp",
  heroHowItWorks: "/images/hero-howitworks.jpg",
  heroProjects: "/images/hero-projects.webp",
  heroAbout: "/images/hero-about.webp",
  heroEducation: "/images/hero-education.webp",
  heroContact: "/images/contact-building.webp",

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

// Education "Explore by Category" tiles (counts are display-only)
export const articleCategories = [
  { name: "Investing Basics", count: "12 Articles" },
  { name: "Houston Market Trends", count: "8 Articles" },
  { name: "Tax Tips", count: "6 Articles" },
  { name: "Wealth Mindset", count: "10 Articles" },
];

export const disclosure =
  "BrickShare Capital LLC is a Houston-based real-estate participation platform. The company does not act as a broker-dealer, registered investment advisor, crowdfunding portal, or securities exchange. All information provided is for informational purposes only and should not be interpreted as financial, legal, or investment advice. Participation in real-estate projects involves risk, including potential loss of capital, lack of liquidity, market fluctuations, and project-specific risks. Past outcomes do not guarantee future results. Participants should consult their own professional advisors before making financial decisions.";
