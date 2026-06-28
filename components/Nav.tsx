"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SECTION_IDS = [
  "hero",
  "about",
  "education",
  "experience",
  "projects",
  "certifications",
  "contact",
] as const;

const NAV_LINKS = [
  { href: "#about", label: "about", sectionId: "about" },
  {
    href: "#education",
    label: "education",
    sectionId: "education",
    mobileHidden: true,
  },
  { href: "#experience", label: "experience", sectionId: "experience" },
  { href: "#projects", label: "projects", sectionId: "projects" },
  {
    href: "#certifications",
    label: "certifications",
    sectionId: "certifications",
    mobileHidden: true,
  },
  { href: "#contact", label: "contact", sectionId: "contact" },
] as const;

const MOBILE_NAV_SECTIONS = new Set([
  "about",
  "experience",
  "projects",
  "contact",
]);

export default function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const visibility = new Map<string, number>();

    const updateActiveSection = () => {
      let bestId = "";
      let bestRatio = 0;

      for (const id of SECTION_IDS) {
        const ratio = visibility.get(id) ?? 0;
        if (ratio >= 0.5 && ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      setActiveSection(bestId);
    };

    const observers = SECTION_IDS.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibility.set(id, entry?.isIntersecting ? entry.intersectionRatio : 0);
          updateActiveSection();
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      observer.observe(element);
      return observer;
    }).filter(Boolean) as IntersectionObserver[];

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const linkClassName = (sectionId: string) =>
    `font-mono text-sm transition-colors ${
      activeSection === sectionId
        ? "text-[#00ff9d]"
        : "text-[#888888] hover:text-[#00ff9d]"
    }`;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#hero"
          className="font-mono text-[#00ff9d] transition-opacity hover:opacity-80"
        >
          ~/thomas
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label, sectionId, mobileHidden }) => (
            <a
              key={sectionId}
              href={href}
              className={`${linkClassName(sectionId)} ${mobileHidden ? "hidden md:block" : ""}`}
            >
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col justify-center gap-1.5 p-2 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-[#888888] transition-colors" />
          <span className="block h-0.5 w-6 bg-[#888888] transition-colors" />
          <span className="block h-0.5 w-6 bg-[#888888] transition-colors" />
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-[#2a2a2a] transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
          {NAV_LINKS.filter(({ sectionId }) =>
            MOBILE_NAV_SECTIONS.has(sectionId),
          ).map(({ href, label, sectionId }) => (
            <a
              key={sectionId}
              href={href}
              className={linkClassName(sectionId)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
