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
    id: "tokyo-ig",
    emoji: "📸",
    title: "東京 5 天・愛拍照發 IG",
    subtitle: "美食、購物、狂拍限動",
    itinerary: {
      destination: "東京",
      countryCode: "JP",
      days: 5,
      travelers: 1,
      habits: ["大量拍照打卡發 IG 限動", "Google Maps 導航", "查餐廳評論"],
      notes: "第一次用 eSIM，會擔心落地沒網",
    },
  },
  {
    id: "shanghai-biz",
    emoji: "💼",
    title: "上海出差 4 天・要用 Line/Google",
    subtitle: "商務行程，仰賴通訊軟體",
    itinerary: {
      destination: "上海",
      countryCode: "CN",
      days: 4,
      travelers: 1,
      habits: ["Line 與同事聯絡", "Google 搜尋與 Gmail", "地圖導航"],
      notes: "擔心在中國無法使用 Line / Google",
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
      habits: ["拍照分享", "導航找店", "偶爾看影片"],
    },
  },
];
