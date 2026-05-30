'use client';

import React from 'react';

interface CustomerViewProps {
  darkMode: boolean;
  usersList: any[];
  ordersList: any[];
  selectedCustomer: any;
  setSelectedCustomer: (cust: any) => void;
}

export default function CustomerView({
  darkMode,
  usersList,
  ordersList,
  selectedCustomer,
  setSelectedCustomer
}: CustomerViewProps) {
  
  const customerOrders = selectedCustomer 
    ? ordersList.filter(o => o.buyer?._id === selectedCustomer._id || o.supplier?._id === selectedCustomer._id)
    : [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Left column: customer profiles list */}
      <div className={`xl:col-span-6 rounded-[2rem] border p-6 space-y-4 ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
      }`}>
        <h3 className="font-extrabold text-sm dark:text-white border-b border-slate-100/50 pb-3">Registered Customers</h3>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {usersList.filter(u => u.role !== 'admin').map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedCustomer(u)}
              className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                selectedCustomer?._id === u._id 
                  ? (darkMode ? 'border-[#42B58C] bg-[#1B2C27]' : 'border-[#42B58C] bg-emerald-50/30') 
                  : `${darkMode ? 'bg-[#1B2C27]/50 border-slate-200/10 hover:bg-[#1B2C27]' : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:shadow-sm'}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-light text-brand-primary font-black flex items-center justify-center text-xs shadow-inner">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-xs leading-none text-slate-800 dark:text-white">{u.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1.5">{u.companyName || 'Corporate Client'}</p>
                </div>
              </div>
              <span className="text-[9px] bg-slate-200/60 dark:bg-[#20342D] px-2 py-0.5 rounded font-bold text-slate-500 uppercase tracking-wider">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column: customer insight details drawer */}
      <div className="xl:col-span-6">
        {selectedCustomer ? (
          <div className={`rounded-[2rem] border p-6 space-y-6 ${
            darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
          } animate-fade-in`}>
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100/50">
              <div>
                <h4 className="font-black text-base dark:text-white">{selectedCustomer.name}</h4>
                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Profile insights & orders</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                {selectedCustomer.isVerified ? 'VERIFIED TRUST' : 'NOT VERIFIED'}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Company:</span>
                <p className="text-slate-800 dark:text-slate-300">{selectedCustomer.companyName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Contact Email:</span>
                <p className="text-slate-800 dark:text-slate-300 truncate">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Phone Number:</span>
                <p className="text-slate-800 dark:text-slate-300">{selectedCustomer.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Trade License:</span>
                <p className="text-slate-800 dark:text-slate-300">{selectedCustomer.tradeLicense || 'Pending verification'}</p>
              </div>
            </div>

            {/* Customer purchase history */}
            <div className="space-y-3 pt-4 border-t border-slate-100/50">
              <h5 className="font-extrabold text-xs dark:text-white uppercase tracking-wider">Purchase / Transaction logs</h5>
              
              {customerOrders.length > 0 ? (
                <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                  {customerOrders.map(ord => (
                    <div key={ord._id} className={`p-3 border rounded-xl flex items-center justify-between ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <p className="font-black text-[11px]">#{ord._id.slice(-8).toUpperCase()}</p>
                        <span className="text-[9px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#42B58C]">{ord.totalAmount.toLocaleString()} BDT</p>
                        <span className="text-[8px] bg-slate-200/80 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-black uppercase">
                          {ord.deliveryStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 italic text-xs">
                  No commercial orders recorded in the ledger for this customer.
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className={`rounded-[2rem] border p-12 text-center text-slate-400 italic text-xs ${
            darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
          }`}>
            Select a customer from the registry list to view profile details, trade certificates, and purchase transactions history.
          </div>
        )}
      </div>

    </div>
  );
}
