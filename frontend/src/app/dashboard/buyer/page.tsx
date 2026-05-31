'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  ShieldCheck, 
  MessageSquare, 
  ChevronDown, 
  Check, 
  X, 
  FileText, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  TrendingUp,
  Package,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function BuyerDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedRfq, setExpandedRfq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'orders'>('overview');

  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Load stats
      const statsData = await api.get('/dashboard/buyer-stats', { token });
      setStats(statsData);

      // Load orders
      const ordersData = await api.get('/orders/buyer', { token });
      setOrders(ordersData);

      // Load RFQs
      const rfqsData = await api.get('/rfqs', { token });
      // Filter RFQs created by this buyer
      if (Array.isArray(rfqsData) && user) {
        setRfqs(rfqsData.filter((r) => {
          const buyerId = typeof r.buyer === 'object' && r.buyer ? r.buyer._id : r.buyer;
          return buyerId === user.id;
        }));
      }
    } catch (err: any) {
      console.error('Error fetching buyer dashboard data:', err);
      setError(language === 'en' ? 'Failed to load dashboard parameters.' : 'ড্যাশবোর্ড লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'buyer') {
      router.push('/');
      return;
    }
    if (token) {
      loadDashboardData();
    }
  }, [user, token, authLoading]);

  const handleAcceptBid = async (rfqId: string, bidId: string) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/rfqs/${rfqId}/accept/${bidId}`, {}, { token: token || undefined });
      setSuccess(language === 'en' ? 'Quotation Accepted Successfully!' : 'কোটেকশন সফলভাবে গৃহীত হয়েছে!');
      loadDashboardData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to accept quote.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmationMsg = language === 'en' 
      ? 'Are you sure you want to request cancellation of this order?' 
      : 'আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?';
    if (!confirm(confirmationMsg)) return;
    setError('');
    setSuccess('');
    try {
      await api.put(`/orders/${orderId}/status`, { deliveryStatus: 'cancelled' }, { token: token || undefined });
      setSuccess(language === 'en' ? 'Order Cancelled Successfully.' : 'অর্ডার বাতিল সম্পন্ন হয়েছে।');
      loadDashboardData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 flex-grow animate-pulse space-y-8">
        <div className="h-10 bg-gray-200/60 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200/60 rounded-3xl" />
          <div className="h-32 bg-gray-200/60 rounded-3xl" />
          <div className="h-32 bg-gray-200/60 rounded-3xl" />
        </div>
        <div className="h-96 bg-gray-200/60 rounded-3xl" />
      </div>
    );
  }

  // Bilingual strings
  const greetings = language === 'en' ? 'Welcome Back,' : 'স্বাগতম,';
  const workspaceTitle = language === 'en' ? 'Buyer Workspace' : 'বায়ার ওয়ার্কস্পেস';
  const buyerProfileDesc = user?.companyName || (language === 'en' ? 'Corporate Buyer Profile' : 'কর্পোরেট বায়ার প্রোফাইল');
  
  const activeOrdersLabel = language === 'en' ? 'Active Orders' : 'চলতি অর্ডার';
  const totalExpenditureLabel = language === 'en' ? 'Total Expenditure' : 'মোট ব্যয়';
  const openRfqsLabel = language === 'en' ? 'Open RFQs' : 'উন্মুক্ত আরএফকিউ';
  
  const openSourcingTitle = language === 'en' ? 'Your Sourcing RFQs' : 'আপনার সোর্সিং আরএফকিউ';
  const supplierBidsLabel = language === 'en' ? 'View Quotations' : 'কোটেশনগুলো দেখুন';
  const noBidsLabel = language === 'en' ? 'No bids submitted yet for this request.' : 'এখনও কোনো বিড জমা দেওয়া হয়নি।';
  const acceptOfferBtn = language === 'en' ? 'Accept & Order' : 'গ্রহণ ও অর্ডার করুন';
  const createRfqBtn = language === 'en' ? 'Create RFQ' : 'আরএফকিউ তৈরি করুন';
  const noRfqsLabel = language === 'en' ? 'You have not submitted any active sourcing RFQs.' : 'আপনি কোনো সোর্সিং আরএফকিউ তৈরি করেননি।';

  const recentOrdersTitle = language === 'en' ? 'Purchase Orders Log' : 'সাম্প্রতিক অর্ডার লগ';
  const supplierLabel = language === 'en' ? 'Supplier' : 'সরবরাহকারী';
  const totalValueLabel = language === 'en' ? 'Total Value' : 'মোট মূল্য';
  const payStatusLabel = language === 'en' ? 'Payment' : 'পেমেন্ট';
  const shipStatusLabel = language === 'en' ? 'Shipping' : 'শিপিং';
  const cancelOrderBtn = language === 'en' ? 'Cancel Order' : 'অর্ডার বাতিল';
  const noOrdersLabel = language === 'en' ? 'No order listings found.' : 'কোনো অর্ডারের তালিকা পাওয়া যায়নি।';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFDFB] to-[#F5F8F6] pb-16 flex-grow">
      
      {/* Decorative top header glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-light/40 to-transparent pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-8 space-y-8 relative">
        
        {/* Top Header Greetings */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-primary bg-brand-light px-3 py-1 rounded-full">{greetings}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">{user?.name}</h1>
            <p className="text-xs text-gray-500 font-medium">{buyerProfileDesc}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/rfqs')}
              className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-dark text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{createRfqBtn}</span>
            </button>
            <button
              onClick={loadDashboardData}
              className="p-3 text-gray-400 hover:text-brand-primary bg-gray-50 hover:bg-brand-light rounded-2xl transition-colors border border-gray-100 flex items-center justify-center"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Alerts */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-300">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-brand-light opacity-30 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Package className="w-28 h-28" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{activeOrdersLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{stats?.activeOrdersCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-300">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-brand-light opacity-30 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <TrendingUp className="w-28 h-28" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{totalExpenditureLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{(stats?.totalSpend || 0).toLocaleString()} <span className="text-xs font-bold text-gray-450">{t('bdt')}</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-brand-light opacity-30 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Layers className="w-28 h-28" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{openRfqsLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{stats?.openRfqsCount || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Tabs Selector */}
        <div className="flex border-b border-gray-200 gap-1 sm:gap-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'overview' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'Overview' : 'সারসংক্ষেপ'}
          </button>
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'rfqs' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'My Sourcing RFQs' : 'আমার আরএফকিউ'}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'orders' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'Orders Tracker' : 'অর্ডার ট্র্যাকার'}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Quick Sourcing Overview */}
            <div className="xl:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <h2 className="font-black text-gray-900 text-base">{openSourcingTitle}</h2>
                <button 
                  onClick={() => setActiveTab('rfqs')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-dark flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'Manage All' : 'সবগুলো দেখুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {rfqs.length > 0 ? (
                <div className="space-y-4">
                  {rfqs.slice(0, 3).map((rfq) => (
                    <div key={rfq._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">{rfq.title}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                          {language === 'en'
                            ? `Qty: ${rfq.quantity.toLocaleString()} • Target: ${rfq.targetPrice} BDT`
                            : `পরিমাণ: ${rfq.quantity.toLocaleString()} • বাজেট: ${rfq.targetPrice} টাকা`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[9px] font-extrabold bg-brand-light text-brand-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {rfq.bids ? rfq.bids.length : 0} {language === 'en' ? 'Bids' : 'বিড'}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('rfqs');
                            setExpandedRfq(rfq._id);
                          }}
                          className="bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all"
                        >
                          {language === 'en' ? 'Manage' : 'ব্যবস্থাপনা'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-xs text-gray-400 font-bold">{noRfqsLabel}</p>
                  <button
                    onClick={() => router.push('/rfqs')}
                    className="bg-brand-primary text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-all inline-block shadow-sm"
                  >
                    {createRfqBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Orders Overview */}
            <div className="xl:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <h2 className="font-black text-gray-900 text-base">{recentOrdersTitle}</h2>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-dark flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'Track All' : 'সব ট্র্যাক করুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="p-4 rounded-2xl border border-gray-100 hover:border-brand-primary/20 transition-all bg-white shadow-xs">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                        <span>Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-gray-800 mt-2 line-clamp-1">{order.supplier?.companyName}</h4>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                        <span className="text-brand-primary font-black text-xs">{order.totalAmount.toLocaleString()} {t('bdt')}</span>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.deliveryStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {order.deliveryStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-bold text-center py-12">{noOrdersLabel}</p>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: RFQ Manager */}
        {activeTab === 'rfqs' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{openSourcingTitle}</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{language === 'en' ? 'Review quotation offers submitted by manufacturing suppliers' : 'উৎপাদনকারী সরবরাহকারীদের পাঠানো কোটেশনগুলো যাচাই করুন'}</p>
              </div>
            </div>

            {rfqs.length > 0 ? (
              <div className="divide-y divide-gray-100 space-y-6">
                {rfqs.map((rfq) => (
                  <div key={rfq._id} className="pt-6 first:pt-0 space-y-4">
                    
                    {/* RFQ Header Card */}
                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-gray-900">{rfq.title}</h3>
                          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            rfq.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {rfq.status === 'open' ? (language === 'en' ? 'Open' : 'চলতি') : (language === 'en' ? 'Closed' : 'বন্ধ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{rfq.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            {language === 'en' ? `Qty: ${rfq.quantity.toLocaleString()} units` : `পরিমাণ: ${rfq.quantity.toLocaleString()} টি`}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {language === 'en' ? `Target: ${rfq.targetPrice} BDT/unit` : `বাজেট: ${rfq.targetPrice} টাকা/টি`}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {rfq.deliveryLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(rfq.requiredDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedRfq(expandedRfq === rfq._id ? null : rfq._id)}
                        className="w-full md:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-brand-primary" />
                        <span>{supplierBidsLabel} ({rfq.bids ? rfq.bids.length : 0})</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${expandedRfq === rfq._id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Bids Dropdown List */}
                    {expandedRfq === rfq._id && (
                      <div className="pl-0 md:pl-6 space-y-4 animate-fade-in">
                        {rfq.bids && rfq.bids.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rfq.bids.map((bid: any) => {
                              const isWithinBudget = bid.offeredPrice <= rfq.targetPrice;
                              return (
                                <div key={bid._id} className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow relative overflow-hidden">
                                  {/* Budget comparison banner indicator */}
                                  <div className={`absolute top-0 right-0 w-32 h-6 flex items-center justify-center text-[8px] font-extrabold uppercase tracking-widest text-white rotate-45 translate-x-9 translate-y-2 ${
                                    isWithinBudget ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}>
                                    {isWithinBudget ? (language === 'en' ? 'In Budget' : 'বাজেটের মধ্যে') : (language === 'en' ? 'Over Budget' : 'বাজেট বহির্ভূত')}
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                                        {bid.supplier?.companyName || (language === 'en' ? 'Verified Manufacturer' : 'যাচাইকৃত প্রস্তুতকারক')}
                                      </h4>
                                      {bid.supplier?.isVerified && (
                                        <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 italic normal-case leading-relaxed">"{bid.message}"</p>
                                  </div>

                                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div>
                                      <span className="text-[8px] text-gray-400 font-extrabold block uppercase tracking-wider">{language === 'en' ? 'Offered Quote Price' : 'প্রস্তাবিত মূল্য'}</span>
                                      <span className="font-black text-sm sm:text-base text-brand-dark mt-0.5 block">{bid.offeredPrice} <span className="text-xs font-bold text-gray-400">{t('bdt')}</span></span>
                                    </div>
                                    {rfq.status === 'open' ? (
                                      <button
                                        onClick={() => handleAcceptBid(rfq._id, bid._id)}
                                        className="bg-brand-primary hover:bg-brand-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                                      >
                                        {acceptOfferBtn}
                                      </button>
                                    ) : (
                                      <span className="text-[9px] font-extrabold text-gray-400 bg-gray-55 px-2.5 py-1 rounded-md uppercase tracking-wider border border-gray-200">
                                        {bid.status === 'accepted' ? (language === 'en' ? 'Accepted' : 'গৃহীত') : (language === 'en' ? 'Closed' : 'বন্ধ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-gray-50/50 rounded-2xl border border-gray-100 py-6 text-center text-xs text-gray-400 font-bold">{noBidsLabel}</div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-sm text-gray-400 font-bold">{noRfqsLabel}</p>
                <button
                  onClick={() => router.push('/rfqs')}
                  className="bg-brand-primary text-white font-black text-xs px-6 py-3 rounded-2xl hover:bg-brand-dark transition-all shadow-md inline-block"
                >
                  {createRfqBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History & Steppers */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{recentOrdersTitle}</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{language === 'en' ? 'Monitor payment and shipping statuses of active contract orders' : 'সক্রিয় অর্ডার চুক্তিসমূহের পেমেন্ট এবং শিপিং অবস্থা ট্র্যাক করুন'}</p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => {
                  // Stepper calculations
                  const steps = ['processing', 'shipped', 'delivered'];
                  const currentStepIdx = steps.indexOf(order.deliveryStatus);
                  const isCancelled = order.deliveryStatus === 'cancelled';

                  return (
                    <div key={order._id} className="border border-gray-150 hover:border-gray-200 transition-colors rounded-3xl p-6 space-y-5 bg-white shadow-xs">
                      
                      {/* Card Header info */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-50">
                        <div>
                          <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider block bg-brand-light px-2.5 py-0.5 rounded-full w-fit">Order: #{order._id.slice(-8).toUpperCase()}</span>
                          <span className="text-xs text-gray-400 font-bold mt-1.5 block">{new Date(order.createdAt).toLocaleDateString()} • {language === 'en' ? 'B2B Sales Contract' : 'পাইকারি বিক্রয় চুক্তি'}</span>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{totalValueLabel}</span>
                          <span className="font-black text-base sm:text-lg text-brand-dark block mt-0.5">{order.totalAmount.toLocaleString()} {t('bdt')}</span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        
                        <div className="md:col-span-4 space-y-3">
                          <div>
                            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{supplierLabel}</span>
                            <span className="font-extrabold text-sm text-gray-800">{order.supplier?.companyName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{language === 'en' ? 'Shipping Destination' : 'ডেলিভারি ঠিকানা'}</span>
                            <span className="text-xs text-gray-600 font-medium">{order.shippingAddress}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{language === 'en' ? 'Contact Phone' : 'যোগাযোগ নম্বর'}</span>
                            <span className="text-xs text-gray-650 font-bold">{order.phone}</span>
                          </div>
                        </div>

                        {/* Order Stepper Tracker */}
                        <div className="md:col-span-8 space-y-5">
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{language === 'en' ? 'Realtime Fulfillment Roadmap' : 'অর্ডার সম্পাদনের ধাপসমূহ'}</span>
                          
                          {isCancelled ? (
                            <div className="bg-red-50 text-red-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold border border-red-100">
                              <X className="w-5 h-5 text-red-500 shrink-0" />
                              <span>{language === 'en' ? 'This order has been cancelled.' : 'অর্ডারটি বাতিল করা হয়েছে।'}</span>
                            </div>
                          ) : (
                            <>
                              {/* Mobile vertical stepper (visible on mobile only) */}
                              <div className="flex flex-col gap-4 sm:hidden pt-2">
                                {steps.map((step, idx) => {
                                  const isCompleted = currentStepIdx >= idx;
                                  const isActive = currentStepIdx === idx;
                                  return (
                                    <div key={step} className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                        isCompleted 
                                          ? 'bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20' 
                                          : 'bg-white border-gray-200 text-gray-400'
                                      }`}>
                                        {isCompleted ? (
                                          <Check className="w-4 h-4" />
                                        ) : (
                                          <span className="text-[10px] font-black">{idx + 1}</span>
                                        )}
                                      </div>
                                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                        isActive ? 'text-brand-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                      }`}>
                                        {step === 'processing' ? (language === 'en' ? 'Processing' : 'প্রক্রিয়াধীন') :
                                         step === 'shipped' ? (language === 'en' ? 'Shipped' : 'পাঠানো হয়েছে') :
                                         (language === 'en' ? 'Delivered' : 'ডেলিভার্ড')}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Desktop horizontal stepper (hidden on mobile) */}
                              <div className="hidden sm:flex items-center w-full pt-2">
                                {steps.map((step, idx) => {
                                  const isCompleted = currentStepIdx >= idx;
                                  const isActive = currentStepIdx === idx;
                                  return (
                                    <React.Fragment key={step}>
                                      {/* Circle */}
                                      <div className="flex flex-col items-center relative z-10 shrink-0">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isCompleted 
                                            ? 'bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20' 
                                            : 'bg-white border-gray-200 text-gray-400'
                                        }`}>
                                          {isCompleted ? (
                                            <Check className="w-4 h-4" />
                                          ) : (
                                            <span className="text-[10px] font-black">{idx + 1}</span>
                                          )}
                                        </div>
                                        <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-2.5 ${
                                          isActive ? 'text-brand-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                        }`}>
                                          {step === 'processing' ? (language === 'en' ? 'Processing' : 'প্রক্রিয়াধীন') :
                                           step === 'shipped' ? (language === 'en' ? 'Shipped' : 'পাঠানো হয়েছে') :
                                           (language === 'en' ? 'Delivered' : 'ডেলিভার্ড')}
                                        </span>
                                      </div>
                                      
                                      {/* Connector Line */}
                                      {idx < steps.length - 1 && (
                                        <div className="flex-grow h-1 mx-2 -translate-y-3.5 relative z-0">
                                          <div className={`w-full h-full rounded-full transition-all ${
                                            currentStepIdx > idx ? 'bg-brand-primary' : 'bg-gray-200'
                                          }`} />
                                        </div>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                      </div>

                      {/* Payment Status & Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-[10px] font-bold">
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full uppercase tracking-wider ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {payStatusLabel}: {order.paymentStatus === 'paid' ? (language === 'en' ? 'Paid' : 'পরিশোধিত') : (language === 'en' ? 'Pending' : 'বকেয়া')}
                          </span>
                          <span className={`px-3 py-1 rounded-full uppercase tracking-wider ${
                            order.deliveryStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {shipStatusLabel}: {order.deliveryStatus === 'delivered' ? (language === 'en' ? 'Delivered' : 'ডেলিভার্ড') : order.deliveryStatus === 'cancelled' ? (language === 'en' ? 'Cancelled' : 'বাতিল') : (language === 'en' ? 'On The Way' : 'প্রেরিত')}
                          </span>
                        </div>

                        {order.deliveryStatus === 'processing' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[10px] px-4 py-2 rounded-xl transition-colors uppercase tracking-wider border border-rose-100"
                          >
                            {cancelOrderBtn}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50/50 rounded-2xl border border-gray-100 py-16 text-center text-xs text-gray-400 font-bold">{noOrdersLabel}</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
