import { TrendingUp, Info } from 'lucide-react';
import {
  getInvestmentRange,
  INVESTMENT_DISCLAIMER,
  INVESTMENT_VOLATILITY_FACTORS,
} from '../lib/investmentEstimate';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

interface EstimatedInvestmentIndicatorProps {
  /** Planning midpoint (stored on orders for ops; not a checkout total). */
  midpoint: number;
  guestCount?: number;
  compact?: boolean;
  showFactors?: boolean;
  /** Override heading (e.g. "Estimate") */
  title?: string;
  className?: string;
}

export default function EstimatedInvestmentIndicator({
  midpoint,
  guestCount,
  compact = false,
  showFactors = !compact,
  title,
  className,
}: EstimatedInvestmentIndicatorProps) {
  const range = getInvestmentRange(midpoint);
  const perGuest =
    guestCount && guestCount > 0 && range ? range.midpoint / guestCount : null;

  return (
    <div
      className={cx(
        'rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-warm/40 via-white to-brand-50/50 overflow-hidden',
        className
      )}
    >
      <div className={cx('px-4', compact ? 'py-3' : 'py-4')}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-2 rounded-xl bg-terracotta-50 border border-terracotta-100 text-terracotta-600">
            <TrendingUp className={cx(compact ? 'w-4 h-4' : 'w-5 h-5')} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700">
              {title ?? (compact ? 'Estimate' : 'Estimated Investment Indicator')}
            </p>
            {range ? (
              <>
                <p
                  className={cx(
                    'font-display font-extrabold text-gray-900 tracking-tight mt-0.5 break-words',
                    compact ? 'text-xl' : 'text-2xl sm:text-3xl'
                  )}
                >
                  ${range.low.toLocaleString()} – ${range.high.toLocaleString()}
                </p>
                {perGuest != null && guestCount != null && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    ~${perGuest.toFixed(0)}/guest · {guestCount} guests
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm font-semibold text-gray-800 mt-1">
                Indicative range pending menu consultation
              </p>
            )}
            {!compact && (
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Planning only — not checkout</p>
            )}
          </div>
        </div>

        {!compact && (
          <p className="text-[11px] text-gray-600 leading-relaxed mt-3 flex gap-2">
            <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>{INVESTMENT_DISCLAIMER}</span>
          </p>
        )}

        {showFactors && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {INVESTMENT_VOLATILITY_FACTORS.map(f => (
              <li
                key={f}
                className="text-[10px] font-medium text-gray-600 bg-white/80 border border-gray-200 px-2 py-0.5 rounded-full"
              >
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
