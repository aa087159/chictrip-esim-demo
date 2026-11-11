import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { checkTopUp } from "../../api/_lib/estimate";
import type { DayPlan, Itinerary, Plan } from "../lib/api";
import type { HandoffItem } from "./HandoffScreen";

// How long the "AI compares the new itinerary with the cards you bought" beat lasts.
const THINKING_MS = 1100;

interface Props {
  itinerary: Itinerary;
  extension: { title: string; days: DayPlan[] };
  bought: Record<string, Plan>;
  addOns: Plan[];
  isAddOnBought: boolean;
  onBack: () => void;
  onGoBuy: (items: HandoffItem[]) => void;
}

// Demo 第 6 步：行程變動 → AI 依行程判讀每個人要不要加買哪張。只讀行程，不讀實際用量。
export function TopUpScreen({
  itinerary,
  extension,
  bought,
  addOns,
  isAddOnBought,
  onBack,
  onGoBuy,
}: Props) {
  const [isThinking, setIsThinking] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setIsThinking(false), THINKING_MS);
    return () => clearTimeout(id);
  }, []);

  const verdicts = checkTopUp(itinerary, extension.days, bought, addOns);
  const items: HandoffItem[] = verdicts.flatMap((v) => {
    const addOn = addOns.find((p) => p.id === v.addOnId);
    const member = itinerary.members.find((m) => m.id === v.memberId);
    return v.needsAddOn && addOn && member ? [{ memberId: member.id, who: member.name, plan: addOn }] : [];
  });

  return (
    <>
      <NavBar title="行程有變動" onBack={onBack} />
      <div className="topup">
        <div className="topup-change">
          <b>🗓️ {extension.title}</b>
          {extension.days.map((d) => (
            <span className="day" key={d.day}>
              <span className="day-tag">{d.day}</span>
              <span className="day-spots">{d.spots}</span>
            </span>
          ))}
        </div>

        {isThinking ? (
          <div className="companion-thinking">AI 正在比對新行程和你們買的網卡…</div>
        ) : (
          <>
            <div className="plan-list-head">AI 判讀：誰要加買、加買哪張</div>
            {verdicts.map((v) => {
              const member = itinerary.members.find((m) => m.id === v.memberId);
              const addOn = addOns.find((p) => p.id === v.addOnId);
              return (
                <div className={`verdict${v.needsAddOn ? " needs" : ""}`} key={v.memberId}>
                  <div className="verdict-top">
                    <span className="member-avatar">{member?.name.slice(0, 1)}</span>
                    <b>{member?.name}</b>
                    <span className={`install-pill ${v.needsAddOn ? "pending" : "active"}`}>
                      {v.needsAddOn ? `加買 ${addOn?.name ?? ""}` : "不用加買"}
                    </span>
                  </div>
                  <p className="verdict-reason">{v.reason}</p>
                </div>
              );
            })}
            <div className="topup-note">AI 只看行程變動判讀，不讀你的實際用量。</div>
          </>
        )}
      </div>

      {!isThinking && (
        <div className="cta-bar">
          {isAddOnBought ? (
            <div className="topup-done">✓ 已加買，新的 QR Code 在「全團網卡」</div>
          ) : items.length > 0 ? (
            <>
              <div className="cta-bar-info">
                <span className="cta-bar-label">加買 {items.length} 張</span>
                <span className="cta-bar-total">
                  NT${items.reduce((s, i) => s + i.plan.priceTWD, 0).toLocaleString()}
                </span>
              </div>
              <button className="cta-btn" onClick={() => onGoBuy(items)}>
                去加買 ›
              </button>
            </>
          ) : (
            <div className="topup-done">✓ 全團的網卡都還夠用</div>
          )}
        </div>
      )}
    </>
  );
}
