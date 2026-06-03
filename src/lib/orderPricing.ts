import { SINGLE_ITEMS } from '../data/menuPresentation';
import type { ServiceType } from '../types';

/** $15 per head — meat, tortillas, and salsas baseline (planning only). */
export const BASE_RATE_PER_GUEST = 15;

/** ± band shown in planning range (e.g. $195 → $170–$220). */
export const INVESTMENT_RANGE_PADDING = 25;

/** Optional planning placeholder for delivery — confirmed after distance review. */
export const DELIVERY_PLANNING_FEE = 30;

export interface PricingTier {
  guests: number;
  price: number;
}

export interface EstimatorAddOnDef {
  id: string;
  name: string;
  perGuest?: number;
  flat?: number;
}

/** Instant-quote extras — per-guest and flat fees. */
export const ESTIMATOR_ADD_ON_CATALOG: EstimatorAddOnDef[] = [
  { id: 'chips_salsa', name: 'Chips & salsa', perGuest: 1.25 },
  { id: 'dessert', name: 'Dessert', perGuest: 2.5 },
  { id: 'drinks', name: 'Drinks', perGuest: 2.0 },
  { id: 'setup', name: 'Setup', flat: 35 },
];

/** Round to whole dollars for catering estimates (avoids float drift). */
export function roundDollars(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.max(0, Math.round(amount));
}

export function calculateInvestmentRangeFromMidpoint(midpoint: number) {
  const m = roundDollars(midpoint);
  return {
    low: Math.max(0, m - INVESTMENT_RANGE_PADDING),
    high: m + INVESTMENT_RANGE_PADDING,
    midpoint: m,
  };
}

/**
 * Sum side-item line totals: Σ (quantity × unitPrice).
 * Example: (1×4) + (4×4) + (5×5) = 45
 */
export function calculateSidesTotal(itemCounts: Record<string, number>): number {
  const total = SINGLE_ITEMS.reduce((sum, item) => {
    const qty = itemCounts[item.id] ?? 0;
    if (qty <= 0) return sum;
    return sum + qty * item.unitPrice;
  }, 0);
  return roundDollars(total);
}

/** Menu builder: guests × $15 + side items (planning midpoint, no delivery). */
export function calculateFinalMidpointTotal(
  guestCount: number,
  itemCounts: Record<string, number>
): number {
  const foodBaseline = roundDollars(guestCount * BASE_RATE_PER_GUEST);
  const sidesTotal = calculateSidesTotal(itemCounts);
  return roundDollars(foodBaseline + sidesTotal);
}

export function calculateMenuOrderPricing(
  guestCount: number,
  itemCounts: Record<string, number>,
  serviceType: ServiceType
) {
  const foodBaseline = roundDollars(guestCount * BASE_RATE_PER_GUEST);
  const sidesTotal = calculateSidesTotal(itemCounts);
  const finalMidpointTotal = roundDollars(foodBaseline + sidesTotal);
  const range = calculateInvestmentRangeFromMidpoint(finalMidpointTotal);
  const deliveryPlanning = serviceType === 'delivery' ? DELIVERY_PLANNING_FEE : 0;

  return {
    foodBaseline,
    sidesTotal,
    finalMidpointTotal,
    range,
    /** Stored on orders — food + sides only (no delivery). */
    estimatedTotal: finalMidpointTotal,
    deliveryPlanning,
    perGuestMidpoint:
      guestCount > 0 ? roundDollars(finalMidpointTotal / guestCount) : 0,
  };
}

export function calculateEstimatorExtrasTotal(
  guestCount: number,
  selected: Record<string, boolean>,
  catalog: EstimatorAddOnDef[] = ESTIMATOR_ADD_ON_CATALOG
): number {
  const total = catalog.reduce((sum, item) => {
    if (!selected[item.id]) return sum;
    if (item.perGuest != null) return sum + item.perGuest * guestCount;
    if (item.flat != null) return sum + item.flat;
    return sum;
  }, 0);
  return roundDollars(total);
}

/**
 * Tiered flyer pricing: exact tier → use price; below min tier → min tier;
 * between tiers → next tier up; above max tier → extrapolate $/guest from top tier.
 */
export function resolveTierFoodTotal(
  tiers: PricingTier[],
  guestCount: number
): { foodTotal: number; tierLabel: string; effectivePerGuest: number } {
  const sorted = [...tiers].sort((a, b) => a.guests - b.guests);
  if (sorted.length === 0) {
    return {
      foodTotal: roundDollars(BASE_RATE_PER_GUEST * guestCount),
      tierLabel: 'Standard rate',
      effectivePerGuest: BASE_RATE_PER_GUEST,
    };
  }

  const exact = sorted.find(t => t.guests === guestCount);
  if (exact) {
    return {
      foodTotal: roundDollars(exact.price),
      tierLabel: `${exact.guests} guests tier`,
      effectivePerGuest: roundDollars(exact.price / guestCount),
    };
  }

  const minTier = sorted[0];
  if (guestCount < minTier.guests) {
    return {
      foodTotal: roundDollars(minTier.price),
      tierLabel: `Minimum ${minTier.guests}-guest tier`,
      effectivePerGuest: roundDollars(minTier.price / guestCount),
    };
  }

  const nextTier = sorted.find(t => t.guests > guestCount);
  if (nextTier) {
    return {
      foodTotal: roundDollars(nextTier.price),
      tierLabel: `${nextTier.guests}-guest tier (rounded up)`,
      effectivePerGuest: roundDollars(nextTier.price / guestCount),
    };
  }

  const top = sorted[sorted.length - 1];
  const perGuest = top.price / top.guests;
  const foodTotal = roundDollars(perGuest * guestCount);
  return {
    foodTotal,
    tierLabel: `Scaled above ${top.guests} guests`,
    effectivePerGuest: roundDollars(perGuest),
  };
}

export function calculateInstantQuoteFoodTotal(
  guestCount: number,
  pkg: {
    pricePerGuest: number;
    startingAt?: number;
    pricingTiers?: PricingTier[];
  }
): { foodTotal: number; tierLabel: string; effectivePerGuest: number } {
  if (pkg.pricingTiers?.length) {
    return resolveTierFoodTotal(pkg.pricingTiers, guestCount);
  }

  if (pkg.pricePerGuest > 0) {
    const foodTotal = roundDollars(pkg.pricePerGuest * guestCount);
    return {
      foodTotal,
      tierLabel: `$${pkg.pricePerGuest}/guest menu`,
      effectivePerGuest: pkg.pricePerGuest,
    };
  }

  const rate =
    pkg.startingAt != null && pkg.startingAt > 0 ? pkg.startingAt : BASE_RATE_PER_GUEST;
  const foodTotal = roundDollars(rate * guestCount);
  return {
    foodTotal,
    tierLabel: rate === BASE_RATE_PER_GUEST ? 'Standard bar ($15/guest)' : `$${rate}/guest`,
    effectivePerGuest: rate,
  };
}

export function calculateInstantQuotePricing(
  guestCount: number,
  serviceType: ServiceType,
  addOns: Record<string, boolean>,
  pkg: {
    pricePerGuest: number;
    startingAt?: number;
    pricingTiers?: PricingTier[];
  },
  catalog: EstimatorAddOnDef[] = ESTIMATOR_ADD_ON_CATALOG
) {
  const food = calculateInstantQuoteFoodTotal(guestCount, pkg);
  const extrasTotal = calculateEstimatorExtrasTotal(guestCount, addOns, catalog);
  const planningMidpoint = roundDollars(food.foodTotal + extrasTotal);
  const deliveryFee = serviceType === 'delivery' ? DELIVERY_PLANNING_FEE : 0;
  const range = calculateInvestmentRangeFromMidpoint(planningMidpoint);

  return {
    ...food,
    extrasTotal,
    planningMidpoint,
    deliveryFee,
    /** Shown in breakdown only — not added to planning midpoint / orders. */
    displayTotalWithDelivery: roundDollars(planningMidpoint + deliveryFee),
    range,
    perGuestWithExtras:
      guestCount > 0 ? roundDollars(planningMidpoint / guestCount) : 0,
  };
}
