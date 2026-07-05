"use client";

import { useCallback, useEffect, useState } from "react";
import HelpModal from "@/components/HelpModal";
import { PORTFOLIO_EVENTS } from "@/lib/portfolio-events";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;

  return false;
}

export default function KeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);

  const closeModals = useCallback(() => {
    setHelpOpen(false);
    window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENTS.closeChat));
  }, []);

  const openHelp = useCallback(() => {
    setHelpOpen(true);
  }, []);

  useEffect(() => {
    const handleOpenHelp = () => openHelp();

    window.addEventListener(PORTFOLIO_EVENTS.openHelp, handleOpenHelp);
    return () =>
      window.removeEventListener(PORTFOLIO_EVENTS.openHelp, handleOpenHelp);
  }, [openHelp]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openHelp();
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        openHelp();
        return;
      }

      if (event.key === "Escape") {
        if (helpOpen) {
          event.preventDefault();
          setHelpOpen(false);
          return;
        }

        closeModals();

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      if (helpOpen) return;

      switch (event.key) {
        case "c":
          event.preventDefault();
          window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENTS.openChat));
          break;
        case "j":
          event.preventDefault();
          window.scrollBy({ top: 80, behavior: "smooth" });
          break;
        case "k":
          event.preventDefault();
          window.scrollBy({ top: -80, behavior: "smooth" });
          break;
        case "/":
          event.preventDefault();
          closeModals();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModals, helpOpen, openHelp]);

  return <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />;
}
