"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export type ShortcutEntry = {
  keys: string[];
  description: string;
};

export const SHORTCUTS: ShortcutEntry[] = [
  {
    keys: ["?", "⌘K", "Ctrl+K"],
    description: "Open this keyboard shortcuts reference",
  },
  {
    keys: ["c"],
    description: "Open the AI chat widget",
  },
  {
    keys: ["j", "k"],
    description: "Scroll down / up (vim-style)",
  },
  {
    keys: ["/", "Esc"],
    description: "Close modals and dismiss overlays",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

function formatKey(key: string): string {
  return key;
}

export default function HelpModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close keyboard shortcuts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/70"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-4 top-[12vh] z-[111] mx-auto max-h-[76vh] max-w-lg overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-5 font-mono text-sm shadow-[0_16px_48px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:w-full sm:p-6"
          >
            <header className="mb-4 border-b border-[#2a2a2a] pb-3">
              <h2
                id="help-modal-title"
                className="mt-1 text-base font-bold uppercase tracking-wide text-[#e2e2e2]"
              >
                keyboard-shortcuts
              </h2>
              <p className="mt-1 text-xs text-[#555555]">
                Portfolio keyboard reference — press{" "}
                <kbd className="rounded border border-[#333333] bg-[#161616] px-1 py-0.5 text-accent">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </header>

            <section className="space-y-4 text-[#888888]">
              <div>
                <h3 className="mb-1 text-xs font-bold uppercase text-accent">
                  Name
                </h3>
                <p>
                  shortcuts — global keyboard commands for power users
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-bold uppercase text-accent">
                  Synopsis
                </h3>
                <p className="text-[#e2e2e2]">
                  <span className="text-[#555555]">$ </span>
                  shortcuts [key]
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-bold uppercase text-accent">
                  Description
                </h3>
                <p className="leading-relaxed">
                  These shortcuts work anywhere on the page except when typing
                  in a form field. Designed for terminal-style navigation.
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-bold uppercase text-accent">
                  Commands
                </h3>
                <dl className="space-y-2.5">
                  {SHORTCUTS.map(({ keys, description }) => (
                    <div
                      key={keys.join("-")}
                      className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3"
                    >
                      <dt className="flex shrink-0 flex-wrap gap-1">
                        {keys.map((key, index) => (
                          <span key={key} className="inline-flex items-center gap-1">
                            {index > 0 && (
                              <span className="text-[#444444]">/</span>
                            )}
                            <kbd className="rounded border border-[#333333] bg-[#161616] px-1.5 py-0.5 text-xs text-accent">
                              {formatKey(key)}
                            </kbd>
                          </span>
                        ))}
                      </dt>
                      <dd className="min-w-0 flex-1 text-[#888888] sm:pt-0.5">
                        {description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
