import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { useDemoToast } from "../lib/useDemoToast";

interface Check {
  id: string;
  title: string;
  hint: string; // AI 第一輪排錯：找不到時給的具體位置
}

// 以 iPhone 為例的開通檢查（示意）。AI 只做第一輪排錯，排除不了就轉真人。
const CHECKS: Check[] = [
  {
    id: "installed",
    title: "在 Wi-Fi 下掃 QR Code，裝好 eSIM",
    hint: "設定 → 行動服務 → 加入 eSIM → 使用 QR Code。安裝要連網，所以請在出發前用 Wi-Fi 裝。",
  },
  {
    id: "data-line",
    title: "把這張 eSIM 設為「行動數據」線路",
    hint: "設定 → 行動服務 → 行動數據 → 選剛裝好的「去趣 eSIM」。台灣門號仍可收簡訊。",
  },
  {
    id: "roaming",
    title: "打開這張 eSIM 的「數據漫遊」",
    hint: "設定 → 行動服務 → 點「去趣 eSIM」→ 打開數據漫遊。這張卡本來就是當地方案，不會多收費。",
  },
  {
    id: "home-roaming",
    title: "關掉台灣門號的數據漫遊",
    hint: "設定 → 行動服務 → 點台灣門號 → 關閉數據漫遊，避免被電信收漫遊費。",
  },
];

type CheckState = "todo" | "done" | "help";

interface Props {
  device: string;
  onBack: () => void;
}

export function ActivationScreen({ device, onBack }: Props) {
  const toast = useDemoToast();
  const [states, setStates] = useState<Record<string, CheckState>>({});
  const doneCount = CHECKS.filter((c) => states[c.id] === "done").length;
  const isAllDone = doneCount === CHECKS.length;

  function mark(id: string, state: CheckState) {
    setStates((prev) => ({ ...prev, [id]: state }));
  }

  return (
    <>
      <NavBar title="開通檢查" onBack={onBack} />
      <div className="activation">
        <div className="activation-head">
          <b>出發前花 1 分鐘，確認落地就能上網</b>
          <small>
            ✓ 你的 {device} 支援 eSIM・已完成 {doneCount} / {CHECKS.length}
          </small>
        </div>

        {CHECKS.map((c, i) => {
          const state = states[c.id] ?? "todo";
          return (
            <div className={`check-row ${state}`} key={c.id}>
              <div className="check-top">
                <span className="check-no">{state === "done" ? "✓" : i + 1}</span>
                <span className="check-title">{c.title}</span>
              </div>
              {state === "help" && <p className="check-hint">🤖 {c.hint}</p>}
              {state !== "done" && (
                <div className="check-actions">
                  <button className="check-btn primary" onClick={() => mark(c.id, "done")}>
                    完成了
                  </button>
                  {state === "todo" ? (
                    <button className="check-btn" onClick={() => mark(c.id, "help")}>
                      找不到
                    </button>
                  ) : (
                    <button
                      className="check-btn"
                      onClick={() => toast.show("已轉接繁中真人客服，約 2 分鐘回覆（示意）")}
                    >
                      還是不行，轉真人
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isAllDone && (
          <div className="activation-done">✓ 都設定好了，落地打開行動數據就能上網</div>
        )}

        <button
          className="human-link"
          onClick={() => toast.show("已轉接繁中真人客服，約 2 分鐘回覆（示意）")}
        >
          不想自己查？直接找真人客服
        </button>
      </div>
      {toast.message && <div className="toast">{toast.message}</div>}
    </>
  );
}
