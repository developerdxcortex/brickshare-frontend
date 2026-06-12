import { brand } from "../config/site";

type LogoProps = {
  variant?: "light" | "dark"; // light = for dark backgrounds (gold text)
  className?: string;
  showText?: boolean;
};

/**
 * Brand logo. By default tries to render your image (brand.logo).
 * Agar tu sirf SVG fallback chahta hai toh `useImage` false kar de.
 * The SVG fallback is a stacked-tower mark so the site looks right even
 * before you drop in /images/logo.png.
 */
export default function Logo({ variant = "light", className = "", showText = true }: LogoProps) {
  const goldText = variant === "light";
  const useImage = true; // <- false karo agar sirf vector mark chahiye

  if (useImage) {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <img
          src={brand.logo}
          alt={`${brand.name} ${brand.sub}`}
          className="h-14 w-auto object-contain"
          onError={(e) => {
            // image missing -> swap to inline vector fallback
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
            if (sib) sib.style.display = "inline-flex";
          }}
        />
        <span style={{ display: "none" }}>
          <TowerMark goldText={goldText} showText={showText} />
        </span>
      </span>
    );
  }
  return <TowerMark goldText={goldText} showText={showText} />;
}

function TowerMark({ goldText, showText }: { goldText: boolean; showText: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <svg width="38" height="44" viewBox="0 0 38 44" fill="none" aria-hidden>
        <g stroke="#F5C518" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M19 3 L31 12 V41 H7 V12 Z" />
          <path d="M13 12 L19 7 L25 12" />
          <path d="M11 18 H27 M11 24 H27 M11 30 H27 M11 36 H27" opacity="0.7" />
          <path d="M19 7 V41" opacity="0.7" />
        </g>
      </svg>
      {showText && (
        <span className="leading-none">
          <span className={`block text-lg font-extrabold tracking-wide ${goldText ? "text-gold-400" : "text-navy"}`}>
            {brand.name}
          </span>
          <span className={`block text-[10px] font-semibold tracking-[0.25em] ${goldText ? "text-white/80" : "text-ink/70"}`}>
            {brand.sub}
          </span>
        </span>
      )}
    </span>
  );
}
