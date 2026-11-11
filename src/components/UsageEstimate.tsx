import { useEffect, useState } from "react";
import type { Recommendation } from "../lib/api";

interface Props {
  recommendation: Recommendation;
}

// 全團的推薦總結＋「每一天要多少流量」，讓人看得出 AI 讀的是行程內容，不只是天數。
export function UsageEstimate({ recommendation }: Props) {
  const { summary, breakdown } = recommendation;
  const peakGB = Math.max(...breakdown.map((b) => b.gb), 1);

  // Grow the breakdown bars from 0 on mount for a small reveal.
  const [isGrown, setIsGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="estimate">
      <div className="estimate-stat">AI 讀了你們的每日行程</div>
      <p className="rec-reason">{summary}</p>
      <div className="rec-break">
        <div className="rec-break-head">每人每天大約要多少流量</div>
        {breakdown.map((b, i) => (
          <div className="bar-row" key={b.day}>
            <div className="bar-top">
              <span className="bar-label">
                {b.day}・{b.label}
              </span>
              <span className="bar-val">{b.gb}GB</span>
            </div>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{
                  width: isGrown ? `${(b.gb / peakGB) * 100}%` : 0,
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
