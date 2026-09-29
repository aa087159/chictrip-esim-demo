import { NavBar } from "../components/NavBar";
import { StepLoader } from "../components/StepLoader";
import { UsageEstimate } from "../components/UsageEstimate";
import { PlanOptions } from "../components/PlanOptions";
import { orderSummary } from "../lib/order";
import type { Itinerary, Plan, Recommendation } from "../lib/api";

interface Props {
  itinerary: Itinerary;
  recommendation: Recommendation | null;
  activePlan: Plan | null;
  loading: boolean;
  error: string | null;
  selectedPlanId: string;
  onSelect: (planId: string) => void;
  onBack: () => void;
  onCheckout: () => void;
  onOpenChat: () => void;
}

export function PlanScreen({
  itinerary,
  recommendation,
  activePlan,
  loading,
  error,
  selectedPlanId,
  onSelect,
  onBack,
  onCheckout,
  onOpenChat,
}: Props) {
  const isGroup = itinerary.travelers > 1;
  const order = activePlan ? orderSummary(activePlan, itinerary.travelers) : null;

  return (
    <>
      <NavBar title="上網方案" onBack={onBack} />
      <div className="plan-screen">
        {loading && <StepLoader />}
        {error && !loading && <div className="error">出錯了：{error}</div>}
        {recommendation && !loading && (
          <>
            <UsageEstimate recommendation={recommendation} perPerson={isGroup} />
            <PlanOptions
              plans={recommendation.plans}
              recommendedId={recommendation.recommendedPlanId}
              selectedId={selectedPlanId}
              estimatedDataGB={recommendation.estimatedDataGB}
              days={itinerary.days}
              perPerson={isGroup}
              onSelect={onSelect}
            />
            <button className="ask-ai" onClick={onOpenChat}>
              <span className="ask-ai-ic">💬</span>
              有疑問？問 AI 上網管家（相容性 / 開通 / 退費）
            </button>
          </>
        )}
      </div>

      {order && !loading && (
        <div className="cta-bar">
          <div className="cta-bar-info">
            <span className="cta-bar-label">
              {isGroup ? `${order.travelers} 人合計` : "合計"}
            </span>
            <span className="cta-bar-total">NT${order.total.toLocaleString()}</span>
          </div>
          <button className="cta-btn" onClick={onCheckout}>
            {isGroup ? `幫全團配好 →` : "下一步 →"}
          </button>
        </div>
      )}
    </>
  );
}
