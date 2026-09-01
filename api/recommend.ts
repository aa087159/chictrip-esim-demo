import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recommend } from "./_lib/recommend";

// Vercel serverless function. In local dev, vite.config.ts serves the same
// logic via server.ssrLoadModule — this file is what runs in production.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const result = await recommend(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
