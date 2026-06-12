import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Dot } from "lucide-react";
import {
  PageHero,
  ProjectCard,
  CTAButton,
  Loader,
  type PlanLike,
} from "../components/ui";
import Reveal from "../components/Reveal";
import { images } from "../config/site";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { useSeo, pageSeo } from "../lib/seo";

const reasons = [
  "Professionally vetted real estate projects",
  "Transparent financials and timelines",
  "Low minimum investment access",
  "Focused on long-term, sustainable returns",
  "Houston-centric market expertise",
];

export default function Projects() {
  useSeo(pageSeo("/projects"));
  const [plans, setPlans] = useState<PlanLike[] | null>(null);
  useEffect(() => {
    api
      .getPlans()
      .then(setPlans)
      .catch(() => setPlans([]));
  }, []);

  return (
    <>
      <PageHero
        image={images.heroProjects}
        title={
          <>
            Featured Investment
            <br />
            Opportunities
          </>
        }
        align="right"
      />

      {/* Intro + grid */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7BA_100%)] py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#131627] sm:text-4xl">
              Real Projects. Real Returns.
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mx-auto mt-5 max-w-2xl text-center text-[#131627] font-regular">
              Explore carefully vetted real estate investment opportunities
              across Houston. Each project is professionally analyzed,
              transparently structured, and designed to deliver attractive,
              risk-adjusted returns.
            </p>
          </Reveal>

          <div className="mt-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#D0B40D_0%,#FFEF90_100%)] border border-[#C1A814] px-5 py-2 text-sm font-medium text-[#111111]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" /> All
              Projects
            </span>
          </div>

          {plans === null ? (
            <Loader label="Loading opportunities…" />
          ) : plans.length === 0 ? (
            <p className="mt-12 text-center text-ink/50">
              No opportunities available right now.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((p, i) => (
                <ProjectCard key={p._id || i} p={p} index={i} />
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link to="/contact">
              <button className="flex items-center gap-2 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-regular px-6 py-3 rounded-full text-sm hover:opacity-90">
                <ArrowUpRight size={18} />
                Explore Opportunities
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why invest */}
      <section className="bg-white py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-[#131627] sm:text-4xl">
              Why Invest with{" "}
              <span className="text-[#E4C300]">Brickshare Capital?</span>
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl bg-[linear-gradient(180deg,#D0B40D_0%,#FFEF90_100%)] p-8 border border-[#C1A814]">
                <ul className="space-y-5">
                  {reasons.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-[#111111">
                      <span className="mt-2 grid h-2 w-2 place-items-center rounded-full bg-[#111111] text-[#111111]">
                      </span>
                      <span className="font-medium">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <motion.img
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                src={images.projectsRender}
                alt="Real estate development"
                className="mx-auto max-h-96 w-full object-contain"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
