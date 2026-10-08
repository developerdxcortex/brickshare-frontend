import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Check, TrendingUp, DollarSign, Building2, Clock, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Loader } from "../components/ui";
import Reveal from "../components/Reveal";
import { api } from "../lib/api";
import { useSeo } from "../lib/seo";
import { findPlanDetailExtra } from "../data/planDetails";

export default function PlanDetail() {
  const { id } = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getPlan(id).then(setPlan).catch(() => setNotFound(true));
  }, [id]);

  useSeo({
    title: plan
      ? `${plan.name} — ${plan.city} | BrickShare Capital`
      : "Investment Opportunity | BrickShare Capital",
    description: plan
      ? `${plan.name} in ${plan.city}. ${plan.type} · Min. investment ${plan.minInvestment} · Target return ${plan.targetReturn}. ${plan.tagline || ""}`.trim()
      : "Explore a featured Houston real estate investment opportunity with BrickShare Capital.",
    path: `/projects/${id || ""}`,
    image: plan?.image,
  });

  if (notFound)
    return (
      <div className="section py-32 text-center">
        <p className="text-ink/60">This opportunity could not be found.</p>
        <Link to="/projects" className="btn-dark mt-6 inline-flex">Back to Projects</Link>
      </div>
    );
  if (!plan) return <Loader label="Loading opportunity…" />;

  const extra = findPlanDetailExtra(plan.name);

  const stats = [
    { icon: DollarSign, label: "Min. Investment", value: plan.minInvestment },
    { icon: TrendingUp, label: "Target Return", value: plan.targetReturn },
    { icon: Building2, label: "Property Value", value: plan.propertyValue || "—" },
    { icon: Clock, label: "Hold Period", value: plan.holdPeriod || "—" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[360px] w-full overflow-hidden bg-navy sm:h-[440px]">
        <motion.img
          src={plan.image}
          alt={plan.name}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
        <div className="section relative z-10 flex h-full flex-col justify-end pb-10">
          <Link to="/projects" className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-gold-400">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <span className="mb-3 w-fit rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-navy">{plan.status}</span>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{plan.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-white/85">
            <MapPin size={16} className="text-gold-400" /> {plan.location || plan.city} · {plan.type}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-b from-cream to-peach/50 py-12">
        <div className="section grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="rounded-2xl bg-white p-5 text-center shadow-soft">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold-400">
                  <s.icon size={20} />
                </div>
                <p className="mt-3 text-xl font-extrabold text-gold-600">{s.value}</p>
                <p className="text-xs text-ink/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream pb-20">
        <div className="section grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div>
              {plan.tagline && <p className="text-xl font-semibold text-navy">{plan.tagline}</p>}
              <p className="mt-4 leading-relaxed text-ink/75">{plan.description}</p>

              {plan.highlights?.length > 0 && (
                <>
                  <h3 className="mt-8 text-lg font-bold text-ink">Investment Highlights</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {plan.highlights.map((h: string) => (
                      <li key={h} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-soft">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400 text-navy">
                          <Check size={12} />
                        </span>
                        <span className="text-sm text-ink/80">{h}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {extra && (
                <div className="mt-10 space-y-10">
                  {/* Investment Snapshot */}
                  <div>
                    <h3 className="text-lg font-bold text-ink">Investment Snapshot</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {extra.snapshot.map((s) => (
                        <div key={s.label} className="rounded-xl bg-white p-4 text-center shadow-soft">
                          <p className="text-lg font-extrabold text-gold-600">{s.value}</p>
                          <p className="mt-1 text-[11px] text-ink/60">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How It Works — horizontal flow, matches phases style */}
                  {extra.howItWorks && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">How the Investment Works</h3>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {extra.howItWorks.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-soft ring-1 ring-black/5">
                              <p className="text-sm font-semibold text-ink">{step.label}</p>
                            </div>
                            {i < extra.howItWorks!.length - 1 && (
                              <ArrowRight size={16} className="shrink-0 text-gold-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investment Options — grid, matches financials style */}
                  {extra.options && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">Investment Options</h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {extra.options.map((o) => (
                          <div key={o.title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
                            <p className="text-2xl font-extrabold text-navy">{o.value}</p>
                            <p className="mt-1 text-xs text-ink/60">{o.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Development Phases — horizontal flow */}
                  {extra.phases && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">Development Strategy</h3>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {extra.phases.map((p, i) => (
                          <div key={p.label} className="flex items-center gap-2">
                            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-soft ring-1 ring-black/5">
                              <p className="text-xs font-bold uppercase tracking-wide text-gold-600">{p.label}</p>
                              {p.detail && <p className="mt-0.5 text-sm font-semibold text-ink">{p.detail}</p>}
                            </div>
                            {i < extra.phases!.length - 1 && (
                              <ArrowRight size={16} className="shrink-0 text-gold-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial Projection */}
                  {extra.financials && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">Financial Projection</h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {extra.financials.map((f) => (
                          <div key={f.label} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
                            <p className="text-2xl font-extrabold text-navy">{f.value}</p>
                            <p className="mt-1 text-xs text-ink/60">{f.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Investor Returns */}
                  {extra.returns && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">Target Investor Returns</h3>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {extra.returns.map((r) => (
                          <div key={r.label} className="rounded-xl bg-gold-400/15 p-4 text-center ring-1 ring-gold-400/30">
                            <p className="text-lg font-extrabold text-gold-600">{r.value}</p>
                            <p className="mt-1 text-[11px] text-ink/60">{r.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investor Advantages */}
                  {extra.advantages && (
                    <div>
                      <h3 className="text-lg font-bold text-ink">Investor Advantages</h3>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {extra.advantages.map((a) => (
                          <li key={a} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-soft">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400 text-navy">
                              <Check size={12} />
                            </span>
                            <span className="text-sm text-ink/80">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

              {/* Documents (dynamic, from admin panel) */}
              {plan.documents?.length > 0 && (
                <div className="mt-10 space-y-3 pb-2">
                  <h3 className="text-lg font-bold text-ink">Documents</h3>
                  {plan.documents.map((doc: { label: string; url: string }, i: number) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex max-w-md items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-card"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-gold-400">
                        <FileText size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-ink">View Document</span>
                        <span className="block truncate text-xs text-ink/55">{doc.label}</span>
                      </span>
                      <ExternalLink size={16} className="shrink-0 text-ink/40" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Funding sidebar */}
          <Reveal delay={0.1}>
            <div className="sticky top-24 mt-2 rounded-2xl bg-navy p-7 text-white shadow-card lg:mt-0">
              <p className="text-sm text-white/60">Funding Progress</p>
              <p className="mt-1 text-3xl font-extrabold text-gold-400">{plan.fundedPercent || 0}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gold-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, plan.fundedPercent || 0)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <Row label="Minimum" value={plan.minInvestment} />
                <Row label="Target Return" value={plan.targetReturn} />
                <Row label="Hold Period" value={plan.holdPeriod || "—"} />
                <Row label="Status" value={plan.status} />
              </div>
              <Link to="/contact" className="btn-gold mt-6 w-full">Request to Participate</Link>
              <p className="mt-3 text-center text-[11px] text-white/40">
                Illustrative only. Participation carries risk.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}