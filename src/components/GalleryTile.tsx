import { Expand } from "lucide-react";
import type { GalleryItem } from "../lib/api";

/** Gallery photo tile: zooms on hover, opens the lightbox on click. */
export default function GalleryTile({
  item,
  onOpen,
  showCaption = true,
}: {
  item: GalleryItem;
  onOpen: () => void;
  showCaption?: boolean; // false when the caption is already shown above a group
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={item.title || "Open image"}
      className="group relative block h-full w-full overflow-hidden rounded-2xl bg-[#131627]/5 shadow-soft ring-1 ring-gold-400/30"
    >
      <img
        src={item.url}
        alt={item.title || ""}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.15")}
      />
      {showCaption && item.title && (
        <>
          <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#131627]/75 to-transparent" />
          <span className="absolute left-3 right-3 top-3 truncate text-left text-sm font-semibold text-white">
            {item.title}
          </span>
        </>
      )}
      <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-[#FEDF27] text-[#131627] opacity-0 transition-all duration-300 group-hover:opacity-100">
        <Expand size={14} />
      </span>
    </button>
  );
}