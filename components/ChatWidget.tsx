"use client";

import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { trackEvent } from "@/lib/analytics";
import ChatMarkdown from "@/components/ChatMarkdown";
import { resolveChatError } from "@/lib/chat-errors";
import { useDraggableWindow } from "@/hooks/useDraggable";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { PORTFOLIO_EVENTS } from "@/lib/portfolio-events";

const STARTER_QUESTIONS: Record<string, string[]> = {
  default: [
    "What makes Pravinos a strong software engineer?",
    "Which project should I explore first?",
    "What does he do outside of work?",
  ],
  about: [
    "Tell me more about Pravinos",
    "What does he enjoy outside of work?",
    "What technologies does he prefer?",
  ],
  education: [
    "How did the nanosatellite thesis work?",
    "What did he build for AcubeSAT?",
    "Which academic projects stand out?",
  ],
  experience: [
    "What LLM tools did he build at Deloitte?",
    "What did he do during military service?",
    "Summarize his backend experience",
  ],
  projects: [
    "How does Guess the Baller work?",
    "Why build Vault as a full-stack SaaS?",
    "Compare Vault and elelem",
  ],
  certifications: [
    "Which AI certifications does he hold?",
    "What supports his React experience?",
    "Summarize his verified skills",
  ],
  contact: [
    "What kinds of roles fit Pravinos?",
    "Summarize his experience for a recruiter",
    "Where can I find his work?",
  ],
};

const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  default: ["Which project best shows his backend skills?", "Summarize his experience for a recruiter"],
  about: ["How does his working style show up in his projects?", "Which roles suit him best?"],
  education: ["What engineering skills did the thesis demonstrate?", "Tell me about his SpaceDot work"],
  experience: ["Which results from Deloitte stand out?", "How did military service broaden his skills?"],
  projects: ["Compare Guess the Baller and Vault", "Which project uses local AI?"],
  certifications: ["How do these certifications support his experience?", "What is his strongest technical area?"],
  contact: ["Draft a short recruiter summary", "Which projects should I review before contacting him?"],
};

const SECTION_LINKS: Record<string, { href: string; label: string }[]> = {
  default: [{ href: "#projects", label: "View projects" }, { href: "#experience", label: "View experience" }],
  about: [{ href: "#about", label: "Read his story" }, { href: "#contact", label: "Contact Pravinos" }],
  education: [{ href: "#education", label: "View education & thesis" }],
  experience: [{ href: "#experience", label: "View experience" }, { href: "#projects", label: "See related projects" }],
  projects: [{ href: "#project-guess-the-baller", label: "Guess the Baller" }, { href: "#project-vault", label: "Vault" }],
  certifications: [{ href: "#certifications", label: "View certifications" }],
  contact: [{ href: "#contact", label: "Contact Pravinos" }, { href: "#projects", label: "Review projects" }],
};

const TITLE_BAR_HEIGHT = 40;
const MOBILE_BREAKPOINT = 768;
const CHAT_WIDGET_DEFAULT_SIZE = { width: 480, height: 640 } as const;
const CHAT_WIDGET_MIN_SIZE = { width: 320, height: 280 } as const;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function TerminalPromptIcon() {
  return (
    <span className="font-mono text-lg font-bold leading-none" aria-hidden="true">
      &gt;_
    </span>
  );
}

function TrafficLights({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] transition hover:brightness-110"
      >
        <span className="text-[8px] font-bold leading-none text-[#4a0000] opacity-0 transition group-hover:opacity-100">
          ×
        </span>
      </button>
      <button
        type="button"
        onClick={onMinimize}
        aria-label="Minimize chat"
        className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] transition hover:brightness-110"
      >
        <span className="text-[8px] font-bold leading-none text-[#4a3000] opacity-0 transition group-hover:opacity-100">
          −
        </span>
      </button>
      <span
        className="h-3 w-3 rounded-full bg-[#28c840]"
        aria-hidden="true"
      />
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("default");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
    stop,
    clearError,
  } = useChat();
  const isLoading = status === "submitted" || status === "streaming";
  const chatError = resolveChatError(error);
  const isWindowVisible = isOpen && !isMinimized;
  const useDesktopWindow = !isMobile;

  const {
    windowRef,
    position,
    size,
    isDragging,
    isResizing,
    onDragStart,
    onResizeStart,
    resetWindow,
  } = useDraggableWindow(isOpen && useDesktopWindow, {
    defaultSize: CHAT_WIDGET_DEFAULT_SIZE,
    minSize: CHAT_WIDGET_MIN_SIZE,
  });
  useDialogFocus(isWindowVisible, windowRef, inputRef);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -55%", threshold: [0.1, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isWindowVisible) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, isWindowVisible]);

  useEffect(() => {
    const handleOpen = () => {
      trackEvent("open", "ai_widget", "chat_widget_opened");
      setIsOpen(true);
      setIsMinimized(false);
    };

    const handleClose = () => {
      setIsOpen(false);
      setIsMinimized(false);
    };

    window.addEventListener(PORTFOLIO_EVENTS.openChat, handleOpen);
    window.addEventListener(PORTFOLIO_EVENTS.closeChat, handleClose);

    return () => {
      window.removeEventListener(PORTFOLIO_EVENTS.openChat, handleOpen);
      window.removeEventListener(PORTFOLIO_EVENTS.closeChat, handleClose);
    };
  }, []);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    await sendMessage({ text });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const handleStarterQuestion = (question: string) => {
    if (isLoading) return;
    void sendMessage({ text: question });
  };

  const clearConversation = () => {
    if (isLoading) stop();
    setMessages([]);
    clearError();
    setInput("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
    trackEvent("click", "ai_widget", "chat_widget_cleared");
  };

  const handlePageLink = (href: string) => {
    trackEvent("click", "ai_widget", `chat_deep_link_${href.slice(1)}`);
    if (isMobile) {
      setIsOpen(false);
      setIsMinimized(false);
    }
  };

  const openChat = () => {
    trackEvent("open", "ai_widget", "chat_widget_opened");
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    resetWindow();
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const handleToggle = () => {
    if (!isOpen) {
      openChat();
      return;
    }

    if (isMinimized) {
      setIsMinimized(false);
      return;
    }

    closeChat();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (useDesktopWindow ? position : true) && (
          <>
            {isMobile && (
              <motion.button
                type="button"
                aria-label="Close chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeChat}
                className="fixed inset-0 z-[89] bg-black/60"
              />
            )}

            <motion.div
              ref={windowRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-window-title"
              tabIndex={-1}
              data-chat-window
              initial={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, y: 32, scale: 0.9, filter: "blur(6px)" }
              }
              animate={
                isMobile
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              }
              exit={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, y: 20, scale: 0.94, filter: "blur(4px)" }
              }
              transition={
                isMobile
                  ? { type: "spring", stiffness: 280, damping: 30 }
                  : { type: "spring", stiffness: 340, damping: 28, mass: 0.8 }
              }
              style={
                useDesktopWindow
                  ? {
                      left: position?.x,
                      top: position?.y,
                      width: `${size.width}px`,
                      height: isMinimized ? `${TITLE_BAR_HEIGHT}px` : `${size.height}px`,
                    }
                  : undefined
              }
              className={`fixed z-[90] flex origin-bottom-right flex-col overflow-hidden bg-[#0d0d0d] shadow-[0_20px_70px_rgba(0,0,0,0.72),0_0_40px_rgba(74,222,128,0.06)] ${
                isMobile
                  ? "inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] h-[70vh] max-h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom,0px)-4rem)] rounded-t-xl border border-b-0 border-[#2a2a2a]"
                  : "rounded-lg border border-[#2a2a2a]"
              } ${isDragging || isResizing ? "select-none" : ""} ${
                isMinimized && useDesktopWindow
                  ? "shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  : ""
              }`}
            >
            <div
              onMouseDown={useDesktopWindow ? onDragStart : undefined}
              className={`flex shrink-0 items-center gap-3 border-b border-[#2a2a2a] bg-[#161616] px-4 py-2.5 ${
                useDesktopWindow
                  ? `cursor-grab active:cursor-grabbing ${isDragging ? "cursor-grabbing" : ""}`
                  : ""
              } ${isMinimized && useDesktopWindow ? "border-b-0" : ""}`}
            >
              <TrafficLights
                onClose={closeChat}
                onMinimize={
                  isMobile
                    ? closeChat
                    : isMinimized
                      ? () => setIsMinimized(false)
                      : minimizeChat
                }
              />

              <button
                id="chat-window-title"
                type="button"
                onClick={() => isMinimized && setIsMinimized(false)}
                className={`min-w-0 flex-1 truncate text-left font-mono text-base text-muted sm:text-sm ${
                  isMinimized
                    ? "terminal-interactive cursor-pointer transition-colors duration-200 hover:text-text"
                    : ""
                }`}
              >
                <span className="text-accent">pravinos@portfolio</span>
                <span className="text-[#555555]">:</span>
                <span className="text-accent/70">~</span>
                <span className="text-[#555555]">$ </span>
                ai-chat
                {isMinimized && (
                  <span className="text-[#555555]"> (minimized)</span>
                )}
              </button>

              {!isMinimized && (
                <button
                  type="button"
                  onClick={clearConversation}
                  disabled={messages.length === 0 && !error}
                  aria-label="Clear conversation and restore suggested questions"
                  title="Clear conversation"
                  className="terminal-interactive rounded border border-border px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
                >
                  clear
                </button>
              )}

              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat window"
                className="terminal-interactive inline-flex items-center font-mono text-base leading-none text-[#555555] transition-colors duration-200 hover:text-text"
              >
                ×
              </button>
            </div>

            {!isMinimized && (
              <>
                <div className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4 font-mono text-base">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, duration: 0.28 }}
                      className="rounded border border-accent/15 bg-accent/[0.035] p-3"
                    >
                    <p className="text-xs uppercase tracking-[0.16em] text-accent/70">
                      context: {activeSection === "hero" ? "overview" : activeSection}
                    </p>
                    <p className="mt-2 leading-relaxed text-muted">
                      <span className="text-accent">#</span> Ask about my work,
                      stack, and projects — or get personal: anime, football,
                      series, games, and more.
                    </p>
                    </motion.div>
                  )}

                  {messages.map((message) => {
                    const text = getMessageText(message);
                    if (!text) return null;

                    const isUser = message.role === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] ${
                            isUser ? "text-right text-accent" : "text-left text-[#e2e2e2]"
                          }`}
                        >
                          <span className="text-[#555555]">
                            {isUser ? "you@local:~$" : "ai@portfolio:~$"}
                          </span>{" "}
                          {isUser ? (
                            <span>{text}</span>
                          ) : (
                            <ChatMarkdown content={text} />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="text-left text-[#555555]">
                      <span>ai@portfolio:~$</span>{" "}
                      <span className="animate-pulse text-[#888888]">...</span>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {messages.length === 0 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.055, delayChildren: 0.2 },
                      },
                    }}
                    className="flex flex-wrap gap-2 border-t border-[#2a2a2a] px-4 py-3"
                  >
                    {(STARTER_QUESTIONS[activeSection] ?? STARTER_QUESTIONS.default).map((question) => (
                      <motion.button
                        key={question}
                        type="button"
                        onClick={() => handleStarterQuestion(question)}
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="terminal-interactive inline-flex items-center rounded border border-border bg-surface2 px-2 py-1 font-mono text-base text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent sm:text-sm"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {messages.length > 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 border-t border-[#2a2a2a] px-4 py-3"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent/60">
                      continue exploring
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(SECTION_LINKS[activeSection] ?? SECTION_LINKS.default).map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => handlePageLink(link.href)}
                          className="terminal-interactive rounded border border-accent/30 bg-accent/[0.07] px-2 py-1 font-mono text-sm text-accent transition-colors hover:border-accent/60 hover:bg-accent/10"
                        >
                          {link.label} <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(FOLLOW_UP_QUESTIONS[activeSection] ?? FOLLOW_UP_QUESTIONS.default).map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => handleStarterQuestion(question)}
                          className="terminal-interactive rounded border border-border bg-surface2 px-2 py-1 text-left font-mono text-sm text-muted transition-colors hover:border-accent/40 hover:text-text"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {chatError && (
                  <div
                    role="alert"
                    className={`mx-3 mb-2 rounded border px-3 py-2.5 font-mono text-base sm:text-sm ${
                      chatError.kind === "rate-limit"
                        ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    <p
                      className={
                        chatError.kind === "rate-limit"
                          ? "text-amber-300"
                          : "text-red-300"
                      }
                    >
                      {chatError.kind === "rate-limit" ? "warn" : "err"}:{" "}
                      {chatError.title}
                    </p>
                    <p className="mt-1 text-[#c8c8c8]">{chatError.message}</p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="flex shrink-0 items-center gap-2 border-t border-[#2a2a2a] bg-[#111111] px-4 py-3"
                >
                  <span className="cmd-prefix-sm-hidden shrink-0 font-mono text-base text-accent">
                    $
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ask about my experience..."
                    disabled={isLoading}
                    className="min-w-0 flex-1 bg-transparent font-mono text-base text-[#e2e2e2] placeholder-[#444444] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="terminal-interactive inline-flex shrink-0 items-center rounded border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-base text-accent transition-colors duration-200 hover:bg-accent/20 disabled:opacity-40 sm:text-sm"
                  >
                    enter
                  </button>
                </form>

                {useDesktopWindow && (
                  <div
                    onMouseDown={onResizeStart}
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
                  >
                    <svg
                      viewBox="0 0 10 10"
                      className="absolute bottom-1 right-1 h-2.5 w-2.5 text-[#444444]"
                      fill="currentColor"
                    >
                      <path d="M9 1v8H1l8-8z" />
                    </svg>
                  </div>
                )}
              </>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen && !isMinimized ? "Close chat" : "Ask about Pravinos"}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`ask-ai-pulse terminal-interactive fixed bottom-16 right-6 z-[45] hidden items-center gap-2 rounded-full border border-accent/30 bg-surface2 px-5 py-3 font-mono text-sm text-accent transition-colors duration-200 hover:border-accent/60 hover:bg-surface-elevated md:flex ${
          isOpen && !isMinimized ? "opacity-80" : ""
        }`}
      >
        <TerminalPromptIcon />
        <span>Ask about Pravinos</span>
      </motion.button>
    </>
  );
}
