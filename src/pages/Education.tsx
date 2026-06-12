import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { PageHero, CTAButton, Loader } from "../components/ui";
import Reveal from "../components/Reveal";
import { images, articleCategories } from "../config/site";
import { api } from "../lib/api";
import { useSeo, pageSeo } from "../lib/seo";

type Article = {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  image?: string;
};

export default function Education() {
  useSeo(pageSeo("/education"));
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [visible, setVisible] = useState(6);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api
      .getArticles()
      .then(setArticles)
      .catch(() => setArticles([]));
  }, []);

  return (
    <>
      <PageHero
        image={images.heroEducation}
        title={
          <>
            Master the Fundamentals of
            <br />
            Real Estate Investing
          </>
        }
      />

      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7BA_100%)] py-16 sm:py-20">
        <div className="section">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold text-[#131627] sm:text-4xl">
              Learn. <span className="text-[#E4C300]">Invest.</span> Grow.
            </h2>
            <div className="mx-auto my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mt-5 text-center text-[#131627] font-regular">
              Practical guides and market insights to help you make confident
              real estate investment decisions.
            </p>
          </Reveal>

          {/* Categories */}
          <div className="mt-8 flex justify-center">
            <span className="rounded-full bg-[linear-gradient(180deg,#D0B40D_0%,#FFEF90_100%)] px-5 py-2 text-sm font-medium border border-[#C1A814] text-[#111111]">
              Explore by Category
            </span>
          </div>
          <div className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articleCategories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="cursor-pointer rounded-xl border border-[#E4C300] bg-white px-5 py-4 text-center shadow-soft"
                >
                  <p className="font-medium text-[#111111]">{c.name}</p>
                  <p className="mt-1 text-sm font-medium text-[#111111]">
                    {c.count}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Latest articles */}
          <div className="mt-16">
            <Reveal>
              <h3 className="text-2xl font-semibold text-[#131627] sm:text-3xl">
                Latest Articles
              </h3>
              <p className="mt-1 text-sm text-[#131627] font-regular">
                Expert insights and practical guidance for real estate investors
              </p>
            </Reveal>

            {articles === null ? (
              <Loader label="Loading articles…" />
            ) : articles.length === 0 ? (
              <p className="mt-10 text-center text-ink/50">
                No articles published yet.
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.slice(0, visible).map((a, i) => (
                  <Reveal key={a._id} delay={(i % 3) * 0.08}>
                    <Link to={`/education/${a._id}`} className="block h-full">
                      <motion.article
                        whileHover={{ y: -6 }}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={a.image}
                            alt={a.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) =>
                              ((
                                e.currentTarget as HTMLImageElement
                              ).style.opacity = "0.15")
                            }
                          />
                          <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy">
                            {a.category}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h4 className="text-lg font-bold leading-snug text-ink">
                            {a.title}
                          </h4>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                            {a.excerpt}
                          </p>
                          <div className="mt-5 flex items-center justify-between">
                            <span className="text-sm font-medium text-ink/60">
                              {a.readTime}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-navy-700">
                              <BadgeCheck size={15} className="text-gold-400" />{" "}
                              Read More
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}

            {articles && visible < articles.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible(articles.length)}
                  className="btn-dark"
                >
                  <ArrowUpRight size={18} /> Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA band */}
      {/* CTA band — full-width bg image, text overlay left */}
      <section className="relative w-full overflow-hidden">
        <img
          src={images.eduCta}
          alt="Houston skyline"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
          }
        />

        <div className="section relative z-10 py-16 sm:py-24">
          <Reveal>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold leading-tight text-[#E4C300] sm:text-4xl">
                Ready to Put Your <br /> Knowledge Into Action?
              </h2>
              <p className="mt-4 text-[#131627] font-medium">
                Start building your real estate portfolio with as little as
                $100.
              </p>
              <div className="mt-7">
                <Link to="/projects">
                  <button className="flex items-center gap-2 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90">
                    <ArrowUpRight size={18} />
                    Explore Opportunities
                  </button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden stay-know bg-center bg-cover bg-no-repeat py-16 text-white">
        <div className="relative z-10 max-w-3xl px-6 sm:px-10 lg:px-16">
          <Reveal>
            {/* heading + right tak line */}
            <div className="flex items-center gap-4">
              <h2 className="whitespace-nowrap text-2xl font-semibold sm:text-3xl">
                Stay in the Know
              </h2>
            </div>

            <div className="my-3 h-px w-2/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mt-3 text-white font-regular text-sm">
              Get weekly market updates, investing insights, and educational
              resources delivered straight to your inbox.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-[#E4C300] bg-white px-5 py-2 text-[#131627] placeholder:text-[#848484]"
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="whitespace-nowrap flex items-center gap-2 bg-[#131627] border border-[#FEDF27] text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe to Insights"}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
