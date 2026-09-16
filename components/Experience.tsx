"use client";

import type { Experience as ExperienceEntry } from "@/types";
import { motion } from "framer-motion";
import { TypingHeader } from "@/components/TypingHeader";
import { AnimatedDisclosure } from "@/components/AnimatedDisclosure";

type ExperienceData = ExperienceEntry & { description: string };

const EXPERIENCES: ExperienceData[] = [
  {
    id: "deloitte",
    role: "Software Engineer · Engineering, AI & Data",
    company: "Deloitte",
    location: "Thessaloniki, Greece",
    startDate: "Aug 2024",
    endDate: "present",
    description:
      "Building backend systems and AI/LLM applications, including Spring Boot microservices for banking and self-hosted LLM tooling for enterprise legacy modernization. Paused from November 2025 to August 2026 for mandatory military service.",
    bullets: [
      "Built and maintained Spring Boot microservices and REST APIs with pagination, caching, rate limiting, validation, and exception handling",
      "Engineered a Python tool using self-hosted LLMs to translate monolithic COBOL codebases into structured Java microservices, tested across 20+ legacy projects",
      "Built an AI-powered legacy analysis and documentation platform adopted by 3+ enterprise clients",
      "Contributed banking services for onboarding, Greek government KYC/identity verification, personal-data management, and email/SMS notifications",
    ],
  },
  {
    id: "army",
    role: "Network & Systems Administrator · Mandatory Military Service",
    company: "1st Infantry Division, Hellenic Army",
    location: "Veria, Greece",
    startDate: "Nov 2025",
    endDate: "Aug 2026",
    description:
      "Served in the Information Systems Management department, administering secure infrastructure and developing internal software and automation.",
    bullets: [
      "Administered an Active Directory domain on Windows Server 2019 Enterprise across a secure network of about 150 client nodes",
      "Designed, developed, and deployed Python software and automation frameworks to streamline unit communications and operations",
      "Provided 24/7 hardware, software, and network support and trained personnel on systems, specialized software, and security practices",
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
      "Contributed to backend and internal application development for data-center monitoring and cloud provisioning platforms.",
    bullets: [
      "Implemented Spring Boot REST endpoints and service-layer logic for collecting, processing, and exposing infrastructure metrics and system status",
      "Designed internal applications and contributed cloud-provisioning features using Laravel, JavaScript, PHP, and relational databases",
      "Applied Scrum methodologies, promoting agile practices and timely delivery",
    ],
  },
  {
    id: "spacedot",
    role: "Software Engineer (Volunteer)",
    company: "SpaceDot - AcubeSAT",
    location: "Thessaloniki, Greece",
    startDate: "Jul 2023",
    endDate: "Jul 2024",
    description:
      "Worked with the SpaceDot team at Aristotle University of Thessaloniki on software development and testing for the AcubeSAT nanosatellite - a CubeSat mission developed under ECSS aerospace engineering standards.",
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
    <div className="section-shell">
      <div className="mx-auto max-w-5xl">
        <TypingHeader
          text="// experience"
          className="font-mono text-lg text-[#888888]"
        />
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2] sm:text-5xl">
          Teams I&apos;ve Joined
        </h2>

        <div className="relative mx-auto mt-12 max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 hidden w-0.5 bg-[#2a2a2a] md:block" />

        {EXPERIENCES.map((experience, index) => {
          const isCurrent = experience.endDate === "present";

          return (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative pb-12 pl-0 last:pb-0 md:pl-8"
          >
            <div
              className={`absolute left-4 top-1.5 hidden h-3 w-3 -translate-x-1/2 rounded-full ring-2 md:block ${
                isCurrent
                  ? "bg-accent ring-accent/20"
                  : "bg-border ring-border/40"
              }`}
            />

            <p
              className={`text-xl font-semibold sm:text-2xl ${
                isCurrent ? "text-accent" : "text-text"
              }`}
            >
              {experience.company}
            </p>
            <p className="text-lg font-medium text-[#e2e2e2] sm:text-xl">{experience.role}</p>
            <p className="break-words text-base text-[#888888] sm:text-lg">
              {experience.startDate} – {experience.endDate} · {experience.location}
            </p>

            <p className="mt-2 text-lg leading-relaxed text-[#888888]">
              {experience.description}
            </p>

            <AnimatedDisclosure
              closedLabel="+ View selected achievements"
              openLabel="− Hide selected achievements"
              className="mt-4 border-border/80 bg-bg/40"
            >
              <ul className="list-disc space-y-1.5 pl-5 text-base leading-relaxed text-[#b1b1b8] marker:text-accent/60">
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </AnimatedDisclosure>
          </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
