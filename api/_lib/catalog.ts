// Mock product catalog for 去趣 eSIM. Prices in TWD, "from" pricing.
// Real numbers can be swapped in later — the demo only needs plausible data.

export type PlanType = "unlimited" | "daily" | "fixed";

export interface Plan {
  id: string;
  countryCode: string; // JP / KR / CN / HK / MO
  countryName: string;
  name: string;
  type: PlanType;
  dataGB?: number; // for "fixed" plans
  dailyGB?: number; // for "daily" plans
  priceTWD: number;
  pointsPct: number; // 和泰 Points 回饋 %
  highlight?: string;
}

export const CATALOG: Plan[] = [
  // Japan
  { id: "jp-unlimited", countryCode: "JP", countryName: "日本", name: "日本 高速吃到飽", type: "unlimited", priceTWD: 399, pointsPct: 5, highlight: "不限流量，追劇導航都不怕" },
  { id: "jp-daily-1gb", countryCode: "JP", countryName: "日本", name: "日本 每日 1GB 高速", type: "daily", dailyGB: 1, priceTWD: 249, pointsPct: 5 },
  { id: "jp-6gb", countryCode: "JP", countryName: "日本", name: "日本 6GB 定量", type: "fixed", dataGB: 6, priceTWD: 199, pointsPct: 5 },
  { id: "jp-10gb", countryCode: "JP", countryName: "日本", name: "日本 10GB 定量", type: "fixed", dataGB: 10, priceTWD: 299, pointsPct: 5 },

  // Korea
  { id: "kr-unlimited", countryCode: "KR", countryName: "韓國", name: "韓國 高速吃到飽", type: "unlimited", priceTWD: 399, pointsPct: 5 },
  { id: "kr-6gb", countryCode: "KR", countryName: "韓國", name: "韓國 6GB 定量", type: "fixed", dataGB: 6, priceTWD: 199, pointsPct: 5 },

  // China (免翻牆 is the key selling point)
  { id: "cn-unlimited", countryCode: "CN", countryName: "中國", name: "中國 免翻牆吃到飽", type: "unlimited", priceTWD: 499, pointsPct: 5, highlight: "免翻牆直連 Line / Google / IG" },
  { id: "cn-8gb", countryCode: "CN", countryName: "中國", name: "中國 8GB 免翻牆", type: "fixed", dataGB: 8, priceTWD: 299, pointsPct: 5, highlight: "免翻牆直連 Line / Google" },

  // Hong Kong / Macau
  { id: "hkmo-5gb", countryCode: "HK", countryName: "港澳", name: "港澳 5GB 定量", type: "fixed", dataGB: 5, priceTWD: 199, pointsPct: 5 },
  { id: "hkmo-unlimited", countryCode: "HK", countryName: "港澳", name: "港澳 高速吃到飽", type: "unlimited", priceTWD: 349, pointsPct: 5 },
];

export const planById = (id: string): Plan | null =>
  CATALOG.find((p) => p.id === id) ?? null;

export const plansByCountry = (countryCode: string): Plan[] =>
  CATALOG.filter((p) => p.countryCode === countryCode);
