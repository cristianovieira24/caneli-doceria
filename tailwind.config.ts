import type { Config } from "tailwindcss";

// Design tokens — Caneli Doceria
// Extracted from real brand material: café interior (arched blush doorway,
// marble tables), campaign graphics (blush pink + pine-green script logo),
// pastry photography (caramel/terracotta tones), gold foil "Dia dos Avós" card.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF3EC",
          soft: "#FFFBF7",
          deep: "#F2E6D8",
        },
        blush: {
          DEFAULT: "#F3CFC6",
          light: "#F9E4DE",
          dark: "#E8AFA1",
        },
        pine: {
          DEFAULT: "#33473A",
          light: "#4C6353",
          dark: "#20301F",
        },
        terracotta: {
          DEFAULT: "#C0703F",
          light: "#D68F5F",
          dark: "#9C5730",
        },
        ink: {
          DEFAULT: "#2B2420",
          soft: "#5B5148",
        },
        gold: {
          DEFAULT: "#B98A3E",
          light: "#D9B876",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        script: ["var(--font-caveat)", "cursive"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        arch: "999px 999px 20px 20px",
        card: "22px",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(43, 36, 32, 0.18)",
        lift: "0 16px 40px -16px rgba(43, 36, 32, 0.28)",
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
