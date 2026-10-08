import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Dot } from "lucide-react";
import {
  PageHero,
  ProjectCard,
  CTAButton,
  Loader,
  type PlanLike,
} from "../components/ui";
import Reveal from "../components/Reveal";
import { images, documents } from "../config/site";
import { api } from "../lib/api";
import { useSeo, pageSeo } from "../lib/seo";
import PitchDeckViewer from "../components/PitchDeckViewer";
import { FileText } from "lucide-react";

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
  const [showDeck, setShowDeck] = useState(false);
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
              Real Estate Opportunities, Built Around Real Assets
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mx-auto mt-5 max-w-2xl text-center text-[#131627] font-regular">
              Explore curated real-estate participation opportunities across Houston and Texas, with clear project information, investment structures and supporting documentation.
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
            <div className="mt-10 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((p, i) => {
                const isLastAndAlone = plans.length % 2 !== 0 && i === plans.length - 1;
                return (
                  <div
                    key={p._id || i}
                    className={
                      isLastAndAlone
                        ? "h-full sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full"
                        : "h-full"
                    }
                  >
                    <ProjectCard p={p} index={i} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowDeck(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#D0B40D_0%,#FFEF90_100%)] border border-[#C1A814] px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition-transform hover:scale-[1.02]"
            >
              <FileText size={16} />
              View Investor Pitch Deck
            </button>
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

      {showDeck && (
        <PitchDeckViewer
          fileUrl={documents.investorPitchDeck}
          onClose={() => setShowDeck(false)}
        />
      )}
    </>
  );
}