'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { ShieldCheck, MapPin, Search, Star, MessageSquare, Phone, Mail, Award, ArrowRight } from 'lucide-react';

export default function SupplierDirectoryPage() {
  const { t, language } = useLanguage();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await api.get('/suppliers');
        if (Array.isArray(data)) {
          setSuppliers(data);
          setFilteredSuppliers(data);
        } else {
          setError('Invalid supplier data format.');
        }
      } catch (err: any) {
        console.error('Error fetching suppliers:', err);
        setError('Failed to load supplier directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    let result = suppliers;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.companyName?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q) ||
          s.tradeLicense?.toLowerCase().includes(q)
      );
    }

    if (locationFilter !== 'all') {
      result = result.filter((s) =>
        s.companyAddress?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredSuppliers(result);
  }, [searchQuery, locationFilter, suppliers]);

  // Extract unique locations for filtering
  const locations = ['all', 'Dhaka', 'Narayanganj', 'Gazipur', 'Chittagong'];

  if (loading) {
    return (
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-10 flex-grow space-y-8">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-150 rounded w-24" />
          <div className="h-8 bg-gray-150 rounded w-96" />
          <div className="h-4 bg-gray-150 rounded w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-150 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Bilingual translation helper labels
  const searchPlaceholder = language === 'en' ? 'Search by company name, manager or license...' : 'কোম্পানির নাম, ম্যানেজার বা লাইসেন্স দিয়ে খুঁজুন...';
  const regionsLabel = language === 'en' ? 'Regions:' : 'অঞ্চলসমূহ:';
  const verifiedLabel = language === 'en' ? 'Verified' : 'ভেরিফাইড';
  const licenseLabel = language === 'en' ? 'License' : 'লাইসেন্স';
  const contactPersonLabel = language === 'en' ? 'Contact Person' : 'যোগাযোগের ব্যক্তি';
  const viewCatalogLabel = language === 'en' ? 'View Factory Catalog' : 'ফ্যাক্টরি ক্যাটালগ দেখুন';
  const noSuppliersTitle = language === 'en' ? 'No suppliers found' : 'কোনো সরবরাহকারী পাওয়া যায়নি';
  const noSuppliersDesc = language === 'en' ? 'Try adjusting your filters or search terms.' : 'অনুগ্রহ করে আপনার ফিল্টার বা অনুসন্ধান শব্দ পরিবর্তন করুন।';

  return (
    <div className="flex-grow bg-gray-50/50">
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8 space-y-8">
        
        {/* Title */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
            B2B Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{t('verifiedSuppliers')}</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
            {t('verifiedSuppliersDesc')}
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-150 shadow-sm items-center justify-between">
          <div className="relative w-full md:max-w-md shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs px-11 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">{regionsLabel}</span>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  className={`text-[9px] font-extrabold px-3.5 py-2 rounded-xl transition-all uppercase tracking-wider border ${
                    (loc === 'all' && locationFilter === 'all') ||
                    (loc !== 'all' && locationFilter.toLowerCase() === loc.toLowerCase())
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {loc === 'all' ? (language === 'en' ? 'All' : 'সব অঞ্চল') : loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-150">
            {error}
          </div>
        )}

        {/* Suppliers List */}
        {filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div 
                key={supplier._id} 
                className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between gap-5 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                
                {/* Top Block */}
                <div className="flex gap-4 items-start">
                  
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-black text-lg shrink-0 border border-brand-primary/10">
                    {supplier.companyName?.slice(0, 2).toUpperCase() || 'SU'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base group-hover:text-brand-primary transition-colors">
                        {supplier.companyName || 'Verified Manufacturer'}
                      </h3>
                      {supplier.isVerified && (
                        <span className="flex items-center gap-0.5 bg-brand-light text-brand-primary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          {verifiedLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        {supplier.companyAddress || 'Dhaka, Bangladesh'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {licenseLabel}: {supplier.tradeLicense || 'Not provided'}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(supplier.rating || 4.5) ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                          }`} 
                        />
                      ))}
                      <span className="text-[9px] text-gray-500 font-bold ml-1">
                        {supplier.rating || 4.5} ({supplier.reviewCount || 12} {language === 'en' ? 'reviews' : 'টি রিভিউ'})
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer block */}
                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider space-y-0.5">
                    <span>{contactPersonLabel}</span>
                    <div className="text-gray-700 font-extrabold text-xs">{supplier.name}</div>
                  </div>

                  <Link
                    href={`/suppliers/${supplier._id}`}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>{viewCatalogLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 space-y-3">
            <h3 className="font-extrabold text-gray-800 text-base">{noSuppliersTitle}</h3>
            <p className="text-xs text-gray-400">{noSuppliersDesc}</p>
          </div>
        )}

      </div>
    </div>
  );
}
