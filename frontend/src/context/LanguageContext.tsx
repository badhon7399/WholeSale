'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

type TranslationDictionary = {
  [key: string]: {
    en: string;
    bn: string;
  };
};

const translations: TranslationDictionary = {
  // Navbar & Footer Links
  home: { en: 'Home', bn: 'হোম' },
  categories: { en: 'Categories', bn: 'ক্যাটেগরি' },
  suppliers: { en: 'Suppliers', bn: 'সরবরাহকারী' },
  rfqHub: { en: 'RFQ Hub', bn: 'আরএফকিউ হাব' },
  aboutUs: { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  contact: { en: 'Contact', bn: 'যোগাযোগ' },
  deals: { en: 'Deals', bn: 'অফার' },
  searchPlaceholder: { en: 'Search products, categories or suppliers...', bn: 'পণ্য, ক্যাটেগরি বা সরবরাহকারী খুঁজুন...' },
  cart: { en: 'Cart', bn: 'কার্ট' },
  login: { en: 'Log In', bn: 'লগইন' },
  signup: { en: 'Sign Up', bn: 'নিবন্ধন' },
  logout: { en: 'Log Out', bn: 'লগআউট' },
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  role: { en: 'Role', bn: 'ভূমিকা' },
  allProducts: { en: 'All Products', bn: 'সকল পণ্য' },
  myDashboard: { en: 'My Dashboard', bn: 'আমার ড্যাশবোর্ড' },
  contactSupport: { en: 'Contact Support', bn: 'যোগাযোগ ও সাপোর্ট' },
  supplierDirectory: { en: 'Supplier Directory', bn: 'সরবরাহকারী তালিকা' },

  // Hero & Homepage
  heroTitle: { en: 'Bangladesh\'s Premium B2B Wholesale Marketplace', bn: 'বাংলাদেশের প্রিমিয়াম বি২বি পাইকারি বাজার' },
  heroSubtitle: { en: 'Connect directly with verified local manufacturers, garments, and agricultural producers for bulk procurement.', bn: 'পাইকারি ক্রয়ের জন্য সরাসরি যাচাইকৃত দেশীয় পোশাক ও কৃষিজাত পণ্য উৎপাদনকারীদের সাথে যুক্ত হন।' },
  postRfq: { en: 'Post Sourcing RFQ', bn: 'আরএফকিউ পোস্ট করুন' },
  exploreCatalog: { en: 'Explore Wholesale Catalog', bn: 'পাইকারি ক্যাটালগ দেখুন' },
  verifiedTrade: { en: 'Govt. Verified Trade', bn: 'যাচাইকৃত বাণিজ্যিক ট্রেড' },
  verifiedTradeDesc: { en: 'Compliance audit standards enforced for all partners.', bn: 'সকল অংশীদারদের জন্য কমপ্লায়েন্স অডিট নীতি অনুসৃত।' },
  featuredCategories: { en: 'Industrial Categories', bn: 'শিল্প ক্যাটেগরি সমূহ' },
  featuredCategoriesDesc: { en: 'Procure bulk raw materials and manufactured goods directly from sourcing regions.', bn: 'উৎপাদন অঞ্চল থেকে সরাসরি কাঁচামাল এবং তৈরি পণ্য সংগ্রহ করুন।' },
  trendingProducts: { en: 'Trending Wholesale Goods', bn: 'জনপ্রিয় পাইকারি পণ্য' },
  trendingProductsDesc: { en: 'Verified items listed directly by factory owners with dynamic tier discounting.', bn: 'ফ্যাক্টরি মালিকদের সরাসরি তালিকাভুক্ত পণ্য এবং গতিশীল পাইকারি ডিসকাউন্ট।' },
  minOrderQty: { en: 'Min. Order (MOQ)', bn: 'সর্বনিম্ন অর্ডার (MOQ)' },
  bdt: { en: 'BDT', bn: 'টাকা' },
  unit: { en: 'unit', bn: 'পিস' },
  units: { en: 'units', bn: 'পিস' },
  viewDetails: { en: 'Sourcing Details', bn: 'উৎস বিবরণী' },

  // Product Details
  verifiedSupplier: { en: 'Verified Supplier', bn: 'যাচাইকৃত সরবরাহকারী' },
  location: { en: 'Location', bn: 'অবস্থান' },
  volumePricingTiers: { en: 'Volume Price Tiers', bn: 'ভলিউম প্রাইস টায়ার' },
  specification: { en: 'Specification', bn: 'পণ্য বিবরণ' },
  description: { en: 'Description', bn: 'পণ্য পরিচিতি' },
  leadTime: { en: 'Lead Time', bn: 'অর্ডারের ডেলিভারি সময়' },
  shippingOrigin: { en: 'Shipping Origin', bn: 'ডেলিভারি শুরুর স্থান' },
  stockAvailability: { en: 'Stock Availability', bn: 'মজুদ পরিমাণ' },
  buyNow: { en: 'Buy Now', bn: 'এখনই কিনুন' },
  addToCart: { en: 'Add to Bulk Cart', bn: 'কার্টে যোগ করুন' },
  orderQty: { en: 'Order Quantity', bn: 'অর্ডারের পরিমাণ' },
  moqAlert: { en: 'Quantity must be at least the MOQ of', bn: 'পরিমাণ অবশ্যই সর্বনিম্ন MOQ হতে হবে' },
  addedToCart: { en: 'Successfully Added to Sourcing Cart!', bn: 'সফলভাবে পাইকারি কার্টে যোগ করা হয়েছে!' },

  // RFQ Hub
  rfqHubTitle: { en: 'Sourcing RFQ Bidding Hub', bn: 'আরএফকিউ বিডিং হাব' },
  rfqHubSubtitle: { en: 'Submit bulk buying requirements and let verified suppliers bid with competitive pricing directly.', bn: 'আপনার পাইকারি ক্রয়ের চাহিদা পোস্ট করুন এবং যাচাইকৃত উৎপাদনকারীদের সেরা দরপ্রস্তাব লাভ করুন।' },
  activeRfqs: { en: 'Active Sourcing RFQs', bn: 'চলতি সোর্সিং আরএফকিউ সমূহ' },
  postNewRequest: { en: 'Post Sourcing Request', bn: 'নতুন রিকুয়েস্ট পোস্ট করুন' },
  targetPrice: { en: 'Target Price', bn: 'আকাঙ্ক্ষিত মূল্য' },
  bidQuantity: { en: 'Bid Quantity', bn: 'বিড পরিমাণ' },
  bidsCount: { en: 'Bids Received', bn: 'প্রাপ্ত বিড সমূহ' },
  placeBid: { en: 'Submit Bid / Quote', bn: 'দরপ্রস্তাব বা বিড পেশ করুন' },
  submitRfqButton: { en: 'Submit RFQ Request', bn: 'আরএফকিউ জমা দিন' },
  rfqTitleLabel: { en: 'RFQ Sourcing Title', bn: 'আরএফকিউ এর শিরোনাম' },
  rfqQuantityLabel: { en: 'Required Quantity', bn: 'প্রয়োজনীয় পরিমাণ' },
  rfqTargetPriceLabel: { en: 'Target Unit Price (BDT)', bn: 'আকাঙ্ক্ষিত ইউনিট প্রতি মূল্য' },
  rfqDescriptionLabel: { en: 'Detailed Specifications', bn: 'বিস্তারিত বিবরণী ও তথ্য' },

  // Supplier Profile & Directory
  suppliersTitle: { en: 'Verified Wholesale Manufacturers', bn: 'যাচাইকৃত পাইকারি উৎপাদনকারী' },
  suppliersSubtitle: { en: 'Directly connect with certified factories, trade organizations, and registered export-grade suppliers in Bangladesh.', bn: 'বাংলাদেশের সনদপ্রাপ্ত কারখানা, বাণিজ্যিক সংস্থা এবং নিবন্ধিত রপ্তানি মানের সরবরাহকারীদের সাথে সরাসরি যোগাযোগ করুন।' },
  searchSuppliersPlaceholder: { en: 'Search by company name, manager or license...', bn: 'কোম্পানির নাম, ম্যানেজার বা লাইসেন্স দিয়ে খুঁজুন...' },
  regions: { en: 'Regions', bn: 'অঞ্চলসমূহ' },
  allRegions: { en: 'All Regions', bn: 'সকল অঞ্চল' },
  license: { en: 'License', bn: 'লাইসেন্স' },
  viewFactoryCatalog: { en: 'View Factory Catalog', bn: 'ফ্যাক্টরি ক্যাটালগ দেখুন' },
  factoryCredentials: { en: 'Factory Credentials', bn: 'ফ্যাক্টরির তথ্যপত্র' },
  productionType: { en: 'Production Type', bn: 'উৎপাদন ধরন' },
  industrialManufacturer: { en: 'Industrial Bulk Manufacturer', bn: 'শিল্প পাইকারি উৎপাদনকারী' },
  verificationLevel: { en: 'Verification Level', bn: 'যাচাইকরণ স্তর' },
  physicalAuditCompliant: { en: 'Physical Audit Compliant', bn: 'শারীরিক অডিট কমপ্লায়েন্ট' },
  incorporation: { en: 'Incorporation', bn: 'নিবন্ধন' },
  registeredCommercial: { en: 'Registered Commercial Entity', bn: 'নিবন্ধিত বাণিজ্যিক প্রতিষ্ঠান' },
  tradeLiaisonOfficer: { en: 'Trade Liaison Officer', bn: 'বাণিজ্যিক যোগাযোগ কর্মকর্তা' },
  commercialSalesManager: { en: 'Commercial Sales Manager', bn: 'বাণিজ্যিক বিক্রয় ব্যবস্থাপক' },
  wholesaleCatalog: { en: 'Wholesale Catalog', bn: 'পাইকারি ক্যাটালগ' },
  showingProductsCount: { en: 'Showing products listed by this factory', bn: 'এই ফ্যাক্টরির তালিকাভুক্ত পণ্যসমূহ প্রদর্শিত হচ্ছে' },

  // Cart & Checkout
  bulkCart: { en: 'Bulk Sourcing Cart', bn: 'পাইকারি সোর্সিং কার্ট' },
  emptyCart: { en: 'Your Bulk Cart is Empty', bn: 'আপনার সোর্সিং কার্টটি খালি' },
  emptyCartDesc: { en: 'Add products from our wholesale catalog to begin sourcing.', bn: 'পণ্য সংগ্রহ শুরু করতে আমাদের পাইকারি ক্যাটালগ থেকে পণ্য যোগ করুন।' },
  supplierGroup: { en: 'Supplier Group', bn: 'সরবরাহকারী গ্রুপ' },
  tierPrice: { en: 'Tier Price', bn: 'ভলিউম মূল্য' },
  orderSuccessTitle: { en: 'Orders Placed!', bn: 'অর্ডার সফলভাবে সম্পন্ন!' },
  orderSuccessDesc: { en: 'Your wholesale orders have been successfully transmitted to the suppliers. They will review and confirm delivery details soon.', bn: 'আপনার পাইকারি অর্ডার সফলভাবে সরবরাহকারীদের কাছে পাঠানো হয়েছে। তারা শীঘ্রই ডেলিভারির বিবরণ পর্যালোচনা এবং নিশ্চিত করবেন।' },
  goToBuyerDashboard: { en: 'Go to Buyer Dashboard', bn: 'বায়ার ড্যাশবোর্ডে যান' },
  checkoutSummary: { en: 'Sourcing Checkout Summary', bn: 'সোর্সিং চেকআউট সারসংক্ষেপ' },
  corporateShippingAddress: { en: 'Corporate Shipping Address', bn: 'কর্পোরেট শিপিং ঠিকানা' },
  contactPhone: { en: 'Corporate Phone Contact', bn: 'কর্পোরেট ফোন নাম্বার' },
  paymentTerms: { en: 'Wholesale Payment Terms', bn: 'পাইকারি পেমেন্ট টার্মস' },
  cod: { en: 'Cash on Delivery (Escrow)', bn: 'ক্যাশ অন ডেলিভারি (এসক্রো)' },
  bankTransfer: { en: 'Bank Wire Transfer / L/C', bn: 'ব্যাংক ওয়্যার ট্রান্সফার / এল/সি' },
  bkash: { en: 'bKash Merchant Pay (Escrow)', bn: 'বিকাশ মার্চেন্ট পে (এসক্রো)' },
  submitOrder: { en: 'Confirm Wholesale Order', bn: 'পাইকারি অর্ডার নিশ্চিত করুন' },

  // Mobile Bottom Nav
  menuHome: { en: 'Home', bn: 'হোম' },
  menuProducts: { en: 'Catalog', bn: 'পণ্য' },
  menuRfqs: { en: 'RFQs', bn: 'আরএফকিউ' },
  menuSuppliers: { en: 'Suppliers', bn: 'ফ্যাক্টরি' },
  menuDashboard: { en: 'Account', bn: 'আমার অ্যাকাউন্ট' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('wholesale_b2b_lang') as Language;
    if (savedLang === 'en' || savedLang === 'bn') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wholesale_b2b_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    // Return key back if translation is missing
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
