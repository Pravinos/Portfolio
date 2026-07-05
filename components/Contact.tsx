"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { TypingHeader } from "@/components/TypingHeader";
import { trackEvent } from "@/lib/analytics";

const EMAIL = "tpravinos99@gmail.com";

const CONTACT_LINKS = [
  {
    id: "linkedin",
    display: "linkedin.com/in/thomas-pravinos",
    href: "https://www.linkedin.com/in/thomas-pravinos/",
  },
  {
    id: "github",
    display: "github.com/Pravinos",
    href: "https://github.com/Pravinos/",
  },
] as const;

const rowClassName =
  "terminal-interactive flex w-full items-center rounded border border-border bg-surface2 px-4 py-3 text-left font-mono text-lg transition-colors duration-200 hover:border-accent/50";

const copyButtonClassName =
  "terminal-interactive shrink-0 rounded border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-sm text-accent transition-colors duration-200 hover:bg-accent/20 disabled:opacity-60";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      trackEvent("click", "contact", "contact_email_copy");
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="section-shell mx-auto max-w-3xl text-center">
      <TypingHeader
        text="// contact"
        className="font-mono text-lg text-[#888888]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2] sm:text-5xl">Get In Touch</h2>
        <p className="mt-4 text-base text-[#888888] sm:text-lg">
          Have a project in mind or want to collaborate? I&apos;d love to hear
          from you.
        </p>
      </motion.div>

      <div className="mt-12 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3 rounded border border-border bg-surface2 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="min-w-0 font-mono text-lg">
            <span className="text-[#888888]">
              <span className="cmd-prefix-sm-hidden">$ </span>cat contact.txt{" "}
            </span>
            <span className="break-all text-accent sm:break-normal">{EMAIL}</span>
          </p>
          <button
            type="button"
            onClick={handleEmailCopy}
            disabled={copied}
            aria-live="polite"
            className={`${copyButtonClassName} self-end sm:self-auto`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </motion.div>

        {CONTACT_LINKS.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (index + 1) * 0.1 }}
            viewport={{ once: true }}
            className={rowClassName}
            onClick={() =>
              trackEvent("click", "contact", `contact_${link.id}`)
            }
          >
            <span className="text-[#888888]">
              <span className="cmd-prefix-sm-hidden">$ </span>open{" "}
            </span>
            <span className="break-all text-accent sm:break-normal">{link.display}</span>
          </motion.a>
        ))}
      </div>

      <footer className="mt-16 space-y-1">
        <p className="text-base text-[#555555]">
          Built with Next.js, Tailwind, Framer Motion &amp; Groq
        </p>
        <p className="text-base text-[#555555]">© 2026 Pravinos Thomas</p>
        <p className="mt-3 font-mono text-sm text-dim sm:text-[12px]">
          <Link
            href="/privacy"
            className="terminal-interactive inline-flex items-center text-muted underline underline-offset-2 transition-colors duration-200 hover:text-accent"
          >
            privacy policy
          </Link>
          <span className="text-[#555555]"> · </span>
          <CookiePreferencesButton className="terminal-interactive inline-flex items-center text-muted underline underline-offset-2 transition-colors duration-200 hover:text-accent" />
        </p>
        <p className="mt-2 font-mono text-sm text-dim sm:text-[12px]">
          google analytics runs only with your consent. reject anytime via
          cookie preferences.
        </p>
      </footer>
    </div>
  );
}
