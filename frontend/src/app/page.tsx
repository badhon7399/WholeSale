'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  ArrowRight, ShieldCheck, Tag, Truck, Store, Box, 
  Users, Headset, Search, PlusCircle, MessageSquare,
  ChevronDown, ShoppingBag, Footprints, Zap, Sprout, 
  Tv, Building2
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = language === 'en' ? [
    {
      question: "How does the B2B wholesale platform work?",
      answer: "Our B2B platform connects commercial buyers with verified Bangladeshi manufacturers and suppliers. Buyers can browse product catalogs, place bulk orders under wholesale price tiers, or post customized Sourcing Requests (RFQs) to receive competitive bids directly from manufacturers."
    },
    {
      question: "What is an RFQ (Request for Quotation)?",
      answer: "An RFQ is a sourcing request posted by a buyer specifying their required product specs, quantity bounds (MOQ), target price, and delivery terms. Suppliers can view these RFQ boards and submit competitive price quotes and proposals to win the order."
    },
    {
      question: "How are suppliers verified on the platform?",
      answer: "Every supplier undergoes a verification check before listing products or bidding on RFQs. We audit commercial trade licenses, factory addresses, and manufacturing capacity. Verified suppliers carry a 'Verified Badge' to ensure transactional security."
    },
    {
      question: "What are the payment and shipping terms?",
      answer: "Payment and shipping terms are negotiated directly between buyers and suppliers through our messaging system or offline according to standard commercial agreements. This flexibility enables custom LC (Letter of Credit), bank transfers, or cash-on-delivery arrangements."
    },
    {
      question: "Can I request product samples before placing a bulk order?",
      answer: "Yes, we encourage buyers to communicate with suppliers via the chat portal to arrange product samples. Most manufacturers accommodate sample requests to verify quality specifics prior to signing bulk purchase contracts."
    }
  ] : [
    {
      question: "বি২বি পাইকারি প্ল্যাটফর্মটি কীভাবে কাজ করে?",
      answer: "আমাদের বি২বি প্ল্যাটফর্মটি বাণিজ্যিক ক্রেতাদের যাচাইকৃত বাংলাদেশি প্রস্তুতকারক এবং সরবরাহকারীদের সাথে সংযুক্ত করে। ক্রেতারা পণ্যের ক্যাটালগ ব্রাউজ করতে পারেন, পাইকারি মূল্যের স্তরের অধীনে বাল্ক অর্ডার দিতে পারেন, অথবা প্রস্তুতকারকদের কাছ থেকে সরাসরি প্রতিযোগিতামূলক বিড পেতে কাস্টমাইজড সোর্সিং অনুরোধ (আরএফকিউ) পোস্ট করতে পারেন।"
    },
    {
      question: "আরএফকিউ (RFQ - কোটেশনের জন্য অনুরোধ) কী?",
      answer: "আরএফকিউ হলো একজন ক্রেতার সোর্সিং অনুরোধ যা তাদের প্রয়োজনীয় পণ্যের বিবরণ, ন্যূনতম অর্ডারের পরিমাণ (MOQ), লক্ষ্য মূল্য এবং ডেলিভারি শর্তাদি উল্লেখ করে। সরবরাহকারীরা এই আরএফকিউ বোর্ডগুলো দেখতে পারেন এবং অর্ডার জেতার জন্য প্রতিযোগিতামূলক মূল্য কোটেশন এবং প্রস্তাব জমা দিতে পারেন।"
    },
    {
      question: "প্ল্যাটফর্মে সরবরাহকারীদের কীভাবে যাচাই করা হয়?",
      answer: "প্রতিটি সরবরাহকারী পণ্য তালিকাভুক্ত করার বা আরএফকিউতে বিড করার আগে একটি যাচাইকরণ প্রক্রিয়ার মধ্য দিয়ে যান। আমরা তাদের বাণিজ্যিক ট্রেড লাইসেন্স, কারখানার ঠিকানা এবং উৎপাদন ক্ষমতা অডিট করি। লেনদেনের নিরাপত্তা নিশ্চিত করতে যাচাইকৃত সরবরাহকারীদের প্রোফাইলে 'ভেরিফাইড ব্যাজ' থাকে।"
    },
    {
      question: "পেমেন্ট এবং শিপিংয়ের শর্তাবলী কী কী?",
      answer: "পেমেন্ট এবং শিপিং শর্তাদি ক্রেতা এবং সরবরাহকারীদের মধ্যে আমাদের মেসেজিং সিস্টেমের মাধ্যমে সরাসরি আলোচনা করা হয় বা স্ট্যান্ডার্ড বাণিজ্যিক চুক্তি অনুসারে অফলাইনে সম্পন্ন হয়। এটি ক্রেতা ও বিক্রেতার সুবিধাজনক এলসি (লেটার অফ ক্রেডিট), ব্যাংক ট্রান্সফার বা ক্যাশ অন ডেলিভারি সহজ করে তোলে।"
    },
    {
      question: "বাল্ক অর্ডার দেওয়ার আগে কি পণ্যের নমুনা (Sample) চাওয়া যাবে?",
      answer: "হ্যাঁ, বাল্ক ক্রয় চুক্তি স্বাক্ষর করার আগে মান যাচাইয়ের জন্য সরবরাহকারীদের সাথে চ্যাট পোর্টালে যোগাযোগ করে পণ্যের নমুনা পাঠানোর অনুরোধ জানাতে ক্রেতাদের উৎসাহিত করা হয়।"
    }
  ];
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Categories');

  // Load Home Data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch categories
        const catData = await api.get('/categories');
        if (Array.isArray(catData)) setCategories(catData);

        // Fetch featured products
        const prodData = await api.get<{ products: any[]; total: number }>('/products');
        if (prodData && Array.isArray(prodData.products)) {
          setProducts(prodData.products.slice(0, 4));
        }

        // Fetch RFQs
        const rfqData = await api.get('/rfqs');
        if (Array.isArray(rfqData)) setRfqs(rfqData.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Fallback Mock Categories if API is empty
  const displayCategories = categories.length > 0 ? categories : [
    { _id: '1', name: 'Fashion & Apparel', slug: 'fashion-apparel', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80', productCount: 2560 },
    { _id: '2', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', productCount: 1890 },
    { _id: '3', name: 'Groceries & Spices', slug: 'groceries-spices', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80', productCount: 3200 },
    { _id: '4', name: 'Leather Goods', slug: 'leather-goods', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=400&q=80', productCount: 1150 }
  ];

  // Fallback Mock Products if API is empty
  const displayProducts = products.length > 0 ? products : [
    {
      _id: 'p1',
      title: 'Bulk Export Quality Cotton T-Shirts',
      moq: 200,
      priceTiers: [{ minQuantity: 200, pricePerUnit: 150 }, { minQuantity: 1000, pricePerUnit: 130 }],
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
      supplier: { companyName: 'Dhaka Garments & Textiles', rating: 4.5, isVerified: true }
    },
    {
      _id: 'p2',
      title: 'Executive Full-Grain Leather Derby Shoes',
      moq: 15,
      priceTiers: [{ minQuantity: 15, pricePerUnit: 2200 }, { minQuantity: 50, pricePerUnit: 2000 }],
      images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80'],
      supplier: { companyName: 'Apex Leather B2B', rating: 4.8, isVerified: true }
    },
    {
      _id: 'p3',
      title: 'Premium Chinigura Aromatic Rice (50kg)',
      moq: 30,
      priceTiers: [{ minQuantity: 30, pricePerUnit: 3800 }, { minQuantity: 100, pricePerUnit: 3650 }],
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'],
      supplier: { companyName: 'Chittagong Spices Ltd', rating: 4.7, isVerified: true }
    },
    {
      _id: 'p4',
      title: 'Handcrafted Oval Jute Rugs',
      moq: 25,
      priceTiers: [{ minQuantity: 25, pricePerUnit: 1200 }, { minQuantity: 100, pricePerUnit: 1050 }],
      images: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80'],
      supplier: { companyName: 'Bengal Jute & Fiber Industries', rating: 4.9, isVerified: true }
    }
  ];

  // Fallback Mock RFQs if API is empty
  const displayRfqs = rfqs.length > 0 ? rfqs : [
    {
      _id: 'r1',
      title: 'Need 1,500 Customized Jute Shopping Bags',
      quantity: 1500,
      targetPrice: 120,
      deliveryLocation: 'Tejgaon, Dhaka',
      buyer: { companyName: 'Aarong Sourcing Ltd' },
      bids: [1]
    },
    {
      _id: 'r2',
      title: 'Urgent Sourcing of 250 bags Dinajpur Miniket Rice',
      quantity: 250,
      targetPrice: 3200,
      deliveryLocation: 'Gulshan, Dhaka',
      buyer: { companyName: 'Unimart Retail Sourcing' },
      bids: []
    }
  ];

  return (
    <div className="flex-grow bg-[#FAFAFA]">
      
      {/* Hero Section */}
      <section className="bg-white rounded-b-[32px] sm:rounded-b-[40px] shadow-sm overflow-hidden relative border-b border-gray-150">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-16 lg:py-20 grid grid-cols-12 gap-4 md:gap-10 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="col-span-7 lg:col-span-5 space-y-3 sm:space-y-8 pr-0 lg:pr-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-brand-light text-brand-primary font-bold text-[8px] xs:text-[10px] sm:text-xs px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-primary animate-ping" />
              {t('verifiedTrade')}
            </div>
            
            <h1 className="text-[14px] xs:text-[18px] sm:text-4xl lg:text-5xl font-black text-brand-dark leading-[1.15] tracking-tight">
              {t('heroTitle')}
            </h1>
            
            <p className="text-gray-500 text-[9px] xs:text-[11px] sm:text-base leading-relaxed max-w-md">
              {t('heroSubtitle')}
            </p>

            {/* Sourcing Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 pt-1 sm:pt-2">
              <Link 
                href="/rfqs" 
                className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-[8px] xs:text-xs sm:text-sm px-2.5 py-2 xs:px-4 xs:py-3 rounded-lg xs:rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                {t('postRfq')}
              </Link>
              <Link 
                href="/products" 
                className="bg-gray-55 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold text-[8px] xs:text-xs sm:text-sm px-2.5 py-2 xs:px-4 xs:py-3 rounded-lg xs:rounded-xl transition-all shadow-sm text-center"
              >
                {t('exploreCatalog')}
              </Link>
            </div>
          </div>

          {/* Right Showcase Image & Floating Stats */}
          <div className="w-full col-span-5 lg:col-span-7 relative h-[140px] xs:h-[180px] sm:h-[400px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-2xl group border border-gray-150 isolate">
            <img 
              alt="Cargo shipping containers at a port" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[6s]" 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-brand-dark/90 backdrop-blur-md text-white px-2.5 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-lg border border-white/10 hidden xs:flex">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/5 shrink-0 bg-white/10">
                <Box className="w-3.5 h-3.5 text-brand-light" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-[8px] sm:text-xs tracking-wide">Secure B2B Trade</div>
                <div className="text-[7px] sm:text-[9px] text-gray-300">Audited Contracts & Quality</div>
              </div>
            </div>

            {/* Bottom Stats Grid (Desktop & Tablet) */}
            <div className="absolute bottom-0 inset-x-0 bg-brand-dark/95 backdrop-blur-md text-white px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left hidden sm:grid rounded-b-2xl sm:rounded-b-3xl">
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <Store className="w-5 h-5 text-brand-light shrink-0" />
                <div>
                  <div className="font-extrabold text-sm sm:text-base">10,000+</div>
                  <div className="text-[8px] text-gray-300 uppercase tracking-wider font-bold">Suppliers</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start border-l border-white/10 pl-2">
                <Box className="w-5 h-5 text-brand-light shrink-0" />
                <div>
                  <div className="font-extrabold text-sm sm:text-base">1.2 Million</div>
                  <div className="text-[8px] text-gray-300 uppercase tracking-wider font-bold">Products</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start border-l border-white/10 pl-2">
                <Users className="w-5 h-5 text-brand-light shrink-0" />
                <div>
                  <div className="font-extrabold text-sm sm:text-base">50,000+</div>
                  <div className="text-[8px] text-gray-300 uppercase tracking-wider font-bold">Buyers</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start border-l border-white/10 pl-2">
                <Headset className="w-5 h-5 text-brand-light shrink-0" />
                <div>
                  <div className="font-extrabold text-sm sm:text-base">100%</div>
                  <div className="text-[8px] text-gray-300 uppercase tracking-wider font-bold">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats Grid - Rendered directly underneath the hero on mobile viewports */}
      <div className="sm:hidden bg-brand-dark text-white px-5 py-4 grid grid-cols-2 gap-3 text-center rounded-2xl mx-4 my-4 border border-white/5 shadow-md">
        <div className="flex items-center gap-2.5 justify-start pl-2">
          <Store className="w-4.5 h-4.5 text-brand-light shrink-0" />
          <div className="text-left">
            <div className="font-black text-xs">10,000+</div>
            <div className="text-[7px] text-brand-light/65 uppercase tracking-wider font-bold">Suppliers</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 justify-start border-l border-white/10 pl-4">
          <Box className="w-4.5 h-4.5 text-brand-light shrink-0" />
          <div className="text-left">
            <div className="font-black text-xs">1.2 Million</div>
            <div className="text-[7px] text-brand-light/65 uppercase tracking-wider font-bold">Products</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 justify-start border-t border-white/10 pt-3 pl-2">
          <Users className="w-4.5 h-4.5 text-brand-light shrink-0" />
          <div className="text-left">
            <div className="font-black text-xs">50,000+</div>
            <div className="text-[7px] text-brand-light/65 uppercase tracking-wider font-bold">Buyers</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 justify-start border-l border-white/10 pl-4 border-t border-white/10 pt-3">
          <Headset className="w-4.5 h-4.5 text-brand-light shrink-0" />
          <div className="text-left">
            <div className="font-black text-xs">100% Support</div>
            <div className="text-[7px] text-brand-light/65 uppercase tracking-wider font-bold">Available</div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <section className="max-w-[1650px] mx-auto px-6 md:px-12 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('featuredCategories')}</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">{t('featuredCategoriesDesc')}</p>
          </div>
          <Link href="/products" className="text-brand-primary font-bold text-xs flex items-center gap-1.5 hover:underline bg-brand-light px-3.5 py-1.5 rounded-full shrink-0">
            {t('allProducts')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {/* Category Cards Grid (Wrapped & Responsive) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-6 px-6 scrollbar-none sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <Link 
              key={cat._id}
              href={`/products?category=${cat.slug}`}
              className="w-[140px] xs:w-[180px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-150 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between text-left"
            >
              <div className="h-20 xs:h-28 sm:h-32 w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-6 bg-gray-50 border border-gray-100">
                <img 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={cat.image}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="min-w-0 flex-1 pr-1">
                  <h3 className="font-extrabold text-gray-900 text-xs sm:text-base truncate">{cat.name}</h3>
                  <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5">{cat.productCount.toLocaleString()}+ Listings</p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0 hidden xs:flex">
                  <ArrowRight className="w-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live RFQ Bulletin Ticker */}
      <section className="bg-brand-dark py-12 sm:py-16 text-white overflow-hidden relative">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-white/10 text-brand-light font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
              RFQ Bulletin
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">{t('activeRfqs')}</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {t('rfqHubSubtitle')}
            </p>
            <div className="pt-2">
              <Link 
                href="/rfqs" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                {t('postRfq')}
              </Link>
            </div>
          </div>

          {/* RFQ List Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayRfqs.map((rfq) => (
              <div 
                key={rfq._id} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-bold text-brand-light bg-brand-primary/30 px-2.5 py-1 rounded-full">
                      {rfq.buyer.companyName}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {rfq.deliveryLocation}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mt-3 leading-snug line-clamp-1">{rfq.title}</h3>
                  
                  {/* RFQ Specs */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">{t('bidQuantity')}</div>
                      <div className="font-bold text-xs sm:text-sm text-brand-light mt-0.5">{rfq.quantity.toLocaleString()} {t('units')}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">{t('targetPrice')}</div>
                      <div className="font-bold text-xs sm:text-sm text-brand-light mt-0.5">{rfq.targetPrice} {t('bdt')}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-light" />
                    {rfq.bids ? rfq.bids.length : 0} {t('bidsCount')}
                  </span>
                  <Link 
                    href={`/rfqs`} 
                    className="text-xs font-bold text-brand-light hover:text-white flex items-center gap-1 group"
                  >
                    {t('placeBid')}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1650px] mx-auto px-6 md:px-12 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('trendingProducts')}</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">{t('trendingProductsDesc')}</p>
          </div>
          <Link href="/products" className="text-brand-primary font-bold text-xs flex items-center gap-1.5 hover:underline bg-brand-light px-3.5 py-1.5 rounded-full shrink-0">
            {t('exploreCatalog')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((prod) => {
            const displayPrice = prod.priceTiers && prod.priceTiers.length > 0 ? prod.priceTiers[0].pricePerUnit : 0;
            return (
              <div 
                key={prod._id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 xs:h-40 sm:h-52 bg-gray-50 overflow-hidden relative">
                    <img 
                      alt={prod.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                    />
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-brand-dark/90 backdrop-blur-md text-white text-[7px] sm:text-[9px] font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10 uppercase tracking-wide">
                      MOQ: {prod.moq} {t('units')}
                    </div>
                  </div>

                  <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{prod.supplier.companyName}</span>
                      {prod.supplier.isVerified && (
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-primary shrink-0" />
                      )}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm leading-snug hover:text-brand-primary transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                      <Link href={`/products/${prod._id}`}>{prod.title}</Link>
                    </h3>
                  </div>
                </div>

                <div className="p-3 sm:p-5 pt-0 border-t border-gray-55 mt-auto flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                  <div>
                    <span className="text-[8px] sm:text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Wholesale</span>
                    <span className="font-black text-xs sm:text-base text-brand-dark">{displayPrice} {t('bdt')}</span>
                  </div>
                  <Link 
                    href={`/products/${prod._id}`}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-[8px] xs:text-[10px] sm:text-xs px-2.5 py-2 xs:px-4 xs:py-2.5 rounded-lg xs:rounded-xl transition-colors text-center"
                  >
                    {t('viewDetails')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supplier CTA Banner */}
      <section className="max-w-[1650px] mx-auto px-6 md:px-12 py-8">
        <div className="bg-brand-dark rounded-3xl px-8 py-10 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl border border-white/5">
          <div className="flex items-center gap-6 relative z-10 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0 bg-white/5">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">Are you a supplier or manufacturer?</h2>
              <p className="text-brand-light/75 text-xs mt-1 max-w-xl leading-relaxed">
                List your products, bid on buyer RFQs, and grow your commercial distribution channel. Join thousands of verified suppliers.
              </p>
            </div>
          </div>
          <Link 
            href="/register?role=supplier" 
            className="bg-white text-brand-dark hover:bg-gray-50 font-bold px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors relative z-10 whitespace-nowrap text-xs shadow-lg hover:scale-[1.01] self-start lg:self-auto"
          >
            Become a Supplier
            <ArrowRight className="w-4 h-4 text-brand-dark" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-[1650px] mx-auto px-6 md:px-12 py-16 border-t border-gray-150">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading & Subheading */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Support Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা ও উত্তর'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {language === 'en' 
                ? 'Got questions about bulk buying, RFQ processes, or supplier verification? We have gathered the answers to the most common queries.'
                : 'বাল্ক ক্রয়, আরএফকিউ প্রক্রিয়া বা সরবরাহকারী যাচাইকরণ সম্পর্কে কোনো প্রশ্ন আছে? সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।'}
            </p>
            <div className="pt-2">
              <Link 
                href="/contact" 
                className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
              >
                {language === 'en' ? 'Still Need Help? Contact Us' : 'আরও সাহায্য লাগবে? যোগাযোগ করুন'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isOpen ? 'border-brand-primary/30 shadow-md shadow-brand-primary/5' : 'border-gray-150 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-800 focus:outline-none"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <span className={`w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-all shrink-0 ${
                      isOpen ? 'bg-brand-primary text-white rotate-180' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-60 border-t border-gray-100' : 'max-h-0'
                  }`}>
                    <p className="px-6 py-5 text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Grid */}
      <section className="max-w-[1650px] mx-auto px-6 md:px-12 py-16 text-center border-t border-gray-150 overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}} />
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-10">Trusted by commercial businesses across Bangladesh</h3>
        
        <div className="relative w-full overflow-hidden py-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-20 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-20 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10">
          <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused]">
            {[
              { 
                name: 'AARONG', 
                logo: <img src="/logos/aarong.png" alt="Aarong" className="h-6 w-auto object-contain" />, 
                subtitle: 'Retail & Sourcing' 
              },
              { 
                name: 'BATA', 
                logo: <svg viewBox="0 0 80 30" className="h-6 w-auto"><text x="0" y="24" fontFamily="Arial, sans-serif" fontSize="26" fill="#E3000F" fontWeight="900" letterSpacing="-1">Bata</text></svg>, 
                subtitle: 'Footwear & Mfg' 
              },
              { 
                name: 'WALTON', 
                logo: <img src="/logos/walton.svg" alt="Walton" className="h-6 w-auto object-contain" />, 
                subtitle: 'Electronics & Tech' 
              },
              { 
                name: 'PRAN-RFL', 
                logo: <img src="/logos/pran-rfl.jpg" alt="PRAN-RFL" className="h-6 w-auto object-contain rounded-sm mix-blend-multiply" />, 
                subtitle: 'Agro & Plastics' 
              },
              { 
                name: 'SINGER', 
                logo: <svg viewBox="0 0 100 30" className="h-6 w-auto"><text x="0" y="24" fontFamily="Georgia, serif" fontSize="24" fill="#E3000F" fontWeight="900" letterSpacing="1">SINGER</text></svg>, 
                subtitle: 'Home Appliances' 
              },
              { 
                name: 'AKIJ GROUP', 
                logo: <svg viewBox="0 0 130 30" className="h-6 w-auto"><text x="0" y="22" fontFamily="'Times New Roman', serif" fontSize="22" fill="#002D62" fontWeight="bold">Akij Group</text></svg>, 
                subtitle: 'Industrial Mfg' 
              }
            ].concat([
              { 
                name: 'AARONG', 
                logo: <img src="/logos/aarong.png" alt="Aarong" className="h-6 w-auto object-contain" />, 
                subtitle: 'Retail & Sourcing' 
              },
              { 
                name: 'BATA', 
                logo: <svg viewBox="0 0 80 30" className="h-6 w-auto"><text x="0" y="24" fontFamily="Arial, sans-serif" fontSize="26" fill="#E3000F" fontWeight="900" letterSpacing="-1">Bata</text></svg>, 
                subtitle: 'Footwear & Mfg' 
              },
              { 
                name: 'WALTON', 
                logo: <img src="/logos/walton.svg" alt="Walton" className="h-6 w-auto object-contain" />, 
                subtitle: 'Electronics & Tech' 
              },
              { 
                name: 'PRAN-RFL', 
                logo: <img src="/logos/pran-rfl.jpg" alt="PRAN-RFL" className="h-6 w-auto object-contain rounded-sm mix-blend-multiply" />, 
                subtitle: 'Agro & Plastics' 
              },
              { 
                name: 'SINGER', 
                logo: <svg viewBox="0 0 100 30" className="h-6 w-auto"><text x="0" y="24" fontFamily="Georgia, serif" fontSize="24" fill="#E3000F" fontWeight="900" letterSpacing="1">SINGER</text></svg>, 
                subtitle: 'Home Appliances' 
              },
              { 
                name: 'AKIJ GROUP', 
                logo: <svg viewBox="0 0 130 30" className="h-6 w-auto"><text x="0" y="22" fontFamily="'Times New Roman', serif" fontSize="22" fill="#002D62" fontWeight="bold">Akij Group</text></svg>, 
                subtitle: 'Industrial Mfg' 
              }
            ]).map((brand, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 bg-white border border-gray-150 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <div className="h-10 px-3 rounded-xl bg-gray-50/80 flex items-center justify-center border border-gray-100 shrink-0">
                  {brand.logo}
                </div>
                <div className="text-left shrink-0">
                  <div className="font-extrabold text-sm sm:text-base text-gray-800 tracking-tight">{brand.name}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{brand.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
