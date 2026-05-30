'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Users, Clock, ArrowUpRight } from 'lucide-react';

interface OverviewViewProps {
  darkMode: boolean;
  offersList: any[];
}

export default function OverviewView({ darkMode, offersList }: OverviewViewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Row 1: Mockup Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className={`rounded-3xl p-6 border transition-all duration-300 relative ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Revenue</p>
              <h4 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">$82,650</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last month
          </div>
        </div>

        {/* Total Orders */}
        <div className={`rounded-3xl p-6 border transition-all duration-300 relative ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Order</p>
              <h4 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">1645</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8% vs last month
          </div>
        </div>

        {/* Total Customers */}
        <div className={`rounded-3xl p-6 border transition-all duration-300 relative ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Customer</p>
              <h4 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">1,462</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-650 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-red-500">
            <ArrowUpRight className="w-3.5 h-3.5 rotate-90" /> -2% vs last week
          </div>
        </div>

        {/* Pending Delivery */}
        <div className={`rounded-3xl p-6 border transition-all duration-300 relative ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pending Delivery</p>
              <h4 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">117</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +4% vs last week
          </div>
        </div>

      </div>

      {/* Row 2: Sales Analytics Chart & Targets progress ring */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Sales Analytics Line Chart */}
        <div className={`xl:col-span-8 rounded-3xl p-6 border ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        } space-y-6`}>
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Sales Analytic</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold">Sort by</span>
              <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 border ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span>Jul 2026</span>
              </div>
            </div>
          </div>

          {/* Dynamic badges */}
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100/50 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Income</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-black">23,262.00 BDT</span>
                <span className="text-[8px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black">+84%</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Expenses</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-black">11,135.00 BDT</span>
                <span className="text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-black">+12%</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Balance</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-black">48,135.00 BDT</span>
                <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-black">+25%</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-40">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#42B58C" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#42B58C" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="500" y2="30" stroke={darkMode ? '#223932' : '#F1F5F4'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="70" x2="500" y2="70" stroke={darkMode ? '#223932' : '#F1F5F4'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="110" x2="500" y2="110" stroke={darkMode ? '#223932' : '#F1F5F4'} strokeWidth="1" strokeDasharray="4" />
              
              <path d="M 0 120 Q 50 80 100 110 T 200 40 T 300 90 T 400 30 T 500 50 L 500 150 L 0 150 Z" fill="url(#chartGrad)" />
              <path d="M 0 120 Q 50 80 100 110 T 200 40 T 300 90 T 400 30 T 500 50" fill="none" stroke="#42B58C" strokeWidth="3.5" strokeLinecap="round" />
              
              <circle cx="200" cy="40" r="5" fill="#1C5B42" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="400" cy="30" r="5" fill="#1C5B42" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Sales Target Concentric Progress */}
        <div className={`xl:col-span-4 rounded-3xl p-6 border ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        } flex flex-col justify-between`}>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Sales Target</h3>

          <div className="py-4 relative flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-32 h-32">
              <circle cx="60" cy="60" r="45" fill="none" stroke={darkMode ? '#1E2F2A' : '#E2ECE9'} strokeWidth="8" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="#42B58C" strokeWidth="8" strokeDasharray="283" strokeDashoffset="75" strokeLinecap="round" transform="rotate(-90 60 60)" />
              
              <circle cx="60" cy="60" r="30" fill="none" stroke={darkMode ? '#1E2F2A' : '#E2ECE9'} strokeWidth="8" />
              <circle cx="60" cy="60" r="30" fill="none" stroke="#2D9C75" strokeWidth="8" strokeDasharray="188" strokeDashoffset="50" strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-bold">Target</span>
              <span className="text-base font-black">74%</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100/50">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D9C75]"></span>
                <span className="text-slate-500 font-semibold">Daily Target</span>
              </div>
              <span className="font-black text-red-500">🔻 650 BDT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#42B58C]"></span>
                <span className="text-slate-500 font-semibold">Monthly Target</span>
              </div>
              <span className="font-black text-emerald-600">🔺 145,00 BDT</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Top Selling Products & Offers Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Top Selling Products */}
        <div className={`xl:col-span-8 rounded-3xl p-6 border ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        } space-y-6`}>
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Top Selling Products</h3>
            <span className="text-slate-400 font-bold text-xs">All Products &rarr;</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Air Jordan 8', sales: '752 Pcs', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=180&q=80' },
              { name: 'Air Jordan 5', sales: '681 Pcs', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=180&q=80' },
              { name: 'Air Jordan 13', sales: '592 Pcs', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=180&q=80' },
              { name: 'Nike Air Max', sales: '512 Pcs', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=180&q=80' }
            ].map((p, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200/60'
              } text-center space-y-2 group hover:-translate-y-1 transition-all duration-300`}>
                <div className="w-full h-24 rounded-xl overflow-hidden bg-white">
                  <img src={p.image} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <p className="font-extrabold text-[11px] truncate">{p.name}</p>
                <p className="text-[9px] text-[#42B58C] font-black">{p.sales}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Active Offers list */}
        <div className={`xl:col-span-4 rounded-3xl p-6 border ${
          darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
        } space-y-5`}>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Current Offers</h3>

          <div className="space-y-4">
            {offersList.slice(0, 3).map((offer) => (
              <div key={offer.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-700 dark:text-slate-300 font-extrabold">{offer.name}</span>
                  <span className="text-slate-400">Exp: {offer.expiry}</span>
                </div>
                <div className="w-full bg-slate-200/60 dark:bg-[#1E2F2A] rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#2D9C75] to-[#42B58C] h-2 rounded-full" style={{ width: `${offer.usage}%` }}></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase">
                  <span>code: {offer.code}</span>
                  <span className="text-[#42B58C]">{offer.discount}% OFF</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
