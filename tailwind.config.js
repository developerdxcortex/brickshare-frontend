/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Onest", "system-ui", "sans-serif"],
      },
      colors: {
        // Deep navy used for header/footer/dark sections
        navy: {
          DEFAULT: "#0A0F1E",
          800: "#0E1424",
          700: "#141B30",
          600: "#1B2440",
        },
        // Brand gold / yellow accents
        gold: {
          DEFAULT: "#F5C518",
          400: "#FFD23F",
          500: "#F5C518",
          600: "#E0AE00",
        },
        // Warm cream / peach section backgrounds
        cream: "#FFF9EC",
        peach: "#FBE7BC",
        // Royal blue used for small labels & links
        royal: "#2D4EF5",
        // Body ink
        ink: "#16203A",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(10, 15, 30, 0.18)",
        soft: "0 8px 24px -10px rgba(10, 15, 30, 0.12)",
        gold: "0 10px 30px -8px rgba(245, 197, 24, 0.45)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
