// Itinerary-driven data estimate shared by the recommend API (mock path) and the
// frontend top-up check. Only type imports here, so the browser bundle can import
// this file directly without resolving server-side modules.
//
// The model only reads the itinerary (what each day is) and who is travelling.
// It never reads real data usage — v6 rules out anything that needs carrier data.
import type { Plan } from "./catalog.js";

// What a day mostly consists of; drives how much mobile data it needs.
export type DayTag = "drive" | "themepark" | "city" | "onsen" | "transit";

export interface DayPlan {
  day: string; // e.g. "D1"
  spots: string; // e.g. "淺草寺 → 晴空塔 → 上野"
  tag: DayTag;
  // Short phrase quoted in the AI reason, e.g. "自駕河口湖看富士山".
  note: string;
}

// How a traveller uses data. "driver" behaves like "normal" except on driving days.
export type UsageStyle = "driver" | "heavy" | "normal" | "light";

export interface Member {
  id: string;
  name: string;
  isOrganizer?: boolean;
  style: UsageStyle;
  profile: string; // e.g. "愛拍限動"
  device: string;
}

export interface TripInput {
  destination: string;
  countryCode: string;
  days: number;
  dayPlan: DayPlan[];
  members: Member[];
}

export interface DayEstimate {
  day: string;
  label: string;
  gb: number;
}

export interface MemberPick {
  memberId: string;
  planId: string;
  estimatedDataGB: number;
  reason: string;
}

// Per-person baseline GB for one day of each kind (demo assumptions).
const DAY_GB: Record<DayTag, number> = {
  drive: 1.5, // 導航整天開著
  themepark: 1.2, // 樂園官方 App 預約、看排隊時間、拍影片
  city: 0.8,
  onsen: 0.3, // 旅館有 Wi-Fi
  transit: 0.4,
};

const STYLE_FACTOR: Record<UsageStyle, number> = {
  driver: 1,
  heavy: 1.5,
  normal: 1,
  light: 0.5,
};

// Extra navigation load for whoever drives, on driving days only.
const DRIVER_EXTRA_GB = 1.5;

// Buy a plan with this much headroom over the estimate.
const HEADROOM = 1.2;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function dayBreakdown(dayPlan: DayPlan[]): DayEstimate[] {
  return dayPlan.map((d) => ({ day: d.day, label: d.note, gb: DAY_GB[d.tag] }));
}

export function memberGB(member: Member, dayPlan: DayPlan[]): number {
  const base = dayPlan.reduce((sum, d) => sum + DAY_GB[d.tag], 0);
  const driving = member.style === "driver" ? dayPlan.filter((d) => d.tag === "drive").length : 0;
  return round1(base * STYLE_FACTOR[member.style] + driving * DRIVER_EXTRA_GB);
}

// Total GB a plan provides over `days` trip days. Unlimited = Infinity.
export function capacityGB(plan: Plan, days: number): number {
  if (plan.type === "unlimited") return Infinity;
  if (plan.type === "daily") return (plan.dailyGB ?? 0) * days;
  return plan.dataGB ?? 0;
}

// Whether a plan still covers the trip after it grows to `days` days.
export function coversDays(plan: Plan, days: number, boughtForDays: number): boolean {
  if (plan.type === "fixed") return (plan.validityDays ?? 0) >= days;
  return boughtForDays >= days;
}

// Cheapest plan that fits the estimate with headroom; falls back to unlimited.
export function pickPlan(plans: Plan[], gb: number, days: number): Plan | null {
  const fitting = plans
    .filter((p) => coversDays(p, days, days) && capacityGB(p, days) >= gb * HEADROOM)
    .sort((a, b) => a.priceTWD - b.priceTWD);
  return fitting[0] ?? plans.find((p) => p.type === "unlimited") ?? plans[0] ?? null;
}

function daysWith(dayPlan: DayPlan[], tags: DayTag[]): DayPlan[] {
  return dayPlan.filter((d) => tags.includes(d.tag));
}

// "D3–D4 自駕河口湖、箱根" style phrase for a group of days.
function quoteDays(days: DayPlan[]): string {
  if (days.length === 0) return "";
  const range = days.length === 1 ? days[0].day : `${days[0].day}–${days[days.length - 1].day}`;
  return `${range} ${days.map((d) => d.note).join("、")}`;
}

export function tripSummary(trip: TripInput): string {
  const { dayPlan } = trip;
  const parts: string[] = [];
  const drive = daysWith(dayPlan, ["drive"]);
  const park = daysWith(dayPlan, ["themepark"]);
  const onsen = daysWith(dayPlan, ["onsen"]);
  if (drive.length) parts.push(`${quoteDays(drive)}，導航整天開著`);
  if (park.length) parts.push(`${quoteDays(park)}，要用官方 App 抽預約、看排隊時間`);
  if (onsen.length) parts.push(`${quoteDays(onsen)}，旅館有 Wi-Fi`);
  if (!drive.length && !park.length) parts.push("移動以電車為主，白天多是看景點");
  const heavyDay = drive.length + park.length > 0;
  return `這趟 ${parts.join("；")}。${
    heavyDay ? "用量集中在這幾天，所以每個人要的方案不一樣。" : "整趟用量不高，不需要買到吃到飽。"
  }`;
}

function memberReason(member: Member, trip: TripInput, gb: number, plan: Plan | null): string {
  const planName = plan?.name ?? "方案";
  const drive = daysWith(trip.dayPlan, ["drive"]);
  const highlights = daysWith(trip.dayPlan, ["themepark", "drive"]);
  const onsen = daysWith(trip.dayPlan, ["onsen"]);
  if (member.style === "driver" && drive.length) {
    return `你負責開車，${quoteDays(drive)} 導航整天開著，估 ${gb}GB，選${planName}不用擔心。`;
  }
  if (member.style === "heavy") {
    const where = highlights.length ? `${quoteDays(highlights)} 都是拍照重點` : "每天都會拍照發限動";
    const wifi = onsen.length ? `，但 ${onsen[0].day} 旅館有 Wi-Fi` : "";
    return `${member.name}${member.profile}，${where}${wifi}，估 ${gb}GB → ${planName}。`;
  }
  if (member.style === "driver") {
    return `${member.name}這趟不用開車，估 ${gb}GB，${planName}剛好有餘裕。`;
  }
  if (member.style === "light") {
    return `${member.name}主要用 LINE 聯絡、偶爾看地圖，估 ${gb}GB，${planName}就夠，不用多花錢。`;
  }
  return `${member.name}一般使用，估 ${gb}GB，${planName}剛好有餘裕。`;
}

export function pickForMembers(trip: TripInput, plans: Plan[]): MemberPick[] {
  return trip.members.map((m) => {
    const gb = memberGB(m, trip.dayPlan);
    const plan = pickPlan(plans, gb, trip.days);
    return {
      memberId: m.id,
      planId: plan?.id ?? "",
      estimatedDataGB: gb,
      reason: memberReason(m, trip, gb, plan),
    };
  });
}

// ---- Mid-trip top-up check (step 6): the itinerary grew, do the bought cards still fit? ----

export interface TopUpVerdict {
  memberId: string;
  needsAddOn: boolean;
  addOnId?: string;
  newEstimateGB: number;
  reason: string;
}

export function checkTopUp(
  trip: TripInput,
  addedDays: DayPlan[],
  bought: Record<string, Plan>,
  addOns: Plan[],
): TopUpVerdict[] {
  const newDays = trip.days + addedDays.length;
  const fullPlan = [...trip.dayPlan, ...addedDays];
  const unlimitedAddOn = addOns.find((p) => p.type === "unlimited");
  const dataAddOn = addOns.find((p) => p.type === "fixed");
  const added = quoteDays(addedDays);

  return trip.members.map((m) => {
    const plan = bought[m.id];
    const gb = memberGB(m, fullPlan);
    const verdict = { memberId: m.id, newEstimateGB: gb };
    if (!plan) return { ...verdict, needsAddOn: false, reason: `${m.name}沒有在這次訂單裡。` };

    if (!coversDays(plan, newDays, trip.days)) {
      return {
        ...verdict,
        needsAddOn: true,
        addOnId: unlimitedAddOn?.id,
        reason: `${plan.name}只涵蓋原本的 ${trip.days} 天，新增的 ${added} 沒有網路 → 加買${unlimitedAddOn?.name ?? "加購方案"}。`,
      };
    }
    const cap = capacityGB(plan, trip.days);
    if (cap < gb) {
      return {
        ...verdict,
        needsAddOn: true,
        addOnId: dataAddOn?.id,
        reason: `${plan.name}還在有效期內，但加上 ${added}，估要 ${gb}GB，會不夠 → 加買${dataAddOn?.name ?? "加量方案"}。`,
      };
    }
    return {
      ...verdict,
      needsAddOn: false,
      reason: `${plan.name}還在有效期內，加上 ${added}，估 ${gb}GB，還夠用，不用加買。`,
    };
  });
}
