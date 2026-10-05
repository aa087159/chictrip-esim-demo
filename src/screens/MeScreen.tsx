import { PERSONAS, type Persona } from "../data/personas";
import { SUBSCRIPTION_MONTHLY_TWD } from "../lib/order";

interface Props {
  currentId: string;
  onPick: (persona: Persona) => void;
  isSubscribed: boolean;
  onToggleSubscription: () => void;
}

export function MeScreen({ currentId, onPick, isSubscribed, onToggleSubscription }: Props) {
  return (
    <div className="me">
      <div className="me-head">
        <div className="me-avatar">V</div>
        <div>
          <div className="me-name">Vivian</div>
          <div className="me-sub">和泰會員 · 1,240 Points</div>
        </div>
      </div>

      <div className={`member-card${isSubscribed ? " on" : ""}`}>
        <div className="member-card-head">
          <span className="member-card-title">
            {isSubscribed ? "去趣訂閱會員" : "加入去趣訂閱會員"}
          </span>
          {isSubscribed && <span className="member-card-badge">已訂閱</span>}
        </div>
        <ul className="member-card-perks">
          <li>所有 eSIM 9 折，整筆訂單（含同行旅伴）適用</li>
          <li>可與團體 9 折疊加</li>
        </ul>
        <button className="member-card-btn" onClick={onToggleSubscription}>
          {isSubscribed ? "Demo：切換為未訂閱" : `NT$${SUBSCRIPTION_MONTHLY_TWD} / 月 加入`}
        </button>
      </div>

      <div className="me-section-title">切換示範行程</div>
      <div className="me-list">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            className={`me-row${p.id === currentId ? " active" : ""}`}
            onClick={() => onPick(p)}
          >
            <span className="me-emoji">{p.emoji}</span>
            <span className="me-text">
              <b>{p.title}</b>
              <small>{p.subtitle}</small>
            </span>
            {p.id === currentId && <span className="me-check">✓</span>}
          </button>
        ))}
      </div>
      <div className="me-note">Demo：切換行程即可展示不同情境（個人 / 情侶 / 揪團）</div>
    </div>
  );
}
