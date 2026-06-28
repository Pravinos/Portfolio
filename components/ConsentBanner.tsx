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
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#2a2a2a] bg-[#111111] p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] sm:p-6"
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
              className="text-[#00ff9d] underline underline-offset-2 hover:opacity-90"
            >
              Privacy policy
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={onReject}
            className="rounded border border-[#2a2a2a] px-4 py-2 font-mono text-xs text-[#e2e2e2] transition-colors hover:border-[#888888]"
          >
            reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded bg-[#00ff9d] px-4 py-2 font-mono text-xs font-medium text-[#0a0a0a] transition hover:opacity-90"
          >
            accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
