import { TODAY_USAGE, formatGB } from "../data/usage";

interface Props {
  onTopUp: () => void;
}

// 旅中今日流量小儀表：剩餘量對比今天行程預估要用的量。
export function UsageGauge({ onTopUp }: Props) {
  const { day, estimatedGB, remainingGB } = TODAY_USAGE;
  const coverage = Math.min(remainingGB / estimatedGB, 1);
  const isShort = remainingGB < estimatedGB;

  return (
    <div className="usage-gauge">
      <div className="usage-gauge-top">
        <span className="usage-gauge-title">📊 今日流量・{day}</span>
        <button className="usage-gauge-btn" onClick={onTopUp}>
          加購
        </button>
      </div>
      <div className="usage-gauge-bar">
        <i className={isShort ? "short" : ""} style={{ width: `${coverage * 100}%` }} />
      </div>
      <div className="usage-gauge-meta">
        今天預估用 {formatGB(estimatedGB)}，剩 {formatGB(remainingGB)}
        {isShort && "，可能不夠用"}
      </div>
    </div>
  );
}
