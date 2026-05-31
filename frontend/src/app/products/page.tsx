'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { 
  ShieldCheck, SlidersHorizontal, ArrowUpDown, ChevronRight, 
  LayoutGrid, Search, X, Filter 
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();

  // Parse state from URL
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [moqFilter, setMoqFilter] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update filters if URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || '');
  }, [searchParams]);

  // Load categories on mount
  useEffect(() => {
    api.get('/categories')
      .then((data) => {
        if (Array.isArray(data)) setCategories(data as any[]);
      })
      .catch((err) => console.error('Error fetching categories in catalog:', err));
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.set('search', search);
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (sort) queryParams.set('sort', sort);
    if (moqFilter > 0) queryParams.set('moq', moqFilter.toString());

    api.get(`/products?${queryParams.toString()}`)
      .then((data: any) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching products in catalog:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, selectedCategory, sort, moqFilter]);

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const newParams = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      newParams.set('category', categorySlug);
    } else {
      newParams.delete('category');
    }
    router.push(`/products?${newParams.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const newParams = new URLSearchParams(searchParams.toString());
    if (newSort) {
      newParams.set('sort', newSort);
    } else {
      newParams.delete('sort');
    }
    router.push(`/products?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('');
    setMoqFilter(0);
    router.push('/products');
  };

  // Helper labels
  const filterLabel = language === 'en' ? 'Sourcing Filters' : 'সোর্সিং ফিল্টার';
  const clearLabel = language === 'en' ? 'Clear' : 'মুছে ফেলুন';
  const searchKeywordLabel = language === 'en' ? 'Search Keyword' : 'সার্চ কিওয়ার্ড';
  const typeKeywordsLabel = language === 'en' ? 'Type keywords...' : 'কীওয়ার্ড লিখুন...';
  const categoryLabel = language === 'en' ? 'Product Category' : 'পণ্যের ক্যাটেগরি';
  const allCategoriesLabel = language === 'en' ? 'All Categories' : 'সকল ক্যাটেগরি';
  const moqThresholdLabel = language === 'en' ? 'Max MOQ Limit' : 'সর্বোচ্চ MOQ সীমা';
  const anyLabel = language === 'en' ? 'Any' : 'যেকোনো';
  const moqDescLabel = language === 'en' ? 'Filters products having minimum order quantity (MOQ) below this threshold.' : 'এই সীমার নিচে সর্বনিম্ন অর্ডারের পরিমাণ (MOQ) রয়েছে এমন পণ্য ফিল্টার করে।';
  const sortByLabel = language === 'en' ? 'Sort Listings By' : 'সাজানোর নিয়ম';
  const defaultLabel = language === 'en' ? 'Default (Latest)' : 'ডিফল্ট (নতুন আগে)';
  const priceLowHigh = language === 'en' ? 'Price: Low to High' : 'মূল্য: কম থেকে বেশি';
  const priceHighLow = language === 'en' ? 'Price: High to Low' : 'মূল্য: বেশি থেকে কম';
  const moqLowHigh = language === 'en' ? 'MOQ: Low to High' : 'MOQ: কম থেকে বেশি';
  const itemsFoundLabel = language === 'en' ? 'Items Found' : 'টি পণ্য পাওয়া গেছে';
  const showFiltersLabel = language === 'en' ? 'Show Filters' : 'ফিল্টার দেখান';
  const noProductsLabel = language === 'en' ? 'No Wholesale Listings Found' : 'কোনো পাইকারি পণ্য পাওয়া যায়নি';
  const noProductsDesc = language === 'en' ? 'Try widening your search terms, removing filters, or resetting category selections to find wholesale products.' : 'পাইকারি পণ্য খুঁজতে আপনার সার্চ কিওয়ার্ড পরিবর্তন করুন, ফিল্টার দূর করুন অথবা ক্যাটেগরি রিসেট করুন।';
  const resetFiltersLabel = language === 'en' ? 'Reset Catalog Filters' : 'ক্যাটালগ ফিল্টার রিসেট করুন';

  return (
    <div className="max-w-[1650px] mx-auto px-4 sm:px-8 md:px-12 py-8 flex-grow bg-[#FAFAFA]">
      
      {/* Breadcrumbs & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <Link href="/" className="hover:text-brand-primary">{t('home')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500">{t('allProducts')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{t('allProducts')}</h1>
        </div>
        
        {/* Mobile Filter Toggle & Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden bg-white border border-gray-250 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:bg-gray-55"
          >
            <Filter className="w-3.5 h-3.5 text-brand-primary" />
            {showFiltersLabel}
          </button>
          
          <div className="text-xs font-bold text-gray-500 bg-white border border-gray-150 px-4 py-2.5 rounded-xl shadow-sm">
            {products.length} {itemsFoundLabel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters (Desktop View) */}
        <aside className="hidden lg:block bg-white rounded-3xl p-6 border border-gray-150 space-y-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
              {filterLabel}
            </h3>
            {(selectedCategory || search || sort || moqFilter > 0) && (
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                {clearLabel}
              </button>
            )}
          </div>

          {/* Search bar inside filters */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{searchKeywordLabel}</label>
            <div className="relative">
              <input
                type="text"
                placeholder={typeKeywordsLabel}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{categoryLabel}</label>
            <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => handleCategoryClick('')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !selectedCategory 
                    ? 'bg-brand-light text-brand-primary font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {allCategoriesLabel}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-light text-brand-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* MOQ Limit Filter */}
          <div className="space-y-3.5 border-t border-gray-50 pt-4">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{moqThresholdLabel}</label>
              <span className="text-xs font-extrabold text-brand-primary">
                {moqFilter === 0 ? anyLabel : `${moqFilter} ${t('units')}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={moqFilter}
              onChange={(e) => setMoqFilter(Number(e.target.value))}
              className="w-full accent-brand-primary h-1.5 bg-gray-150 rounded-lg cursor-pointer"
            />
            <p className="text-[9px] text-gray-400 leading-normal">
              {moqDescLabel}
            </p>
          </div>

          {/* Sort Selection */}
          <div className="space-y-2.5 border-t border-gray-50 pt-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              {sortByLabel}
            </label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-gray-55 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-700 font-semibold cursor-pointer"
            >
              <option value="">{defaultLabel}</option>
              <option value="price_asc">{priceLowHigh}</option>
              <option value="price_desc">{priceHighLow}</option>
              <option value="moq_asc">{moqLowHigh}</option>
            </select>
          </div>
        </aside>

        {/* Mobile Filter Slide-out Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Drawer Content */}
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                  {filterLabel}
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search bar */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{searchKeywordLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={typeKeywordsLabel}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-255 text-xs pl-9 pr-4 py-3 rounded-xl text-gray-800 font-semibold"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{categoryLabel}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      handleCategoryClick('');
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      !selectedCategory 
                        ? 'bg-brand-light text-brand-primary font-bold'
                        : 'bg-gray-50 text-gray-600 border border-gray-150'
                    }`}
                  >
                    {allCategoriesLabel}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        handleCategoryClick(cat.slug);
                        setShowMobileFilters(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === cat.slug
                          ? 'bg-brand-light text-brand-primary font-bold'
                          : 'bg-gray-50 text-gray-600 border border-gray-150'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* MOQ */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{moqThresholdLabel}</label>
                  <span className="text-xs font-extrabold text-brand-primary">
                    {moqFilter === 0 ? anyLabel : `${moqFilter} ${t('units')}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={moqFilter}
                  onChange={(e) => setMoqFilter(Number(e.target.value))}
                  className="w-full accent-brand-primary h-1.5 bg-gray-150 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sort */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{sortByLabel}</label>
                <select
                  value={sort}
                  onChange={(e) => {
                    handleSortChange(e.target.value);
                    setShowMobileFilters(false);
                  }}
                  className="w-full bg-gray-50 border border-gray-255 text-xs px-3 py-3 rounded-xl text-gray-700 font-bold"
                >
                  <option value="">{defaultLabel}</option>
                  <option value="price_asc">{priceLowHigh}</option>
                  <option value="price_desc">{priceHighLow}</option>
                  <option value="moq_asc">{moqLowHigh}</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 border border-gray-200 text-gray-700 font-bold text-xs py-3.5 rounded-xl hover:bg-gray-50 transition-all"
                >
                  {resetFiltersLabel}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-brand-primary text-white font-bold text-xs py-3.5 rounded-xl transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-150 p-3 sm:p-4 flex flex-col justify-between animate-pulse">
                  <div className="h-32 sm:h-48 bg-gray-100 rounded-2xl" />
                  <div className="space-y-2 py-3 sm:py-4">
                    <div className="h-3 sm:h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-2.5 sm:h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-8 sm:h-10 bg-gray-100 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((prod) => {
                const displayPrice = prod.priceTiers && prod.priceTiers.length > 0 ? prod.priceTiers[0].pricePerUnit : 0;
                return (
                  <div 
                    key={prod._id}
                    className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 sm:h-48 bg-gray-55 overflow-hidden relative">
                        <img 
                          alt={prod.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                        />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-brand-dark/90 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10 uppercase tracking-wide">
                          MOQ: {prod.moq} {t('units')}
                        </div>
                      </div>

                      <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-1 text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
                          <span className="truncate max-w-[80px] sm:max-w-[150px]">
                            {prod.supplier?.companyName || 'Verified Manufacturer'}
                          </span>
                          {prod.supplier?.isVerified && (
                            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-primary shrink-0" />
                          )}
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm leading-snug hover:text-brand-primary transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                          <Link href={`/products/${prod._id}`}>{prod.title}</Link>
                        </h3>
                      </div>
                    </div>

                    <div className="p-3 sm:p-5 pt-0 border-t border-gray-50 mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] sm:text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Wholesale</span>
                        <span className="font-black text-xs sm:text-base text-brand-dark">{displayPrice} {t('bdt')}</span>
                      </div>
                      <Link 
                        href={`/products/${prod._id}`}
                        className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-[8px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors text-center w-full sm:w-auto"
                      >
                        {t('viewDetails')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-150 space-y-4 max-w-lg mx-auto mt-8 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-gray-800 text-lg">{noProductsLabel}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {noProductsDesc}
              </p>
              <button 
                onClick={clearAllFilters}
                className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
              >
                {resetFiltersLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalog() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-gray-400">Loading catalog filters...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
