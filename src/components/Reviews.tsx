import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, X } from "lucide-react";
import { api } from "../lib/api";
import Reveal from "./Reveal";

type Review = {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  rating?: number;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(3);
  const [open, setOpen] = useState(false);

  // responsive items-per-view
  useEffect(() => {
    const calc = () =>
      setPerView(
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3,
      );
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const load = () =>
    api
      .getReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  useEffect(() => {
    load();
  }, []);

  const pages = Math.max(1, Math.ceil(reviews.length / perView));
  useEffect(() => {
    if (page >= pages) setPage(0);
  }, [pages, page]);

  // auto-slide
  useEffect(() => {
    if (pages <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pages), 5000);
    return () => clearInterval(t);
  }, [pages]);

  const start = page * perView;
  const visible = reviews.slice(start, start + perView);

  return (
    <section className="bg-white py-16">
      <div className="section">
        <Reveal>
          <h2 className="flex items-center justify-center gap-3 text-center text-2xl font-semibold text-[#131627] sm:text-3xl">
            " Participant Perspectives "
          </h2>
        </Reveal>

        {reviews.length === 0 ? (
          <p className="mt-10 text-center text-ink/50">
            No reviews yet — be the first to share.
          </p>
        ) : (
          <div className="mt-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {visible.map((t) => (
                  <div
                    key={t._id}
                    className="flex h-full flex-col rounded-2xl bg-[linear-gradient(90deg,_#FDFCFB_0%,_#E2D1C3_100%)] p-6  border border-[#E4C300]"
                  >
                    {t.rating ? (
                      <div className="mb-2 flex gap-0.5 text-gold-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    ) : null}
                    <p className="flex-1 text-sm leading-relaxed sfont-regular text-[#131627]">
                      "{t.quote}"
                    </p>
                    <div className="mx-auto my-3 h-px w-full bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
                    <p className="mt-4 text-sm font-semibold text-[#131627]">
                      — {t.name}
                    </p>
                    {t.location && (
                      <p className="text-sm text-[#131627] font-semibold">
                        {t.location}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* dots */}
            {pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === page ? "w-8 bg-[#E4C300]" : "w-2 bg-[#E3DAA3]"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#131627] text-[#FEDF27] font-regular text-sm rounded-full px-4 py-2 border border-[#FEDF27] hover:opacity-90"
          >
            Share Your Experience
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <ReviewModal
            onClose={() => setOpen(false)}
            onDone={() => {
              setOpen(false);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    quote: "",
    rating: 5,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.quote)
      return setErr("Please add your name and review.");
    setBusy(true);
    try {
      await api.submitReview(form);
      onDone();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#131627]">
            Share Your Experience
          </h3>
          <button onClick={onClose} className="text-ink/50 hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={set("name")}
            className="w-full rounded-xl border border-gold-400/60 px-4 py-3 outline-none focus:border-gold-500"
          />
          <input
            placeholder="Location (e.g. Houston, TX)"
            value={form.location}
            onChange={set("location")}
            className="w-full rounded-xl border border-gold-400/60 px-4 py-3 outline-none focus:border-gold-500"
          />
          <textarea
            placeholder="Your review"
            rows={4}
            value={form.quote}
            onChange={set("quote")}
            className="w-full rounded-xl border border-gold-400/60 px-4 py-3 outline-none focus:border-gold-500"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink/70">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
              >
                <Star
                  size={22}
                  className={n <= form.rating ? "text-gold-500" : "text-ink/20"}
                  fill={n <= form.rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex justify-center py-3">
            <button
              onClick={submit}
              disabled={busy}
              className="bg-[#131627] justify-center items-center flex text-center text-[#FEDF27] font-regular text-sm rounded-full px-4 py-2 border border-[#FEDF27] hover:opacity-90"
            >
              {busy ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
