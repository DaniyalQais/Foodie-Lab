export const FOODIE_LAB_BUSINESS = {
  name: 'Foodie Lab Catering',
  // Display format
  whatsapp: '+92 342 483 4128',
  // `wa.me` requires country code, no "+" and no leading zero
  whatsappTel: '923424834128',
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
