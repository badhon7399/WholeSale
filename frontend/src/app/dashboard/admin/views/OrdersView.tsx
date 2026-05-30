'use client';

import React from 'react';

interface OrdersViewProps {
  darkMode: boolean;
  ordersList: any[];
  handleUpdateOrderStatus: (orderId: string, updates: { deliveryStatus?: string; paymentStatus?: string }) => void;
}

export default function OrdersView({
  darkMode,
  ordersList,
  handleUpdateOrderStatus
}: OrdersViewProps) {
  return (
    <div className={`rounded-[2rem] border p-6 space-y-4 animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      <h3 className="font-extrabold text-sm dark:text-white border-b border-slate-100/50 pb-3">Real-time Order Ledger</h3>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/30">
        <table className="w-full text-left text-xs font-semibold text-slate-600 min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/20 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Invoice Order ID</th>
              <th className="p-4">B2B Client Parties</th>
              <th className="p-4">Billing Amount</th>
              <th className="p-4">Logistics Status</th>
              <th className="p-4">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/20">
            {ordersList.map((ord) => (
              <tr key={ord._id} className={`${darkMode ? 'hover:bg-[#1B2C27]/40' : 'hover:bg-slate-50/50'} transition-colors`}>
                <td className="p-4">
                  <p className="font-black text-slate-900 dark:text-white text-sm">#{ord._id.slice(-8).toUpperCase()}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">{new Date(ord.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-4 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5"><span className="text-[9px] font-bold bg-slate-100 dark:bg-[#1B2C27] px-2 py-0.5 rounded text-slate-400 uppercase">Buyer:</span>{ord.buyer?.companyName || ord.buyer?.name}</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5"><span className="text-[9px] font-bold bg-slate-100 dark:bg-[#1B2C27] px-2 py-0.5 rounded text-slate-400 uppercase">Supplier:</span>{ord.supplier?.companyName}</p>
                </td>
                <td className="p-4 font-black text-brand-dark dark:text-emerald-400 text-sm">
                  {ord.totalAmount.toLocaleString()} BDT
                </td>
                <td className="p-4">
                  <select
                    value={ord.deliveryStatus}
                    onChange={(e) => handleUpdateOrderStatus(ord._id, { deliveryStatus: e.target.value })}
                    className={`text-[10px] font-bold uppercase px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer shadow-sm ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={ord.paymentStatus}
                    onChange={(e) => handleUpdateOrderStatus(ord._id, { paymentStatus: e.target.value })}
                    className={`text-[10px] font-bold uppercase px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer shadow-sm ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
