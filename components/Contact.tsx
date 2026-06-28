"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
  "block w-full rounded border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-left font-mono text-sm transition-colors hover:border-[#00ff9d]/50";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleEmailCopy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-sm text-[#888888]">// contact</p>
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2]">Get In Touch</h2>
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
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-[#00ff9d] px-2 py-0.5 text-xs font-medium text-[#0a0a0a]">
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
          >
            <span className="text-[#888888]">$ open </span>
            <span className="text-[#00ff9d]">{link.display}</span>
          </motion.a>
        ))}
      </div>

      <footer className="mt-16 space-y-1">
        <p className="text-xs text-[#555555]">
          Built with Next.js, Tailwind, Framer Motion &amp; Groq
        </p>
        <p className="text-xs text-[#555555]">© 2025 Pravinos Thomas</p>
      </footer>
    </div>
  );
}
