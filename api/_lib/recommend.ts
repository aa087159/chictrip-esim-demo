import * as z from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClient, hasApiKey, MODEL } from "./anthropic.js";
import { planById, plansByCountry, addOnsByCountry, type Plan } from "./catalog.js";
import {
  dayBreakdown,
  pickForMembers,
  tripSummary,
  type DayEstimate,
  type MemberPick,
  type TripInput,
} from "./estimate.js";

const RecommendationSchema = z.object({
  summary: z
    .string()
    .describe("給全團看的推薦總結，繁體中文 2 句，必須點名行程裡的具體天數與景點（例如 D3 自駕河口湖）"),
  members: z
    .array(
      z.object({
        memberId: z.string().describe("必須是輸入 members 裡的 id"),
        planId: z.string().describe("必須是產品目錄裡的 plan id"),
        estimatedDataGB: z.number().describe("這個人整趟預估流量 (GB)"),
        reason: z.string().describe("一句話給這個人看的理由，要提到他的使用習慣和行程裡的具體天數"),
      }),
    )
    .describe("每位旅伴各自的推薦方案"),
});

export interface Recommendation {
  summary: string;
  breakdown: DayEstimate[];
  members: MemberPick[];
  // 該國可買的主方案（給「換別的方案」用）與加購方案（給旅中加買判讀用）。
  plans: Plan[];
  addOns: Plan[];
}

function finalize(trip: TripInput, summary: string, members: MemberPick[]): Recommendation {
  const plans = plansByCountry(trip.countryCode);
  const fallback = pickForMembers(trip, plans);
  // Keep the model's pick only when it names a real member and a real main plan.
  const checked = trip.members.map((m, i) => {
    const pick = members.find((p) => p.memberId === m.id);
    const plan = pick ? planById(pick.planId) : null;
    return pick && plan && !plan.isAddOn ? pick : fallback[i];
  });
  return {
    summary,
    breakdown: dayBreakdown(trip.dayPlan),
    members: checked,
    plans,
    addOns: addOnsByCountry(trip.countryCode),
  };
}

function systemPrompt(countryCode: string): string {
  return [
    "你是「去趣 eSIM」的 AI 上網管家，服務台灣出國旅客。",
    "根據行程每一天的內容（自駕、樂園、溫泉旅館等）與每位旅伴的使用習慣，估算每個人整趟需要的行動數據，並從產品目錄挑出各自最適合的方案。",
    "規則：",
    "- planId 必須是目錄中的 id，不可自創，不可選 isAddOn 為 true 的方案。",
    "- 自駕日導航整天開著、樂園要用官方 App，用量高；溫泉旅館有 Wi-Fi，用量低。",
    "- 開車的人導航用量最高；只用 LINE 的人用量低，不要推太貴的方案。",
    "- 理由一定要點名行程裡的具體天數與景點，讓人看得出你讀了這份行程，而不是只看天數。",
    "- 用親切、精準的繁體中文，直接對使用者說話。",
    `產品目錄（JSON）：${JSON.stringify(plansByCountry(countryCode))}`,
  ].join("\n");
}

export async function recommend(trip: TripInput): Promise<Recommendation> {
  if (!hasApiKey()) return mockRecommend(trip);

  const res = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt(trip.countryCode),
    messages: [{ role: "user", content: `我們的行程：${JSON.stringify(trip)}` }],
    output_config: { format: zodOutputFormat(RecommendationSchema) },
  });

  const out = res.parsed_output;
  if (!out) throw new Error("推薦結果解析失敗");
  return finalize(trip, out.summary, out.members);
}

// ---- Mock fallback (used when ANTHROPIC_API_KEY is absent) ----

function mockRecommend(trip: TripInput): Recommendation {
  const plans = plansByCountry(trip.countryCode);
  return finalize(trip, tripSummary(trip), pickForMembers(trip, plans));
}
