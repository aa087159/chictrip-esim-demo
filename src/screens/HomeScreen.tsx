import { useState } from "react";
import { PLAN_COLLAGE, SPOTS, type SpotCategory } from "../data/feed";
import { DEMO_PHASES, phaseContent, type DemoAction, type DemoPhase } from "../data/demo-phase";
import { useDemoToast } from "../lib/useDemoToast";

interface Props {
  phase: DemoPhase;
  isPurchased: boolean;
  onPhase: (phase: DemoPhase) => void;
  onOpenTrip: () => void;
  // 狀態卡、通知、eSIM 捷徑點了之後要去的畫面（回購券除外，首頁自己顯示提示）。
  onAction: (action: Exclude<DemoAction, "coupon">) => void;
  onOpenExplore: () => void;
}

interface Shortcut {
  id: string;
  icon: string;
  label: string;
  isWide?: boolean;
}

// 捷徑格兩頁，版面照去趣 App：第一頁左上是佔兩格的「行程靈感」寬卡。
const SHORTCUT_PAGES: Shortcut[][] = [
  [
    { id: "inspire", icon: "💡", label: "行程靈感 ›", isWide: true },
    { id: "flight", icon: "✈️", label: "機票" },
    { id: "hotel", icon: "🛏️", label: "住宿" },
    { id: "insurance", icon: "🛡️", label: "旅平險" },
    { id: "coupon", icon: "🎟️", label: "優惠券" },
    { id: "esim", icon: "📶", label: "eSIM" },
    { id: "tour", icon: "🎡", label: "旅遊體驗" },
  ],
  [
    { id: "traffic", icon: "🚄", label: "交通" },
    { id: "taxfree", icon: "🛍️", label: "免稅購物" },
    { id: "theme", icon: "#️⃣", label: "主題旅遊" },
    { id: "goods", icon: "🧢", label: "去趣周邊" },
  ],
];

const RANK_CATEGORIES: SpotCategory[] = ["景點", "美食", "購物"];
const RANK_SIZE = 5;

export function HomeScreen({
  phase,
  isPurchased,
  onPhase,
  onOpenTrip,
  onAction,
  onOpenExplore,
}: Props) {
  const toast = useDemoToast();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  // 通知紅點與狀態卡以時間點為單位：切到新的時間點時重新出現。
  const [seenPhase, setSeenPhase] = useState<DemoPhase | null>(null);
  const [dismissedPhase, setDismissedPhase] = useState<DemoPhase | null>(null);
  const [shortcutPage, setShortcutPage] = useState(0);
  const [rankCategory, setRankCategory] = useState<SpotCategory>("景點");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const { status, notifications } = phaseContent(phase, isPurchased);
  const hasUnread = seenPhase !== phase;
  const isStatusVisible = dismissedPhase !== phase;
  const ranking = SPOTS.filter((s) => s.category === rankCategory)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, RANK_SIZE);

  function runAction(action: DemoAction) {
    if (action === "coupon") toast.show("已領取回購券，下次購買自動折抵");
    else onAction(action);
  }

  function openInbox() {
    setIsInboxOpen(true);
    setSeenPhase(phase);
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onShortcut(id: string) {
    if (id === "esim") onAction(isPurchased ? "team" : "network");
    else if (id === "inspire") onOpenExplore();
    else toast.show();
  }

  return (
    <div className="home">
      <div className="home-scroll">
        <header className="home-top">
          <label className="phase-switch" title="Demo 時間切換">
            <span aria-hidden>⏱</span>
            <select value={phase} onChange={(e) => onPhase(e.target.value as DemoPhase)}>
              {DEMO_PHASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <button className="head-bell" onClick={openInbox} aria-label="通知">
            🔔{hasUnread && <span className="head-bell-dot" />}
          </button>
        </header>

        <h1 className="home-title">
          輕鬆規劃旅行
          <br />
          從去趣開始！
        </h1>

        <div
          className="shortcut-pages"
          onScroll={(e) => {
            const el = e.currentTarget;
            setShortcutPage(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {SHORTCUT_PAGES.map((page, i) => (
            <div className="shortcut-grid" key={i}>
              {page.map((s) => (
                <button
                  key={s.id}
                  className={`tile${s.isWide ? " wide" : ""}${s.id === "esim" ? " esim" : ""}`}
                  onClick={() => onShortcut(s.id)}
                >
                  {s.id === "esim" && <span className="tile-badge">依行程推薦</span>}
                  <span className="tile-ic">{s.icon}</span>
                  <span className="tile-label">{s.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="dots">
          {SHORTCUT_PAGES.map((_, i) => (
            <i key={i} className={i === shortcutPage ? "on" : ""} />
          ))}
        </div>

        {isStatusVisible && (
          <div className="status-strip">
            <span className="status-ic">{status.icon}</span>
            <span className="status-text">
              <b>{status.title}</b>
              <small>{status.sub}</small>
            </span>
            <button className="status-btn" onClick={() => runAction(status.action)}>
              {status.button}
            </button>
            <button
              className="status-close"
              onClick={() => setDismissedPhase(phase)}
              aria-label="關閉"
            >
              ×
            </button>
          </div>
        )}

        <section className="plan-card">
          <div className="plan-card-text">
            <h2>開始我的旅行計劃</h2>
            <p>AI 幫你排行程，網路也幫你算</p>
            <button className="pill-dark" onClick={onOpenTrip}>
              馬上來玩 ›
            </button>
          </div>
          <div className="collage">
            {PLAN_COLLAGE.map((src, i) => (
              <span key={src} className={`collage-${i}`} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        </section>

        <section className="rank">
          <h2 className="rank-h">星榜單</h2>
          <div className="rank-filters">
            <button className="dropdown" onClick={() => toast.show("Demo 只有東京的資料")}>
              日本 東京都 <span>⌄</span>
            </button>
            <label className="dropdown">
              <select
                value={rankCategory}
                onChange={(e) => setRankCategory(e.target.value as SpotCategory)}
              >
                {RANK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span>⌄</span>
            </label>
          </div>
          <div className="rank-rail">
            {ranking.map((spot, i) => (
              <div
                key={spot.id}
                className="rank-card"
                style={{ backgroundImage: `url(${spot.img})` }}
              >
                <span className="top-badge">TOP {String(i + 1).padStart(2, "0")}</span>
                <button
                  className={`heart${likedIds.has(spot.id) ? " on" : ""}`}
                  onClick={() => toggleLike(spot.id)}
                  aria-label="收藏"
                >
                  {likedIds.has(spot.id) ? "♥" : "♡"}
                </button>
                <span className="rank-card-name">{spot.name}</span>
                <span className="rank-card-meta">
                  ★ {spot.rating.toFixed(1)} · ♡ {spot.likes.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isInboxOpen && (
        <div className="sheet-backdrop" onClick={() => setIsInboxOpen(false)}>
          <div className="inbox" onClick={(e) => e.stopPropagation()}>
            <div className="inbox-head">
              <b>通知</b>
              <button onClick={() => setIsInboxOpen(false)} aria-label="關閉">
                ×
              </button>
            </div>
            {notifications.length === 0 && <div className="inbox-empty">目前沒有通知</div>}
            {notifications.map((n) => (
              <button
                key={n.id}
                className="inbox-row"
                onClick={() => {
                  setIsInboxOpen(false);
                  runAction(n.action);
                }}
              >
                <span className="inbox-ic">{n.icon}</span>
                <span className="inbox-text">
                  <b>{n.title}</b>
                  <small>{n.body}</small>
                </span>
                <span className="inbox-time">{n.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {toast.message && <div className="toast">{toast.message}</div>}
    </div>
  );
}
