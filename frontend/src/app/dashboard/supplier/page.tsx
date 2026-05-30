'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ShieldCheck, Plus, Trash2, Check, Upload, AlertCircle, ShoppingBag, DollarSign, Box, Star, Truck, Landmark } from 'lucide-react';

export default function SupplierDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [moq, setMoq] = useState('20');
  const [stock, setStock] = useState('1000');
  const [priceTiers, setPriceTiers] = useState<{ minQuantity: number; pricePerUnit: number }[]>([
    { minQuantity: 20, pricePerUnit: 100 }
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Load stats
      const statsData = await api.get('/dashboard/supplier-stats', { token });
      setStats(statsData);

      // Load orders
      const ordersData = await api.get('/orders/supplier', { token });
      setOrders(ordersData);

      // Load categories
      const catData = await api.get('/categories');
      if (Array.isArray(catData)) {
        setCategories(catData);
        if (catData.length > 0) setCategory((catData[0] as any)._id);
      }
    } catch (err: any) {
      console.error('Error loading supplier stats:', err);
      setError(language === 'en' ? 'Failed to load supplier parameters.' : 'সাপ্লায়ার ড্যাশবোর্ড লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'supplier') {
      router.push('/');
      return;
    }
    if (token) {
      loadDashboardData();
    }
  }, [user, token, authLoading]);

  // Order Fulfillment Updates
  const handleUpdateOrderStatus = async (orderId: string, updates: { deliveryStatus?: string; paymentStatus?: string }) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/orders/${orderId}/status`, updates, { token: token || undefined });
      setSuccess(language === 'en' ? 'Order Status Updated Successfully.' : 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।');
      loadDashboardData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update order status.');
    }
  };

  // Add/Remove Price Tiers in Form
  const addPriceTier = () => {
    setPriceTiers([...priceTiers, { minQuantity: 100, pricePerUnit: 90 }]);
  };

  const removePriceTier = (idx: number) => {
    if (priceTiers.length === 1) return;
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handlePriceTierChange = (idx: number, field: 'minQuantity' | 'pricePerUnit', val: number) => {
    const updated = priceTiers.map((t, i) => 
      i === idx ? { ...t, [field]: val } : t
    );
    setPriceTiers(updated);
  };

  // Handle Product Upload & Sourcing Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmittingProduct(true);

    let imageUrls: string[] = [];

    try {
      // 1. Upload image file if selected
      if (imageFile) {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrls.push(uploadData.url);
        setImageUploading(false);
      } else {
        // Fallback placeholder image
        imageUrls.push('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
      }

      // 2. Submit product listing
      const payload = {
        title,
        description,
        category,
        moq: Number(moq),
        stock: Number(stock),
        priceTiers,
        images: imageUrls,
      };

      await api.post('/products', payload, { token: token || undefined });
      
      setSuccess(language === 'en' ? 'Wholesale Product Listed Successfully!' : 'পাইকারি পণ্যটি সফলভাবে তালিকাভুক্ত হয়েছে!');
      setTitle('');
      setDescription('');
      setMoq('20');
      setStock('1000');
      setPriceTiers([{ minQuantity: 20, pricePerUnit: 100 }]);
      setImageFile(null);
      loadDashboardData();
      
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to list product.');
    } finally {
      setSubmittingProduct(false);
      setImageUploading(false);
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
  const workspaceTitle = language === 'en' ? 'Supplier Workspace' : 'সাপ্লায়ার ওয়ার্কস্পেস';
  const supplierProfileDesc = user?.companyName || (language === 'en' ? 'Verified Corporate Supplier' : 'যাচাইকৃত কর্পোরেট সাপ্লায়ার');
  const pendingOrdersLabel = language === 'en' ? 'Pending Orders' : 'অপেক্ষমান অর্ডার';
  const totalRevenueLabel = language === 'en' ? 'Total Revenue' : 'মোট আয়';
  const activeListingsLabel = language === 'en' ? 'Active Listings' : 'সক্রিয় পণ্য তালিকা';

  const uploadProductTitle = language === 'en' ? 'Upload Wholesale Product' : 'পাইকারি পণ্য আপলোড করুন';
  const productTitleLabel = language === 'en' ? 'Product Title' : 'পণ্যের নাম';
  const descSpecsLabel = language === 'en' ? 'Description & Specs' : 'বিবরণ ও বিবরণী';
  const categoryLabel = language === 'en' ? 'Category' : 'ক্যাটাগরি';
  const imageUploadLabel = language === 'en' ? 'Image Upload' : 'ছবি আপলোড';
  const selectFileLabel = language === 'en' ? 'Select File' : 'ফাইল নির্বাচন করুন';
  const moqLabel = language === 'en' ? 'Minimum Order (MOQ)' : 'নূন্যতম অর্ডার (MOQ)';
  const stockLabel = language === 'en' ? 'Available Stock' : 'বর্তমান স্টক';
  const pricingTiersLabel = language === 'en' ? 'Wholesale Pricing Tiers' : 'পাইকারি মূল্য স্তর';
  const addTierLabel = language === 'en' ? 'Add Tier' : 'স্তর যোগ করুন';
  const minQtyLabel = language === 'en' ? 'Min Qty' : 'নূন্যতম পরিমাণ';
  const priceBdtLabel = language === 'en' ? 'Price BDT' : 'মূল্য (টাকা)';
  const uploadBtnLabel = language === 'en' ? 'List Product Sourcing Catalog' : 'পণ্যের তালিকায় যুক্ত করুন';
  const uploadingImgLabel = language === 'en' ? 'Uploading Image...' : 'ছবি আপলোড হচ্ছে...';
  const savingListingLabel = language === 'en' ? 'Saving Wholesale Listing...' : 'সংরক্ষণ করা হচ্ছে...';

  const corporateOrdersTitle = language === 'en' ? 'Corporate Sales Orders' : 'কর্পোরেট বিক্রয় অর্ডারসমূহ';
  const orderIdLabel = language === 'en' ? 'Order ID' : 'অর্ডার আইডি';
  const buyerLabel = language === 'en' ? 'Buyer' : 'ক্রেতা';
  const totalValueLabel = language === 'en' ? 'Total Value' : 'মোট মূল্য';
  const deliverToLabel = language === 'en' ? 'Deliver To' : 'ডেলিভারি গন্তব্য';
  const buyerPhoneLabel = language === 'en' ? 'Buyer Phone' : 'বায়ারের ফোন নম্বর';
  const shipmentStatusLabel = language === 'en' ? 'Shipment Status' : 'শিপমেন্ট অবস্থা';
  const paymentStatusLabel = language === 'en' ? 'Payment Status' : 'পেমেন্ট অবস্থা';
  const noOrdersLabel = language === 'en' ? 'No commercial sales orders logged yet.' : 'কোনো অর্ডার লগ করা হয়নি।';

  return (
    <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8 flex-grow space-y-8 bg-[#FAFAFA]">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">{workspaceTitle}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">{supplierProfileDesc}</p>
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
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{pendingOrdersLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{stats?.pendingOrdersCount || 0}</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{totalRevenueLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{(stats?.totalRevenue || 0).toLocaleString()} {t('bdt')}</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center gap-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{activeListingsLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">{stats?.activeProductsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Workspace Division */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Sourcing Lister */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-sm space-y-5">
          <h2 className="font-extrabold text-gray-900 text-sm sm:text-base border-b border-gray-50 pb-3">
            {uploadProductTitle}
          </h2>

          <form onSubmit={handleProductSubmit} className="space-y-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{productTitleLabel}</label>
              <input
                type="text"
                required
                placeholder="e.g. Export Denim Jeans (Grade A)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{descSpecsLabel}</label>
              <textarea
                required
                rows={3}
                placeholder="GSM details, material properties, color matrix..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{categoryLabel}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-55 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{imageUploadLabel}</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                  />
                  <div className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold cursor-pointer">
                    <Upload className="w-4 h-4 shrink-0" />
                    <span className="truncate">{imageFile ? imageFile.name.slice(0, 12) + '...' : selectFileLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{moqLabel}</label>
                <input
                  type="number"
                  required
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stockLabel}</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                />
              </div>
            </div>

            {/* Price Tiers input list */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{pricingTiersLabel}</label>
                <button
                  type="button"
                  onClick={addPriceTier}
                  className="text-[9px] bg-brand-light text-brand-primary font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  {addTierLabel}
                </button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 hide-scrollbar">
                {priceTiers.map((tier, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="flex-1 flex items-center bg-gray-55 rounded-xl border border-gray-200 p-1">
                      <span className="text-[8px] text-gray-400 px-1 shrink-0">{minQtyLabel}:</span>
                      <input
                        type="number"
                        value={tier.minQuantity}
                        onChange={(e) => handlePriceTierChange(idx, 'minQuantity', Number(e.target.value))}
                        className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-800 py-1 pl-1"
                      />
                    </div>
                    <div className="flex-1 flex items-center bg-gray-55 rounded-xl border border-gray-200 p-1">
                      <span className="text-[8px] text-gray-400 px-1 shrink-0">{priceBdtLabel}:</span>
                      <input
                        type="number"
                        value={tier.pricePerUnit}
                        onChange={(e) => handlePriceTierChange(idx, 'pricePerUnit', Number(e.target.value))}
                        className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-800 py-1 pl-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePriceTier(idx)}
                      disabled={priceTiers.length === 1}
                      className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingProduct || imageUploading}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 normal-case text-xs disabled:opacity-75 disabled:pointer-events-none"
            >
              {imageUploading ? uploadingImgLabel : submittingProduct ? savingListingLabel : uploadBtnLabel}
            </button>
          </form>
        </div>

        {/* Right Column: Fulfill Incoming Orders */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-sm">
          <h2 className="font-extrabold text-gray-900 text-sm sm:text-base mb-5 border-b border-gray-50 pb-3">
            {corporateOrdersTitle}
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-150 rounded-3xl p-4 sm:p-5 space-y-4 hover:border-gray-200 transition-colors bg-white">
                  
                  {/* Order header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block">{orderIdLabel}: #{order._id.slice(-8).toUpperCase()}</span>
                      <span className="font-extrabold text-xs sm:text-sm text-gray-900 mt-1 block">{buyerLabel}: {order.buyer?.companyName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Items list */}
                  <div className="bg-gray-50/50 rounded-2xl p-4 space-y-2 border border-gray-100">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between gap-4 text-xs font-semibold text-gray-650">
                        <span className="truncate">{item.product?.title || 'Wholesale item'}</span>
                        <span className="text-brand-dark shrink-0">{item.quantity} {t('units')} @ {item.price} {t('bdt')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-extrabold text-sm border-t border-dashed border-gray-150 pt-2 text-brand-dark">
                      <span>{totalValueLabel}</span>
                      <span>{order.totalAmount.toLocaleString()} {t('bdt')}</span>
                    </div>
                  </div>

                  {/* Shipping contact */}
                  <div className="text-[9px] text-gray-400 font-semibold grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold uppercase tracking-wider block">{deliverToLabel}</span>
                      <span className="text-gray-600 mt-0.5 block">{order.shippingAddress}</span>
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider block">{buyerPhoneLabel}</span>
                      <span className="text-gray-600 mt-0.5 block">{order.phone}</span>
                    </div>
                  </div>

                  {/* Actions / Status changers */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-gray-50">
                    <div className="flex gap-3">
                      {/* Delivery Status Select */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{shipmentStatusLabel}</span>
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, { deliveryStatus: e.target.value })}
                          className="bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Payment Status Select */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{paymentStatusLabel}</span>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, { paymentStatus: e.target.value })}
                          className="bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>
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
  );
}
