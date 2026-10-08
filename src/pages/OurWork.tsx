import { ArrowUpRight, Building2, Hammer, Home, Wrench, Trees, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageHero } from "../components/ui";
import Reveal from "../components/Reveal";
import { images, ourWorkProjects } from "../config/site";
import { useSeo, pageSeo } from "../lib/seo";

const stats = [
  { value: "8", label: "Projects Delivered" },
  { value: "6", label: "Submarkets Served" },
  { value: "100%", label: "Completed & Closed Out" },
];

const whatWeDo = [
  {
    icon: Building2,
    title: "Ground-Up Construction",
    desc: "Full vertical build capability — permitting, site work, framing and finish-out, delivered turnkey.",
  },
  {
    icon: Hammer,
    title: "Structural Rebuilds",
    desc: "Roof, envelope, siding, carports and concrete replaced outright on assets others write off.",
  },
  {
    icon: Home,
    title: "Designer Renovation",
    desc: "Open-plan reconfiguration, custom millwork and premium finish specification.",
  },
  {
    icon: Wrench,
    title: "Kitchens & Baths",
    desc: "Custom cabinetry, stone fabrication, full tile work and frameless glass shower systems.",
  },
  {
    icon: Trees,
    title: "Exterior & Site",
    desc: "Driveways, pergolas, patios, pools, fencing and complete landscape packages.",
  },
  {
    icon: PackageCheck,
    title: "Delivered Complete",
    desc: "Every project on this page was finished, closed out and handed over.",
  },
];

export default function OurWork() {
  useSeo(pageSeo("/our-work"));
  return (
    <>
      <PageHero
        image={images.heroOurWork}
        title={
          <>
            Prominent Global
            <br />
            Investments LLC
          </>
        }
      />

      {/* Our Work intro + stats */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_16.53%,#FFE7BA_101.29%)] py-16">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
              Our <span className="text-gold-500">Work</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#111111]">
              Eight completed residential projects — from full designer renovations to ground-up
              construction.
            </p>
            <p className="mt-2 font-semibold text-[#131627]">
              Oak Forest · Sunnyside · Houston · Stafford · Kingwood · Mid-Atlantic
            </p>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="rounded-2xl border border-gold-500/40 bg-gradient-to-b from-[#E9C700] to-[#F6DE6B] px-6 py-9 text-center shadow-[0px_4px_14px_0px_#E9C70033]"
                >
                  <p className="text-4xl font-extrabold text-[#131627]">{s.value}</p>
                  <p className="mt-2 text-sm font-medium text-[#131627]">{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white py-16 sm:py-20">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
              What we <span className="text-gold-500">do</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-semibold text-[#131627]">
              We take houses from what they are to what they should have been.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-[#111111]">
              Prominent Global Investments LLC is a Houston-based development and investment firm. We
              renovate, rebuild and build from the ground up — and we carry every project ourselves, from
              acquisition through construction management to the day it's finished.
              <br />
              The eight projects below are completed work. Not renderings, not proposals. Everything you
              see was delivered.
            </p>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-5xl auto-rows-fr gap-5 rounded-3xl bg-[linear-gradient(180deg,#FFFDF1_0%,#FFF4E0_100%)] p-6 text-left sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
            {whatWeDo.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="flex h-full flex-col rounded-2xl border border-gold-400/30 bg-white p-6 shadow-soft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400 text-[#131627]">
                    <w.icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold text-[#131627]">{w.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-[#111111]">{w.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Projects gallery */}
      <section className="bg-[#FFFDF1] py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#131627] sm:text-4xl">
              Our <span className="text-gold-500">Projects</span>
            </h2>
            <div className="mx-auto my-4 h-px w-1/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          </Reveal>

          <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {ourWorkProjects.map((p, i) => (
    <Reveal key={p.slug} delay={(i % 4) * 0.06}>
      <Link to={`/our-work/${p.slug}`}>
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-400/40 bg-white shadow-soft"
        >
          <div className="overflow-hidden">
            <img
              src={p.image}
              alt={p.address}
              className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.15")}
            />
          </div>
          <div className="flex flex-1 items-center justify-between gap-2 p-4">
            <p className="text-sm font-semibold text-[#131627]">{p.address}</p>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-400/60 text-[#131627] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-gold-400">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  ))}
</div>
        </div>
      </section>

     {/* Let's talk CTA */}
<section className="relative overflow-hidden how-it-works-cta bg-center bg-cover bg-no-repeat py-16 sm:py-20">
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(90deg, rgba(253,252,251,0.85) 0%, rgba(226,209,195,0.85) 100%)",
    }}
  />
  <div className="section relative z-10">
    <Reveal>
      <h2
        style={{
          fontFamily: "Onest",
          fontWeight: 700,
          fontSize: "46px",
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#E4B300",
        }}
      >
        Let's talk
      </h2>

      <p
        className="mt-4 max-w-lg"
        style={{
          fontFamily: "Onest",
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: "130%",
          letterSpacing: "0%",
          color: "#131627",
        }}
      >
        Tell us about your property.
      </p>

      <p
        className="mt-2 max-w-lg"
        style={{
          fontFamily: "Onest",
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: "130%",
          letterSpacing: "0%",
          color: "#131627",
        }}
      >
        Whether you're selling a house that needs work, looking for a finished home, or partnering
        on a project — we'd like to hear about it.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link to="/projects">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full bg-[#131627] border border-[#FEDF27] pl-2 pr-5 py-2 text-sm font-semibold text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[#FEDF27]">
              <ArrowUpRight size={14} />
            </span>
            Explore Opportunities
          </motion.button>
        </Link>

        <Link to="/contact">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full bg-white pl-2 pr-5 py-2 text-sm font-semibold text-[#131627] shadow-soft"
            style={{ border: "1px solid #131627" }}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full"
              style={{ border: "1px solid #131627" }}
            >
              <ArrowUpRight size={14} />
            </span>
            Contact Us
          </motion.button>
        </Link>
      </div>
    </Reveal>
  </div>
</section>
    </>
  );
}