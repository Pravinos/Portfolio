const CONSENT_KEY = "portfolio-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

let currentConsent: AnalyticsConsent | null = null;

export function getStoredConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function syncConsentFromStorage(): AnalyticsConsent | null {
  currentConsent = getStoredConsent();
  return currentConsent;
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  return currentConsent;
}

export function persistConsent(consent: AnalyticsConsent): void {
  currentConsent = consent;
  localStorage.setItem(CONSENT_KEY, consent);
}
