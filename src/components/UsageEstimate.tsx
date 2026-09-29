import { useEffect, useState } from "react";
import type { Recommendation } from "../lib/api";

interface Props {
  recommendation: Recommendation;
  perPerson: boolean;
}

export function UsageEstimate({ recommendation, perPerson }: Props) {
  const { estimatedDataGB, reasoning, breakdown } = recommendation;

  // Grow the breakdown bars from 0 on mount for a small reveal.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="estimate">
      <div className="estimate-stat">
        AI 估你這趟用量 ≈ <b>{estimatedDataGB}GB</b>
        {perPerson ? " / 每人" : ""}
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
    </div>
  );
}
