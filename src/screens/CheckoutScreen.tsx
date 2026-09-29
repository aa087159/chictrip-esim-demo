import { NavBar } from "../components/NavBar";
import { orderSummary } from "../lib/order";
import type { Itinerary, Plan } from "../lib/api";

interface Props {
  plan: Plan;
  itinerary: Itinerary;
  onBack: () => void;
  onConfirm: () => void;
}

export function CheckoutScreen({ plan, itinerary, onBack, onConfirm }: Props) {
  const { travelers, companions } = itinerary;
  const order = orderSummary(plan, travelers);

  const names = ["你", ...(companions ?? [])];
  const people = Array.from(
    { length: travelers },
    (_, i) => names[i] ?? `旅客 ${i + 1}`,
  );

  return (
    <>
      <NavBar title="結帳" onBack={onBack} />
      <div className="checkout-screen">
        <div className="checkout-head">
          {order.isGroup ? (
            <>
              這趟 <b>{travelers} 人同行</b>，一次幫全團配好
            </>
          ) : (
            <>幫你配好這趟的 eSIM</>
          )}
        </div>

        <div className="cart">
          {people.map((name, i) => (
            <div className="cart-row" key={i}>
              <span className="cart-who">{name}</span>
              <span className="cart-what">{plan.name}</span>
              <span className="cart-amt">{order.unit.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="sum">
          <div className="sum-row">
            <span>小計</span>
            <span>NT${order.subtotal.toLocaleString()}</span>
          </div>
          {order.isGroup && (
            <div className="sum-row disc">
              <span>團體 9 折</span>
              <span>−NT${order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="sum-row pts">
            <span>和泰 Points 回饋</span>
            <span>+{order.points}</span>
          </div>
          <div className="sum-row total">
            <span>總計</span>
            <span>
              <b>NT${order.total.toLocaleString()}</b>
            </span>
          </div>
        </div>

        {!order.isGroup && (
          <div className="nudge">👥 揪朋友一起買，團體 9 折再省更多</div>
        )}

        <div className="pay-with">
          <span className="pay-dot" />
          和泰 Pay · 一鍵付款
        </div>
      </div>

      <div className="cta-bar">
        <div className="cta-bar-info">
          <span className="cta-bar-label">應付</span>
          <span className="cta-bar-total">NT${order.total.toLocaleString()}</span>
        </div>
        <button className="cta-btn" onClick={onConfirm}>
          {order.isGroup ? `確認付款・${travelers} 人` : "確認付款"}
        </button>
      </div>
    </>
  );
}
