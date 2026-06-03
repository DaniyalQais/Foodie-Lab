import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Filter, Calendar, Clock, MapPin, Phone, Mail, 
  Utensils, CheckCircle, Clock3, AlertCircle, TrendingUp, Users, 
  DollarSign, Copy, Check, ChevronRight, RotateCcw, HelpCircle, Heart, Trash2, ShoppingBag, Coffee, MessageCircle
} from 'lucide-react';
import { CateringOrder, OrderStatus } from '../types';
import { CATERING_PACKAGES } from '../data';
import { buildWhatsAppOrderMessage, getWhatsAppSendUrl } from '../whatsapp';

interface AdminDashboardProps {
  orders: CateringOrder[];
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onResetData: () => void;
}

export default function AdminDashboard({ orders, onUpdateStatus, onDeleteOrder, onResetData }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Order details
  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Set default selected order on load if none selected
  useMemo(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  // Handle Quick Copy Template
  const handleCopySMSTemplate = (order: CateringOrder) => {
    const pkgName = CATERING_PACKAGES.find(p => p.id === order.packageId)?.name || 'Custom Package';
    const deliveryStr = order.serviceType === 'delivery' 
      ? `deliver to ${order.deliveryAddress}` 
      : 'pick up at our studio';
      
    const textMsg = `Hi ${order.fullName}! Sophia and Clara here from Moms’ Catering Co. 👩‍🍳 We received your request for the ${pkgName} for ${order.guestCount} guests on ${order.eventDate} at ${order.eventTime} (${order.serviceType}). We are available and would love to cook for you! Would you like us to finalize this booking?`;
    
    navigator.clipboard.writeText(textMsg);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleOpenWhatsApp = (order: CateringOrder) => {
    const msg = buildWhatsAppOrderMessage(order);
    window.open(getWhatsAppSendUrl(msg), '_blank', 'noreferrer');
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchQuery = order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.phone.includes(searchQuery) ||
                          order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Key visual metrics
  const metrics = useMemo(() => {
    const active = orders.filter(o => o.status !== 'completed');
    const totalPendingRev = active.reduce((sum, o) => sum + o.estimatedTotal, 0);
    const totalActiveGuests = active.reduce((sum, o) => sum + o.guestCount, 0);
    
    return {
      activeCount: active.length,
      pendingRevenue: totalPendingRev,
      totalGuestsToPrep: totalActiveGuests,
      completedCount: orders.filter(o => o.status === 'completed').length,
    };
  }, [orders]);

  // Status helper colors
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            New Request
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            <Clock3 className="w-3 h-3" />
            Contacted
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <Check className="w-3 h-3" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase block tracking-wider">Active Requests</span>
            <span className="text-2xl font-bold text-gray-800">{metrics.activeCount} Booking{metrics.activeCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase block tracking-wider">Total Guests To Prep</span>
            <span className="text-2xl font-bold text-gray-800">{metrics.totalGuestsToPrep} People</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase block tracking-wider font-sans">Indicative Pipeline Value</span>
            <span className="text-2xl font-bold text-gray-800">${metrics.pendingRevenue.toFixed(0)}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase block tracking-wider">Completed events</span>
            <span className="text-2xl font-bold text-gray-800">{metrics.completedCount} Served</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Hand: Orders Inbox List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-100 overflow-hidden shadow-sm flex flex-col h-[580px]">
          {/* Header Section with Search & Filter */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-gray-800 flex items-center gap-1.5 text-base">
                <ShoppingBag className="w-5 h-5 text-terracotta-500" />
                Requests Inbox ({filteredOrders.length})
              </h3>
              <button
                onClick={onResetData}
                title="Reset to default sample data"
                className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 bg-white hover:bg-terracotta-50 px-2 py-1 rounded-lg border border-terracotta-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Data
              </button>
            </div>

            {/* Inputs bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search client, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none focus:border-terracotta-500"
                />
              </div>

              {/* Status Select dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 px-2 py-1.5 rounded-xl text-xs outline-none focus:border-terracotta-500 font-medium text-gray-600 cursor-pointer"
              >
                <option value="all">All States</option>
                <option value="new">New Request</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Scrolling requests inbox list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-2 mt-12">
                <HelpCircle className="w-8 h-8 mx-auto text-gray-300 animate-bounce" />
                <p className="text-sm font-medium">No requests match query</p>
                <p className="text-xs">Try selecting 'All States' above or typing another name.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const pkg = CATERING_PACKAGES.find(p => p.id === order.packageId);
                const isSelected = order.id === selectedOrderId;
                
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3.5 transition-all cursor-pointer text-left hover:bg-brand-50/50 relative ${
                      isSelected ? 'bg-brand-50/90 border-r-4 border-brand-500' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono block">#{order.id} • {new Date(order.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{order.fullName}</h4>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs font-medium text-gray-600 truncate max-w-[150px] bg-gray-100 px-2 py-0.5 rounded">
                        {pkg?.name || 'Custom Orders'}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {order.guestCount} Guests • {order.estimatedTotal > 0 ? `$${order.estimatedTotal}` : 'Custom'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-2">
                      <Calendar className="w-3 h-3 text-brand-500" />
                      <span>Event: <span className="font-semibold text-gray-700">{order.eventDate}</span> at {order.eventTime}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Hand: Detailed Order Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-100 overflow-hidden shadow-sm h-[580px] flex flex-col justify-between">
          {selectedOrder ? (
            <div className="flex flex-col h-full justify-between">
              {/* Review Header Panel */}
              <div className="p-5 border-b border-gray-100 bg-brand-50/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 font-mono block">Request Reference: {selectedOrder.id}</span>
                  <p className="text-xs text-gray-400 font-medium">Submitted on {new Date(selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                {/* Trash delete option */}
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedOrder.fullName}'s booking?`)) {
                      onDeleteOrder(selectedOrder.id);
                      setSelectedOrderId(orders.find(o => o.id !== selectedOrder.id)?.id || null);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Remove Booking"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-left">
                {/* Section 1: Customer Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer & Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-medium">Full Name:</span>
                      <span className="font-bold text-gray-800 text-sm">{selectedOrder.fullName}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-bold">Quick text template replies:</span>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handleOpenWhatsApp(selectedOrder)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer bg-[#25D366] hover:bg-[#1fb45a] text-white shadow-xs"
                          title="Open WhatsApp with a prefilled message"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Send via WhatsApp</span>
                        </button>
                        <button
                          onClick={() => handleCopySMSTemplate(selectedOrder)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            copiedId === selectedOrder.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-xs'
                          }`}
                        >
                          {copiedId === selectedOrder.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-medium">Telephone:</span>
                      <a href={`tel:${selectedOrder.phone}`} className="font-semibold text-terracotta-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {selectedOrder.phone}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-medium">Email:</span>
                      <a href={`mailto:${selectedOrder.email}`} className="font-semibold text-terracotta-600 hover:underline flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {selectedOrder.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Section 2: Catering Setup / Package */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Booking Specifications</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Package Requested</span>
                        <div className="font-bold text-gray-800 text-sm">
                          {CATERING_PACKAGES.find(p => p.id === selectedOrder.packageId)?.name || 'Custom Package'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 font-medium">Guest Counter</span>
                        <div className="font-bold text-terracotta-600 text-sm">{selectedOrder.guestCount} Guests</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-dashed border-gray-200">
                      <div>
                        <span className="text-[11px] text-gray-400 font-medium">Scheduled Event Date</span>
                        <div className="font-semibold text-gray-700 flex items-center gap-1 text-xs mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-500" /> {selectedOrder.eventDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 font-medium font-sans">Fulfillment Time</span>
                        <div className="font-semibold text-gray-700 flex items-center gap-1 text-xs mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-brand-500" /> {selectedOrder.eventTime}
                        </div>
                      </div>
                    </div>

                    {selectedOrder.serviceType === 'delivery' ? (
                      <div className="pt-2.5 border-t border-dashed border-gray-200">
                        <span className="text-[11px] text-gray-400 font-medium">Drop-off Address</span>
                        <div className="font-semibold text-gray-700 flex items-center gap-1 text-xs mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" /> {selectedOrder.deliveryAddress}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2.5 border-t border-dashed border-gray-200">
                        <span className="text-[11px] text-gray-400 font-medium">Fulfillment Type</span>
                        <div className="font-semibold text-emerald-600 text-xs mt-0.5 flex items-center gap-1">
                          <Coffee className="w-3.5 h-3.5 text-emerald-500" /> Studio Door Pickup (Free)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Dietaries & Special notes */}
                {(selectedOrder.allergyInfo || selectedOrder.specialNotes || selectedOrder.customRequests) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Dietary Limits & Special Notes</h4>
                    <div className="space-y-2">
                      {selectedOrder.allergyInfo && (
                        <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-xs">
                          <span className="font-bold text-red-800 flex items-center gap-1 mb-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Allergy Alert:
                          </span>
                          <p className="text-red-700 italic">{selectedOrder.allergyInfo}</p>
                        </div>
                      )}
                      {selectedOrder.customRequests && (
                        <div className="bg-brand-50/50 p-3 rounded-xl border border-brand-100 text-xs">
                          <span className="font-bold text-brand-800 flex items-center gap-1 mb-1">
                            <Heart className="w-3.5 h-3.5 text-brand-500" /> Custom Menu Notes:
                          </span>
                          <p className="text-brand-700 italic">{selectedOrder.customRequests}</p>
                        </div>
                      )}
                      {selectedOrder.specialNotes && (
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                          <span className="font-bold text-gray-700 block mb-1">Preparation/Delivery Instructions:</span>
                          <p className="text-gray-600 italic">{selectedOrder.specialNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update Control Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Planning midpoint:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {selectedOrder.estimatedTotal > 0 ? `$${selectedOrder.estimatedTotal.toFixed(0)}` : 'TBD'}
                  </span>
                  <span className="text-[10px] text-gray-400 block">Not final invoice — confirm after distance & date review</span>
                </div>

                {/* Dropdown status update triggers */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <span className="text-xs font-semibold text-gray-500 hidden md:inline">Request Status:</span>
                  <div className="flex rounded-xl border border-gray-250 overflow-hidden bg-white text-xs font-medium">
                    {(['new', 'contacted', 'confirmed', 'completed'] as OrderStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(selectedOrder.id, status)}
                        className={`px-3 py-2 cursor-pointer capitalize border-r last:border-0 border-gray-200 transition-all font-semibold ${
                          selectedOrder.status === status
                            ? status === 'new' ? 'bg-red-500 text-white' :
                              status === 'contacted' ? 'bg-amber-500 text-white' :
                              status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                            : 'hover:bg-gray-100 text-gray-600 bg-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 space-y-4 my-auto">
              <ClipboardCheck className="w-16 h-16 mx-auto text-gray-200" />
              <p className="font-display font-medium text-lg">No Request Selected</p>
              <p className="text-sm">Click any request on the left inbox to review full parameters and copy SMS messaging templates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple dummy icon fallback
function ClipboardCheck({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3m0 0c2.917 0 5.747.294 8.5.862m-21 10.398c0-.552.448-1 1-1h6.25a1 1 0 0 1 1 1v3.83a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1v-3.83Z" />
    </svg>
  );
}
