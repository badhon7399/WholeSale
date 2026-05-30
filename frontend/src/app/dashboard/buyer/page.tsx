'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ShieldCheck, MessageSquare, ChevronDown, Check, X, FileText, ShoppingBag, DollarSign, Clock, AlertCircle } from 'lucide-react';

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
        setRfqs(rfqsData.filter((r) => r.buyer?._id === user.id));
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
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-16 flex-grow animate-pulse space-y-8">
        <div className="h-8 bg-gray-150 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-gray-150 rounded-2xl" />
          <div className="h-28 bg-gray-150 rounded-2xl" />
          <div className="h-28 bg-gray-150 rounded-2xl" />
        </div>
        <div className="h-80 bg-gray-150 rounded-3xl" />
      </div>
    );
  }

  // Bilingual translation strings
  const workspaceTitle = language === 'en' ? 'Buyer Workspace' : 'বায়ার ওয়ার্কস্পেস';
  const buyerProfileDesc = user?.companyName || (language === 'en' ? 'Corporate Buyer Profile' : 'কর্পোরেট বায়ার প্রোফাইল');
  const activeOrdersLabel = language === 'en' ? 'Active Orders' : 'চলতি অর্ডার';
  const totalExpenditureLabel = language === 'en' ? 'Total Expenditure' : 'মোট ব্যয়';
  const openRfqsLabel = language === 'en' ? 'Open RFQs' : 'উন্মুক্ত আরএফকিউ';
  
  const openSourcingTitle = language === 'en' ? 'Your Open Sourcing RFQs' : 'আপনার উন্মুক্ত সোর্সিং আরএফকিউ';
  const supplierBidsLabel = language === 'en' ? 'View Supplier Bids' : 'সরবরাহকারীদের বিড দেখুন';
  const noBidsLabel = language === 'en' ? 'No bids submitted yet for this request.' : 'এখনও কোনো বিড জমা দেওয়া হয়নি।';
  const acceptOfferBtn = language === 'en' ? 'Accept Offer' : 'অফার গ্রহণ করুন';
  const createRfqBtn = language === 'en' ? 'Create Sourcing RFQ' : 'সোর্সিং আরএফকিউ তৈরি করুন';
  const noRfqsLabel = language === 'en' ? 'You have not submitted any active sourcing RFQs.' : 'আপনি কোনো সোর্সিং আরএফকিউ তৈরি করেননি।';

  const recentOrdersTitle = language === 'en' ? 'Recent Orders Log' : 'সাম্প্রতিক অর্ডার লগ';
  const supplierLabel = language === 'en' ? 'Supplier' : 'সরবরাহকারী';
  const totalValueLabel = language === 'en' ? 'Total Value' : 'মোট মূল্য';
  const payStatusLabel = language === 'en' ? 'Pay' : 'পেমেন্ট';
  const shipStatusLabel = language === 'en' ? 'Ship' : 'শিপমেন্ট';
  const cancelOrderBtn = language === 'en' ? 'Cancel Order' : 'অর্ডার বাতিল';
  const noOrdersLabel = language === 'en' ? 'No order listings found.' : 'কোনো অর্ডারের তালিকা পাওয়া যায়নি।';

  return (
    <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8 flex-grow space-y-8 bg-[#FAFAFA]">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">{workspaceTitle}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{buyerProfileDesc}</p>
        </div>
      </div>

      {/* Global Alerts */}
      {success && (
        <div className="p-4 bg-brand-light text-brand-primary rounded-2xl flex items-center gap-2.5 text-xs font-bold border border-brand-primary/10 animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2.5 text-xs font-bold border border-red-100 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{activeOrdersLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{stats?.activeOrdersCount || 0}</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{totalExpenditureLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{(stats?.totalSpend || 0).toLocaleString()} {t('bdt')}</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center gap-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{openRfqsLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{stats?.openRfqsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: RFQs / Sourcing */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-sm">
            <h2 className="font-extrabold text-gray-900 text-sm sm:text-base mb-5 border-b border-gray-50 pb-3">
              {openSourcingTitle}
            </h2>

            {rfqs.length > 0 ? (
              <div className="divide-y divide-gray-100 space-y-4">
                {rfqs.map((rfq) => (
                  <div key={rfq._id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900">{rfq.title}</h3>
                        <p className="text-[9px] text-gray-400 mt-1 font-semibold">
                          {language === 'en'
                            ? `Qty: ${rfq.quantity.toLocaleString()} units • Target: ${rfq.targetPrice} BDT`
                            : `পরিমাণ: ${rfq.quantity.toLocaleString()} টি • টার্গেট: ${rfq.targetPrice} টাকা`}
                        </p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        rfq.status === 'open' ? 'bg-brand-light text-brand-primary' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {rfq.status === 'open' ? (language === 'en' ? 'open' : 'চলতি') : (language === 'en' ? 'closed' : 'বন্ধ')}
                      </span>
                    </div>

                    {/* Expand Bids trigger */}
                    {rfq.status === 'open' && (
                      <div>
                        <button
                          onClick={() => setExpandedRfq(expandedRfq === rfq._id ? null : rfq._id)}
                          className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {supplierBidsLabel} ({rfq.bids ? rfq.bids.length : 0})
                          <ChevronDown className={`w-3 h-3 transition-transform ${expandedRfq === rfq._id ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedRfq === rfq._id && (
                          <div className="mt-3 bg-gray-50/50 rounded-2xl border border-gray-100 p-4 space-y-3 animate-fade-in">
                            {rfq.bids && rfq.bids.length > 0 ? (
                              rfq.bids.map((bid: any) => (
                                <div key={bid._id} className="bg-white rounded-xl p-3 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-gray-900">
                                        {bid.supplier?.companyName || (language === 'en' ? 'Verified Manufacturer' : 'যাচাইকৃত প্রস্তুতকারক')}
                                      </span>
                                      {bid.supplier?.isVerified && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic mt-0.5 normal-case">"{bid.message}"</p>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-center justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                                    <div className="sm:text-right">
                                      <span className="text-[8px] text-gray-400 font-bold block uppercase">{language === 'en' ? 'Bid Offer' : 'দরপ্রস্তাব'}</span>
                                      <span className="font-black text-xs sm:text-sm text-brand-dark mt-0.5">{bid.offeredPrice} {t('bdt')}</span>
                                    </div>
                                    <button
                                      onClick={() => handleAcceptBid(rfq._id, bid._id)}
                                      className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                                    >
                                      {acceptOfferBtn}
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-[9px] text-gray-400 font-semibold text-center py-2">{noBidsLabel}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-gray-400 font-semibold">{noRfqsLabel}</p>
                <button
                  onClick={() => router.push('/rfqs')}
                  className="bg-brand-primary text-white font-bold text-[10px] px-4 py-2.5 rounded-xl hover:bg-brand-dark transition-all inline-block"
                >
                  {createRfqBtn}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Order status */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-sm">
            <h2 className="font-extrabold text-gray-900 text-sm sm:text-base mb-5 border-b border-gray-50 pb-3">
              {recentOrdersTitle}
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-100 rounded-2xl p-4 space-y-3 hover:border-gray-200 transition-colors bg-white">
                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                      <span>Order: #{order._id.slice(-8).toUpperCase()}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{supplierLabel}</span>
                        <span className="font-bold text-xs text-gray-800 line-clamp-1">{order.supplier?.companyName}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-gray-400 font-bold uppercase block">{totalValueLabel}</span>
                        <span className="font-black text-xs sm:text-sm text-brand-dark">{order.totalAmount.toLocaleString()} {t('bdt')}</span>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-[9px] font-bold">
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {payStatusLabel}: {order.paymentStatus === 'paid' ? (language === 'en' ? 'paid' : 'পরিশোধিত') : (language === 'en' ? 'pending' : 'বকেয়া')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.deliveryStatus === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-brand-light text-brand-primary'
                        }`}>
                          {shipStatusLabel}: {order.deliveryStatus === 'delivered' ? (language === 'en' ? 'delivered' : 'ডেলিভার্ড') : (language === 'en' ? 'processing' : 'চলতি')}
                        </span>
                      </div>

                      {order.deliveryStatus === 'processing' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-[9px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider hover:underline"
                        >
                          {cancelOrderBtn}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-semibold text-center py-10">{noOrdersLabel}</p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
