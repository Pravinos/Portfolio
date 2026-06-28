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
  eventName: string,
  params?: Record<string, string>
) => {
  if (getAnalyticsConsent() !== "granted") return;
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, params);
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
