export interface MenuProteinOption {
  id: string;
  title: string;
  description: string;
}

export interface MainPackage {
  id: string;
  label: string;
  minGuests: number;
  /** Shown under tabs when this package is active */
  tagline: string;
  /** Section heading for protein/filling picker */
  choiceHeading: string;
  defaultChoiceIds: string[];
}

export interface SingleMenuItem {
  id: string;
  name: string;
  /** Planning price per unit/tray (qty × unitPrice). */
  unitPrice: number;
}

export const MAIN_PACKAGES: MainPackage[] = [
  {
    id: 'street-tacos',
    label: 'Street Tacos',
    minGuests: 10,
    tagline: 'Build-your-own taco bar with proteins, tortillas, and toppings.',
    choiceHeading: 'Choose proteins',
    defaultChoiceIds: ['carne-asada', 'pollo-asado'],
  },
  {
    id: 'enchiladas',
    label: 'Enchiladas',
    minGuests: 10,
    tagline: 'Baked enchilada trays with rice, beans, and your choice of sauce.',
    choiceHeading: 'Choose fillings',
    defaultChoiceIds: ['ench-chicken', 'ench-cheese'],
  },
  {
    id: 'quesadillas',
    label: 'Quesadillas',
    minGuests: 10,
    tagline: 'Griddled quesadilla platters with salsa, guac, and sides.',
    choiceHeading: 'Choose fillings',
    defaultChoiceIds: ['ques-chicken', 'ques-cheese'],
  },
];

export const TACO_BAR_PROTEINS: MenuProteinOption[] = [
  {
    id: 'carne-asada',
    title: 'Grilled Carne Asada',
    description: 'Slow-marinated steak, sliced thin for street tacos.',
  },
  {
    id: 'pollo-asado',
    title: 'Pollo Asado',
    description: 'Citrus-herb chicken, flame-kissed and juicy.',
  },
  {
    id: 'carnitas',
    title: 'Carnitas',
    description: 'Crispy-edged, slow-braised pork with rich flavor.',
  },
  {
    id: 'birria',
    title: 'Birria',
    description: 'Chile-braised beef, perfect for quesabirria-style tacos.',
  },
  {
    id: 'chipotle-cauliflower',
    title: 'Roasted Chipotle Cauliflower',
    description: 'Smoky, vegetarian-friendly option with great crunch.',
  },
  {
    id: 'barbacoa',
    title: 'Barbacoa Mexicana',
    description: 'Earthy beef stew with potatoes, carrots, and olives.',
  },
];

export const ENCHILADA_FILLINGS: MenuProteinOption[] = [
  {
    id: 'ench-chicken',
    title: 'Shredded Chicken',
    description: 'Classic red or green enchilada filling.',
  },
  {
    id: 'ench-cheese',
    title: 'Three-Cheese',
    description: 'Monterey jack, cotija, and queso blend.',
  },
  {
    id: 'ench-beef',
    title: 'Seasoned Beef',
    description: 'Slow-braised picadillo-style beef.',
  },
  {
    id: 'ench-veggie',
    title: 'Roasted Veggie',
    description: 'Poblano, corn, and zucchini.',
  },
];

export const ENCHILADA_SAUCES: Array<{ id: string; label: string }> = [
  { id: 'red', label: 'Red enchilada sauce' },
  { id: 'green', label: 'Green tomatillo' },
  { id: 'both', label: 'Half red / half green' },
];

export const QUESADILLA_FILLINGS: MenuProteinOption[] = [
  {
    id: 'ques-chicken',
    title: 'Grilled Chicken',
    description: 'Citrus-herb chicken with melted cheese.',
  },
  {
    id: 'ques-cheese',
    title: 'Cheese Blend',
    description: 'Oaxaca and Monterey jack.',
  },
  {
    id: 'ques-steak',
    title: 'Carne Asada',
    description: 'Marinated steak strips.',
  },
  {
    id: 'ques-veggie',
    title: 'Veggie',
    description: 'Peppers, onion, and mushrooms.',
  },
];

export function getPackageChoices(packageId: string): MenuProteinOption[] {
  switch (packageId) {
    case 'enchiladas':
      return ENCHILADA_FILLINGS;
    case 'quesadillas':
      return QUESADILLA_FILLINGS;
    default:
      return TACO_BAR_PROTEINS;
  }
}

/** Compact add-ons below main packages — qty via counters, priced per unit */
export const SINGLE_ITEMS: SingleMenuItem[] = [
  { id: 'chips-salsa', name: 'Chips & Salsa', unitPrice: 4 },
  { id: 'guac', name: 'Fresh Guacamole', unitPrice: 5 },
  { id: 'red-rice', name: 'Mexican Red Rice', unitPrice: 4 },
  { id: 'refried-beans', name: 'Refried Beans', unitPrice: 4 },
  { id: 'street-corn', name: 'Street Corn Cup', unitPrice: 4 },
  { id: 'queso', name: 'Queso Dip', unitPrice: 5 },
  { id: 'churros', name: 'Churros Tray', unitPrice: 5 },
  { id: 'horchata', name: 'Horchata Pitcher', unitPrice: 5 },
  { id: 'fruit-cup', name: 'Fruit Cup', unitPrice: 4 },
  { id: 'salad', name: 'House Salad', unitPrice: 4 },
];

export const PACKAGE_TO_ORDER_ID: Record<string, string> = {
  'street-tacos': 'taco-bar',
  enchiladas: 'custom-catering',
  quesadillas: 'custom-catering',
};

export const ORDER_POLICIES: Array<{ title: string; body: string }> = [
  {
    title: 'Deposits & minimums',
    body:
      'A non-refundable deposit may be required to hold your event date. Minimum guest counts vary by package. Final headcount is due 72 hours before service.',
  },
  {
    title: 'Delivery & drop-off',
    body:
      'Drop-off windows are scheduled in 30-minute blocks. Delivery is available within our Southern Arizona service area. Fees may apply based on distance from our kitchen at W Vuelta Friso, 85629.',
  },
];
