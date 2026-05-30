'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle, Clock, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: 'general',
        message: '',
      });
    }, 1500);
  };

  const offices = [
    {
      city: language === 'en' ? 'Dhaka Headquarters' : 'ঢাকা প্রধান কার্যালয়',
      address: language === 'en' 
        ? 'Level 12, Sourcing Tower, 45 Tejgaon Commercial Area, Dhaka-1208'
        : 'লেভেল ১২, সোর্সিং টাওয়ার, ৪৫ তেজগাঁও বাণিজ্যিক এলাকা, ঢাকা-১২০৮',
      phone: '+8802-9887766',
      email: 'hq@b2bbangladesh.com',
    },
    {
      city: language === 'en' ? 'Chittagong Sourcing Branch' : 'চট্টগ্রাম সোর্সিং শাখা',
      address: language === 'en'
        ? 'Khatunganj Trade Plaza, Suite 4B, Khatunganj, Chittagong'
        : 'খাতুনগঞ্জ ট্রেড প্লাজা, সুইট ৪বি, খাতুনগঞ্জ, চট্টগ্রাম',
      phone: '+88031-654321',
      email: 'ctg@b2bbangladesh.com',
    },
  ];

  // Bilingual translation labels
  const supportCenterLabel = language === 'en' ? 'Support Center' : 'সহায়তা কেন্দ্র';
  const connectSpecialistsLabel = language === 'en' ? 'Connect with Sourcing Specialists' : 'সোর্সিং বিশেষজ্ঞদের সাথে যোগাযোগ করুন';
  const subDescLabel = language === 'en'
    ? 'Need custom factory contracts, trade advisory support, or corporate account help? Our local field agents are ready to assist.'
    : 'কাস্টম ফ্যাক্টরি চুক্তি, বাণিজ্য উপদেষ্টা সহায়তা, বা কর্পোরেট অ্যাকাউন্ট সাহায্য প্রয়োজন? আমাদের স্থানীয় প্রতিনিধিরা প্রস্তুত আছেন।';
  const helpQuestionLabel = language === 'en' ? 'How can we help?' : 'আমরা কীভাবে সাহায্য করতে পারি?';
  const hoursDescLabel = language === 'en'
    ? 'Contact our support desk during office hours (Saturday - Thursday, 9:00 AM - 6:00 PM). Response time is typically within 2-4 hours.'
    : 'অফিস চলাকালীন সময়ে আমাদের সাথে যোগাযোগ করুন (শনিবার - বৃহস্পতিবার, সকাল ৯:০০ টা - সন্ধ্যা ৬:০০ টা)। সাধারণত ২-৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়।';
  const responseGuaranteeLabel = language === 'en' ? 'Response Guarantee: < 24 Working Hours' : 'উত্তরের নিশ্চয়তা: < ২৪ কর্মঘণ্টা';
  const hotlineLabel = language === 'en' ? 'Hotline' : 'হটলাইন';
  const corporateOfficesLabel = language === 'en' ? 'Corporate Offices' : 'কর্পোরেট অফিসসমূহ';
  const yourNameLabel = language === 'en' ? 'Your Name' : 'আপনার নাম';
  const corporateEmailLabel = language === 'en' ? 'Corporate Email' : 'কর্পোরেট ইমেল';
  const corporatePhoneLabel = language === 'en' ? 'Corporate Phone' : 'কর্পোরেট ফোন';
  const companyNameLabel = language === 'en' ? 'Company Name' : 'কোম্পানির নাম';
  const inquiryTypeLabel = language === 'en' ? 'Inquiry Type' : 'অনুসন্ধানের ধরণ';
  const generalOptionLabel = language === 'en' ? 'General Support / Account issues' : 'সাধারণ জিজ্ঞাসা / অ্যাকাউন্ট সংক্রান্ত সমস্যা';
  const sourcingOptionLabel = language === 'en' ? 'Custom Sourcing / Large Volume Contract' : 'কাস্টম সোর্সিং / বড় ভলিউম চুক্তি';
  const verificationOptionLabel = language === 'en' ? 'Supplier Verification Request' : 'সরবরাহকারী যাচাইকরণের অনুরোধ';
  const partnershipOptionLabel = language === 'en' ? 'Partner with B2B Bangladesh' : 'বি২বি বাংলাদেশের সাথে পার্টনারশিপ';
  const messageLabel = language === 'en' ? 'Message' : 'বার্তা';
  const messagePlaceholder = language === 'en'
    ? 'Provide details about your custom sourcing requirements, target quantities, specs...'
    : 'আপনার নিজস্ব পণ্যের চাহিদা, আনুমানিক পরিমাণ, স্পেসিফিকেশন ইত্যাদি উল্লেখ করুন...';
  const sendInquiryLabel = language === 'en' ? 'Send Sourcing Inquiry' : 'সোর্সিং অনুসন্ধান পাঠান';
  const transmittingQueryLabel = language === 'en' ? 'Transmitting query...' : 'অনুসন্ধান পাঠানো হচ্ছে...';
  
  const msgReceivedLabel = language === 'en' ? 'Message Received!' : 'বার্তা গৃহীত হয়েছে!';
  const msgReceivedDesc = language === 'en'
    ? 'Thank you for contacting us. A B2B Bangladesh sourcing executive will reach out to you within 24 working hours at your company email.'
    : 'যোগাযোগ করার জন্য ধন্যবাদ। বি২বি বাংলাদেশের একজন প্রতিনিধি ২৪ কর্মঘণ্টার মধ্যে আপনার কোম্পানির ইমেলে যোগাযোগ করবেন।';
  const submitAnotherLabel = language === 'en' ? 'Submit Another Sourcing Query' : 'অন্য আরেকটি অনুসন্ধান পাঠান';

  return (
    <div className="flex-grow bg-gray-50/50">
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-10 sm:py-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
            {supportCenterLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {connectSpecialistsLabel}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {subDescLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Contact Details (Left) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick stats box */}
            <div className="bg-brand-dark text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-lg space-y-4">
              <h2 className="font-extrabold text-base sm:text-lg text-white">{helpQuestionLabel}</h2>
              <p className="text-brand-light/70 text-xs leading-relaxed">
                {hoursDescLabel}
              </p>
              
              <div className="divide-y divide-white/10 text-xs pt-2">
                <div className="flex items-center gap-3.5 py-3">
                  <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{responseGuaranteeLabel}</span>
                </div>
                <div className="flex items-center gap-3.5 py-3">
                  <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{hotlineLabel}: +880 1800-B2B-HELP</span>
                </div>
              </div>
            </div>

            {/* Offices List */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">{corporateOfficesLabel}</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {offices.map((office, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">{office.city}</h4>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="break-all">{office.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm">
            
            {submitted ? (
              <div className="py-12 text-center space-y-6 flex flex-col justify-center items-center">
                <div className="w-14 h-14 bg-brand-light text-brand-primary rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900">{msgReceivedLabel}</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mx-auto">
                  {msgReceivedDesc}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs px-6 py-3.5 rounded-full transition-all shadow-md mt-4"
                >
                  {submitAnotherLabel}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{yourNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Faisal Ahmed"
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{corporateEmailLabel}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{corporatePhoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
                    />
                  </div>
                  {/* Company */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{companyNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Ltd"
                      className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{inquiryTypeLabel}</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold cursor-pointer"
                  >
                    <option value="general">{generalOptionLabel}</option>
                    <option value="sourcing">{sourcingOptionLabel}</option>
                    <option value="verification">{verificationOptionLabel}</option>
                    <option value="partnership">{partnershipOptionLabel}</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{messageLabel}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={messagePlaceholder}
                    className="w-full bg-gray-55 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:pointer-events-none mt-4 text-xs"
                >
                  {loading ? (
                    transmittingQueryLabel
                  ) : (
                    <>
                      <span>{sendInquiryLabel}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
