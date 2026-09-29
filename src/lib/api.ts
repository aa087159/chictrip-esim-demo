// Frontend-facing types + fetch helpers. Types mirror api/_lib on the server.

export interface DayPlan {
  day: string; // e.g. "D1" / "D3–5"
  spots: string; // e.g. "淺草寺 → 晴空塔 → 上野"
}

export interface Itinerary {
  destination: string;
  countryCode: string;
  days: number;
  travelers: number;
  habits: string[];
  notes?: string;
  // Presentation-only fields for the itinerary view. The recommend API ignores
  // any it doesn't use, so they ride along harmlessly.
  dateRange?: string; // e.g. "9/26–9/30"
  companions?: string[]; // 同行者名字，不含「你」本人
  dayPlan?: DayPlan[];
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
  // 該國所有適用方案，依推薦度排序（最推薦在最前）。
  plans: Plan[];
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
