import { useState } from "react";
import type { Persona } from "../data/personas";
import type { Recommendation } from "../lib/api";

interface Props {
  recommendation: Recommendation;
  persona: Persona;
}

export function RecommendationCard({ recommendation, persona }: Props) {
  const { plan, estimatedDataGB, reasoning, breakdown, upsellHint } = recommendation;
  const [ordered, setOrdered] = useState(false);

  if (!plan) {
    return <div className="error">找不到對應方案（id: {recommendation.recommendedPlanId}）</div>;
  }

  const points = Math.round((plan.priceTWD * plan.pointsPct) / 100);

  return (
    <div className="rec-card">
      <div className="rec-head">
        <div>
          <div className="rec-country">{plan.countryName}・{persona.itinerary.days} 天</div>
          <div className="rec-name">{plan.name}</div>
          {plan.highlight && <div className="rec-highlight">✦ {plan.highlight}</div>}
        </div>
        <div className="rec-price">
          <span className="rec-price-num">NT${plan.priceTWD}</span>
          <span className="rec-price-from">起</span>
        </div>
      </div>

      <div className="rec-estimate">
        <span className="rec-gb">預估用量 ≈ {estimatedDataGB}GB</span>
        <span className="rec-points">回饋 {points} 和泰 Points</span>
      </div>

      <p className="rec-reasoning">{reasoning}</p>

      <div className="rec-breakdown">
        {breakdown.map((b, i) => (
          <div className="rec-bar-row" key={i}>
            <span className="rec-bar-label">{b.activity}</span>
            <span className="rec-bar-track">
              <span
                className="rec-bar-fill"
                style={{ width: `${Math.min(100, (b.gb / Math.max(estimatedDataGB, 1)) * 100)}%` }}
              />
            </span>
            <span className="rec-bar-val">{b.gb}GB</span>
          </div>
        ))}
      </div>

      {upsellHint && <div className="rec-upsell">💡 {upsellHint}</div>}

      <button
        className={`rec-cta${ordered ? " done" : ""}`}
        onClick={() => setOrdered(true)}
        disabled={ordered}
      >
        {ordered ? "✓ 已加入購物車（Demo）" : "一鍵下單"}
      </button>
    </div>
  );
}
