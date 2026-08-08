import type { Config } from "tailwindcss";

// Design tokens — Caneli Doceria.
// Colors are backed by CSS variables so light/dark themes can swap the full
// visual system without duplicating classes throughout the app.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "rgb(var(--cream) / <alpha-value>)",
          soft: "rgb(var(--cream-soft) / <alpha-value>)",
          deep: "rgb(var(--cream-deep) / <alpha-value>)",
        },
        blush: {
          DEFAULT: "rgb(var(--blush) / <alpha-value>)",
          light: "rgb(var(--blush-light) / <alpha-value>)",
          dark: "rgb(var(--blush-dark) / <alpha-value>)",
        },
        pine: {
          DEFAULT: "rgb(var(--pine) / <alpha-value>)",
          light: "rgb(var(--pine-light) / <alpha-value>)",
          dark: "rgb(var(--pine-dark) / <alpha-value>)",
        },
        terracotta: {
          DEFAULT: "rgb(var(--terracotta) / <alpha-value>)",
          light: "rgb(var(--terracotta-light) / <alpha-value>)",
          dark: "rgb(var(--terracotta-dark) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          light: "rgb(var(--gold-light) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        script: ["var(--font-caveat)", "cursive"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        arch: "999px 999px 24px 24px",
        card: "24px",
        pastry: "30px 30px 58px 30px",
        blob: "46% 54% 62% 38% / 48% 42% 58% 52%",
      },
      boxShadow: {
        soft: "0 10px 34px -18px rgb(var(--shadow-color) / 0.28)",
        lift: "0 20px 52px -24px rgb(var(--shadow-color) / 0.42)",
        float: "0 28px 80px -36px rgb(var(--shadow-color) / 0.5)",
      },
      maxWidth: {
        content: "1240px",
      },
      opacity: {
        "15": "0.15",
        "35": "0.35",
        "45": "0.45",
        "55": "0.55",
        "65": "0.65",
        "85": "0.85",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(.985)", filter: "blur(5px)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)", filter: "blur(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -10px, 0) rotate(2deg)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, 8px, 0) rotate(-2deg)" },
        },
        "soft-pop": {
          "0%": { opacity: "0", transform: "scale(.92) rotate(-2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .8s cubic-bezier(.16,1,.3,1) both",
        "float-slow": "float 7s ease-in-out infinite",
        "float-reverse": "float-reverse 9s ease-in-out infinite",
        "soft-pop": "soft-pop .7s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
