# 首頁、探索、會員：HTML＋Tailwind 交付檔

從 demo（chictrip-esim-demo）的 React 畫面抽出來的靜態 HTML，給負責「行程」分頁的組員彙整。

| 檔案 | 內容 |
|---|---|
| `home.html` | 首頁：時間切換、通知鈴、捷徑格（兩頁可左右滑）、狀態卡、開始我的旅行計劃、星榜單 |
| `explore.html` | 探索：搜尋列、分類（預設「景點」）、兩欄瀑布流、「這趟上網怎麼辦」卡片、地圖按鈕 |
| `me.html` | 會員：會員資料（零食組成）、切換示範行程 |

## 怎麼看
直接用瀏覽器打開任一個 `.html` 即可。三頁的底部分頁列互相連得到；「行程」連到 `#trip`，彙整時換成你的行程頁網址。

## 規格
- **沒有 JS**：只有預設畫面，按鈕都不會動。`<head>` 裡的 Tailwind Play CDN 只是為了讓檔案能直接預覽；併進專案時拿掉它，改用專案自己的 Tailwind 編譯。
- **沒有手機外框**：手機上是全螢幕；電腦上內容置中，最大寬度 480px。
- **Tailwind 版本**：class 照 v3.4 寫，v4 也能用（主題色的寫法見下方）。
- **圖片**：都是 Unsplash 的網址，需要連網才看得到。
- **「示意資料」標籤**：固定在每頁右上角，跟 demo 一致。

## 主題色（必須加進你的 Tailwind 設定）
HTML 用到 `text-ink`、`bg-brand-soft`、`shadow-card` 這類自訂名稱，沒有設定的話顏色會不見。

**Tailwind v3**（`tailwind.config.js` 的 `theme.extend`）：
```js
colors: {
  ink: { DEFAULT: "#1c202b", 2: "rgb(28 32 43 / 0.72)", 3: "rgb(28 32 43 / 0.5)" },
  brand: { DEFAULT: "#089cf7", ink: "#0577c2", soft: "#e7f4fe" },
  accent: { DEFAULT: "#f5a623", ink: "#b9740a", soft: "#fff4e2" },
  surface: "#f2f4f8",
  canvas: "#f6f8fb",
  card: "#ffffff",
  line: "#e7ecf3",
  good: { DEFAULT: "#17b26a", soft: "#e4f7ee" },
},
boxShadow: {
  "card-sm": "0 1px 2px rgba(28, 32, 43, 0.06)",
  card: "0 12px 30px rgba(28, 32, 43, 0.1)",
  "card-lg": "0 18px 44px rgba(8, 156, 247, 0.18)",
},
fontFamily: {
  sans: ["Inter", '"Noto Sans TC"', '"SF Pro Display"', '"Microsoft JhengHei"', "-apple-system", "sans-serif"],
},
```

**Tailwind v4**（CSS 裡的 `@theme`）：
```css
@theme {
  --color-ink: #1c202b;
  --color-ink-2: rgb(28 32 43 / 0.72);
  --color-ink-3: rgb(28 32 43 / 0.5);
  --color-brand: #089cf7;
  --color-brand-ink: #0577c2;
  --color-brand-soft: #e7f4fe;
  --color-accent: #f5a623;
  --color-accent-ink: #b9740a;
  --color-accent-soft: #fff4e2;
  --color-surface: #f2f4f8;
  --color-canvas: #f6f8fb;
  --color-card: #ffffff;
  --color-line: #e7ecf3;
  --color-good: #17b26a;
  --color-good-soft: #e4f7ee;
  --shadow-card-sm: 0 1px 2px rgba(28, 32, 43, 0.06);
  --shadow-card: 0 12px 30px rgba(28, 32, 43, 0.1);
  --shadow-card-lg: 0 18px 44px rgba(8, 156, 247, 0.18);
  --font-sans: Inter, "Noto Sans TC", "SF Pro Display", "Microsoft JhengHei", -apple-system, sans-serif;
}
```

## 沒有放進來的狀態
demo 裡有，但這次只交預設畫面，所以以下沒有做：
- **首頁**：
  - 時間切換的其他 6 個時間點（狀態卡內容會變）
  - 已購買後的狀態卡
  - 通知中心彈出視窗
  - 點了沒開放功能時的提示
  - 星榜單切到美食、購物
- **探索**：
  - 收藏、美食、購物分類
  - 清單排版
  - 地圖模式
  - 「＋ 行程」按下後的「✓ 已加入」
  - 愛心收藏後的樣子
- **會員**：切到關西行程後的選取狀態

需要哪個狀態，跟我說，再補一份。

## 跟「行程」分頁接起來的地方
以下這些在 demo 裡會跳到行程分頁，現在都先連到 `#trip`，或是不會動：
- **首頁狀態卡「看方案」**：demo 裡會打開推薦方案頁。行程還沒按「行程確定」時，會先回到行程頁。
- **首頁捷徑「eSIM」**：同上；已購買時改去全團網卡。
- **首頁「馬上來玩 ›」**：去行程頁。
- **探索「這趟上網怎麼辦」卡片**：同「看方案」。
