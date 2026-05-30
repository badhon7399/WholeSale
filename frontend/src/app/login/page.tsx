'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, user, loading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
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

    try {
      await login(email, password);
      // Redirect happens in useEffect
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Login failed. Please check your credentials.' : 'লগইন ব্যর্থ হয়েছে। তথ্য চেক করুন।'));
      setSubmitting(false);
    }
  };

  // Bilingual translation labels
  const welcomeBack = language === 'en' ? 'Welcome Back' : 'স্বাগতম';
  const accessDashboard = language === 'en' ? 'Access your wholesale dashboard' : 'ড্যাশবোর্ডে প্রবেশ করুন';
  const corporateEmail = language === 'en' ? 'Corporate Email' : 'কর্পোরেট ইমেল';
  const passwordLabel = language === 'en' ? 'Password' : 'পাসওয়ার্ড';
  const rememberMe = language === 'en' ? 'Remember me' : 'মনে রাখুন';
  const forgotPassword = language === 'en' ? 'Forgot password?' : 'পাসওয়ার্ড ভুলে গেছেন?';
  const logIn = language === 'en' ? 'Log In' : 'লগইন করুন';
  const authenticating = language === 'en' ? 'Authenticating...' : 'যাচাই করা হচ্ছে...';
  const newToB2B = language === 'en' ? 'New to Wholesale B2B?' : 'পাইকারি বি২বি-তে নতুন?';
  const createAccount = language === 'en' ? 'Create an Account' : 'অ্যাকাউন্ট তৈরি করুন';

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-tr from-brand-accent/50 via-white to-brand-light/30">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-brand-dark/5 border border-gray-100 relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-brand-light rounded-bl-full opacity-50 -z-10" />

        {/* Form Header */}
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-dark font-extrabold text-lg">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>B2B Bangladesh</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{welcomeBack}</h2>
          <p className="text-xs text-gray-400">{accessDashboard}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-2.5 text-xs font-semibold border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{corporateEmail}</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-gray-50 border border-gray-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all font-semibold"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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

          <div className="flex items-center justify-between text-[10px] font-bold pt-1">
            <label className="flex items-center gap-1.5 text-gray-400 cursor-pointer select-none">
              <input type="checkbox" className="rounded text-brand-primary border-gray-200 focus:ring-brand-primary w-3.5 h-3.5" />
              <span>{rememberMe}</span>
            </label>
            <a href="#" className="text-brand-primary hover:underline">{forgotPassword}</a>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:pointer-events-none mt-4 text-xs"
          >
            {submitting ? authenticating : logIn}
            {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 mt-6 font-semibold">
          {newToB2B}{' '}
          <Link href="/register" className="text-brand-primary hover:underline">
            {createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
