'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Users, ShoppingBag, FileText, CheckCircle, ShieldAlert,
  Grid, ListOrdered, FolderPlus, Search, Percent,
  ChevronRight, Activity, Clock, LogOut, Menu, X,
  Sun, Moon, Bell, Calendar, ChevronDown, Settings, Tag
} from 'lucide-react';

// View Subcomponents
import OverviewView from './views/OverviewView';
import UsersView from './views/UsersView';
import ProductsView from './views/ProductsView';
import OffersView from './views/OffersView';
import InventoryView from './views/InventoryView';
import OrdersView from './views/OrdersView';
import RfqsView from './views/RfqsView';
import CustomerView from './views/CustomerView';
import CategoriesView from './views/CategoriesView';
import SettingsView from './views/SettingsView';
import EditModal from './views/EditModal';

type TabType = 'overview' | 'users' | 'products' | 'rfqs' | 'orders' | 'categories' | 'offers' | 'inventory' | 'customer' | 'settings';

export default function AdminDashboard() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Core preferences
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Low Stock Alert threshold
  const [lowStockThreshold, setLowStockThreshold] = useState(150);

  // Selected customer for detail insight panel
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Data lists
  const [usersList, setUsersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [rfqsList, setRfqsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [offersList, setOffersList] = useState<any[]>([
    { id: '1', name: '40% Discount Offer', code: 'W40OFF', discount: 40, expiry: '05-09-2026', usage: 72 },
    { id: '2', name: '100 Taka Coupon', code: 'TAKA100', discount: 10, expiry: '10-09-2026', usage: 45 },
    { id: '3', name: 'Stock Out Sell', code: 'STKOUT', discount: 15, expiry: '14-09-2026', usage: 18 }
  ]);

  // Create Coupon Offer fields
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(10);
  const [newOfferExpiry, setNewOfferExpiry] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<{ type: 'user' | 'product' | 'rfq' | 'category' | 'offer'; data: any } | null>(null);
  
  // Edit Form Fields
  const [editUserName, setEditUserName] = useState('');
  const [editUserCompanyName, setEditUserCompanyName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserTradeLicense, setEditUserTradeLicense] = useState('');

  const [editProductTitle, setEditProductTitle] = useState('');
  const [editProductStock, setEditProductStock] = useState(0);
  const [editProductMoq, setEditProductMoq] = useState(1);
  const [editProductPrice, setEditProductPrice] = useState(0);

  const [editRfqTitle, setEditRfqTitle] = useState('');
  const [editRfqQuantity, setEditRfqQuantity] = useState(1);
  const [editRfqTargetPrice, setEditRfqTargetPrice] = useState(0);

  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategorySlug, setEditCategorySlug] = useState('');
  const [editCategoryImage, setEditCategoryImage] = useState('');

  const [editOfferName, setEditOfferName] = useState('');
  const [editOfferCode, setEditOfferCode] = useState('');
  const [editOfferDiscount, setEditOfferDiscount] = useState(10);
  const [editOfferExpiry, setEditOfferExpiry] = useState('');

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      const statsRes = await api.get('/admin/stats', { token: token || undefined });
      setStats(statsRes);
    } catch (err: any) {
      console.error(err);
      setError(language === 'en' ? 'Failed to fetch admin stats.' : 'অ্যাডমিন স্ট্যাটাস লোড করতে ব্যর্থ হয়েছে।');
    }
  };

  const loadTabContent = async (tab: TabType) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      if (tab === 'users' || tab === 'customer') {
        const res = await api.get(`/admin/users?search=${searchTerm}`, { token: token || undefined });
        setUsersList(res);
      } else if (tab === 'products' || tab === 'inventory') {
        const res = await api.get(`/admin/products?search=${searchTerm}`, { token: token || undefined });
        setProductsList(res);
      } else if (tab === 'rfqs') {
        const res = await api.get(`/admin/rfqs?search=${searchTerm}`, { token: token || undefined });
        setRfqsList(res);
      } else if (tab === 'orders') {
        const res = await api.get('/admin/orders', { token: token || undefined });
        setOrdersList(res);
      } else if (tab === 'categories') {
        const catData = await api.get('/categories');
        if (Array.isArray(catData)) setCategoriesList(catData as any[]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    if (token) {
      setLoading(true);
      Promise.all([loadDashboardData(), loadTabContent(activeTab)]).then(() => setLoading(false));
    }
  }, [user, token, authLoading, activeTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    setSuccess('');
    try {
      await Promise.all([loadDashboardData(), loadTabContent(activeTab)]);
      setSuccess(language === 'en' ? 'Dashboard statistics synchronized.' : 'তথ্য লগের সমন্বয় সম্পন্ন হয়েছে।');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Sync failed.');
    } finally {
      setRefreshing(false);
    }
  };

  // Open Edit Modals helper
  const openEditModal = (type: 'user' | 'product' | 'rfq' | 'category' | 'offer', data: any) => {
    setEditingItem({ type, data });
    if (type === 'user') {
      setEditUserName(data.name || '');
      setEditUserCompanyName(data.companyName || '');
      setEditUserEmail(data.email || '');
      setEditUserPhone(data.phone || '');
      setEditUserTradeLicense(data.tradeLicense || '');
    } else if (type === 'product') {
      setEditProductTitle(data.title || '');
      setEditProductStock(data.stock || 0);
      setEditProductMoq(data.moq || 1);
      setEditProductPrice(data.priceTiers?.[0]?.pricePerUnit || 0);
    } else if (type === 'rfq') {
      setEditRfqTitle(data.title || '');
      setEditRfqQuantity(data.quantity || 1);
      setEditRfqTargetPrice(data.targetPrice || 0);
    } else if (type === 'category') {
      setEditCategoryName(data.name || '');
      setEditCategorySlug(data.slug || '');
      setEditCategoryImage(data.image || '');
    } else if (type === 'offer') {
      setEditOfferName(data.name || '');
      setEditOfferCode(data.code || '');
      setEditOfferDiscount(data.discount || 10);
      setEditOfferExpiry(data.expiry || '');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !token) return;
    setError('');
    setSuccess('');
    try {
      const { type, data } = editingItem;
      if (type === 'user') {
        await api.put(`/admin/users/${data._id}`, {
          name: editUserName,
          companyName: editUserCompanyName,
          email: editUserEmail,
          phone: editUserPhone,
          tradeLicense: editUserTradeLicense
        }, { token: token || undefined });
        setSuccess(language === 'en' ? 'User profile updated.' : 'ব্যবহারকারীর প্রোফাইল আপডেট করা হয়েছে।');
        loadTabContent('users');
      } else if (type === 'product') {
        await api.put(`/admin/products/${data._id}`, {
          title: editProductTitle,
          stock: editProductStock,
          moq: editProductMoq,
          basePrice: editProductPrice
        }, { token: token || undefined });
        setSuccess(language === 'en' ? 'Product details updated.' : 'পণ্যের বিবরণ আপডেট করা হয়েছে।');
        loadTabContent('products');
      } else if (type === 'rfq') {
        await api.put(`/admin/rfqs/${data._id}`, {
          title: editRfqTitle,
          quantity: editRfqQuantity,
          targetPrice: editRfqTargetPrice
        }, { token: token || undefined });
        setSuccess(language === 'en' ? 'RFQ details updated.' : 'আরএফকিউ আপডেট করা হয়েছে।');
        loadTabContent('rfqs');
      } else if (type === 'category') {
        await api.put(`/admin/categories/${data._id}`, {
          name: editCategoryName,
          slug: editCategorySlug.toLowerCase().replace(/\s+/g, '-'),
          image: editCategoryImage
        }, { token: token || undefined });
        setSuccess(language === 'en' ? 'Category details updated.' : 'ক্যাটাগরি আপডেট করা হয়েছে।');
        loadTabContent('categories');
      } else if (type === 'offer') {
        const updatedOffers = offersList.map(o => 
          o.id === data.id ? { ...o, name: editOfferName, code: editOfferCode, discount: editOfferDiscount, expiry: editOfferExpiry } : o
        );
        setOffersList(updatedOffers);
        setSuccess(language === 'en' ? 'Offer coupon updated.' : 'অফার কুপন আপডেট করা হয়েছে।');
      }
      setEditingItem(null);
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Update request failed.');
    }
  };

  // User Actions
  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/admin/users/${userId}/verify`, { isVerified: !currentStatus }, { token: token || undefined });
      setSuccess(language === 'en' ? 'User verification updated.' : 'ব্যবহারকারীর ভেরিফিকেশন পরিবর্তন করা হয়েছে।');
      loadTabContent('users');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Verification update failed.');
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    setError('');
    setSuccess('');
    let nextRole = 'buyer';
    if (currentRole === 'buyer') nextRole = 'supplier';
    else if (currentRole === 'supplier') nextRole = 'admin';

    const confirmRoleMsg = language === 'en' 
      ? `Promote/Change role of user to ${nextRole}?`
      : `ব্যবহারকারীর রোল পরিবর্তন করে ${nextRole} করতে চান?`;
    if (!confirm(confirmRoleMsg)) return;

    try {
      await api.put(`/admin/users/${userId}/role`, { role: nextRole }, { token: token || undefined });
      setSuccess(language === 'en' ? `Role assigned to ${nextRole}.` : `রোল পরিবর্তন করে ${nextRole} করা হয়েছে।`);
      loadTabContent('users');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Role change failed.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setError('');
    setSuccess('');
    const confirmDel = language === 'en' 
      ? 'Delete this user permanently? This will remove all their catalog items/orders.' 
      : 'এই ব্যবহারকারীকে স্থায়ীভাবে মুছে ফেলতে চান? এর ফলে তাদের সব প্রোডাক্ট ও অর্ডার মুছে যাবে।';
    if (!confirm(confirmDel)) return;

    try {
      await api.delete(`/admin/users/${userId}`, { token: token || undefined });
      setSuccess(language === 'en' ? 'User profile deleted.' : 'ব্যবহারকারীর অ্যাকাউন্ট মুছে ফেলা হয়েছে।');
      loadTabContent('users');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Delete user failed.');
    }
  };

  // Product Actions
  const handleDeleteProduct = async (productId: string) => {
    setError('');
    setSuccess('');
    const confirmDel = language === 'en' ? 'Delete this product listing?' : 'এই প্রোডাক্টটি তালিকা থেকে মুছে ফেলতে চান?';
    if (!confirm(confirmDel)) return;

    try {
      await api.delete(`/admin/products/${productId}`, { token: token || undefined });
      setSuccess(language === 'en' ? 'Product deleted.' : 'প্রোডাক্ট তালিকা থেকে মুছে ফেলা হয়েছে।');
      loadTabContent('products');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Delete product failed.');
    }
  };

  // Inventory Quick Restock Action
  const handleRestockProduct = async (productId: string, currentStock: number) => {
    setError('');
    setSuccess('');
    try {
      const targetProduct = productsList.find(p => p._id === productId);
      if (!targetProduct) return;
      const finalStock = currentStock + 500;
      await api.put(`/admin/products/${productId}`, {
        title: targetProduct.title,
        stock: finalStock,
        moq: targetProduct.moq,
        basePrice: targetProduct.priceTiers?.[0]?.pricePerUnit || 100
      }, { token: token || undefined });
      setSuccess(language === 'en' ? 'Restocked +500 items.' : 'স্টকে +৫০০ টি পণ্য যোগ করা হয়েছে।');
      loadTabContent('inventory');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Restock failed.');
    }
  };

  // RFQ Actions
  const handleDeleteRfq = async (rfqId: string) => {
    setError('');
    setSuccess('');
    const confirmDel = language === 'en' ? 'Delete this sourcing RFQ?' : 'এই সোর্সিং আরএফকিউটি মুছে ফেলতে চান?';
    if (!confirm(confirmDel)) return;

    try {
      await api.delete(`/admin/rfqs/${rfqId}`, { token: token || undefined });
      setSuccess(language === 'en' ? 'RFQ deleted.' : 'আরএফকিউটি মুছে ফেলা হয়েছে।');
      loadTabContent('rfqs');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Delete RFQ failed.');
    }
  };

  // Category Actions
  const handleDeleteCategory = async (catId: string) => {
    setError('');
    setSuccess('');
    const confirmDel = language === 'en' ? 'Delete this category?' : 'এই ক্যাটাগরি মুছে ফেলতে চান?';
    if (!confirm(confirmDel)) return;

    try {
      await api.delete(`/admin/categories/${catId}`, { token: token || undefined });
      setSuccess(language === 'en' ? 'Category deleted.' : 'ক্যাটাগরি মুছে ফেলা হয়েছে।');
      loadTabContent('categories');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Delete category failed.');
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, updates: { deliveryStatus?: string; paymentStatus?: string }) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/admin/orders/${orderId}/status`, updates, { token: token || undefined });
      setSuccess(language === 'en' ? 'Order status updated.' : 'অর্ডার স্ট্যাটাস আপডেট করা হয়েছে।');
      loadTabContent('orders');
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Order update failed.');
    }
  };

  // Create Category Action
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newCatName || !newCatSlug) {
      setError('Please provide Name and Slug fields');
      return;
    }
    try {
      await api.post('/categories', {
        name: newCatName,
        slug: newCatSlug.toLowerCase().replace(/\s+/g, '-'),
        image: newCatImage
      }, { token: token || undefined });
      setSuccess(language === 'en' ? 'Category created successfully!' : 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে!');
      setNewCatName('');
      setNewCatSlug('');
      setNewCatImage('');
      loadTabContent('categories');
    } catch (err: any) {
      setError(err.message || 'Category creation failed.');
    }
  };

  // Create Offer Promo Action
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferName || !newOfferCode) {
      setError('Please provide Offer Name and Coupon Code');
      return;
    }
    const promo = {
      id: Date.now().toString(),
      name: newOfferName,
      code: newOfferCode.toUpperCase().replace(/\s+/g, ''),
      discount: Number(newOfferDiscount) || 10,
      expiry: newOfferExpiry || '12-12-2026',
      usage: 0
    };
    setOffersList([...offersList, promo]);
    setNewOfferName('');
    setNewOfferCode('');
    setNewOfferDiscount(10);
    setNewOfferExpiry('');
    setSuccess('Promo Coupon Created Successfully.');
    setTimeout(() => setSuccess(''), 3050);
  };

  const handleDeleteOffer = (promoId: string) => {
    setOffersList(offersList.filter(o => o.id !== promoId));
    setSuccess('Offer coupon removed.');
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'overview': return language === 'en' ? 'Overview' : 'ওভারভিউ';
      case 'users': return language === 'en' ? 'Registered Users' : 'নিবন্ধিত ইউজার';
      case 'products': return language === 'en' ? 'Product Catalog' : 'পণ্য ক্যাটালগ';
      case 'rfqs': return language === 'en' ? 'RFQ Sourcing' : 'আরএফকিউ সোর্সিং';
      case 'orders': return language === 'en' ? 'Commercial Orders' : 'অর্ডার ট্র্যাকিং';
      case 'categories': return language === 'en' ? 'Marketplace Categories' : 'ক্যাটাগরি ক্যাটালগ';
      case 'offers': return language === 'en' ? 'Current Offers' : 'চলতি অফার সমূহ';
      case 'inventory': return language === 'en' ? 'Inventory Management' : 'ইনভেন্টরি নিয়ন্ত্রণ';
      case 'customer': return language === 'en' ? 'Customer Insights' : 'গ্রাহক প্রোফাইল';
      case 'settings': return language === 'en' ? 'Settings Panel' : 'কনফিগ সেটিংস';
    }
  };

  const menuItems: { id: TabType; icon: React.ReactNode; labelEn: string; labelBn: string }[] = [
    { id: 'overview', icon: <Grid className="w-4 h-4" />, labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
    { id: 'users', icon: <Users className="w-4 h-4" />, labelEn: 'B2B Users', labelBn: 'নিবন্ধিত ইউজার' },
    { id: 'products', icon: <ShoppingBag className="w-4 h-4" />, labelEn: 'Products', labelBn: 'পণ্যসমূহ' },
    { id: 'offers', icon: <Percent className="w-4 h-4" />, labelEn: 'Offers', labelBn: 'অফার সমূহ' },
    { id: 'inventory', icon: <FileText className="w-4 h-4" />, labelEn: 'Inventory', labelBn: 'ইনভেন্টরি' },
    { id: 'orders', icon: <ListOrdered className="w-4 h-4" />, labelEn: 'Orders', labelBn: 'অর্ডার সমূহ' },
    { id: 'rfqs', icon: <Activity className="w-4 h-4" />, labelEn: 'RFQs', labelBn: 'আরএফকিউ সোর্সিং' },
    { id: 'customer', icon: <Users className="w-4 h-4" />, labelEn: 'Customers', labelBn: 'গ্রাহক বিবরণ' },
    { id: 'categories', icon: <Tag className="w-4 h-4" />, labelEn: 'Categories', labelBn: 'ক্যাটাগরি সমূহ' },
    { id: 'settings', icon: <Settings className="w-4 h-4" />, labelEn: 'Settings', labelBn: 'সেটিংস' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A1A12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-950 border-t-emerald-400 animate-spin"></div>
          </div>
          <span className="text-[10px] text-emerald-500/80 font-bold tracking-widest uppercase">Initializing Interface...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen overflow-hidden flex flex-col lg:flex-row font-sans antialiased relative transition-colors duration-300 ${
      darkMode ? 'dark bg-[#0E1714] text-[#E2EFEA]' : 'bg-[#EDF3F1] text-slate-800'
    }`}>
      
      {/* Floating mesh graphic */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-brand-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* 1. MOCKUP INSPIRED SIDEBAR */}
      <aside className={`fixed lg:sticky lg:top-0 lg:h-screen lg:shrink-0 inset-y-0 left-0 z-50 w-72 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:transform-none transition-transform duration-300 ease-out flex flex-col border-r shadow-sm ${
        darkMode ? 'bg-[#15221E] border-[#223932] text-slate-350' : 'bg-[#E2ECE9] border-slate-200 text-slate-700'
      }`}>
        
        {/* Brand logo panel */}
        <div className="p-6 border-b flex items-center justify-between border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#42B58C] to-brand-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
              P
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight block">Pixel Commerce</span>
              <span className="text-[9px] text-[#558D76] font-bold tracking-wider uppercase block">WholeSale Desk</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow p-5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#5EEAD4] text-[#0A2218] shadow-md shadow-[#5EEAD4]/10 font-extrabold' 
                    : `${darkMode ? 'text-[#8EA69D] hover:bg-[#1D322B] hover:text-white' : 'text-slate-600 hover:bg-[#D4E2DE] hover:text-slate-900'}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${
                    isActive ? 'bg-[#0E291F] text-[#5EEAD4]' : 'text-slate-400 group-hover:text-slate-800'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{language === 'en' ? item.labelEn : item.labelBn}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-[#0A2218]" />}
              </button>
            );
          })}
        </nav>

        {/* Theme and Logout control */}
        <div className={`p-5 border-t space-y-4 ${darkMode ? 'border-[#223932] bg-[#111B18]' : 'border-slate-200 bg-[#D4E2DE]/50'}`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Theme Mode
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full p-1 transition-all ${
                darkMode ? 'bg-[#5EEAD4] justify-end' : 'bg-slate-300 justify-start'
              } flex items-center`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-all"></span>
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full bg-red-900/10 hover:bg-red-900/20 text-red-400 hover:text-red-300 font-bold text-xs py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP WORKSPACE CONTAINER */}
      <main className="flex-grow h-full overflow-y-auto flex flex-col min-w-0">
        
        {/* Mockup Header */}
        <header className={`sticky top-0 z-45 border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
          darkMode ? 'bg-[#15221E]/90 border-[#223932] backdrop-blur-md' : 'bg-[#EDF3F1]/90 border-slate-200/60 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-4 w-full max-w-lg">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl hover:bg-slate-200/50 text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search metrics, logs, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${
                  darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 pl-4">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase ${
              darkMode ? 'bg-[#1B2C27] text-emerald-400' : 'bg-white text-slate-600 shadow-sm border border-slate-200'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>30 May 2026</span>
            </div>

            <button className={`p-2.5 rounded-xl relative ${
              darkMode ? 'bg-[#1B2C27] text-slate-300' : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
            }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#42B58C] to-brand-primary text-white font-extrabold flex items-center justify-center shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard views body */}
        <div className="flex-grow p-6 sm:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          
          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-3xl flex items-center gap-3 text-xs font-extrabold border border-emerald-100 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-3xl flex items-center gap-3 text-xs font-extrabold border border-red-100 shadow-sm">
              <ShieldAlert className="w-4 h-4 text-red-650" />
              <span>{error}</span>
            </div>
          )}

          {/* DYNAMIC TAB PAGE VIEWS */}
          {activeTab === 'overview' && (
            <OverviewView darkMode={darkMode} offersList={offersList} />
          )}

          {activeTab === 'users' && (
            <UsersView 
              darkMode={darkMode} 
              usersList={usersList} 
              roleFilter={roleFilter} 
              setRoleFilter={setRoleFilter} 
              handleRoleChange={handleRoleChange} 
              handleToggleVerification={handleToggleVerification} 
              handleDeleteUser={handleDeleteUser} 
              openEditModal={openEditModal} 
            />
          )}

          {activeTab === 'products' && (
            <ProductsView 
              darkMode={darkMode} 
              productsList={productsList} 
              openEditModal={openEditModal} 
              handleDeleteProduct={handleDeleteProduct} 
            />
          )}

          {activeTab === 'offers' && (
            <OffersView 
              darkMode={darkMode} 
              offersList={offersList} 
              newOfferName={newOfferName} 
              setNewOfferName={setNewOfferName} 
              newOfferCode={newOfferCode} 
              setNewOfferCode={setNewOfferCode} 
              newOfferDiscount={newOfferDiscount} 
              setNewOfferDiscount={setNewOfferDiscount} 
              newOfferExpiry={newOfferExpiry} 
              setNewOfferExpiry={setNewOfferExpiry} 
              handleCreateOffer={handleCreateOffer} 
              handleDeleteOffer={handleDeleteOffer} 
              openEditModal={openEditModal} 
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              darkMode={darkMode} 
              productsList={productsList} 
              lowStockThreshold={lowStockThreshold} 
              setLowStockThreshold={setLowStockThreshold} 
              handleRestockProduct={handleRestockProduct} 
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              darkMode={darkMode} 
              ordersList={ordersList} 
              handleUpdateOrderStatus={handleUpdateOrderStatus} 
            />
          )}

          {activeTab === 'rfqs' && (
            <RfqsView 
              darkMode={darkMode} 
              rfqsList={rfqsList} 
              openEditModal={openEditModal} 
              handleDeleteRfq={handleDeleteRfq} 
            />
          )}

          {activeTab === 'customer' && (
            <CustomerView 
              darkMode={darkMode} 
              usersList={usersList} 
              ordersList={ordersList} 
              selectedCustomer={selectedCustomer} 
              setSelectedCustomer={setSelectedCustomer} 
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView 
              darkMode={darkMode} 
              categoriesList={categoriesList} 
              newCatName={newCatName} 
              setNewCatName={setNewCatName} 
              newCatSlug={newCatSlug} 
              setNewCatSlug={setNewCatSlug} 
              newCatImage={newCatImage} 
              setNewCatImage={setNewCatImage} 
              handleCreateCategory={handleCreateCategory} 
              handleDeleteCategory={handleDeleteCategory} 
              openEditModal={openEditModal} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              handleRefresh={handleRefresh} 
            />
          )}

        </div>

      </main>

      {/* EDIT MODAL OVERLAY */}
      <EditModal 
        darkMode={darkMode} 
        editingItem={editingItem} 
        setEditingItem={setEditingItem} 
        handleEditSubmit={handleEditSubmit} 
        editUserName={editUserName} 
        setEditUserName={setEditUserName} 
        editUserCompanyName={editUserCompanyName} 
        setEditUserCompanyName={setEditUserCompanyName} 
        editUserEmail={editUserEmail} 
        setEditUserEmail={setEditUserEmail} 
        editUserPhone={editUserPhone} 
        setEditUserPhone={setEditUserPhone} 
        editUserTradeLicense={editUserTradeLicense} 
        setEditUserTradeLicense={setEditUserTradeLicense} 
        editProductTitle={editProductTitle} 
        setEditProductTitle={setEditProductTitle} 
        editProductStock={editProductStock} 
        setEditProductStock={setEditProductStock} 
        editProductMoq={editProductMoq} 
        setEditProductMoq={setEditProductMoq} 
        editProductPrice={editProductPrice} 
        setEditProductPrice={setEditProductPrice} 
        editRfqTitle={editRfqTitle} 
        setEditRfqTitle={setEditRfqTitle} 
        editRfqQuantity={editRfqQuantity} 
        setEditRfqQuantity={setEditRfqQuantity} 
        editRfqTargetPrice={editRfqTargetPrice} 
        setEditRfqTargetPrice={setEditRfqTargetPrice} 
        editCategoryName={editCategoryName}
        setEditCategoryName={setEditCategoryName}
        editCategorySlug={editCategorySlug}
        setEditCategorySlug={setEditCategorySlug}
        editCategoryImage={editCategoryImage}
        setEditCategoryImage={setEditCategoryImage}
        editOfferName={editOfferName} 
        setEditOfferName={setEditOfferName} 
        editOfferCode={editOfferCode} 
        setEditOfferCode={setEditOfferCode} 
        editOfferDiscount={editOfferDiscount} 
        setEditOfferDiscount={setEditOfferDiscount} 
        editOfferExpiry={editOfferExpiry} 
        setEditOfferExpiry={setEditOfferExpiry} 
      />

    </div>
  );
}
