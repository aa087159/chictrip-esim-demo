import * as z from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClient, hasApiKey, MODEL } from "./anthropic.js";
import { CATALOG, planById, plansByCountry, type Plan } from "./catalog.js";

export interface Itinerary {
  destination: string;
  countryCode: string; // JP / KR / CN / HK / MO
  days: number;
  travelers: number;
  habits: string[]; // e.g. ["拍照打卡發 IG", "Google Maps 導航"]
  notes?: string;
}

const RecommendationSchema = z.object({
  recommendedPlanId: z.string().describe("必須是產品目錄裡的 plan id"),
  estimatedDataGB: z.number().describe("整趟預估總流量 (GB)"),
  reasoning: z.string().describe("給使用者看的白話推薦理由，繁體中文，2-3 句"),
  breakdown: z
    .array(z.object({ activity: z.string(), gb: z.number() }))
    .describe("流量來源拆解，例如導航、限動、影音"),
  upsellHint: z.string().optional().describe("可選的加購或升級提示"),
});

export type Recommendation = z.infer<typeof RecommendationSchema> & {
  plan: Plan | null;
};

function systemPrompt(countryCode: string): string {
  const plans = plansByCountry(countryCode);
  const catalog = plans.length > 0 ? plans : CATALOG;
  return [
    "你是「去趣 eSIM」的 AI 上網管家，服務台灣出國旅客。",
    "根據使用者的行程與使用習慣，推估整趟需要的行動數據，並從產品目錄挑出最適合的方案。",
    "規則：",
    "- recommendedPlanId 必須是目錄中的 id，不可自創。",
    "- 重度使用（大量拍照發 IG、影音、長時間導航）或天數多，傾向推薦吃到飽。",
    "- 前往中國時，優先考量『免翻牆』方案，因為旅客需要 Line / Google / IG。",
    "- reasoning 用親切、精準的繁體中文，直接對使用者說話。",
    `產品目錄（JSON）：${JSON.stringify(catalog)}`,
  ].join("\n");
}

export async function recommend(itinerary: Itinerary): Promise<Recommendation> {
  if (!hasApiKey()) return mockRecommend(itinerary);

  const res = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt(itinerary.countryCode),
    messages: [{ role: "user", content: `我的行程：${JSON.stringify(itinerary)}` }],
    output_config: { format: zodOutputFormat(RecommendationSchema) },
  });

  const out = res.parsed_output;
  if (!out) throw new Error("推薦結果解析失敗");
  return { ...out, plan: planById(out.recommendedPlanId) };
}

// ---- Mock fallback (used when ANTHROPIC_API_KEY is absent) ----

function mockRecommend(itinerary: Itinerary): Recommendation {
  const plans = plansByCountry(itinerary.countryCode);
  const habitsText = itinerary.habits.join(" ");
  const heavy = /IG|拍照|限動|影音|追劇|直播/.test(habitsText);

  const perDay = 0.8 + (heavy ? 1.0 : 0.3);
  const estimatedDataGB = Math.max(1, Math.round(itinerary.days * perDay));

  let plan: Plan | null;
  if (itinerary.countryCode === "CN") {
    plan = plans.find((p) => p.id === "cn-unlimited") ?? plans[0] ?? null;
  } else if (heavy || estimatedDataGB >= 6) {
    plan =
      plans.find((p) => p.type === "unlimited") ??
      plans.find((p) => (p.dataGB ?? 0) >= estimatedDataGB) ??
      plans[0] ??
      null;
  } else {
    plan =
      plans.find((p) => (p.dataGB ?? 0) >= estimatedDataGB) ??
      plans.find((p) => p.type === "unlimited") ??
      plans[0] ??
      null;
  }

  // Derive the breakdown from the traveler's actual habits, weighted by how
  // data-hungry each one is, then scaled to the total estimate.
  const weightOf = (habit: string): number => {
    if (/IG|拍照|限動|影音|追劇|直播/.test(habit)) return 3;
    if (/導航|地圖|map/i.test(habit)) return 2;
    return 1;
  };
  const weights = itinerary.habits.map(weightOf);
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
  const breakdown = itinerary.habits.map((habit, i) => ({
    activity: habit,
    gb: Math.round(((estimatedDataGB * weights[i]) / weightSum) * 10) / 10,
  }));

  const reasoning =
    itinerary.countryCode === "CN"
      ? `你去${itinerary.destination}${itinerary.days}天，要用 Line 和 Google，這款免翻牆方案可直連常用 App，落地就能用，不用另外設定 VPN。`
      : `你這趟${itinerary.destination}${itinerary.days}天，${heavy ? "又會大量拍照發 IG、用導航" : "用量中等"}，預估約 ${estimatedDataGB}GB，推薦這個方案最省心。`;

  return {
    recommendedPlanId: plan?.id ?? "",
    estimatedDataGB,
    reasoning,
    breakdown,
    upsellHint: heavy ? "行程偏重度使用，升級吃到飽可完全免流量焦慮。" : undefined,
    plan,
  };
}
