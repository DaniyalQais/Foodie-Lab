import type { CateringOrder } from '../types';
import { CATERING_PACKAGES } from '../data';
import { FOODIE_LAB_BUSINESS } from '../data/business';

function safe(v?: string) {
  return (v ?? '').trim();
}

export function buildWhatsAppOrderMessage(order: CateringOrder) {
  const pkgName =
    CATERING_PACKAGES.find(p => p.id === order.packageId)?.name ?? 'Custom Menu';

  const lines = [
    `New catering request — ${order.id}`,
    '',
    `Name: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    '',
    `Menu: ${pkgName}`,
    `Guests: ${order.guestCount}`,
    `Date: ${order.eventDate}`,
    `Time: ${order.eventTime}`,
    `Service: ${order.serviceType}`,
    order.serviceType === 'delivery' && order.deliveryAddress
      ? `Address: ${order.deliveryAddress}`
      : null,
    safe(order.allergyInfo) ? `Allergies: ${order.allergyInfo}` : null,
    safe(order.specialNotes) ? `Notes: ${order.specialNotes}` : null,
    '',
    `Estimated Investment Indicator midpoint: ${order.estimatedTotal > 0 ? `$${order.estimatedTotal.toFixed(0)}` : 'TBD'}`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function getWhatsAppSendUrl(message: string) {
  // wa.me requires country code with no plus, no spaces.
  const phone = FOODIE_LAB_BUSINESS.whatsappTel;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

