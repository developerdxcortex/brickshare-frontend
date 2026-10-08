import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Reveal from "./Reveal";

/* -------------------------------------------------------------------------- */
/*  PAGE HERO                                                                  */
/* -------------------------------------------------------------------------- */
export function PageHero({
  image,
  title,
  align = "left",
  height = "h-[340px] sm:h-[420px]",
}: {
  image: string;
  title: React.ReactNode;
  align?: "left" | "right";
  height?: string;
}) {
  return (
    <section className={`relative ${height} w-full overflow-hidden bg-navy`}>
      <motion.img
        src={image}
        alt=""
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/45 to-navy/20" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-5 pb-10 sm:px-8 sm:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`max-w-3xl text-3xl font-medium leading-tight text-[#FEDF27] sm:text-4xl ${
            align === "right" ? "ml-auto text-right" : ""
          }`}
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PROJECT CARD (links to detail page)                                       */
/* -------------------------------------------------------------------------- */
export type PlanLike = {
  _id?: string;
  id?: number | string;
  name: string;
  city: string;
  type: string;
  minInvestment: string;
  targetReturn: string;
  status: string;
  image?: string;
  fundedPercent?: number;
};

export function ProjectCard({ p, index = 0 }: { p: PlanLike; index?: number }) {
  const id = p._id || p.id;
  const inner = (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5"
    >
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.15")}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold text-[#131627]">
          {p.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-[#121212] font-medium">
          <MapPin size={14} className="" /> {p.city}
        </p>
        <p className="mt-1 line-clamp-1 text-sm font-regular text-[#D2990A]">{p.type}</p>

        {typeof p.fundedPercent === "number" && p.fundedPercent > 0 && (
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-[#D2990A]"
                style={{ width: `${Math.min(100, p.fundedPercent)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-[#131627] font-regular">{p.fundedPercent}% funded</p>
          </div>
        )}

        {/* Spacer pushes price row + CTA to the bottom of the card,
            so all cards line up evenly regardless of title/type length */}
        <div className="mt-auto">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xl font-semibold text-[#D2990A]">{p.minInvestment}</p>
              <p className="text-xs text-[#121212] font-regular">Min. Investment</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-[#D2990A]">{p.targetReturn}</p>
              <p className="text-xs text-[#121212] font-regular">Target Return</p>
            </div>
          </div>

          <div className="mt-4 flex w-fit items-center justify-center gap-1.5 rounded-full bg-[#131627] px-3 py-1.5 text-xs font-semibold text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] transition-transform group-hover:scale-[1.02]">
            Explore <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </motion.article>
  );

  return (
    <div className="flex h-full">
      <Reveal delay={(index % 3) * 0.08} className="flex h-full w-full">
        {id ? (
          <Link to={`/projects/${id}`} className="block h-full w-full">
            {inner}
          </Link>
        ) : (
          inner
        )}
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTA BUTTON                                                                 */
/* -------------------------------------------------------------------------- */
export function CTAButton({
  to,
  children,
  variant = "gold",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "gold" | "dark" | "outline";
}) {
  const cls = variant === "gold" ? "btn-gold" : variant === "dark" ? "btn-dark" : "btn-outline";
  return (
    <Link to={to} className={cls}>
      <ArrowUpRight size={18} /> {children}
    </Link>
  );
}

/* Small loading helper */
export function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink/50">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      {label}
    </div>
  );
}