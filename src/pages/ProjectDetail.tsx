import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { ourWorkProjects } from "../config/site";
import { useSeo, pageSeo } from "../lib/seo";

const CARDS_PER_PAGE = 4;

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = ourWorkProjects.find((p) => p.slug === slug);
  const idx = ourWorkProjects.findIndex((p) => p.slug === slug);

  useSeo(
    project 
      ? {
          ...pageSeo("/our-work"),
          title: `${project.title} | Our Work | Prominent Global Investments LLC`,
          description: project.description,
        }
      : pageSeo("/our-work")
  );

  // Other projects (excluding the current one), for the "Our Projects" carousel
  const otherProjects = useMemo(
    () => ourWorkProjects.filter((p) => p.slug !== slug),
    [slug]
  );

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(otherProjects.length / CARDS_PER_PAGE);

  const visibleProjects = useMemo(
    () =>
      otherProjects.slice(
        page * CARDS_PER_PAGE,
        page * CARDS_PER_PAGE + CARDS_PER_PAGE
      ),
    [otherProjects, page]
  );

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (!project) return <Navigate to="/our-work" replace />;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.address}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1c] via-[#0b0e1c]/10 to-transparent" />
        <div className="absolute bottom-8 left-0 w-full">
          <div className="section">
            <p className="text-sm font-semibold tracking-widest text-gold-400">
              PROJECT {project.number}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">
              {project.location}
            </h1>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-white py-14 sm:py-16">
        <div className="section grid gap-10 border-b border-black/10 pb-8 lg:grid-cols-[1fr_240px]">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
              {project.title}
            </h2>
            <p className="mt-3 font-medium text-[#131627]/70">{project.address}</p>
            <p className="mt-5 max-w-2xl text-[#111111]">{project.description}</p>

            {project.features.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-gold-400/50 bg-[#FAFAFA] px-4 py-2 text-xs font-semibold text-[#131627]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.06}>
            <div className="border-l-2 border-gold-500 pl-4">
              <p className="text-sm text-[#131627]/60">Project Type</p>
              <p className="mt-1 font-semibold text-[#131627]">{project.projectType}</p>
            </div>
          </Reveal>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="section mt-10 grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-4">
            {project.gallery.map((img, i) => (
              <Reveal key={img + i} delay={(i % 4) * 0.05}>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={img}
                    alt={`${project.address} ${i + 1}`}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Our Projects carousel */}
      <section className="bg-[#FFFDF1] py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#131627] sm:text-4xl">
              Our <span className="text-gold-500">Projects</span>
            </h2>
            <div className="mx-auto my-4 h-px w-1/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
          </Reveal>

          <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((p, i) => (
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

          {/* Pagination arrows */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={goPrev}
                disabled={page === 0}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#131627]/20 bg-white text-[#131627] transition disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-[#131627] hover:enabled:text-white"
                aria-label="Previous projects"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={goNext}
                disabled={page === totalPages - 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#131627]/20 bg-white text-[#131627] transition disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-[#131627] hover:enabled:text-white"
                aria-label="Next projects"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Let's talk CTA — same as Our Work page */}
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