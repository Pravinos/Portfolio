"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const BootReadyContext = createContext(true);

export function useBootReady() {
  return useContext(BootReadyContext);
}

const SESSION_KEY = "hasBooted";
const CHAR_DELAY_MS = 20;
const LINE_PAUSE_MS = 120;
const FINAL_PAUSE_MS = 300;
const FADE_DURATION_MS = 500;

const BOOT_LINES = [
  "$ ssh visitor@thomas-portfolio",
  "Connecting to portfolio.prav1nos.me...",
  "Authenticated.",
  "Loading modules: about, experience, projects, contact...",
  "Ready.",
];

type BootSequenceProps = {
  children: ReactNode;
};

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export default function BootSequence({ children }: BootSequenceProps) {
  const [contentVisible, setContentVisible] = useState(false);
  const [bootVisible, setBootVisible] = useState(false);
  const [bootFading, setBootFading] = useState(false);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasBooted = sessionStorage.getItem(SESSION_KEY) === "true";

    if (reducedMotion || hasBooted) {
      setContentVisible(true);
      return;
    }

    setBootVisible(true);

    const controller = new AbortController();
    const { signal } = controller;

    const runSequence = async () => {
      const finishedLines: string[] = [];

      for (const line of BOOT_LINES) {
        if (signal.aborted) return;

        for (let i = 0; i <= line.length; i += 1) {
          if (signal.aborted) return;
          setCurrentLine(line.slice(0, i));
          if (i < line.length) {
            await delay(CHAR_DELAY_MS, signal);
          }
        }

        finishedLines.push(line);
        setCompletedLines([...finishedLines]);
        setCurrentLine("");
        await delay(LINE_PAUSE_MS, signal);
      }

      if (signal.aborted) return;

      await delay(FINAL_PAUSE_MS, signal);
      if (signal.aborted) return;

      sessionStorage.setItem(SESSION_KEY, "true");
      setBootFading(true);
      setContentVisible(true);

      await delay(FADE_DURATION_MS, signal);
      if (signal.aborted) return;

      setBootVisible(false);
      setBootFading(false);
    };

    void runSequence();

    return () => controller.abort();
  }, []);

  return (
    <BootReadyContext.Provider value={contentVisible}>
      <div
        className={`transition-opacity duration-500 ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!contentVisible}
      >
        {children}
      </div>

      {bootVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-start bg-[#0a0a0a] p-6 font-mono text-sm leading-relaxed transition-opacity duration-500 sm:p-8 ${
            bootFading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-live="polite"
          aria-label="Portfolio boot sequence"
        >
          <div className="w-full max-w-2xl">
            {completedLines.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={
                  line.startsWith("$")
                    ? "text-emerald-400"
                    : "text-neutral-300"
                }
              >
                {line}
              </p>
            ))}
            {currentLine && (
              <p
                className={
                  currentLine.startsWith("$")
                    ? "text-emerald-400"
                    : "text-neutral-300"
                }
              >
                {currentLine}
                <span className="animate-pulse text-emerald-400" aria-hidden="true">
                  █
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </BootReadyContext.Provider>
  );
}
