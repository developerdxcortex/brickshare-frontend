import { motion } from "framer-motion";
import {
  Users,
  Check,
  Linkedin,
  Instagram,
  CheckCheckIcon,
  ArrowUpRight,
} from "lucide-react";
import { PageHero, CTAButton } from "../components/ui";
import Reveal from "../components/Reveal";
import { images } from "../config/site";
import { Link } from "react-router-dom";
import { useSeo, pageSeo } from "../lib/seo";

const values = [
  {
    title: "Transparency",
    desc: "Clear disclosures, structured reporting, and open communication at every stage of the investment lifecycle.",
  },
  {
    title: "Integrity",
    desc: "Investor-first decision making, regulatory awareness, and ethical execution.",
  },
  {
    title: "Community",
    desc: "Building long-term value together through trusted partnerships and local market expertise.",
  },
  {
    title: "Performance",
    desc: "Focused on consistent, risk-adjusted returns backed by professional asset management.",
  },
];

const journey = [
  {
    year: "2024 – Foundation",
    desc: "Brickshare Capital founded in Houston, Texas, with a focus on disciplined real estate investment strategies.",
    img: "/images/foundation.webp",
  },
  {
    year: "2024 – Early Growth",
    desc: "Initial projects launched, establishing strong investor relationships and operational frameworks.",
    img: "/images/early-growth.webp",
  },
  {
    year: "2025 – Expansion",
    desc: "Scaling investment opportunities and partnerships while expanding reach beyond Houston.",
    img: "/images/expansion.webp",
  },
];
const founders = [
  {
    name: "Mia Rose Greco",
    role: "Co-Founder | Managing Partner",
    bio: "Mia Rose Greco leads strategic planning, investor relations, and operational oversight at Brickshare Capital. With a strong focus on transparency and trust, she ensures every investment opportunity aligns with the firm's values and long-term objectives.",
  },
  {
    name: "Aziz Ross",
    role: "Co-Founder | Managing Partner",
    bio: "Aziz leads investment strategy, deal evaluation, and capital deployment. His execution-driven and analytical approach helps identify opportunities that deliver strong, risk-adjusted performance while maintaining disciplined asset management.",
  },
];

const whatWeDo = [
  "Curated real estate investment opportunities",
  "Capital structuring & deal syndication",
  "Portfolio asset management & optimization",
  "Long-term wealth building strategies",
  "Trusted, investor-centric service",
];

export default function About() {
  useSeo(pageSeo("/about"));
  return (
    <>
      <PageHero
        image={images.heroAbout}
        title={
          <>
            Building Smarter
            <br />
            Pathways to Real
            <br />
            Estate Investment
          </>
        }
      />

      {/* Intro */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_16.53%,#FFE7BA_101.29%)] py-10 lg:py-16">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* Image — desktop pe right shift, rounded corners */}
          <div className="relative overflow-hidden rounded-3xl lg:ml-[30%]">
            <img
              src={images.aboutIntro}
              alt="Houston skyline"
              className="h-80 w-full object-cover sm:h-96 lg:h-[480px]"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            <p className="absolute bottom-6 right-6 text-right text-xl font-semibold text-gold-400 sm:bottom-8 sm:right-8 sm:text-2xl">
              Born in Houston. Built for Smart,
              <br />
              Everyday Investors.
            </p>
          </div>

          {/* Card — mobile pe image ke neeche thoda overlap, desktop pe image-left ke upar */}
          <div className="relative z-10 mt-6 lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[48%] lg:items-center lg:pl-0 lg:pr-6">
            <Reveal>
              <div className="rounded-2xl border border-[#E4C300] bg-white p-7 shadow-[0px_-1px_18.9px_0px_#FEDF2733]">
                <p className="text-[#131627]">
                  Brickshare Capital is a real estate investment and capital
                  management firm dedicated to making property-backed
                  investments more transparent, accessible, and growth-driven.
                  Based in Houston, Texas, we focus on identifying high-quality
                  real estate opportunities and structuring them into
                  well-managed investment solutions for individuals, partners,
                  and institutions.
                </p>
                <p className="mt-4 text-[#131627]">
                  Our approach blends deep market knowledge, disciplined risk
                  management, and a long-term vision for value creation. Every
                  decision we make is guided by data, integrity, and a
                  commitment to delivering sustainable returns.
                </p>
                <div className="mt-6">
                  <CTAButton to="/projects" variant="dark">
                    Explore Opportunities
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="section grid gap-12 md:grid-cols-2 py-10 mt-10">
          {[
            {
              icon: "/images/our-mission.webp",
              title: "Our Mission",
              desc: "To provide a secure, transparent, and professionally managed real estate investment platform that enables investors to participate in high-quality opportunities while generating long-term, sustainable returns.",
            },
            {
              icon: "/images/our-vision.webp",
              title: "Our Vision",
              desc: "To make real estate investing simple, trustworthy, and community-driven — empowering investors to grow wealth through property ownership with the same ease and confidence as any modern financial solution.",
            },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <div className="flex items-center gap-5">
                <img
                  src={m.icon}
                  alt={m.title}
                  className="h-28 w-28 shrink-0 object-contain sm:h-40 sm:w-40"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.opacity =
                      "0.3")
                  }
                />
                <div>
                  <h3 className="text-2xl font-semibold text-[#131627]">
                    {m.title}
                  </h3>
                  <div className="my-2 h-px max-w-xs bg-[linear-gradient(90deg,rgba(19,22,39,0)_0%,#131627_47.6%,rgba(19,22,39,0)_100%)]" />
                  <p className="text-[#111111] lg:max-w-xs font-regular text-sm">
                    {m.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Values */}
        <div className="section mt-8">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 shadow-[0px_4px_11.3px_0px_#00000024] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                {/* Left: badi illustration upar, heading neeche */}
                <div>
                  <img
                    src="/images/our-values.webp"
                    alt="Our Values"
                    className="h-36 w-36 object-contain sm:h-48 sm:w-48"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.opacity =
                        "0.3")
                    }
                  />
                  <h3 className="mt-6 text-3xl font-semibold text-[#131627]">
                    Our Values
                  </h3>
                  <div className="my-2 h-px max-w-xs bg-[linear-gradient(90deg,rgba(19,22,39,0)_0%,#131627_47.6%,rgba(19,22,39,0)_100%)]" />
                  <p className="mt-2 text-sm font-regular text-[#111111]">
                    The principles that guide everything we do
                  </p>
                </div>

                {/* Right: 2x2 grid, title ke aage gold line right tak */}
                <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {values.map((v) => (
                    <div key={v.title}>
                      <div className="my-2 h-px max-w-xs bg-[#E4C300]" />
                      <div className="flex items-center gap-3">
                        <h4 className="whitespace-nowrap font-semibold text-[#131627]">
                          {v.title}
                        </h4>
                      </div>
                      <p className="mt-2 text-sm lg:max-w-[240px] text-[#111111] font-regular">
                        {v.desc}
                      </p>
                      <div className="my-2 h-px max-w-xs bg-[#E4C300]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section className="relative overflow-hidden our-journey bg-cover bg-center bg-no-repeat pt-16 pb-32 text-white grain sm:pb-44">
        <div className="section relative z-10">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#E4C300]">
              Our Journey
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mt-2 text-center text-sm text-white font-regular">
              Growing step by step with our investor community
            </p>
          </Reveal>

          <div className="relative mx-auto mt-12 max-w-3xl">
            {/* center line — pehle dot se aakhri dot tak */}
            <div className="absolute left-4 top-3 bottom-3 w-px bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_3.3%,#FFFFFF_49.4%,rgba(255,255,255,0.12)_100%)] sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-10 sm:space-y-12">
              {journey.map((j, i) => {
                const right = i % 2 === 0;
                const img = (
                  <img
                    src={j.img}
                    alt={j.year}
                    className="h-28 w-36 shrink-0 object-contain brightness-150 sm:h-36 sm:w-44"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.opacity =
                        "0.25")
                    }
                  />
                );
                const text = (
                  <div className={right ? "sm:text-left" : "sm:text-right"}>
                    <h3 className="font-semibold text-white">{j.year}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white font-regular">
                      {j.desc}
                    </p>
                  </div>
                );
                return (
                  <Reveal key={j.year} delay={i * 0.1}>
                    <div className="relative">
                      <span className="absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 sm:left-1/2" />
                      <div className="pl-10 sm:grid sm:grid-cols-2 sm:gap-14 sm:pl-0">
                        {right ? (
                          <>
                            <div className="hidden sm:block" />
                            <div className="flex items-center gap-4">
                              <div className="flex-1">{text}</div>
                              {img}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              {img}
                              <div className="flex-1">{text}</div>
                            </div>
                            <div className="hidden sm:block" />
                          </>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white py-16">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#131627]">
              Leadership <span className="text-[#E4C300]">Team</span>
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          </Reveal>

          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <div className="overflow-hidden rounded-2xl shadow-card">
                <img
                  src={images.aboutFounders}
                  alt="Founders"
                  className="h-72 w-full object-cover sm:h-96"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.opacity =
                      "0.2")
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="text-left">
                <div className="inline-block rounded-[50%] border-2 border-[#E4C300] px-12 py-5">
                  <p className="text-lg font-semibold tracking-wide">
                    <span className="text-[#E4C300]">OUR</span>{" "}
                    <span className="text-[#131627]">FOUNDER'S</span>
                  </p>
                </div>
                <p className="mt-4 text-[#111111] font-light">
                  Experienced founders committed to your success
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <div className="rounded-2xl bg-[#FFF4E0] p-7">
                  <div className="my-2 h-px max-w-xs bg-[linear-gradient(90deg,rgba(19,22,39,0)_0%,#131627_47.6%,rgba(19,22,39,0)_100%)]" />
                  <h3 className="pb-2 text-3xl font-semibold text-[#152FC2]">
                    {f.name}
                  </h3>
                  <div className="my-2 h-px max-w-xs bg-[linear-gradient(90deg,rgba(19,22,39,0)_0%,#131627_47.6%,rgba(19,22,39,0)_100%)]" />
                  <p className="mt-2 text-sm font-regular py-3 text-[#111111]">
                    {f.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#111111] font-regular">
                    {f.bio}
                  </p>
                  <div className="mt-4 py-3 flex items-center justify-end gap-3">
                    <a className="grid h-8 w-8 place-items-center" href="#">
                      <Linkedin size={20} />
                    </a>
                    <a className="grid h-8 w-8 place-items-center" href="#">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <div className="">
        <div className="grid overflow-hidden shadow-card lg:grid-cols-2">
          {/* Left: content panel (alag bg) */}
          <Reveal className="h-full">
            <div className="h-full bg-[linear-gradient(180deg,#FFFFFF_16.53%,#FFE7BA_101.29%)] p-8 sm:p-10 lg:p-12">
              <h2 className="text-3xl font-semibold text-[#E4C300]">
                What We Do
              </h2>
              <div className="my-3 h-px w-1/4 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
              <p className="mt-4 text-[#111111] font-light">
                We specialize in:
              </p>
              <ul className="mt-5 space-y-3 lg:space-y-10">
                {whatWeDo.map((w) => (
                  <li
                    key={w}
                    className="flex items-center gap-3 text-[#131627] font-semibold"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#131627] text-white">
                      <CheckCheckIcon size={14} />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[#0F228C] font-regular py-5">
                At every step, we aim to empower our partners with knowledge,
                confidence, and results that matter.
              </p>
            </div>
          </Reveal>

          {/* Right: full-height image */}
          <Reveal delay={0.1} className="h-full">
            <div className="h-full min-h-[300px]">
              <img
                src={images.aboutWhatWeDo}
                alt="City skyline"
                className="h-full w-full object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Approach */}
      <section className="py-16">
        <div className="section">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#000000]">
              Our Approach
            </h2>
            <div className="relative mt-5 overflow-hidden rounded-2xl p-8 text-white sm:p-12">
              <img
                src={images.aboutApproach}
                alt=""
                className="absolute inset-0 h-full w-full object-cover "
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.display = "none")
                }
              />
              <div className="relative z-10 max-w-2xl">
                <p className="text-lg leading-relaxed text-white font-regular">
                  We don't just invest — we build partnerships. By combining
                  thoughtful strategy with actionable insights, we help
                  investors navigate opportunities with confidence. Whether
                  you're growing your first portfolio or expanding a seasoned
                  strategy, Brickshare Capital is your trusted partner in real
                  estate growth.
                </p>
                <Link to="/projects" className="">
                  <button className="flex items-center gap-2 mt-7 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90">
                    <ArrowUpRight size={18} />
                    Explore Opportunities
                  </button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Join */}
      <section className="bg-[#FFFDF1] py-16 text-center">
        <div className="section">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#E4C300]">
              Join Our Journey
            </h2>
            <p className="mx-auto mt-4 py-3 max-w-2xl font-semibold text-[#131627]">
              Real estate investment doesn't have to be intimidating. At
              Brickshare Capital, we make it accessible, transparent, and
              rewarding. Let's grow together.
            </p>
            <div className="flex justify-center">
              <Link to="/projects">
                <button className="flex items-center justify-center gap-2 mt-7 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90">
                  <ArrowUpRight size={18} />
                  Explore Opportunities
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
