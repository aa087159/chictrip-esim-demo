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
  "tokyo-group": {
    day: "D2",
    timeWindow: "15:00–17:00",
    alertHeadline: "大雨特報",
    originalSpot: "台場海濱公園",
    planB: [
      {
        id: "teamlab",
        name: "teamLab Planets TOKYO",
        tag: "室內・沉浸展覽",
        note: "走路 10 分鐘內，雨天照樣拍限動",
      },
      {
        id: "aquacity",
        name: "AQUA CiTY 台場",
        tag: "室內購物美食",
        note: "3 人可以逛街配晚餐，不用淋雨移動",
      },
      {
        id: "ginza-six",
        name: "GINZA SIX 地下街",
        tag: "室內選物",
        note: "銀座行程順路改室內，路線不繞遠",
      },
    ],
  },
  "tokyo-solo": {
    day: "D1",
    timeWindow: "14:00–16:00",
    alertHeadline: "大雨特報",
    originalSpot: "原宿竹下通",
    planB: [
      {
        id: "omotesando-hills",
        name: "表參道之丘",
        tag: "室內選物",
        note: "同一條路上，雨天照樣逛得到限動景",
      },
      {
        id: "shibuya-sky",
        name: "SHIBUYA SKY 展望台",
        tag: "室內展望",
        note: "換個角度拍東京，避開竹下通人潮＋雨",
      },
      {
        id: "meiji-jingu-museum",
        name: "明治神宮博物館",
        tag: "室內",
        note: "安靜室內空間，雨天行程不斷電",
      },
    ],
  },
  "seoul-couple": {
    day: "D2",
    timeWindow: "16:00–18:00",
    alertHeadline: "大雨特報",
    originalSpot: "首爾林",
    planB: [
      {
        id: "daelim-museum",
        name: "大林美術館",
        tag: "室內美術館",
        note: "聖水洞內，適合情侶慢慢逛",
      },
      {
        id: "lcdc-seoul",
        name: "LCDC SEOUL",
        tag: "室內選物空間",
        note: "咖啡＋選物一次滿足，雨天不用移動太遠",
      },
      {
        id: "coex-mall",
        name: "COEX 地下商場",
        tag: "室內商場",
        note: "江南地下街逛到飽，跳過整場雨",
      },
    ],
  },
};

export function getCompanionScenario(personaId: string): CompanionScenario {
  return COMPANION_SCENARIOS[personaId] ?? COMPANION_SCENARIOS["tokyo-group"];
}
