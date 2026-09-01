# 去趣 eSIM · AI 上網管家 (Demo)

黑客松 Demo：把 eSIM 銷售嵌進行程規劃的當下，用 Claude 做**流量推算 → 精準方案推薦**，並附上 **AI 客服** 拆解相容性／開通／中國免翻牆三大焦慮。

> 核心概念：**你的行程，就是你的方案。** 競品要旅客自己判斷買幾 GB、手機能不能用；去趣握有行程 context，可以直接幫他判斷完、一鍵下單。

## 快速開始

```bash
npm install
cp .env.example .env   # 填入 ANTHROPIC_API_KEY（沒填也能跑，會顯示示範資料）
npm run dev
```

打開 http://localhost:5173 → 選一個旅客 → 看 AI 推薦方案。

## 串接 Claude

- 沒有 `ANTHROPIC_API_KEY` 時，`/api` 回傳 **mock 資料**，整條流程照跑（適合先看 UI）。
- 填入金鑰後自動切換成真的 Claude：
  - **推薦引擎**（`api/_lib/recommend.ts`）：`messages.parse` + Zod structured output，回傳結構化 JSON（方案 id、預估 GB、理由、流量拆解）。
  - **AI 客服**（`api/_lib/chat.ts`）：一般對話式回覆。
- 想省錢：`.env` 設 `CLAUDE_MODEL=claude-sonnet-5`，正式 demo 再換回 `claude-opus-5`。

## 架構

```
[React 前端]  ──fetch──▶  /api  (拿著金鑰的後端)  ──SDK──▶  Claude
```

- `src/` — 前端（Vite + React + TS）
- `api/` — Serverless functions（Vercel 慣例；`_lib/` 是共用邏輯，不會被當成路由）
- `vite.config.ts` — 開發時用一個 plugin 在本機服務 `/api`，所以 `npm run dev` 一個指令就能跑，不需要 `vercel dev`

## 部署到 Vercel

1. `npm i -g vercel`（或用 Vercel 網站連 GitHub repo）
2. 在 Vercel 專案設定加環境變數 `ANTHROPIC_API_KEY`
3. `vercel`（Vercel 會自動把 `api/*.ts` 佈成 serverless functions）

## 下一步（roadmap）

- [ ] 相容性檢測：輸入手機型號 → 秒判能不能用
- [ ] AI 旅程明信片：規劃完生成專屬分享圖 + 推薦碼（病毒擴散）
- [ ] 自由輸入行程（不只 preset 人物）
- [ ] 客服串流回覆（打字機效果）
- [ ] 和泰生態鉤子：車主 bundle、和泰 Points 串接
