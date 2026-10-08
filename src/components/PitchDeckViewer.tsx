import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
// @ts-ignore - Vite resolves this to a local, same-origin worker file (avoids CDN CORS/module issues)
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PitchDeckViewer({
  fileUrl,
  onClose,
}: {
  fileUrl: string;
  onClose: () => void;
}) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [pageAspect, setPageAspect] = useState(1.78); // width/height, updated once the real page loads

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goTo = (next: number) => {
    if (next < 1 || next > numPages) return;
    setDirection(next > page ? 1 : -1);
    setPage(next);
  };

  // Reserve space for the top close bar and the bottom nav bar; fill the rest with the page,
  // then fit the page inside that box on BOTH axes (like object-fit: contain) using its real
  // aspect ratio, so it never overflows/gets clipped on any screen size.
  const availHeight = viewport.h - 120;
  const availWidth = viewport.w - 48;
  const fitWidth = Math.min(availWidth, availHeight * pageAspect);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-end px-4 py-3">
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      {/* PDF page, rendered as canvas — no native download/print/save UI */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex flex-1 select-none items-center justify-center overflow-hidden px-4"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex h-[60vh] w-[70vw] items-center justify-center text-white/60">
              <Loader2 className="animate-spin" size={28} />
            </div>
          }
        >
          {numPages > 0 && (
            <AnimatePresence initial={false}>
              <motion.div
                key={page}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Page
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={fitWidth}
                  onLoadSuccess={(p) => setPageAspect(p.width / p.height)}
                  className="shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </Document>
      </div>

      {/* Bottom nav */}
      {numPages > 0 && (
        <div className="flex shrink-0 items-center justify-center gap-4 py-3 text-white">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium">
            Page {page} / {numPages}
          </span>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= numPages}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}