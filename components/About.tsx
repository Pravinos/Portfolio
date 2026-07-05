"use client";

import { motion } from "framer-motion";
import { TypingHeader } from "@/components/TypingHeader";

const FACTS = [
  { key: "based in", value: "Thessaloniki, Greece" },
  {
    key: "degree",
    value: "Integrated MEng, Electrical & Computer Engineering",
  },
  { key: "university", value: "Aristotle University of Thessaloniki" },
  { key: "stack", value: "Java · Python · Spring Boot · Next.js · LLMs" }
] as const;

const LANGUAGES = [
  { name: "English", level: "Full Professional Proficiency (ECPE C2)" },
  { name: "Greek", level: "Native" },
  { name: "German", level: "Limited Working Proficiency (Goethe B1)" },
] as const;

const CURRENTLY = [
  "completing military service - back at Deloitte, Aug 2026",
] as const;

export function About() {
  return (
    <div className="section-shell pt-24">
      <div className="mx-auto max-w-5xl">
        <TypingHeader text="// about" className="font-mono text-lg text-muted" />
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2] sm:text-5xl">
          The Story So Far
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex flex-col gap-5">
              <p className="font-sans text-lg leading-relaxed text-muted">
                I grew up in Alexandria, a small city in northern Greece, and
                moved to Thessaloniki at 18 to study Electrical and Computer
                Engineering at AUTH. Six years later I&apos;d finished a thesis
                on nanosatellite fault detection and landed at Deloitte building
                AI tools and backend systems. I&apos;m 26, still here, and right
                now finishing military service in the Hellenic Army before
                heading back to Deloitte in August 2026.
              </p>
              <p className="font-sans text-lg leading-relaxed text-muted">
                Away from screens I follow football more closely than is
                strictly necessary, play video games when I can, and keep a
                watchlist that grows faster than I can finish it. I travel when
                the opportunity comes up, but most of the time I&apos;d rather
                be with friends and family.
              </p>
              <p className="font-sans text-lg leading-relaxed text-muted">
                I run a home server, self-host tools I build, and keep side
                projects going for things my day job doesn&apos;t cover. In this
                way I try to discover new technologies and sharpen my skills.
              </p>
              <p className="font-sans text-lg leading-relaxed text-muted">
                Feel free to ask the AI chat for more personal details.
              </p>
            </div>

            <div className="mt-8">
              <p className="font-mono text-sm uppercase tracking-[3px] text-accent sm:text-[12px]">
                <span className="cmd-prefix-sm-hidden">// </span>currently
              </p>
              <div className="mt-3 space-y-1">
                {CURRENTLY.map((line) => (
                  <p key={line} className="font-mono text-base text-muted">
                    <span className="text-dim">▸ </span>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
              <span className="cmd-prefix-sm-hidden">// </span>at a glance
            </p>

            <dl className="mt-6 flex flex-col gap-4">
              {FACTS.map(({ key, value }) => (
                <div key={key} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="flex-shrink-0 font-mono text-sm text-dim sm:w-24">
                    {key}
                  </dt>
                  <dd className="text-lg text-text">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <p className="font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
                <span className="cmd-prefix-sm-hidden">// </span>languages
              </p>
              <dl className="mt-4 flex flex-col gap-3">
                {LANGUAGES.map(({ name, level }) => (
                  <div key={name} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <dt className="flex-shrink-0 font-mono text-sm text-dim sm:w-20">
                      {name}
                    </dt>
                    <dd className="text-lg text-text">{level}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
