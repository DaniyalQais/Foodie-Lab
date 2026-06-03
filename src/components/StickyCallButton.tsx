import { Phone } from 'lucide-react';
import { FOODIE_LAB_BUSINESS } from '../data/business';

export default function StickyCallButton() {
  return (
    <a
      href={`tel:+${FOODIE_LAB_BUSINESS.whatsappTel}`}
      aria-label={`Call ${FOODIE_LAB_BUSINESS.name}`}
      className="fixed bottom-20 right-4 z-[50] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-brand-600 text-white shadow-lg shadow-terracotta-500/35 ring-2 ring-white/90 active:scale-95 transition-transform hover:from-terracotta-600 hover:to-brand-700 sm:bottom-6"
    >
      <Phone className="h-6 w-6" strokeWidth={2.25} />
    </a>
  );
}
