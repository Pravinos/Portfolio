import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { TypingHeader } from "@/components/TypingHeader";

export const metadata: Metadata = {
  title: "Privacy Policy - Pravinos Thomas",
  description:
    "Privacy policy for portfolio.prav1nos.me, including Google Analytics and your data rights under GDPR.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 pb-32">
      <Link
        href="/"
        className="terminal-interactive inline-flex items-center font-mono text-sm text-muted transition-colors duration-200 hover:text-accent"
      >
        ← back to portfolio
      </Link>

      <TypingHeader
        text="// privacy"
        className="mt-8 font-mono text-lg text-[#888888]"
      />
      <h1 className="mt-2 text-4xl font-bold text-[#e2e2e2] md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-[#888888]">Last updated: June 2026</p>

      <div className="mt-12 space-y-10 text-left text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            1. Who is responsible
          </h2>
          <p className="mt-3">
            This website is operated by Pravinos Thomas (&quot;I&quot;, &quot;me&quot;).
            For privacy-related requests, contact{" "}
            <a
              href="mailto:tpravinos99@gmail.com"
              className="terminal-interactive inline-flex items-center text-accent underline underline-offset-2 transition-colors duration-200 hover:text-accent-bright"
            >
              tpravinos99@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            2. What this site collects
          </h2>
          <p className="mt-3">
            When you browse this portfolio, your browser sends standard
            technical data needed to deliver the site (for example IP address,
            browser type, and requested pages). This is processed by my hosting
            provider to serve the website.
          </p>
          <p className="mt-3">
            If you use the AI chat widget, your messages are sent to Groq&apos;s
            API to generate responses based on my CV context. Do not submit
            sensitive personal data in the chat.
          </p>
          <p className="mt-3">
            If you <strong className="font-medium text-[#e2e2e2]">accept</strong>{" "}
            analytics cookies, Google Analytics collects usage data such as
            pages viewed, approximate location derived from IP, device/browser
            information, and interactions you trigger (for example link clicks).
            Analytics does not run unless you consent.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            3. Legal basis (GDPR)
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              <strong className="font-medium text-[#e2e2e2]">
                Website delivery:
              </strong>{" "}
              legitimate interest in operating and securing the site.
            </li>
            <li>
              <strong className="font-medium text-[#e2e2e2]">
                AI chat widget:
              </strong>{" "}
              legitimate interest in responding to visitor questions about my
              work; you choose to submit a message.
            </li>
            <li>
              <strong className="font-medium text-[#e2e2e2]">
                Google Analytics:
              </strong>{" "}
              your consent (Art. 6(1)(a) GDPR). No analytics cookies or GA
              scripts load until you accept.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            4. Google Analytics
          </h2>
          <p className="mt-3">
            Analytics is provided by Google LLC (USA). Google processes data
            under its own terms and may transfer data outside the European
            Economic Area. Google participates in the EU-US Data Privacy
            Framework. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-interactive inline-flex items-center text-accent underline underline-offset-2 transition-colors duration-200 hover:text-accent-bright"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </p>
          <p className="mt-3">
            IP addresses are anonymized before storage. Advertising features
            and Google signals are disabled. If you reject analytics, no Google
            Analytics scripts are loaded and no analytics cookies are set.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            5. Cookies and local storage
          </h2>
          <p className="mt-3">
            This site stores your analytics consent choice in your browser&apos;s
            local storage so the banner is not shown on every visit. That
            preference is strictly necessary to remember your choice.
          </p>
          <p className="mt-3">
            If you accept analytics, Google Analytics may set cookies such as
            <code className="mx-1 rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-xs text-[#e2e2e2]">
              _ga
            </code>{" "}
            to distinguish visits. You can withdraw consent at any time using
            the button below - analytics will stop and your choice will be
            updated.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            6. Your rights
          </h2>
          <p className="mt-3">
            If you are in the EEA/UK, you have the right to access, rectify,
            erase, restrict, or object to processing of your personal data, and
            to withdraw consent at any time without affecting the lawfulness of
            prior processing. You also have the right to lodge a complaint with
            your local supervisory authority (in Greece: the Hellenic Data
            Protection Authority).
          </p>
          <p className="mt-3">
            To exercise these rights, email{" "}
            <a
              href="mailto:tpravinos99@gmail.com"
              className="terminal-interactive inline-flex items-center text-accent underline underline-offset-2 transition-colors duration-200 hover:text-accent-bright"
            >
              tpravinos99@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            7. Retention
          </h2>
          <p className="mt-3">
            Google Analytics retention is configured in my Google Analytics
            account (default up to 14 months for event data). Hosting logs are
            retained according to my hosting provider&apos;s policy.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-base font-medium text-[#e2e2e2]">
            8. Manage your consent
          </h2>
          <p className="mt-3">
            You can accept or reject analytics cookies at any time:
          </p>
          <CookiePreferencesButton className="terminal-interactive mt-4 inline-flex items-center rounded border border-border bg-surface2 px-4 py-2 font-mono text-xs text-text transition-colors duration-200 hover:border-accent/50" />
        </section>
      </div>
    </main>
  );
}
