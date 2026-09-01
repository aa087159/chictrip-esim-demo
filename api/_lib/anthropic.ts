import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Shared Claude client. Constructed lazily so the app still boots (in mock
 * mode) when no ANTHROPIC_API_KEY is set — the constructor otherwise throws.
 */
let client: Anthropic | null = null;

export const hasApiKey = (): boolean => Boolean(process.env.ANTHROPIC_API_KEY);

export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";
