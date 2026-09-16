import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import { ConsentProvider } from "@/components/ConsentProvider";
import { siteUrl } from "@/lib/site";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import StatusBar from "@/components/StatusBar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Pravinos Thomas Portfolio",
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
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    title: "Pravinos Thomas | Software Engineer",
    description:
      "Software engineer based in Thessaloniki, Greece. Backend, AI tooling, and full-stack development with Java, Python, Spring Boot, and React.",
    siteName: "Pravinos Thomas",
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
    description:
      "Software engineer based in Thessaloniki, Greece. Backend, AI tooling, and full-stack development with Java, Python, Spring Boot, and React.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Pravinos Thomas",
        url: siteUrl,
        jobTitle: "Software Engineer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Thessaloniki",
          addressCountry: "GR",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Aristotle University of Thessaloniki",
        },
        worksFor: { "@type": "Organization", name: "Deloitte" },
        sameAs: [
          "https://github.com/Pravinos/",
          "https://www.linkedin.com/in/thomas-pravinos/",
        ],
        knowsAbout: [
          "Java",
          "Python",
          "Spring Boot",
          "Next.js",
          "TypeScript",
          "LLM applications",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Pravinos Thomas Portfolio",
        url: siteUrl,
        inLanguage: "en",
        author: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ItemList",
        name: "Featured software projects",
        itemListElement: [
          {
            "@type": "SoftwareApplication",
            position: 1,
            name: "Guess the Baller",
            url: "https://ballers.prav1nos.me/",
            applicationCategory: "GameApplication",
            operatingSystem: "Web",
            author: { "@id": `${siteUrl}/#person` },
          },
          {
            "@type": "SoftwareApplication",
            position: 2,
            name: "Vault",
            url: `${siteUrl}/#project-vault`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            author: { "@id": `${siteUrl}/#person` },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className="overflow-x-hidden bg-[#0a0a0a] font-sans text-[#e2e2e2] antialiased"
      >
        <ConsentProvider gaId={process.env.NEXT_PUBLIC_GA_ID}>
          {children}
          <KeyboardShortcuts />
          <StatusBar />
        </ConsentProvider>
      </body>
    </html>
  );
}
