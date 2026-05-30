'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, MessageSquare, Plus, PlusCircle, Calendar, 
  MapPin, Tag, ChevronDown, Check, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/api';

export default function RfqHub() {
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
  const [activeBidRfq, setActiveBidRfq] = useState<any | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Load RFQs & Categories
  const loadData = async () => {
    setLoading(true);
    try {
      const catData = await api.get('/categories');
      if (Array.isArray(catData)) {
        setCategories(catData);
        if (catData.length > 0) {
          setNewRfq((prev) => ({ ...prev, category: (catData[0] as any)._id }));
        }
      }

      const rfqUrl = selectedCat 
        ? `/rfqs?category=${selectedCat}`
        : '/rfqs';
      const rfqData = await api.get(rfqUrl);
      if (Array.isArray(rfqData)) setRfqs(rfqData);
    } catch (err: any) {
      console.error('Error fetching RFQ data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat]);

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
    } catch (err: any) {
      setError(err.message || 'Failed to submit RFQ sourcing request.');
    }
  };

  // Handle Place Bid Submission
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user || user.role !== 'supplier') {
      setError(language === 'en' ? 'Only Suppliers can bid on RFQ sourcing requests.' : 'শুধুমাত্র সরবরাহকারীরা আরএফকিউতে বিড পেশ করতে পারবেন।');
      return;
    }

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
    } catch (err: any) {
      setError(err.message || 'Failed to place quotation bid.');
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
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8 relative">
      
      {/* Header Banner */}
      <div className="bg-brand-dark rounded-3xl px-8 py-10 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl mb-8 border border-white/5">
        <div className="space-y-3 relative z-10 text-left">
          <div className="inline-block bg-white/10 text-brand-light font-bold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Sourcing Bulletin
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">{t('rfqHubTitle')}</h1>
          <p className="text-brand-light/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t('rfqHubSubtitle')}
          </p>
        </div>

        {user && user.role === 'buyer' && (
          <button 
            onClick={() => setShowPostModal(true)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors relative z-10 shadow-lg text-xs self-start lg:self-auto whitespace-nowrap"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            {postRfqLabel}
          </button>
        )}
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
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-8 border-b border-gray-150">
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
              className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full">
                    {rfq.buyer?.companyName || 'Verified Corporate'}
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
                  user?.role === 'supplier' ? (
                    <button
                      onClick={() => setActiveBidRfq(rfq)}
                      className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      {placeBidLabel}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{openLabel}</span>
                  )
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

      </div>
    </div>
  );
}
