'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { 
  ShieldCheck, ArrowLeft, Star, ShoppingBag, Truck, Calculator, 
  HelpCircle, Check, ChevronLeft, ChevronRight, ZoomIn, X 
} from 'lucide-react';

interface Params {
  id: string;
}

export default function ProductDetails({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  useEffect(() => {
    api.get(`/products/${productId}`)
      .then((data) => {
        setProduct(data);
        setQuantity((data as any).moq || 1);
        setActiveImageIdx(0);
      })
      .catch((err) => {
        setError(err.message || 'Error loading product details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-[1650px] mx-auto px-4 sm:px-8 md:px-12 py-16 flex-grow animate-pulse">
        <div className="h-6 bg-gray-150 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[350px] sm:h-[450px] bg-gray-150 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-150 rounded w-3/4" />
            <div className="h-4 bg-gray-150 rounded w-1/2" />
            <div className="h-24 bg-gray-150 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Oops! Product Not Found</h2>
        <p className="text-sm text-gray-400">The product listing might have been removed or you have an incorrect link.</p>
        <Link href="/products" className="inline-block bg-brand-primary text-white text-xs font-bold px-6 py-3 rounded-full">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Calculate tier price dynamically based on input quantity
  const getResolvedPrice = (qty: number): number => {
    const { priceTiers } = product;
    if (!priceTiers || priceTiers.length === 0) return 0;
    
    // Sort tiers descending by minQuantity
    const sortedTiers = [...priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity) {
        return tier.pricePerUnit;
      }
    }
    return priceTiers[0].pricePerUnit;
  };

  const currentPrice = getResolvedPrice(quantity);
  const totalPrice = currentPrice * quantity;
  const savingAmount = product.priceTiers && product.priceTiers.length > 1
    ? (product.priceTiers[0].pricePerUnit - currentPrice) * quantity
    : 0;

  const handleAddToCartClick = () => {
    if (quantity < product.moq) return;
    addToCart(product, quantity);
    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 3000);
  };

  // Mobile specific translations
  const backToCatalogText = language === 'en' ? 'Back to wholesale catalog' : 'পাইকারি ক্যাটালগে ফিরে যান';
  const skuText = language === 'en' ? 'SKU' : 'এসকেইউ';
  const reviewsText = language === 'en' ? 'reviews' : 'টি রিভিউ';
  const resolvedUnitPriceText = language === 'en' ? 'Resolved Unit Price' : 'নির্ধারিত ইউনিট মূল্য';
  const estSubtotalText = language === 'en' ? 'Est. Subtotal' : 'আনুমানিক সাবটোটাল';
  const excludingVatText = language === 'en' ? 'Excluding VAT & Delivery' : 'ভ্যাট ও ডেলিভারি চার্জ ছাড়া';
  const packagingUnitText = language === 'en' ? 'Packaging Unit' : 'প্যাকেজিং ইউনিট';
  const cartonSackText = language === 'en' ? 'Carton / Sack' : 'কার্টন / বস্তা';
  const paymentTermsText = language === 'en' ? 'Payment Terms' : 'পেমেন্ট টার্মস';
  const originText = language === 'en' ? 'Origin' : 'উৎপত্তি';
  const bangladeshText = language === 'en' ? 'Bangladesh' : 'বাংলাদেশ';
  const clickToZoomText = language === 'en' ? 'Click to Zoom' : 'জুম করতে ক্লিক করুন';
  const priceCalculatorText = language === 'en' ? 'Bulk Price Calculator' : 'পাইকারি মূল্য ক্যালকুলেটর';

  return (
    <div className="max-w-[1650px] mx-auto px-4 sm:px-8 md:px-12 py-8 flex-grow bg-[#FAFAFA]">
      
      {/* Return link */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        {backToCatalogText}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-150 h-[320px] sm:h-[450px] relative group/main select-none shadow-sm">
            {/* Main Product Image with zoom hover */}
            <div 
              className="w-full h-full overflow-hidden cursor-zoom-in relative"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                alt={product.title} 
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover/main:scale-105" 
                src={product.images && product.images[activeImageIdx] ? product.images[activeImageIdx] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
              />
            </div>

            {/* Left/Right Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-brand-primary w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:scale-105 transition-all opacity-0 group-hover/main:opacity-100 duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-brand-primary w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:scale-105 transition-all opacity-0 group-hover/main:opacity-100 duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Magnifier Action Hover Indicator */}
            <div className="absolute bottom-4 right-4 bg-brand-dark/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
              <ZoomIn className="w-3.5 h-3.5" />
              {clickToZoomText}
            </div>

            {/* MOQ Tag Overlay */}
            <div className="absolute top-4 left-4 bg-brand-dark/95 backdrop-blur-md text-white text-[9px] font-extrabold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
              MOQ: {product.moq} {t('units')}
            </div>

            {/* Dot Pagination indicators for mobile/tablet */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                {product.images.map((_: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImageIdx === idx ? 'w-4 bg-brand-primary' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image Thumbnails with Premium Styling */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 select-none ${
                    activeImageIdx === idx 
                      ? 'border-brand-primary scale-95 shadow-md shadow-brand-primary/10' 
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'
                  }`}
                >
                  <img src={img} alt={`Product Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Title & Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category?.name || 'Wholesale Goods'}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">{skuText}: {product._id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">{product.title}</h1>
          </div>

          {/* Supplier details */}
          <div className="bg-white rounded-2xl p-5 border border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('verifiedSupplier')}</div>
              <div className="flex items-center gap-1.5">
                {product.supplier?._id ? (
                  <Link 
                    href={`/suppliers/${product.supplier._id}`}
                    className="font-extrabold text-sm text-gray-900 hover:text-brand-primary hover:underline transition-colors"
                  >
                    {product.supplier.companyName || 'Verified Manufacturer'}
                  </Link>
                ) : (
                  <span className="font-extrabold text-sm text-gray-900">{product.supplier?.companyName || 'Verified Manufacturer'}</span>
                )}
                {product.supplier?.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                )}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.supplier?.rating || 4.5) ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                    }`} 
                  />
                ))}
                <span className="text-[10px] text-gray-500 font-bold ml-1">
                  {product.supplier?.rating || 4.5} ({product.supplier?.reviewCount || 12} {reviewsText})
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('location')}</div>
              <div className="text-xs font-bold text-gray-700 mt-1">{product.supplier?.companyAddress || 'Dhaka, Bangladesh'}</div>
            </div>
          </div>

          {/* Volume Pricing Tiers */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">{t('volumePricingTiers')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.priceTiers?.map((tier: any, idx: number) => {
                const isCurrent = quantity >= tier.minQuantity;
                return (
                  <div 
                    key={idx}
                    className={`rounded-xl p-3 border text-center transition-all ${
                      isCurrent 
                        ? 'border-brand-primary bg-brand-light/30 shadow-sm' 
                        : 'border-gray-100 bg-gray-50/50'
                    }`}
                  >
                    <div className="text-[9px] text-gray-400 font-bold uppercase">{tier.minQuantity}+ {t('units')}</div>
                    <div className="font-black text-sm text-brand-dark mt-1">{tier.pricePerUnit} {t('bdt')}</div>
                    <div className="text-[8px] text-gray-400 mt-0.5">{language === 'en' ? 'per unit' : 'প্রতি পিস'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculator and Add to Cart Area */}
          <div className="bg-brand-accent/40 rounded-3xl p-5 border border-brand-accent/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-accent/60 pb-3">
              <Calculator className="w-4.5 h-4.5 text-brand-primary" />
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">{priceCalculatorText}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Qty Input */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('orderQty')}</label>
                <div className="relative">
                  <input
                    type="number"
                    min={product.moq}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary font-bold text-brand-dark"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">{t('units')}</span>
                </div>
                {quantity < product.moq && (
                  <p className="text-[9px] text-red-500 font-bold mt-1">
                    {t('moqAlert')} {product.moq} {t('units')}
                  </p>
                )}
              </div>

              {/* Resolved price */}
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{resolvedUnitPriceText}</span>
                <span className="text-lg font-black text-brand-dark">{currentPrice} {t('bdt')}</span>
                {savingAmount > 0 && (
                  <span className="text-[9px] font-bold text-brand-primary block">
                    {language === 'en' ? `Saved ${savingAmount.toLocaleString()} BDT!` : `${savingAmount.toLocaleString()} টাকা সাশ্রয়!`}
                  </span>
                )}
              </div>

              {/* Total resolved price */}
              <div className="text-center sm:text-right space-y-0.5">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">{estSubtotalText}</span>
                <span className="text-lg font-black text-brand-dark">{totalPrice.toLocaleString()} {t('bdt')}</span>
                <span className="text-[8px] text-gray-400 block font-semibold">{excludingVatText}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={quantity < product.moq}
                className="flex-1 bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:pointer-events-none"
              >
                {addedToCartSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t('addedToCart')}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4.5 h-4.5" />
                    {t('addToCart')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sourcing Specifications */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">{t('specification')}</h3>
            <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-4 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {product.description || 'No description available for this wholesale product.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-50">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-semibold">{packagingUnitText}</span>
                  <span className="font-bold text-gray-800">{cartonSackText}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-semibold">{t('leadTime')}</span>
                  <span className="font-bold text-gray-800">7 - 14 {language === 'en' ? 'Days' : 'দিন'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-semibold">{paymentTermsText}</span>
                  <span className="font-bold text-gray-800">LC / Bank / Cash</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-semibold">{originText}</span>
                  <span className="font-bold text-gray-800">{bangladeshText}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX GALLERY */}
      {isLightboxOpen && product.images && product.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col justify-center items-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/10 transition-all flex items-center justify-center"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Navigation Control */}
          <div className="w-full max-w-5xl flex items-center justify-between gap-4 relative">
            
            {/* Left navigation arrow */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                }}
                className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Main image */}
            <div 
              className="flex-1 flex justify-center items-center max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={product.images[activeImageIdx]} 
                alt={product.title} 
                className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl select-none" 
              />
            </div>

            {/* Right navigation arrow */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                }}
                className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {product.images.length > 1 && (
            <div 
              className="flex gap-2 justify-center items-center mt-6 pt-4 border-t border-white/10 max-w-md w-full overflow-x-auto hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx 
                      ? 'border-brand-primary scale-95' 
                      : 'border-transparent opacity-40'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
