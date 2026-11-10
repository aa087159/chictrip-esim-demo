import { useState } from "react";
import type { Itinerary } from "../lib/api";
import { SPOTS, type Spot } from "../data/feed";
import { useDemoToast } from "../lib/useDemoToast";

type Category = "景點" | "收藏" | "美食" | "購物" | "雨天備案";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "景點", label: "景點" },
  { id: "收藏", label: "收藏" },
  { id: "美食", label: "美食" },
  { id: "購物", label: "購物" },
  { id: "雨天備案", label: "☔ 雨天備案" },
];

const MARKER_ICON: Record<Spot["category"], string> = {
  景點: "📷",
  美食: "🍴",
  購物: "🛍️",
};

// 「這趟上網怎麼辦」卡插在列表的第幾張（對應去趣 App 中間的推薦廣告卡位置）
const NETWORK_CARD_INDEX = 2;
// 加入行程的 demo 目標日
const ADD_TO_DAY = "Day 2";

interface Props {
  itinerary: Itinerary;
  onOpenNetwork: () => void;
}

export function ExploreScreen({ itinerary, onOpenNetwork }: Props) {
  const toast = useDemoToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [isMapMode, setIsMapMode] = useState(false);
  const [isListLayout, setIsListLayout] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const spots = SPOTS.filter((s) => {
    if (category === null) return true;
    if (category === "收藏") return likedIds.has(s.id);
    if (category === "雨天備案") return s.isIndoor;
    return s.category === category;
  });

  const tripLabel = `${itinerary.destination} ${itinerary.days} 天${
    itinerary.travelers > 1 ? `・${itinerary.travelers} 人` : ""
  }`;

  function toggle(set: Set<string>, id: string) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }

  function addToTrip(spot: Spot) {
    if (addedIds.has(spot.id)) return;
    setAddedIds((prev) => toggle(prev, spot.id));
    toast.show(`已加入 ${ADD_TO_DAY}，預估流量 +${spot.extraGB.toFixed(1)}GB`);
  }

  const networkCard = (
    <button key="network-card" className="net-card" onClick={onOpenNetwork}>
      <span className="net-card-kicker">📶 這趟上網怎麼辦</span>
      <span className="net-card-title">{tripLabel}，AI 算好方案</span>
      <span className="net-card-sub">依每日行程估流量，一鍵幫全團配好</span>
      <span className="net-card-cta">看推薦方案 ›</span>
    </button>
  );

  function renderCard(spot: Spot, rank: number) {
    const isLiked = likedIds.has(spot.id);
    const isAdded = addedIds.has(spot.id);
    return (
      <div key={spot.id} className="spot-card">
        <div
          className={`spot-img${spot.videoLength ? " tall" : ""}`}
          style={{ backgroundImage: `url(${spot.img})` }}
        >
          {rank < 3 && <span className="top-badge">Top {rank + 1}</span>}
          <button
            className={`heart${isLiked ? " on" : ""}`}
            onClick={() => setLikedIds((prev) => toggle(prev, spot.id))}
            aria-label="收藏"
          >
            {isLiked ? "♥" : "♡"}
          </button>
          {spot.videoLength && <span className="video-len">▶ {spot.videoLength}</span>}
          <span className="spot-city">📍 {spot.city}</span>
        </div>
        <div className="spot-name">{spot.name}</div>
        <div className="spot-foot">
          <span className="spot-likes">♡ {spot.likes.toLocaleString()}</span>
          <button
            className={`add-trip${isAdded ? " added" : ""}`}
            onClick={() => addToTrip(spot)}
          >
            {isAdded ? "✓ 已加入" : "＋ 行程"}
          </button>
        </div>
      </div>
    );
  }

  function renderList() {
    if (spots.length === 0) {
      return (
        <div className="explore-empty">
          {category === "收藏" ? "還沒有收藏，點卡片右上角的愛心試試" : "這個分類目前沒有地點"}
        </div>
      );
    }
    const cards = spots.map((s, i) => renderCard(s, i));
    cards.splice(Math.min(NETWORK_CARD_INDEX, cards.length), 0, networkCard);
    if (isListLayout) return <div className="spot-list">{cards}</div>;
    // 兩欄交錯：依序左右輪流放，閱讀順序才會跟 App 一樣是左右左右。
    return (
      <div className="spot-masonry">
        {[0, 1].map((col) => (
          <div className="spot-col" key={col}>
            {cards.filter((_, i) => i % 2 === col)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="explore">
      <header className="explore-head">
        <div className="explore-search">
          <button className="region-pick" onClick={() => toast.show("Demo 只有東京的資料")}>
            選地區 ▾
          </button>
          <span className="explore-search-sep" />
          <button className="explore-search-input" onClick={() => toast.show()}>
            想找什麼……
          </button>
          <button className="mic" onClick={() => toast.show()} aria-label="語音搜尋">
            🎙️
          </button>
        </div>
        <div className="chip-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip${category === c.id ? " active" : ""}${c.id === "雨天備案" ? " rain" : ""}`}
              onClick={() => setCategory((cur) => (cur === c.id ? null : c.id))}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {isMapMode ? (
        <div className="map-view">
          <svg className="map-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <rect width="100" height="100" fill="#eef1e8" />
            <path d="M0 74 C 30 66, 52 88, 100 72 L100 100 L0 100 Z" fill="#cfe6f7" />
            <path d="M58 0 C 54 30, 70 46, 64 100" stroke="#cfe6f7" strokeWidth="3" fill="none" />
            <rect x="8" y="34" width="14" height="16" rx="2" fill="#d7ebcf" />
            <rect x="70" y="8" width="16" height="12" rx="2" fill="#d7ebcf" />
            <path d="M0 30 H100 M0 56 H100 M34 0 V100 M80 0 V100" stroke="#fff" strokeWidth="1.6" />
            <path d="M0 12 L100 88 M10 100 L90 0" stroke="#fff" strokeWidth="1" />
          </svg>
          {spots.map((s) => (
            <span
              key={s.id}
              className="map-marker"
              style={{ left: `${s.mapPos.x}%`, top: `${s.mapPos.y * 0.6}%` }}
            >
              {MARKER_ICON[s.category]} {s.rating.toFixed(1)}
            </span>
          ))}
          <div className={`map-sheet${isSheetExpanded ? " expanded" : ""}`}>
            <button
              className="map-sheet-handle"
              onClick={() => setIsSheetExpanded((v) => !v)}
              aria-label={isSheetExpanded ? "收合" : "展開"}
            >
              <i />
              <span>推薦 {spots.length} 個地點</span>
            </button>
            <div className="map-sheet-body">{renderList()}</div>
          </div>
        </div>
      ) : (
        <div className="explore-scroll">
          <div className="sort-bar">
            <span>⇅ 推薦</span>
            <span className="layout-toggle">
              <button
                className={isListLayout ? "" : "on"}
                onClick={() => setIsListLayout(false)}
                aria-label="格狀"
              >
                ▦
              </button>
              <button
                className={isListLayout ? "on" : ""}
                onClick={() => setIsListLayout(true)}
                aria-label="清單"
              >
                ☰
              </button>
            </span>
          </div>
          {renderList()}
        </div>
      )}

      <button className="map-toggle" onClick={() => setIsMapMode((v) => !v)}>
        {isMapMode ? "☰ 列表" : "🗺 地圖"}
      </button>

      {toast.message && <div className="toast">{toast.message}</div>}
    </div>
  );
}
