'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, MessageSquare, PlusCircle, Calendar, 
  MapPin, Tag, Check, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/api';
interface Category {
  _id: string;
  name: string;
}

interface RFQ {
  _id: string;
  title: string;
  description: string;
  category: Category;
  quantity: number;
  targetPrice: number;
  deliveryLocation: string;
  requiredDate: string;
  status: 'open' | 'closed';
  buyer: {
    _id: string;
    name: string;
    companyName: string;
  } | string;
  bids: Array<{
    _id: string;
    supplier: {
      _id: string;
      name: string;
      companyName: string;
      isVerified?: boolean;
    } | string;
    offeredPrice: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

export default function RfqHub() {
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sourcing Filters
  const [selectedCat, setSelectedCat] = useState('');
  
  // Post RFQ Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newRfq, setNewRfq] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    targetPrice: '',
    deliveryLocation: '',
    requiredDate: '',
  });
  
  // Place Bid Modal State
  const [activeBidRfq, setActiveBidRfq] = useState<RFQ | null>(null);
  const [selectedRfqDetails, setSelectedRfqDetails] = useState<RFQ | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Load RFQs & Categories
  const loadData = useCallback(async () => {
    try {
      const catData = await api.get('/categories');
      if (Array.isArray(catData)) {
        setCategories(catData);
        if (catData.length > 0) {
          setNewRfq((prev) => ({ ...prev, category: catData[0]._id }));
        }
      }

      const rfqUrl = selectedCat 
        ? `/rfqs?category=${selectedCat}`
        : '/rfqs';
      const rfqData = await api.get(rfqUrl);
      if (Array.isArray(rfqData)) setRfqs(rfqData);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error fetching RFQ data';
      console.error('Error fetching RFQ data:', errMsg);
    } finally {
      setLoading(false);
    }
  }, [selectedCat]);

  useEffect(() => {
    // eslint-disable-next-line
    loadData();
  }, [loadData]);

  // Handle Post RFQ Click Trigger
  const handlePostRfqClick = () => {
    setError('');
    if (!user) {
      setError(language === 'en' ? 'Please log in to submit sourcing RFQs.' : 'আরএফকিউ পোস্ট করতে অনুগ্রহ করে লগইন করুন।');
      return;
    }
    if (user.role !== 'buyer') {
      setError(language === 'en' ? 'Only Buyers can submit RFQs. Please login with a Buyer profile.' : 'শুধুমাত্র বায়াররা আরএফকিউ পোস্ট করতে পারেন। অনুগ্রহ করে বায়ার অ্যাকাউন্ট দিয়ে লগইন করুন।');
      return;
    }
    setShowPostModal(true);
  };

  // Handle Post RFQ Submission
  const handlePostRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user || user.role !== 'buyer') {
      setError(language === 'en' ? 'Only Buyers can submit RFQs. Please login with a Buyer profile.' : 'শুধুমাত্র বায়াররা আরএফকিউ পোস্ট করতে পারেন। অনুগ্রহ করে বায়ার অ্যাকাউন্ট দিয়ে লগইন করুন।');
      return;
    }

    try {
      await api.post('/rfqs', newRfq, { token: token || undefined });
      setActionSuccess(language === 'en' ? 'RFQ Posted Successfully!' : 'সফলভাবে আরএফকিউ পোস্ট করা হয়েছে!');
      setShowPostModal(false);
      setNewRfq({
        title: '',
        description: '',
        category: categories[0]?._id || '',
        quantity: '',
        targetPrice: '',
        deliveryLocation: '',
        requiredDate: '',
      });
      loadData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to submit RFQ sourcing request.';
      setError(errMsg);
    }
  };

  // Handle Place Bid Submission
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      setError(language === 'en' ? 'Please login to submit quotation bids.' : 'কোটেশন বা বিড পেশ করতে লগইন করুন।');
      return;
    }

    if (!activeBidRfq) return;

    try {
      await api.post(`/rfqs/${activeBidRfq._id}/bid`, {
        offeredPrice: Number(bidPrice),
        message: bidMessage,
      }, { token: token || undefined });

      setActionSuccess(language === 'en' ? 'Quotation Bid Submitted Successfully!' : 'সফলভাবে দরপ্রস্তাব জমা করা হয়েছে!');
      setActiveBidRfq(null);
      setBidPrice('');
      setBidMessage('');
      loadData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to place quotation bid.';
      setError(errMsg);
    }
  };

  // Handle Accept Bid
  const handleAcceptBid = async (rfqId: string, bidId: string) => {
    setError('');
    try {
      await api.patch(`/rfqs/${rfqId}/bid/${bidId}`, {}, { token: token || undefined });
      setActionSuccess(language === 'en' ? 'Bid Accepted Successfully!' : 'সফলভাবে দরপ্রস্তাব গ্রহণ করা হয়েছে!');
      setSelectedRfqDetails(null);
      loadData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to accept bid.';
      setError(errMsg);
    }
  };

  // Bilingual translation labels
  const allRequestsLabel = language === 'en' ? 'All Requests' : 'সব সোর্সিং রিকুয়েস্ট';
  const postRfqLabel = language === 'en' ? 'Post Sourcing RFQ' : 'আরএফকিউ পোস্ট করুন';
  const requiredLabel = language === 'en' ? 'Req' : 'প্রয়োজন';
  const placeBidLabel = language === 'en' ? 'Place Quotation' : 'দরপ্রস্তাব দিন';
  const openLabel = language === 'en' ? 'Open' : 'চলতি';
  const closedLabel = language === 'en' ? 'Closed' : 'বন্ধ';
  const titleLabel = language === 'en' ? 'Post Sourcing Request (RFQ)' : 'পাইকারি ক্রয়ের চাহিদা পোস্ট করুন (RFQ)';
  const closeLabel = language === 'en' ? 'Close' : 'বন্ধ করুন';
  const offeredPriceLabel = language === 'en' ? 'Your Offered Price (BDT per unit)' : 'আপনার প্রস্তাবিত দর (পিস প্রতি টাকা)';
  const proposalTermsLabel = language === 'en' ? 'Message / Proposals Terms' : 'বার্তা / প্রস্তাবের নিয়মাবলী';
  const proposalPlaceholder = language === 'en' ? 'Mention raw material specifics, delivery timeline, or packaging terms...' : 'কাঁচামাল, ডেলিভারির সময়কাল বা প্যাকেজিংয়ের নিয়ম উল্লেখ করুন...';
  const submitOfferLabel = language === 'en' ? 'Submit Quotation Offer' : 'দরপ্রস্তাব জমা দিন';

  return (
    <div className="flex-grow bg-[#FAFAFA]">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-8 md:px-12 py-8 relative">
      
      {/* Header Banner */}
      <div className="bg-brand-dark rounded-3xl px-6 py-8 sm:px-8 sm:py-10 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl mb-8 border border-white/5">
        <div className="space-y-3 relative z-10 text-left">
          <div className="inline-block bg-white/10 text-brand-light font-bold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Sourcing Bulletin
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">{t('rfqHubTitle')}</h1>
          <p className="text-brand-light/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t('rfqHubSubtitle')}
          </p>
        </div>

        <button 
          onClick={handlePostRfqClick}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors relative z-10 shadow-lg text-xs self-start lg:self-auto whitespace-nowrap"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          {postRfqLabel}
        </button>
      </div>

      {/* Global alerts */}
      {actionSuccess && (
        <div className="mb-6 p-4 bg-brand-light text-brand-primary rounded-2xl flex items-center gap-2 text-xs font-bold border border-brand-primary/10">
          <Check className="w-4.5 h-4.5" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Toolbar */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-8 border-b border-gray-150 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedCat('')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
            !selectedCat
              ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {allRequestsLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCat(cat._id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              selectedCat === cat._id
                ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* RFQ Board List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-150 p-6 space-y-4 animate-pulse h-[220px]" />
          ))}
        </div>
      ) : rfqs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfqs.map((rfq) => (
            <div 
              key={rfq._id} 
              className="bg-white rounded-3xl border border-gray-150 p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
              onClick={() => setSelectedRfqDetails(rfq)}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full">
                    {(typeof rfq.buyer === 'object' && rfq.buyer ? rfq.buyer.companyName : '') || 'Verified Corporate'}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-primary" />
                    {rfq.deliveryLocation}
                  </span>
                </div>
                <h3 className="font-extrabold text-gray-900 text-base mt-4 leading-snug line-clamp-1">{rfq.title}</h3>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {rfq.description || 'No additional specifications provided.'}
                </p>

                {/* RFQ Specs */}
                <div className="grid grid-cols-2 gap-4 mt-5 pt-3.5 border-t border-gray-50">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{t('bidQuantity')}</span>
                    <span className="font-bold text-xs sm:text-sm text-brand-dark mt-0.5">{rfq.quantity.toLocaleString()} {t('units')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{t('targetPrice')}</span>
                    <span className="font-bold text-xs sm:text-sm text-brand-dark mt-0.5">{rfq.targetPrice} {t('bdt')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-[9px] text-gray-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{requiredLabel}: {new Date(rfq.requiredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Tag className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{rfq.category?.name || 'Sourcing'}</span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                  {rfq.bids ? rfq.bids.length : 0} {t('bidsCount')}
                </span>
                
                {rfq.status === 'open' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        setError(language === 'en' ? 'Please login to submit quotations.' : 'কোটেশন জমা দিতে লগইন করুন।');
                        return;
                      }
                      setActiveBidRfq(rfq);
                    }}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    {placeBidLabel}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-md">{closedLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-800 text-base">No Sourcing RFQs Found</h3>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            There are currently no active B2B sourcing requests matching your category parameters. Check back shortly.
          </p>
        </div>
      )}

      {/* POST RFQ MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-150 pb-4">
              <h2 className="font-black text-gray-900 text-base sm:text-lg">{titleLabel}</h2>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-650 text-xs font-bold">{closeLabel}</button>
            </div>

            <form onSubmit={handlePostRfqSubmit} className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="space-y-1">
                <label className="block">{t('rfqTitleLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourcing 2,000 export quality cotton Polo t-shirts"
                  value={newRfq.title}
                  onChange={(e) => setNewRfq({ ...newRfq, title: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block">{t('rfqDescriptionLabel')}</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail size matrix, material density (GSM), packaging instructions..."
                  value={newRfq.description}
                  onChange={(e) => setNewRfq({ ...newRfq, description: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block">{t('categories')}</label>
                  <select
                    value={newRfq.category}
                    onChange={(e) => setNewRfq({ ...newRfq, category: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-200 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">{t('rfqQuantityLabel')}</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2000"
                    value={newRfq.quantity}
                    onChange={(e) => setNewRfq({ ...newRfq, quantity: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block">{t('rfqTargetPriceLabel')}</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 140"
                    value={newRfq.targetPrice}
                    onChange={(e) => setNewRfq({ ...newRfq, targetPrice: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">{language === 'en' ? 'Required Delivery Date' : 'প্রয়োজনীয় ডেলিভারি তারিখ'}</label>
                  <input
                    type="date"
                    required
                    value={newRfq.requiredDate}
                    onChange={(e) => setNewRfq({ ...newRfq, requiredDate: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block">{language === 'en' ? 'Delivery Location' : 'ডেলিভারির স্থান'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tejgaon Industrial Area, Dhaka"
                  value={newRfq.deliveryLocation}
                  onChange={(e) => setNewRfq({ ...newRfq, deliveryLocation: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 normal-case text-sm"
              >
                {t('submitRfqButton')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PLACE BID MODAL FOR SUPPLIER */}
      {activeBidRfq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-150 pb-4">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{language === 'en' ? 'Submit Quotation' : 'দরপ্রস্তাব জমা দিন'}</span>
                <h2 className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug truncate max-w-[240px]">{activeBidRfq.title}</h2>
              </div>
              <button onClick={() => setActiveBidRfq(null)} className="text-gray-400 hover:text-gray-650 font-bold text-xs">{closeLabel}</button>
            </div>

            <div className="bg-brand-light/30 rounded-xl p-4 space-y-2 border border-brand-primary/10">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>{language === 'en' ? 'Requested Quantity' : 'চাহিদা পরিমাণ'}</span>
                <span className="text-brand-dark">{activeBidRfq.quantity.toLocaleString()} {t('units')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>{language === 'en' ? 'Target Price' : 'টার্গেট মূল্য'}</span>
                <span className="text-brand-dark">{activeBidRfq.targetPrice} {t('bdt')}/unit</span>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="space-y-1">
                <label className="block">{offeredPriceLabel}</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 135"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block">{proposalTermsLabel}</label>
                <textarea
                  required
                  rows={3}
                  placeholder={proposalPlaceholder}
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="w-full bg-gray-55 border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 normal-case text-sm"
              >
                {submitOfferLabel}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RFQ DETAILS & BIDS MODAL */}
      {selectedRfqDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-150 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {(typeof selectedRfqDetails.buyer === 'object' && selectedRfqDetails.buyer ? selectedRfqDetails.buyer.companyName : '') || 'Verified Corporate Buyer'}
                  </span>
                  {selectedRfqDetails.status === 'open' ? (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                      {openLabel}
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-650 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {closedLabel}
                    </span>
                  )}
                </div>
                <h2 className="font-black text-gray-900 text-lg sm:text-xl mt-2 leading-snug">{selectedRfqDetails.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedRfqDetails(null)} 
                className="text-gray-400 hover:text-gray-650 text-xs font-bold shrink-0 ml-4"
              >
                {closeLabel}
              </button>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Description / Specifications</span>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line font-medium bg-gray-50 p-4 rounded-2xl normal-case">
                  {selectedRfqDetails.description || 'No additional specifications provided.'}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-brand-light/20 p-4 rounded-2xl border border-brand-primary/5">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Required Quantity</span>
                  <span className="font-extrabold text-sm text-brand-dark mt-0.5">{selectedRfqDetails.quantity.toLocaleString()} units</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Target Price</span>
                  <span className="font-extrabold text-sm text-brand-dark mt-0.5">{selectedRfqDetails.targetPrice} BDT</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Date</span>
                  <span className="font-extrabold text-xs text-brand-dark mt-0.5">{new Date(selectedRfqDetails.requiredDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Location</span>
                  <span className="font-extrabold text-xs text-brand-dark mt-0.5 truncate block normal-case">{selectedRfqDetails.deliveryLocation}</span>
                </div>
              </div>

              {/* Bids/Quotations List */}
              <div className="space-y-3 pt-4 border-t border-gray-150">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-primary" />
                    <span>Quotation Offers ({selectedRfqDetails.bids ? selectedRfqDetails.bids.length : 0})</span>
                  </h3>
                  {selectedRfqDetails.status === 'open' && (
                    <button
                      onClick={() => {
                        if (!user) {
                          setError(language === 'en' ? 'Please login to submit quotations.' : 'কোটেশন জমা দিতে লগইন করুন।');
                          setSelectedRfqDetails(null);
                          return;
                        }
                        setActiveBidRfq(selectedRfqDetails);
                        setSelectedRfqDetails(null);
                      }}
                      className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      {placeBidLabel}
                    </button>
                  )}
                </div>

                {selectedRfqDetails.bids && selectedRfqDetails.bids.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {selectedRfqDetails.bids.map((bid) => {
                      const isBidOwner = user?.id === (typeof bid.supplier === 'object' && bid.supplier ? bid.supplier._id : bid.supplier);
                      const isRfqOwner = user?.id === (typeof selectedRfqDetails.buyer === 'object' && selectedRfqDetails.buyer ? selectedRfqDetails.buyer._id : selectedRfqDetails.buyer);
                      return (
                        <div 
                          key={bid._id} 
                          className={`p-4 rounded-2xl border transition-all ${
                            bid.status === 'accepted'
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-white border-gray-150'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-gray-900 normal-case">
                                  {(typeof bid.supplier === 'object' && bid.supplier ? bid.supplier.companyName : '') || 'Verified Supplier'}
                                </span>
                                {typeof bid.supplier === 'object' && bid.supplier?.isVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400">
                                Offered Price: <span className="font-extrabold text-brand-dark">{bid.offeredPrice} BDT/unit</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {bid.status === 'accepted' ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Accepted
                                </span>
                              ) : bid.status === 'rejected' ? (
                                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Declined
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-650 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Pending
                                </span>
                              )}

                              {/* Accept Bid Button for RFQ Creator */}
                              {isRfqOwner && selectedRfqDetails.status === 'open' && bid.status === 'pending' && (
                                <button
                                  onClick={() => handleAcceptBid(selectedRfqDetails._id, bid._id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all shadow-sm normal-case"
                                >
                                  Accept Offer
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Private Message display logic */}
                          {(isRfqOwner || isBidOwner) ? (
                            <p className="text-gray-500 text-xs mt-2 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 normal-case">
                              <span className="font-bold text-gray-400 block text-[9px] uppercase tracking-wider mb-1">Proposal details (Private)</span>
                              {bid.message}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-xs italic mt-2 normal-case">
                              Proposal messages are private between buyer and supplier.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl">
                    <p className="text-xs text-gray-400">No quotation offers submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
