import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-accent">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[#888888]">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="terminal-interactive inline-flex items-center text-accent underline underline-offset-2 transition-colors duration-200 hover:text-accent-bright"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded border border-border bg-bg px-2 py-1.5 text-base text-accent">
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-bg px-1 py-0.5 text-base text-accent">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto last:mb-0">{children}</pre>
  ),
  h1: ({ children }) => (
    <h1 className="mb-2 text-xl font-bold text-[#e2e2e2]">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 text-lg font-bold text-[#e2e2e2]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 text-base font-semibold text-[#e2e2e2]">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-accent/40 pl-3 text-[#888888] last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-2 border-[#2a2a2a]" />,
};

type ChatMarkdownProps = {
  content: string;
};

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="chat-markdown text-lg leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
