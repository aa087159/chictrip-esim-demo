import type { Itinerary } from "../lib/api";
import { flagOf } from "../lib/format";

interface Props {
  itinerary: Itinerary;
  // 已配好的方案名稱；null 表示還沒產生「上網」章節。
  networkPlanName: string | null;
  // 行程定案前不提供上網推薦入口，只顯示「行程確定」。
  isConfirmed: boolean;
  onConfirm: () => void;
  onOpenNetwork: () => void;
  // 已購買且 Demo 時間在旅中，才顯示旅中的加買入口。
  isTraveling: boolean;
  onOpenTopUp: () => void;
}

export function TripScreen({
  itinerary,
  networkPlanName,
  isConfirmed,
  onConfirm,
  onOpenNetwork,
  isTraveling,
  onOpenTopUp,
}: Props) {
  const { destination, countryCode, days, travelers, dateRange, companions, dayPlan } =
    itinerary;
  const isGroup = travelers > 1;
  const coverMeta = [
    dateRange,
    companions?.length ? `與 ${companions.join("、")} 共編` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="trip-screen">
      <div className="trip-cover">
        <span className="trip-cover-flag">{flagOf(countryCode)}</span>
        <div className="trip-cover-info">
          <div className="trip-cover-title">
            {destination} {days} 天{isGroup ? `・${travelers} 人` : ""}
          </div>
          {coverMeta && <div className="trip-cover-meta">{coverMeta}</div>}
        </div>
      </div>

      {dayPlan && dayPlan.length > 0 && (
        <div className="trip-section">
          <div className="trip-section-h">每日行程</div>
          <div className="day-list">
            {dayPlan.map((d) => (
              <div className="day" key={d.day}>
                <span className="day-tag">{d.day}</span>
                <span className="day-spots">{d.spots}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="trip-section">
        <div className="trip-section-h">行前準備</div>
        <div className="sec-list">
          <div className="sec-row">
            <span className="sec-ic">🚄</span>
            <span className="sec-label">交通</span>
            <span className="sec-status done">已規劃</span>
          </div>
          <div className="sec-row">
            <span className="sec-ic">🏨</span>
            <span className="sec-label">住宿</span>
            <span className="sec-status done">已預訂</span>
          </div>
          <div className="sec-row">
            <span className="sec-ic">💰</span>
            <span className="sec-label">花費</span>
            <span className="sec-status done">已估算</span>
          </div>
          {isConfirmed ? (
            <button
              className={`sec-row net${networkPlanName ? " ready" : " cta"}`}
              onClick={onOpenNetwork}
            >
              <span className="sec-ic">📶</span>
              <span className="sec-label">
                上網
                <small>
                  {networkPlanName ? `已配好・${networkPlanName}` : "AI 幫你配這趟的 eSIM"}
                </small>
              </span>
              <span className="sec-go">{networkPlanName ? "✓" : "→"}</span>
            </button>
          ) : (
            <button className="sec-row net cta" onClick={onConfirm}>
              <span className="sec-ic">✅</span>
              <span className="sec-label">
                行程確定
                <small>確定後 AI 幫你配這趟的 eSIM</small>
              </span>
              <span className="sec-go">→</span>
            </button>
          )}
        </div>
      </div>

      {isTraveling && (
        <div className="trip-section">
          <div className="trip-section-h">旅途中</div>
          <button className="alert-card" onClick={onOpenTopUp}>
            <span className="alert-ic">🗓️</span>
            <span className="alert-body">
              <span className="alert-title">行程有變動？</span>
              <span className="alert-sub">AI 依新的行程，幫你看全團的網卡還夠不夠</span>
            </span>
            <span className="alert-go">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
