import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { ConsentProvider } from "@/components/ConsentProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.prav1nos.me"),
  title: "Pravinos Thomas | Software Engineer",
  description:
    "Software engineer based in Thessaloniki, Greece. Backend, AI tooling, and full-stack development with Java, Python, Spring Boot, and React.",
  keywords: [
    "software engineer",
    "backend",
    "AI",
    "LLM",
    "Spring Boot",
    "FastAPI",
    "Python",
    "Java",
    "TypeScript",
    "Thessaloniki",
    "Greece",
  ],
  authors: [{ name: "Pravinos Thomas" }],
  creator: "Pravinos Thomas",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://portfolio.prav1nos.me",
    title: "Pravinos Thomas | Software Engineer ",
    description: "Backend and AI engineer based in Thessaloniki, Greece.",
    siteName: "Pravinos Thomas | Software Engineer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pravinos Thomas | Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pravinos Thomas | Software Engineer",
    description: "Backend and AI engineer based in Thessaloniki, Greece.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`bg-[#0a0a0a] ${spaceGrotesk.variable}`}>
      <body
        className={`${spaceGrotesk.className} bg-[#0a0a0a] text-[#e2e2e2] antialiased`}
      >
        <ConsentProvider gaId={process.env.NEXT_PUBLIC_GA_ID}>
          {children}
        </ConsentProvider>
      </body>
    </html>
  );
}
