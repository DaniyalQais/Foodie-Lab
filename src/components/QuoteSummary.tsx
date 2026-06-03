import { motion } from 'motion/react';
import { Receipt, Truck, Coffee } from 'lucide-react';
import type { ServiceType } from '../types';
import EstimatedInvestmentIndicator from './EstimatedInvestmentIndicator';
import {
  BASE_RATE_PER_GUEST,
  DELIVERY_PLANNING_FEE,
  INVESTMENT_RANGE_PADDING,
} from '../lib/orderPricing';

interface QuoteSummaryProps {
  guestCount: number;
  foodBaseline: number;
  sidesTotal: number;
  finalMidpointTotal: number;
  range: { low: number; high: number };
  perGuestMidpoint: number;
  serviceType: ServiceType;
  sticky?: boolean;
  className?: string;
}

export default function QuoteSummary({
  guestCount,
  foodBaseline,
  sidesTotal,
  finalMidpointTotal,
  range,
  perGuestMidpoint,
  serviceType,
  sticky = false,
  className = '',
}: QuoteSummaryProps) {
  return (
    <motion.div
      layout
      key={`${guestCount}-${finalMidpointTotal}-${serviceType}-${sidesTotal}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden ${
        sticky ? 'lg:sticky lg:top-20' : ''
      } ${className}`}
    >
      <div className="px-3 py-2 border-b border-brand-50 bg-brand-50/40">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta-600">
          Live estimate
        </p>
      </div>

      <div className="p-3 space-y-2.5">
        <EstimatedInvestmentIndicator
          midpoint={finalMidpointTotal}
          guestCount={guestCount}
          compact
          showFactors={false}
          title="Planning range"
        />

        <details className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 group">
          <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Receipt className="w-3 h-3" />
            Breakdown
          </summary>
          <div className="px-3 pb-2.5 space-y-1 text-xs text-gray-600">
            <div className="flex justify-between gap-2">
              <span>
                {guestCount} × ${BASE_RATE_PER_GUEST}
              </span>
              <span className="font-semibold text-gray-800">${foodBaseline}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Extras & sides</span>
              <span className="font-semibold text-gray-800">
                {sidesTotal > 0 ? `+$${sidesTotal}` : '$0'}
              </span>
            </div>
            <div className="flex justify-between gap-2 pt-1 border-t border-gray-100 font-semibold text-gray-800">
              <span>Midpoint</span>
              <span>${finalMidpointTotal}</span>
            </div>
            <div className="flex justify-between gap-2 text-[10px] text-gray-500">
              <span>~${perGuestMidpoint}/guest</span>
              <span>
                ±${INVESTMENT_RANGE_PADDING}: ${range.low}–${range.high}
              </span>
            </div>
            {serviceType === 'delivery' && (
              <div className="flex justify-between gap-2 text-gray-500 pt-1 border-t border-dashed border-gray-100">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Delivery (est.)
                </span>
                <span className="font-semibold">+${DELIVERY_PLANNING_FEE}</span>
              </div>
            )}
            {serviceType === 'pickup' && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 pt-0.5">
                <Coffee className="w-3 h-3" /> Pickup — no delivery fee in estimate
              </div>
            )}
          </div>
        </details>

        <p className="text-[10px] text-gray-400 text-center leading-snug">
          Planning only · no payment · final quote after review
        </p>
      </div>
    </motion.div>
  );
}
