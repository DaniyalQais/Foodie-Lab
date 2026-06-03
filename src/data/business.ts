export const FOODIE_LAB_BUSINESS = {
  name: 'Foodie Lab Catering',
  // Display format
  whatsapp: '+1 520-289-6128',
  // `wa.me` / `tel:` — country code, no "+" and no dashes
  whatsappTel: '15202896128',
  email: 'daniyalqais6@gmail.com',
  addressLine: 'W Vuelta Friso, 85629',
  addressFull: 'W Vuelta Friso, AZ 85629',
  serviceAreas: [
    'Green Valley, AZ',
    'Marana, AZ',
    'Vail, AZ',
    'Phoenix, AZ',
    'Tucson, AZ',
    'Sahuarita, AZ',
    'Corona de Tucson, AZ',
    'Rio Rico, AZ',
  ] as const,
};

export const SERVICE_AREA_LABEL = FOODIE_LAB_BUSINESS.serviceAreas.join(' · ');
