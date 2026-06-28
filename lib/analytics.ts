import { getAnalyticsConsent } from "@/lib/consent";

export function updateGtagConsent(granted: boolean): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string
) => {
  if (getAnalyticsConsent() !== "granted") return;
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
