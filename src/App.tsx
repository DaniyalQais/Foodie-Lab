import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from './components/motion/PageTransition';
import ScrollReveal from './components/motion/ScrollReveal';
import RevealCard from './components/motion/RevealCard';
import HeroParticles from './components/hero/HeroParticles';
import { 
  Heart, Calendar, Users, Utensils, ShieldCheck, Mail, Phone, 
  Sparkles, Coffee, Clock, ChefHat, CheckCircle2, ChevronRight, 
  MessageSquare, ArrowUpRight, HelpCircle, Laptop, UserCheck, Truck
} from 'lucide-react';
import { CateringOrder, OrderStatus } from './types';
import { CATERING_PACKAGES, INITIAL_ORDERS } from './data';
import AdminDashboard from './components/AdminDashboard';
import SuccessMessage from './components/SuccessMessage';
import PriceEstimator from './components/PriceEstimator';
import BrandLogo from './components/BrandLogo';
import MenuPresentation from './components/MenuPresentation';
import StickyCallButton from './components/StickyCallButton';
import type { QuoteContinueInput, QuoteHandoffPayload } from './lib/quoteHandoff';
import type { OrderSendMethod } from './orderSend';
import { buildWhatsAppOrderMessage, getWhatsAppSendUrl } from './whatsapp';

export default function App() {
  const [orders, setOrders] = useState<CateringOrder[]>([]);
  const [view, setView] = useState<'home' | 'wizard' | 'admin' | 'success'>('home');
  const [latestOrder, setLatestOrder] = useState<CateringOrder | null>(null);
  const [orderSendMethod, setOrderSendMethod] = useState<OrderSendMethod | null>(null);
  const [quoteHandoff, setQuoteHandoff] = useState<QuoteHandoffPayload | null>(null);

  // Initialize and persist orders structure in localStorage
  useEffect(() => {
    const local = localStorage.getItem('foodie_lab_orders_v1');
    if (local) {
      try {
        setOrders(JSON.parse(local));
      } catch (e) {
        setOrders(INITIAL_ORDERS);
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('foodie_lab_orders_v1', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  const saveOrders = (newOrders: CateringOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem('foodie_lab_orders_v1', JSON.stringify(newOrders));
  };

  // Status Updater for Sophia and Clara
  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    const updated = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    saveOrders(updated);
  };

  // Delete Order
  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(order => order.id !== id);
    saveOrders(updated);
  };

  // Reset to original sample configurations
  const handleResetData = () => {
    if (confirm('Would you like to reset the dashboard database back to the demo mock requests?')) {
      saveOrders(INITIAL_ORDERS);
    }
  };

  // Customer creates a new inquiry
  const handleCreateOrder = (
    newInquiry: Omit<CateringOrder, 'id' | 'createdAt' | 'status'>,
    sendMethod: OrderSendMethod
  ) => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrderObj: CateringOrder = {
      ...newInquiry,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    if (sendMethod === 'whatsapp') {
      const url = getWhatsAppSendUrl(buildWhatsAppOrderMessage(fullOrderObj));
      try {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.location.assign(url);
      }
    }

    const updated = [fullOrderObj, ...orders];
    saveOrders(updated);
    setLatestOrder(fullOrderObj);
    setOrderSendMethod(sendMethod);
    setView('success');

    requestAnimationFrame(() => {
      document.getElementById('order-success')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleQuoteContinue = (draft: QuoteContinueInput) => {
    setQuoteHandoff({ ...draft, id: Date.now() });
    requestAnimationFrame(() => {
      document.getElementById('packages-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const homeStats = {
    ordersManaged: orders.length,
    eventsCatered: orders.filter(o => o.status === 'completed').length,
    happyCustomers: Math.max(orders.filter(o => o.status === 'completed').length, 48), // demo-friendly floor
  };

  return (
    <div className="font-sans antialiased text-[#2a2521] min-h-screen flex flex-col bg-[#fdfbf7]">
      
      {/* PERSISTENT HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-100 px-3 py-2.5 sm:px-4 sm:py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-2 cursor-pointer select-none min-w-0"
          >
            <BrandLogo size={40} className="w-10 h-10" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm sm:text-base md:text-lg tracking-tight text-gray-900 truncate">Foodie Lab Catering</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-terracotta-600 bg-terracotta-50 border border-terracotta-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 hidden sm:inline">Premium</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium hidden md:block">Menus, boards, and buffet setups for every occasion</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {view !== 'admin' ? (
              <button
                onClick={() => setView('admin')}
                className="text-[10px] sm:text-xs font-semibold text-gray-600 hover:text-brand-600 flex items-center gap-1 bg-gray-50 hover:bg-brand-50 px-2.5 py-2 rounded-xl transition-all border border-gray-200 cursor-pointer"
                title="Operations desk"
              >
                <ChefHat className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                <span>Ops Desk</span>
              </button>
            ) : (
              <button
                onClick={() => setView('home')}
                className="text-[10px] sm:text-xs font-semibold text-gray-600 hover:text-brand-600 flex items-center gap-1 bg-gray-50 hover:bg-brand-50 px-2.5 py-2 rounded-xl transition-all border border-gray-200 cursor-pointer"
              >
                <Laptop className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>Storefront</span>
              </button>
            )}

            {/* Core Action */}
            {view === 'home' && (
              <button
                onClick={() => setView('wizard')}
                className="text-[10px] sm:text-xs font-bold text-white bg-terracotta-500 hover:bg-terracotta-600 px-3 py-2 rounded-xl text-center shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer font-display uppercase tracking-wider whitespace-nowrap"
              >
                Get a quote
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RENDER DYNAMIC BODY CONTENT PANEL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-3 sm:p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* VIEW: VISITOR MARKETPLACE HOME */}
          {view === 'home' && (
            <PageTransition key="home" className="space-y-5 sm:space-y-8">

              {/* 1) Hero — premium layout on laptop (lg+) */}
              <section className="relative overflow-hidden rounded-3xl border border-brand-200 bg-brand-100 shadow-sm lg:rounded-[2rem] lg:border-terracotta-200/30 lg:shadow-none lg:premium-hero-shell lg:min-h-[400px]">
                <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
                  <HeroParticles />
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-terracotta-500/10 blur-3xl" />
                  <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
                </div>
                <div className="hidden lg:block absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-20" />

                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch relative z-10 lg:min-h-[400px]">
                  <div className="md:col-span-7 p-5 sm:p-7 md:p-10 space-y-3 text-left bg-gradient-to-r from-brand-100 via-brand-100/95 md:via-brand-100 to-transparent lg:col-span-6 lg:p-12 lg:pr-8 lg:space-y-5 lg:premium-hero-panel lg:flex lg:flex-col lg:justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="inline-flex items-center gap-1.5 bg-terracotta-50 text-terracotta-700 px-3 py-1 rounded-full text-[11px] font-semibold border border-terracotta-100 lg:px-4 lg:py-1.5 lg:text-xs lg:shadow-sm lg:shadow-terracotta-500/10"
                    >
                      <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500 lg:w-4 lg:h-4" />
                      Foodie Lab Catering
                      <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest text-terracotta-600/80 ml-1">
                        · Southern AZ
                      </span>
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.1 }}
                      className="text-2xl sm:text-3xl lg:text-[2.75rem] lg:leading-[1.08] font-display font-extrabold text-gray-900 leading-tight tracking-tight lg:tracking-[-0.02em]"
                    >
                      Get a quote in under{' '}
                      <span className="lg:bg-gradient-to-r lg:from-terracotta-600 lg:to-brand-600 lg:bg-clip-text lg:text-transparent">
                        30 seconds
                      </span>
                      .
                    </motion.h1>
                    <p className="text-sm text-[#554a41] leading-relaxed max-w-lg lg:text-base lg:text-gray-600 lg:max-w-md lg:leading-relaxed">
                      Pick a menu, set guests, add sides, and submit details—no checkout, no pressure.
                    </p>
                    <div className="hidden lg:flex flex-wrap gap-2 pt-1">
                      {['$15/guest baseline', 'No payment now', '24h coordinator reply'].map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-gray-600 bg-white/70 border border-white/80 px-3 py-1 rounded-full shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="pt-1 flex gap-2 lg:pt-2 lg:gap-3"
                    >
                      <motion.a
                        href="#packages-section"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-terracotta-500 to-brand-600 text-white font-bold rounded-xl shadow-lg text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer font-display will-change-transform lg:py-4 lg:px-6 lg:text-sm lg:rounded-2xl lg:shadow-xl lg:shadow-terracotta-500/25 lg:hover:shadow-terracotta-500/35 lg:transition-shadow"
                        data-cursor-hover
                      >
                        Start quote
                        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                      </motion.a>
                      <motion.button
                        type="button"
                        onClick={() => setView('wizard')}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-3 px-4 border-2 border-brand-200 bg-white hover:bg-brand-50 font-semibold text-gray-700 rounded-xl text-xs sm:text-sm cursor-pointer will-change-transform lg:py-4 lg:px-6 lg:rounded-2xl lg:border-white/60 lg:bg-white/80 lg:backdrop-blur-sm lg:shadow-md lg:hover:shadow-lg"
                        data-cursor-hover
                      >
                        Full form
                      </motion.button>
                    </motion.div>
                  </div>
                  <div className="md:col-span-5 h-[160px] sm:h-[200px] md:h-auto min-h-[220px] overflow-hidden relative lg:col-span-6 lg:min-h-[400px] lg:p-3">
                    <div className="w-full h-full overflow-hidden relative lg:rounded-[1.25rem] lg:premium-hero-image-frame lg:group">
                      <img
                        src="https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=1600&q=80"
                        alt="Catering spread"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover lg:transition-transform lg:duration-700 lg:group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-100/40 md:from-transparent to-transparent pointer-events-none lg:from-black/25 lg:via-transparent lg:to-transparent" />
                      <div className="hidden lg:flex absolute bottom-4 left-4 right-4 items-center justify-between rounded-xl bg-white/90 backdrop-blur-md border border-white/60 px-4 py-2.5 shadow-lg">
                        <span className="text-[11px] font-bold text-gray-800">Buffets · Tacos · Events</span>
                        <span className="text-[10px] font-semibold text-terracotta-600">Est. 30 sec quote</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2) Package selection + order form — horizontal header on laptop */}
              <ScrollReveal as="section" id="packages-section" className="w-full space-y-3 scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-0.5">
                  <div className="space-y-0.5 shrink-0">
                    <h2 className="text-lg sm:text-xl font-display font-extrabold text-gray-900 tracking-tight">
                      Package Selection
                    </h2>
                    <p className="text-[11px] text-gray-500">Street Tacos, Enchiladas, or Quesadillas</p>
                  </div>
                </div>
                <MenuPresentation onSubmit={handleCreateOrder} quoteHandoff={quoteHandoff} />
              </ScrollReveal>

              {/* 3) Instant Quote Calculator — premium on laptop */}
              <ScrollReveal
                as="section"
                className="p-3 sm:p-4 lg:p-0 lg:pt-2"
                delay={0.05}
              >
                <PriceEstimator packages={CATERING_PACKAGES} onContinue={handleQuoteContinue} />
              </ScrollReveal>

              {/* 5) Testimonials slider */}
              <ScrollReveal as="section" className="rounded-3xl border border-brand-100 bg-white shadow-sm overflow-hidden" delay={0.08}>
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Testimonials</div>
                    <h3 className="text-lg font-display font-extrabold text-gray-900 tracking-tight">Customers say</h3>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-700 bg-amber-warm/70 border border-brand-100 px-2.5 py-1 rounded-full shrink-0">
                    4.9 avg (demo)
                  </div>
                </div>
                <div className="px-4 pb-4 overflow-x-auto snap-x snap-mandatory flex gap-3 [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { name: 'Sarah J.', text: '“The quote was clear, delivery was on time, and everyone asked who catered.”' },
                    { name: 'Maria R.', text: '“So easy to order. The burritos were hot, labeled, and perfect for our team.”' },
                    { name: 'Chris D.', text: '“Pickup was seamless. Portions were generous and everything was packed perfectly.”' },
                  ].map(t => (
                    <RevealCard
                      key={t.name}
                      className="snap-start shrink-0 w-[260px] rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">★★★★★</div>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{t.text}</p>
                      <div className="text-[11px] text-gray-500 font-semibold mt-3">{t.name}</div>
                    </RevealCard>
                  ))}
                </div>
              </ScrollReveal>

            </PageTransition>
          )}

          {/* VIEW: ORDERING CUSTOMER WIZARD FORM */}
          {view === 'wizard' && (
            <PageTransition key="wizard">
              <MenuPresentation
                onSubmit={handleCreateOrder}
                onCancel={() => setView('home')}
              />
            </PageTransition>
          )}

          {/* VIEW: SOPHIA & CLARA OPERATION PANEL */}
          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboard 
                orders={orders} 
                onUpdateStatus={handleUpdateStatus} 
                onDeleteOrder={handleDeleteOrder}
                onResetData={handleResetData}
              />
            </motion.div>
          )}

          {/* VIEW: ORDER SUCCESS LANDING RECIPE */}
          {view === 'success' && latestOrder && (
            <PageTransition key="success" className="py-4">
              <SuccessMessage
                order={latestOrder}
                initialSendMethod={orderSendMethod}
                onClose={() => {
                  setOrderSendMethod(null);
                  setView('home');
                }}
              />
            </PageTransition>
          )}

        </AnimatePresence>
      </main>

      <footer
        className="mt-6 border-t border-neutral-800 py-6 px-4"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm font-bold tracking-tight text-neutral-200 font-display">
            Foodie Lab Catering
          </p>
          <p className="text-[11px] font-medium text-neutral-500 tracking-wide mt-1">
            Tucson • Green Valley • Vail • Marana
          </p>
          <p className="text-[10px] text-neutral-600 mt-4 block text-center">
            © 2026 Foodie Lab. Handcrafted Local Catering.
          </p>
        </div>
      </footer>

      {view !== 'admin' && view !== 'success' && <StickyCallButton />}

    </div>
  );
}
