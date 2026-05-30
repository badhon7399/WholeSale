'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, User, Mail, Lock, Phone, Building, MapPin, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function RegisterForm() {
  const { register, user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize role from search params or default to buyer
  const initialRole = searchParams.get('role') === 'supplier' ? 'supplier' : 'buyer';
  const [role, setRole] = useState<'buyer' | 'supplier'>(initialRole);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync role tab if URL changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'supplier') {
      setRole('supplier');
    } else if (roleParam === 'buyer') {
      setRole('buyer');
    }
  }, [searchParams]);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'buyer') {
        router.push('/dashboard/buyer');
      } else if (user.role === 'supplier') {
        router.push('/dashboard/supplier');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      name,
      email,
      password,
      role,
      phone,
      companyName,
      companyAddress,
      tradeLicense,
    };

    try {
      await register(payload);
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Registration failed. Please try again.' : 'নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'));
      setSubmitting(false);
    }
  };

  // Bilingual translation labels
  const createAccount = language === 'en' ? 'Create Corporate Account' : 'কর্পোরেট অ্যাকাউন্ট তৈরি করুন';
  const joinMarketplace = language === 'en' ? 'Join Bangladesh\'s premier B2B marketplace' : 'বাংলাদেশের প্রথম ও নির্ভরযোগ্য বি২বি মার্কেটপ্লেস';
  const regAsBuyer = language === 'en' ? 'Register as Buyer' : 'বায়ার হিসেবে রেজিস্টার';
  const regAsSupplier = language === 'en' ? 'Register as Supplier' : 'সাপ্লায়ার হিসেবে রেজিস্টার';
  const contactName = language === 'en' ? 'Contact Name' : 'যোগাযোগের নাম';
  const corporateEmail = language === 'en' ? 'Corporate Email' : 'কর্পোরেট ইমেল';
  const passwordLabel = language === 'en' ? 'Password' : 'পাসওয়ার্ড';
  const phoneNumber = language === 'en' ? 'Phone Number' : 'মোবাইল নম্বর';
  const companyShopName = language === 'en' ? 'Company / Shop Name' : 'কোম্পানি / দোকানের নাম';
  const corporateAddress = language === 'en' ? 'Corporate Address' : 'কর্পোরেট ঠিকানা';
  const tradeLicenseNumber = language === 'en' ? 'Trade License Number' : 'ট্রেড লাইসেন্স নম্বর';
  const optionalLabel = language === 'en' ? '(Optional)' : '(ঐচ্ছিক)';
  const registeringProfile = language === 'en' ? 'Registering Corporate Profile...' : 'কর্পোরেট প্রোফাইল নিবন্ধিত হচ্ছে...';
  const registerBtnText = language === 'en' 
    ? `Register as ${role === 'buyer' ? 'Buyer' : 'Supplier'}` 
    : `${role === 'buyer' ? 'বায়ার' : 'সাপ্লায়ার'} হিসেবে নিবন্ধন সম্পন্ন করুন`;
  const alreadyHaveAccount = language === 'en' ? 'Already have a business account?' : 'ইতিমধ্যে ব্যবসায়িক অ্যাকাউন্ট আছে?';
  const logIn = language === 'en' ? 'Log In' : 'লগইন করুন';

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-brand-dark/5 border border-gray-100 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-brand-light rounded-bl-full opacity-50 -z-10" />

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-dark font-extrabold text-lg">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span>B2B Bangladesh</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{createAccount}</h2>
        <p className="text-xs text-gray-400">{joinMarketplace}</p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="grid grid-cols-2 bg-gray-50 p-1.5 rounded-2xl mb-6 border border-gray-100">
        <button
          type="button"
          onClick={() => setRole('buyer')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
            role === 'buyer'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {regAsBuyer}
        </button>
        <button
          type="button"
          onClick={() => setRole('supplier')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
            role === 'supplier'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {regAsSupplier}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-2.5 text-xs font-semibold border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{contactName}</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rafiqul Islam"
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{corporateEmail}</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rafiq@company.com"
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{passwordLabel}</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{phoneNumber}</label>
            <div className="relative">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712XXXXXX"
                className="w-full bg-gray-55 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-105 my-1" />

        {/* Company Details */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{companyShopName}</label>
            <div className="relative">
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Bengal Fabrics Ltd"
                className="w-full bg-gray-55 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{corporateAddress}</label>
            <div className="relative">
              <input
                type="text"
                required
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="e.g. Road 12, Gulshan-1, Dhaka"
                className="w-full bg-gray-55 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {tradeLicenseNumber} {role === 'buyer' && <span className="text-gray-300 font-medium">{optionalLabel}</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                required={role === 'supplier'}
                value={tradeLicense}
                onChange={(e) => setTradeLicense(e.target.value)}
                placeholder="e.g. TRAD/DNCC/12345/2026"
                className="w-full bg-gray-55 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:pointer-events-none mt-5 text-xs"
        >
          {submitting ? registeringProfile : registerBtnText}
          {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-xs text-gray-400 mt-6 font-semibold">
        {alreadyHaveAccount}{' '}
        <Link href="/login" className="text-brand-primary hover:underline">
          {logIn}
        </Link>
      </p>
    </div>
  );
}

export default function Register() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-tr from-brand-accent/50 via-white to-brand-light/30">
      <Suspense fallback={<div className="text-center py-10 font-bold text-gray-400">Loading form context...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
