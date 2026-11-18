import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/api/cron/chat-keepalive/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function setup({ day = "2026-11-28", secret = "test-secret", response, throws = false } = {}) {
  const calls = [];
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      if (name === "next/server") return { NextRequest: Request };
      if (name === "@/app/api/chat/route") return {
        POST: async (req) => {
          calls.push(req);
          if (throws) throw new Error("Provider unavailable");
          return response ?? new Response('data: {"type":"finish"}\n\ndata: [DONE]\n\n');
        },
      };
      throw new Error(`Unexpected import: ${name}`);
    },
    process: { env: { CRON_SECRET: secret } },
    Date: class extends Date { static now() { return Date.parse(`${day}T08:00:00Z`); } },
    Response, URL,
    console: { error() {} },
  });
  return {
    calls,
    run: (authorization = "Bearer test-secret") => exports.GET(new Request(
      "https://portfolio.example/api/cron/chat-keepalive",
      { headers: authorization ? { authorization } : {} },
    )),
  };
}

test("rejects missing, incorrect, and unconfigured secrets before invoking chat", async () => {
  for (const authorization of [null, "Bearer wrong"]) {
    const job = setup();
    assert.equal((await job.run(authorization)).status, 401);
    assert.equal(job.calls.length, 0);
  }
  const job = setup({ secret: "" });
  assert.equal((await job.run("Bearer ")).status, 401);
  assert.equal(job.calls.length, 0);
});

test("runs every ten days across month and year boundaries with a hi payload", async () => {
  for (const day of ["2026-11-18", "2026-11-28", "2026-12-08", "2026-12-28", "2027-01-07"]) {
    const job = setup({ day });
    assert.deepEqual(await (await job.run()).json(), { ok: true, skipped: false });
    assert.equal(job.calls.length, 1);
    const req = job.calls[0];
    assert.equal(req.method, "POST");
    assert.equal(new URL(req.url).pathname, "/api/chat");
    assert.equal(req.headers.get("x-real-ip"), "cron-chat-keepalive");
    assert.equal((await req.json()).messages[0].parts[0].text, "hi");
  }
});

test("skips intervening days without invoking Redis or Groq", async () => {
  for (const day of ["2026-11-17", "2026-11-19", "2026-11-27", "2026-12-01", "2027-01-01"]) {
    const job = setup({ day });
    assert.deepEqual(await (await job.run()).json(), { ok: true, skipped: true });
    assert.equal(job.calls.length, 0);
  }
});

test("reports chat HTTP failures, streamed errors, and thrown exceptions", async () => {
  for (const options of [
    { response: Response.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 }) },
    { response: new Response('data: {"type":"error","errorText":"Provider unavailable"}\n\n') },
    { throws: true },
  ]) {
    const job = setup(options);
    assert.equal((await job.run()).status, 502);
  }
});

test("Vercel schedules the protected route once a day", () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(config.crons, [{ path: "/api/cron/chat-keepalive", schedule: "0 8 * * *" }]);
});
