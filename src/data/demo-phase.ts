// Demo 時間切換器：同一個行程在「截住 → 留住 → 回來」不同時間點，
// 首頁狀態卡與通知中心顯示的內容。買了沒會改變內容（v6 通知節奏：買了就停止促購，改成安裝提醒）。
export type DemoPhase = "planned" | "d7" | "d1" | "traveling" | "returned";

export const DEMO_PHASES: { id: DemoPhase; label: string }[] = [
  { id: "planned", label: "排完行程" },
  { id: "d7", label: "出發前 7 天" },
  { id: "d1", label: "出發前一晚" },
  { id: "traveling", label: "旅中" },
  { id: "returned", label: "回國後" },
];

// 點了之後要去哪。
export type DemoAction = "network" | "team" | "activation" | "topup" | "companion" | "coupon";

export interface StatusCardContent {
  icon: string;
  title: string;
  sub: string;
  button: string;
  action: DemoAction;
}

export interface DemoNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  action: DemoAction;
}

interface PhaseContent {
  status: StatusCardContent;
  notifications: DemoNotification[];
}

const COUPON: DemoNotification = {
  id: "coupon",
  icon: "🎟️",
  title: "下一趟可用回購券",
  body: "去趣 eSIM 85 折，90 天內有效",
  time: "剛剛",
  action: "coupon",
};

const NOT_PURCHASED: Record<DemoPhase, PhaseContent> = {
  planned: {
    status: { icon: "📶", title: "AI 算好這趟 4 人的網路", sub: "依每日行程，每個人各配一張", button: "看方案", action: "network" },
    notifications: [
      { id: "plan-ready", icon: "📶", title: "AI 算好這趟的網路了", body: "行程定案，4 人各自的方案已帶好", time: "剛剛", action: "network" },
    ],
  },
  d7: {
    status: { icon: "⏰", title: "D-7：這趟網路還沒準備", sub: "方案已帶好，點一下去購買", button: "去購買", action: "network" },
    notifications: [
      { id: "d7", icon: "⏰", title: "D-7 網路提醒", body: "再 7 天出發，4 人的方案已帶好；出發前一晚用 Wi-Fi 裝好就行", time: "09:00", action: "network" },
    ],
  },
  d1: {
    status: { icon: "🌙", title: "明天出發，網路還沒買", sub: "今晚用 Wi-Fi 買好、裝好，落地就能用", button: "去購買", action: "network" },
    notifications: [
      { id: "d1", icon: "🌙", title: "出發前一晚提醒", body: "還沒準備網路，今晚買好裝好最安心", time: "20:00", action: "network" },
    ],
  },
  traveling: {
    status: { icon: "📶", title: "落地還沒有網路？", sub: "現在買，幾分鐘就能用", button: "去購買", action: "network" },
    notifications: [],
  },
  returned: {
    status: { icon: "🎟️", title: COUPON.title, sub: COUPON.body, button: "領取", action: "coupon" },
    notifications: [COUPON],
  },
};

const PURCHASED: Record<DemoPhase, PhaseContent> = {
  planned: {
    status: { icon: "🎫", title: "全團網卡已備好", sub: "分享給旅伴，各自掃 QR Code 安裝", button: "看全團", action: "team" },
    notifications: [
      { id: "bought", icon: "🎫", title: "4 張 eSIM 已買好", body: "到「全團網卡」把 QR Code 分享給旅伴", time: "剛剛", action: "team" },
    ],
  },
  d7: {
    status: { icon: "👥", title: "小美、阿哲已安裝，媽媽還沒", sub: "傳圖文教學給媽媽", button: "看全團", action: "team" },
    notifications: [
      { id: "d7-team", icon: "👥", title: "旅伴安裝進度", body: "小美、阿哲已安裝 eSIM，媽媽還沒裝", time: "09:00", action: "team" },
    ],
  },
  d1: {
    status: { icon: "🔧", title: "出發前一晚：做一次開通檢查", sub: "先用 Wi-Fi 裝好，確認落地就能上網", button: "開始檢查", action: "activation" },
    notifications: [
      { id: "d1-check", icon: "🔧", title: "出發前一晚提醒", body: "先用 Wi-Fi 裝好 eSIM，花 1 分鐘做開通檢查", time: "20:00", action: "activation" },
    ],
  },
  traveling: {
    status: { icon: "🗓️", title: "行程延長了 2 天", sub: "AI 幫你看全團的網卡還夠不夠", button: "看建議", action: "topup" },
    notifications: [
      { id: "extended", icon: "🗓️", title: "行程有變動", body: "延長 2 天，AI 幫你判讀要不要加買網卡", time: "21:30", action: "topup" },
      { id: "rain", icon: "☔", title: "明天大雨，幫你想室內行程", body: "AI 依天氣與行程給了 3 個 Plan B", time: "20:15", action: "companion" },
    ],
  },
  returned: NOT_PURCHASED.returned,
};

export function phaseContent(phase: DemoPhase, isPurchased: boolean): PhaseContent {
  return (isPurchased ? PURCHASED : NOT_PURCHASED)[phase];
}
