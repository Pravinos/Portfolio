"use client";

import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { trackEvent } from "@/lib/analytics";
import ChatMarkdown from "@/components/ChatMarkdown";
import { useDraggableWindow } from "@/hooks/useDraggable";
import { PORTFOLIO_EVENTS } from "@/lib/portfolio-events";

const STARTER_QUESTIONS = [
  "What's your tech stack?",
  "Tell me about your projects",
  "What anime do you like?",
  "Who's your favourite footballer?",
  "Any hobbies outside work?",
];

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === "submitted" || status === "streaming";
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
              data-chat-window
              initial={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, scale: 0.96 }
              }
              animate={
                isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }
              }
              exit={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, scale: 0.96 }
              }
              transition={{ duration: 0.22, ease: "easeOut" }}
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
              className={`fixed z-[90] flex flex-col overflow-hidden bg-[#0d0d0d] shadow-[0_16px_48px_rgba(0,0,0,0.6)] ${
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
                    <p className="text-[#555555]">
                      <span className="text-accent">#</span> Ask about my work,
                      stack, and projects — or get personal: anime, football,
                      series, games, and more.
                    </p>
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
                  <div className="flex flex-wrap gap-2 border-t border-[#2a2a2a] px-4 py-3">
                    {STARTER_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleStarterQuestion(question)}
                        className="terminal-interactive inline-flex items-center rounded border border-border bg-surface2 px-2 py-1 font-mono text-base text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent sm:text-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="mx-3 mb-2 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-base text-red-400 sm:text-sm">
                    err: request failed - try again
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
        aria-label={isOpen && !isMinimized ? "Close chat" : "Ask AI"}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`ask-ai-pulse terminal-interactive fixed bottom-24 right-6 z-[45] hidden items-center gap-2 rounded-full border border-accent/30 bg-surface2 px-5 py-3.5 font-mono text-base text-accent transition-colors duration-200 hover:border-accent/60 hover:bg-surface-elevated md:flex ${
          isOpen && !isMinimized ? "opacity-80" : ""
        }`}
      >
        <TerminalPromptIcon />
        <span>Ask AI</span>
      </motion.button>
    </>
  );
}
