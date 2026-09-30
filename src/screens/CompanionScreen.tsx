import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import type { CompanionScenario } from "../data/companion-scenarios";

// How long the "AI reads the weather + your itinerary" beat lasts before Plan B reveals.
const THINKING_MS = 1100;

interface Props {
  scenario: CompanionScenario;
  companions?: string[];
  onBack: () => void;
  onDone: () => void;
}

type Phase = "thinking" | "reveal" | "confirmed";

export function CompanionScreen({ scenario, companions, onBack, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("thinking");
  const [selectedId, setSelectedId] = useState(scenario.planB[0]?.id ?? "");

  useEffect(() => {
    const id = setTimeout(() => setPhase("reveal"), THINKING_MS);
    return () => clearTimeout(id);
  }, [scenario]);

  const selected = scenario.planB.find((p) => p.id === selectedId) ?? scenario.planB[0];

  return (
    <>
      <NavBar title="AI 旅中管家" onBack={onBack} />
      <div className="companion-screen">
        <div className="companion-alert">
          <span className="companion-alert-ic">⛈️</span>
          <div>
            <div className="companion-alert-title">{scenario.alertHeadline}</div>
            <div className="companion-alert-sub">{scenario.timeWindow}</div>
          </div>
        </div>

        <div className="companion-original">
          <span className="companion-original-tag">{scenario.day} 原計畫</span>
          <span className="companion-original-spot">{scenario.originalSpot}</span>
        </div>

        {phase === "thinking" && (
          <div className="companion-thinking">AI 正在讀天氣與你的行程…</div>
        )}

        {phase !== "thinking" && (
          <div className="companion-planb">
            <div className="companion-planb-head">AI 幫你想了 {scenario.planB.length} 個 Plan B</div>
            <div className="companion-planb-list">
              {scenario.planB.map((p) => (
                <button
                  key={p.id}
                  className={`companion-planb-row${p.id === selectedId ? " selected" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                  disabled={phase === "confirmed"}
                >
                  <span className="plan-radio" />
                  <span className="companion-planb-main">
                    <span className="companion-planb-name">{p.name}</span>
                    <span className="companion-planb-note">{p.note}</span>
                  </span>
                  <span className="companion-planb-tag">{p.tag}</span>
                </button>
              ))}
            </div>

            {phase === "reveal" && (
              <button className="cta-btn companion-cta" onClick={() => setPhase("confirmed")}>
                一鍵替換這段行程
              </button>
            )}

            {phase === "confirmed" && (
              <div className="companion-confirmed">
                <div className="companion-confirmed-title">✓ 已更新行程</div>
                <div className="companion-confirmed-sub">
                  {scenario.day} {scenario.timeWindow} 已改成「{selected?.name}」
                  {companions && companions.length > 0 && (
                    <>
                      ，已通知 {companions.join("、")}
                    </>
                  )}
                </div>
                <div className="companion-badge">這是你去趣 eSIM 方案內建的旅中管家</div>
                <button className="cta-btn" onClick={onDone}>
                  回到行程
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
