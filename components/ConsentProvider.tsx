"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ConsentBanner } from "@/components/ConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { updateGtagConsent } from "@/lib/analytics";
import {
  persistConsent,
  syncConsentFromStorage,
  type AnalyticsConsent,
} from "@/lib/consent";

interface ConsentContextValue {
  consent: AnalyticsConsent | null;
  isReady: boolean;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
  openConsentSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}

interface Props {
  children: ReactNode;
  gaId?: string;
}

export function ConsentProvider({ children, gaId }: Props) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setConsent(syncConsentFromStorage());
    setIsReady(true);
  }, []);

  const acceptAnalytics = useCallback(() => {
    persistConsent("granted");
    setConsent("granted");
    setShowSettings(false);
    updateGtagConsent(true);
  }, []);

  const rejectAnalytics = useCallback(() => {
    persistConsent("denied");
    setConsent("denied");
    setShowSettings(false);
    updateGtagConsent(false);
  }, []);

  const openConsentSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const showBanner = Boolean(gaId && isReady && (consent === null || showSettings));

  return (
    <ConsentContext.Provider
      value={{
        consent,
        isReady,
        acceptAnalytics,
        rejectAnalytics,
        openConsentSettings,
      }}
    >
      {children}
      {gaId && consent === "granted" && <GoogleAnalytics gaId={gaId} />}
      {showBanner && (
        <ConsentBanner
          onAccept={acceptAnalytics}
          onReject={rejectAnalytics}
        />
      )}
    </ConsentContext.Provider>
  );
}
