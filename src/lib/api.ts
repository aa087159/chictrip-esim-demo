// Frontend-facing types + fetch helpers. Types mirror api/_lib on the server.

export interface Itinerary {
  destination: string;
  countryCode: string;
  days: number;
  travelers: number;
  habits: string[];
  notes?: string;
}

export interface Plan {
  id: string;
  countryCode: string;
  countryName: string;
  name: string;
  type: "unlimited" | "daily" | "fixed";
  dataGB?: number;
  dailyGB?: number;
  priceTWD: number;
  pointsPct: number;
  highlight?: string;
}

export interface Recommendation {
  recommendedPlanId: string;
  estimatedDataGB: number;
  reasoning: string;
  breakdown: { activity: string; gb: number }[];
  upsellHint?: string;
  plan: Plan | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `${url} 失敗`);
  return data as T;
}

export const postRecommend = (itinerary: Itinerary) =>
  postJSON<Recommendation>("/api/recommend", itinerary);

export const postChat = (messages: ChatMessage[]) =>
  postJSON<{ reply: string }>("/api/chat", { messages });
