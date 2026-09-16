"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLinkArrow } from "@/components/ExternalLinkArrow";
import { trackEvent } from "@/lib/analytics";
import { PORTFOLIO_EVENTS } from "@/lib/portfolio-events";
import { scrollToSection } from "@/lib/scroll";

const TITLES = [
  "Software Engineer",
  "Backend Developer",
  "AI Tooling Builder",
  "Full Stack Engineer",
];
const SKILLS = [
  "Python",
  "Java",
  "Spring Boot",
  "LLMs",
  "FastAPI",
  "React",
  "Next.js",
  "TypeScript",
  "C++",
];

const TYPE_DELAY = 80;
const DELETE_DELAY = 40;
const PAUSE_DELAY = 2000;

function exploreSkill(skill: string) {
  window.dispatchEvent(
    new CustomEvent(PORTFOLIO_EVENTS.filterProjects, { detail: skill }),
  );
  scrollToSection("projects");
}

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let charIndex = 0;
    let titleIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentTitle = TITLES[titleIndex] ?? "";

      if (!isDeleting) {
        charIndex += 1;
        setDisplayText(currentTitle.slice(0, charIndex));

        if (charIndex === currentTitle.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, PAUSE_DELAY);
          return;
        }

        timeoutId = setTimeout(tick, TYPE_DELAY);
        return;
      }

      charIndex -= 1;
      setDisplayText(currentTitle.slice(0, charIndex));

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % TITLES.length;
      }

      timeoutId = setTimeout(tick, charIndex === 0 ? TYPE_DELAY : DELETE_DELAY);
    };

    timeoutId = setTimeout(tick, TYPE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [reduceMotion]);

  return (
    <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col justify-center px-4 py-24 sm:px-6 md:py-32">
      <div className="w-full">
        <p className="mb-4 break-all font-mono text-base text-muted sm:break-normal sm:text-lg">
          visitor@thomas-portfolio:~$
        </p>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-text sm:text-6xl md:text-8xl"
        >
          Pravinos Thomas
        </motion.h1>

        <p className="mt-4 font-mono text-2xl text-accent sm:text-3xl md:text-4xl">
          <span>{reduceMotion ? TITLES[0] : displayText}</span>
          {!reduceMotion && <span className="cursor-blink">|</span>}
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-muted sm:text-lg"
        >
          Software engineer based in Thessaloniki, Greece. I build backend
          systems, AI-powered developer tools, and full-stack applications,
          mostly with Java, Python, Spring Boot, and React. Currently I&apos;m at
          Deloitte&apos;s Engineering, AI &amp; Data team in Thessaloniki,
          working full-time.
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-2">
          {SKILLS.map((skill, index) => (
            <motion.button
              type="button"
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
              className="terminal-interactive rounded-full border border-border bg-surface-elevated px-2.5 py-1 font-mono text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
              onClick={() => exploreSkill(skill)}
              aria-label={`Show projects using ${skill}`}
            >
              {skill}
            </motion.button>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="primary-cta terminal-interactive"
            onClick={() => trackEvent("click", "cta", "hero_projects")}
          >
            View projects
            <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#contact"
            className="secondary-cta terminal-interactive"
            onClick={() => trackEvent("click", "cta", "hero_contact")}
          >
            Contact me
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/Pravinos/"
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-interactive inline-flex items-center gap-1 border-none bg-transparent font-sans text-base text-muted transition-colors duration-200 hover:text-accent"
            onClick={() => trackEvent("click", "cta", "hero_github")}
          >
            github
            <ExternalLinkArrow />
          </a>
          <a
            href="https://www.linkedin.com/in/thomas-pravinos/"
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-interactive inline-flex items-center gap-1 border-none bg-transparent font-sans text-base text-muted transition-colors duration-200 hover:text-accent"
            onClick={() => trackEvent("click", "cta", "hero_linkedin")}
          >
            linkedin
            <ExternalLinkArrow />
          </a>
        </div>
      </div>
    </div>
  );
}
