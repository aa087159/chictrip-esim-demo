// Mock product catalog for 去趣 eSIM. Prices in TWD, "from" pricing.
// Every number here is demo data (示意), including line source and throttling terms.

export type PlanType = "unlimited" | "daily" | "fixed";

export interface Plan {
  id: string;
  countryCode: string; // JP / KR / CN / HK / MO
  countryName: string;
  name: string;
  type: PlanType;
  dataGB?: number; // for "fixed" plans
  dailyGB?: number; // for "daily" plans
  // Fixed plans are valid for this many days from first connection; unlimited and
  // daily plans cover exactly the trip days they were bought for.
  validityDays?: number;
  priceTWD: number;
  pointsPct: number; // 和泰 Points 回饋 %
  highlight?: string;
  // Transparency fields shown on the recommendation card (v6: 透明標示，不承諾訊號品質).
  lineSource: string;
  throttle: string;
  dayCountRule: string;
  // Add-on plans are only offered by the mid-trip top-up check, never as the main pick.
  isAddOn?: boolean;
}

const JP_LINE = "當地原生線路（docomo）";
const JP_DAY_RULE = "連上日本當地網路才開始計算天數";

export const CATALOG: Plan[] = [
  // Japan
  { id: "jp-unlimited", countryCode: "JP", countryName: "日本", name: "日本 高速吃到飽", type: "unlimited", priceTWD: 399, pointsPct: 5, highlight: "不限流量，導航追劇都不怕", lineSource: JP_LINE, throttle: "每日超過 3GB 降速至 1Mbps", dayCountRule: JP_DAY_RULE },
  { id: "jp-daily-1gb", countryCode: "JP", countryName: "日本", name: "日本 每日 1GB 高速", type: "daily", dailyGB: 1, priceTWD: 249, pointsPct: 5, lineSource: JP_LINE, throttle: "每日 1GB 用完降速至 128kbps", dayCountRule: JP_DAY_RULE },
  { id: "jp-6gb", countryCode: "JP", countryName: "日本", name: "日本 6GB 定量", type: "fixed", dataGB: 6, validityDays: 8, priceTWD: 199, pointsPct: 5, lineSource: JP_LINE, throttle: "6GB 用完即停", dayCountRule: `${JP_DAY_RULE}，8 天內有效` },
  { id: "jp-10gb", countryCode: "JP", countryName: "日本", name: "日本 10GB 定量", type: "fixed", dataGB: 10, validityDays: 8, priceTWD: 299, pointsPct: 5, lineSource: JP_LINE, throttle: "10GB 用完即停", dayCountRule: `${JP_DAY_RULE}，8 天內有效` },
  // Japan add-ons (Demo 先用「再買一組」；能否原卡續充待供應商確認)
  { id: "jp-unlimited-2d", countryCode: "JP", countryName: "日本", name: "日本 吃到飽 2 天", type: "unlimited", priceTWD: 169, pointsPct: 5, lineSource: JP_LINE, throttle: "每日超過 3GB 降速至 1Mbps", dayCountRule: JP_DAY_RULE, isAddOn: true },
  { id: "jp-3gb-addon", countryCode: "JP", countryName: "日本", name: "日本 3GB 加量", type: "fixed", dataGB: 3, validityDays: 8, priceTWD: 129, pointsPct: 5, lineSource: JP_LINE, throttle: "3GB 用完即停", dayCountRule: `${JP_DAY_RULE}，8 天內有效`, isAddOn: true },

  // Korea
  { id: "kr-unlimited", countryCode: "KR", countryName: "韓國", name: "韓國 高速吃到飽", type: "unlimited", priceTWD: 399, pointsPct: 5, lineSource: "當地原生線路（SK Telecom）", throttle: "每日超過 3GB 降速至 1Mbps", dayCountRule: "連上韓國當地網路才開始計算天數" },
  { id: "kr-6gb", countryCode: "KR", countryName: "韓國", name: "韓國 6GB 定量", type: "fixed", dataGB: 6, validityDays: 8, priceTWD: 199, pointsPct: 5, lineSource: "當地原生線路（SK Telecom）", throttle: "6GB 用完即停", dayCountRule: "連上韓國當地網路才開始計算天數，8 天內有效" },

  // China (免翻牆 is the key selling point)
  { id: "cn-unlimited", countryCode: "CN", countryName: "中國", name: "中國 免翻牆吃到飽", type: "unlimited", priceTWD: 499, pointsPct: 5, highlight: "免翻牆直連 Line / Google / IG", lineSource: "香港漫遊線路", throttle: "每日超過 2GB 降速至 512kbps", dayCountRule: "連上中國當地網路才開始計算天數" },
  { id: "cn-8gb", countryCode: "CN", countryName: "中國", name: "中國 8GB 免翻牆", type: "fixed", dataGB: 8, validityDays: 8, priceTWD: 299, pointsPct: 5, highlight: "免翻牆直連 Line / Google", lineSource: "香港漫遊線路", throttle: "8GB 用完即停", dayCountRule: "連上中國當地網路才開始計算天數，8 天內有效" },

  // Hong Kong / Macau
  { id: "hkmo-5gb", countryCode: "HK", countryName: "港澳", name: "港澳 5GB 定量", type: "fixed", dataGB: 5, validityDays: 8, priceTWD: 199, pointsPct: 5, lineSource: "當地原生線路（CSL）", throttle: "5GB 用完即停", dayCountRule: "連上當地網路才開始計算天數，8 天內有效" },
  { id: "hkmo-unlimited", countryCode: "HK", countryName: "港澳", name: "港澳 高速吃到飽", type: "unlimited", priceTWD: 349, pointsPct: 5, lineSource: "當地原生線路（CSL）", throttle: "每日超過 3GB 降速至 1Mbps", dayCountRule: "連上當地網路才開始計算天數" },
];

export const planById = (id: string): Plan | null =>
  CATALOG.find((p) => p.id === id) ?? null;

// Main plans a trip can be bought with (add-ons excluded).
export const plansByCountry = (countryCode: string): Plan[] =>
  CATALOG.filter((p) => p.countryCode === countryCode && !p.isAddOn);

export const addOnsByCountry = (countryCode: string): Plan[] =>
  CATALOG.filter((p) => p.countryCode === countryCode && p.isAddOn);
