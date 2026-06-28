# Pravinos Thomas — Portfolio

A dark, terminal-themed developer portfolio built with Next.js. It showcases bio, education, work history, projects, certifications, and contact links — plus a floating AI chat widget powered by Groq that answers questions about your background from structured CV data.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-00ff9d?style=flat-square)

## Features

- **Terminal aesthetic** — Monospace typography, green accent (`#00ff9d`), and dark surfaces inspired by a dev environment
- **Animated sections** — Framer Motion entrance animations, typewriter hero titles, and scroll-triggered timeline/card reveals
- **Smart navigation** — Fixed nav with `IntersectionObserver`-based active section highlighting, a mobile hamburger menu, and condensed mobile nav (education and certifications hidden on small screens)
- **About section** — Personal bio, quick facts, language proficiency bars, and a “currently” status line
- **Education** — Degree details, thesis highlight (SpaceDot / AcubeSAT), and academic project cards with GitHub links
- **Work history timeline** — Vertical timeline with experience entries, highlights, and staggered animations
- **Project grid** — Responsive cards with tech stack pills, GitHub links, optional secondary repos, and optional live demo links
- **Certifications** — Credential cards with issuer, issue date, verification links, and skill tags
- **Contact section** — Terminal-style command rows with one-click email copy to clipboard
- **AI chat widget** — Streaming assistant grounded in your CV via a Groq-backed API route
- **SEO ready** — Dynamic `metadataBase`, Open Graph, Twitter cards, keywords, and theme colour metadata

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| AI | [Vercel AI SDK](https://sdk.vercel.ai) + [Groq](https://groq.com) (`llama-3.3-70b-versatile`) |
| Font | [Geist Mono](https://vercel.com/font) |

## Getting started

### Prerequisites

- Node.js 20+
- A [Groq API key](https://console.groq.com) (required for the chat widget)

### Installation

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes (for chat) | Groq API access for the AI chat widget |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for Open Graph / social metadata (defaults to Vercel URL or `http://localhost:3000`) |

The chat API route will not work without `GROQ_API_KEY`. All other sections render without it.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project structure

```
portfolio/
├── app/
│   ├── api/chat/route.ts   # Streaming AI chat endpoint (rate-limited)
│   ├── globals.css         # Global styles, scrollbar, cursor blink
│   ├── layout.tsx          # Root layout, fonts, SEO metadata
│   └── page.tsx            # Single-page layout and section IDs
├── components/
│   ├── Nav.tsx             # Fixed nav + mobile menu
│   ├── Hero.tsx            # Typewriter hero + skill pills
│   ├── About.tsx           # Bio, facts, languages, current status
│   ├── Education.tsx       # Degree, thesis, academic projects
│   ├── Experience.tsx      # Work history timeline
│   ├── Projects.tsx        # Project grid
│   ├── Certifications.tsx  # Professional certifications
│   ├── Contact.tsx         # Contact links + footer
│   └── ChatWidget.tsx      # Floating AI chat drawer
├── lib/
│   ├── cv-context.ts       # CV data + AI system prompt
│   └── groq.ts             # Groq client singleton + model config
├── types/
│   └── index.ts            # Shared TypeScript types
├── public/                 # Static assets (add og-image.png here)
├── .env.example            # Environment variable template
├── tailwind.config.ts      # Design tokens and colour palette
└── next.config.ts          # Next.js configuration
```

## Page sections

The site is a single scrollable page with these anchor sections:

| Section | ID | Component |
| --- | --- | --- |
| Hero | `#hero` | `Hero.tsx` |
| About | `#about` | `About.tsx` |
| Education | `#education` | `Education.tsx` |
| Experience | `#experience` | `Experience.tsx` |
| Projects | `#projects` | `Projects.tsx` |
| Certifications | `#certifications` | `Certifications.tsx` |
| Contact | `#contact` | `Contact.tsx` |

## Customisation

Most personal content lives in a handful of files:

| What to change | File |
| --- | --- |
| Name, typewriter titles, skill pills | `components/Hero.tsx` |
| Bio, facts, languages, current status | `components/About.tsx` |
| Degree, thesis, academic projects | `components/Education.tsx` |
| Work history | `components/Experience.tsx` |
| Projects | `components/Projects.tsx` |
| Certifications | `components/Certifications.tsx` |
| Email, LinkedIn, GitHub | `components/Contact.tsx` |
| AI knowledge base (CV data) | `lib/cv-context.ts` |
| Site title, description, OG metadata | `app/layout.tsx` |
| Colour palette | `tailwind.config.ts` |

Keep `lib/cv-context.ts` in sync with the visible portfolio content so the AI assistant stays accurate.

## AI chat

The chat widget sends messages to `POST /api/chat`, which:

1. Rate-limits requests to **10 per minute per IP** (in-memory; resets on server restart)
2. Injects CV context from `lib/cv-context.ts` as the system prompt
3. Streams responses from Groq via the Vercel AI SDK

To change the model or token limit, edit `lib/groq.ts`:

```ts
export const CHAT_MODEL = "llama-3.3-70b-versatile";
export const MAX_TOKENS = 1024;
```

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended) or any Node.js host that supports Next.js App Router.

1. Push the repo to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `GROQ_API_KEY` — required for the chat widget
   - `NEXT_PUBLIC_SITE_URL` — your production domain (e.g. `https://yourname.dev`)
4. Deploy

Before going live, also:

- Set `NEXT_PUBLIC_SITE_URL` to your real domain so social previews resolve correctly
- Add `/public/og-image.png` (1200×630) for Open Graph and Twitter previews
- Add a favicon at `app/icon.png` or `app/favicon.ico`
- Swap CV/project/experience data with your own if forking this template

## Design tokens

Defined in `tailwind.config.ts`:

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#0a0a0a` | Page background |
| Surface | `#111111` / `#1a1a1a` | Cards, panels |
| Border | `#2a2a2a` | Dividers, outlines |
| Primary / green | `#00ff9d` | Accent, links, CTAs |
| Secondary / blue | `#0ea5e9` | Language bars, highlights |
| Body text | `#e2e2e2` | Headings, main copy |
| Muted | `#888888` | Secondary text |

## License

Private — all rights reserved.
