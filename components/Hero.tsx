"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 pt-14 sm:px-6">
      <div className="w-full">
        <p className="mb-4 font-mono text-[#888888]">
          visitor@thomas-portfolio:~$
        </p>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl font-bold text-[#e2e2e2] md:text-7xl"
        >
          Pravinos Thomas
        </motion.h1>

        <p className="mt-4 text-2xl text-[#00ff9d] md:text-3xl">
          <span>{displayText}</span>
          <span className="cursor-blink">|</span>
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 max-w-xl leading-relaxed text-[#888888]"
        >
          Software engineer based in Thessaloniki, Greece. I build backend
          systems, AI-powered developer tools, and full-stack applications,
          mostly with Java, Python, Spring Boot, and React. Currently at
          Deloitte&apos;s Engineering, AI &amp; Data team, returning August
          2026.
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-2">
          {SKILLS.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
              className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-[#888888] transition hover:border-[#00ff9d] hover:text-[#00ff9d]"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded bg-[#00ff9d] px-6 py-2 text-sm font-medium text-[#0a0a0a] transition hover:opacity-90"
          >
            view projects
          </a>
          <a
            href="https://github.com/Pravinos/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#00ff9d] px-6 py-2 text-sm font-medium text-[#00ff9d] transition hover:bg-[#00ff9d]/10"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/thomas-pravinos/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#00ff9d] px-6 py-2 text-sm font-medium text-[#00ff9d] transition hover:bg-[#00ff9d]/10"
          >
            linkedin
          </a>
        </div>
      </div>
    </div>
  );
}
