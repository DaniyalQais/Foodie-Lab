import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Truck, Coffee, Users, Receipt, Check, ChevronDown, Plus } from 'lucide-react';
import { CateringPackage, ServiceType } from '../types';
import EstimatedInvestmentIndicator from './EstimatedInvestmentIndicator';
import {
  calculateInstantQuotePricing,
  DELIVERY_PLANNING_FEE,
  ESTIMATOR_ADD_ON_CATALOG,
  INVESTMENT_RANGE_PADDING,
  roundDollars,
} from '../lib/orderPricing';
import type { EstimatorAddOnId, QuoteContinueInput } from '../lib/quoteHandoff';
import AnimatedButton from './motion/AnimatedButton';

const GUEST_DEFAULT = 25;
const GUEST_MIN = 10;
const GUEST_MAX = 100;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function shortPackageName(name: string): string {
  return name.replace(/^Foodie Lab\s+/i, '').replace(/\s+Menu$/i, '');
}

interface PriceEstimatorProps {
  packages: CateringPackage[];
  onContinue: (draft: QuoteContinueInput) => void;
}

export default function PriceEstimator({ packages, onContinue }: PriceEstimatorProps) {
  const defaultPkg = packages.find(p => p.popular) ?? packages[0];
  const [packageId, setPackageId] = useState<string>(defaultPkg?.id ?? 'taco-bar');
  const [guestCount, setGuestCount] = useState<number>(GUEST_DEFAULT);
  const [showExtras, setShowExtras] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('delivery');
  const [addOns, setAddOns] = useState<Record<EstimatorAddOnId, boolean>>({
    chips_salsa: false,
    dessert: false,
    drinks: false,
    setup: false,
  });
  const [agreedEstimate, setAgreedEstimate] = useState(false);
  const [readyToBook, setReadyToBook] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const pkg = useMemo(() => packages.find(p => p.id === packageId) ?? packages[0], [packageId, packages]);

  const tiersInRange = useMemo(() => {
    if (!pkg.pricingTiers?.length) return [];
    return [...pkg.pricingTiers]
      .sort((a, b) => a.guests - b.guests)
      .filter(t => t.guests >= GUEST_MIN && t.guests <= GUEST_MAX);
  }, [pkg.pricingTiers]);

  const selectedExtrasCount = useMemo(
    () => Object.values(addOns).filter(Boolean).length,
    [addOns]
  );

  const clampGuests = (n: number) => clamp(n, GUEST_MIN, GUEST_MAX);

  const calc = useMemo(
    () =>
      calculateInstantQuotePricing(guestCount, serviceType, addOns, {
        pricePerGuest: pkg.pricePerGuest,
        startingAt: pkg.startingAt,
        pricingTiers: pkg.pricingTiers,
      }),
    [addOns, guestCount, pkg.pricePerGuest, pkg.pricingTiers, pkg.startingAt, serviceType]
  );

  const toggleAddOn = (id: EstimatorAddOnId, checked: boolean) => {
    setAddOns(prev => ({ ...prev, [id]: checked }));
  };

  const handleContinue = () => {
    setFormError(null);
    if (guestCount < GUEST_MIN || guestCount > GUEST_MAX) {
      setFormError(`Guest count must be between ${GUEST_MIN} and ${GUEST_MAX}.`);
      return;
    }
    if (!agreedEstimate) {
      setFormError('Please confirm you understand this is a planning estimate.');
      return;
    }
    if (!readyToBook) {
      setFormError('Please check that you are ready to continue to booking.');
      return;
    }

    onContinue({
      cateringPackageId: packageId,
      cateringPackageName: pkg.name,
      guestCount,
      serviceType,
      addOns: { ...addOns },
      estimatedMidpoint: calc.planningMidpoint,
    });
  };

  const canContinue =
    agreedEstimate && readyToBook && guestCount >= GUEST_MIN && guestCount <= GUEST_MAX;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm lg:rounded-[2rem] lg:border-terracotta-200/20 lg:shadow-none lg:premium-quote-shell">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(224,83,39,0.14),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(217,119,6,0.14),transparent_55%)] pointer-events-none lg:opacity-60" />
      <div className="hidden lg:block absolute top-0 inset-x-0 h-1 premium-quote-accent z-10 rounded-t-[2rem]" />

      <div className="relative p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start lg:p-8 lg:gap-8">
        <div className="lg:col-span-7 space-y-3 lg:space-y-5">
          <div className="flex items-center gap-2 lg:gap-3 lg:pb-1 lg:border-b lg:border-brand-100/80">
            <Sparkles className="w-4 h-4 text-terracotta-600 shrink-0 lg:hidden" />
            <span className="hidden lg:flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-500 to-brand-600 text-white shadow-lg shadow-terracotta-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <p className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta-600 mb-0.5">
                Smart estimator
              </p>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-gray-900 tracking-tight lg:text-2xl lg:tracking-tight">
                Instant quote
              </h3>
              <p className="hidden lg:block text-xs text-gray-500 mt-0.5">
                Configure your event — see your planning range live
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="space-y-1 lg:rounded-2xl lg:border lg:border-brand-100/80 lg:bg-white/50 lg:p-4 lg:shadow-sm">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider lg:text-[11px]">
                Menu
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] sm:max-h-[280px] overflow-y-auto pr-0.5 lg:max-h-[320px] lg:gap-2.5">
                {packages.map(p => {
                  const selected = p.id === packageId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPackageId(p.id);
                        setGuestCount(prev => clampGuests(prev));
                        setFormError(null);
                      }}
                      className={`text-left rounded-xl border transition-all px-2.5 py-2.5 min-h-[72px] flex flex-col cursor-pointer hover:border-brand-300 lg:min-h-[80px] lg:rounded-2xl lg:px-3 lg:py-3 lg:hover:shadow-md lg:hover:-translate-y-0.5 lg:duration-200 ${
                        selected
                          ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-1 ring-brand-200 lg:shadow-md lg:ring-2 lg:ring-brand-200/80'
                          : 'border-gray-200 bg-white lg:bg-white/90'
                      }`}
                    >
                      <span className="font-display font-bold text-[11px] sm:text-sm text-gray-900 leading-snug line-clamp-2">
                        {shortPackageName(p.name)}
                      </span>
                      <p className="text-[9px] text-gray-500 mt-0.5">{GUEST_MIN}–{GUEST_MAX} guests</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 lg:rounded-2xl lg:border lg:border-brand-100/80 lg:bg-white/50 lg:p-4 lg:shadow-sm lg:space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider lg:text-[11px]">
                  Guests
                </label>
                <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 lg:rounded-2xl lg:px-4 lg:py-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-500" />
                      {guestCount}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {GUEST_MIN}–{GUEST_MAX}
                    </span>
                  </div>
                  {tiersInRange.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {tiersInRange.map(t => (
                          <button
                            key={t.guests}
                            type="button"
                            onClick={() => setGuestCount(clampGuests(t.guests))}
                            className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-all cursor-pointer ${
                              guestCount === t.guests
                                ? 'border-brand-500 bg-brand-50/70 text-brand-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {t.guests} · ${t.price}
                          </button>
                        ))}
                      </div>
                      <input
                        type="range"
                        min={GUEST_MIN}
                        max={GUEST_MAX}
                        value={guestCount}
                        onChange={e =>
                          setGuestCount(clampGuests(parseInt(e.target.value, 10)))
                        }
                        className="w-full accent-terracotta-500"
                        aria-label="Guest count"
                      />
                    </div>
                  ) : (
                    <input
                      type="range"
                      min={GUEST_MIN}
                      max={GUEST_MAX}
                      value={guestCount}
                      onChange={e =>
                        setGuestCount(clampGuests(parseInt(e.target.value, 10)))
                      }
                      className="w-full mt-3 accent-terracotta-500"
                      aria-label="Guest count"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('pickup')}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      serviceType === 'pickup'
                        ? 'border-brand-500 bg-brand-50/60 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('delivery')}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      serviceType === 'delivery'
                        ? 'border-brand-500 bg-brand-50/60 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Delivery
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setShowExtras(v => !v)}
                  aria-expanded={showExtras}
                  className={`w-full flex items-center justify-between gap-2 rounded-2xl border-2 px-3 py-3 transition-all cursor-pointer text-left shadow-sm ${
                    showExtras
                      ? 'border-terracotta-500 bg-gradient-to-r from-terracotta-50 to-brand-50 ring-2 ring-terracotta-200/80'
                      : 'border-terracotta-300 bg-gradient-to-r from-amber-warm/80 to-brand-50/90 hover:border-terracotta-400 hover:shadow-md'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-terracotta-500 text-white shadow-sm">
                      <Plus className={`w-4 h-4 transition-transform ${showExtras ? 'rotate-45' : ''}`} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-wider text-terracotta-700">
                        Extras
                      </span>
                      <span className="block text-[10px] text-gray-600 font-medium">
                        {showExtras ? 'Tap to hide add-ons' : 'Optional — tap to add sides & more'}
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {selectedExtrasCount > 0 && (
                      <span className="text-[10px] font-bold text-white bg-terracotta-500 px-2 py-0.5 rounded-full">
                        {selectedExtrasCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 text-terracotta-600 transition-transform ${showExtras ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {showExtras && (
                  <ul className="space-y-1.5 pt-0.5">
                    {ESTIMATOR_ADD_ON_CATALOG.map(a => {
                      const id = a.id as EstimatorAddOnId;
                      const checked = addOns[id];
                      return (
                        <li key={a.id}>
                          <label
                            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all min-h-[44px] ${
                              checked
                                ? 'border-brand-500 bg-brand-50/70 ring-1 ring-brand-200'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e => toggleAddOn(id, e.target.checked)}
                              className="h-4 w-4 shrink-0 rounded border-gray-300 accent-terracotta-500 cursor-pointer"
                              aria-label={a.name}
                            />
                            <span className="flex-1 min-w-0">
                              <span className="block font-semibold text-[11px] sm:text-xs text-gray-900">
                                {a.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {a.perGuest != null
                                  ? `+$${a.perGuest}/guest × ${guestCount} = $${roundGuestLine(a.perGuest, guestCount)}`
                                  : a.flat != null
                                    ? `+$${a.flat} flat`
                                    : ''}
                              </span>
                            </span>
                            {checked && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <motion.div
            key={`${packageId}-${guestCount}-${serviceType}-${Object.values(addOns).join('')}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-3xl border border-brand-100 bg-gradient-to-b from-white to-brand-50/40 shadow-sm overflow-hidden lg:rounded-[1.5rem] lg:border-terracotta-100/40 lg:shadow-none lg:premium-quote-summary"
          >
            <div className="hidden lg:block px-5 pt-4 pb-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta-600">
                Your estimate
              </p>
            </div>
            <div className="p-4 sm:p-5 space-y-3 lg:p-6 lg:space-y-4">
              <EstimatedInvestmentIndicator
                midpoint={calc.planningMidpoint}
                guestCount={guestCount}
                compact
                showFactors={false}
              />

              <details className="rounded-xl border border-dashed border-gray-200 bg-white/80 group">
                <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-3 h-3" />
                  Breakdown
                </summary>
                <div className="px-3 pb-2 space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between gap-2">
                    <span className="text-left">
                      Food ({calc.tierLabel})
                    </span>
                    <span className="font-semibold text-gray-800 shrink-0">${calc.foodTotal}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[10px] text-gray-500 -mt-0.5">
                    <span>Effective food rate</span>
                    <span>~${calc.effectivePerGuest}/guest</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extras</span>
                    <span className="font-semibold text-gray-800">
                      {calc.extrasTotal > 0 ? `+$${calc.extrasTotal}` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100 font-semibold text-gray-800">
                    <span>Planning midpoint</span>
                    <span>${calc.planningMidpoint}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Range (±${INVESTMENT_RANGE_PADDING})</span>
                    <span>
                      ${calc.range.low}–${calc.range.high}
                    </span>
                  </div>
                  {serviceType === 'delivery' && (
                    <div className="flex justify-between text-gray-500 pt-1 border-t border-dashed border-gray-100">
                      <span>Delivery (estimate)</span>
                      <span className="font-semibold">+${DELIVERY_PLANNING_FEE}</span>
                    </div>
                  )}
                </div>
              </details>

              <div className="space-y-2 rounded-xl border border-brand-100 bg-brand-50/40 p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedEstimate}
                    onChange={e => {
                      setAgreedEstimate(e.target.checked);
                      setFormError(null);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded accent-terracotta-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-700 leading-snug text-left">
                    I understand this is a <strong>planning estimate</strong>, not final pricing or a
                    checkout.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readyToBook}
                    onChange={e => {
                      setReadyToBook(e.target.checked);
                      setFormError(null);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded accent-terracotta-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-700 leading-snug text-left">
                    I&apos;m ready to continue — take me to <strong>contact &amp; delivery</strong> with
                    these selections.
                  </span>
                </label>
              </div>

              {formError && (
                <p className="text-[11px] text-red-600 font-medium text-center" role="alert">
                  {formError}
                </p>
              )}

              <AnimatedButton
                variant="primary"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full py-3 rounded-xl text-sm font-display lg:py-4 lg:rounded-2xl lg:text-base lg:shadow-xl lg:shadow-terracotta-500/20 ${
                  !canContinue ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Continue to book →
              </AnimatedButton>
              <p className="text-[10px] text-gray-400 text-center">No payment now · quote in 24h</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function roundGuestLine(perGuest: number, guests: number): number {
  return roundDollars(perGuest * guests);
}
