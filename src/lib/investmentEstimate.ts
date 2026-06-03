import { calculateInvestmentRangeFromMidpoint } from './orderPricing';

/** Planning midpoint only — never a locked checkout price. */
export interface InvestmentRange {
  low: number;
  high: number;
  midpoint: number;
}

/** Same ±$25 band as menu builder (e.g. midpoint $195 → $170–$220). */
export function getInvestmentRange(midpoint: number): InvestmentRange | null {
  if (!midpoint || midpoint <= 0) return null;
  return calculateInvestmentRangeFromMidpoint(midpoint);
}

export const INVESTMENT_DISCLAIMER =
  'This is an Estimated Investment Indicator for planning—not a final invoice. Your Foodie Lab coordinator will confirm price after reviewing delivery distance, event date (weekend vs. weekday), current ingredient costs, and any custom setup needs.';

export const INVESTMENT_VOLATILITY_FACTORS = [
  'Delivery distance & drive time',
  'Weekend vs. weekday availability',
  'Market cost of proteins & seasonal ingredients',
  'Custom staging, staffing, or add-on trays',
] as const;
