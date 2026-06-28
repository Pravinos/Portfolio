# Thomas Praveen — Portfolio

A dark, terminal-themed developer portfolio built with Next.js. It showcases work history, projects, and contact links — plus a floating AI chat widget powered by Groq that answers questions about your background from structured CV data.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-00ff9d?style=flat-square)

## Features

- **Terminal aesthetic** — Monospace typography, green accent (`#00ff9d`), and dark surfaces inspired by a dev environment
- **Animated sections** — Framer Motion entrance animations, typewriter hero titles, and scroll-triggered timeline/card reveals
- **Smart navigation** — Fixed nav with `IntersectionObserver`-based active section highlighting and a mobile hamburger menu
- **Work history timeline** — Vertical timeline with experience entries, highlights, and staggered animations
- **Project grid** — Responsive cards with tech stack pills, GitHub links, and optional live demo links
- **Contact section** — Terminal-style command rows with one-click email copy to clipboard
- **AI chat widget** — Streaming assistant grounded in your CV via a Groq-backed API route
- **SEO ready** — Open Graph, Twitter cards, keywords, and theme colour metadata

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| AI | [Vercel AI SDK](https://sdk.vercel.ai) + [Groq](https://groq.com) (`llama-3.1-8b-instant`) |
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

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

The chat API route will not work without this key. All other sections render without it.

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
│   ├── Experience.tsx      # Work history timeline
│   ├── Projects.tsx        # Project grid
│   ├── Contact.tsx         # Contact links + footer
│   └── ChatWidget.tsx      # Floating AI chat drawer
├── lib/
│   ├── cv-context.ts       # CV data + AI system prompt
│   └── groq.ts             # Groq client singleton
├── types/
│   └── index.ts            # Shared TypeScript types
└── public/                 # Static assets
```

## Customisation

Most personal content lives in a handful of files:

| What to change | File |
| --- | --- |
| Name, bio, skills, typewriter titles | `components/Hero.tsx` |
| Work history | `components/Experience.tsx` |
| Projects | `components/Projects.tsx` |
| Email, LinkedIn, GitHub | `components/Contact.tsx` |
| AI knowledge base (CV data) | `lib/cv-context.ts` |
| Site title, description, OG URL | `app/layout.tsx` |
| Colour palette | `tailwind.config.ts` |

Update placeholder links (`thomas@example.com`, `https://github.com/thomas`, etc.) before deploying.

## AI chat

The chat widget sends messages to `POST /api/chat`, which:

1. Rate-limits requests to **10 per minute per IP** (in-memory; resets on server restart)
2. Injects CV context from `lib/cv-context.ts` as the system prompt
3. Streams responses from Groq via the Vercel AI SDK

To change the model or token limit, edit `lib/groq.ts`:

```ts
export const CHAT_MODEL = "llama-3.1-8b-instant";
export const MAX_TOKENS = 512;
```

Keep `lib/cv-context.ts` in sync with the visible portfolio content so the assistant stays accurate.

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended) or any Node.js host that supports Next.js App Router.

1. Push the repo to GitHub
2. Import the project in Vercel
3. Add `GROQ_API_KEY` as an environment variable
4. Deploy

Before going live, also:

- Replace `https://thomas.dev` in `app/layout.tsx` with your real domain
- Add `metadataBase: new URL("https://your-domain.com")` to the metadata export so social images resolve correctly
- Add `/public/og-image.png` (1200×630) for Open Graph and Twitter previews
- Swap placeholder CV/project/experience data with your own

## Design tokens

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#0a0a0a` | Page background |
| Surface | `#111111` / `#1a1a1a` | Cards, panels |
| Border | `#2a2a2a` | Dividers, outlines |
| Primary | `#00ff9d` | Accent, links, CTAs |
| Body text | `#e2e2e2` | Headings, main copy |
| Muted | `#888888` | Secondary text |

## License

Private — all rights reserved.
