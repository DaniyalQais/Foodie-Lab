import type { CateringOrder } from '../types';
import { FOODIE_LAB_BUSINESS } from '../data/business';
import { buildWhatsAppOrderMessage, getWhatsAppSendUrl } from './whatsapp';

export interface EmailSendResult {
  ok: boolean;
  provider?: 'web3forms' | 'formsubmit';
  message: string;
}

export interface NotifyOwnerResult {
  emailSent: boolean;
  /** wa.me opened (customer must tap Send in WhatsApp) */
  whatsappOpened: boolean;
  /** mailto: opened when Web3Forms key is missing */
  emailMailtoOpened: boolean;
  /** Human-readable status for UI */
  message: string;
}

function formatOrderEmailHtml(order: CateringOrder): string {
  const text = buildWhatsAppOrderMessage(order);
  return text.replace(/\n/g, '<br>');
}

export function buildOwnerMailtoUrl(order: CateringOrder): string {
  const subject = encodeURIComponent(`New catering request ${order.id} — ${order.fullName}`);
  const body = encodeURIComponent(buildWhatsAppOrderMessage(order));
  return `mailto:${FOODIE_LAB_BUSINESS.email}?subject=${subject}&body=${body}`;
}

function getWeb3FormsAccessKey(): string {
  const raw = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!raw) return '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

export function hasWeb3FormsConfigured(): boolean {
  return Boolean(getWeb3FormsAccessKey());
}

export async function sendOwnerEmail(order: CateringOrder): Promise<EmailSendResult> {
  const accessKey = getWeb3FormsAccessKey();
  if (!accessKey) {
    return {
      ok: false,
      message: 'Add VITE_WEB3FORMS_ACCESS_KEY to .env (see Web3Forms React docs) and restart npm run dev.',
    };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      redirect: 'manual',
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New catering request ${order.id} — ${order.fullName}`,
        name: order.fullName,
        email: order.email,
        phone: order.phone,
        message: buildWhatsAppOrderMessage(order),
      }),
    });
    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      body?: { message?: string };
    };

    if (data.success) {
      return {
        ok: true,
        provider: 'web3forms',
        message: `Form submitted successfully. Check ${FOODIE_LAB_BUSINESS.email} (inbox + spam).`,
      };
    }

    return {
      ok: false,
      provider: 'web3forms',
      message:
        data.message ||
        data.body?.message ||
        'Error from Web3Forms. At web3forms.com set notification email to daniyalqais6@gmail.com.',
    };
  } catch {
    return { ok: false, message: 'Network error. Check your connection and try again.' };
  }
}

export async function sendOwnerEmailViaWeb3Forms(order: CateringOrder): Promise<boolean> {
  return (await sendOwnerEmail(order)).ok;
}

/** Call synchronously inside the submit click handler so pop-ups are not blocked. */
export function openOwnerWhatsApp(order: CateringOrder): boolean {
  const url = getWhatsAppSendUrl(buildWhatsAppOrderMessage(order));
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return win != null;
  } catch {
    return false;
  }
}

function openOwnerMailto(order: CateringOrder): boolean {
  try {
    const win = window.open(buildOwnerMailtoUrl(order), '_blank', 'noopener,noreferrer');
    return win != null;
  } catch {
    return false;
  }
}

/**
 * Notify Foodie Lab when a customer submits a request.
 * - WhatsApp: opens chat to your number with the order text (tap Send in WhatsApp).
 * - Email: sends to inbox if VITE_WEB3FORMS_ACCESS_KEY is set (see .env.example).
 */
export async function notifyOwnerOnNewOrder(
  order: CateringOrder,
  options?: { whatsappOpened?: boolean }
): Promise<NotifyOwnerResult> {
  const whatsappOpened =
    options?.whatsappOpened === true ? openOwnerWhatsApp(order) : false;

  let emailSent = false;
  let emailMailtoOpened = false;
  let message = 'Request saved.';

  try {
    const emailResult = await sendOwnerEmail(order);
    emailSent = emailResult.ok;
    message = emailResult.message;
  } catch {
    emailSent = false;
  }

  if (!emailSent && !hasWeb3FormsConfigured()) {
    emailMailtoOpened = openOwnerMailto(order);
  }

  if (emailSent && whatsappOpened) {
    message += ' WhatsApp opened — tap Send there.';
  } else if (!emailSent && whatsappOpened) {
    message = `WhatsApp opened. ${message}`;
  } else if (emailMailtoOpened) {
    message = `Mail draft opened for ${FOODIE_LAB_BUSINESS.email}.`;
  } else if (!emailSent) {
    message = message || 'Request saved. Use WhatsApp or email below.';
  }

  return { emailSent, whatsappOpened, emailMailtoOpened, message };
}

export { formatOrderEmailHtml };
