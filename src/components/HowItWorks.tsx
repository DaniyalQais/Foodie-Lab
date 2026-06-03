import { ClipboardList, Send, BadgeCheck } from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, label: 'Build Quote', step: '1' },
  { icon: Send, label: 'Submit Request', step: '2' },
  { icon: BadgeCheck, label: 'We Confirm Details', step: '3' },
] as const;

export default function HowItWorks() {
  return (
    <section
      className="rounded-2xl border border-brand-100 bg-white/90 shadow-sm px-3 py-3 sm:px-5 sm:py-4 max-h-[180px] overflow-hidden"
      aria-label="How it works"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-center mb-2 sm:mb-3">
        How it works
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map(({ icon: Icon, label, step }) => (
          <li key={step} className="flex sm:flex-col items-center sm:text-center gap-2.5 sm:gap-1.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-brand-600">
              <Icon className="w-4 h-4" strokeWidth={2} />
            </span>
            <div className="min-w-0 sm:space-y-0.5">
              <span className="text-[9px] font-bold text-terracotta-600 uppercase tracking-wider sm:block">
                Step {step}
              </span>
              <span className="text-xs font-display font-bold text-gray-900 leading-tight block">
                {label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
