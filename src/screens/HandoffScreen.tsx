import { NavBar } from "../components/NavBar";
import type { Plan } from "../lib/api";

export interface HandoffItem {
  memberId: string;
  who: string;
  plan: Plan;
}

interface Props {
  title: string;
  items: HandoffItem[];
  onBack: () => void;
  onDone: () => void;
}

// 購買只做入口與跳轉（不指定在 App 或官網結帳）。這頁示意「帶著選好的方案跳到購買頁」，
// 購買頁本身不在 Demo 範圍，按下按鈕就當作買完回到 App。
export function HandoffScreen({ title, items, onBack, onDone }: Props) {
  const total = items.reduce((sum, i) => sum + i.plan.priceTWD, 0);

  return (
    <>
      <NavBar title={title} onBack={onBack} />
      <div className="handoff">
        <div className="handoff-hero">
          <span className="handoff-spinner" aria-hidden />
          <b>正在前往去趣 eSIM 購買頁…</b>
          <small>方案已幫你帶入，不用重新選</small>
        </div>

        <div className="cart">
          {items.map((i) => (
            <div className="cart-row" key={i.memberId}>
              <span className="cart-who">{i.who}</span>
              <span className="cart-what">{i.plan.name}</span>
              <span className="cart-amt">{i.plan.priceTWD.toLocaleString()}</span>
            </div>
          ))}
          <div className="cart-row cart-total">
            <span className="cart-who">原價合計</span>
            <span className="cart-what" />
            <span className="cart-amt">NT${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="handoff-note">
          團體優惠、和泰 Points 折抵與付款，都在購買頁結算。
          <br />
          購買頁不在這個 Demo 範圍。
        </div>
      </div>

      <div className="cta-bar">
        <button className="cta-btn" onClick={onDone}>
          模擬完成購買，回到 App
        </button>
      </div>
    </>
  );
}
