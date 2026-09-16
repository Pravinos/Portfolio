import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pravinos Thomas | Software Engineer",
    short_name: "Pravinos Thomas",
    description:
      "Portfolio of Pravinos Thomas, a software engineer building backend systems, AI tooling, and full-stack products.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
