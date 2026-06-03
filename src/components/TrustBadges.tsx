import { CheckCircle2 } from 'lucide-react';

const BADGES = [
  'Family-Owned Business',
  'Reply Within 24 Hours',
  'No Payment Required',
] as const;

export default function TrustBadges() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2 lg:pt-3"
      role="list"
      aria-label="Trust indicators"
    >
      {BADGES.map(label => (
        <span
          key={label}
          role="listitem"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-white/80 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-gray-700 shadow-sm"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0" strokeWidth={2.5} />
          {label}
        </span>
      ))}
    </div>
  );
}
