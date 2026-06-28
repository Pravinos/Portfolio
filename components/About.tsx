"use client";

import { motion } from "framer-motion";

const FACTS = [
  { key: "based in", value: "Thessaloniki, Greece" },
  {
    key: "degree",
    value: "Integrated MEng, Electrical & Computer Engineering",
  },
  { key: "university", value: "Aristotle University of Thessaloniki" },
  { key: "stack", value: "Java · Python · Spring Boot · Next.js · LLMs" }
] as const;

const LANGUAGE_BARS = [
  { name: "Greek", width: "100%", barClass: "bg-green" },
  { name: "English", width: "95%", barClass: "bg-blue" },
  { name: "German", width: "40%", barClass: "bg-dim" },
] as const;

const CURRENTLY = [
  "completing military service — back at Deloitte, Aug 2026",
] as const;

export function About() {
  return (
    <div className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-sm text-muted">// about</p>

        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed text-muted">
                I grew up in Alexandria, a small city in northern Greece, and
                moved to Thessaloniki at 18 to study Electrical and Computer
                Engineering at AUTH. Six years later I&apos;d finished a thesis
                on nanosatellite fault detection and landed at Deloitte building
                AI tools and backend systems. I&apos;m 26, still here, and right
                now finishing military service in the Hellenic Army before
                heading back to Deloitte in August 2026.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Away from screens I follow football more closely than is
                strictly necessary, play video games when I can, and keep a
                watchlist that grows faster than I can finish it. I travel when
                the opportunity comes up, but most of the time I&apos;d rather
                be with friends and family.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                I run a home server, self-host tools I build, and keep side
                projects going for things my day job doesn&apos;t cover. In this
                way I try to discover new technologies and improve my skills.
              </p>
            </div>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[3px] text-green">
                // currently
              </p>
              <div className="mt-3 space-y-1">
                {CURRENTLY.map((line) => (
                  <p key={line} className="font-mono text-xs text-muted">
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
            <p className="font-mono text-[10px] uppercase tracking-[3px] text-dim">
              // at a glance
            </p>

            <dl className="mt-6 flex flex-col gap-4">
              {FACTS.map(({ key, value }) => (
                <div key={key} className="flex gap-4">
                  <dt className="w-24 flex-shrink-0 font-mono text-[11px] text-dim">
                    {key}
                  </dt>
                  <dd className="text-sm text-text">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <p className="font-mono text-[10px] uppercase tracking-[3px] text-dim">
                // languages
              </p>
              <div className="mt-4 space-y-3">
                {LANGUAGE_BARS.map(({ name, width, barClass }) => (
                  <div key={name}>
                    <p className="font-mono text-xs text-muted">{name}</p>
                    <div className="relative mt-1 h-0.5 rounded-full bg-surface2">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${barClass}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
