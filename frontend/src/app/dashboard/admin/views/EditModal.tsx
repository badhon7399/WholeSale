'use client';

import React from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  darkMode: boolean;
  editingItem: { type: 'user' | 'product' | 'rfq' | 'category' | 'offer'; data: any } | null;
  setEditingItem: (val: any) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  
  // Fields & Setters
  editUserName: string; setEditUserName: (val: string) => void;
  editUserCompanyName: string; setEditUserCompanyName: (val: string) => void;
  editUserEmail: string; setEditUserEmail: (val: string) => void;
  editUserPhone: string; setEditUserPhone: (val: string) => void;
  editUserTradeLicense: string; setEditUserTradeLicense: (val: string) => void;

  editProductTitle: string; setEditProductTitle: (val: string) => void;
  editProductStock: number; setEditProductStock: (val: number) => void;
  editProductMoq: number; setEditProductMoq: (val: number) => void;
  editProductPrice: number; setEditProductPrice: (val: number) => void;

  editRfqTitle: string; setEditRfqTitle: (val: string) => void;
  editRfqQuantity: number; setEditRfqQuantity: (val: number) => void;
  editRfqTargetPrice: number; setEditRfqTargetPrice: (val: number) => void;

  editCategoryName: string; setEditCategoryName: (val: string) => void;
  editCategorySlug: string; setEditCategorySlug: (val: string) => void;
  editCategoryImage: string; setEditCategoryImage: (val: string) => void;

  editOfferName: string; setEditOfferName: (val: string) => void;
  editOfferCode: string; setEditOfferCode: (val: string) => void;
  editOfferDiscount: number; setEditOfferDiscount: (val: number) => void;
  editOfferExpiry: string; setEditOfferExpiry: (val: string) => void;
}

export default function EditModal({
  darkMode,
  editingItem,
  setEditingItem,
  handleEditSubmit,
  
  editUserName, setEditUserName,
  editUserCompanyName, setEditUserCompanyName,
  editUserEmail, setEditUserEmail,
  editUserPhone, setEditUserPhone,
  editUserTradeLicense, setEditUserTradeLicense,

  editProductTitle, setEditProductTitle,
  editProductStock, setEditProductStock,
  editProductMoq, setEditProductMoq,
  editProductPrice, setEditProductPrice,

  editRfqTitle, setEditRfqTitle,
  editRfqQuantity, setEditRfqQuantity,
  editRfqTargetPrice, setEditRfqTargetPrice,

  editCategoryName, setEditCategoryName,
  editCategorySlug, setEditCategorySlug,
  editCategoryImage, setEditCategoryImage,

  editOfferName, setEditOfferName,
  editOfferCode, setEditOfferCode,
  editOfferDiscount, setEditOfferDiscount,
  editOfferExpiry, setEditOfferExpiry
}: EditModalProps) {
  
  if (!editingItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
      <div className={`rounded-[2rem] p-6 sm:p-8 max-w-lg w-full border shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto relative animate-scale-up ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-100'
      }`}>
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100/50 mb-6">
          <div>
            <h3 className="text-base font-extrabold dark:text-white">
              Edit B2B {editingItem.type.toUpperCase()}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Resource ID: {editingItem.data.id || editingItem.data._id}
            </p>
          </div>
          <button 
            onClick={() => setEditingItem(null)} 
            className="text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1B2C27] border border-slate-100 dark:border-slate-200/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleEditSubmit} className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          
          {/* User Edit Fields */}
          {editingItem.type === 'user' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Company Name</label>
                <input
                  type="text"
                  value={editUserCompanyName}
                  onChange={(e) => setEditUserCompanyName(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Contact Phone</label>
                <input
                  type="text"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              {editingItem.data.role === 'supplier' && (
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Trade License</label>
                  <input
                    type="text"
                    value={editUserTradeLicense}
                    onChange={(e) => setEditUserTradeLicense(e.target.value)}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
              )}
            </>
          )}

          {/* Product Edit Fields */}
          {editingItem.type === 'product' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Product Title</label>
                <input
                  type="text"
                  required
                  value={editProductTitle}
                  onChange={(e) => setEditProductTitle(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(Number(e.target.value))}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Min Order Qty (MOQ)</label>
                  <input
                    type="number"
                    required
                    value={editProductMoq}
                    onChange={(e) => setEditProductMoq(Number(e.target.value))}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Base Price Per Unit (BDT)</label>
                <input
                  type="number"
                  required
                  value={editProductPrice}
                  onChange={(e) => setEditProductPrice(Number(e.target.value))}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
            </>
          )}

          {/* RFQ Edit Fields */}
          {editingItem.type === 'rfq' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={editRfqTitle}
                  onChange={(e) => setEditRfqTitle(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Quantity Requested</label>
                  <input
                    type="number"
                    required
                    value={editRfqQuantity}
                    onChange={(e) => setEditRfqQuantity(Number(e.target.value))}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Target Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={editRfqTargetPrice}
                    onChange={(e) => setEditRfqTargetPrice(Number(e.target.value))}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Category Edit Fields */}
          {editingItem.type === 'category' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Category Name</label>
                <input
                  type="text"
                  required
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Slug Link</label>
                <input
                  type="text"
                  required
                  value={editCategorySlug}
                  onChange={(e) => setEditCategorySlug(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Image URL</label>
                <input
                  type="text"
                  value={editCategoryImage}
                  onChange={(e) => setEditCategoryImage(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
            </>
          )}

          {/* Offer Promo Edit Fields */}
          {editingItem.type === 'offer' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Offer Title</label>
                <input
                  type="text"
                  required
                  value={editOfferName}
                  onChange={(e) => setEditOfferName(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                    darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-500">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={editOfferCode}
                  onChange={(e) => setEditOfferCode(e.target.value)}
                  className={`w-full text-xs px-4 py-3 rounded-2xl font-bold uppercase ${
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
                    value={editOfferDiscount}
                    onChange={(e) => setEditOfferDiscount(Number(e.target.value))}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={editOfferExpiry}
                    onChange={(e) => setEditOfferExpiry(e.target.value)}
                    className={`w-full text-xs px-4 py-3 rounded-2xl font-bold normal-case ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Action Controls */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-200/10 mt-6 justify-end">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-6 py-3 rounded-2xl normal-case text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#42B58C] hover:bg-brand-primary text-white font-extrabold px-6 py-3 rounded-2xl normal-case text-xs transition-all shadow-md"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
