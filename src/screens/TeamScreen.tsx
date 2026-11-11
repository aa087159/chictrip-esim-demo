import { NavBar } from "../components/NavBar";
import { FakeQrCode } from "../components/FakeQrCode";
import { useDemoToast } from "../lib/useDemoToast";
import type { DemoPhase } from "../data/demo-phase";
import type { Member, Plan } from "../lib/api";

type InstallStatus = "pending" | "installed" | "active";

const STATUS_LABEL: Record<InstallStatus, string> = {
  pending: "待安裝",
  installed: "已安裝",
  active: "已開通",
};

// 示意：主揪在不同時間點看到的旅伴安裝進度（媽媽一直到出發前一晚都還沒裝）。
const INSTALLED_BY_PHASE: Record<DemoPhase, string[]> = {
  planned: [],
  d7: ["mei", "zhe"],
  d1: ["me", "mei", "zhe"],
  traveling: [],
  returned: [],
};

function statusOf(memberId: string, phase: DemoPhase): InstallStatus {
  if (phase === "traveling" || phase === "returned") return "active";
  return INSTALLED_BY_PHASE[phase].includes(memberId) ? "installed" : "pending";
}

export interface TeamCard {
  member: Member;
  plan: Plan;
  reason: string;
  addOn?: Plan;
}

interface Props {
  cards: TeamCard[];
  phase: DemoPhase;
  onOpenActivation: () => void;
  onBack: () => void;
}

// Demo 第 4 步：買完回到 App，全團每個人各有自己的卡、一句理由、QR Code，主揪看得到每人的進度。
export function TeamScreen({ cards, phase, onOpenActivation, onBack }: Props) {
  const toast = useDemoToast();
  const readyCount = cards.filter((c) => statusOf(c.member.id, phase) !== "pending").length;

  function action(card: TeamCard, status: InstallStatus) {
    const { member } = card;
    if (member.isOrganizer) {
      if (status === "pending") toast.show("已在這支手機開始安裝（示意）");
      else onOpenActivation();
      return;
    }
    if (status !== "pending") return;
    if (member.style === "light") toast.show(`已用 LINE 傳圖文安裝教學給${member.name}（示意）`);
    else toast.show(`已用 LINE 把 QR Code 分享給${member.name}（示意）`);
  }

  function actionLabel(card: TeamCard, status: InstallStatus): string | null {
    if (card.member.isOrganizer) return status === "pending" ? "安裝到這支手機" : "開通檢查";
    if (status !== "pending") return null;
    return card.member.style === "light" ? "傳圖文教學" : "LINE 分享";
  }

  return (
    <>
      <NavBar title="全團網卡" onBack={onBack} />
      <div className="team">
        <div className="team-head">
          <b>{cards.length} 張 eSIM 都買好了</b>
          <small>
            {readyCount} / {cards.length} 人已安裝・每張 QR Code 只能裝在一支手機
          </small>
        </div>

        {cards.map((card) => {
          const status = statusOf(card.member.id, phase);
          const label = actionLabel(card, status);
          return (
            <div className="team-card" key={card.member.id}>
              <div className="team-card-top">
                <span className="member-avatar">{card.member.name.slice(0, 1)}</span>
                <span className="team-card-who">
                  <b>{card.member.name}</b>
                  <small>{card.member.device}</small>
                </span>
                <span className={`install-pill ${status}`}>{STATUS_LABEL[status]}</span>
              </div>
              <div className="team-card-body">
                <FakeQrCode className="mini-qr" seed={`${card.member.id}:${card.plan.id}`} size={64} />
                <span className="team-card-plan">
                  <b>{card.plan.name}</b>
                  {card.addOn && <span className="addon-tag">＋ {card.addOn.name}</span>}
                  <small>{card.reason}</small>
                </span>
              </div>
              {label && (
                <button className="team-card-btn" onClick={() => action(card, status)}>
                  {label}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {toast.message && <div className="toast">{toast.message}</div>}
    </>
  );
}
