'use client';

import React from 'react';
import { Users, Award, RefreshCw, UserX, UserCheck, Edit, Trash2 } from 'lucide-react';

interface UsersViewProps {
  darkMode: boolean;
  usersList: any[];
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  handleRoleChange: (userId: string, currentRole: string) => void;
  handleToggleVerification: (userId: string, currentStatus: boolean) => void;
  handleDeleteUser: (userId: string) => void;
  openEditModal: (type: 'user', data: any) => void;
}

export default function UsersView({
  darkMode,
  usersList,
  roleFilter,
  setRoleFilter,
  handleRoleChange,
  handleToggleVerification,
  handleDeleteUser,
  openEditModal
}: UsersViewProps) {
  
  const filteredUsers = usersList.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  return (
    <div className={`rounded-[2rem] border p-6 space-y-4 animate-fade-in ${
      darkMode ? 'bg-[#15221E] border-[#223932]' : 'bg-white border-slate-200/50 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100/50 pb-4">
        <h3 className="font-extrabold text-sm dark:text-white">Users & Role Allocations</h3>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto justify-end">
          {['all', 'buyer', 'supplier', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                roleFilter === role 
                  ? 'bg-[#5EEAD4] text-[#0A2218] border-[#5EEAD4] shadow-sm' 
                  : `${darkMode ? 'bg-[#1B2C27] text-slate-300 border-[#2E4B42] hover:bg-[#253D37]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/30">
        <table className="w-full text-left text-xs font-semibold text-slate-600 min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/20 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Corporate Profile</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Contact Details</th>
              <th className="p-4">Role Mode</th>
              <th className="p-4">Credentials</th>
              <th className="p-4 text-right">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/20">
            {filteredUsers.map((u) => (
              <tr key={u._id} className={`${darkMode ? 'hover:bg-[#1B2C27]/40' : 'hover:bg-slate-50/50'} transition-colors`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-extrabold text-sm border border-brand-primary/10 shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{u.companyName || 'B2B Client Buyer'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {u.isVerified ? (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 inline-flex items-center gap-1.5 shadow-sm">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      VERIFIED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1">
                      UNVERIFIED
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 dark:text-slate-300">{u.email}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{u.phone || 'No phone logs'}</p>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleRoleChange(u._id, u.role)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all inline-flex items-center gap-1.5 shadow-sm ${
                      darkMode ? 'bg-[#1B2C27] border-[#2E4B42] text-slate-300 hover:bg-[#253D37]' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-brand-light hover:text-brand-primary'
                    }`}
                  >
                    {u.role}
                    <RefreshCw className="w-2.5 h-2.5 text-slate-400" />
                  </button>
                </td>
                <td className="p-4">
                  {u.role === 'supplier' ? (
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-extrabold uppercase">LIC: <span className="text-brand-primary">{u.tradeLicense || 'Pending verification'}</span></p>
                      <p className="text-[10px] text-yellow-600 font-extrabold">Rating: {u.rating} ⭐ ({u.reviewCount} Reviews)</p>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-bold text-[10px] italic">Not Supplier</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.role === 'supplier' && (
                      <button
                        onClick={() => handleToggleVerification(u._id, u.isVerified)}
                        className={`p-2.5 rounded-2xl border shadow-sm transition-all duration-300 ${
                          u.isVerified 
                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                        }`}
                        title={u.isVerified ? 'Revoke Trust Verify' : 'Grant Trust Verify'}
                      >
                        {u.isVerified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal('user', u)}
                      className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
                        darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-[#253D37]' : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      title="Edit User Profile"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
                        darkMode ? 'bg-[#1B2C27] border-[#2E4B42] hover:bg-red-950/20 hover:text-red-400' : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:text-red-650'
                      }`}
                      title="Delete Record"
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
