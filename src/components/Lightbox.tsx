import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxItem = { url: string; title?: string };

/** Full-screen image viewer: Esc closes, ← → for prev/next. */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null && items.length > 0;
  const count = items.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(((index as number) + 1) % count);
      if (e.key === "ArrowLeft") onIndex(((index as number) - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, index, count, onClose, onIndex]);

  const item = open ? items[index as number] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0D18]/95 p-4 sm:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-[#FEDF27]/60 text-[#FEDF27] transition hover:bg-[#FEDF27] hover:text-[#131627]"
          >
            <X size={20} />
          </button>

          {count > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(((index as number) - 1 + count) % count);
                }}
                className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#FEDF27] hover:text-[#131627] sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(((index as number) + 1) % count);
                }}
                className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#FEDF27] hover:text-[#131627] sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <figure className="flex max-h-full w-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <figcaption className="mb-4 flex items-center gap-3 text-sm text-white/80">
              {item.title && <span className="font-medium text-white">{item.title}</span>}
              {count > 1 && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-[#FEDF27]">
                  {(index as number) + 1} / {count}
                </span>
              )}
            </figcaption>
            <motion.img
              key={item.url}
              src={item.url}
              alt={item.title || ""}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}