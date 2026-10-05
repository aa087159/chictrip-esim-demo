import { NavBar } from "../components/NavBar";
import { SUBSCRIPTION_MONTHLY_TWD, orderSummary } from "../lib/order";
import type { Itinerary, Plan } from "../lib/api";

interface Props {
  plan: Plan;
  itinerary: Itinerary;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function CheckoutScreen({ plan, itinerary, isSubscribed, onSubscribe, onBack, onConfirm }: Props) {
  const { travelers, companions } = itinerary;
  const order = orderSummary(plan, travelers, isSubscribed);

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
              <span>−NT${order.groupDiscount.toLocaleString()}</span>
            </div>
          )}
          {isSubscribed && (
            <div className="sum-row member">
              <span>訂閱會員 9 折</span>
              <span>−NT${order.memberDiscount.toLocaleString()}</span>
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

        {!isSubscribed && (
          <div className="sub-upsell">
            <div>
              訂閱去趣會員，這單再省 <b>NT${order.memberSaving.toLocaleString()}</b>
            </div>
            <small>NT${SUBSCRIPTION_MONTHLY_TWD} / 月，之後每趟 eSIM 都 9 折</small>
            <button className="sub-btn" onClick={onSubscribe}>
              加入訂閱
            </button>
          </div>
        )}

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
