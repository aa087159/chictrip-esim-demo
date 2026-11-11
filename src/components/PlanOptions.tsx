import type { Plan } from "../lib/api";
import { capacityGB } from "../../api/_lib/estimate";

interface Props {
  plans: Plan[]; // 已依推薦度排序，最推薦在最前
  recommendedId: string;
  selectedId: string;
  estimatedDataGB: number;
  days: number;
  onSelect: (planId: string) => void;
}

function specLabel(plan: Plan): string {
  if (plan.type === "unlimited") return "吃到飽";
  if (plan.type === "daily") return `每日 ${plan.dailyGB}GB`;
  return `${plan.dataGB}GB 定量`;
}

// A plain-language "is this enough for the trip?" tag, judged against the estimate.
function fitTag(
  plan: Plan,
  estimatedDataGB: number,
  days: number,
): { label: string; tone: "good" | "ok" | "warn" } {
  const cap = capacityGB(plan, days);
  if (cap === Infinity || cap >= estimatedDataGB * 1.3) return { label: "用不完", tone: "good" };
  if (cap >= estimatedDataGB) return { label: "剛好夠", tone: "ok" };
  return { label: "可能不夠", tone: "warn" };
}

export function PlanOptions({
  plans,
  recommendedId,
  selectedId,
  estimatedDataGB,
  days,
  onSelect,
}: Props) {
  return (
    <div className="plan-list" role="radiogroup" aria-label="適用方案">
      <div className="plan-list-head">共 {plans.length} 個方案可選</div>
      {plans.map((plan) => {
        const isRecommended = plan.id === recommendedId;
        const isSelected = plan.id === selectedId;
        const tag = fitTag(plan, estimatedDataGB, days);
        const points = Math.round((plan.priceTWD * plan.pointsPct) / 100);
        return (
          <button
            key={plan.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`plan-row${isSelected ? " selected" : ""}`}
            onClick={() => onSelect(plan.id)}
          >
            <span className="plan-radio" aria-hidden="true" />
            <span className="plan-main">
              <span className="plan-name-row">
                <span className="plan-name">{plan.name}</span>
                {isRecommended && <span className="plan-badge">最推薦</span>}
              </span>
              <span className="plan-tags">
                <span className="plan-spec">{specLabel(plan)}</span>
                <span className={`plan-fit ${tag.tone}`}>{tag.label}</span>
              </span>
            </span>
            <span className="plan-price">
              <span className="plan-amt">
                <b>NT${plan.priceTWD.toLocaleString()}</b>
                <small>起</small>
              </span>
              <span className="plan-points">回饋 {points} Points</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
