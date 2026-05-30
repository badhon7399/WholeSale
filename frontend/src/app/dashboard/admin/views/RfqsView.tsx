'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface RfqsViewProps {
  darkMode: boolean;
  rfqsList: any[];
  openEditModal: (type: 'rfq', data: any) => void;
  handleDeleteRfq: (rfqId: string) => void;
}

export default function RfqsView({
  darkMode,
  rfqsList,
  openEditModal,
  handleDeleteRfq
}: RfqsViewProps) {
  return (
    <div className={`rounded-[2rem] border p-6 space-y-4 animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      <h3 className="font-extrabold text-sm dark:text-white border-b border-slate-100/50 pb-3">Sourcing RFQ Requirements</h3>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/30">
        <table className="w-full text-left text-xs font-semibold text-slate-600 min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/20 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Sourcing Requirements</th>
              <th className="p-4">Buyer Client</th>
              <th className="p-4">Volume Required</th>
              <th className="p-4">Target Price</th>
              <th className="p-4 text-right">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/20">
            {rfqsList.map((rfq) => (
              <tr key={rfq._id} className={`${darkMode ? 'hover:bg-[#1B2C27]/40' : 'hover:bg-slate-50/50'} transition-colors`}>
                <td className="p-4">
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">{rfq.title}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Status: <span className="text-[#1C5B42] font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">{rfq.status}</span></p>
                </td>
                <td className="p-4 font-bold text-slate-800 dark:text-slate-300">
                  {rfq.buyer?.companyName || rfq.buyer?.name}
                </td>
                <td className="p-4 font-black text-slate-800 dark:text-white">
                  {rfq.quantity.toLocaleString()} units
                </td>
                <td className="p-4 font-black text-brand-dark dark:text-emerald-400 text-sm">
                  {rfq.targetPrice.toLocaleString()} BDT
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal('rfq', rfq)}
                      className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
                        darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-[#253D37]' : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      title="Edit Sourcing RFQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRfq(rfq._id)}
                      className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
                        darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-red-950/20 hover:text-red-400' : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:text-red-650'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
