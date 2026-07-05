"use client";

import { motion } from "framer-motion";
import { TypingHeader } from "@/components/TypingHeader";

const THESIS_TAGS = [
  "C++",
  "ECSS Standards",
  "Embedded Systems",
  "Fault Detection",
  "CubeSat",
] as const;

const ACADEMIC_PROJECTS = [
  {
    title: "Telecommunication Electronics",
    org: "Aristotle University of Thessaloniki",
    date: "2023",
    note: "Bibliographical research on how temperature affects electronic circuits in space environments. This work sparked an interest in space engineering and RF communications - the direct path that led to the thesis and SpaceDot.",
    github: "https://github.com/Pravinos/Telecommunication-Electronics",
    highlight: true,
  },
  {
    title: "Graph Theory",
    org: "Aristotle University of Thessaloniki",
    date: "2023",
    note: "Built a network of ~20,000 scientific articles/nodes linked by embedding-based semantic similarity and applied Louvain community detection to infer subject areas from titles and abstracts. Evaluated alignment with ground-truth labels using the Fowlkes–Mallows score.",
    github: "https://github.com/Pravinos/Graph-Theory-Community-Detection",
    highlight: false,
  },
  {
    title: "Radio Communications",
    org: "Aristotle University of Thessaloniki",
    date: "2024",
    note: "Assignment for Special Topics in Propagation and Radiocommunication regarding the digital TV radio coverage analysis for the Lesvos prefecture.",
    github: "https://github.com/Pravinos/Radio-Communications",
    highlight: false,
  },
  {
    title: "Optimization Techniques",
    org: "Aristotle University of Thessaloniki",
    date: "2023",
    note: "Implementation of classical and metaheuristic optimisation algorithms for engineering problems - gradient methods, genetic algorithms, and constraint satisfaction.",
    github: "https://github.com/Pravinos/Optimization-Techniques",
    highlight: false,
  },
  {
    title: "Distributed Production Systems",
    org: "Aristotle University of Thessaloniki",
    date: "2023",
    note: "Bibliographical work on the role of AI in smart grids - energy management and optimisation - completed for the course Distributed Production.",
    github: "https://github.com/Pravinos/Distributed-Production",
    highlight: false,
  },
  {
    title: "Computational Intelligence",
    org: "Aristotle University of Thessaloniki",
    date: "2022",
    note: "Implemented neural networks, fuzzy logic systems, and evolutionary algorithms, an early foundation for later AI and machine learning work.",
    github: "https://github.com/Pravinos/Computational-Intelligence",
    highlight: false,
  },
] as const;

const OTHER_HIGHLIGHTS = [
  { title: "11th and 12th annual ECE Student Conference of Greece", meta: "AUTH, 2019 and 2021" },
  { title: "Open Workshop: AI in Energy", meta: "AUTH, Mar 2023" },
  { title: "Python Programming Course", meta: "GreekLUG, May 2023" },
] as const;

export function Education() {
  return (
    <div className="section-shell">
      <div className="mx-auto max-w-5xl">
        <TypingHeader
          text="// education & research"
          className="font-mono text-lg text-muted"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 flex gap-4"
        >
          <div>
            <p className="text-xl font-medium text-text">
              Integrated Master&apos;s degree - Electrical &amp; Computer
              Engineering
            </p>
            <p className="mt-1 font-mono text-base text-blue">
              Aristotle University of Thessaloniki
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-dim">
              <span>Oct 2018 – Sep 2024</span>
              <span>Grade: 7.07</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 border-l-0 pl-0 md:border-l-2 md:border-accent md:pl-6"
        >
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm uppercase tracking-[3px] text-accent sm:text-[12px]">
              <span className="cmd-prefix-sm-hidden">// </span>thesis
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-4 text-lg font-medium text-text">
            Fault Detection, Isolation, and Recovery (FDIR) for Nanosatellite
            Subsystems
          </p>

          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
            This thesis focuses on the implementation of a Fault Detection,
            Isolation, and Remediation (FDIR) architecture based on the European
            ECSS Packet Utilization Standard. The C++ implementation includes
            the development of the parameter monitoring service ST[12], which
            allows for defining, enabling, and disabling checks to monitor
            various on-board parameters. The architecture of the service is
            fully configurable, allowing for the addition, modification, or
            removal of checks according to mission needs. Additionally, the
            thesis provides a detailed description of the code structure of the
            ST[12] service, the main methods it employs, and the logic behind
            the various types of checks. The proposed FDIR system aims to
            enhance the reliability and success probabilities of the AcubeSAT
            mission conducted by the students of Aristotle University of
            Thessaloniki.
          </p>

          <div className="mt-5 rounded border border-border bg-[#0a0a0a]/80 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm uppercase tracking-[2px] text-accent sm:text-[12px]">
                SpaceDot · AcubeSAT
              </span>
              <span className="font-mono text-sm text-dim">
                Jul 2023 – Jul 2024 · volunteer
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">
              Implemented as part of the SpaceDot / AcubeSAT mission by the
              students of Aristotle University of Thessaloniki. This work was
              conducted as a volunteer role from July 2023 to July 2024.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="https://github.com/Pravinos/AcubeSat-ECSS-ST12-Service"
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-interactive inline-flex items-center gap-1 font-mono text-sm text-accent transition-colors duration-200 hover:text-accent-bright"
              >
                ↗ GitHub Repository
              </a>
              <a
                href="https://ikee.lib.auth.gr/record/356385"
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-interactive inline-flex items-center gap-1 font-mono text-sm text-accent transition-colors duration-200 hover:text-accent-bright"
              >
                ↗ IKEE - AUTH Library
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {THESIS_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-base text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="mt-12">
          <p className="font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
            <span className="cmd-prefix-sm-hidden">// </span>academic projects
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ACADEMIC_PROJECTS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-80px" }}
                className={
                  item.highlight
                    ? "border-l-0 py-2 pl-0 md:border-l-2 md:border-accent/60 md:pl-4"
                    : "border-l-0 py-1 pl-0 md:border-l md:border-border md:pl-4"
                }
              >
                <p className="text-lg font-medium text-text">
                  {item.title}
                </p>
                {item.highlight && (
                  <p className="font-mono text-sm text-accent sm:text-[12px]">
                    ↳ led to thesis &amp; SpaceDot
                  </p>
                )}
                <p className="mt-0.5 font-mono text-sm text-blue">
                  {item.org}
                </p>
                <p className="font-mono text-sm text-dim">{item.date}</p>
                <p className="mt-1 text-base leading-relaxed text-muted">
                  {item.note}
                </p>
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-interactive mt-2 inline-flex items-center font-mono text-sm text-accent transition-colors duration-200 hover:text-accent-bright"
                >
                  ↗ view repo
                </a>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
            <span className="cmd-prefix-sm-hidden">// </span>other highlights
          </p>

          <ul className="mt-4 space-y-3">
            {OTHER_HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-base text-dim">▸</span>
                <span className="text-base text-muted sm:text-lg">
                  {item.title}
                </span>
                <span className="hidden font-mono text-sm text-dim sm:inline">·</span>
                <span className="w-full font-mono text-sm text-dim sm:w-auto">
                  {item.meta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
