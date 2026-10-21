import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronUp, Expand, ImageOff } from "lucide-react";
import { PageHero } from "../components/ui";
import Reveal from "../components/Reveal";
import Lightbox from "../components/Lightbox";
import { images } from "../config/site";
import { api, type GalleryItem } from "../lib/api";
import { useSeo, pageSeo } from "../lib/seo";

const PHOTOS_STEP = 12; // photos shown per step ("Load more" reveals more)
const BA_GROUPS_STEP = 4; // before/after groups shown per step

type Group = { title: string; items: GalleryItem[] };

/** Before & After: images with the same caption (case-insensitive) are shown together under one caption.
 *  Images without a caption are collected into one untitled group at the end. */
function groupByCaption(list: GalleryItem[]): Group[] {
  const map = new Map<string, Group>();
  const untitled: GalleryItem[] = [];
  for (const it of list) {
    const title = (it.title || "").trim();
    if (!title) {
      untitled.push(it);
      continue;
    }
    const key = title.toLowerCase();
    if (!map.has(key)) map.set(key, { title, items: [] });
    map.get(key)!.items.push(it);
  }
  const groups = [...map.values()];
  if (untitled.length) groups.push({ title: "", items: untitled });
  return groups;
}

export default function Gallery() {
  useSeo(pageSeo("/gallery"));

  const [photos, setPhotos] = useState<GalleryItem[] | null>(null);
  const [pairs, setPairs] = useState<GalleryItem[] | null>(null);
  const [showPhotos, setShowPhotos] = useState(PHOTOS_STEP);
  const [showPairGroups, setShowPairGroups] = useState(BA_GROUPS_STEP);
  const photosRef = useRef<HTMLElement>(null);
  const pairsRef = useRef<HTMLElement>(null);
  // "Show less": collapse back to the first step and scroll to the section top
  const collapse = (reset: () => void, ref: React.RefObject<HTMLElement>) => {
    reset();
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Lightbox browses all photos, or only the clicked before/after group
  const [box, setBox] = useState<{ items: GalleryItem[]; i: number } | null>(null);

  useEffect(() => {
    api.getGallery("gallery").then(setPhotos).catch(() => setPhotos([]));
    api.getGallery("beforeAfter").then(setPairs).catch(() => setPairs([]));
  }, []);

  const pairGroups = useMemo(() => groupByCaption(pairs || []), [pairs]);
  // keep every card the same height when at least one photo has a caption
  const anyPhotoCaption = (photos || []).some((p) => (p.title || "").trim());

  return (
    <>
      <PageHero
        image={images.heroGallery}
        title={
          <>
            Our Gallery
            <br />
            <span className="text-white">Every project, up close.</span>
          </>
        }
      />

      {/* ------------------------------ PHOTOS ------------------------------ */}
      <section
        ref={photosRef}
        className="scroll-mt-20 bg-[linear-gradient(180deg,#FFFFFF_16.53%,#FFE7BA_101.29%)] py-16 sm:py-20"
      >
        <div className="section">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
              Project <span className="text-gold-500">Gallery</span>
            </h2>
            <div className="mx-auto my-4 h-px w-1/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p className="mx-auto max-w-2xl text-[#111111]">
              Real homes, real finishes. A look inside the properties we have renovated, rebuilt
              and built from the ground up across Houston.
            </p>
          </Reveal>

          {photos === null ? (
            <SkeletonGrid />
          ) : photos.length === 0 ? (
            <Empty text="Gallery photos will appear here soon." />
          ) : (
            <>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {photos.slice(0, showPhotos).map((p, i) => (
                  <Reveal key={p._id} delay={(i % 3) * 0.06} className="h-full">
                    <PhotoCard
                      item={p}
                      reserveCaption={anyPhotoCaption}
                      onOpen={() => setBox({ items: photos, i })}
                    />
                  </Reveal>
                ))}
              </div>
              {(photos.length > showPhotos || showPhotos > PHOTOS_STEP) && (
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {photos.length > showPhotos && (
                    <MoreButton onClick={() => setShowPhotos((n) => n + PHOTOS_STEP)}>
                      Load more photos
                    </MoreButton>
                  )}
                  {showPhotos > PHOTOS_STEP && (
                    <LessButton onClick={() => collapse(() => setShowPhotos(PHOTOS_STEP), photosRef)}>
                      Show less
                    </LessButton>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* --------------------------- BEFORE / AFTER --------------------------- */}
      {(pairs === null || pairs.length > 0) && (
        <section ref={pairsRef} className="scroll-mt-20 bg-[#FFFDF1] py-16 sm:py-20">
          <div className="section">
            <Reveal className="text-center">
              <h2 className="text-3xl font-semibold text-[#131627] sm:text-4xl">
                Before <span className="text-gold-500">&amp;</span> After
              </h2>
              <div className="mx-auto my-4 h-px w-1/3 bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
              <p className="mx-auto max-w-2xl font-semibold text-[#131627]">
                We take houses from what they are to what they should have been.
              </p>
            </Reveal>

            {pairs === null ? (
              <div className="mx-auto mt-10 h-72 max-w-6xl animate-pulse rounded-3xl bg-gold-400/15" />
            ) : (
              <>
                <div className="mx-auto mt-10 max-w-6xl space-y-8">
                  {pairGroups
                    .slice(0, showPairGroups)
                    // Untitled before/after images: one card each, as before
                    .flatMap((g) => (g.title ? [g] : g.items.map((it) => ({ title: "", items: [it] }))))
                    .map((card) => (
                      <Reveal key={card.title || card.items[0]._id} delay={0.05}>
                        <figure className="overflow-hidden rounded-3xl border border-gold-400/40 bg-white p-3 shadow-soft sm:p-4">
                          {card.title && (
                            <figcaption className="flex items-center justify-between gap-3 px-2 pb-4 pt-1">
                              <span className="text-lg font-semibold text-[#131627]">{card.title}</span>
                              {card.items.length > 1 && (
                                <span className="shrink-0 rounded-full bg-gold-400/25 px-3 py-1 text-xs font-semibold text-[#131627]">
                                  {card.items.length} images
                                </span>
                              )}
                            </figcaption>
                          )}
                          <div className="space-y-4">
                            {card.items.map((p, i) => (
                              <motion.button
                                key={p._id}
                                type="button"
                                whileHover={{ y: -3 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                onClick={() => setBox({ items: card.items, i })}
                                aria-label={card.title || "Open before and after image"}
                                className="group relative block w-full cursor-zoom-in"
                              >
                                <img
                                  src={p.url}
                                  alt={card.title || "Before and after"}
                                  loading="lazy"
                                  className="h-auto w-full rounded-2xl object-contain"
                                />
                                <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-[#FEDF27] text-[#131627] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  <Expand size={14} />
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        </figure>
                      </Reveal>
                    ))}
                </div>
                {(pairGroups.length > showPairGroups || showPairGroups > BA_GROUPS_STEP) && (
                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    {pairGroups.length > showPairGroups && (
                      <MoreButton onClick={() => setShowPairGroups((n) => n + BA_GROUPS_STEP)}>
                        Show more transformations
                      </MoreButton>
                    )}
                    {showPairGroups > BA_GROUPS_STEP && (
                      <LessButton
                        onClick={() => collapse(() => setShowPairGroups(BA_GROUPS_STEP), pairsRef)}
                      >
                        Show less
                      </LessButton>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ----------------------------- LET'S TALK ----------------------------- */}
      <section className="how-it-works-cta relative overflow-hidden bg-cover bg-center bg-no-repeat py-16 sm:py-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(253,252,251,0.85) 0%, rgba(226,209,195,0.85) 100%)",
          }}
        />
        <div className="section relative z-10">
          <Reveal>
            <h2 className="text-4xl font-bold text-[#E4B300] sm:text-[46px] sm:leading-none">
              Let's talk
            </h2>
            <p className="mt-4 max-w-lg text-lg text-[#131627] sm:text-xl">
              Like what you see?
            </p>
            <p className="mt-2 max-w-lg text-lg text-[#131627] sm:text-xl">
              Whether you're selling a house that needs work, looking for a finished home, or
              partnering on a project, we'd like to hear about it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/projects">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-full border border-[#FEDF27] bg-[#131627] py-2 pl-2 pr-5 text-sm font-semibold text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[#FEDF27]">
                    <ArrowUpRight size={14} />
                  </span>
                  Explore Opportunities
                </motion.span>
              </Link>
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-full border border-[#131627] bg-white py-2 pl-2 pr-5 text-sm font-semibold text-[#131627] shadow-soft"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[#131627]">
                    <ArrowUpRight size={14} />
                  </span>
                  Contact Us
                </motion.span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Lightbox
        items={box?.items || []}
        index={box?.i ?? null}
        onClose={() => setBox(null)}
        onIndex={(i) => setBox((b) => (b ? { ...b, i } : b))}
      />
    </>
  );
}

/* ------------------------------- helpers --------------------------------- */
function MoreButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-[#FEDF27] bg-[#131627] px-6 py-3 text-sm font-semibold text-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723] transition hover:opacity-90"
    >
      <ArrowUpRight size={18} /> {children}
    </button>
  );
}

/** One photo card: caption on top, image below (same style as the Before & After cards). */
function PhotoCard({
  item,
  reserveCaption,
  onOpen,
}: {
  item: GalleryItem;
  reserveCaption: boolean;
  onOpen: () => void;
}) {
  const title = (item.title || "").trim();
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      aria-label={title || "Open photo"}
      className="group flex h-full w-full cursor-zoom-in flex-col overflow-hidden rounded-3xl border border-gold-400/40 bg-white p-3 text-left shadow-soft"
    >
      {(title || reserveCaption) && (
        <span className="flex min-h-[2.25rem] items-center justify-between gap-3 px-1 pb-3">
          <span className="line-clamp-1 font-semibold text-[#131627]">{title}</span>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold-400/60 text-[#131627] transition group-hover:bg-gold-400">
            <Expand size={13} />
          </span>
        </span>
      )}
      <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#131627]/5">
        <img
          src={item.url}
          alt={title || "Gallery photo"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.15")}
        />
      </span>
    </motion.button>
  );
}

function LessButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-[#131627] bg-white px-6 py-3 text-sm font-semibold text-[#131627] shadow-soft transition hover:opacity-90"
    >
      <ChevronUp size={18} /> {children}
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-gold-400/30 bg-white p-3">
          <div className="mb-3 h-5 w-1/2 animate-pulse rounded bg-gold-400/20" />
          <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-gold-400/15" />
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gold-400/60 bg-white/60 py-16 text-[#131627]/60">
      <ImageOff size={28} />
      <p>{text}</p>
    </div>
  );
}