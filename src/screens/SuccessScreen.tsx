import { NavBar } from "../components/NavBar";

interface Props {
  travelers: number;
  companions?: string[];
  planName: string;
  onDone: () => void;
}

export function SuccessScreen({ travelers, companions, planName, onDone }: Props) {
  const isGroup = travelers > 1;
  return (
    <>
      <NavBar title="開通完成" />
      <div className="success">
        <div className="success-check">✓</div>
        <div className="success-title">
          {isGroup ? `已幫 ${travelers} 人開通` : "已開通"}
        </div>
        <div className="success-plan">{planName}</div>

        <div className="success-qr" aria-hidden="true">
          <div className="qr-grid" />
        </div>
        <div className="success-hint">
          eSIM QR Code 已寄到你的信箱與 App。
          <br />
          落地打開行動數據即可上網，不用換卡。
        </div>

        {isGroup && companions && companions.length > 0 && (
          <div className="success-shared">
            已同步分享給 {companions.join("、")} 的 App
          </div>
        )}

        <button className="cta-btn" onClick={onDone}>
          回到行程
        </button>
      </div>
    </>
  );
}
