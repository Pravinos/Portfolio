"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBootReady } from "@/components/BootSequence";
import { NAV_SCROLL_OFFSET, scrollToSection } from "@/lib/scroll";

const SECTION_IDS = [
  "hero",
  "about",
  "education",
  "experience",
  "projects",
  "certifications",
  "contact",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const NAV_LINKS = [
  { href: "#about", label: "about", sectionId: "about" },
  {
    href: "#education",
    label: "education",
    sectionId: "education",
  },
  { href: "#experience", label: "experience", sectionId: "experience" },
  { href: "#projects", label: "projects", sectionId: "projects" },
  {
    href: "#certifications",
    label: "certifications",
    sectionId: "certifications",
  },
  { href: "#contact", label: "contact", sectionId: "contact" },
] as const;

function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

function updateHash(sectionId: SectionId) {
  if (sectionId === "hero") {
    if (!window.location.hash) return;
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    return;
  }

  const nextHash = `#${sectionId}`;
  if (window.location.hash === nextHash) return;
  history.replaceState(null, "", nextHash);
}

export default function Nav() {
  const bootReady = useBootReady();
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const [menuOpen, setMenuOpen] = useState(false);
  const initialHashHandled = useRef(false);
  const clickScrollRef = useRef(false);

  useEffect(() => {
    const visibility = new Map<string, number>();

    const updateActiveSection = () => {
      let bestId: SectionId | "" = "";
      let bestRatio = 0;

      for (const id of SECTION_IDS) {
        const ratio = visibility.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (!bestId) return;

      setActiveSection(bestId);

      if (!clickScrollRef.current) {
        updateHash(bestId);
      }
    };

    const observers = SECTION_IDS.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibility.set(
            id,
            entry?.isIntersecting ? entry.intersectionRatio : 0,
          );
          updateActiveSection();
        },
        {
          rootMargin: `-${NAV_SCROLL_OFFSET}px 0px -55% 0px`,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );

      observer.observe(element);
      return observer;
    }).filter(Boolean) as IntersectionObserver[];

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    if (!bootReady || initialHashHandled.current) return;

    const hash = window.location.hash.replace("#", "");
    if (!hash || !isSectionId(hash)) return;

    initialHashHandled.current = true;
    clickScrollRef.current = true;

    const timer = window.setTimeout(() => {
      scrollToSection(hash);
      setActiveSection(hash);
      clickScrollRef.current = false;
    }, 100);

    return () => window.clearTimeout(timer);
  }, [bootReady]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId,
  ) => {
    event.preventDefault();
    clickScrollRef.current = true;
    scrollToSection(sectionId);
    setActiveSection(sectionId);
    updateHash(sectionId);
    setMenuOpen(false);

    window.setTimeout(() => {
      clickScrollRef.current = false;
    }, 800);
  };

  const linkClassName = (sectionId: SectionId) =>
    `inline-flex items-center font-mono text-lg transition-colors duration-200 ${
      activeSection === sectionId
        ? "text-accent underline decoration-accent/60 underline-offset-4"
        : "text-muted hover:text-accent"
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
          onClick={(event) => handleNavClick(event, "hero")}
          className={`inline-flex items-center font-mono text-lg transition-colors duration-200 hover:text-accent-bright ${
            activeSection === "hero"
              ? "text-accent underline decoration-accent/60 underline-offset-4"
              : "text-accent"
          }`}
        >
          ~/thomas
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label, sectionId }) => (
            <a
              key={sectionId}
              href={href}
              onClick={(event) => handleNavClick(event, sectionId)}
              className={linkClassName(sectionId)}
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
          className="terminal-interactive inline-flex h-10 w-10 items-center justify-center rounded text-muted transition-colors duration-200 hover:text-accent md:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-[#2a2a2a] transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
          {NAV_LINKS.map(({ href, label, sectionId }) => (
            <a
              key={sectionId}
              href={href}
              onClick={(event) => handleNavClick(event, sectionId)}
              className={linkClassName(sectionId)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
