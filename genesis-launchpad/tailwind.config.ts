import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--color-paper)",
          2: "var(--color-paper-2)",
          3: "var(--color-paper-3)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          2: "var(--color-ink-2)",
          3: "var(--color-ink-3)",
        },
        rule: {
          DEFAULT: "var(--color-rule)",
          2: "var(--color-rule-2)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          ink: "var(--color-accent-ink)",
        },
        flag: "var(--color-flag)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.02em",
        tighter2: "-0.03em",
      },
      maxWidth: {
        wide: "78rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
