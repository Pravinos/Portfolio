"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLinkArrow } from "@/components/ExternalLinkArrow";
import { trackEvent } from "@/lib/analytics";

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

export default function Hero() {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
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
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-start px-4 py-16 pt-28 sm:px-6 md:pt-36">
      <div className="w-full">
        <p className="mb-4 break-all font-mono text-base text-[#888888] sm:break-normal sm:text-lg">
          visitor@thomas-portfolio:~$
        </p>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-[#e2e2e2] sm:text-5xl md:text-7xl"
        >
          Pravinos Thomas
        </motion.h1>

        <p className="mt-4 font-mono text-2xl text-accent sm:text-3xl md:text-4xl">
          <span>{displayText}</span>
          <span className="cursor-blink">|</span>
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-sans mt-6 max-w-xl text-base leading-relaxed text-[#888888] sm:text-lg"
        >
          Software engineer based in Thessaloniki, Greece. I build backend
          systems, AI-powered developer tools, and full-stack applications,
          mostly with Java, Python, Spring Boot, and React. Currently I&apos;m at
          Deloitte&apos;s Engineering, AI &amp; Data team in Thessaloniki,
          working full-time.
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-2">
          {SKILLS.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
              className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
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
