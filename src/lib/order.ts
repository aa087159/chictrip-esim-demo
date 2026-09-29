import type { Plan } from "./api";

// 2 人以上團體購折扣（去趣獨有的共編行程 → 一趟多賣幾張的誘因）。
export const GROUP_DISCOUNT_RATE = 0.1;

export interface OrderSummary {
  travelers: number;
  isGroup: boolean;
  unit: number;
  subtotal: number;
  discount: number;
  total: number;
  points: number;
}

export function orderSummary(plan: Plan, travelers: number): OrderSummary {
  const isGroup = travelers > 1;
  const unit = plan.priceTWD;
  const subtotal = unit * travelers;
  const discount = isGroup ? Math.round(subtotal * GROUP_DISCOUNT_RATE) : 0;
  const total = subtotal - discount;
  const points = Math.round((unit * plan.pointsPct) / 100) * travelers;
  return { travelers, isGroup, unit, subtotal, discount, total, points };
}
