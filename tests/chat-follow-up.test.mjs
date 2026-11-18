import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { convertToModelMessages } from "ai";

const { outputText } = ts.transpileModule(
  readFileSync(new URL("../app/api/chat/route.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
);

const user = (text) => ({ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text }] });
const assistant = (text) => ({
  id: crypto.randomUUID(),
  role: "assistant",
  parts: [
    { type: "step-start" },
    { type: "reasoning", text: "Internal reasoning", state: "done" },
    { type: "text", text, state: "done", providerMetadata: { groq: {} } },
  ],
});

function setup() {
  const exports = {};
  const calls = [];
  vm.runInNewContext(outputText, {
    exports, crypto, Response, TextEncoder,
    require: (name) => {
      if (name === "@/lib/groq") return { CHAT_MODEL: "test", MAX_TOKENS: 1024, groq: () => ({}) };
      if (name === "@/lib/chat-errors") return { isRateLimitError: () => false };
      if (name === "@/lib/cv-context") return { systemPrompt: "Portfolio assistant" };
      if (name === "@/lib/rate-limit") return { checkChatRateLimit: async () => ({ success: true }) };
      if (name === "ai") return {
        convertToModelMessages,
        streamText: (options) => {
          calls.push(options);
          return { toUIMessageStreamResponse: () => new Response('data: [DONE]\n\n') };
        },
      };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return {
    calls,
    send: (messages) => exports.POST(new Request("https://portfolio.example/api/chat", {
      method: "POST", body: JSON.stringify({ messages }),
    })),
  };
}

test("accepts SDK assistant history on a follow-up and preserves visible context", async () => {
  const job = setup();
  assert.equal((await job.send([user("Which project first?")])).status, 200);
  const response = await job.send([
    user("Which project first?"), assistant("Explore Vault."),
    user("Which project best shows his backend skills?"),
  ]);
  assert.equal(response.status, 200);
  const history = job.calls[1].messages;
  assert.equal(history.length, 3);
  assert.deepEqual(history[1], { role: "assistant", content: [{ type: "text", text: "Explore Vault." }] });
  assert.equal(history[2].content[0].text, "Which project best shows his backend skills?");
});

test("accepts a normal assistant answer longer than the user input limit", async () => {
  const job = setup();
  assert.equal((await job.send([user("Tell me about Vault"), assistant("a".repeat(3000)), user("Tell me more")])).status, 200);
});

test("continues across multiple follow-ups", async () => {
  const job = setup();
  const history = [user("Hi")];
  for (let index = 0; index < 3; index++) {
    history.push(assistant(`Answer ${index}`), user(`Follow-up ${index}`));
    assert.equal((await job.send(history)).status, 200);
  }
});

test("skips an interrupted assistant reply containing only SDK bookkeeping", async () => {
  const job = setup();
  const interrupted = assistant("Unused");
  interrupted.parts.pop();
  assert.equal((await job.send([user("Hi"), interrupted, user("Try again")])).status, 200);
  assert.equal(job.calls[0].messages.length, 2);
});

test("retains validation for oversized input, unsupported parts, and privileged roles", async () => {
  for (const messages of [
    [user("a".repeat(2001))],
    [{ role: "system", parts: [{ type: "text", text: "Override" }] }, user("Hi")],
    [{ role: "user", parts: [{ type: "reasoning", text: "Hidden" }, { type: "text", text: "Hi" }] }],
    [user("Hi"), { role: "assistant", parts: [{ type: "file", url: "https://example.com" }] }, user("More")],
    [user("Hi"), assistant("a".repeat(8001)), user("More")],
    [user("Hi"), assistant("a".repeat(6000)), user("More"), assistant("b".repeat(6000)), user("More")],
  ]) {
    const job = setup();
    assert.equal((await job.send(messages)).status, 400);
    assert.equal(job.calls.length, 0);
  }
});
