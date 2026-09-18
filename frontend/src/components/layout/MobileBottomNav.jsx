import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  User,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Shop', icon: ShoppingBag },
    { path: '/categories', label: 'Categories', icon: LayoutGrid },
    {
      path: '/cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      path: isAuthenticated ? (isAdmin ? '/admin' : '/profile') : '/login',
      label: isAuthenticated ? (isAdmin ? 'Admin' : 'Profile') : 'Sign In',
      icon: isAdmin ? ShieldCheck : User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg safe-area-inset-bottom"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center relative transition-colors ${
                active ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110 text-emerald-600' : ''}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
              {active && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
