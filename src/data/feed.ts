// 首頁星榜單 / 探索推薦的假景點資料（東京，對應預設示範行程「東京 5 天・3 人」）。
// 圖片來自 Unsplash（免費授權），用 CDN 參數裁切成卡片尺寸。

export const photo = (id: string, w = 480, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=70&auto=format`;

const IMG = {
  asakusaShop: "1480796927426-f609979314bd",
  neonStreet: "1540959733332-eab4deabeeaf",
  ramen: "1557872943-16a5ac26437e",
  shibuyaNight: "1542051841857-5f90071e7989",
  sushiPlate: "1617196034796-73dfa7b1fd56",
  shopping: "1555529669-e69e7aa0ba9a",
  tokyoTowerNight: "1604928141064-207cea6f571f",
  izakayaAlley: "1554797589-7241bb691973",
  forestTorii: "1601823984263-b87b59798b70",
  cityDay: "1549693578-d683be217e58",
  sushiBoat: "1553621042-f6e147245754",
  fujiSakura: "1490806843957-31f4c9a91c65",
  kyotoYasaka: "1493976040374-85c8e12f0c0e",
} as const;

export type SpotCategory = "景點" | "美食" | "購物";

export interface Spot {
  id: string;
  name: string;
  city: string;
  category: SpotCategory;
  // 雨天備案只篩室內景點
  isIndoor: boolean;
  // 影片卡顯示片長
  videoLength?: string;
  img: string;
  likes: number;
  rating: number;
  // 加入行程後估算的流量增量（GB）
  extraGB: number;
  // 探索地圖上的假標記位置（百分比）
  mapPos: { x: number; y: number };
}

export const SPOTS: Spot[] = [
  {
    id: "sensoji",
    name: "淺草寺・雷門散策",
    city: "東京",
    category: "景點",
    isIndoor: false,
    img: photo(IMG.asakusaShop),
    likes: 3241,
    rating: 4.6,
    extraGB: 0.3,
    mapPos: { x: 72, y: 16 },
  },
  {
    id: "teamlab",
    name: "teamLab Planets 沉浸式光影展",
    city: "東京",
    category: "景點",
    isIndoor: true,
    videoLength: "0:30",
    img: photo(IMG.neonStreet, 480, 720),
    likes: 2876,
    rating: 4.7,
    extraGB: 0.5,
    mapPos: { x: 64, y: 68 },
  },
  {
    id: "ichiran",
    name: "一蘭拉麵 新宿中央東口店",
    city: "東京",
    category: "美食",
    isIndoor: true,
    img: photo(IMG.ramen),
    likes: 2410,
    rating: 4.3,
    extraGB: 0.2,
    mapPos: { x: 30, y: 30 },
  },
  {
    id: "shibuya-sky",
    name: "SHIBUYA SKY 頂樓夜景",
    city: "東京",
    category: "景點",
    isIndoor: false,
    videoLength: "0:30",
    img: photo(IMG.shibuyaNight, 480, 720),
    likes: 2265,
    rating: 4.7,
    extraGB: 0.5,
    mapPos: { x: 22, y: 56 },
  },
  {
    id: "tsukiji",
    name: "築地場外市場 海鮮丼",
    city: "東京",
    category: "美食",
    isIndoor: false,
    img: photo(IMG.sushiPlate),
    likes: 1987,
    rating: 4.4,
    extraGB: 0.2,
    mapPos: { x: 60, y: 50 },
  },
  {
    id: "ginza-six",
    name: "GINZA SIX 選物購物",
    city: "東京",
    category: "購物",
    isIndoor: true,
    img: photo(IMG.shopping),
    likes: 1754,
    rating: 4.4,
    extraGB: 0.3,
    mapPos: { x: 50, y: 40 },
  },
  {
    id: "tokyo-tower",
    name: "東京鐵塔 夜間點燈",
    city: "東京",
    category: "景點",
    isIndoor: false,
    img: photo(IMG.tokyoTowerNight, 480, 720),
    likes: 1690,
    rating: 4.5,
    extraGB: 0.3,
    mapPos: { x: 40, y: 60 },
  },
  {
    id: "omoide",
    name: "新宿思い出橫丁 串燒巡禮",
    city: "東京",
    category: "美食",
    isIndoor: false,
    img: photo(IMG.izakayaAlley),
    likes: 1532,
    rating: 4.2,
    extraGB: 0.2,
    mapPos: { x: 18, y: 22 },
  },
  {
    id: "meiji-jingu",
    name: "明治神宮 森林參道",
    city: "東京",
    category: "景點",
    isIndoor: false,
    img: photo(IMG.forestTorii, 480, 720),
    likes: 1418,
    rating: 4.6,
    extraGB: 0.3,
    mapPos: { x: 12, y: 40 },
  },
  {
    id: "aquacity",
    name: "AQUA CiTY 台場購物中心",
    city: "東京",
    category: "購物",
    isIndoor: true,
    img: photo(IMG.cityDay),
    likes: 1206,
    rating: 4.1,
    extraGB: 0.3,
    mapPos: { x: 78, y: 80 },
  },
  {
    id: "ginza-sushi",
    name: "銀座 迴轉壽司名店",
    city: "東京",
    category: "美食",
    isIndoor: true,
    img: photo(IMG.sushiBoat),
    likes: 1102,
    rating: 4.5,
    extraGB: 0.2,
    mapPos: { x: 46, y: 30 },
  },
];

// 「開始我的旅行計劃」卡右側的照片拼貼
export const PLAN_COLLAGE = [
  photo(IMG.fujiSakura, 240, 240),
  photo(IMG.kyotoYasaka, 240, 240),
  photo(IMG.shibuyaNight, 240, 240),
];
