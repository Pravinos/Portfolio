"use client";

import { motion } from "framer-motion";
import { TypingHeader } from "@/components/TypingHeader";
import { trackEvent } from "@/lib/analytics";

type ProjectData = {
  id: string;
  name: string;
  description: string;
  detail?: string;
  stack: string[];
  github: string;
  githubLabel?: string;
  githubSecondary?: string;
  githubSecondaryLabel?: string;
  featured?: boolean;
  context?: string;
};

const MAIN_PROJECTS: ProjectData[] = [
  {
    id: "vault",
    name: "Vault",
    description:
      "A full-stack personal finance platform built as production-ready SaaS. Track spending, income, budgets, and financial goals in one place. Users sign in with JWT authentication and interact with a Spring Boot REST API backed by PostgreSQL, while a Next.js frontend handles dashboards, forms, and day-to-day money management.",
    detail:
      "Split across vault-api and vault-frontend: the Java/Spring Boot backend covers auth, accounts, transactions, categories, and goal tracking with Spring Security and JWT; the Next.js client consumes REST endpoints for balances, trends, and goal progress. Designed with clear API boundaries, relational data modelling, and a deployable backend/frontend split typical of real SaaS products.",
    stack: ["Spring Boot", "Java", "Next.js", "TypeScript", "PostgreSQL", "JWT"],
    github: "https://github.com/Pravinos/vault-api",
    githubLabel: "api",
    githubSecondary: "https://github.com/Pravinos/vault-frontend",
    githubSecondaryLabel: "frontend",
    featured: true,
  },
  {
    id: "elelem",
    name: "elelem",
    description:
      "Self-hosted LLM chat app running entirely on personal hardware. No cloud APIs, no token costs, no data leaves the network. Features SSE streaming, persistent chat history, multi-model support via Ollama, intelligent model memory management, and private access over Tailscale.",
    detail:
      "FastAPI backend + Next.js frontend, deployed as a Docker monorepo on a Debian home server. Full REST API with SSE streaming, SQLite persistence, and model lifecycle management.",
    stack: [
      "FastAPI",
      "Next.js",
      "Python",
      "TypeScript",
      "Ollama",
      "Docker",
      "Tailscale",
      "SQLite",
    ],
    github: "https://github.com/Pravinos/elelem",
    featured: false,
  },
  {
    id: "devtutor",
    name: "DevTutor AI",
    description:
      "Local AI coding tutor for programming beginners. Runs entirely on-device via LM Studio - fully private, no internet required. Interactive lessons and code explanations powered by local inference.",
    stack: ["Python", "Streamlit", "LM Studio", "Ollama"],
    github: "https://github.com/Pravinos/DevTutor-AI",
    featured: false,
  },
  {
  "id": "guess-the-baller",
  "name": "Guess the Baller",
  "description":
    "A football career-path guessing game that challenges users to identify a player based on their club-by-club career timeline. The game offers multiple modes, including Casual, Timed, Streak, and Head-to-Head, each with unique gameplay mechanics.",
  "stack": ["Next.js (App Router) + TypeScript", "Tailwind CSS", "Framer Motion", "Supabase (Postgres)", "Wikidata + Wikipedia REST API"],
  "github": "https://github.com/Pravinos/guess-the-baller",
  "featured": false
}
,
];

const MILITARY_PROJECT: ProjectData = {
  id: "fireriskmaps",
  name: "FireRiskMaps",
  description:
    "Fire risk mapping tool built during military service for actual use in the office I served at. Visualises fire risk zones and data relevant to military operational planning.",
  detail:
    "Built and deployed for real internal use.",
  stack: ["Python", "Mapping", "Data Visualisation"],
  github: "https://github.com/Pravinos/FireRiskMaps",
  context: "Hellenic Army · Research & Informatics · 2025–2026",
};

const FEATURED_PROJECT = MAIN_PROJECTS.find((p) => p.featured)!;
const GRID_PROJECTS = MAIN_PROJECTS.filter((p) => !p.featured);

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function RepoLink({
  href,
  label,
  ariaLabel,
  onClick,
}: {
  href: string;
  label?: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 rounded border border-transparent px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-200 hover:border-accent/30 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      onClick={onClick}
    >
      <GitHubIcon />
      {label && <span>{label}</span>}
    </a>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
  compact = false,
}: {
  project: ProjectData;
  index: number;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`w-full rounded-lg border bg-surface2 transition-colors duration-200 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.05)] ${
        featured
          ? "border-accent/40 p-4 shadow-[0_0_24px_rgba(74,222,128,0.08)] sm:p-6"
          : "border-border p-4"
      }`}
    >
      {project.context && (
        <p className="mb-2 font-mono text-sm text-dim">
          ⊕ {project.context}
        </p>
      )}

      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold text-[#e2e2e2] sm:text-2xl">{project.name}</h3>

        <div className="flex shrink-0 items-center gap-2">
          <RepoLink
            href={project.github}
            label={project.githubSecondary ? (project.githubLabel ?? "api") : undefined}
            ariaLabel={`${project.name}${project.githubLabel ? ` ${project.githubLabel}` : ""} on GitHub`}
            onClick={() =>
              trackEvent("click", "project", `project_${project.id}_github`)
            }
          />
          {project.githubSecondary && (
            <RepoLink
              href={project.githubSecondary}
              label={project.githubSecondaryLabel ?? "frontend"}
              ariaLabel={`${project.name} ${project.githubSecondaryLabel ?? "frontend"} on GitHub`}
              onClick={() =>
                trackEvent(
                  "click",
                  "project",
                  `project_${project.id}_frontend_github`,
                )
              }
            />
          )}
        </div>
      </div>

      <p className="mt-2 text-lg leading-relaxed text-[#888888]">
        {project.description}
      </p>

      {((featured || compact) && project.detail) && (
        <p className="mt-2 text-base leading-relaxed text-dim">{project.detail}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-base text-accent"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <div className="section-shell">
      <div className="mx-auto max-w-5xl">
        <TypingHeader
          text="// projects"
          className="font-mono text-lg text-[#888888]"
        />
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2] sm:text-5xl">
          Things I&apos;ve Built
        </h2>

        <div className="mx-auto mt-12 max-w-5xl">
          <ProjectCard project={FEATURED_PROJECT} index={0} featured />

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {GRID_PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl border-t border-border pt-10">
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
              <span className="cmd-prefix-sm-hidden">// </span>built during military service
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <ProjectCard project={MILITARY_PROJECT} index={0} compact />
        </div>
      </div>
    </div>
  );
}
