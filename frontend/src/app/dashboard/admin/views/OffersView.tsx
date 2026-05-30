'use client';

import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface OffersViewProps {
  darkMode: boolean;
  offersList: any[];
  newOfferName: string;
  setNewOfferName: (val: string) => void;
  newOfferCode: string;
  setNewOfferCode: (val: string) => void;
  newOfferDiscount: number;
  setNewOfferDiscount: (val: number) => void;
  newOfferExpiry: string;
  setNewOfferExpiry: (val: string) => void;
  handleCreateOffer: (e: React.FormEvent) => void;
  handleDeleteOffer: (id: string) => void;
  openEditModal: (type: 'offer', data: any) => void;
}

export default function OffersView({
  darkMode,
  offersList,
  newOfferName,
  setNewOfferName,
  newOfferCode,
  setNewOfferCode,
  newOfferDiscount,
  setNewOfferDiscount,
  newOfferExpiry,
  setNewOfferExpiry,
  handleCreateOffer,
  handleDeleteOffer,
  openEditModal
}: OffersViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Left Column: Create Offer */}
      <div className={`xl:col-span-4 rounded-[2rem] border p-6 space-y-6 ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100/50">
          <div className="w-8 h-8 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm dark:text-white">Create Promo Offer</h3>
        </div>

        <form onSubmit={handleCreateOffer} className="space-y-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="space-y-1.5">
            <label className="block text-slate-500">Offer Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Winter Clearance"
              value={newOfferName}
              onChange={(e) => setNewOfferName(e.target.value)}
              className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all normal-case font-bold ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500">Coupon Promo Code</label>
            <input
              type="text"
              required
              placeholder="e.g. WINTER30"
              value={newOfferCode}
              onChange={(e) => setNewOfferCode(e.target.value)}
              className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-500">Discount %</label>
              <input
                type="number"
                required
                min="1"
                max="99"
                value={newOfferDiscount}
                onChange={(e) => setNewOfferDiscount(Number(e.target.value))}
                className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold ${
                  darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-500">Expiry Date</label>
              <input
                type="text"
                placeholder="e.g. 15-12-2026"
                value={newOfferExpiry}
                onChange={(e) => setNewOfferExpiry(e.target.value)}
                className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold normal-case ${
                  darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#42B58C] hover:bg-brand-primary text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md mt-4 normal-case text-xs"
          >
            Publish Promo Code
          </button>
        </form>
      </div>

      {/* Right Column: Offers list */}
      <div className={`xl:col-span-8 rounded-[2rem] border p-6 space-y-5 ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
      }`}>
        <h3 className="font-extrabold text-sm dark:text-white">Active Offers & Promotions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offersList.map((offer) => (
            <div key={offer.id} className={`border rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-sm transition-all duration-300 ${
              darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-extrabold text-xs leading-tight">{offer.name}</p>
                  <span className="inline-block mt-2 bg-emerald-50 dark:bg-emerald-950/50 text-[#42B58C] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                    Code: {offer.code}
                  </span>
                </div>
                <span className="text-xl font-black text-[#42B58C]">{offer.discount}% OFF</span>
              </div>

              <div className="space-y-1 text-[10px] font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Usage Tracker:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-extrabold">{offer.usage}% Active</span>
                </div>
                <div className="w-full bg-slate-200/60 dark:bg-[#1E2F2A] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#42B58C] h-1.5 rounded-full" style={{ width: `${offer.usage}%` }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/40">
                <span className="text-[10px] text-slate-500 font-medium">Expires: {offer.expiry}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal('offer', offer)}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#15221E] border border-slate-200 dark:border-[#2E4B42] hover:text-blue-500 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#15221E] border border-slate-200 dark:border-[#2E4B42] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
