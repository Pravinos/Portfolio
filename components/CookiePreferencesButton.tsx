"use client";

import { useConsent } from "@/components/ConsentProvider";

interface Props {
  className?: string;
}

export function CookiePreferencesButton({ className }: Props) {
  const { openConsentSettings } = useConsent();

  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className={className}
    >
      cookie preferences
    </button>
  );
}
