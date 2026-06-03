import { useRef, useState, useMemo, useEffect } from 'react';
import {
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronDown,
  Truck,
  Coffee,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';
import OrderSendPicker from './OrderSendPicker';
import { CateringOrder, ServiceType } from '../types';
import {
  MAIN_PACKAGES,
  ENCHILADA_SAUCES,
  SINGLE_ITEMS,
  PACKAGE_TO_ORDER_ID,
  getPackageChoices,
} from '../data/menuPresentation';
import { FOODIE_LAB_BUSINESS, SERVICE_AREA_LABEL } from '../data/business';
import AnimatedField from './motion/AnimatedField';
import AnimatedButton from './motion/AnimatedButton';
import GuestCountHero from './GuestCountHero';
import QuoteSummary from './QuoteSummary';
import {
  calculateMenuOrderPricing,
  calculateInvestmentRangeFromMidpoint,
} from '../lib/orderPricing';
import type { QuoteHandoffPayload } from '../lib/quoteHandoff';
import {
  buildHandoffNotes,
  buildItemCountsFromEstimatorAddOns,
  resolveMainPackageId,
} from '../lib/quoteHandoff';
import type { OrderSendMethod } from '../orderSend';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

interface MenuPresentationProps {
  onSubmit: (
    order: Omit<CateringOrder, 'id' | 'createdAt' | 'status'>,
    sendMethod: OrderSendMethod
  ) => void;
  onCancel?: () => void;
  /** Set when user clicks Continue on Instant Quote */
  quoteHandoff?: QuoteHandoffPayload | null;
}

function scrollToRef(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function MenuPresentation({ onSubmit, onCancel, quoteHandoff }: MenuPresentationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLElement>(null);

  const [sendPickerOpen, setSendPickerOpen] = useState(false);

  /** Layout step: 1 = configure, 2 = manifest + delivery + submit */
  const [layoutStep, setLayoutStep] = useState<1 | 2>(1);

  const [activePackageId, setActivePackageId] = useState(MAIN_PACKAGES[0].id);
  const [guestCount, setGuestCount] = useState(25);
  const [selectedProteins, setSelectedProteins] = useState<Set<string>>(
    new Set(['carne-asada', 'pollo-asado'])
  );
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [showSingleItems, setShowSingleItems] = useState(false);
  const [enchiladaSauce, setEnchiladaSauce] = useState(ENCHILADA_SAUCES[0].id);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [allergyInfo, setAllergyInfo] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [quoteAppliedBanner, setQuoteAppliedBanner] = useState(false);
  const [handoffMidpoint, setHandoffMidpoint] = useState<number | null>(null);

  const activePackage = MAIN_PACKAGES.find(p => p.id === activePackageId) ?? MAIN_PACKAGES[0];
  const minGuests = activePackage.minGuests;

  const orderPackageId = PACKAGE_TO_ORDER_ID[activePackageId] ?? 'taco-bar';
  const packageChoices = useMemo(
    () => getPackageChoices(activePackageId),
    [activePackageId]
  );

  useEffect(() => {
    if (!quoteHandoff?.id) return;
    const mainId = resolveMainPackageId(
      quoteHandoff.cateringPackageId,
      quoteHandoff.cateringPackageName
    );
    const pkg = MAIN_PACKAGES.find(p => p.id === mainId) ?? MAIN_PACKAGES[0];

    setActivePackageId(pkg.id);
    setGuestCount(Math.max(pkg.minGuests, quoteHandoff.guestCount));
    setServiceType(quoteHandoff.serviceType);
    setSelectedProteins(new Set(pkg.defaultChoiceIds));
    setItemCounts(buildItemCountsFromEstimatorAddOns(quoteHandoff.addOns));
    setSpecialNotes(
      buildHandoffNotes(
        quoteHandoff.cateringPackageName,
        quoteHandoff.addOns,
        quoteHandoff.estimatedMidpoint
      )
    );
    setLayoutStep(2);
    setQuoteAppliedBanner(true);
    setHandoffMidpoint(quoteHandoff.estimatedMidpoint);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToRef(step2Ref.current));
    });
  }, [quoteHandoff]);

  const menuPricing = useMemo(
    () => calculateMenuOrderPricing(guestCount, itemCounts, serviceType),
    [guestCount, itemCounts, serviceType]
  );

  const orderPricing = useMemo(() => {
    if (handoffMidpoint == null) return menuPricing;
    const range = calculateInvestmentRangeFromMidpoint(handoffMidpoint);
    return {
      ...menuPricing,
      finalMidpointTotal: handoffMidpoint,
      estimatedTotal: handoffMidpoint,
      range,
      perGuestMidpoint: guestCount > 0 ? Math.round(handoffMidpoint / guestCount) : 0,
    };
  }, [handoffMidpoint, menuPricing, guestCount]);

  const clearHandoffMidpoint = () => setHandoffMidpoint(null);

  const toggleProtein = (id: string) => {
    setSelectedProteins(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setItemCount = (id: string, delta: number) => {
    clearHandoffMidpoint();
    setItemCounts(prev => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, Math.min(99, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const validateStep1 = (): boolean => {
    if (guestCount < minGuests) {
      alert(`This package requires at least ${minGuests} guests.`);
      return false;
    }
    if (selectedProteins.size < 1) {
      alert(`Please select at least one option for ${activePackage.label}.`);
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!fullName.trim()) {
      alert('Please enter your full name.');
      return false;
    }
    if (!phone.trim() || phone.length < 7) {
      alert('Please enter a valid phone number.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (!eventDate) {
      alert('Please choose your event date.');
      return false;
    }
    if (!eventTime) {
      alert('Please choose your event time.');
      return false;
    }
    if (serviceType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter a delivery address.');
      return false;
    }
    return true;
  };

  const handleReviewManifest = () => {
    if (!validateStep1()) return;
    setLayoutStep(2);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToRef(step2Ref.current));
    });
  };

  const buildOrderPayload = (): Omit<CateringOrder, 'id' | 'createdAt' | 'status'> => {
    const choiceList = [...selectedProteins]
      .map(id => packageChoices.find(p => p.id === id)?.title)
      .filter(Boolean)
      .join(', ');

    const sauceLabel =
      activePackageId === 'enchiladas'
        ? ENCHILADA_SAUCES.find(s => s.id === enchiladaSauce)?.label
        : '';

    const singlesList = SINGLE_ITEMS.filter(i => (itemCounts[i.id] ?? 0) > 0)
      .map(i => `${i.name} ×${itemCounts[i.id]}`)
      .join('; ');

    const notes = [
      specialNotes,
      `Menu: ${activePackage.label}`,
      choiceList ? `${activePackage.choiceHeading}: ${choiceList}` : '',
      sauceLabel ? `Sauce: ${sauceLabel}` : '',
      singlesList ? `Add-ons: ${singlesList}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    return {
      fullName,
      phone,
      email,
      eventDate,
      eventTime,
      serviceType,
      deliveryAddress: serviceType === 'delivery' ? deliveryAddress : undefined,
      packageId: orderPackageId,
      guestCount,
      allergyInfo,
      specialNotes: notes,
      estimatedTotal: orderPricing.estimatedTotal,
    };
  };

  const handleSubmitToKitchen = () => {
    if (!validateStep2()) return;
    setSendPickerOpen(true);
  };

  const completeOrderWithMethod = (sendMethod: OrderSendMethod) => {
    onSubmit(buildOrderPayload(), sendMethod);
    setSendPickerOpen(false);
  };

  const choiceLabels = [...selectedProteins]
    .map(id => packageChoices.find(p => p.id === id)?.title)
    .filter(Boolean);

  const enchiladaSauceLabel =
    activePackageId === 'enchiladas'
      ? ENCHILADA_SAUCES.find(s => s.id === enchiladaSauce)?.label
      : null;

  const selectPackage = (pkg: (typeof MAIN_PACKAGES)[number]) => {
    clearHandoffMidpoint();
    setActivePackageId(pkg.id);
    setGuestCount(g => Math.max(pkg.minGuests, g));
    setSelectedProteins(new Set(pkg.defaultChoiceIds));
    if (pkg.id === 'enchiladas') setEnchiladaSauce(ENCHILADA_SAUCES[0].id);
  };

  const singlesWithQty = SINGLE_ITEMS.filter(i => (itemCounts[i.id] ?? 0) > 0);

  return (
    <div ref={containerRef} className="w-full scroll-mt-20">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className={cx(
            'h-1.5 flex-1 rounded-full transition-colors',
            layoutStep >= 1 ? 'bg-terracotta-500' : 'bg-gray-200'
          )}
        />
        <div
          className={cx(
            'h-1.5 flex-1 rounded-full transition-colors',
            layoutStep >= 2 ? 'bg-terracotta-500' : 'bg-gray-200'
          )}
        />
      </div>

      {layoutStep === 1 && (
        <section className="rounded-3xl border border-brand-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-brand-100 bg-brand-50/40 px-3 pt-2.5 pb-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 px-1 mb-2">
              Step 1 · Build your order
            </p>
            <div className="grid grid-cols-3 gap-2 pb-3 w-full" role="tablist">
              {MAIN_PACKAGES.map(pkg => {
                const isActive = activePackageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectPackage(pkg)}
                    className={cx(
                      'w-full min-w-0 rounded-2xl px-2 sm:px-3 py-3 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer border text-center leading-tight',
                      isActive
                        ? 'bg-gradient-to-r from-terracotta-500 to-brand-600 text-white border-transparent shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                    )}
                  >
                    {pkg.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-600 leading-snug px-1 pb-1">{activePackage.tagline}</p>
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 space-y-4">
            <GuestCountHero
              guestCount={guestCount}
              minGuests={minGuests}
              perGuestMidpoint={orderPricing.perGuestMidpoint}
              onChange={n => {
                clearHandoffMidpoint();
                setGuestCount(n);
              }}
            />

            {/* Choose protein / fillings — original position (right after guests) */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-base text-gray-900">{activePackage.choiceHeading}</h3>

              {activePackageId === 'enchiladas' && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Sauce</p>
                  <div className="flex flex-wrap gap-2">
                    {ENCHILADA_SAUCES.map(sauce => {
                      const selected = enchiladaSauce === sauce.id;
                      return (
                        <button
                          key={sauce.id}
                          type="button"
                          onClick={() => setEnchiladaSauce(sauce.id)}
                          className={cx(
                            'rounded-full px-3 py-1.5 text-[11px] font-semibold border transition-all cursor-pointer',
                            selected
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300'
                          )}
                        >
                          {sauce.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {packageChoices.map(item => {
                    const selected = selectedProteins.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleProtein(item.id)}
                        className={cx(
                          'relative text-left rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border-2 bg-white transition-all cursor-pointer min-h-[72px] sm:min-h-0',
                          selected ? 'border-transparent' : 'border-gray-200'
                        )}
                        style={
                          selected
                            ? {
                                boxShadow:
                                  '0 0 0 2px #e05327, 0 0 0 4px rgba(224, 83, 39, 0.12)',
                              }
                            : undefined
                        }
                      >
                        {selected && (
                          <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-brand-600 text-white">
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                        <span className="font-semibold text-sm text-gray-900 pr-7 block leading-snug">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1 block line-clamp-2">{item.description}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Service type</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('pickup')}
                  className={cx(
                    'py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all',
                    serviceType === 'pickup'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Coffee className="w-4 h-4 shrink-0" />
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType('delivery')}
                  className={cx(
                    'py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all',
                    serviceType === 'delivery'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  Delivery
                </button>
              </div>
            </div>

            {/* Single items — compact counters */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowSingleItems(v => !v)}
                className="w-full flex items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3 cursor-pointer hover:border-brand-300 transition-colors"
                aria-expanded={showSingleItems}
              >
                <div className="text-left min-w-0">
                  <h3 className="font-display font-bold text-base text-gray-900">Add single items</h3>
                  <p className="text-[10px] text-gray-500">
                    {showSingleItems ? 'Tap + / − to add trays and sides' : 'Hidden (tap to show)'}
                  </p>
                </div>
                <ChevronDown
                  className={cx(
                    'w-5 h-5 text-gray-400 transition-transform shrink-0',
                    showSingleItems && 'rotate-180'
                  )}
                />
              </button>

              {showSingleItems && (
                <ul className="flex flex-col gap-1.5">
                  {SINGLE_ITEMS.map(item => {
                    const count = itemCounts[item.id] ?? 0;
                    return (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 min-h-[44px]"
                      >
                        <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                          {item.name}
                          <span className="text-[10px] text-gray-400 font-normal ml-1">
                            ${item.unitPrice}/ea
                          </span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name}`}
                            disabled={count === 0}
                            onClick={() => setItemCount(item.id, -1)}
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:scale-95 cursor-pointer bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900 tabular-nums">
                            {count}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name}`}
                            onClick={() => setItemCount(item.id, 1)}
                            className="w-9 h-9 rounded-lg border border-brand-200 bg-brand-50 flex items-center justify-center text-brand-700 active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <QuoteSummary
                sticky
                guestCount={guestCount}
                foodBaseline={orderPricing.foodBaseline}
                sidesTotal={orderPricing.sidesTotal}
                finalMidpointTotal={orderPricing.finalMidpointTotal}
                range={orderPricing.range}
                perGuestMidpoint={orderPricing.perGuestMidpoint}
                serviceType={serviceType}
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 p-3 pt-2 bg-gradient-to-t from-white via-white to-white/90 border-t border-brand-100 lg:static lg:bg-transparent lg:border-0 lg:p-4">
            <AnimatedButton
              variant="primary"
              onClick={handleReviewManifest}
              className="w-full py-3 rounded-2xl text-sm font-display uppercase tracking-wider shadow-md shadow-terracotta-500/15"
            >
              Review Catering Manifest
            </AnimatedButton>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Next: contact &amp; delivery · or use Instant quote below
            </p>
          </div>
        </section>
      )}

      {layoutStep === 2 && (
        <section id="order-details" ref={step2Ref} className="space-y-4 pb-6 scroll-mt-20">
          <button
            type="button"
            onClick={() => {
              setLayoutStep(1);
              requestAnimationFrame(() => {
                requestAnimationFrame(() => scrollToRef(containerRef.current));
              });
            }}
            className="flex items-center gap-1 text-sm font-semibold text-terracotta-600 cursor-pointer px-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Edit order
          </button>

          {quoteAppliedBanner && (
            <p className="text-xs font-medium text-brand-800 bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5">
              Your instant quote is applied. Confirm details below and submit.
            </p>
          )}

          <div className="rounded-3xl border-2 border-terracotta-200 bg-gradient-to-b from-terracotta-50/80 to-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-terracotta-500 to-brand-600 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Almost done</p>
              <h2 className="text-lg font-display font-bold text-white leading-tight">
                Your quote summary
              </h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3 py-2 border-b border-brand-100">
                <span className="text-gray-500 shrink-0">Package</span>
                <span className="font-semibold text-gray-900 text-right break-words">{activePackage.label}</span>
              </div>
              <div className="flex justify-between gap-3 py-2 border-b border-brand-100">
                <span className="text-gray-500 shrink-0">Guests</span>
                <span className="font-semibold text-gray-900">{guestCount}</span>
              </div>
              {choiceLabels.length > 0 && (
                <div className="py-2 border-b border-brand-100">
                  <span className="text-gray-500 block mb-1">{activePackage.choiceHeading}</span>
                  <span className="font-medium text-gray-800 text-xs leading-relaxed break-words">
                    {choiceLabels.join(' · ')}
                  </span>
                </div>
              )}
              {enchiladaSauceLabel && (
                <div className="flex justify-between gap-3 py-2 border-b border-brand-100">
                  <span className="text-gray-500 shrink-0">Sauce</span>
                  <span className="font-semibold text-gray-900 text-right text-xs">{enchiladaSauceLabel}</span>
                </div>
              )}
              {singlesWithQty.length > 0 && (
                <div className="py-2 border-b border-brand-100">
                  <span className="text-gray-500 block mb-1">Single items</span>
                  <ul className="text-xs font-medium text-gray-800 space-y-0.5">
                    {singlesWithQty.map(i => (
                      <li key={i.id} className="break-words">
                        {i.name} ×{itemCounts[i.id]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-between gap-3 py-2 border-b border-brand-100">
                <span className="text-gray-500 shrink-0">Service</span>
                <span className="font-semibold text-gray-900 capitalize">{serviceType}</span>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <span className="text-gray-500 shrink-0">Estimate</span>
                <span className="font-bold text-terracotta-700">
                  ${orderPricing.range.low}–${orderPricing.range.high}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & delivery */}
          <div className="rounded-3xl border border-brand-100 bg-white p-4 space-y-3 shadow-sm">
            <h3 className="font-display font-bold text-base text-gray-900">Delivery & contact details</h3>

            <AnimatedField
              label="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />

            <div className="grid grid-cols-1 gap-3">
              <AnimatedField
                label="Phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={FOODIE_LAB_BUSINESS.whatsapp}
                autoComplete="tel"
              />
              <AnimatedField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block space-y-1 col-span-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" /> Date
                </span>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-terracotta-500"
                />
              </label>
              <label className="block space-y-1 col-span-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> Time
                </span>
                <input
                  type="time"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-terracotta-500"
                />
              </label>
            </div>

            {serviceType === 'delivery' && (
              <div className="space-y-2">
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> Delivery address
                  </span>
                  <input
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-terracotta-500"
                    placeholder="Street, city, ZIP"
                  />
                </label>
                <div className="rounded-xl border border-brand-100 bg-brand-50/60 px-3 py-2.5 text-[10px] text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800 block mb-1">Service area</span>
                  <p className="break-words">{SERVICE_AREA_LABEL}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-[10px] text-gray-500">
              <span className="font-semibold text-gray-700">Kitchen: </span>
              {FOODIE_LAB_BUSINESS.addressLine}
              {' · '}
              <span className="text-terracotta-600 font-semibold">WhatsApp {FOODIE_LAB_BUSINESS.whatsapp}</span>
              {' · '}
              <span className="text-terracotta-600 font-semibold">{FOODIE_LAB_BUSINESS.email}</span>
              <span className="block mt-1 text-gray-400">
                After you submit, choose WhatsApp or Email on the next screen.
              </span>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-gray-600">Allergies (optional)</span>
              <textarea
                value={allergyInfo}
                onChange={e => setAllergyInfo(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-terracotta-500 resize-none"
                placeholder="List any allergies..."
              />
            </label>
          </div>

          <AnimatedButton
            variant="primary"
            onClick={handleSubmitToKitchen}
            className="w-full py-4 rounded-2xl text-sm font-display uppercase tracking-wider"
          >
            Submit — choose WhatsApp or Email
          </AnimatedButton>
          <p className="text-[10px] text-center text-gray-500 -mt-2">
            Next you pick how to send the request. Nothing opens until you choose.
          </p>

          <OrderSendPicker
            open={sendPickerOpen}
            onClose={() => setSendPickerOpen(false)}
            onChoose={completeOrderWithMethod}
          />

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-sm text-gray-500 font-medium cursor-pointer"
            >
              Cancel order
            </button>
          )}
        </section>
      )}
    </div>
  );
}
