'use client';

import React from 'react';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  handleRefresh: () => void;
}

export default function SettingsView({
  darkMode,
  setDarkMode,
  handleRefresh
}: SettingsViewProps) {
  return (
    <div className={`rounded-[2rem] border p-6 space-y-6 max-w-2xl mx-auto animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      <h3 className="font-extrabold text-sm dark:text-white border-b border-slate-100/50 pb-3">Dashboard Configuration</h3>

      <div className="space-y-5 text-xs font-bold">
        
        {/* Theme preferences */}
        <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-[#1B2C27]/50 border border-slate-200/40">
          <div>
            <p className="text-slate-800 dark:text-slate-300 font-extrabold">Aesthetic Dark Mode</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Configure layout theme settings for this dashboard.</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full p-1 transition-all ${
              darkMode ? 'bg-[#5EEAD4] justify-end' : 'bg-slate-300 justify-start'
            } flex items-center`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>

        {/* Default currency */}
        <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-[#1B2C27]/50 border border-slate-200/40">
          <div>
            <p className="text-slate-800 dark:text-slate-300 font-extrabold">Default Ledger Currency</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">All sales projections and targets show in this currency.</p>
          </div>
          <select className={`text-[10px] font-bold uppercase px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary ${
            darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <option value="BDT">BDT (৳)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        {/* API Diagnostics */}
        <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-[#1B2C27]/50 border border-slate-200/40">
          <div>
            <p className="text-slate-800 dark:text-slate-300 font-extrabold">API Ping Diagnostics</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Synchronize with server routes and clear query locks.</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-[#42B58C] hover:bg-brand-primary text-white text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            Test Latency
          </button>
        </div>

      </div>
    </div>
  );
}
