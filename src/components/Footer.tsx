import { Link } from "react-router-dom";
import Logo from "./Logo";
import { disclosure } from "../config/site";

const platform = [
  { to: "/projects", label: "Projects" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/education", label: "Education" },
];
const legal = [
  { to: "/contact", label: "Terms of Use" },
  { to: "/contact", label: "Privacy Policy" },
  { to: "/contact", label: "Risk Disclosure" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden footer-bg bg-center bg-cover bg-no-repeat text-white">
      {/* faint skyline glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="section relative z-10 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <img src="/images/logo.jpeg" className="h-24"/>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#EAB44F]">
              Platform
            </h4>
            <ul className="space-y-3 text-sm font-regular text-white">
              {platform.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors hover:text-gold-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#EAB44F]">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-white font-regular">
              {legal.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors hover:text-gold-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div className="relative">
            <p className="text-2xl font-extralight leading-snug text-[#DEAB41] sm:text-3xl">
              Built for disciplined <br />
              real-estate <br />
              participation.
            </p>
            <svg
              className="mt-3 w-44"
              viewBox="0 0 200 30"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 6 C60 34 140 34 198 6"
                stroke="#E4C300"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Disclosure */}
        <div className="mt-14 pt-8 text-center">
            <h5 className="mb-3 font-semibold text-[#EAB44F]">Important Disclosure</h5>
          <p className="mx-auto max-w-4xl text-[11px]  font-regular text-[#FCFCFC]">
            {disclosure}
          </p>
        </div>

        <p className="mt-8 text-center text-xs  font-extralight text-[#FFFDF1]">
          © 2026 BrickShare Capital LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
