// 旅中今日流量（demo 固定值）。首頁行程狀態卡、通知中心、行程分頁的流量儀表都讀這一份，數字才會一致。
export const TODAY_USAGE = {
  day: "D2",
  estimatedGB: 1.2,
  remainingGB: 0.8,
} as const;

export const formatGB = (gb: number) => `${gb.toFixed(1)}GB`;
