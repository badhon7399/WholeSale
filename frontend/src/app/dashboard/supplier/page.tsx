'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Upload, 
  AlertCircle, 
  ShoppingBag, 
  DollarSign, 
  Box, 
  Star, 
  Truck, 
  Landmark,
  Layers,
  Archive,
  ArrowUpRight,
  Eye,
  Settings,
  Activity,
  PlusCircle,
  FileText,
  RefreshCw,
  TrendingUp,
  MapPin,
  Phone
} from 'lucide-react';

export default function SupplierDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'catalog' | 'add-product'>('overview');

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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
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

      // Load products for this supplier
      const productsRes = await api.get('/products');
      const allProducts = productsRes.products || [];
      if (user) {
        setMyProducts(allProducts.filter((p: any) => {
          const supId = typeof p.supplier === 'object' && p.supplier ? p.supplier._id : p.supplier;
          return supId === user.id || p.supplier?.companyName === user.companyName;
        }));
      }
    } catch (err: any) {
      console.error('Error loading supplier data:', err);
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

  // Handle image select & local preview URL creation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl('');
    }
  };

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

  // Handle Product Upload & Catalog Submit
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
      setImagePreviewUrl('');
      loadDashboardData();
      
      setTimeout(() => setSuccess(''), 4000);
      setActiveTab('catalog'); // Navigate to catalog tab to see new listing!
    } catch (err: any) {
      setError(err.message || 'Failed to list product.');
    } finally {
      setSubmittingProduct(false);
      setImageUploading(false);
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

  // Bilingual translation strings
  const greetings = language === 'en' ? 'Welcome Back,' : 'স্বাগতম,';
  const workspaceTitle = language === 'en' ? 'Supplier Workspace' : 'সাপ্লায়ার ওয়ার্কস্পেস';
  const supplierProfileDesc = user?.companyName || (language === 'en' ? 'Verified Corporate Supplier' : 'যাচাইকৃত কর্পোরেট সাপ্লায়ার');
  const pendingOrdersLabel = language === 'en' ? 'Pending Orders' : 'অপেক্ষমান অর্ডার';
  const totalRevenueLabel = language === 'en' ? 'Total Revenue' : 'মোট আয়';
  const activeListingsLabel = language === 'en' ? 'Active Listings' : 'সক্রিয় পণ্য';

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAFDFB] to-[#F5F8F6] pb-16 flex-grow">
      
      {/* Background glow overlay */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-light/40 to-transparent pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-8 space-y-8 relative">
        
        {/* Top Header Greetings */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-primary bg-brand-light px-3 py-1 rounded-full">{greetings}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">{user?.name}</h1>
            <p className="text-xs text-gray-500 font-medium">{supplierProfileDesc}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('add-product')}
              className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-dark text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{uploadProductTitle}</span>
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
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-300">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-brand-light opacity-30 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <ShoppingBag className="w-28 h-28" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{pendingOrdersLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{stats?.pendingOrdersCount || 0}</span>
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
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{totalRevenueLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{(stats?.totalRevenue || 0).toLocaleString()} <span className="text-xs font-bold text-gray-400">{t('bdt')}</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-brand-light opacity-30 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Archive className="w-28 h-28" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{activeListingsLabel}</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">{stats?.activeProductsCount || 0}</span>
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
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'orders' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'Sales Orders' : 'বিক্রয় অর্ডার'}
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'catalog' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'My Catalog' : 'আমার ক্যাটালগ'}
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'add-product' 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {language === 'en' ? 'List New Product' : 'নতুন পণ্য তালিকা'}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Sales Orders Brief List */}
            <div className="xl:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <h2 className="font-black text-gray-900 text-base">{corporateOrdersTitle}</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-dark flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'Fulfill All Orders' : 'সব অর্ডার সম্পন্ন করুন'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 block">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <h4 className="font-extrabold text-xs text-gray-900 mt-1">{order.buyer?.companyName}</h4>
                        <p className="text-[10px] text-gray-450 font-bold uppercase mt-1">
                          {order.items.length} {language === 'en' ? 'Items' : 'আইটেম'} • {order.totalAmount.toLocaleString()} BDT
                        </p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        order.deliveryStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.deliveryStatus}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-bold text-center py-12">{noOrdersLabel}</p>
              )}
            </div>

            {/* Catalog Brief List */}
            <div className="xl:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <h2 className="font-black text-gray-900 text-base">{language === 'en' ? 'Active Listed Products' : 'সক্রিয় পণ্য তালিকা'}</h2>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-dark flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'View Catalog' : 'ক্যাটালগ দেখুন'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {myProducts.length > 0 ? (
                <div className="space-y-4">
                  {myProducts.slice(0, 3).map((prod) => (
                    <div key={prod._id} className="flex gap-4 items-center p-3 rounded-2xl border border-gray-100 bg-white">
                      <img
                        src={prod.images && prod.images[0]}
                        alt={prod.title}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-gray-900 truncate">{prod.title}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">
                          {language === 'en' ? `Stock: ${prod.stock} units` : `স্টক: ${prod.stock} টি`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-xs text-gray-400 font-bold">{language === 'en' ? 'No products uploaded yet.' : 'কোনো পণ্য আপলোড করা হয়নি।'}</p>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="bg-brand-primary text-white font-extrabold text-[10px] px-4 py-2 rounded-xl hover:bg-brand-dark transition-all inline-block shadow-sm"
                  >
                    {language === 'en' ? 'List Your First Product' : 'প্রথম পণ্য তালিকাভুক্ত করুন'}
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Orders Manager */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="font-black text-gray-900 text-lg">{corporateOrdersTitle}</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{language === 'en' ? 'Fulfill bulk order shipping milestones and verify buyer payment receipts' : 'ক্রেতাদের পেমেন্ট ও ডেলিভারি স্ট্যাটাস ব্যবস্থাপনা করুন'}</p>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-150 hover:border-gray-200 transition-colors rounded-3xl p-6 space-y-5 bg-white shadow-xs">
                    
                    {/* Order header details */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-50">
                      <div>
                        <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider block bg-brand-light px-2.5 py-0.5 rounded-full w-fit">Order: #{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-xs text-gray-405 font-bold mt-1.5 block">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">{totalValueLabel}</span>
                        <span className="font-black text-base sm:text-lg text-brand-dark block mt-0.5">{order.totalAmount.toLocaleString()} {t('bdt')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left items summary */}
                      <div className="lg:col-span-6 space-y-4">
                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-2">
                          <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider block pb-1 border-b border-gray-200/50">{language === 'en' ? 'Invoice Items' : 'অর্ডারের বিবরণী'}</span>
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between gap-4 text-xs font-semibold text-gray-700">
                              <span className="truncate">{item.product?.title || 'Wholesale Product'}</span>
                              <span className="text-brand-dark shrink-0 font-bold">{item.quantity} {t('units')} @ {item.price} {t('bdt')}</span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          <div className="bg-gray-55 border border-gray-200 rounded-xl p-3">
                            <span className="font-extrabold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-primary" />{deliverToLabel}</span>
                            <span className="text-gray-650 mt-1 block normal-case font-bold">{order.shippingAddress}</span>
                          </div>
                          <div className="bg-gray-55 border border-gray-200 rounded-xl p-3">
                            <span className="font-extrabold flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-primary" />{buyerPhoneLabel}</span>
                            <span className="text-gray-650 mt-1 block normal-case font-bold">{order.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Status Actions */}
                      <div className="lg:col-span-6 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-4">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block border-b border-gray-200/50 pb-1.5">{language === 'en' ? 'Manage Order Logistics' : 'লজিস্টিক ও পেমেন্ট ব্যবস্থাপন'}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Ship Status selector */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">{shipmentStatusLabel}</label>
                            <select
                              value={order.deliveryStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, { deliveryStatus: e.target.value })}
                              className="w-full bg-white border border-gray-200 text-xs font-bold text-gray-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
                            >
                              <option value="processing">Processing / প্রক্রিয়াধীন</option>
                              <option value="shipped">Shipped / প্রেরিত</option>
                              <option value="delivered">Delivered / ডেলিভার্ড</option>
                              <option value="cancelled">Cancelled / বাতিল</option>
                            </select>
                          </div>

                          {/* Payment status selector */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">{paymentStatusLabel}</label>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, { paymentStatus: e.target.value })}
                              className="w-full bg-white border border-gray-200 text-xs font-bold text-gray-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
                            >
                              <option value="pending">Pending / বকেয়া</option>
                              <option value="paid">Paid / পরিশোধিত</option>
                            </select>
                          </div>
                        </div>

                        {/* Status visual badges summary */}
                        <div className="flex gap-2 pt-2 text-[9px] font-extrabold">
                          <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            order.deliveryStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {order.deliveryStatus}
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50/50 rounded-2xl border border-gray-100 py-16 text-center text-xs text-gray-400 font-bold">{noOrdersLabel}</div>
            )}
          </div>
        )}

        {/* Tab 3: Catalog Manager */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{language === 'en' ? 'My Product Catalog' : 'আমার পণ্য ক্যাটালগ'}</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{language === 'en' ? 'Review active listings, inventory levels, and wholesale prices' : 'আপনার তালিকাভুক্ত সক্রিয় পণ্য এবং তাদের স্টক ও দাম পর্যালোচনা করুন'}</p>
              </div>
            </div>

            {myProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((prod) => (
                  <div key={prod._id} className="border border-gray-150 rounded-3xl p-4 bg-white flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow">
                    <div className="space-y-3">
                      <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={prod.images && prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[8px] font-extrabold text-brand-primary bg-brand-light px-2 py-0.5 rounded-md uppercase tracking-wider">{prod.category?.name}</span>
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1">{prod.title}</h3>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-50">
                      {/* Inventory details */}
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Stock: <span className="text-gray-800 font-black">{prod.stock}</span></span>
                        <span>MOQ: <span className="text-gray-800 font-black">{prod.moq}</span></span>
                      </div>

                      {/* Price Tiers List */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider block">{language === 'en' ? 'Price Matrix' : 'মূল্য তালিকা'}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.priceTiers && prod.priceTiers.map((tier: any, idx: number) => (
                            <span key={idx} className="text-[8px] font-extrabold bg-gray-55 border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                              {tier.minQuantity}+ qty: <span className="text-brand-dark">{tier.pricePerUnit} {t('bdt')}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-sm text-gray-400 font-bold">{language === 'en' ? 'You have no products listed.' : 'আপনার কোনো তালিকাভুক্ত পণ্য নেই।'}</p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="bg-brand-primary text-white font-black text-xs px-6 py-3 rounded-2xl hover:bg-brand-dark transition-all shadow-md inline-block"
                >
                  {uploadProductTitle}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Add Product Form */}
        {activeTab === 'add-product' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{uploadProductTitle}</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{language === 'en' ? 'Add detailed specifications and bulk price tiers for buyers' : 'ক্রেতাদের জন্য বিস্তারিত পণ্যের তথ্য এবং বাল্ক মূল্য স্তর যোগ করুন'}</p>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{productTitleLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export Denim Jeans (Slim Fit)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{descSpecsLabel}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detailed material information, sizes available, density, packaging..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{categoryLabel}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{imageUploadLabel}</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                      />
                      <div className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold cursor-pointer">
                        <Upload className="w-4 h-4 shrink-0 text-brand-primary" />
                        <span className="truncate">{imageFile ? imageFile.name : selectFileLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{moqLabel}</label>
                    <input
                      type="number"
                      required
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{stockLabel}</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-800 normal-case font-semibold"
                    />
                  </div>
                </div>

                {/* Price Tiers editor */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-extrabold text-gray-450 uppercase tracking-wider">{pricingTiersLabel}</label>
                    <button
                      type="button"
                      onClick={addPriceTier}
                      className="text-[9px] bg-brand-light hover:bg-brand-accent text-brand-primary font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {addTierLabel}
                    </button>
                  </div>

                  <div className="space-y-3 pr-1">
                    {priceTiers.map((tier, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 p-3 border border-gray-150 rounded-2xl w-full">
                        <div className="flex-1 flex items-center bg-white/50 px-2 py-1.5 rounded-xl sm:bg-transparent sm:p-0">
                          <span className="text-[8px] text-gray-400 px-1 shrink-0">{minQtyLabel}:</span>
                          <input
                            type="number"
                            value={tier.minQuantity}
                            onChange={(e) => handlePriceTierChange(idx, 'minQuantity', Number(e.target.value))}
                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-850 py-0.5 pl-1"
                          />
                        </div>
                        <div className="hidden sm:block h-6 w-[1px] bg-gray-200" />
                        <div className="flex-1 flex items-center bg-white/50 px-2 py-1.5 rounded-xl sm:bg-transparent sm:p-0">
                          <span className="text-[8px] text-gray-400 px-1 shrink-0">{priceBdtLabel}:</span>
                          <input
                            type="number"
                            value={tier.pricePerUnit}
                            onChange={(e) => handlePriceTierChange(idx, 'pricePerUnit', Number(e.target.value))}
                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-850 py-0.5 pl-1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePriceTier(idx)}
                          disabled={priceTiers.length === 1}
                          className="p-1.5 text-gray-450 hover:text-rose-500 disabled:opacity-30 shrink-0 self-end sm:self-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingProduct || imageUploading}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white font-extrabold py-4 rounded-2xl transition-all shadow-md mt-6 normal-case text-xs disabled:opacity-75 disabled:pointer-events-none"
                >
                  {imageUploading ? uploadingImgLabel : submittingProduct ? savingListingLabel : uploadBtnLabel}
                </button>
              </form>
            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <span className="text-[9px] font-extrabold text-brand-primary bg-brand-light px-3 py-1 rounded-full uppercase tracking-wider block w-fit">{language === 'en' ? 'Live Card Preview' : 'কার্ড প্রিভিউ'}</span>
              
              <div className="border border-gray-150 rounded-3xl p-4 bg-white flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2 text-gray-400">
                        <Upload className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-[9px] font-bold block uppercase tracking-wider">{language === 'en' ? 'No Image Selected' : 'কোনো ছবি নির্বাচিত নেই'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8px] font-extrabold text-brand-primary bg-brand-light px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {categories.find(c => c._id === category)?.name || 'Category'}
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1">{title || 'Product Title Placeholder'}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed normal-case font-medium">{description || 'Product description specs and notes will show here...'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-50">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Stock: <span className="text-gray-800 font-black">{stock}</span></span>
                    <span>MOQ: <span className="text-gray-800 font-black">{moq}</span></span>
                  </div>

                  {/* Price Tiers List */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider block">{language === 'en' ? 'Price Matrix' : 'মূল্য তালিকা'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {priceTiers.map((tier, idx) => (
                        <span key={idx} className="text-[8px] font-extrabold bg-gray-55 border border-gray-250 text-gray-700 px-2 py-0.5 rounded-md">
                          {tier.minQuantity}+ qty: <span className="text-brand-dark">{tier.pricePerUnit} {t('bdt')}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
