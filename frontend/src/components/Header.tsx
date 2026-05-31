'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  Search, ShoppingCart, User, Globe, ChevronDown, LogOut, 
  LayoutDashboard, Menu, X, ShieldCheck, Home, FileText, Factory, ShoppingBag,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch unread messages count periodically
  useEffect(() => {
    if (!user) {
      setUnreadMessages(0);
      return;
    }
    const fetchUnreadCount = async () => {
      try {
        const conversations = await api.get('/messages/conversations');
        if (Array.isArray(conversations)) {
          const totalUnread = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
          setUnreadMessages(totalUnread);
        }
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [user]);



  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const isHomeActive = pathname === '/';
  const isProductsActive = pathname?.startsWith('/products');
  const isRfqsActive = pathname === '/rfqs';
  const isSuppliersActive = pathname?.startsWith('/suppliers');
  const isDashboardActive = pathname?.startsWith('/dashboard') || pathname === '/login';

  if (pathname?.startsWith('/dashboard/admin')) {
    return null;
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-150 transition-all duration-300">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-brand-dark group shrink-0">
            <div className="relative w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-300 animate-none">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest leading-none text-gray-400 uppercase">Wholesale</span>
              <span className="text-xl font-extrabold leading-none tracking-tight text-brand-dark">B2B</span>
              <span className="text-[9px] font-bold tracking-wider leading-none text-brand-primary mt-0.5">BANGLADESH</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link 
              href="/products" 
              className={`relative py-2 hover:text-brand-primary transition-colors group ${
                isProductsActive ? 'text-brand-primary font-bold' : ''
              }`}
            >
              {t('shop')}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full transform origin-left transition-transform duration-350 ${
                isProductsActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            
            <Link 
              href="/suppliers" 
              className={`relative py-2 hover:text-brand-primary transition-colors group ${
                isSuppliersActive ? 'text-brand-primary font-bold' : ''
              }`}
            >
              {t('suppliers')}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full transform origin-left transition-transform duration-350 ${
                isSuppliersActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            
            <Link 
              href="/rfqs" 
              className={`relative py-2 hover:text-brand-primary transition-colors group ${
                isRfqsActive ? 'text-brand-primary font-bold' : ''
              }`}
            >
              {t('rfqHub')}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full transform origin-left transition-transform duration-350 ${
                isRfqsActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            
            <Link 
              href="/about" 
              className={`relative py-2 hover:text-brand-primary transition-colors group ${
                pathname === '/about' ? 'text-brand-primary font-bold' : ''
              }`}
            >
              {t('aboutUs')}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full transform origin-left transition-transform duration-350 ${
                pathname === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            
            <Link 
              href="/contact" 
              className={`relative py-2 hover:text-brand-primary transition-colors group ${
                pathname === '/contact' ? 'text-brand-primary font-bold' : ''
              }`}
            >
              {t('contact')}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full transform origin-left transition-transform duration-350 ${
                pathname === '/contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          </nav>

          {/* Search Bar - Desktop and Tablet */}
          <div className="hidden md:flex items-center gap-4 flex-grow max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-4 pr-10 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all text-gray-800"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* User / Cart / Language Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-brand-primary border border-gray-200 px-3 py-2 rounded-full bg-gray-50 hover:bg-white transition-all select-none"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Cart Link */}
            <Link href="/cart" className="relative p-2.5 text-gray-600 hover:text-brand-primary hover:bg-gray-50 rounded-full transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-pulse">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Messages Link */}
            {user && (
              <Link href="/messages" className="relative p-2.5 text-gray-600 hover:text-brand-primary hover:bg-gray-50 rounded-full transition-all" title="Messages">
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-pulse">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            )}

            {/* Profile/Auth Link (Desktop only, mobile bottom nav covers this) */}
            <div className="hidden lg:block">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-semibold text-sm transition-colors py-1 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-50 mb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('role')}: {user.role}</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.companyName || 'Personal Account'}</p>
                      </div>
                      <Link 
                        href={user.role === 'admin' ? '/dashboard/admin' : user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/supplier'}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-brand-light hover:text-brand-primary text-gray-700 font-medium text-sm transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('dashboard')}
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          router.push('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 hover:text-red-600 text-gray-700 font-medium text-sm transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-brand-primary transition-colors">
                    {t('login')}
                  </Link>
                  <Link href="/register" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20">
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Header Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-primary transition-colors"
              aria-label="Toggle mobile search/menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Menu Dropdown (Search & Supplementary Links) */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-x-0 top-[73px] bg-white border-b border-gray-150 py-6 px-6 shadow-xl z-40 animate-in slide-in-from-top duration-300 max-h-[calc(100vh-140px)] overflow-y-auto pb-20">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-6">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-4 pr-10 py-3.5 rounded-2xl text-gray-800"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <nav className="flex flex-col gap-4 text-base font-bold text-gray-700">
              <Link 
                href="/products" 
                onClick={() => setShowMobileMenu(false)} 
                className={`flex items-center gap-2 hover:text-brand-primary transition-all duration-300 ${
                  isProductsActive ? 'text-brand-primary translate-x-1' : 'text-gray-700'
                }`}
              >
                {isProductsActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                {t('allProducts')}
              </Link>
              <Link 
                href="/suppliers" 
                onClick={() => setShowMobileMenu(false)} 
                className={`flex items-center gap-2 hover:text-brand-primary transition-all duration-300 ${
                  isSuppliersActive ? 'text-brand-primary translate-x-1' : 'text-gray-700'
                }`}
              >
                {isSuppliersActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                {t('suppliers')}
              </Link>
              <Link 
                href="/rfqs" 
                onClick={() => setShowMobileMenu(false)} 
                className={`flex items-center gap-2 hover:text-brand-primary transition-all duration-300 ${
                  isRfqsActive ? 'text-brand-primary translate-x-1' : 'text-gray-700'
                }`}
              >
                {isRfqsActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                {t('rfqHub')}
              </Link>
              <Link 
                href="/about" 
                onClick={() => setShowMobileMenu(false)} 
                className={`flex items-center gap-2 hover:text-brand-primary transition-all duration-300 ${
                  pathname === '/about' ? 'text-brand-primary translate-x-1' : 'text-gray-700'
                }`}
              >
                {pathname === '/about' && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                {t('aboutUs')}
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setShowMobileMenu(false)} 
                className={`flex items-center gap-2 hover:text-brand-primary transition-all duration-300 ${
                  pathname === '/contact' ? 'text-brand-primary translate-x-1' : 'text-gray-700'
                }`}
              >
                {pathname === '/contact' && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                {t('contact')}
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
                    <Link 
                      href={user.role === 'admin' ? '/dashboard/admin' : user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/supplier'}
                      onClick={() => setShowMobileMenu(false)}
                      className="hover:text-brand-primary transition-colors text-sm"
                    >
                      {t('myDashboard')}
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                        router.push('/');
                      }}
                      className="text-left text-red-600 text-sm font-bold flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <Link href="/login" onClick={() => setShowMobileMenu(false)} className="text-center py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 text-sm">{t('login')}</Link>
                  <Link href="/register" onClick={() => setShowMobileMenu(false)} className="text-center py-3 bg-brand-primary text-white rounded-2xl text-sm">{t('signup')}</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Tab Bar */}
      {isMounted && (
        <>
          <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-150 py-2.5 px-4 flex items-center justify-around z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe-bottom">
            <Link 
              href="/" 
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
                isHomeActive ? 'text-brand-primary scale-110' : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              <Home className={`w-5 h-5 transition-transform duration-300 ${isHomeActive ? 'scale-110' : ''}`} />
              <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${isHomeActive ? 'font-black' : ''}`}>{t('menuHome')}</span>
              {isHomeActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-primary animate-in zoom-in duration-300" />
              )}
            </Link>
            
            <Link 
              href="/products" 
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
                isProductsActive ? 'text-brand-primary scale-110' : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 transition-transform duration-300 ${isProductsActive ? 'scale-110' : ''}`} />
              <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${isProductsActive ? 'font-black' : ''}`}>{t('menuProducts')}</span>
              {isProductsActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-primary animate-in zoom-in duration-300" />
              )}
            </Link>
            
            <Link 
              href="/rfqs" 
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
                isRfqsActive ? 'text-brand-primary scale-110' : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              <FileText className={`w-5 h-5 transition-transform duration-300 ${isRfqsActive ? 'scale-110' : ''}`} />
              <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${isRfqsActive ? 'font-black' : ''}`}>{t('menuRfqs')}</span>
              {isRfqsActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-primary animate-in zoom-in duration-300" />
              )}
            </Link>
            
            <Link 
              href="/suppliers" 
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
                isSuppliersActive ? 'text-brand-primary scale-110' : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              <Factory className={`w-5 h-5 transition-transform duration-300 ${isSuppliersActive ? 'scale-110' : ''}`} />
              <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${isSuppliersActive ? 'font-black' : ''}`}>{t('menuSuppliers')}</span>
              {isSuppliersActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-primary animate-in zoom-in duration-300" />
              )}
            </Link>
            
            <Link 
              href={user ? (user.role === 'admin' ? '/dashboard/admin' : user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/supplier') : '/login'} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
                isDashboardActive ? 'text-brand-primary scale-110' : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              <User className={`w-5 h-5 transition-transform duration-300 ${isDashboardActive ? 'scale-110' : ''}`} />
              <span className={`text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${isDashboardActive ? 'font-black' : ''}`}>{t('menuDashboard')}</span>
              {isDashboardActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-primary animate-in zoom-in duration-300" />
              )}
            </Link>
          </div>
        </>
      )}
    </>
  );
};
