import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import { CTAButton, Loader } from "../components/ui";
import Reveal from "../components/Reveal";
import { api } from "../lib/api";
import { useSeo } from "../lib/seo";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getArticle(id).then(setArticle).catch(() => setNotFound(true));
  }, [id]);

  useSeo({
    title: article
      ? `${article.title} | BrickShare Capital`
      : "Article | BrickShare Capital",
    description: article?.excerpt
      ? article.excerpt
      : "Read real estate investing insights and guides from BrickShare Capital.",
    path: `/education/${id || ""}`,
    image: article?.image,
  });

  if (notFound)
    return (
      <div className="section py-32 text-center">
        <p className="text-ink/60">This article could not be found.</p>
        <Link to="/education" className="btn-dark mt-6 inline-flex">Back to Education</Link>
      </div>
    );
  if (!article) return <Loader label="Loading article…" />;

  const paragraphs = String(article.content || "").split(/\n+/).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[320px] w-full overflow-hidden bg-navy sm:h-[400px]">
        <motion.img
          src={article.image}
          alt={article.title}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
        <div className="section relative z-10 flex h-full flex-col justify-end pb-10">
          <Link to="/education" className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-gold-400">
            <ArrowLeft size={16} /> Back to Education
          </Link>
          <span className="mb-3 w-fit rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-navy">{article.category}</span>
          <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">{article.title}</h1>
          <div className="mt-3 flex items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-1"><User size={14} className="text-gold-400" /> {article.author}</span>
            <span className="flex items-center gap-1"><Clock size={14} className="text-gold-400" /> {article.readTime}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream py-16">
        <div className="section max-w-3xl">
          <Reveal>
            {article.excerpt && (
              <p className="mb-8 border-l-4 border-gold-400 pl-5 text-lg font-medium text-ink/80">
                {article.excerpt}
              </p>
            )}
            <div className="space-y-5 text-ink/80 leading-relaxed">
              {paragraphs.length > 0
                ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
                : <p className="text-ink/50">Full article content coming soon.</p>}
            </div>
          </Reveal>

          <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white">
            <h3 className="text-xl font-bold text-gold-400">Ready to put this into action?</h3>
            <p className="mt-2 text-white/70">Start building your real estate portfolio with as little as $100.</p>
            <div className="mt-6 flex justify-center">
              <CTAButton to="/projects" variant="gold">Explore Opportunities</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
