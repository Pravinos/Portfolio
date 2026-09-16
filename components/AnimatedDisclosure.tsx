"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReactNode, useId, useState } from "react";

type AnimatedDisclosureProps = {
  closedLabel: string;
  openLabel: string;
  children: ReactNode;
  className?: string;
};

export function AnimatedDisclosure({
  closedLabel,
  openLabel,
  children,
  className = "",
}: AnimatedDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div className={`rounded border border-border bg-bg/50 px-4 py-3 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="terminal-interactive flex w-full items-center justify-between gap-4 text-left font-mono text-sm text-accent hover:text-accent-bright"
      >
        <span>{open ? openLabel : closedLabel}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="text-muted"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="content"
            initial={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -6 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -4 }}
            transition={{
              height: { duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reduceMotion ? 0 : 0.18 },
              y: { duration: reduceMotion ? 0 : 0.22 },
            }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
