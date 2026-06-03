/**
 * Run: npx tsx src/lib/orderPricing.test.ts
 */
import assert from 'node:assert/strict';
import {
  BASE_RATE_PER_GUEST,
  calculateFinalMidpointTotal,
  calculateInstantQuotePricing,
  calculateMenuOrderPricing,
  calculateSidesTotal,
  resolveTierFoodTotal,
} from './orderPricing';

// Menu: 10 guests × $15 + sides (1×4 + 4×4 + 5×5) = 150 + 45 = 195
const sides = { 'chips-salsa': 1, 'red-rice': 4, churros: 5 };
assert.equal(calculateSidesTotal(sides), 45);
assert.equal(calculateFinalMidpointTotal(10, sides), 195);
const menu = calculateMenuOrderPricing(10, sides, 'pickup');
assert.equal(menu.finalMidpointTotal, 195);
assert.equal(menu.range.low, 170);
assert.equal(menu.range.high, 220);

// Instant quote: 25 guests @ $15 + chips $1.25/guest
const quote = calculateInstantQuotePricing(
  25,
  'pickup',
  { chips_salsa: true, dessert: false, drinks: false, setup: false },
  { pricePerGuest: 0 }
);
assert.equal(quote.foodTotal, 375); // 25 × 15
assert.equal(quote.extrasTotal, 31); // round(1.25 × 25)
assert.equal(quote.planningMidpoint, 406);

// Tier: guest 25 between 20@300 and 30@395 → round up to 30 tier
const tier = resolveTierFoodTotal(
  [
    { guests: 20, price: 300 },
    { guests: 30, price: 395 },
  ],
  25
);
assert.equal(tier.foodTotal, 395);

// Per-guest menu: $12 × 30
const corp = calculateInstantQuotePricing(
  30,
  'delivery',
  {},
  { pricePerGuest: 12 }
);
assert.equal(corp.foodTotal, 360);
assert.equal(corp.deliveryFee, 30);
assert.equal(corp.planningMidpoint, 360); // delivery not in midpoint

console.log('orderPricing.test.ts: all assertions passed');
