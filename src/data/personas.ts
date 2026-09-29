import type { Itinerary } from "../lib/api";

export interface Persona {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  itinerary: Itinerary;
}

export const PERSONAS: Persona[] = [
  {
    id: "tokyo-group",
    emoji: "🗼",
    title: "東京 5 天・3 人同行",
    subtitle: "和朋友揪團，狂拍狂逛",
    itinerary: {
      destination: "東京",
      countryCode: "JP",
      days: 5,
      travelers: 3,
      companions: ["小美", "阿哲"],
      dateRange: "9/26–9/30",
      habits: ["大量拍照打卡發 IG 限動", "Google Maps 導航", "查餐廳評論"],
      dayPlan: [
        { day: "D1", spots: "淺草寺 → 晴空塔 → 上野" },
        { day: "D2", spots: "築地 → 銀座 → 台場" },
        { day: "D3–5", spots: "鎌倉・新宿・自由行…" },
      ],
      notes: "第一次用 eSIM，擔心落地沒網",
    },
  },
  {
    id: "tokyo-solo",
    emoji: "📸",
    title: "東京 5 天・一人旅",
    subtitle: "美食、購物、狂拍限動",
    itinerary: {
      destination: "東京",
      countryCode: "JP",
      days: 5,
      travelers: 1,
      dateRange: "10/03–10/07",
      habits: ["大量拍照打卡發 IG 限動", "Google Maps 導航", "查餐廳評論"],
      dayPlan: [
        { day: "D1", spots: "澀谷 → 表參道 → 原宿" },
        { day: "D2", spots: "豐洲 → 台場 → teamLab" },
        { day: "D3–5", spots: "吉祥寺・下北澤・自由行…" },
      ],
      notes: "第一次用 eSIM，會擔心落地沒網",
    },
  },
  {
    id: "seoul-couple",
    emoji: "❤️",
    title: "首爾 3 天・情侶輕旅行",
    subtitle: "咖啡廳、逛街、拍拍照",
    itinerary: {
      destination: "首爾",
      countryCode: "KR",
      days: 3,
      travelers: 2,
      companions: ["小安"],
      dateRange: "11/14–11/16",
      habits: ["拍照分享", "導航找店", "偶爾看影片"],
      dayPlan: [
        { day: "D1", spots: "弘大 → 合井 → 汝矣島" },
        { day: "D2", spots: "聖水洞 → 首爾林 → 江南" },
        { day: "D3", spots: "北村 → 三清洞 → 明洞" },
      ],
    },
  },
];
