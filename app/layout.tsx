import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// TODO: Add /public/og-image.png (1200x630px) for Open Graph and Twitter cards.
// TODO: Add a favicon at app/icon.png or app/favicon.ico.

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pravinos Thomas — Software Engineer",
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
    title: "Pravinos Thomas — Software Engineer",
    description: "Backend and AI engineer based in Thessaloniki, Greece.",
    siteName: "Pravinos Thomas",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pravinos Thomas — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pravinos Thomas — Software Engineer",
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
    <html lang="en" className="bg-[#0a0a0a]">
      <body
        className={`${geistMono.className} bg-[#0a0a0a] text-[#e2e2e2] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
