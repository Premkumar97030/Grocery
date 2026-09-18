import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ConnectionBadge from '../layout/ConnectionBadge';
 import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ children, title, subtitle, action }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">FreshCart</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ConnectionBadge />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Signed in as:</span>
            <span className="font-bold text-white">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Admin Body with Sidebar */}
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {/* Section Header */}
          {(title || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          )}

          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

