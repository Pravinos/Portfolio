"use client";

import type { Experience as ExperienceEntry } from "@/types";
import { motion } from "framer-motion";

type ExperienceData = ExperienceEntry & { description: string };

const EXPERIENCES: ExperienceData[] = [
  {
    id: "deloitte",
    role: "Software Engineer · Business Analyst",
    company: "Deloitte",
    location: "Thessaloniki, Greece",
    startDate: "Aug 2024 – Nov 2025 · Aug 2026",
    endDate: "present",
    description:
      "Working in the Engineering, AI & Data department, building smart, scalable software solutions using Java, Python, and modern technologies. Responsibilities span developing RESTful APIs, integrating databases, and applying AI to improve code quality, system performance, and team productivity.",
    bullets: [
      "Legacy Code Modernisation — Built a Python + LLM tool that translates legacy systems into current technologies, improving migration efficiency during client engagements",
      "AI Documentation Platform — Developed a Python-based internal tool using LLMs to auto-generate clear documentation for complex codebases, accelerating team onboarding",
      "Banking Services — Built secure Spring Boot microservices with REST API and database integrations supporting core internal financial operations",
    ],
  },
  {
    id: "army",
    role: "Research & Informatics Soldier",
    company: "Hellenic Army",
    location: "Veroia, Greece",
    startDate: "Nov 2025",
    endDate: "Aug 2026",
    description:
      "Mandatory military service assigned to Research & Informatics (Special Duties). Applied technical background to support IT infrastructure and internal digital workflows.",
    bullets: [
      "IT systems support, data management, and internal workflow automation for military operations",
      "Technical documentation, process standardisation, and troubleshooting",
      "Built FireRiskMaps — a fire risk visualisation tool deployed for real internal use within the unit (see Projects)",
    ],
  },
  {
    id: "synapsecom",
    role: "Junior Software Engineer",
    company: "Synapsecom Telecoms S.A.",
    location: "Thessaloniki, Greece",
    startDate: "Feb 2024",
    endDate: "Jul 2024",
    description:
      "Software design and development for internal applications, working across the full stack with Laravel, JavaScript, and relational databases.",
    bullets: [
      "Designed and developed internal applications using Laravel, JavaScript, and relational databases",
      "Implemented RESTful APIs for application integration across internal systems",
      "Applied Scrum methodologies, promoting agile practices and timely delivery",
    ],
  },
  {
    id: "spacedot",
    role: "Software Engineer (Volunteer)",
    company: "SpaceDot — AcubeSAT",
    location: "Thessaloniki, Greece",
    startDate: "Jul 2023",
    endDate: "Jul 2024",
    description:
      "Worked with the SpaceDot team at Aristotle University of Thessaloniki on software development and testing for the AcubeSAT nanosatellite — a CubeSat mission developed under ECSS aerospace engineering standards.",
    bullets: [
      "Developed fault-detection software for the AcubeSAT nanosatellite in C++ following ECSS aerospace engineering standards",
      "Contributed to subsystem reliability through rigorous testing and standard compliance",
      "Thesis: Fault Detection, Isolation, and Recovery (FDIR) for nanosatellite subsystems",
    ],
  },
  {
    id: "mycompany",
    role: "Full Stack Engineer (Internship)",
    company: "MyCompany Projects",
    location: "Thessaloniki, Greece",
    startDate: "Jul 2022",
    endDate: "Sep 2022",
    description:
      "Internship contributing to VCLAVIS, a Laravel/Vue.js platform for pressure vessel feasibility assessment in industrial settings.",
    bullets: [
      "Developed features to evaluate manufacturing feasibility of pressure vessels based on location and environmental factors",
      "Worked across the full stack with Laravel (backend) and Vue.js (frontend)",
    ],
  },
];

export default function Experience() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <p className="font-mono text-sm text-[#888888]">// experience</p>
      <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2]">Work History</h2>

      <div className="relative mt-12">
        <div className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-[#2a2a2a]" />

        {EXPERIENCES.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative pb-12 pl-8 last:pb-0"
          >
            <div className="absolute left-[2px] top-1.5 h-3 w-3 rounded-full bg-[#00ff9d] ring-2 ring-[#00ff9d]/20" />

            <p className="text-lg font-semibold text-[#00ff9d]">
              {experience.company}
            </p>
            <p className="font-medium text-[#e2e2e2]">{experience.role}</p>
            <p className="text-sm text-[#888888]">
              {experience.startDate} – {experience.endDate} · {experience.location}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#888888]">
              {experience.description}
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[#aaaaaa]">
              {experience.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
