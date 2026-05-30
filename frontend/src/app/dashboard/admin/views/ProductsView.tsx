'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface ProductsViewProps {
  darkMode: boolean;
  productsList: any[];
  openEditModal: (type: 'product', data: any) => void;
  handleDeleteProduct: (productId: string) => void;
}

export default function ProductsView({
  darkMode,
  productsList,
  openEditModal,
  handleDeleteProduct
}: ProductsViewProps) {
  return (
    <div className={`rounded-[2rem] border p-6 space-y-4 animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      <div className="flex justify-between items-center border-b border-slate-100/50 pb-4">
        <h3 className="font-extrabold text-sm dark:text-white">Active Product Catalog</h3>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/30">
        <table className="w-full text-left text-xs font-semibold text-slate-600 min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/20 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Product Profile</th>
              <th className="p-4">Supplier Merchant</th>
              <th className="p-4">Category Tag</th>
              <th className="p-4">Price / Inventory</th>
              <th className="p-4 text-right">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/20">
            {productsList.map((prod) => (
              <tr key={prod._id} className={`${darkMode ? 'hover:bg-[#1B2C27]/40' : 'hover:bg-slate-50/50'} transition-colors`}>
                <td className="p-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=80&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate max-w-[220px]">{prod.title}</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">Min Order: <span className="text-slate-700 dark:text-slate-300 font-extrabold">{prod.moq} units</span></p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-800 dark:text-slate-300">
                  {prod.supplier?.companyName || prod.supplier?.name}
                </td>
                <td className="p-4">
                  <span className="bg-brand-light/80 border border-brand-primary/10 text-brand-primary px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {prod.category?.name || 'General'}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-extrabold text-slate-900 dark:text-white">Stock: {prod.stock.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Price: {prod.priceTiers?.[0]?.pricePerUnit} BDT / unit</p>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal('product', prod)}
                      className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
                        darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-[#253D37]' : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      title="Edit Product listing"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
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
