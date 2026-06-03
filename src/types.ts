export type ServiceType = 'pickup' | 'delivery';

export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'completed';

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  pricePerGuest: number;
  minGuests: number;
  whatsIncluded: string[];
  servingEstimates: string; // e.g., "3 tacos, rice, beans, chips & salsa per person"
  imageUrl?: string;
  popular?: boolean;
  startingAt?: number; // optional override when pricePerGuest is 0 (custom)
  estimatedServes?: string; // short label like "8–25 guests"
  pricingTiers?: Array<{ guests: number; price: number }>; // fixed-price tiers by guest count
  serviceNotes?: string[]; // short service terms (drop-off only, min qty, etc.)
}

export interface CateringOrder {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  eventDate: string;
  eventTime: string;
  serviceType: ServiceType;
  deliveryAddress?: string;
  packageId: string;
  guestCount: number;
  allergyInfo: string;
  specialNotes: string;
  customRequests?: string;
  status: OrderStatus;
  /** Planning midpoint for ops — display via Estimated Investment Indicator, not final checkout. */
  estimatedTotal: number;
}
