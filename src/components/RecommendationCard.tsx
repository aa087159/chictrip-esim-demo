import { useEffect, useState } from "react";
import type { Persona } from "../data/personas";
import type { Recommendation } from "../lib/api";

interface Props {
  recommendation: Recommendation;
  persona: Persona;
}

const FLAG: Record<string, string> = {
  JP: "🇯🇵",
  KR: "🇰🇷",
  CN: "🇨🇳",
  HK: "🇭🇰",
  MO: "🇲🇴",
};

export function RecommendationCard({ recommendation, persona }: Props) {
  const { plan, estimatedDataGB, reasoning, breakdown, upsellHint } = recommendation;
  const [ordered, setOrdered] = useState(false);

  // Grow the breakdown bars from 0 on mount for a small reveal.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!plan) {
    return (
      <div className="error">找不到對應方案（id: {recommendation.recommendedPlanId}）</div>
    );
  }

  const points = Math.round((plan.priceTWD * plan.pointsPct) / 100);

  return (
    <div className="rec-card">
      <div className="rec-top">
        <div>
          <div className="rec-meta">
            {FLAG[plan.countryCode] ?? "🌏"} {plan.countryName}・{persona.itinerary.days} 天
          </div>
          <div className="rec-name">{plan.name}</div>
          {plan.highlight && <div className="rec-highlight">✦ {plan.highlight}</div>}
        </div>
        <div className="rec-price">
          <b>NT${plan.priceTWD}</b>
          <small>起</small>
        </div>
      </div>

      <div className="rec-stats">
        <span className="stat data">預估用量 ≈ {estimatedDataGB}GB</span>
        <span className="stat points">回饋 {points} 和泰 Points</span>
      </div>

      <p className="rec-reason">{reasoning}</p>

      <div className="rec-break">
        <div className="rec-break-head">流量來源預估</div>
        {breakdown.map((b, i) => (
          <div className="bar-row" key={i}>
            <div className="bar-top">
              <span className="bar-label">{b.activity}</span>
              <span className="bar-val">{b.gb}GB</span>
            </div>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{
                  width: grown
                    ? `${Math.min(100, (b.gb / Math.max(estimatedDataGB, 1)) * 100)}%`
                    : 0,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
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
