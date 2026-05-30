'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, RotateCcw, Percent, Headset, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard/admin')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Advantages Banner */}
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 pt-12">
        <div className="bg-brand-accent rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-sm shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Secure Payments</h4>
              <p className="text-xs text-gray-500 mt-1">100% safe bKash, Bank Transfer & COD</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-sm shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Easy B2B Returns</h4>
              <p className="text-xs text-gray-500 mt-1">Hassle-free return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-sm shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Bulk Discounts</h4>
              <p className="text-xs text-gray-500 mt-1">Order more, save more per unit</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-sm shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Dedicated Support</h4>
              <p className="text-xs text-gray-500 mt-1">24/7 hotline for wholesale accounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1650px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-brand-dark">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold">Wholesale B2B</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Bangladesh's premium wholesale sourcing platform connecting verified local suppliers with commercial buyers nationwide.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">For Buyers</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link href="/products" className="hover:text-brand-primary transition-colors">Browse Products</Link></li>
            <li><Link href="/suppliers" className="hover:text-brand-primary transition-colors">Supplier Directory</Link></li>
            <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">For Suppliers</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link href="/register" className="hover:text-brand-primary transition-colors">Become a Supplier</Link></li>
            <li><Link href="/rfqs" className="hover:text-brand-primary transition-colors">Find Sourcing Requests</Link></li>
            <li><Link href="/login" className="hover:text-brand-primary transition-colors">Supplier Log In</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">Trade Guidelines</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-gray-500">
          <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Tejgaon Industrial Area, Dhaka, BD</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-primary" />
            <span>+880 9612 123456</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-brand-primary" />
            <span>support@wholesaleb2b.com.bd</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50 py-6">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} Wholesale B2B Bangladesh. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-brand-primary">Terms of Use</a>
            <a href="#" className="hover:text-brand-primary">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
