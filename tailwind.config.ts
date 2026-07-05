import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        bg: "#0a0a0a",
        surface: {
          DEFAULT: "#111111",
          elevated: "#1a1a1a",
        },
        surface2: "#111111",
        border: "#2a2a2a",
        accent: {
          DEFAULT: "#4ade80",
          bright: "#86efac",
          muted: "rgba(74, 222, 128, 0.5)",
        },
        primary: "#4ade80",
        secondary: "#0ea5e9",
        muted: "#888888",
        body: "#e2e2e2",
        text: "#e2e2e2",
        blue: "#0ea5e9",
        dim: "#888888",
        green: "#4ade80",
        greenBright: "#86efac",
      },
    },
  },
};

export default config;
