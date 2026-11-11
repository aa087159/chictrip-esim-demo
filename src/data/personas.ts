import type { DayPlan, Itinerary, Member } from "../lib/api";

export interface Persona {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  itinerary: Itinerary;
  // 旅中行程變動（Demo 第 6 步）：延長的天數，用來判讀要不要加買。
  extension: { title: string; days: DayPlan[] };
}

// 兩份行程用同一組 4 人（1 位主揪＋3 位旅伴），對照「同樣的人換一份行程，推薦就不一樣」。
const MEMBERS: Member[] = [
  { id: "me", name: "你", isOrganizer: true, style: "driver", profile: "主揪", device: "iPhone 15" },
  { id: "mei", name: "小美", style: "heavy", profile: "愛拍限動", device: "iPhone 13 mini" },
  { id: "zhe", name: "阿哲", style: "normal", profile: "一般使用", device: "Pixel 8" },
  { id: "mom", name: "媽媽", style: "light", profile: "LINE 為主・第一次用 eSIM", device: "iPhone 11" },
];

function makeItinerary(
  base: Pick<Itinerary, "destination" | "countryCode" | "dateRange" | "dayPlan">,
): Itinerary {
  return {
    ...base,
    days: base.dayPlan.length,
    members: MEMBERS,
    travelers: MEMBERS.length,
    companions: MEMBERS.filter((m) => !m.isOrganizer).map((m) => m.name),
  };
}

export const PERSONAS: Persona[] = [
  {
    id: "tokyo-drive",
    emoji: "🚗",
    title: "東京 5 天・4 人：樂園＋富士山自駕",
    subtitle: "迪士尼一整天、租車去河口湖和箱根",
    itinerary: makeItinerary({
      destination: "東京",
      countryCode: "JP",
      dateRange: "12/20–12/24",
      dayPlan: [
        { day: "D1", spots: "淺草寺 → 晴空塔 → 上野", tag: "city", note: "淺草、晴空塔" },
        { day: "D2", spots: "東京迪士尼海洋（全日）", tag: "themepark", note: "東京迪士尼海洋" },
        { day: "D3", spots: "租車 → 河口湖 → 富士山五合目", tag: "drive", note: "自駕河口湖看富士山" },
        { day: "D4", spots: "自駕 → 箱根 → 蘆之湖", tag: "drive", note: "自駕箱根" },
        { day: "D5", spots: "御殿場 Outlet → 還車 → 東京", tag: "drive", note: "自駕御殿場 Outlet" },
      ],
    }),
    extension: {
      title: "行程延長 2 天：D6 再租車去輕井澤、D7 回程",
      days: [
        { day: "D6", spots: "自駕 → 輕井澤 → 舊輕井澤銀座", tag: "drive", note: "自駕輕井澤" },
        { day: "D7", spots: "輕井澤 → 東京 → 羽田機場", tag: "transit", note: "回程" },
      ],
    },
  },
  {
    id: "kansai-slow",
    emoji: "♨️",
    title: "關西 5 天・4 人：寺院＋溫泉慢旅",
    subtitle: "電車移動，一晚住有馬溫泉旅館",
    itinerary: makeItinerary({
      destination: "大阪",
      countryCode: "JP",
      dateRange: "12/20–12/24",
      dayPlan: [
        { day: "D1", spots: "心齋橋 → 道頓堀", tag: "city", note: "心齋橋、道頓堀" },
        { day: "D2", spots: "京都 清水寺 → 祇園", tag: "city", note: "京都清水寺" },
        { day: "D3", spots: "奈良公園 → 東大寺", tag: "city", note: "奈良" },
        { day: "D4", spots: "有馬溫泉（住溫泉旅館）", tag: "onsen", note: "住有馬溫泉" },
        { day: "D5", spots: "梅田 → 中之島散步", tag: "transit", note: "梅田" },
      ],
    }),
    extension: {
      title: "行程延長 2 天：D6 環球影城、D7 回程",
      days: [
        { day: "D6", spots: "日本環球影城（全日）", tag: "themepark", note: "環球影城" },
        { day: "D7", spots: "梅田 → 關西機場", tag: "transit", note: "回程" },
      ],
    },
  },
];
