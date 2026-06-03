import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Calendar,
  Users,
  Heart,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { CateringOrder } from '../types';
import { CATERING_PACKAGES } from '../data';
import { FOODIE_LAB_BUSINESS } from '../data/business';
import EstimatedInvestmentIndicator from './EstimatedInvestmentIndicator';
import { buildWhatsAppOrderMessage, getWhatsAppSendUrl } from '../whatsapp';
import type { OrderSendMethod } from '../orderSend';
import { animateSuccessPop } from '../lib/animeMicro';
import AnimatedButton from './motion/AnimatedButton';

function getWeb3FormsAccessKey(): string {
  const raw = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!raw) return '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

function hasWeb3FormsConfigured(): boolean {
  return Boolean(getWeb3FormsAccessKey());
}

async function sendOwnerEmail(order: CateringOrder) {
  const accessKey = getWeb3FormsAccessKey();
  const body = buildWhatsAppOrderMessage(order);
  if (accessKey) {
    try {
      const fd = new FormData();
      fd.append('access_key', accessKey);
      fd.append('subject', `New catering request ${order.id} — ${order.fullName}`);
      fd.append('from_name', 'Foodie Lab Website');
      fd.append('name', order.fullName);
      fd.append('email', order.email);
      fd.append('phone', order.phone);
      fd.append('message', body);
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
        return { ok: true as const, message: `Email sent to ${FOODIE_LAB_BUSINESS.email}. Check inbox and spam.` };
      }
    } catch {
      /* fallback */
    }
  }
  try {
    const fd = new FormData();
    fd.append('name', order.fullName);
    fd.append('email', order.email);
    fd.append('phone', order.phone);
    fd.append('message', body);
    fd.append('_subject', `New catering request ${order.id} — ${order.fullName}`);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    const url = `https://formsubmit.co/ajax/${encodeURIComponent(FOODIE_LAB_BUSINESS.email)}`;
    const res = await fetch(url, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    const data = (await res.json()) as { success?: string | boolean };
    if (data.success === 'true' || data.success === true) {
      return { ok: true as const, message: `Email sent to ${FOODIE_LAB_BUSINESS.email}. Check spam.` };
    }
    return { ok: false as const, message: 'Email failed. Try WhatsApp.' };
  } catch {
    return {
      ok: false as const,
      message: accessKey ? 'Network error. Try WhatsApp.' : 'Add VITE_WEB3FORMS_ACCESS_KEY to .env and restart dev.',
    };
  }
}

function openOwnerWhatsApp(order: CateringOrder): boolean {
  const url = getWhatsAppSendUrl(buildWhatsAppOrderMessage(order));
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    try {
      window.location.assign(url);
      return true;
    } catch {
      return false;
    }
  }
}

interface SuccessMessageProps {
  order: CateringOrder;
  /** User already chose on submit screen — run that send once */
  initialSendMethod?: OrderSendMethod | null;
  onClose: () => void;
}

type SendChoice = 'whatsapp' | 'email' | null;

export default function SuccessMessage({ order, initialSendMethod = null, onClose }: SuccessMessageProps) {
  const pkgName = CATERING_PACKAGES.find(p => p.id === order.packageId)?.name || 'Custom Menu';
  const waUrl = getWhatsAppSendUrl(buildWhatsAppOrderMessage(order));
  const web3FormsEnabled = hasWeb3FormsConfigured();
  const checkRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [choice, setChoice] = useState<SendChoice>(null);
  const [whatsappHint, setWhatsappHint] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailDetail, setEmailDetail] = useState<string | null>(null);

  const handleWhatsApp = () => {
    setChoice('whatsapp');
    const opened = openOwnerWhatsApp(order);
    setWhatsappHint(
      opened
        ? 'WhatsApp opened with your order. Tap Send in WhatsApp to deliver it.'
        : 'Allow pop-ups, then tap the green WhatsApp card again.'
    );
  };

  useEffect(() => {
    if (initialSendMethod !== 'email') return;

    let cancelled = false;
    setChoice('email');
    setEmailState('sending');
    setEmailDetail('Sending to Foodie Lab…');

    void sendOwnerEmail(order).then(result => {
      if (cancelled) return;
      setEmailState(result.ok ? 'sent' : 'error');
      setEmailDetail(result.message);
    });

    return () => {
      cancelled = true;
    };
  }, [initialSendMethod, order]);

  useEffect(() => {
    if (initialSendMethod !== 'whatsapp') return;
    setChoice('whatsapp');
    setWhatsappHint('WhatsApp should have opened when you chose it. Tap Send there, or use the button below.');
  }, [initialSendMethod]);

  const handleEmail = async () => {
    setChoice('email');
    setEmailState('sending');
    setEmailDetail(null);
    try {
      const result = await sendOwnerEmail(order);
      setEmailState(result.ok ? 'sent' : 'error');
      setEmailDetail(result.message);
    } catch {
      setEmailState('error');
      setEmailDetail('Network error. Check your connection and try again.');
    }
  };

  useEffect(() => {
    animateSuccessPop(checkRef.current);
    if (cardRef.current) animateSuccessPop(cardRef.current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      id="order-success"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-brand-100 overflow-hidden text-center relative"
    >
      <div className="h-2.5 bg-gradient-to-r from-terracotta-500 to-brand-600" />

      <div className="p-8 md:p-10 space-y-6">
        <motion.div
          ref={checkRef}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 260 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-sage-600 uppercase tracking-widest bg-sage-50 px-3 py-1 rounded-full border border-sage-100 inline-block">
            Order saved
          </span>
          <h2 className="text-3xl font-display font-medium text-gray-900">
            {initialSendMethod === 'whatsapp'
              ? 'WhatsApp ready'
              : initialSendMethod === 'email'
                ? emailState === 'sending'
                  ? 'Sending email…'
                  : emailState === 'sent'
                    ? 'Email sent'
                    : emailState === 'error'
                      ? 'Email issue'
                      : 'Order saved'
                : 'Order saved'}
          </h2>
          <p className="text-xs text-gray-400 font-mono">Reference: {order.id}</p>
          {initialSendMethod === 'whatsapp' && (
            <p className="text-sm text-emerald-800 font-medium">
              WhatsApp should have opened — tap <strong>Send</strong> in the app. Use the button below
              to open again.
            </p>
          )}
          {initialSendMethod === 'email' && emailState === 'sent' && (
            <p className="text-sm text-emerald-800 font-medium">
              Email sent to Foodie Lab. Use the button below to resend if needed.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={handleWhatsApp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-2xl border-2 p-5 text-left transition-colors cursor-pointer ${
              choice === 'whatsapp'
                ? 'border-[#25D366] bg-[#25D366]/10 ring-2 ring-[#25D366]/30'
                : 'border-gray-200 hover:border-[#25D366]/50 bg-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </span>
              <div>
                <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">WhatsApp</p>
                <p className="text-[10px] text-gray-500">{FOODIE_LAB_BUSINESS.whatsapp}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Opens WhatsApp with your order filled in. Tap <strong>Send</strong> in WhatsApp.
            </p>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleEmail}
            disabled={emailState === 'sending'}
            whileHover={{ y: emailState === 'sending' ? 0 : -2 }}
            whileTap={{ scale: emailState === 'sending' ? 1 : 0.98 }}
            className={`rounded-2xl border-2 p-5 text-left transition-colors cursor-pointer disabled:opacity-70 ${
              choice === 'email'
                ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                : 'border-gray-200 hover:border-brand-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </span>
              <div>
                <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">Email</p>
                <p className="text-[10px] text-gray-500 truncate">{FOODIE_LAB_BUSINESS.email}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {emailState === 'sending'
                ? 'Sending to Foodie Lab…'
                : emailState === 'sent'
                  ? 'Sent! Check your Gmail inbox.'
                  : 'Sends from the website. Does not open your browser mail.'}
            </p>
          </motion.button>
        </div>

        {choice === 'whatsapp' && whatsappHint && (
          <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-left">
            {whatsappHint}{' '}
            <a href={waUrl} target="_blank" rel="noreferrer" className="underline font-semibold">
              Open WhatsApp link
            </a>
          </p>
        )}

        {choice === 'email' && emailDetail && (
          <p
            className={`text-[11px] rounded-lg px-3 py-2 text-left border ${
              emailState === 'sent'
                ? 'text-emerald-800 bg-emerald-50 border-emerald-100'
                : 'text-amber-900 bg-amber-50 border-amber-100'
            }`}
          >
            {emailDetail}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-amber-warm/40 rounded-2xl border border-brand-100/40 text-left space-y-3 relative overflow-hidden"
        >
          <div className="flex gap-2 items-center text-xs text-brand-600 font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-terracotta-500" fill="currentColor" />
            From the Foodie Lab team
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Thank you, <strong>{order.fullName}</strong>! Your <strong>{pkgName}</strong> request for{' '}
            <strong>{order.eventDate}</strong> is ready.
          </p>
        </motion.div>

        <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
            Booking recap
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Package</span>
              <div className="font-semibold text-gray-800">{pkgName}</div>
            </div>
            <div>
              <span className="text-gray-400">Guests</span>
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-500" /> {order.guestCount}
              </div>
            </div>
            <div>
              <span className="text-gray-400">When</span>
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500" /> {order.eventDate} · {order.eventTime}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Service</span>
              <div className="font-semibold text-gray-800 capitalize">{order.serviceType}</div>
            </div>
          </div>
        </div>

        <EstimatedInvestmentIndicator midpoint={order.estimatedTotal} guestCount={order.guestCount} compact />

        <div className="flex items-center gap-2.5 text-left text-xs bg-sage-50 text-sage-800 p-3.5 rounded-xl border border-sage-100">
          <ShieldCheck className="w-5 h-5 text-sage-600 shrink-0" />
          <span>No payment collected. Final quote after distance and setup review.</span>
        </div>

        <AnimatedButton
          variant="primary"
          onClick={onClose}
          className="w-full py-3.5 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          Back home
          <ArrowRight className="w-4 h-4" />
        </AnimatedButton>
      </div>
    </motion.div>
  );
}
