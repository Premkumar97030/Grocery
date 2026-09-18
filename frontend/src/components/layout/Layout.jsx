import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import MobileBottomNav from './MobileBottomNav';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Layout = ({ children }) => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-16 lg:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children || <Outlet />}
      </main>

      <Footer />

      {/* Mobile Bottom Sticky Navigation */}
      <MobileBottomNav />

      {/* Floating Toast Alerts Container */}
      <div className="fixed bottom-20 lg:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700/50'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700/50'
                : 'bg-slate-900/90 text-white border-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;


