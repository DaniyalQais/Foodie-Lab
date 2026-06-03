import { motion } from 'motion/react';
import { Users, Minus, Plus } from 'lucide-react';

interface GuestCountHeroProps {
  guestCount: number;
  minGuests: number;
  maxGuests?: number;
  perGuestMidpoint: number;
  onChange: (count: number) => void;
}

export default function GuestCountHero({
  guestCount,
  minGuests,
  maxGuests = 150,
  perGuestMidpoint,
  onChange,
}: GuestCountHeroProps) {
  const clamp = (n: number) => Math.min(maxGuests, Math.max(minGuests, n));

  return (
    <div className="rounded-2xl border-2 border-terracotta-200/60 bg-gradient-to-br from-terracotta-50/90 via-white to-brand-50/50 p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta-600 text-center">
        Guest count
      </p>

      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          type="button"
          aria-label="Decrease guests"
          disabled={guestCount <= minGuests}
          onClick={() => onChange(clamp(guestCount - 5))}
          className="h-11 w-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 disabled:opacity-35 active:scale-95 cursor-pointer shadow-sm"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="text-center min-w-[120px]">
          <div className="flex items-center justify-center gap-1.5">
            <Users className="w-5 h-5 text-brand-500 shrink-0" />
            <motion.span
              key={guestCount}
              initial={{ scale: 0.88, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="text-5xl sm:text-6xl font-display font-extrabold text-gray-900 tabular-nums leading-none tracking-tight"
            >
              {guestCount}
            </motion.span>
          </div>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            {guestCount === 1 ? 'Guest' : 'Guests'}
          </p>
        </div>

        <button
          type="button"
          aria-label="Increase guests"
          disabled={guestCount >= maxGuests}
          onClick={() => onChange(clamp(guestCount + 5))}
          className="h-11 w-11 rounded-xl border border-brand-200 bg-brand-50 flex items-center justify-center text-brand-700 disabled:opacity-35 active:scale-95 cursor-pointer shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <input
        type="range"
        min={minGuests}
        max={maxGuests}
        value={guestCount}
        onChange={e => onChange(clamp(parseInt(e.target.value, 10)))}
        className="w-full mt-4 accent-terracotta-500"
        aria-label="Guest count slider"
      />
      <p className="text-[10px] text-gray-500 text-center mt-1.5">
        Min {minGuests} guests · drag or use +/− (steps of 5)
      </p>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/90 border border-brand-100 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Est. per guest
        </span>
        <motion.span
          key={perGuestMidpoint}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-lg font-display font-extrabold text-terracotta-600 tabular-nums"
        >
          ${perGuestMidpoint}
          <span className="text-sm font-semibold text-gray-500"> / guest</span>
        </motion.span>
      </div>
    </div>
  );
}
