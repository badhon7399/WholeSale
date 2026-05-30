'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Users, Globe, Award, CheckCircle2, Factory, TrendingUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const stats = [
    { 
      label: language === 'en' ? 'Registered Factories' : 'নিবন্ধিত ফ্যাক্টরি', 
      value: '1,500+' 
    },
    { 
      label: language === 'en' ? 'Bulk Orders Fulfilled' : 'সম্পন্ন পাইকারি অর্ডার', 
      value: '25,000+' 
    },
    { 
      label: language === 'en' ? 'Sourcing Volume' : 'সোর্সিং ভলিউম', 
      value: '450M+ BDT' 
    },
    { 
      label: language === 'en' ? 'Transaction Security' : 'লেনদেনের নিরাপত্তা', 
      value: '100% L/C' 
    },
  ];

  const values = [
    {
      icon: <Factory className="w-6 h-6 text-brand-primary" />,
      title: language === 'en' ? 'Direct Factory Sourcing' : 'সরাসরি ফ্যাক্টরি সোর্সিং',
      desc: language === 'en' 
        ? 'By-pass middle agencies. Procure inventory directly from leading apparel, jute, leather, and food manufacturing units in Gazipur, Narayanganj, and Chittagong.'
        : 'কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি গাজীপুর, নারায়ণগঞ্জ এবং চট্টগ্রামের শীর্ষস্থানীয় পোশাক, পাট, চামড়া ও খাদ্য উৎপাদনকারী কারখানা থেকে পণ্য সংগ্রহ করুন।',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-primary" />,
      title: language === 'en' ? 'Verified Supplier Badges' : 'যাচাইকৃত সরবরাহকারী ব্যাজ',
      desc: language === 'en'
        ? 'Every manufacturer on our network undergoes rigorous physical validation, trade license verification, and capacity auditing to guarantee reliability.'
        : 'আমাদের নেটওয়ার্কের প্রতিটি উৎপাদনকারী প্রতিষ্ঠান শারীরিক যাচাইকরণ, ট্রেড লাইসেন্স পরীক্ষা এবং উৎপাদন সক্ষমতার নিরীক্ষার মধ্য দিয়ে যায়।',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-primary" />,
      title: language === 'en' ? 'Transparent Sourcing RFQs' : 'স্বচ্ছ সোর্সিং আরএফকিউ',
      desc: language === 'en'
        ? 'Submit bulk requirements via our RFQ hub and receive competitive, transparent bids from suppliers, driving down procurement costs dynamically.'
        : 'আমাদের আরএফকিউ হাবের মাধ্যমে পাইকারি চাহিদা জমা দিন এবং সরবরাহকারীদের কাছ থেকে সরাসরি প্রতিযোগিতামূলক ও স্বচ্ছ দরপ্রস্তাব গ্রহণ করুন।',
    },
    {
      icon: <Globe className="w-6 h-6 text-brand-primary" />,
      title: language === 'en' ? 'Export Ready Integrity' : 'রপ্তানি উপযোগী মানদণ্ড',
      desc: language === 'en'
        ? 'Helping domestic brands scale globally. Every batch matches strict export-grade guidelines with thorough QC reports provided before shipping.'
        : 'দেশীয় ব্র্যান্ডগুলোকে বিশ্ব দরবারে পরিচিত করা। প্রতিটি চালানের শিপমেন্টের আগে যথাযথ কিউসি রিপোর্ট প্রদানের মাধ্যমে মান নিশ্চিত করা হয়।',
    },
  ];

  // Additional bilingual texts
  const badgeLabel = language === 'en' ? 'About B2B Bangladesh' : 'বি২বি বাংলাদেশ সম্পর্কে';
  const heroTitle = language === 'en' 
    ? 'Digitizing Bulk Procurement & Factory Sourcing' 
    : 'পাইকারি সংগ্রহ ও ফ্যাক্টরি সোর্সিং ডিজিটালাইজেশন';
  const heroDesc = language === 'en'
    ? 'B2B Bangladesh is the country\'s premier digital wholesale e-commerce platform. We bridge the gap between commercial bulk buyers (retailers, corporate procurement, importers) and verified local manufacturing plants.'
    : 'বি২বি বাংলাদেশ দেশের শীর্ষস্থানীয় ডিজিটাল পাইকারি ই-কমার্স প্ল্যাটফর্ম। আমরা বাণিজ্যিক পাইকারি ক্রেতা (খুচরা বিক্রেতা, কর্পোরেট সংগ্রহকারী, আমদানিকারক) এবং যাচাইকৃত স্থানীয় উৎপাদন কারখানার মধ্যে সংযোগ সহজ করি।';
  const exploreCatalogBtn = language === 'en' ? 'Browse Wholesale Catalog' : 'পাইকারি ক্যাটালগ দেখুন';
  const registerProfileBtn = language === 'en' ? 'Register Corporate Profile' : 'কর্পোরেট প্রোফাইল নিবন্ধন';
  const govtVerifiedLabel = language === 'en' ? 'Govt. Verified Trade' : 'সরকারিভাবে যাচাইকৃত বাণিজ্য';
  const complianceDesc = language === 'en' 
    ? 'Compliance audit standards enforced for all partners.' 
    : 'সকল অংশীদারের জন্য কমপ্লায়েন্স অডিট মান কঠোরভাবে প্রয়োগ করা হয়।';
  
  const whyChooseUsTitle = language === 'en' ? 'Why Sourcing Partners Choose Us' : 'সোর্সিং পার্টনাররা কেন আমাদের বেছে নেন';
  const whyChooseUsDesc = language === 'en'
    ? 'We remove the operational frictions of traditional wholesale markets through digitized supply-chain tracking, verified documentation, and secure payment escrow structures.'
    : 'আমরা ডিজিটাল সাপ্লাই-চেইন ট্র্যাকিং, যাচাইকৃত নথিপত্র এবং নিরাপদ পেমেন্ট এসক্রো কাঠামোর মাধ্যমে সনাতন পাইকারি বাজারের ঝামেলা দূর করি।';

  const workflowTitle = language === 'en' ? 'The Sourcing Workflow' : 'সোর্সিং কার্যপ্রণালী';
  const workflowDesc = language === 'en' ? 'Fast, secure, and fully managed procurement cycle.' : 'দ্রুত, নিরাপদ এবং সম্পূর্ণ পরিচালিত সংগ্রহ চক্র।';

  const step1Title = language === 'en' ? 'Submit Sourcing RFQ' : '১. আরএফকিউ জমা দিন';
  const step1Desc = language === 'en'
    ? 'Post detailed product specifications, target pricing per unit, required shipment delivery dates, and cargo destinations on our RFQ Hub.'
    : 'আমাদের আরএফকিউ হাবে বিস্তারিত পণ্যের স্পেসিফিকেশন, পিস প্রতি টার্গেট মূল্য, প্রয়োজনীয় ডেলিভারি তারিখ এবং গন্তব্য পোস্ট করুন।';

  const step2Title = language === 'en' ? 'Compare Supplier Bids' : '২. দরপ্রস্তাব তুলনা করুন';
  const step2Desc = language === 'en'
    ? 'Verified manufacturing suppliers bid on your RFQ with tailored unit pricing, lead times, and capacity statements. Accept the quote that best aligns with your goals.'
    : 'যাচাইকৃত সরবরাহকারীরা আপনার আরএফকিউ-তে নিজস্ব মূল্য ও ডেলিভারির সময় উল্লেখ করে বিড করবে। আপনার পছন্দের দরপ্রস্তাবটি গ্রহণ করুন।';

  const step3Title = language === 'en' ? 'Secure L/C Escrow Order' : '৩. নিরাপদ এল/সি ও পেমেন্ট';
  const step3Desc = language === 'en'
    ? 'Establish payment terms (Letter of Credit, bank transfer, mobile finance escrow). The order starts manufacturing, and funds are safely released only upon verified cargo arrival.'
    : 'এল/সি বা ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট টার্মস নির্ধারণ করুন। কারখানায় পণ্য প্রস্তুত শুরু হবে এবং পণ্য বুঝে পাওয়ার পর পেমেন্ট রিলিজ হবে।';

  const ctaTitle = language === 'en' 
    ? 'Ready to Optimize Your Corporate Supply Chain?' 
    : 'আপনার কর্পোরেট সাপ্লাই চেইন উন্নত করতে প্রস্তুত?';
  const ctaDesc = language === 'en'
    ? 'Create your B2B account today to list products as a factory supplier or post bulk sourcing requirements as a buyer.'
    : 'buyer হিসেবে পাইকারি পণ্য সংগ্রহ করতে অথবা supplier হিসেবে আপনার ফ্যাক্টরি তালিকাভুক্ত করতে আজই নিবন্ধন করুন।';
  const getStartedBtn = language === 'en' ? 'Get Started Now' : 'এখনই শুরু করুন';
  const contactAdvisoryBtn = language === 'en' ? 'Contact Advisory Team' : 'পরামর্শ টিমের সাথে যোগাযোগ করুন';

  return (
    <div className="flex-grow bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-tr from-brand-accent/40 via-white to-brand-light/35 py-12 sm:py-20 border-b border-gray-100">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              {badgeLabel}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              {heroTitle.slice(0, 24)} <span className="text-brand-primary">{heroTitle.slice(24)}</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/products"
                className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-4 rounded-xl text-center transition-all shadow-md"
              >
                {exploreCatalogBtn}
              </Link>
              <Link
                href="/register"
                className="bg-white hover:bg-gray-50 text-gray-805 border border-gray-200 font-bold text-xs px-6 py-4 rounded-xl text-center transition-all shadow-sm"
              >
                {registerProfileBtn}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
                alt="Factory production line in Bangladesh"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlay statistics box */}
            <div className="absolute -bottom-4 -left-4 bg-brand-dark text-white p-4 rounded-2xl border border-white/10 shadow-xl hidden sm:flex items-center gap-3.5 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-light shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">{govtVerifiedLabel}</h4>
                <p className="text-[9px] text-brand-light/70 mt-0.5 leading-normal">{complianceDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 hover:border-brand-primary/25 transition-all">
                <span className="text-2xl sm:text-3xl font-black text-brand-dark block">{stat.value}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-1.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gray-55/50 border-y border-gray-100">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{whyChooseUsTitle}</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {whyChooseUsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                  {val.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{workflowTitle}</h2>
            <p className="text-xs sm:text-sm text-gray-500">{workflowDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="space-y-3 relative p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">{step1Title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {step1Desc}
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="space-y-3 relative p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                2
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">{step2Title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                3
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">{step3Title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-dark text-white py-16 border-t border-brand-primary/25">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight max-w-xl mx-auto">
            {ctaTitle}
          </h2>
          <p className="text-brand-light/70 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md"
            >
              {getStartedBtn}
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-xs px-8 py-3.5 rounded-xl transition-all"
            >
              {contactAdvisoryBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
