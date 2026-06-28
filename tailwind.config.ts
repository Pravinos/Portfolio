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
        primary: "#00ff9d",
        secondary: "#0ea5e9",
        muted: "#888888",
        body: "#e2e2e2",
        text: "#e2e2e2",
        blue: "#0ea5e9",
        dim: "#888888",
        green: "#00ff9d",
        greenBright: "#33ffb1",
      },
    },
  },
};

export default config;
