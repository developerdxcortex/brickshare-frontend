import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { PageHero, CTAButton } from "../components/ui";
import Reveal from "../components/Reveal";
import { images } from "../config/site";
import { Link } from "react-router-dom";
import { useSeo, pageSeo } from "../lib/seo";

const steps = [
  {
    n: 1,
    img: "/images/S1.webp",
    title: "Select an Investment Opportunity",
    desc: "Browse our curated selection of Houston-based real estate projects. Every opportunity is carefully reviewed to ensure quality, transparency, and long-term potential.",
    label: "What we provide:",
    points: [
      "Independent property evaluations",
      "Clear financial projections & timelines",
      "Risk assessment and investment summaries",
      "Structured legal documentation",
    ],
    note: "You invest with confidence, not guesswork.",
  },
  {
    n: 2,
    img: "/images/S2.webp",
    title: "Complete Investor Verification (KYC)",
    desc: "To comply with securities regulations and protect our investor community, we require a simple identity verification process.",
    label: "Quick & secure process includes:",
    points: [
      "Identity verification (KYC)",
      "Secure bank account linking",
      "Accredited investor verification (if applicable)",
      "Typically completed in under 5 minutes",
    ],
    note: "Your information is encrypted and protected.",
  },
  {
    n: 3,
    img: "/images/S3.webp",
    title: "Invest Securely via Escrow",
    desc: "Once verified, you can invest securely through our escrow-backed process. Start small and grow your portfolio at your own pace.",
    label: "Investment features:",
    points: [
      "Secure escrow fund protection",
      "Multiple payment methods supported",
      "Instant investment confirmation",
      "No hidden or surprise fees",
    ],
    note: "Start investing with as little as $100.",
  },
  {
    n: 4,
    img: "/images/S4.webp",
    title: "Track Returns & Grow Your Portfolio",
    desc: "Monitor your investments through your personalized dashboard. Stay informed and in control of your portfolio performance.",
    label: "Investor dashboard includes:",
    points: [
      "Real-time portfolio tracking",
      "Monthly performance updates",
      "Distribution notifications",
      "Reinvestment or withdrawal options",
    ],
    note: "Clarity at every stage of your investment journey.",
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "Low Minimum Investment",
    desc: "Start building wealth with just $100",
  },
  {
    icon: BadgeCheck,
    title: "Houston-Focused Properties",
    desc: "Invest in local projects you can understand and visit",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    desc: "Built with investor protection and regulatory awareness in mind",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Performance",
    desc: "Clear reporting, updates, and real-time tracking",
  },
];

export default function HowItWorks() {
  useSeo(pageSeo("/how-it-works"));
  return (
    <>
      <PageHero
        image={images.heroHowItWorks}
        title={
          <>
            Fractional Real Estate
            <br />
            Investing Made Simple
          </>
        }
      />

      {/* Steps */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7BA_100%)] py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className=" text-center text-2xl font-semibold text-[#131627] sm:text-3xl">
              Four easy steps to start building wealth through Houston real
              estate
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full rounded-2xl border border-[#E4C300] bg-white p-7"
                >
                  <p className="text-2xl font-semibold text-[#E4C300]">
                    Step {s.n}:
                  </p>
                  <img
                    src={s.img}
                    alt={s.title}
                    className="my-4 h-14 w-14 object-contain"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.opacity =
                        "0.3")
                    }
                  />
                  <h3 className="text-lg font-semibold text-[#000000]">
                    {s.title}
                  </h3>
                  <p className="mt-2 mb-10 text-sm leading-relaxed font-regular text-[#111111]">
                    {s.desc}
                  </p>
                  <div className="my-2 h-px max-w-[200px] bg-[linear-gradient(90deg,rgba(21,47,194,0)_0%,#0F228C_52.82%,rgba(10,22,92,0)_100%)]" />
                  <p className="inline-block text-sm font-semibold text-[#152FC2]">
                    {s.label}
                  </p>
                  <div className="my-2 h-px max-w-[200px] bg-[linear-gradient(90deg,rgba(21,47,194,0)_0%,#0F228C_52.82%,rgba(10,22,92,0)_100%)]" />
                  <ul className="mt-10 space-y-2">
                    {s.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2 text-sm font-regular text-[#111111]"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#111111]" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 bg-[#FFF5E3] px-4 py-2 text-sm font-semibold text-[#D2990A]">
                    {s.note}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="relative overflow-hidden bg-[#131627] py-16 text-white sm:py-20 ">
        <div className="section relative z-10">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold sm:text-4xl">
              Why Choose{" "}
              <span className="text-[#E4C300]">
                Fractional Investing with Brickshare?
              </span>
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mt-5 py-3 text-center text-sm text-white font-regular">
              All the benefits of real estate — without traditional barriers
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="flex gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center text-[#E4C300]">
                      <b.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold ">{b.title}</h3>
                      <p className="mt-1 text-sm text-white font-regular">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15}>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={images.hiwWhyChoose}
                  alt="Houston towers"
                  className="h-72 w-full object-cover sm:h-96"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.opacity =
                      "0.2")
                  }
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden how-it-works-cta bg-center bg-cover bg-no-repeat py-20">
        <div className="section relative z-10">
          <Reveal>
            <h2 className="text-3xl font-bold text-[#E4C300] sm:text-4xl">
              Ready to Start Investing?
            </h2>
            <p className="mt-3 max-w-md text-[#131627] font-medium">
              Join a growing community of investors building long-term wealth
              through real estate with Brickshare Capital.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects">
                <button className="flex items-center gap-2 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90">
                  <ArrowUpRight size={18} />
                  Explore Opportunities
                </button>
              </Link>
              <Link to="/contact">
                <button className="flex items-center gap-2 bg-white border border-[#131627] text-[#131627] font-regular px-6 py-3 rounded-full text-sm hover:opacity-90">
                  <ArrowUpRight size={18} />
                  Contact Us
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
        {/* faded skyline silhouette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[url('/images/home-local.jpg')] bg-cover bg-bottom opacity-20 grayscale" />
      </section>
    </>
  );
}
