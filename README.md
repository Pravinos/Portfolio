# Pravinos Thomas — Portfolio

My personal developer portfolio — a dark, terminal-inspired single page at [portfolio.prav1nos.me](https://portfolio.prav1nos.me). It covers my background, education, work history, projects, and certifications, with a floating AI chat that answers questions about my CV.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-00ff9d?style=flat-square)

## Why I built it this way

I wanted a portfolio that felt like mine — not a generic template. The terminal aesthetic (`#00ff9d` on `#0a0a0a`, monospace-style section labels like `// about`, command-row contact links) matches how I actually work: dark editor, green accents, code-first presentation.

Everything lives on one scrollable page. Recruiters and collaborators can skim the full picture in one pass, and the nav uses `IntersectionObserver` to highlight whichever section is in view. On mobile, education and certifications drop out of the nav to keep the menu usable.

Rather than a static PDF or a LinkedIn link dump, I added an AI chat widget grounded in structured CV data. Visitors can ask natural questions — stack, experience, thesis, projects — and get answers streamed back from Groq. The site content and the AI knowledge base stay in sync via `lib/cv-context.ts`.

## What’s on the site

- **Hero** — Rotating typewriter titles and skill pills
- **About** — Bio, quick facts, language bars, and a “currently” status line
- **Education** — Degree, SpaceDot / AcubeSAT thesis, academic project cards
- **Experience** — Vertical timeline with Deloitte, military service, Synapsecom, SpaceDot, and internship entries
- **Projects** — Responsive cards with stack tags, GitHub links, and live demos where they exist
- **Certifications** — Credential cards with verification links
- **Contact** — Terminal-style `$ open` rows; email copies to clipboard on click
- **AI chat** — Floating drawer with starter questions and streaming responses
- **Privacy** — GDPR-oriented policy page with cookie preference controls

## How I built it

### Stack and structure

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and Framer Motion for animations. The AI layer uses the Vercel AI SDK with Groq (`llama-3.3-70b-versatile`). Typography is [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — used for both body and mono-style labels.

The app is a single route (`app/page.tsx`) composed of section components. Personal content is mostly inline in those components; the chat assistant reads from `lib/cv-context.ts`, which mirrors the same facts in a prompt-friendly format.

```
portfolio/
├── app/
│   ├── api/chat/route.ts      # Streaming chat endpoint (rate-limited)
│   ├── privacy/page.tsx       # Privacy policy
│   ├── robots.ts / sitemap.ts # SEO helpers
│   ├── globals.css            # Scrollbar, selection, cursor blink
│   ├── layout.tsx             # Fonts, metadata, consent wrapper
│   └── page.tsx               # Single-page layout
├── components/                # Nav, sections, chat, consent UI
├── lib/
│   ├── cv-context.ts          # CV data + AI system prompt
│   ├── groq.ts                # Groq client + model config
│   ├── consent.ts             # Cookie consent persistence
│   └── analytics.ts           # GA event helpers (consent-gated)
└── tailwind.config.ts         # Colour tokens
```

### Design

Colour tokens live in `tailwind.config.ts`: near-black background (`#0a0a0a`), elevated surfaces (`#111111` / `#1a1a1a`), green primary (`#00ff9d`), blue secondary (`#0ea5e9`) for highlights like language bars. Section entrances use Framer Motion `whileInView` so animations fire once on scroll, not on every re-render.

The hero typewriter cycles through titles with a simple state machine — type, pause, delete, next — no extra library.

### Navigation

Fixed nav tracks section visibility with `IntersectionObserver` (50% visibility threshold). Mobile gets a hamburger menu; education and certifications are hidden from the condensed nav on small screens.

### AI chat

`POST /api/chat` rate-limits to 10 requests per minute per IP (in-memory), injects CV context as the system prompt, and streams via Groq. The widget uses `@ai-sdk/react`’s `useChat` hook with starter questions to reduce blank-page friction.

Model and token limits are configured in `lib/groq.ts`.

### Analytics and consent

Google Analytics loads only after explicit opt-in. A consent banner and footer “cookie preferences” control persist the choice in local storage; `trackEvent` no-ops until consent is granted. Events cover contact clicks and chat interactions — enough to see what people use, without collecting more than necessary. A `/privacy` page documents the setup under GDPR.

### SEO

Metadata in `layout.tsx` sets `metadataBase`, Open Graph, Twitter cards, and keywords. `robots.ts` and `sitemap.ts` point at the live domain. Google site verification lives in `public/`.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| AI | Vercel AI SDK + Groq |
| Analytics | Google Analytics (consent-gated) |
| Font | Space Grotesk |

## Deployment

Hosted on Vercel at [portfolio.prav1nos.me](https://portfolio.prav1nos.me). Environment variables on the host: `GROQ_API_KEY` for the chat API, `NEXT_PUBLIC_SITE_URL` for canonical URLs, and `NEXT_PUBLIC_GA_ID` for analytics.

## License

Private — all rights reserved.
