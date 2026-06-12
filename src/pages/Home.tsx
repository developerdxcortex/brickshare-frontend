import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Check,
  X,
  MapPin,
  Mail,
  FileText,
  Search,
  DollarSign,
  Eye,
  Shuffle,
  Sparkles,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import {
  ProjectCard,
  CTAButton,
  Loader,
  type PlanLike,
} from "../components/ui";
import Reveal from "../components/Reveal";
import Reviews from "../components/Reviews";
import { images, contact } from "../config/site";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { useSeo, pageSeo } from "../lib/seo";

/* ------------------------------ small helpers ----------------------------- */
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/* ============================================================================ */
export default function Home() {
  useSeo(pageSeo("/"));
  return (
    <>
      <Hero />
      <FocusSection />
      <Featured />
      <Offers />
      <HowItWorksMini />
      <ROICalculator />
      <ForAndNot />
      <LocalFocus />
      <Reviews />
      <GetInTouch />
    </>
  );
}

/* --------------------------------- HERO ----------------------------------- */
function Hero() {
  const badges = ["No Speculation", "No Shortcuts", "No Hidden Layers"];
  return (
    <section className="px-4 pt-6 sm:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy shadow-card ring-1 ring-black/5">
        <motion.img
          src={images.heroHome}
          alt=""
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")
          }
        />
        <div className="relative z-10 flex min-h-[480px] flex-col justify-center px-6 py-14 sm:px-12 sm:py-16 lg:min-h-[540px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gold-400/90"
          >
            {badges.map((b) => (
              <span
                key={b}
                className="flex items-center bg-[#131627] rounded-full text-[#E4C300] italic px-4 py-2  gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E4C300]" /> {b}
              </span>
            ))}
          </motion.div>

          <div className=" my-3 h-px w-1/2 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl"
          >
            BrickShare <br />
            <span className="">Capital</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg text-white"
          >
            Provides access to curated real-estate participation opportunities
            in Houston — designed for investors who value real assets, clear
            information, and long-term thinking.
          </motion.p>
          <p className="mt-4 max-w-xl text-sm text-[#E4C300]">
            Just disciplined exposure to property-backed projects.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 border border-[#FEDF27] rounded-full bg-[#131627] rounded-full shadow-[0px_4px_11.5px_0px_#988723] px-7 py-3 font-regular text-[#FEDF27] transition-all hover:opacity-90"
            >
              <ArrowUpRight size={18} /> Explore Opportunities
            </Link>

            <a
              href="#roi"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#131627] rounded-full text-[#FEDF27] px-7 py-3 font-regular transition-all hover:opacity-90"
            >
              <Calculator size={18} /> Calculate Your ROI
            </a>
          </motion.div>

          <p className="mt-8 text-white fpmt-regular">
            Participation starts from{" "}
            <span className="font-bold text-[#FEDF27]">$2,500</span>
          </p>
          <div className=" my-3 h-px w-1/4 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FOCUS SECTION ----------------------------- */
function FocusSection() {
  const focus = [
    "Local market understanding",
    "Selective project access",
    "Structured participation models",
    "Ongoing transparency",
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="section">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-[#E4C300] sm:text-3xl">
            Houston-based. Asset-driven. Investor-first.
          </h2>

          <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />

          <p className="mx-auto mt-4 max-w-2xl text-center font-regular text-[#111111]">
            BrickShare Capital is built for individuals who want measured
            participation in real estate without operational complexity.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <h3 className="text-xl font-semibold text-[#E4C300]">
                We focus on:
              </h3>
              <ul className="mt-4 space-y-3">
                {focus.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 font-medium text-[#111111]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img
                src={images.homeFocus}
                alt="Houston aerial"
                className="h-64 w-full object-cover sm:h-80 rounded-xl"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            </div>
          </Reveal>
        </div>

        <p className="mt-10 text-center text-xs font-medium uppercase tracking-wider text-[#D2990A]">
          We do not promote financial products. We enable informed
          participation.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- FEATURED -------------------------------- */
function Featured() {
  const badges = [
    "Verified Properties",
    "Transparent Reporting",
    "Expert Managed",
  ];
  const [plans, setPlans] = useState<PlanLike[] | null>(null);
  useEffect(() => {
    api
      .getPlans()
      .then((d) => setPlans(d.slice(0, 3)))
      .catch(() => setPlans([]));
  }, []);
  return (
    <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7BA_100%)] py-16">
      <div className="section">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-[#131627] sm:text-3xl">
            Verified. <span className="text-[#E4C300]">Managed.</span> Trusted.
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border boder-[#C1A814] bg-[linear-gradient(180deg,#D0B40D_0%,#FFEF90_100%)] px-4 py-1.5 text-sm font-medium text-[#111111]"
              >
                {b}
              </span>
            ))}
          </div>
          <h3 className="mt-8 text-center text-2xl font-semibold text-[#131627] sm:text-3xl">
            Featured Investment Opportunities
          </h3>

          <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />

          <p className="mt-2 text-center text-[#131627] font-regular">
            Own a fraction of premium real estate across Texas
          </p>
        </Reveal>

        {plans === null ? (
          <Loader />
        ) : plans.length === 0 ? (
          <p className="mt-10 text-center text-[#131627]">
            No opportunities available right now.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p, i) => (
              <ProjectCard key={p._id || i} p={p} index={i} />
            ))}
          </div>
        )}
        <Link to='/projects' className="mt-10 flex justify-center">
          <button className="flex items-center gap-2 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] font-regular px-6 py-3 rounded-full hover:opacity-90">
            <ArrowUpRight size={18} />
            Explore Opportunities
          </button>
        </Link>
      </div>
    </section>
  );
}

/* --------------------------------- OFFERS --------------------------------- */
function Offers() {
  const items = [
    {
      icon: FileText,
      title: "Real-Estate Participation Access",
      desc: "Engage in Houston-based real estate projects alongside established operators.",
    },
    {
      icon: Search,
      title: "Curated Opportunities",
      desc: "Each opportunity is reviewed for location, fundamentals, and execution feasibility.",
    },
    {
      icon: DollarSign,
      title: "Thoughtful Capital Entry",
      desc: "Participation begins at $2,500, aligned with long-term ownership mindset.",
    },
    {
      icon: Eye,
      title: "Clear Project Visibility",
      desc: "Investors receive project context, assumptions, timelines, and progress updates.",
    },
    {
      icon: Shuffle,
      title: "Structured Capital Flow",
      desc: "Participation is handled through project-specific documentation and arrangements.",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-[#131627] py-16 text-white">
      <div className="section relative z-10">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
            What <span className="text-[#E4C300]">BrickShare Capital</span>{" "}
            offers
          </h2>
          <p className="mt-2 text-center text-sm text-[#E4C300] font-regular">
            Straightforward by design.
          </p>
        </Reveal>

        <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />

        <div className="mt-10 space-y-5">
          {/* Top row - 3 cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#FFFFFF_15.87%,#FFE7BA_100%)] p-6"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#131627] text-[#E4C300]">
                    <it.icon size={22} />
                  </div>
                  <h3 className="mt-4 font-semibold text-[#131627]">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#111111] font-regular">
                    {it.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Bottom row - 2 cards centered */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:w-2/3 lg:mx-auto">
            {items.slice(3).map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full rounded-2xl bg-[linear-gradient(180deg,_#FFFFFF_15.87%,_#FFE7BA_100%)] p-6"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#131627] text-[#E4C300]">
                    <it.icon size={22} />
                  </div>
                  <h3 className="mt-4 font-semibold text-[#131627]">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#111111] font-regular">
                    {it.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- HOW IT WORKS MINI -------------------------- */
function HowItWorksMini() {
  const tags = [
    "No trading dashboards",
    "No daily decisions",
    "No hidden layers",
  ];

  return (
    <section className="bg-[linear-gradient(180deg,_#FFFFFF_0%,_#FFE7BA_100%)] py-20">
      <div className="section">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold text-[#131627] sm:text-4xl">
            How it works
          </h2>
          <div className="mt-3 flex justify-center">
            <span className="rounded-lg bg-[#131627] border border-[#131627] font-regular px-4 py-1.5 text-xs text-[#E4C300]">
              No noise. Just clarity.
            </span>
          </div>
        </Reveal>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          {/* Left side - steps */}
          <div className="flex flex-col">
            {/* Step 1 */}
            <Reveal delay={0}>
              <div className="pb-6">
                <Search
                  size={28}
                  className="text-[#000000] mb-2"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold text-[#000000]">
                  <span className="text-[#000000]">1. </span>Explore
                  Opportunities
                </h3>
                <div className="mt-4 h-px w-1/2 bg-[#000000]" />
                <p className="mt-1.5 text-sm text-[#111111] font-regular max-w-xs">
                  Review available real-estate projects with detailed background
                  information.
                </p>
              </div>
            </Reveal>

            {/* Step 2 - indented */}
            <Reveal delay={0.1}>
              <div className="pb-6 ml-16">
                <Sparkles
                  size={28}
                  className="text-[#000000] mb-2"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold text-[#000000]">
                  <span className="">2. </span>Confirm Participation
                </h3>
                <div className="mt-4 h-px w-1/2 bg-[#000000]" />
                <p className="mt-1.5 text-sm text-[#111111] font-regular max-w-xs">
                  Participate based on clearly outlined project terms and
                  timelines.
                </p>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={0.2}>
              <div className="pb-6">
                <Bell
                  size={28}
                  className="text-[#000000] mb-2"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold text-[#000000]">
                  <span className="">3. </span>Stay Informed
                </h3>
                <div className="mt-4 h-px w-1/2 bg-[#000000]" />
                <p className="mt-1.5 text-sm text-[#111111] max-w-xs">
                  Receive periodic updates covering progress, milestones, and
                  key developments.
                </p>
              </div>
            </Reveal>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[linear-gradient(180deg,_#D0B40D_0%,_#FFEF90_100%)] border border-[#C1A814] px-4 py-1.5 text-xs font-medium text-[#111111]"
                >
                  • {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right side - image */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-3xl shadow-xl h-[480px]">
              <img
                src={images.homeHowItWorks}
                alt="Glass tower"
                className="h-full w-full object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            </div>
          </Reveal>
        </div>

        {/* Button - center */}
        <Link to='/projects' className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 bg-[#131627] shadow-[0px_4px_11.5px_0px_#988723] text-[#FEDF27] border border-[#FEDF27] font-regular px-6 hover:opacity-90 py-3 rounded-full text-sm">
            <ArrowUpRight size={18} />
            Explore Opportunities
          </button>
        </Link>
      </div>
    </section>
  );
}
/* ------------------------------ ROI CALCULATOR ---------------------------- */
function ROICalculator() {
  const [amount, setAmount] = useState(40000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(3);

  const { total, profit, returnPct, breakdown } = useMemo(() => {
    const total = amount * Math.pow(1 + rate / 100, years);
    const profit = total - amount;
    const returnPct = (profit / amount) * 100;
    const months = years * 12;
    const checkpoints = [
      Math.round(months * 0.1),
      Math.round(months * 0.4),
      Math.round(months * 0.7),
      months,
    ];
    const breakdown = checkpoints.map((m) => {
      const val = amount * Math.pow(1 + rate / 100, m / 12);
      return { label: `Month ${m}`, value: val - amount };
    });
    return { total, profit, returnPct, breakdown };
  }, [amount, rate, years]);

  const maxBar = Math.max(...breakdown.map((b) => b.value), 1);

  return (
    <section id="roi" className="bg-white py-16">
      <div className="section">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold text-[#E4C300]">
            ROI Calculator
          </h2>
          <p className="mt-2 text-center text-sm font-regular text-[#111111]">
            Estimate Your Potential Returns
          </p>
          <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          <p className="mt-2 text-center text-lg max-w-4xl mx-auto font-semibold text-[#131627]">
            This calculator provides illustrative projections only. Actual
            returns may vary based on market conditions and project performance.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <Reveal>
            <div className="space-y-8 rounded-2xl bg-white p-7 shadow-soft ring-1 ring-black/5">
              <Slider
                label="Investment Amount"
                value={usd(amount)}
                icon={DollarSign}
                min={2500}
                max={500000}
                step={500}
                raw={amount}
                onChange={setAmount}
                minLabel="$2,500"
                maxLabel="$500,000"
              />
              <Slider
                label="Expected Annual Return"
                value={`${rate}%`}
                icon={Calculator}
                min={5}
                max={20}
                step={1}
                raw={rate}
                onChange={setRate}
                minLabel="5%"
                maxLabel="20%"
              />
              <Slider
                label="Investment Period"
                value={`${years} Years`}
                icon={Calculator}
                min={1}
                max={15}
                step={1}
                raw={years}
                onChange={setYears}
                minLabel="1 Year"
                maxLabel="15 Years"
              />
            </div>
          </Reveal>

          {/* Results */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-white p-7 shadow-soft ring-1 ring-black/5">
              <div className="flex items-center gap-2 text-sm font-medium text-ink/60">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-400/20 text-gold-600">
                  <Calculator size={15} />
                </span>
                Projected Total Value
              </div>
              <p className="mt-2 text-4xl font-extrabold text-navy">
                {usd(total)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-cream p-4">
                  <p className="text-sm text-ink/60">Total Profit</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600">
                    {usd(profit)}
                  </p>
                </div>
                <div className="rounded-xl bg-cream p-4">
                  <p className="text-sm text-ink/60">Total Return</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600">
                    +{returnPct.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gold-400/30 p-4">
                <p className="mb-3 text-sm font-semibold text-ink">
                  Growth Breakdown
                </p>
                <div className="space-y-3">
                  {breakdown.map((b, i) => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-ink/60">
                        {b.label}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                        <motion.div
                          className={`h-full rounded-full ${i === breakdown.length - 1 ? "bg-gold-400" : "bg-navy"}`}
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(b.value / maxBar) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold text-ink">
                        {usd(b.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-[11px] text-ink/45">
                For illustrative purposes only. Investments involve risk and
                returns are not guaranteed.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  raw,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
  icon: Icon,
}: {
  label: string;
  value: string;
  raw: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  minLabel: string;
  maxLabel: string;
  icon: any;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-ink/70">
          <Icon size={15} className="text-gold-600" /> {label}
        </span>
        <span className="font-bold text-navy">{value}</span>
      </div>
      <input
        type="range"
        className="brick-range mt-3 w-full"
        min={min}
        max={max}
        step={step}
        value={raw}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1 flex justify-between text-xs text-ink/50">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ------------------------------ FOR / NOT --------------------------------- */
function ForAndNot() {
  const forList = [
    "Want real estate exposure without active management",
    "Prefer local, tangible assets",
    "Are comfortable with medium- to long-term participation",
    "Understand that real estate carries market and execution risk",
  ];
  const notList = [
    "Not a broker-dealer",
    "Not an investment advisor",
    "Not a crowdfunding portal",
    "Not a public solicitation platform",
    "Not a promise of returns",
  ];
  return (
    <section className="relative overflow-hidden text-white">
      <div className="grid md:grid-cols-2">
        {/* LEFT — background image */}
        <div className="relative overflow-hidden py-16 bg-cover bg-center forandnotbg">
          {/* dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-navy/75" />
          <div className="section relative z-10">
            <Reveal>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Who BrickShare Capital is for
              </h2>
              <p className="mt-2 text-sm text-[#E4C300] font-regular">
                This platform is designed for investors who:
              </p>
              <div className="my-3 h-px w-1/2 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
              <ul className="mt-6 space-y-4">
                {forList.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 font-semibold shrink-0 place-items-center rounded-full text-[#17AF1C]">
                      <Check size={20} />
                    </span>
                    <span className="text-[#E4C300] font-semibold text-sm">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* RIGHT — solid bg color */}
        <div className="bg-[#131627] py-16">
          <div className="section">
            <Reveal delay={0.1}>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                What BrickShare Capital is not
              </h2>
              <p className="mt-2 text-sm text-[#E4C300] font-regular">
                Important clarity:
              </p>
              <div className="my-3 h-px w-1/2 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
              <ul className="mt-6 space-y-4">
                {notList.map((n) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 font-semibold shrink-0 place-items-center rounded-full text-[#E35A5A]">
                      <X size={20} />
                    </span>
                    <span className="text-white font-regular text-sm">{n}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-[#E35A5A] font-regular">
                *BrickShare Capital does not provide financial, legal, or
                investment advice.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ LOCAL FOCUS ------------------------------- */
function LocalFocus() {
  return (
    <section className="relative overflow-hidden py-16 homelocal bg-cover bg-center bg-no-repeat">
      <div className="section relative z-10 py-16 items-center ">
        <Reveal>
          <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
            Local focus. Long-term perspective.
          </h2>
          <p className="mt-4  font-regular text-[#131627]">
            Houston remains one of the most resilient and diverse real-estate
            markets in the U.S.
          </p>
          <p className="mt-2 text-sm text-[#152FC2] font-semibold">
            We stay close to the ground. We stay selective. We stay disciplined.
          </p>
          <Link to='/projects' className="">
            <button className="flex items-center mt-7 shadow-[0px_4px_11.5px_0px_#988723] gap-2 rounded-full border border-[#FEDF27] bg-[#131627] px-5 py-2.5 text-sm font-regular text-[#FEDF27] transition hover:opacity-90">
              <ArrowUpRight size={20} />
              Explore Opportunities
            </button>
          </Link>
        </Reveal>
        {/* empty right col keeps grid spacing so image shows through */}
        <div />
      </div>
    </section>
  );
}

/* ------------------------------- GET IN TOUCH ----------------------------- */
function GetInTouch() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (!form.name || !form.email) return setErr("Name and email required.");
    setBusy(true);
    try {
      await api.submitContact({ ...form, source: "home" });
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-[linear-gradient(180deg,_#FFFFFF_0%,_#FFE7BA_100%)] py-16">
      <div className="section">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold text-[#131627]">
            Get In Touch
          </h2>
          <p className="mt-2 text-center text-[#111111] font-regular">Start With Intention</p>
          <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          <div className="mt-4 flex justify-center">
            <span className="rounded-lg bg-[#131627] border border-[#131627] px-4 py-1.5 text-xs font-medium text-[#E4C300]">
              No pressure. No urgency tactics. Just informed access to real
              assets.
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-sm font-semibold text-[#131627]">
                Explore Opportunities with
              </p>
              <h3 className="text-2xl font-semibold text-[#131627]">
                BrickShare Capital
              </h3>
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(180deg,_#FFE966_0%,_#AC960F_100%)] text-[#131627]">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="font-regular text-sm text-[#131627]">Location</p>
                    <p className="text-sm font-semibold text-[#131627]">{contact.location}</p>
                  </div>
                </div>
                 <div className="my-3 h-px w-full bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(180deg,_#FFE966_0%,_#AC960F_100%)] text-[#131627]">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="font-regular text-sm text-[#131627]">Email</p>
                    {contact.emails.map((e) => (
                      <p key={e} className="text-sm font-semibold text-[#131627]">
                        {e}
                      </p>
                    ))}
                  </div>
                  
                </div>
                 <div className=" my-3 h-px w-full bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
              </div>
              <div className="mt-8 flex gap-10">
                <div>
                  <p className="text-3xl font-semibold text-[#D2990A]">
                    $2,500
                  </p>
                  <p className="text-sm font-regular text-[#D2990A]">Minimum Participation</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-[#D2990A]">100%</p>
                  <p className="text-sm  font-regular text-[#D2990A]">Transparency Focused</p>
                </div>
              </div>
            </div>
          </Reveal>

        <Reveal delay={0.1}>
  <div className="rounded-2xl bg-white p-7 border border-[#F7DC3F]">
    <h3 className="text-lg font-semibold text-[#000000]">
      Request More Information
    </h3>
    <div className="mt-5 space-y-4">
      {[
        { k: "name", label: "Your Name", type: "text" },
        { k: "phone", label: "Your Phone", type: "tel" },
        { k: "email", label: "Your Email", type: "email" },
      ].map((f) => (
        <div key={f.k} className="relative">
          <input
            id={`gt-${f.k}`}
            type={f.type}
            placeholder=" "
            value={(form as any)[f.k]}
            onChange={set(f.k)}
            className="peer w-full rounded-xl border border-gold-400/60 bg-white px-4 py-2.5 text-ink outline-none focus:border-gold-500"
          />
          <label
            htmlFor={`gt-${f.k}`}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-ink/60 transition-all duration-200
              peer-focus:top-0 peer-focus:text-xs
              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
          >
            {f.label}
          </label>
        </div>
      ))}

      <div className="relative">
        <textarea
          id="gt-message"
          placeholder=" "
          rows={3}
          value={form.message}
          onChange={set("message")}
          className="peer w-full rounded-xl border border-gold-400/60 bg-white px-4 py-2.5 text-ink outline-none focus:border-gold-500"
        />
        <label
          htmlFor="gt-message"
          className="pointer-events-none absolute left-3 top-4 bg-white px-1 text-sm text-ink/60 transition-all duration-200
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Your Message
        </label>
      </div>

      {err && <p className="text-sm text-red-500">{err}</p>}
      <button
        onClick={submit}
        disabled={busy || sent}
        className="w-full rounded-full bg-[#131627] border border-[#FEDF27] py-3.5 font-regular text-[#FEDF27] shadow-gold transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {sent ? "Sent ✓ — Check your inbox" : busy ? "Sending…" : "Get Started"}
      </button>
    </div>
  </div>
</Reveal>
        </div>
      </div>
    </section>
  );
}
