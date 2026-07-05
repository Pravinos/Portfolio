import { CHAT_MODEL, groq, MAX_TOKENS } from "@/lib/groq";
import { formatProviderRateLimitError, isRateLimitError } from "@/lib/chat-errors";
import { systemPrompt } from "@/lib/cv-context";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return Response.json(
        {
          error: "RATE_LIMIT",
          message:
            "Too many messages in a short time. Wait about a minute, then try again.",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { messages } = body as { messages?: UIMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return Response.json({ error: "Invalid request" }, { status: 400 });
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
