import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export const CHAT_MODEL = "openai/gpt-oss-120b";

export const MAX_TOKENS = 1024;
