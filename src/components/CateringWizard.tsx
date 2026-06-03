import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Calendar, Clock, MapPin, Utensils, Users, MessageSquare, 
  ChevronRight, ChevronLeft, Check, Sparkles, Truck, Coffee,
  AlertTriangle, DollarSign, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';
import { CateringOrder, CateringPackage, ServiceType } from '../types';
import { CATERING_PACKAGES } from '../data';

interface CateringWizardProps {
  onSubmit: (
    newOrder: Omit<CateringOrder, 'id' | 'createdAt' | 'status'>,
    sendMethod: 'whatsapp' | 'email'
  ) => void;
  onCancel: () => void;
}

export default function CateringWizard({ onSubmit, onCancel }: CateringWizardProps) {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('taco-bar');
  const [guestCount, setGuestCount] = useState<number>(15);
  const [allergyInfo, setAllergyInfo] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [customRequests, setCustomRequests] = useState('');

  // Selected package details memo
  const selectedPackage = useMemo(() => {
    return CATERING_PACKAGES.find(p => p.id === selectedPackageId) || CATERING_PACKAGES[0];
  }, [selectedPackageId]);

  // Adjust guest count if package minimum is higher
  const minGuestsAllowed = selectedPackage.minGuests;
  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const targetPkg = CATERING_PACKAGES.find(p => p.id === pkgId);
    if (targetPkg && guestCount < targetPkg.minGuests) {
      setGuestCount(targetPkg.minGuests);
    }
  };

  // Live Serving Volume Estimator
  const servingsEstimate = useMemo(() => {
    if (selectedPackageId === 'taco-bar') {
      const tacos = guestCount * 3;
      const guacamoleTubs = Math.ceil(guestCount / 10);
      const riceTrays = Math.ceil(guestCount / 15);
      const beanTrays = Math.ceil(guestCount / 15);
      return {
        main: `${tacos} Gourmet Street Tacos`,
        extras: [
          `${guacamoleTubs} large tub${guacamoleTubs > 1 ? 's' : ''} of Clara’s hand-mashed guacamole`,
          'Our warm House-fried tortilla chips',
          `${riceTrays} large tray${riceTrays > 1 ? 's' : ''} of Mexican red rice`,
          `${beanTrays} large tray${beanTrays > 1 ? 's' : ''} of slow-cooked seasoned black beans`,
          'Fresh salsa roja & salsa verde bottles, lime platters, cilantro, and onions'
        ]
      };
    } else if (selectedPackageId === 'burrito-package') {
      return {
        main: `${guestCount} Hearty Gourmet Burritos`,
        extras: [
          'Individually wrapped wraps in foil for neat heat retention',
          `${guestCount} individual bags of crispy corn tortilla chips`,
          '12oz smoke-roasted fire salsa tubs',
          `${guestCount} warm, cinnamon-sugar dusting Churros for dessert`
        ]
      };
    } else if (selectedPackageId === 'family-fiesta') {
      const hotTraysMole = Math.ceil(guestCount / 15);
      const hotTraysCarnitas = Math.ceil(guestCount / 15);
      const tamalesCount = guestCount * 1.5; // 1.5 tamales per person!
      return {
        main: `${guestCount} portions of Pork Carnitas & Chicken Mole`,
        extras: [
          `${Math.round(tamalesCount)} handmade sweet corn & green chile tamales`,
          'Crisp Mexican Caesar salad bowl with spiced pepitas',
          'Premium refried pinto beans and green-herb rice platters',
          `${Math.ceil(guestCount / 8)} large pitchers of fresh Horchata and Jamaica tea`
        ]
      };
    } else {
      return {
        main: `Custom menu tailored for ${guestCount} guests`,
        extras: [
          'Clara & Sophia will review all desired dishes with you',
          'Accommodations for any strict food sensitivities/allergies',
          'Service styled exactly to your venue layout'
        ]
      };
    }
  }, [selectedPackageId, guestCount]);

  // Compute live estimated total
  const estimatedTotal = useMemo(() => {
    if (selectedPackage.pricePerGuest === 0) {
      // Custom order estimate base placeholder with manual call trigger
      return 0; 
    }
    const foodCost = selectedPackage.pricePerGuest * guestCount;
    const deliveryFee = serviceType === 'delivery' ? 30 : 0;
    return foodCost + deliveryFee;
  }, [selectedPackage, guestCount, serviceType]);

  // Handle next/prev steps
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Basic client side validation
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!fullName.trim()) {
          alert('Please enter your full name.');
          return false;
        }
        if (!phone.trim() || phone.length < 7) {
          alert('Please enter a valid phone number so Clara or Sophia can reach you.');
          return false;
        }
        if (!email.trim() || !email.includes('@')) {
          alert('Please enter a valid email address.');
          return false;
        }
        return true;
      case 2:
        if (!eventDate) {
          alert('Please choose your event date.');
          return false;
        }
        if (!eventTime) {
          alert('Please select your preferred event time.');
          return false;
        }
        if (serviceType === 'delivery' && !deliveryAddress.trim()) {
          alert('Please provide a delivery address for our moms-on-the-go drop-off.');
          return false;
        }
        return true;
      case 3:
        if (!selectedPackageId) {
          alert('Please select a catering option.');
          return false;
        }
        return true;
      case 4:
        if (guestCount < minGuestsAllowed) {
          alert(`This package requires a minimum of ${minGuestsAllowed} guests to cover costs.`);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleFinalSubmit = () => {
    const sendMethod: 'whatsapp' | 'email' = window.confirm(
      'Send your request via WhatsApp?\n\nOK = WhatsApp\nCancel = Email'
    )
      ? 'whatsapp'
      : 'email';

    onSubmit(
      {
        fullName,
        phone,
        email,
        eventDate,
        eventTime,
        serviceType,
        deliveryAddress: serviceType === 'delivery' ? deliveryAddress : undefined,
        packageId: selectedPackageId,
        guestCount,
        allergyInfo,
        specialNotes,
        customRequests: selectedPackageId === 'custom-package' ? customRequests : undefined,
        estimatedTotal,
      },
      sendMethod
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-brand-100 overflow-hidden max-w-2xl mx-auto">
      {/* Multi-step Header banner */}
      <div className="bg-gradient-to-r from-terracotta-500 to-brand-600 text-white p-6 relative">
        <div className="absolute right-4 top-4 bg-white/10 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
          <Heart className="w-3" fill="currentColor" /> Crafted fresh with love
        </div>
        <div className="text-xs text-brand-100 font-medium uppercase tracking-widest mb-1">
          Catering Booking Request
        </div>
        <h2 className="text-2xl font-display font-medium">
          {step === 6 ? 'Review Your Feast' : 'Let’s Plan Your Event'}
        </h2>
        <p className="text-sm text-brand-100 mt-1">
          Step {step} of {totalSteps}: {
            step === 1 ? 'Contact Information' :
            step === 2 ? 'Date & Location' :
            step === 3 ? 'Choose Your Package' :
            step === 4 ? 'Tailor Guest Size' :
            step === 5 ? 'Allergy & Notes' : 'Confirm Your Details'
          }
        </p>
        
        {/* Step Progress Line Indicator */}
        <div className="flex gap-1.5 mt-5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 <= step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* STEP 1: CUSTOMER INFO */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-terracotta-50 rounded-2xl flex gap-3 text-terracotta-800 text-sm">
                  <Sparkles className="w-5 h-5 shrink-0 text-terracotta-500 mt-0.5" />
                  <div>
                    <span className="font-semibold">Hi! We are Clara and Sophia.</span> Provide your details below so we can contact you directly and simplify your planning.
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. David Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        placeholder="david@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EVENT INFO */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="eventDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">Event Time (Drop-off/Pickup)</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="eventTime"
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-sm font-medium text-gray-700">Fulfillment Method</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType('pickup')}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium border-2 transition-all cursor-pointer ${
                        serviceType === 'pickup'
                          ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Coffee className="w-5 h-5" />
                      <span>Free Studio Pickup</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType('delivery')}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium border-2 transition-all cursor-pointer ${
                        serviceType === 'delivery'
                          ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      <span>Drop-off Delivery (+$30)</span>
                    </button>
                  </div>
                </div>

                {serviceType === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Full Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="deliveryAddress"
                        type="text"
                        placeholder="Street, City, Zip Code"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      🚗 We currently deliver within 15 miles of our main home kitchen.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 3: SELECT PACKAGE */}
            {step === 3 && (
              <div className="space-y-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">Select a Fresh Homemade Feast:</span>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {CATERING_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-brand-500 relative ${
                        selectedPackageId === pkg.id
                          ? 'border-brand-500 bg-brand-50/70'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {selectedPackageId === pkg.id && (
                        <div className="absolute top-4 right-4 bg-brand-500 text-white rounded-full p-1 animate-pulse">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-gray-900">{pkg.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{pkg.description}</p>
                        </div>
                        <div className="text-right shrink-0 mt-0.5 pl-3">
                          {pkg.pricePerGuest > 0 ? (
                            <div>
                              <span className="text-lg font-bold text-terracotta-700">${pkg.pricePerGuest.toFixed(2)}</span>
                              <span className="text-xs text-gray-500 block">/ guest</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-100">Contact Us</span>
                          )}
                        </div>
                      </div>

                      {/* Small list of insights */}
                      <div className="mt-2.5 pt-2.5 border-t border-dashed border-gray-100 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-brand-500" /> Min {pkg.minGuests} guests</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-terracotta-500" /> Cooked Fresh</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: GUEST COUNT WITH PORTION ESTIMATES */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="bg-brand-50 rounded-2xl p-4 flex justify-between items-center border border-brand-100">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-gray-800">Catering for:</span>
                    <p className="text-xs text-gray-500 font-medium">{selectedPackage.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guestCount <= minGuestsAllowed}
                      onClick={() => setGuestCount(prev => Math.max(minGuestsAllowed, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={guestCount}
                      min={minGuestsAllowed}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setGuestCount(Math.max(1, val));
                      }}
                      className="w-16 text-center text-xl font-display font-bold text-gray-900 border-b-2 border-brand-500 py-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setGuestCount(prev => prev + 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {guestCount < minGuestsAllowed && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-2 text-xs text-amber-800 items-center">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>This menu requires at least {minGuestsAllowed} guests. We’ve set this minimum to cover cooking costs!</span>
                  </div>
                )}

                {/* Serving Estimate Box */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-sage-50 text-sage-700 text-[10px] uppercase tracking-wider font-semibold py-1 px-3 rounded-bl-xl border-l border-b border-sage-100">
                    Est. Portions
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-terracotta-500" />
                    <h4 className="font-display font-bold text-gray-900">What’s Included for {guestCount} Guests:</h4>
                  </div>
                  <p className="font-medium text-gray-800 mb-2 underline decoration-brand-200 decoration-2">
                    {servingsEstimate.main}
                  </p>
                  <ul className="space-y-1.5 pl-1">
                    {servingsEstimate.extras.map((extra, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="inline-block text-brand-500 font-bold leading-none mt-1 shrink-0">•</span>
                        <span>{extra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 5: DIETARIES & NOTES */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="allergyInfo" className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-terracotta-500" /> Allergies or Food Sensitivities
                  </label>
                  <textarea
                    id="allergyInfo"
                    value={allergyInfo}
                    onChange={(e) => setAllergyInfo(e.target.value)}
                    placeholder="e.g. Grandma has a severe peanut allergy. Please make sure no nuts go in the prep. Gluten-free option requested."
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none text-sm"
                  />
                </div>

                {selectedPackageId === 'custom-package' ? (
                  <div className="space-y-1">
                    <label htmlFor="customRequests" className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-500" /> What are you craving?
                    </label>
                    <textarea
                      id="customRequests"
                      value={customRequests}
                      onChange={(e) => setCustomRequests(e.target.value)}
                      placeholder="Give us a hint! Enchiladas? Sopes? Dessert boards? Tell us your dream menu."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-500" /> Additional Notes or Custom Touches
                    </label>
                    <textarea
                      id="specialNotes"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. This is an outdoor patio birthday party! We’d love for drop-off to happen around 3:45 PM right before presentation."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-terracotta-500 focus:bg-white focus:ring-1 focus:ring-terracotta-500 transition-all outline-none text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: SUMMARY REVIEW */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="p-4 bg-sage-50 text-sage-800 rounded-2xl border border-sage-100 flex gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm text-sage-900">Your details are formatted!</span> No commitment yet. Clara & Sophia will review your menu, confirm availability, and email/text you within 24 hours to secure the slot!
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column - Contact Details */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3.5 border border-gray-100 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                      <h4 className="font-bold text-gray-900 flex items-center gap-1.5"><User className="w-4 h-4 text-brand-500" /> Contact Info</h4>
                      <button type="button" onClick={() => setStep(1)} className="text-xs text-terracotta-600 hover:underline font-semibold">Edit</button>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-700">
                      <div><span className="font-medium text-gray-500">Name:</span> {fullName}</div>
                      <div><span className="font-medium text-gray-500">Phone:</span> {phone}</div>
                      <div><span className="font-medium text-gray-500">Email:</span> {email}</div>
                    </div>
                  </div>

                  {/* Right Column - Event Schedule */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3.5 border border-gray-100 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                      <h4 className="font-bold text-gray-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-500" /> Event Schedule</h4>
                      <button type="button" onClick={() => setStep(2)} className="text-xs text-terracotta-600 hover:underline font-semibold">Edit</button>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-700">
                      <div><span className="font-medium text-gray-500">Date:</span> {eventDate}</div>
                      <div><span className="font-medium text-gray-500">Time:</span> {eventTime}</div>
                      <div><span className="font-medium text-gray-500">Method:</span> <span className="capitalize">{serviceType}</span></div>
                      {serviceType === 'delivery' && (
                        <div className="truncate"><span className="font-medium text-gray-500">Address:</span> {deliveryAddress}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Package Selected Details */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3.5 border border-gray-100 text-sm">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1.5"><Utensils className="w-4 h-4 text-brand-500" /> Selected Package</h4>
                    <button type="button" onClick={() => setStep(3)} className="text-xs text-terracotta-600 hover:underline font-semibold">Edit</button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">{selectedPackage.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Quantity catering for: <span className="font-bold text-gray-900">{guestCount} Guests</span></div>
                    </div>
                    {selectedPackage.pricePerGuest > 0 ? (
                      <div className="text-right">
                        <span className="text-xs text-gray-500 font-medium">Est. Food Price:</span>
                        <div className="font-bold text-gray-900">${(selectedPackage.pricePerGuest * guestCount).toFixed(2)}</div>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-100">Custom menu consultation</span>
                    )}
                  </div>
                  
                  {/* Live estimate display */}
                  <div className="pt-2.5 border-t border-dashed border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-white p-2.5 rounded-xl">
                    <span className="flex items-center gap-1 text-sage-600 font-medium"><Heart className="w-3.5 h-3.5" /> Food portion sizes check: Guaranteed healthy fresh catering quantities.</span>
                  </div>
                </div>

                {/* Grand Price Tag Estimate Box */}
                <div className="bg-brand-100/50 border border-brand-200/50 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-medium text-brand-700 block uppercase tracking-wider">Estimated Booking Price</span>
                    <span className="text-xs text-gray-500 mt-1 block">Includes setup platters, cold preservation packs.</span>
                  </div>
                  <div className="text-right">
                    {estimatedTotal > 0 ? (
                      <div>
                        <div className="text-3xl font-display font-extrabold text-terracotta-700">${estimatedTotal.toFixed(2)}</div>
                        <span className="text-[10px] text-gray-500 block">Food + delivery, plus tax (calculated on final receipt)</span>
                      </div>
                    ) : (
                      <div className="text-lg font-display font-semibold text-sage-700 uppercase tracking-wide">Pending Consultation</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
          <button
            type="button"
            onClick={step === 1 ? onCancel : prevStep}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-gray-100 font-medium text-gray-600 transition-all cursor-pointer text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-6 py-3 bg-terracotta-500 text-white font-semibold rounded-xl hover:bg-terracotta-600 shadow-md shadow-terracotta-500/15 cursor-pointer active:scale-95 transition-all text-sm font-display"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-terracotta-500 to-brand-600 text-white font-bold rounded-xl hover:from-terracotta-600 hover:to-brand-700 shadow-lg shadow-terracotta-500/20 active:scale-95 transition-all cursor-pointer text-sm font-display uppercase tracking-wider"
            >
              <span>Submit Request!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
