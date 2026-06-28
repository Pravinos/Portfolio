"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
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
  "block w-full rounded border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-left font-mono text-lg transition-colors hover:border-[#00ff9d]/50";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleEmailCopy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 pb-32 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-lg text-[#888888]">// contact</p>
        <h2 className="mt-2 text-5xl font-bold text-[#e2e2e2]">Get In Touch</h2>
        <p className="mt-4 text-[#888888]">
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
          className="relative"
        >
          <button
            type="button"
            onClick={handleEmailCopy}
            className={rowClassName}
          >
            <span className="text-[#888888]">$ open </span>
            <span className="text-[#00ff9d]">mailto:{EMAIL}</span>
          </button>
          {copied && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-[#00ff9d] px-2 py-0.5 text-base font-medium text-[#0a0a0a]">
              Copied!
            </span>
          )}
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
            onClick={() => trackEvent("contact_click", { link: link.id })}
          >
            <span className="text-[#888888]">$ open </span>
            <span className="text-[#00ff9d]">{link.display}</span>
          </motion.a>
        ))}
      </div>

      <footer className="mt-16 space-y-1">
        <p className="text-base text-[#555555]">
          Built with Next.js, Tailwind, Framer Motion &amp; Groq
        </p>
        <p className="text-base text-[#555555]">© 2026 Pravinos Thomas</p>
        <p className="mt-3 font-mono text-[12px] text-dim">
          <Link
            href="/privacy"
            className="text-[#888888] underline underline-offset-2 transition-colors hover:text-[#00ff9d]"
          >
            privacy policy
          </Link>
          <span className="text-[#555555]"> · </span>
          <CookiePreferencesButton className="text-[#888888] underline underline-offset-2 transition-colors hover:text-[#00ff9d]" />
        </p>
        <p className="font-mono text-[12px] text-dim mt-2">
          google analytics runs only with your consent. reject anytime via
          cookie preferences.
        </p>
      </footer>
    </div>
  );
}
