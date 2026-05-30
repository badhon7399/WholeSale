'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTierPrice, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'bkash'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setShippingAddress(user.companyAddress || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-brand-light text-brand-primary rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/10">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {language === 'en' ? 'Orders Placed!' : 'অর্ডার সফল হয়েছে!'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          {language === 'en' 
            ? 'Your wholesale orders have been successfully transmitted to the suppliers. They will review and confirm delivery details soon.'
            : 'আপনার পাইকারি অর্ডারসমূহ সফলভাবে সরবরাহকারীদের কাছে পাঠানো হয়েছে। তারা শীঘ্রই পর্যালোচনা করে ডেলিভারি নিশ্চিত করবেন।'}
        </p>
        <Link 
          href="/dashboard/buyer" 
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md inline-block"
        >
          {language === 'en' ? 'Go to Buyer Dashboard' : 'বায়ার ড্যাশবোর্ডে যান'}
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {language === 'en' ? 'Your Bulk Cart is Empty' : 'আপনার পাইকারি কার্ট খালি রয়েছে'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          {language === 'en' 
            ? 'Add products from our wholesale catalog to begin sourcing.'
            : 'সোর্সিং শুরু করতে আমাদের ক্যাটালগ থেকে পণ্য যোগ করুন।'}
        </p>
        <Link 
          href="/products" 
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
        >
          {t('exploreCatalog')}
        </Link>
      </div>
    );
  }

  // Group cart items by supplier
  const groupedCart: { [supplierId: string]: { supplierName: string; companyName: string; items: CartItem[] } } = {};
  cart.forEach((item) => {
    const sId = item.product.supplier._id;
    if (!groupedCart[sId]) {
      groupedCart[sId] = {
        supplierName: item.product.supplier.name,
        companyName: item.product.supplier.companyName,
        items: [],
      };
    }
    groupedCart[sId].items.push(item);
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (user.role !== 'buyer') {
      setError(language === 'en' ? 'Only commercial buyers can checkout wholesale items. Please login to a buyer profile.' : 'শুধুমাত্র বায়াররা পাইকারি অর্ডার সম্পন্ন করতে পারবেন।');
      return;
    }

    if (!shippingAddress.trim() || !phone.trim()) {
      setError(language === 'en' ? 'Please provide corporate shipping address and phone contact details.' : 'অনুগ্রহ করে কর্পোরেট ডেলিভারি ঠিকানা এবং মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    setSubmitting(true);

    try {
      // Loop over grouped cart and post an order for each supplier
      const supplierIds = Object.keys(groupedCart);
      for (const supplierId of supplierIds) {
        const group = groupedCart[supplierId];
        const payload = {
          supplier: supplierId,
          items: group.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          paymentMethod,
          shippingAddress,
          phone,
        };
        await api.post('/orders', payload, { token: token || undefined });
      }

      // Success
      clearCart();
      setOrderSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please review items and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Bilingual helper labels
  const groupLabel = language === 'en' ? 'Supplier Group' : 'সরবরাহকারী গ্রুপ';
  const tierPriceLabel = language === 'en' ? 'Tier Price' : 'টিয়ার প্রাইস';
  const subtotalLabel = language === 'en' ? 'Subtotal' : 'সাবটোটাল';
  const checkoutDetailsLabel = language === 'en' ? 'Corporate Checkout Details' : 'কর্পোরেট চেকআউট বিবরণ';
  const deliveryAddressLabel = language === 'en' ? 'Delivery Address' : 'ডেলিভারি ঠিকানা';
  const corporateMobileLabel = language === 'en' ? 'Corporate Mobile' : 'কর্পোরেট মোবাইল';
  const paymentMethodLabel = language === 'en' ? 'Payment Method' : 'পেমেন্ট পদ্ধতি';
  const bkashB2BLabel = language === 'en' ? 'bKash B2B' : 'বিকাশ বি২বি';
  const bankLCLabel = language === 'en' ? 'Bank L/C' : 'ব্যাংক এল/সি';
  const codLabel = language === 'en' ? 'COD' : 'ক্যাশ অন ডেলিভারি';
  const totalItemsLabel = language === 'en' ? 'Total Items' : 'মোট আইটেম';
  const ordersCountLabel = language === 'en' ? 'Orders Count' : 'মোট অর্ডার সংখ্যা';
  const grandTotalLabel = language === 'en' ? 'Grand Total' : 'সর্বমোট মূল্য';
  const placeOrdersLabel = language === 'en' ? 'Place Wholesale Orders' : 'পাইকারি অর্ডার সম্পন্ন করুন';
  const placingOrdersLabel = language === 'en' ? 'Placing B2B Orders...' : 'অর্ডার তৈরি হচ্ছে...';

  return (
    <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8 flex-grow bg-[#FAFAFA]">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">{t('cart')}</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list (grouped by supplier) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.keys(groupedCart).map((supplierId) => {
            const group = groupedCart[supplierId];
            return (
              <div key={supplierId} className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
                
                {/* Group Header */}
                <div className="bg-gray-50 border-b border-gray-150 px-5 py-3.5 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                    {groupLabel}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-gray-800 truncate">{group.companyName}</span>
                </div>

                {/* Group items */}
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => {
                    const pricePerUnit = getTierPrice(item);
                    return (
                      <div key={item.product._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        {/* Title & Image */}
                        <div className="flex items-center gap-3.5 flex-1">
                          <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                              <Link href={`/products/${item.product._id}`} className="hover:underline">{item.product.title}</Link>
                            </h3>
                            <div className="flex gap-2 mt-1 text-[9px] font-bold text-gray-400">
                              <span>MOQ: {item.product.moq} {t('units')}</span>
                              <span>•</span>
                              <span>{tierPriceLabel}: {pricePerUnit} {t('bdt')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-150 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 10)}
                            className="w-6.5 h-6.5 bg-white text-gray-600 rounded-lg flex items-center justify-center border border-gray-150 hover:bg-gray-50 disabled:opacity-50"
                            disabled={item.quantity <= item.product.moq}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-extrabold text-xs text-brand-dark px-1 w-10 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 10)}
                            className="w-6.5 h-6.5 bg-white text-gray-600 rounded-lg flex items-center justify-center border border-gray-150 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                          <div className="sm:text-right">
                            <div className="text-[9px] text-gray-400 font-bold uppercase">{subtotalLabel}</div>
                            <div className="font-black text-xs sm:text-sm text-brand-dark mt-0.5">{(pricePerUnit * item.quantity).toLocaleString()} {t('bdt')}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Block */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-5">
          <h2 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-3">
            {checkoutDetailsLabel}
          </h2>

          <form onSubmit={handleCheckout} className="space-y-5">
            
            {/* Contact details */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{deliveryAddressLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Corporate delivery location..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 transition-all font-semibold"
                  />
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{corporateMobileLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="01712XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-55 border border-gray-200 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 transition-all font-semibold"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{paymentMethodLabel}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-2 text-[9px] font-bold border rounded-xl transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-primary bg-brand-light text-brand-primary'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {codLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`py-2 text-[9px] font-bold border rounded-xl transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-brand-primary bg-brand-light text-brand-primary'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {bankLCLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`py-2 text-[9px] font-bold border rounded-xl transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-brand-primary bg-brand-light text-brand-primary'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {bkashB2BLabel}
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>{totalItemsLabel}</span>
                <span>{cart.reduce((s, i) => s + i.quantity, 0).toLocaleString()} {t('units')}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>{ordersCountLabel}</span>
                <span>{Object.keys(groupedCart).length} {language === 'en' ? 'Orders' : 'টি অর্ডার'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-brand-dark pt-1 border-t border-dashed border-gray-150">
                <span>{grandTotalLabel}</span>
                <span>{getCartTotal().toLocaleString()} {t('bdt')}</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs disabled:opacity-75 disabled:pointer-events-none"
            >
              {submitting ? placingOrdersLabel : placeOrdersLabel}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
