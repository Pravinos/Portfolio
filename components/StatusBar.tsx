"use client";

import { useEffect, useState } from "react";
import { PORTFOLIO_EVENTS } from "@/lib/portfolio-events";

/** Terminal-style status values - aligned with cv-context / Experience / About */
const PROFILE_STATUS = {
  status: "back_at_deloitte",
  location: "thessaloniki, gr",
  next: "building_products",
  uptime: "26y",
} as const;

function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function AskAiIcon() {
  return (
    <span className="font-mono text-sm font-bold leading-none text-accent">
      &gt;_
    </span>
  );
}

export default function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatClock(new Date()));
    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const openChat = () => {
    window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENTS.openChat));
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Personal status"
      className="fixed inset-x-0 bottom-0 z-50 h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] border-t border-white/10 bg-black/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur"
    >
      {/* Mobile: unified bar with AI icon, status, clock */}
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 md:hidden">
        <button
          type="button"
          onClick={openChat}
          aria-label="Ask AI"
          className="terminal-interactive inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-accent/30 bg-surface2 transition-colors duration-200 hover:border-accent/60 hover:bg-surface-elevated"
        >
          <AskAiIcon />
        </button>

        <div className="min-w-0 flex-1 truncate text-center font-mono text-sm text-white/50">
          <span>status: {PROFILE_STATUS.status}</span>
          <span aria-hidden="true"> | </span>
          <span>next: {PROFILE_STATUS.next}</span>
        </div>

        <time
          className="shrink-0 tabular-nums font-mono text-sm text-white/50"
          suppressHydrationWarning
        >
          {time || "--:--"}
        </time>
      </div>

      {/* Desktop: full status row */}
      <div className="mx-auto hidden h-14 max-w-6xl items-center justify-between px-4 md:flex lg:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 font-mono text-sm text-white/50">
          <span>status: {PROFILE_STATUS.status}</span>
          <span aria-hidden="true">|</span>
          <span>location: {PROFILE_STATUS.location}</span>
          <span aria-hidden="true">|</span>
          <span>next: {PROFILE_STATUS.next}</span>
          <span className="hidden lg:inline" aria-hidden="true">
            |
          </span>
          <span className="hidden lg:inline">uptime: {PROFILE_STATUS.uptime}</span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENTS.openHelp))
            }
            className="terminal-interactive inline-flex items-center gap-1 font-mono text-sm text-white/40 transition-colors duration-200 hover:text-accent"
            aria-label="Open keyboard shortcuts"
          >
            <span>shortcuts:</span>
            <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 text-sm text-accent lg:text-xs">
              ?
            </kbd>
          </button>

          <time className="tabular-nums" suppressHydrationWarning>
            {time || "--:--"}
          </time>
        </div>
      </div>
    </footer>
  );
}
