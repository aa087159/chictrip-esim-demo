import { NavBar } from "../components/NavBar";
import { StepLoader } from "../components/StepLoader";
import { UsageEstimate } from "../components/UsageEstimate";
import { MemberPlanCard } from "../components/MemberPlanCard";
import type { Itinerary, Plan, Recommendation } from "../lib/api";
import { flagOf } from "../lib/format";

interface Props {
  itinerary: Itinerary;
  recommendation: Recommendation | null;
  loading: boolean;
  error: string | null;
  // 每位旅伴目前選的方案（預設是 AI 推薦，可以換）。
  selectedPlans: Record<string, Plan>;
  onSelect: (memberId: string, planId: string) => void;
  onBack: () => void;
  onGoBuy: () => void;
  onOpenChat: () => void;
}

// 「現在買的理由」三點，文字依簡報 V5 第 17 頁；效期規則出自去趣官網 eSIM 常見問題。
const BUY_NOW_REASONS = [
  {
    title: "提早買不浪費",
    body: "收到 QR Code 後 180 天內到當地安裝啟用即可（原生卡是 30 天內），連上網才開始算天數",
  },
  { title: "提早確認手機能用", body: "先裝好、先檢查，出發不慌" },
  { title: "出發前一天提醒你", body: "去趣知道你哪天出發，前一天提醒「今天可以安裝了」" },
] as const;

export function PlanScreen({
  itinerary,
  recommendation,
  loading,
  error,
  selectedPlans,
  onSelect,
  onBack,
  onGoBuy,
  onOpenChat,
}: Props) {
  const total = Object.values(selectedPlans).reduce((sum, p) => sum + p.priceTWD, 0);
  const count = Object.keys(selectedPlans).length;
  const isReady = recommendation !== null && !loading;

  return (
    <>
      <NavBar title="這趟的網路" onBack={onBack} />
      <div className="plan-screen">
        {loading && <StepLoader />}
        {error && !loading && <div className="error">出錯了：{error}</div>}
        {isReady && recommendation && (
          <>
            <div className="plan-trip">
              {flagOf(itinerary.countryCode)} {itinerary.destination} {itinerary.days} 天・
              {itinerary.travelers} 人
            </div>
            <UsageEstimate recommendation={recommendation} />
            <div className="plan-list-head">每個人各配一張</div>
            {itinerary.members.map((m) => {
              const pick = recommendation.members.find((p) => p.memberId === m.id);
              if (!pick) return null;
              return (
                <MemberPlanCard
                  key={m.id}
                  member={m}
                  plan={selectedPlans[m.id] ?? null}
                  recommendedPlanId={pick.planId}
                  estimatedDataGB={pick.estimatedDataGB}
                  reason={pick.reason}
                  plans={recommendation.plans}
                  days={itinerary.days}
                  onSelect={(planId) => onSelect(m.id, planId)}
                />
              );
            })}
            <div className="buy-now">
              <div className="buy-now-head">為什麼現在就可以買</div>
              <ul>
                {BUY_NOW_REASONS.map((r) => (
                  <li key={r.title}>
                    <b>{r.title}</b>
                    <span>{r.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className="ask-ai" onClick={onOpenChat}>
              <span className="ask-ai-ic">💬</span>
              有疑問？問 AI 上網管家（相容性 / 開通）
            </button>
          </>
        )}
      </div>

      {isReady && count > 0 && (
        <div className="cta-bar">
          <div className="cta-bar-info">
            <span className="cta-bar-label">{count} 張・原價合計</span>
            <span className="cta-bar-total">NT${total.toLocaleString()}</span>
          </div>
          <button className="cta-btn" onClick={onGoBuy}>
            去購買 ›
          </button>
        </div>
      )}
    </>
  );
}
