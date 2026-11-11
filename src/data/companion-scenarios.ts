// 旅中 AI 管家彩蛋：買了去趣 eSIM 之後，同一個 AI 在旅途中也罩你。
// 每個 persona 對應一段「行程受天氣影響 → AI 給 Plan B」的固定劇本（非即時 API，demo 用）。

export interface CompanionPlanB {
  id: string;
  name: string;
  tag: string;
  note: string;
}

export interface CompanionScenario {
  day: string;
  timeWindow: string;
  alertHeadline: string;
  originalSpot: string;
  planB: CompanionPlanB[];
}

const COMPANION_SCENARIOS: Record<string, CompanionScenario> = {
  "tokyo-drive": {
    day: "D2",
    timeWindow: "13:00–17:00",
    alertHeadline: "大雨特報",
    originalSpot: "東京迪士尼海洋 戶外遊行與園區散步",
    planB: [
      {
        id: "disney-indoor",
        name: "園內室內設施路線",
        tag: "室內・不用離園",
        note: "下午改排室內設施與表演，門票不浪費",
      },
      {
        id: "ikspiari",
        name: "IKSPIARI 購物中心",
        tag: "室內購物美食",
        note: "就在舞濱站旁，4 個人逛街配晚餐",
      },
      {
        id: "teamlab",
        name: "teamLab Planets TOKYO",
        tag: "室內・沉浸展覽",
        note: "電車 20 分鐘，雨天照樣拍限動",
      },
    ],
  },
  "kansai-slow": {
    day: "D3",
    timeWindow: "10:00–15:00",
    alertHeadline: "大雨特報",
    originalSpot: "奈良公園餵鹿",
    planB: [
      {
        id: "nara-museum",
        name: "奈良國立博物館",
        tag: "室內博物館",
        note: "就在奈良公園旁，路線不用改",
      },
      {
        id: "todaiji",
        name: "東大寺大佛殿",
        tag: "室內參觀",
        note: "原本就在行程上，先排進雨最大的時段",
      },
      {
        id: "higashimuki",
        name: "東向商店街",
        tag: "有屋頂商店街",
        note: "近鐵奈良站出來就到，媽媽走起來也輕鬆",
      },
    ],
  },
};

export function getCompanionScenario(personaId: string): CompanionScenario {
  return COMPANION_SCENARIOS[personaId] ?? COMPANION_SCENARIOS["tokyo-drive"];
}
