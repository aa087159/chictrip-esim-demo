import { TODAY_USAGE, formatGB } from "./usage";

// Demo 時間切換器：同一個行程在「截住 → 留住 → 回來」不同時間點，首頁狀態卡與通知中心顯示的內容。
export type DemoPhase = "planned" | "beforeDeparture" | "traveling" | "returned";

export const DEMO_PHASES: { id: DemoPhase; label: string }[] = [
  { id: "planned", label: "排完行程" },
  { id: "beforeDeparture", label: "出發前 3 天" },
  { id: "traveling", label: "旅中" },
  { id: "returned", label: "回國後" },
];

// 點了之後要去哪：方案頁、旅中 Plan B 畫面，或只顯示提示。
export type DemoAction = "network" | "companion" | "coupon";

export interface StatusCardContent {
  icon: string;
  title: string;
  sub: string;
  button: string;
  action: DemoAction;
}

export const STATUS_CARD: Record<DemoPhase, StatusCardContent> = {
  planned: {
    icon: "📶",
    title: "這趟網路已加入準備清單",
    sub: "AI 依每日行程估好流量了",
    button: "看方案",
    action: "network",
  },
  beforeDeparture: {
    icon: "⏰",
    title: "還沒準備網路",
    sub: "再 3 天出發，現在買裝好最安心",
    button: "一鍵買",
    action: "network",
  },
  traveling: {
    icon: "📊",
    title: `今天預估用 ${formatGB(TODAY_USAGE.estimatedGB)}，剩 ${formatGB(TODAY_USAGE.remainingGB)}`,
    sub: "依今天行程估算，可能不夠用",
    button: "加購",
    action: "network",
  },
  returned: {
    icon: "🎟️",
    title: "下一趟可用回購券",
    sub: "去趣 eSIM 85 折，90 天內有效",
    button: "領取",
    action: "coupon",
  },
};

export interface DemoNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  action: DemoAction;
}

export const NOTIFICATIONS: Record<DemoPhase, DemoNotification[]> = {
  planned: [
    {
      id: "plan-ready",
      icon: "📶",
      title: "AI 算好這趟的網路了",
      body: "東京 5 天・3 人，點開看推薦方案",
      time: "剛剛",
      action: "network",
    },
  ],
  beforeDeparture: [
    {
      id: "d3",
      icon: "⏰",
      title: "D-3 購卡提醒",
      body: "還沒準備網路，出發前裝好 eSIM，落地就能用",
      time: "09:00",
      action: "network",
    },
    {
      id: "group-bought",
      icon: "🎁",
      title: "主揪已幫你買好 eSIM",
      body: "同行旅伴點一下就能安裝，不用自己比價",
      time: "昨天",
      action: "network",
    },
  ],
  traveling: [
    {
      id: "rain",
      icon: "☔",
      title: "明天東京大雨，幫你換室內行程",
      body: "D2 台場海濱公園 → 3 個室內備案",
      time: "20:15",
      action: "companion",
    },
    {
      id: "low-data",
      icon: "⚠️",
      title: "流量快用完",
      body: `今天預估用 ${formatGB(TODAY_USAGE.estimatedGB)}，剩 ${formatGB(TODAY_USAGE.remainingGB)}，建議加購`,
      time: "18:40",
      action: "network",
    },
    {
      id: "group-bought",
      icon: "🎁",
      title: "主揪已幫你買好 eSIM",
      body: "小美、阿哲都已開通",
      time: "3 天前",
      action: "network",
    },
  ],
  returned: [
    {
      id: "coupon",
      icon: "🎟️",
      title: "下一趟可用回購券",
      body: "去趣 eSIM 85 折，90 天內有效",
      time: "剛剛",
      action: "coupon",
    },
  ],
};
