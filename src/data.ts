import { CateringPackage, CateringOrder } from './types';

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'taco-bar',
    name: 'Foodie Lab Taco Bar',
    description: 'A full taco bar experience with topping station options—built for parties, offices, and celebrations.',
    pricePerGuest: 0,
    minGuests: 20,
    popular: true,
    estimatedServes: '20–80+ guests',
    imageUrl: '/menus/tacobar-menu.png',
    whatsIncluded: [
      'Meat options (menu-based selection)',
      'Wraps + topping bar',
      'Dips and sides',
      'Optional fruit bar (as shown in menu)'
    ],
    servingEstimates: 'Built as a buffet-style taco bar with toppings station. Final quote confirmed after menu selections.'
  },
  {
    id: 'brunch-menu',
    name: 'Brunch Menu',
    description: 'A crowd-friendly brunch spread—perfect for morning events, showers, and office brunch.',
    pricePerGuest: 0,
    minGuests: 20,
    estimatedServes: '20–100 guests',
    imageUrl: '/menus/brunch-menu.png',
    whatsIncluded: [
      'Breakfast burritos (menu options)',
      'Waffles / pancakes + toppings bar',
      'Deviled eggs + sides',
      'Mix options and salads'
    ],
    servingEstimates: 'Menu-based brunch buffet. Quote confirmed after selections and headcount.'
  },
  {
    id: 'italian-pasta-bar',
    name: 'Italian Pasta Bar',
    description: 'Comforting pasta bar with sauce + topping options, plus salads and garlic bread.',
    pricePerGuest: 0,
    minGuests: 20,
    estimatedServes: '20–120 guests',
    imageUrl: '/menus/italian-pasta-bar.png',
    whatsIncluded: [
      'Meat + veggie options',
      'Pasta options + sauces',
      'Caesar salad + garlic bread',
      'Toppings bar'
    ],
    servingEstimates: 'Menu-based pasta bar buffet. Quote confirmed after selections.'
  },
  {
    id: 'corporate-coffee-break',
    name: 'Corporate Coffee Break',
    description: 'A polished coffee break setup with drinks, sweet bites, and salty bites—ideal for meetings and trainings.',
    pricePerGuest: 12,
    minGuests: 30,
    estimatedServes: '30–150 guests',
    imageUrl: '/menus/corporate-coffee-break.png',
    serviceNotes: ['Min qty 30 ppl', 'Optional 2hr service add-on (as shown)'],
    whatsIncluded: [
      'Americano / iced coffee + creamers',
      'Juices selection',
      'Sweet bites',
      'Salty bites'
    ],
    servingEstimates: 'Priced at $12/guest with a 30 guest minimum. Add-ons can be applied in the estimator.'
  },
  {
    id: 'greek-style',
    name: 'Greek Style Menu',
    description: 'A clean, modern Greek-style menu with starter, main, sides + drink options.',
    pricePerGuest: 0,
    minGuests: 20,
    popular: false,
    estimatedServes: '20–50 guests',
    imageUrl: '/menus/greek-style-menu.png',
    pricingTiers: [
      { guests: 20, price: 300 },
      { guests: 30, price: 395 },
      { guests: 40, price: 485 },
      { guests: 50, price: 595 },
    ],
    serviceNotes: ['Drop-off service pricing (as shown)'],
    whatsIncluded: [
      'Starter: hummus + pita bread cuts',
      'Main: meatballs and chicken bites',
      'Greek salad + sides & bread',
      'Drink: cucumber lemonade',
    ],
    servingEstimates: 'Tiered pricing by guest count. Select your tier in the estimator.'
  },
  {
    id: 'sweet-bites',
    name: 'Sweet Bites',
    description: 'Dessert table options including cheesecake cups, fruit cups, donuts bar, and more.',
    pricePerGuest: 0,
    minGuests: 15,
    estimatedServes: '15–120 guests',
    imageUrl: '/menus/sweet-bites.png',
    whatsIncluded: [
      'Cheesecake cups',
      'Fruit cuts / parfaits',
      'Cookies + charcuterie cups',
      'Donuts bar',
    ],
    servingEstimates: 'Menu-based dessert selection. Quote confirmed after selection + headcount.'
  },
  {
    id: 'cocktail-hour',
    name: 'Cocktail Hour Appetizers',
    description: 'Starters + board services built for receptions, celebrations, and corporate events.',
    pricePerGuest: 0,
    minGuests: 20,
    estimatedServes: '20–150 guests',
    imageUrl: '/menus/cocktail-hour.png',
    whatsIncluded: [
      'Appetizers / starters selection',
      'Board services',
      'Cup size dishes',
    ],
    servingEstimates: 'Menu-based appetizer service. Quote confirmed after selection.'
  },
  {
    id: 'custom-catering',
    name: 'Custom Catering',
    description: 'Tell us your vision and we’ll build the menu around your event, venue, and dietary needs.',
    pricePerGuest: 0,
    minGuests: 10,
    startingAt: 18,
    estimatedServes: 'Any group size',
    imageUrl: '/menus/custom-menu.png',
    whatsIncluded: [
      'Menu consultation',
      'Dietary accommodations',
      'Event timeline + service planning',
    ],
    servingEstimates: 'Custom quote based on menu + service style.'
  },
  {
    id: 'breakfast-burritos-order',
    name: 'Breakfast Burritos Order',
    description: 'Drop-off service only. Includes a bulk burrito order with sides—great for morning meetings.',
    pricePerGuest: 0,
    minGuests: 100,
    popular: false,
    estimatedServes: '100 guests',
    imageUrl: '/menus/breakfast-burritos-order.png',
    pricingTiers: [{ guests: 100, price: 540 }],
    serviceNotes: ['Drop-off service only (as shown)'],
    whatsIncluded: [
      '90 flour tortilla burritos',
      '10 corn tortilla burritos (gluten free)',
      'Side: refried beans (Mexican style full pan)',
    ],
    servingEstimates: 'Fixed package shown as $540 total.'
  },
  {
    id: 'platillos-menu',
    name: 'Platillos (Meal Service)',
    description: 'A plated-style service menu with main, side, and dessert options.',
    pricePerGuest: 0,
    minGuests: 20,
    popular: true,
    estimatedServes: '20–50 guests',
    imageUrl: '/menus/platillos-menu.png',
    pricingTiers: [
      { guests: 20, price: 20 * 20 },
      { guests: 30, price: 19 * 30 },
      { guests: 40, price: 18 * 40 },
      { guests: 50, price: 17.5 * 50 },
    ],
    serviceNotes: ['Price per plate/service (as shown)'],
    whatsIncluded: [
      'Main dish options',
      'Secondary dish / salad',
      'Dessert: mini cheesecake cups with chopped fruit',
    ],
    servingEstimates: 'Tiered pricing derived from per-person price on the flyer.'
  },
  {
    id: 'main-dishes-menu',
    name: 'Main Dishes + Side Dishes',
    description: 'A flexible menu list for building your event proposal.',
    pricePerGuest: 0,
    minGuests: 15,
    estimatedServes: '15–150 guests',
    imageUrl: '/menus/main-dishes-menu.png',
    whatsIncluded: [
      'Main dishes: barbacoa mexicana, quesabirrias, pulled pork, tamales, sliders, pasta salad, fruit cuts bar…',
      'Plus: XL burro percheron, salisbury steak, turkey, glazed ham, chicken creamy stew, 3-layers lasagna…',
      'Side dishes: red rice, macaroni pasta, mac & cheese, beans, salads, potatoes, veggies…',
    ],
    servingEstimates: 'Menu list used to customize proposals. Quote confirmed after selection.'
  },
  {
    id: 'valentines-menu',
    name: "Valentine’s Menu",
    description: 'Seasonal menu—appetizer, main course options, dessert + mocktail.',
    pricePerGuest: 0,
    minGuests: 10,
    estimatedServes: '10–50 guests',
    imageUrl: '/menus/valentines-menu.png',
    serviceNotes: ['10 ppl minimum order (as shown)'],
    whatsIncluded: [
      'Appetizer: Caesar salad with shrimp + bread',
      'Main: cucumber rolls + vegetables OR roast steak stew + sides',
      'Dessert: cheesecake cups',
      'Mocktail: pineapple/orange lemonade',
    ],
    servingEstimates: 'Seasonal package. Quote confirmed after headcount.'
  }
];

export const INITIAL_ORDERS: CateringOrder[] = [
  {
    id: 'ORD-1042',
    createdAt: '2026-06-01T15:30:00Z',
    fullName: 'David Robinson',
    phone: '(555) 382-9014',
    email: 'david.robinson@gmail.com',
    eventDate: '2026-06-12',
    eventTime: '13:00',
    serviceType: 'delivery',
    deliveryAddress: '742 Evergreen Terrace, Springfield',
    packageId: 'taco-bar',
    guestCount: 25,
    allergyInfo: 'One guest is severely allergic to cilantro (please pack cilantro separately!)',
    specialNotes: 'This is my daughter’s high school graduation party. She absolutely loves your carne asada!',
    status: 'new',
    estimatedTotal: 412.50
  },
  {
    id: 'ORD-1041',
    createdAt: '2026-06-01T09:12:00Z',
    fullName: 'Maria Rodriguez',
    phone: '(555) 472-8831',
    email: 'm.rodriguez@outlook.com',
    eventDate: '2026-06-08',
    eventTime: '18:00',
    serviceType: 'pickup',
    packageId: 'burrito-package',
    guestCount: 12,
    allergyInfo: 'No major allergies',
    specialNotes: 'Weekly family game night gathering. Standard assortment of half pork and half veggie burritos please.',
    status: 'new',
    estimatedTotal: 180.00
  },
  {
    id: 'ORD-1040',
    createdAt: '2026-05-30T16:45:00Z',
    fullName: 'Sarah Jenkins',
    phone: '(555) 891-2304',
    email: 'sarah.j@techstart.io',
    eventDate: '2026-06-15',
    eventTime: '12:00',
    serviceType: 'delivery',
    deliveryAddress: '404 Innovation Way, Suite 200',
    packageId: 'family-fiesta',
    guestCount: 35,
    allergyInfo: 'Gluten-free menu items labeled please, several vegetarians.',
    specialNotes: 'Monthly company team lunch. Please set up the catering trays on our main kitchen island.',
    status: 'contacted',
    estimatedTotal: 770.00
  },
  {
    id: 'ORD-1039',
    createdAt: '2026-05-28T11:00:00Z',
    fullName: 'Robert Henderson',
    phone: '(555) 234-9087',
    email: 'rob.henderson@comcast.net',
    eventDate: '2026-06-06',
    eventTime: '17:30',
    serviceType: 'delivery',
    deliveryAddress: '1589 Whispering Pines Circle',
    packageId: 'custom-package',
    guestCount: 50,
    allergyInfo: 'Shellfish and peanut allergies.',
    specialNotes: 'Backyard anniversary reception. We would love to discuss custom grazing appetizers and customized tacos.',
    status: 'confirmed',
    estimatedTotal: 950.00 // Custom estimated price
  },
  {
    id: 'ORD-1038',
    createdAt: '2026-05-24T14:15:00Z',
    fullName: 'Emily Watson',
    phone: '(555) 671-3329',
    email: 'emily.watson@yahoo.com',
    eventDate: '2026-05-31',
    eventTime: '11:30',
    serviceType: 'pickup',
    packageId: 'taco-bar',
    guestCount: 15,
    allergyInfo: 'Dairy-free needed (chicken without cotija cheese)',
    specialNotes: 'Simple family Sunday lunch. Thank you moms, you are the best!',
    status: 'completed',
    estimatedTotal: 247.50
  }
];
