"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CHAR_DELAY_MS = 40;
const BLINK_INTERVAL_MS = 400;
const BLINK_COUNT = 3;

type Phase = "idle" | "typing" | "blinking" | "done";

type TypingHeaderProps = {
  text: string;
  className?: string;
};

export function TypingHeader({
  text,
  className = "font-mono text-lg text-muted",
}: TypingHeaderProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const hasStarted = useRef(false);

  const [visibleCount, setVisibleCount] = useState(
    prefersReducedMotion ? text.length : 0,
  );
  const [phase, setPhase] = useState<Phase>(
    prefersReducedMotion ? "done" : "idle",
  );
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(text.length);
      setPhase("done");
      setCursorVisible(false);
      return;
    }

    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    setPhase("typing");
    setVisibleCount(0);
    setCursorVisible(true);

    let charIndex = 0;
    let typeTimer: ReturnType<typeof setInterval> | undefined;
    let blinkTimeout: ReturnType<typeof setTimeout> | undefined;

    typeTimer = setInterval(() => {
      charIndex += 1;
      setVisibleCount(charIndex);

      if (charIndex >= text.length) {
        clearInterval(typeTimer);
        setPhase("blinking");

        let blinkStep = 0;
        const halfBlink = BLINK_INTERVAL_MS / 2;

        const runBlinkStep = () => {
          if (blinkStep >= BLINK_COUNT * 2) {
            setCursorVisible(false);
            setPhase("done");
            return;
          }

          setCursorVisible(blinkStep % 2 === 1);
          blinkStep += 1;
          blinkTimeout = setTimeout(runBlinkStep, halfBlink);
        };

        runBlinkStep();
      }
    }, CHAR_DELAY_MS);

    return () => {
      clearInterval(typeTimer);
      clearTimeout(blinkTimeout);
    };
  }, [isInView, prefersReducedMotion, text]);

  const showCursor =
    phase === "typing" || (phase === "blinking" && cursorVisible);

  return (
    <motion.p ref={ref} className={className} aria-label={text}>
      {text.slice(0, visibleCount)}
      {showCursor && <span aria-hidden="true">█</span>}
    </motion.p>
  );
}
