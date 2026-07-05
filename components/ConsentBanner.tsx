"use client";

import Link from "next/link";

interface Props {
  onAccept: () => void;
  onReject: () => void;
}

export function ConsentBanner({ onAccept, onReject }: Props) {
  return (
    <div
      role="dialog"
      aria-labelledby="consent-banner-title"
      aria-describedby="consent-banner-description"
      className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] z-[100] border-t border-[#2a2a2a] bg-[#111111] p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] md:bottom-0 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-left">
          <p
            id="consent-banner-title"
            className="font-mono text-sm font-medium text-[#e2e2e2]"
          >
            // analytics consent
          </p>
          <p
            id="consent-banner-description"
            className="mt-2 text-sm leading-relaxed text-[#888888]"
          >
            This site uses Google Analytics to understand how visitors use the
            portfolio. If you accept, Google LLC (USA) processes usage data
            including page views and interactions. You can reject analytics or
            change your choice anytime.{" "}
            <Link
              href="/privacy"
              className="terminal-interactive inline-flex items-center text-accent underline underline-offset-2 transition-colors duration-200 hover:text-accent-bright"
            >
              Privacy policy
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={onReject}
            className="terminal-interactive inline-flex items-center rounded border border-border px-4 py-2 font-mono text-sm text-text transition-colors duration-200 hover:border-muted sm:text-xs"
          >
            reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="terminal-interactive inline-flex items-center rounded bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent-bright sm:text-xs"
          >
            accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
