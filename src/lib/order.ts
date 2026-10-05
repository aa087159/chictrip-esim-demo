import type { Plan } from "./api";

// 2 人以上團體購折扣（去趣獨有的共編行程 → 一趟多賣幾張的誘因）。
export const GROUP_DISCOUNT_RATE = 0.1;

// 訂閱會員：整筆訂單（含同行旅伴）再打 9 折，疊加在團體折扣之後。權益第一版只含 eSIM 9 折。
export const SUBSCRIPTION_DISCOUNT_RATE = 0.1;
export const SUBSCRIPTION_MONTHLY_TWD = 49;

export interface OrderSummary {
  travelers: number;
  isGroup: boolean;
  unit: number;
  subtotal: number;
  groupDiscount: number;
  /** 訂閱折扣；未訂閱時為 0。 */
  memberDiscount: number;
  /** 這筆訂單若有訂閱可再省的金額，用來提示未訂閱的使用者。 */
  memberSaving: number;
  total: number;
  points: number;
}

export function orderSummary(plan: Plan, travelers: number, isSubscribed: boolean): OrderSummary {
  const isGroup = travelers > 1;
  const unit = plan.priceTWD;
  const subtotal = unit * travelers;
  const groupDiscount = isGroup ? Math.round(subtotal * GROUP_DISCOUNT_RATE) : 0;
  const afterGroup = subtotal - groupDiscount;
  const memberSaving = Math.round(afterGroup * SUBSCRIPTION_DISCOUNT_RATE);
  const memberDiscount = isSubscribed ? memberSaving : 0;
  const total = afterGroup - memberDiscount;
  const points = Math.round((unit * plan.pointsPct) / 100) * travelers;
  return { travelers, isGroup, unit, subtotal, groupDiscount, memberDiscount, memberSaving, total, points };
}
