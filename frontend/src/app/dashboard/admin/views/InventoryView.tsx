'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InventoryViewProps {
  darkMode: boolean;
  productsList: any[];
  lowStockThreshold: number;
  setLowStockThreshold: (val: number) => void;
  handleRestockProduct: (productId: string, currentStock: number) => void;
}

export default function InventoryView({
  darkMode,
  productsList,
  lowStockThreshold,
  setLowStockThreshold,
  handleRestockProduct
}: InventoryViewProps) {
  
  const lowStockProducts = productsList.filter(p => p.stock < lowStockThreshold);

  return (
    <div className={`rounded-[2rem] border p-6 space-y-6 animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      
      {/* Inventory stats header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100/50 pb-4">
        <div>
          <h3 className="font-extrabold text-sm dark:text-white">Inventory Controls</h3>
          <p className="text-xs text-slate-500 mt-1">Configure stock thresholds and quick restock updates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">Alert Threshold:</span>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
            className={`w-20 text-xs px-2.5 py-1.5 rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-brand-primary font-bold ${
              darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200 shadow-inner'
            }`}
          />
        </div>
      </div>

      {/* Low stock alerts indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lowStockProducts.map(prod => (
          <div key={prod._id} className="border border-red-100/30 rounded-2xl p-4 flex gap-4 bg-red-950/5 dark:bg-red-950/10 hover:border-red-300 transition-all duration-300 justify-between items-center">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[200px]">{prod.title}</p>
                <p className="text-[10px] text-red-500 font-black mt-1">Stock Left: {prod.stock} units</p>
              </div>
            </div>

            <button
              onClick={() => handleRestockProduct(prod._id, prod.stock)}
              className="bg-brand-primary hover:bg-[#42B58C] text-white text-[10px] font-black px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
            >
              Restock +500
            </button>
          </div>
        ))}
        {lowStockProducts.length === 0 && (
          <div className="md:col-span-2 p-6 text-center text-slate-400 italic text-xs">
            All inventory products are above the low stock threshold limits.
          </div>
        )}
      </div>

      {/* General stock catalog table */}
      <div className="space-y-4 pt-4">
        <h4 className="font-extrabold text-xs dark:text-white uppercase tracking-wider">All Stock Levels</h4>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-200/30">
          <table className="w-full text-left text-xs font-semibold text-slate-600 min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/20 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-4">Product</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">MOQ Limit</th>
                <th className="p-4">Status Indicator</th>
                <th className="p-4 text-right">Quick Refill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/20">
              {productsList.map(prod => {
                const isLow = prod.stock < lowStockThreshold;
                return (
                  <tr key={prod._id} className={`${darkMode ? 'hover:bg-[#1B2C27]/40' : 'hover:bg-slate-50/50'} transition-colors`}>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{prod.title}</td>
                    <td className="p-4 font-black">{prod.stock.toLocaleString()} units</td>
                    <td className="p-4 font-bold text-slate-500">{prod.moq}</td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Low Stock</span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Optimal</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRestockProduct(prod._id, prod.stock)}
                        className={`text-[9px] font-black px-3 py-1.5 rounded-xl border transition-all ${
                          darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-[#253D37]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Restock +500
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
