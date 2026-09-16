"use client";

import { motion } from "framer-motion";
import { TypingHeader } from "@/components/TypingHeader";
import { ExternalLinkArrow } from "@/components/ExternalLinkArrow";
import { trackEvent } from "@/lib/analytics";

type ProjectData = {
  id: string;
  name: string;
  description: string;
  detail?: string;
  stack: string[];
  github?: string;
  githubLabel?: string;
  githubSecondary?: string;
  githubSecondaryLabel?: string;
  featured?: boolean;
  context?: string;
  liveUrl?: string;
  highlights?: string[];
};

const MAIN_PROJECTS: ProjectData[] = [
  {
    id: "vault",
    name: "Vault",
    description:
      "A personal finance SaaS platform with a 55-endpoint Spring Boot API and a Next.js frontend spanning 10+ pages. It covers multi-account balances, category budgets, reversible transfers, investment checkpoints, and financial goals.",
    detail:
      "Uses JWT authentication in HttpOnly cookies, BCrypt password hashing, Flyway migrations, and IP-based auth rate limiting. Its AI finance assistant exposes nine tool-calling functions grounded in live financial data, with provider routing between Groq and self-hosted LM Studio.",
    stack: ["Java 21", "Spring Boot", "Next.js", "TypeScript", "PostgreSQL", "TanStack Query", "Recharts"],
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
      "A self-hosted LLM chat platform with a FastAPI backend and Next.js frontend running on Ollama, exposing 11 REST endpoints for chat, history, models, and system metrics.",
    detail:
      "Concurrency-safe, asyncio-based session locking serializes model loads and unloads while queueing inference requests; idle models are automatically evicted. Deployed with Docker Compose over Tailscale and covered by 16 pytest tests.",
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
    "A football career-path guessing game where players identify footballers from their club and international career history.",
  "highlights": [
    "Six modes: Casual, Timed, Streak, Daily Career, Local Head-to-Head, and Online Head-to-Head",
    "Secure accounts with persistent statistics, match history, custom profile photos, and global leaderboards",
    "Real-time private rooms with synchronized turns, deadlines, scoring, and sudden death",
    "Curated Wikidata career records and Wikipedia/Wikimedia images, processed to remove youth, reserve, and duplicate teams",
    "Server-authoritative game state, authentication, and database security through Supabase",
  ],
  "stack": ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
  "liveUrl": "https://ballers.prav1nos.me/",
  "featured": true
}
,
  {
    id: "portfolio",
    name: "Developer Portfolio",
    description:
      "This terminal-inspired portfolio, built as a fast, responsive single-page site with an AI assistant that answers questions about my experience, projects, and interests.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Groq", "Vercel"],
    github: "https://github.com/Pravinos/Portfolio",
    liveUrl: "https://portfolio.prav1nos.me/",
    featured: false,
  },
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

const FEATURED_PROJECTS = ["guess-the-baller", "vault"].map(
  (id) => MAIN_PROJECTS.find((project) => project.id === id)!,
);
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
          {project.github && (
            <RepoLink
              href={project.github}
              label={project.githubSecondary ? (project.githubLabel ?? "api") : undefined}
              ariaLabel={`${project.name}${project.githubLabel ? ` ${project.githubLabel}` : ""} on GitHub`}
              onClick={() =>
                trackEvent("click", "project", `project_${project.id}_github`)
              }
            />
          )}
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
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name}`}
              className="inline-flex items-center gap-1 rounded border border-transparent px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-200 hover:border-accent/30 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={() =>
                trackEvent("click", "project", `project_${project.id}_live`)
              }
            >
              live
              <ExternalLinkArrow />
            </a>
          )}
        </div>
      </div>

      <p className="mt-2 text-lg leading-relaxed text-[#888888]">
        {project.description}
      </p>

      {project.highlights && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-relaxed text-dim">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}

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
          <div className="space-y-6">
            {FEATURED_PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                featured
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {GRID_PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl border-t border-border pt-10">
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono text-sm uppercase tracking-[3px] text-dim sm:text-[12px]">
              <span className="cmd-prefix-sm-hidden">{"// "}</span>built during military service
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <ProjectCard project={MILITARY_PROJECT} index={0} compact />
        </div>
      </div>
    </div>
  );
}
