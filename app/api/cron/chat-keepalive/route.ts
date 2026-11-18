import { POST as chat } from "@/app/api/chat/route";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 86_400_000;
const FIRST_RUN_DAY = Math.floor(Date.UTC(2026, 10, 18) / DAY_MS);

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Daily cron syntax cannot express a continuous ten-day interval across months.
  const elapsedDays = Math.floor(Date.now() / DAY_MS) - FIRST_RUN_DAY;
  if (elapsedDays < 0 || elapsedDays % 10 !== 0) {
    return Response.json({ ok: true, skipped: true });
  }

  try {
    // Reuse the real chat handler so both Redis and the AI response are exercised.
    const response = await chat(
      new NextRequest(new URL("/api/chat", req.url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "cron-chat-keepalive",
        },
        body: JSON.stringify({
          messages: [
            { id: "keepalive", role: "user", parts: [{ type: "text", text: "hi" }] },
          ],
        }),
      }),
    );

    // Consume the stream before returning; provider errors can arrive after HTTP 200.
    const body = await response.text();
    const streamFailed = body.split("\n").some((line) => {
      if (!line.startsWith("data: ") || line === "data: [DONE]") return false;
      try {
        return JSON.parse(line.slice(6)).type === "error";
      } catch {
        return false;
      }
    });

    if (!response.ok || streamFailed) {
      console.error("Chat keepalive failed", { status: response.status, streamFailed });
      return Response.json({ error: "Chat keepalive failed" }, { status: 502 });
    }

    return Response.json({ ok: true, skipped: false });
  } catch (error) {
    console.error("Chat keepalive failed", error);
    return Response.json({ error: "Chat keepalive failed" }, { status: 502 });
  }
}
