import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🗺️", label: "讀取你的行程" },
  { icon: "📊", label: "推算所需流量" },
  { icon: "✨", label: "挑選最適方案" },
] as const;

export function StepLoader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => Math.min(a + 1, STEPS.length - 1)),
      450,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="step-loader">
      <div className="step-loader-title">AI 上網管家推算中…</div>
      <div className="step-list">
        {STEPS.map((s, i) => {
          const state = i < active ? "done" : i === active ? "active" : "";
          return (
            <div key={s.label} className={`step-item ${state}`}>
              <span className="step-icon">{i < active ? "✓" : s.icon}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
