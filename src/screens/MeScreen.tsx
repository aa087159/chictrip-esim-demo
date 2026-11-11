import { PERSONAS, type Persona } from "../data/personas";

interface Props {
  currentId: string;
  onPick: (persona: Persona) => void;
}

export function MeScreen({ currentId, onPick }: Props) {
  return (
    <div className="me">
      <div className="me-head">
        <div className="me-avatar">V</div>
        <div>
          <div className="me-name">Vivian</div>
          <div className="me-sub">和泰會員 · 1,240 Points</div>
        </div>
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
      <div className="me-note">Demo：同樣 4 個人換一份行程，AI 推薦的方案就不一樣</div>
    </div>
  );
}
