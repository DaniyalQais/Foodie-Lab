import { createPortal } from 'react-dom';
import { MessageCircle, Mail, X } from 'lucide-react';
import { FOODIE_LAB_BUSINESS } from '../data/business';
import type { OrderSendMethod } from '../orderSend';

interface OrderSendPickerProps {
  open: boolean;
  onClose: () => void;
  onChoose: (method: OrderSendMethod) => void;
}

export default function OrderSendPicker({ open, onClose, onChoose }: OrderSendPickerProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-picker-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-brand-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-brand-50/50">
          <h3 id="send-picker-title" className="font-display font-bold text-gray-900">
            How should we receive your order?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="px-4 pt-3 text-sm text-gray-600">
          Your order is saved on this device first. Pick how Foodie Lab should receive it.
        </p>
        <div className="p-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => onChoose('whatsapp')}
            className="flex items-center gap-3 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 p-4 text-left cursor-pointer hover:bg-[#25D366]/15 active:scale-[0.99]"
          >
            <span className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </span>
            <span>
              <span className="block font-bold text-gray-900">WhatsApp</span>
              <span className="block text-xs text-gray-600 mt-0.5">
                Opens WhatsApp to {FOODIE_LAB_BUSINESS.whatsapp} — tap Send there
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onChoose('email')}
            className="flex items-center gap-3 rounded-xl border-2 border-brand-500 bg-brand-50 p-4 text-left cursor-pointer hover:bg-brand-100/80 active:scale-[0.99]"
          >
            <span className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </span>
            <span>
              <span className="block font-bold text-gray-900">Email</span>
              <span className="block text-xs text-gray-600 mt-0.5">
                Sends to {FOODIE_LAB_BUSINESS.email} from this website
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
