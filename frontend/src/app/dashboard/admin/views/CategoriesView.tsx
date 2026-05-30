'use client';

import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CategoriesViewProps {
  darkMode: boolean;
  categoriesList: any[];
  newCatName: string;
  setNewCatName: (val: string) => void;
  newCatSlug: string;
  setNewCatSlug: (val: string) => void;
  newCatImage: string;
  setNewCatImage: (val: string) => void;
  handleCreateCategory: (e: React.FormEvent) => void;
  handleDeleteCategory: (id: string) => void;
  openEditModal: (type: 'category', data: any) => void;
}

export default function CategoriesView({
  darkMode,
  categoriesList,
  newCatName,
  setNewCatName,
  newCatSlug,
  setNewCatSlug,
  newCatImage,
  setNewCatImage,
  handleCreateCategory,
  handleDeleteCategory,
  openEditModal
}: CategoriesViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Left Column: Create Category */}
      <div className={`xl:col-span-4 rounded-[2rem] border p-6 space-y-6 ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100/50">
          <div className="w-8 h-8 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm dark:text-white">Create Category</h3>
        </div>

        <form onSubmit={handleCreateCategory} className="space-y-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="space-y-1.5">
            <label className="block text-slate-500">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Raw Jute Products"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all normal-case font-bold ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500">Slug (Unique URL identifier)</label>
            <input
              type="text"
              required
              placeholder="e.g. raw-jute-products"
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(e.target.value)}
              className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500">Image URL</label>
            <input
              type="text"
              placeholder="e.g. https://example.com/image.jpg"
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
              className={`w-full text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all normal-case font-bold ${
                darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-white shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#42B58C] hover:bg-brand-primary text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md mt-4 normal-case text-xs"
          >
            Create Category
          </button>
        </form>
      </div>

      {/* Right Column: Categories List */}
      <div className={`xl:col-span-8 rounded-[2rem] border p-6 space-y-5 ${
        darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
      }`}>
        <h3 className="font-extrabold text-sm dark:text-white">Active Categories</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoriesList.map((cat) => (
            <div key={cat._id} className={`border rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-all duration-300 ${
              darkMode ? 'bg-[#1B2C27] border-[#2E4B42]' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=80&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                />
                <div className="min-w-0">
                  <p className="font-extrabold text-xs truncate text-slate-800 dark:text-white">{cat.name}</p>
                  <span className="text-[9px] text-slate-500 block mt-1">Slug: {cat.slug}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditModal('category', cat)}
                  className="p-2 rounded-xl bg-white dark:bg-[#15221E] border border-slate-200 dark:border-[#2E4B42] hover:text-blue-500 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-2 rounded-xl bg-white dark:bg-[#15221E] border border-slate-200 dark:border-[#2E4B42] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
