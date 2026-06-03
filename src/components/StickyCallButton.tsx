import { Phone } from 'lucide-react';
import { FOODIE_LAB_BUSINESS } from '../data/business';

export default function StickyCallButton() {
  return (
    <a
      href={`tel:+${FOODIE_LAB_BUSINESS.whatsappTel}`}
      aria-label={`Call ${FOODIE_LAB_BUSINESS.name}`}
      className="fixed bottom-[4.5rem] right-3 z-[50] flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-brand-600 text-white shadow-md shadow-terracotta-500/30 ring-2 ring-white/90 active:scale-95 transition-transform hover:from-terracotta-600 hover:to-brand-700 sm:bottom-5 sm:right-4"
      style={{ boxShadow: '0 4px 20px rgba(224, 83, 39, 0.35), 0 0 0 1px rgba(255,255,255,0.9)' }}
    >
      <Phone className="h-5 w-5" strokeWidth={2.25} />
    </a>
  );
}
