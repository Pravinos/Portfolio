"use client";

import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";

const STARTER_QUESTIONS = [
  "What's your tech stack?",
  "Tell me about your experience",
  "What projects have you built?",
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function ChatBubbleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 5.5C4 4.12 5.12 3 6.5 3h11C18.88 3 20 4.12 20 5.5v7c0 1.38-1.12 2.5-2.5 2.5H9l-4.5 3v-3H6.5C5.12 15 4 13.88 4 12.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff9d]" />
                <span className="text-sm text-[#e2e2e2]">Ask me anything</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-xl leading-none text-[#888888] transition-colors hover:text-[#e2e2e2]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((message) => {
                const text = getMessageText(message);
                if (!text) return null;

                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isUser
                        ? "ml-8 border-[#00ff9d]/20 bg-[#00ff9d]/10 text-[#e2e2e2]"
                        : "mr-8 border-[#2a2a2a] bg-[#1a1a1a] text-[#e2e2e2]"
                    }`}
                  >
                    {text}
                  </div>
                );
              })}

              {isLoading && (
                <div className="mr-8 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-[#888888]">
                  <span className="animate-pulse">...</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {STARTER_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleStarterQuestion(question)}
                    className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#888888] transition hover:border-[#00ff9d] hover:text-[#00ff9d]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="mx-3 mb-2 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                Something went wrong. Try again.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-[#2a2a2a] px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about my experience..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#e2e2e2] placeholder-[#555555] focus:border-[#00ff9d] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-[#00ff9d] px-3 py-2 text-sm font-bold text-[#0a0a0a] disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#00ff9d] text-[#0a0a0a] shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-shadow hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]"
      >
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
      </motion.button>
    </>
  );
}
