// Demo 時間切換器：同一個行程在「截住 → 留住 → 回來」不同時間點，
// 首頁狀態卡與通知中心顯示的內容。買了沒會改變內容（v6 通知節奏：買了就停止促購，改成安裝提醒）。
// 提醒排程對應簡報第 16 頁：行程定案 → D-14 → D-7 → D-3 → D-1。
export type DemoPhase = "planned" | "d14" | "d7" | "d3" | "d1" | "traveling" | "returned";

export const DEMO_PHASES: { id: DemoPhase; label: string }[] = [
  { id: "planned", label: "排完行程" },
  { id: "d14", label: "出發前 14 天" },
  { id: "d7", label: "出發前 7 天" },
  { id: "d3", label: "出發前 3 天" },
  { id: "d1", label: "出發前一晚" },
  { id: "traveling", label: "旅中" },
  { id: "returned", label: "回國後" },
];

// 點了之後要去哪。
export type DemoAction = "network" | "team" | "activation" | "topup" | "coupon";

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
  d14: {
    status: { icon: "📶", title: "D-14：現在買不會浪費", sub: "到國外連上網那天才開始算天數，提早買好先確認手機能用", button: "看方案", action: "network" },
    notifications: [
      { id: "d14", icon: "📶", title: "提早準備這趟的網路", body: "到國外連上網那天才開始算天數，現在買不會浪費", time: "09:00", action: "network" },
    ],
  },
  d7: {
    status: { icon: "⏰", title: "D-7：這趟網路還沒準備", sub: "方案已帶好，點一下去購買", button: "去購買", action: "network" },
    notifications: [
      { id: "d7", icon: "⏰", title: "D-7 網路提醒", body: "再 7 天出發，4 人的方案已帶好；出發前一晚用 Wi-Fi 裝好就行", time: "09:00", action: "network" },
    ],
  },
  d3: {
    status: { icon: "⏳", title: "D-3：最後提醒，網路還沒買", sub: "方案已帶好，附開通說明，買好就能先用 Wi-Fi 裝", button: "去購買", action: "network" },
    notifications: [
      { id: "d3", icon: "⏳", title: "D-3 網路提醒", body: "再 3 天出發，4 人的方案已帶好，買完照著開通說明裝就好", time: "09:00", action: "network" },
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
  // 買了就停止促購：D-14 只告知之後會提醒安裝，不再推銷。
  d14: {
    status: { icon: "🎫", title: "這趟的網卡已經買好了", sub: "出發前 3 天會提醒全團安裝", button: "看全團", action: "team" },
    notifications: [],
  },
  d7: {
    status: { icon: "👥", title: "你、小美已安裝，阿哲、媽媽還沒", sub: "把 QR Code 和教學傳給還沒裝的人", button: "看全團", action: "team" },
    notifications: [
      { id: "d7-team", icon: "👥", title: "旅伴安裝進度", body: "小美已安裝 eSIM，阿哲、媽媽還沒裝", time: "09:00", action: "team" },
    ],
  },
  d3: {
    status: { icon: "📲", title: "D-3：提醒旅伴安裝", sub: "媽媽還沒裝，傳圖文教學給她", button: "看全團", action: "team" },
    notifications: [
      { id: "d3-install", icon: "📲", title: "安裝提醒", body: "再 3 天出發，媽媽還沒裝 eSIM，可以先用 Wi-Fi 裝好", time: "09:00", action: "team" },
    ],
  },
  d1: {
    status: { icon: "🔧", title: "明天出發，今天可以安裝了", sub: "用 Wi-Fi 裝好，再做一次開通檢查", button: "開始檢查", action: "activation" },
    notifications: [
      { id: "d1-check", icon: "🔧", title: "今天可以安裝了", body: "你們明天出發，用 Wi-Fi 裝好 eSIM，花 1 分鐘做開通檢查", time: "20:00", action: "activation" },
    ],
  },
  traveling: {
    status: { icon: "🗓️", title: "行程延長了 2 天", sub: "AI 幫你看全團的網卡還夠不夠", button: "看建議", action: "topup" },
    notifications: [
      { id: "extended", icon: "🗓️", title: "行程有變動", body: "延長 2 天，AI 幫你判讀要不要加買網卡", time: "21:30", action: "topup" },
    ],
  },
  returned: NOT_PURCHASED.returned,
};

export function phaseContent(phase: DemoPhase, isPurchased: boolean): PhaseContent {
  return (isPurchased ? PURCHASED : NOT_PURCHASED)[phase];
}
