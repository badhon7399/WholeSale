'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { ShieldCheck, MapPin, Star, Award, Phone, Mail, FileText, Factory, ChevronRight } from 'lucide-react';

interface Params {
  id: string;
}

export default function SupplierProfilePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const supplierId = resolvedParams.id;

  const { t, language } = useLanguage();
  const [data, setData] = useState<{ supplier: any; products: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supplierId) return;

    const fetchSupplierDetails = async () => {
      try {
        const response = await api.get(`/suppliers/${supplierId}`);
        setData(response);
      } catch (err: any) {
        console.error('Error fetching supplier details:', err);
        setError('Failed to load supplier details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-10 flex-grow space-y-8">
        <div className="h-64 bg-gray-150 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-96 bg-gray-150 rounded-3xl animate-pulse" />
          <div className="lg:col-span-8 h-96 bg-gray-150 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Supplier Profile Not Found</h2>
        <p className="text-sm text-gray-400">{error || 'This supplier profile could not be loaded.'}</p>
        <Link 
          href="/suppliers" 
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-md"
        >
          Back to Supplier Directory
        </Link>
      </div>
    );
  }

  const { supplier, products } = data;

  // Bilingual translation helper labels
  const verifiedFactoryLabel = language === 'en' ? 'Verified Factory' : 'ভেরিফাইড ফ্যাক্টরি';
  const tradeLicenseLabel = language === 'en' ? 'Trade License' : 'ট্রেড লাইসেন্স';
  const buyerRatingLabel = language === 'en' ? 'Buyer Rating' : 'ক্রেতা রেটিং';
  const verifiedAuditsLabel = language === 'en' ? 'Verified Audits' : 'টি ভেরিফাইড অডিট';
  const factoryCredentialsLabel = language === 'en' ? 'Factory Credentials' : 'ফ্যাক্টরি প্রমাণপত্র';
  const productionTypeLabel = language === 'en' ? 'Production Type' : 'উৎপাদন ধরণ';
  const industrialBulkLabel = language === 'en' ? 'Industrial Bulk Manufacturer' : 'শিল্প পাইকারি উৎপাদনকারী';
  const verificationLevelLabel = language === 'en' ? 'Verification Level' : 'যাচাইকরণ স্তর';
  const physicalAuditLabel = language === 'en' ? 'Physical Audit Compliant' : 'ফিজিক্যাল অডিট অনুগত';
  const incorporationLabel = language === 'en' ? 'Incorporation' : 'নিবন্ধন';
  const registeredCommercialLabel = language === 'en' ? 'Registered Commercial Entity' : 'নিবন্ধিত বাণিজ্যিক প্রতিষ্ঠান';
  const tradeLiaisonLabel = language === 'en' ? 'Trade Liaison Officer' : 'বাণিজ্য যোগাযোগ কর্মকর্তা';
  const salesManagerLabel = language === 'en' ? 'Commercial Sales Manager' : 'বাণিজ্যিক বিক্রয় ব্যবস্থাপক';
  const wholesaleCatalogLabel = language === 'en' ? 'Wholesale Catalog' : 'পাইকারি ক্যাটালগ';
  const showingProductsLabel = language === 'en' 
    ? `Showing ${products.length} products listed by this factory` 
    : `এই ফ্যাক্টরি দ্বারা তালিকাভুক্ত ${products.length} টি পণ্য প্রদর্শন করা হচ্ছে`;
  const wholesalePriceLabel = language === 'en' ? 'Wholesale Price' : 'পাইকারি মূল্য';
  const sourcingDetailsLabel = language === 'en' ? 'Sourcing Details' : 'সোর্সিং বিস্তারিত';
  const noActiveListingsTitle = language === 'en' ? 'No active listings' : 'কোনো সক্রিয় পণ্য তালিকা নেই';
  const noActiveListingsDesc = language === 'en' 
    ? 'This factory has not listed any wholesale products yet.' 
    : 'এই ফ্যাক্টরি এখনো কোনো পাইকারি পণ্য তালিকাভুক্ত করেনি।';

  return (
    <div className="flex-grow bg-gray-50/50">
      
      {/* Banner / Header Card */}
      <section className="bg-brand-dark text-white py-10 sm:py-14 border-b border-brand-primary/20">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl border border-white/15 text-brand-light shrink-0">
                {supplier.companyName?.slice(0, 2).toUpperCase() || 'SU'}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">{supplier.companyName || 'Verified Manufacturer'}</h1>
                  {supplier.isVerified && (
                    <span className="flex items-center gap-0.5 bg-brand-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border border-brand-primary/20">
                      <ShieldCheck className="w-3.5 h-3.5 fill-white text-brand-primary" />
                      {verifiedFactoryLabel}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-light/75 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-primary" />
                    {supplier.companyAddress || 'Dhaka, Bangladesh'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 shrink-0 text-brand-primary" />
                    {tradeLicenseLabel}: {supplier.tradeLicense || 'Pending verification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-3.5 items-center w-full sm:max-w-xs shrink-0">
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4.5 h-4.5 text-brand-gold fill-brand-gold" />
                <span className="text-base font-black text-white">{supplier.rating || 4.5}</span>
              </div>
              <div className="text-[9px] font-bold text-brand-light/60 uppercase tracking-wider">
                {buyerRatingLabel}
                <div className="text-white font-extrabold text-[11px] mt-0.5">{supplier.reviewCount || 12} {verifiedAuditsLabel}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Body Grid */}
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Factory overview & contacts */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sourcing credentials */}
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm space-y-4">
              <h2 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-2.5">
                {factoryCredentialsLabel}
              </h2>

              <div className="space-y-3.5 text-xs font-semibold text-gray-500">
                <div className="flex items-start gap-2.5">
                  <Factory className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">{productionTypeLabel}</span>
                    <span className="text-gray-800 font-extrabold text-xs block mt-0.5">{industrialBulkLabel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">{verificationLevelLabel}</span>
                    <span className="text-gray-800 font-extrabold text-xs block mt-0.5">{physicalAuditLabel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">{incorporationLabel}</span>
                    <span className="text-gray-800 font-extrabold text-xs block mt-0.5">{registeredCommercialLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Representative contacts */}
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm space-y-4">
              <h2 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-2.5">
                {tradeLiaisonLabel}
              </h2>

              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs border border-gray-150 shrink-0">
                  {supplier.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900">{supplier.name}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{salesManagerLabel}</p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3.5 space-y-2.5 text-xs text-gray-500 font-semibold">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="break-all">{supplier.phone || '+880 1XXXXXXXXX'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="break-all">{supplier.email || 'sales@company.com'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Catalog List */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-gray-150 pb-4">
              <div>
                <h2 className="font-black text-gray-900 text-lg sm:text-xl">{wholesaleCatalogLabel}</h2>
                <p className="text-xs text-gray-400 mt-1 font-semibold">{showingProductsLabel}</p>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const basePrice = product.priceTiers && product.priceTiers.length > 0
                    ? product.priceTiers[0].pricePerUnit
                    : 0;

                  return (
                    <div 
                      key={product._id} 
                      className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Image */}
                        <div className="aspect-[4/3] bg-gray-50 relative border-b border-gray-100 overflow-hidden group">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0] : ''} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-brand-dark/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider">
                            MOQ: {product.moq}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-1.5">
                          <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                            {product.category?.name || 'Wholesale Goods'}
                          </span>
                          
                          <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1">
                            <Link href={`/products/${product._id}`} className="hover:underline">
                              {product.title}
                            </Link>
                          </h3>

                          {/* Pricing */}
                          <div className="pt-1.5">
                            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">{wholesalePriceLabel}</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-sm sm:text-base font-black text-brand-dark">{basePrice} {t('bdt')}</span>
                              <span className="text-[9px] font-bold text-gray-400">/ {t('units')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-4 pb-4 pt-1">
                        <Link
                          href={`/products/${product._id}`}
                          className="w-full bg-gray-50 border border-gray-150 text-gray-700 hover:bg-brand-primary hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1"
                        >
                          <span>{sourcingDetailsLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 space-y-3">
                <h3 className="font-extrabold text-gray-800 text-base">{noActiveListingsTitle}</h3>
                <p className="text-xs text-gray-400">{noActiveListingsDesc}</p>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
