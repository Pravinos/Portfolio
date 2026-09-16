import { CHAT_MODEL, groq, MAX_TOKENS } from "@/lib/groq";
import { formatProviderRateLimitError, isRateLimitError } from "@/lib/chat-errors";
import { systemPrompt } from "@/lib/cv-context";
import { checkChatRateLimit } from "@/lib/rate-limit";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 10_000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

function parseMessages(value: unknown): UIMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  let totalChars = 0;
  const messages: UIMessage[] = [];

  for (const message of value) {
    if (!message || typeof message !== "object") return null;
    const candidate = message as Record<string, unknown>;
    if (candidate.role !== "user" && candidate.role !== "assistant") return null;
    if (!Array.isArray(candidate.parts) || candidate.parts.length === 0) return null;

    const parts: Array<{ type: "text"; text: string }> = [];
    for (const part of candidate.parts) {
      if (!part || typeof part !== "object") return null;
      const textPart = part as Record<string, unknown>;
      if (textPart.type !== "text" || typeof textPart.text !== "string") return null;
      const text = textPart.text.trim();
      if (!text || text.length > MAX_MESSAGE_CHARS) return null;
      totalChars += text.length;
      if (totalChars > MAX_TOTAL_CHARS) return null;
      parts.push({ type: "text", text });
    }

    messages.push({
      id: typeof candidate.id === "string" ? candidate.id.slice(0, 128) : crypto.randomUUID(),
      role: candidate.role,
      parts,
    });
  }

  return messages;
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request too large" }, { status: 413 });
    }

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const messages = parseMessages(
      body && typeof body === "object" ? (body as Record<string, unknown>).messages : null,
    );
    if (!messages || messages.at(-1)?.role !== "user") {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const rateLimit = await checkChatRateLimit(getClientIp(req));
    if ("unavailable" in rateLimit && rateLimit.unavailable) {
      return Response.json(
        { error: "Service temporarily unavailable" },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }

    if (!rateLimit.success) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
      return Response.json(
        {
          error: "RATE_LIMIT",
          message:
            "Too many messages in a short time. Wait about a minute, then try again.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const result = streamText({
      model: groq(CHAT_MODEL),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: MAX_TOKENS,
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        if (isRateLimitError(error)) {
          return formatProviderRateLimitError(error);
        }

        return "Something went wrong while reaching the assistant. Please try again.";
      },
    });
  } catch (error) {
    if (isRateLimitError(error)) {
      return Response.json(
        {
          error: "RATE_LIMIT",
          message: formatProviderRateLimitError(error).replace(/^RATE_LIMIT\|/, ""),
        },
        { status: 429 },
      );
    }

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
