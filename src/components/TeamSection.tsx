import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const LUMA_LINK = "https://luma.com/2cn4a2ir";


const team = [
  {
    name: "Aziz Ross",
    role: "Co-Founder | Managing Partner",
    img: "/images/team/aziz-ross.jpeg",
    bio: "A Morehouse College business graduate and serial entrepreneur, Aziz moved into full-time real estate investing in 2015 and has since built a multi-million-dollar business spanning residential acquisitions, renovations and flips, single-family rental portfolios, and new home construction. At BrickShare Capital, Aziz leads investment strategy with a focus on disciplined execution and long-term value creation.",
  },
  {
    name: "Mia Rose Greco",
    role: "Co-Founder | Managing Partner",
    img: "/images/team/mia-rose-greco.jpeg",
    bio: "Mia Rose Greco leads strategic planning, investor relations, and operational oversight at BrickShare Capital. With a strong focus on transparency and trust, she ensures every investment opportunity aligns with the firm's values and long-term objectives.",
  },
  {
    name: "Amit Dubey",
    role: "Serial Entrepreneur | Author | Global Business Strategist",
    img: "/images/team/amit-dubey.jpg",
    bio: "Amit Dubey is a serial entrepreneur, author of From Dreams to Dollars, and a globally connected business leader with ventures across five countries, from technology and AI businesses to Dubai real estate. An avid world traveler with an international network, he brings innovation, market insight, and relationship-driven thinking to BrickShare Capital, connecting people, capital, and real estate opportunity for long-term wealth creation.",
  },
  {
    name: "Alfredo J. Salvi F.",
    role: "Business Development | Commercial Lending",
    img: "/images/team/alfredo-salvi.jpg",
    bio: "A Mechanical Engineer with 20+ years in technical sales, engineering, operations, and commercial development across oil & gas, industrial services, and international markets. For the past two years Alfredo has worked in real estate as a Business Developer and Commercial Loan Officer, helping owners, investors, and developers secure financing, partnerships, and growth.",
  },
];

const PAD = "p-5 sm:p-6";
const onest = { fontFamily: "Onest, sans-serif" } as const;

// Card width ke hisaab se fluid sizes (cqw = card width ka %), taaki text kisi bhi screen par cut na ho
const fs = {
  name: { ...onest, fontSize: "clamp(15px, 6.8cqw, 20px)", overflowWrap: "anywhere" as const },
  role: { ...onest, fontSize: "clamp(11px, 4.4cqw, 13px)", overflowWrap: "anywhere" as const },
  bio: { ...onest, fontSize: "clamp(11.5px, 4.25cqw, 12.5px)", overflowWrap: "break-word" as const },
};
const pad = { padding: "clamp(16px, 7cqw, 24px)" };

// Sabse lamba content wala member — iske hisaab se card ki height set hoti hai,
// taki koi bhi bio scroll na kare.
const longest = team.reduce((a, b) =>
  a.bio.length >= b.bio.length ? a : b
);

function BioContent({ m }: { m: (typeof team)[number] }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-tight text-white" style={fs.name}>
          {m.name}
        </h3>
        <a
          href={LUMA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Meet ${m.name} on Luma`}
          onClick={(e) => e.stopPropagation()}
          className="grid h-6 w-6 shrink-0 place-items-center text-[#E4C300] transition-transform duration-300 hover:-translate-y-0.5 hover:translate-x-0.5"
        >
          <ArrowUpRight size={22} strokeWidth={2.2} />
        </a>
      </div>
      <div className="my-3 h-0.5 w-8 shrink-0 bg-[#E4C300]" />
      <p className="font-light leading-[1.55] text-white/90" style={fs.bio}>
        {m.bio}
      </p>
    </>
  );
}

export default function TeamSection() {
  // Desktop: hover. Mobile/touch: tap toggles. Keyboard: focus.
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section">
        <Reveal>
          <div className="text-center">
            <span
              className="inline-block rounded-full border border-[#131627] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#131627]"
              style={onest}
            >
              Our Team
            </span>
            <h2
              className="mt-5 text-[32px] font-semibold leading-none text-[#131627] sm:text-[44px]"
              style={onest}
            >
              Meet Our <span className="text-[#E4C300]">Team</span>
            </h2>
            <div className="mx-auto my-5 h-px w-2/3 max-w-[420px] bg-[linear-gradient(90deg,rgba(228,195,0,0)_0%,#E4C300_47.6%,rgba(228,195,0,0)_100%)]" />
            <p
              className="mx-auto max-w-[760px] text-base font-light leading-[1.4] text-[#111111BF] sm:text-[22px]"
              style={onest}
            >
              The people behind BrickShare Capital — connecting people, capital,
              and real estate opportunity across markets.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[380px] auto-rows-fr grid-cols-1 gap-4 min-[560px]:max-w-[640px] min-[560px]:grid-cols-2 sm:gap-5 lg:max-w-none lg:grid-cols-4 xl:gap-6">
          {team.map((m, i) => {
            const open = active === i;
            return (
              <Reveal key={m.name} delay={i * 0.08} className="h-full">
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={open}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(open ? null : i)}
                  style={{ containerType: "inline-size" }}
                  className="group relative grid h-full cursor-pointer overflow-hidden rounded-[22px] bg-[#131627] outline-none focus-visible:ring-2 focus-visible:ring-[#E4C300]"
                >
                  {/* Photo + name/role */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      open ? "scale-[1.03] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
                    }`}
                  >
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#131627] via-[#131627]/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 text-center" style={pad}>
                      <h3 className="font-semibold leading-tight text-white" style={fs.name}>
                        {m.name}
                      </h3>
                    </div>
                  </div>

                  {/* Height sizer: photo ratio + sabse lamba bio (invisible) */}
                  <div
                    aria-hidden
                    className="invisible col-start-1 row-start-1 flex min-h-full flex-col"
                    style={{ ...pad, aspectRatio: "286 / 339" }}
                  >
                    <BioContent m={longest} />
                  </div>

                  {/* Bio panel */}
                  <div
                    className={`col-start-1 row-start-1 flex flex-col bg-[#131627] text-left transition-all duration-500 ease-out ${
                      open
                        ? "translate-y-0 opacity-100 blur-0"
                        : "pointer-events-none translate-y-3 opacity-0 blur-sm"
                    }`}
                    style={pad}
                  >
                    <BioContent m={m} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}