// Frontend-facing types + fetch helpers. Types come straight from api/_lib
// (type-only imports, erased at build) so the two sides cannot drift apart.
import type { Plan } from "../../api/_lib/catalog";
import type { DayPlan, Member, TripInput } from "../../api/_lib/estimate";
import type { Recommendation } from "../../api/_lib/recommend";

export type { Plan, DayPlan, Member, Recommendation };

export interface Itinerary extends TripInput {
  // Presentation-only fields for the itinerary view.
  dateRange: string;
  travelers: number;
  companions: string[]; // 同行者名字，不含「你」本人
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

export const postRecommend = ({ destination, countryCode, days, dayPlan, members }: Itinerary) =>
  postJSON<Recommendation>("/api/recommend", { destination, countryCode, days, dayPlan, members });

export const postChat = (messages: ChatMessage[]) =>
  postJSON<{ reply: string }>("/api/chat", { messages });
