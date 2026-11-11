import { useState } from "react";
import type { Member, Plan } from "../lib/api";
import { PlanOptions } from "./PlanOptions";

interface Props {
  member: Member;
  plan: Plan | null;
  recommendedPlanId: string;
  estimatedDataGB: number;
  reason: string;
  plans: Plan[];
  days: number;
  onSelect: (planId: string) => void;
}

// 一位旅伴的推薦：方案＋一句理由＋透明標示（線路來源、降速條件、何時開始算天數）。
export function MemberPlanCard({
  member,
  plan,
  recommendedPlanId,
  estimatedDataGB,
  reason,
  plans,
  days,
  onSelect,
}: Props) {
  const [isPicking, setIsPicking] = useState(false);
  const isRecommended = plan?.id === recommendedPlanId;
  const recommendedName = plans.find((p) => p.id === recommendedPlanId)?.name;

  return (
    <div className="member-plan">
      <div className="member-plan-head">
        <span className="member-avatar">{member.name.slice(0, 1)}</span>
        <span className="member-plan-who">
          <b>{member.name}</b>
          <small>
            {member.profile}・{member.device}
          </small>
        </span>
        <span className="member-plan-gb">≈ {estimatedDataGB}GB</span>
      </div>

      <div className="member-plan-pick">
        <span className="member-plan-name">
          {plan?.name ?? "沒有適用方案"}
          {isRecommended && <span className="plan-badge">AI 推薦</span>}
        </span>
        {plan && <span className="member-plan-price">NT${plan.priceTWD.toLocaleString()}</span>}
      </div>
      <p className="member-plan-reason">
        {!isRecommended && recommendedName && <b>AI 原本推薦{recommendedName}：</b>}
        {reason}
      </p>

      {plan && (
        <ul className="plan-facts">
          <li>📡 {plan.lineSource}</li>
          <li>🐢 {plan.throttle}</li>
          <li>🗓️ {plan.dayCountRule}</li>
        </ul>
      )}

      <button className="member-plan-toggle" onClick={() => setIsPicking((v) => !v)}>
        {isPicking ? "收合" : "換別的方案"}
      </button>
      {isPicking && (
        <PlanOptions
          plans={plans}
          recommendedId={recommendedPlanId}
          selectedId={plan?.id ?? ""}
          estimatedDataGB={estimatedDataGB}
          days={days}
          onSelect={(id) => {
            onSelect(id);
            setIsPicking(false);
          }}
        />
      )}
    </div>
  );
}
