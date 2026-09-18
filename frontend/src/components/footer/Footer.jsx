import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">10-Minute Delivery</h4>
              <p className="text-xs text-slate-400">Lightning fast doorstep delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Organic & Fresh</h4>
              <p className="text-xs text-slate-400">Directly sourced from trusted farms</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Shipping &gt; ₹500</h4>
              <p className="text-xs text-slate-400">Enjoy zero delivery fee perks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Returns & Refunds</h4>
              <p className="text-xs text-slate-400">No questions asked return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white">FreshCart</span>
          </Link>
          <p className="text-sm text-slate-400 max-w-sm">
            Your neighborhood online grocery store delivering farm-fresh vegetables, fruits, dairy, and daily essentials in 10 minutes.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+91 98765 43210 (24/7 Helpline)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>support@freshcart.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Outer Ring Road, Financial District, Hyderabad, India</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white text-sm font-bold mb-4">Categories</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link to="/products?category=Fresh%20Vegetables" className="hover:text-emerald-400 transition-colors">
                Fresh Vegetables
              </Link>
            </li>
            <li>
              <Link to="/products?category=Fresh%20Fruits" className="hover:text-emerald-400 transition-colors">
                Fresh Fruits
              </Link>
            </li>
            <li>
              <Link to="/products?category=Dairy%20%26%20Eggs" className="hover:text-emerald-400 transition-colors">
                Dairy & Eggs
              </Link>
            </li>
            <li>
              <Link to="/products?category=Bakery%20%26%20Bread" className="hover:text-emerald-400 transition-colors">
                Bakery & Bread
              </Link>
            </li>
            <li>
              <Link to="/products?category=Beverages%20%26%20Juices" className="hover:text-emerald-400 transition-colors">
                Beverages & Juices
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support Links */}
        <div>
          <h4 className="text-white text-sm font-bold mb-4">Company &amp; Help</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                Contact &amp; Support
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-emerald-400 transition-colors">
                FAQ &amp; Help Center
              </Link>
            </li>
            <li>
              <Link to="/delivery-info" className="hover:text-emerald-400 transition-colors">
                Delivery &amp; Returns
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Demo Credentials Box */}
        <div>
          <h4 className="text-white text-sm font-bold mb-4">Test Credentials</h4>
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 text-xs space-y-2">
            <div>
              <span className="text-emerald-400 font-semibold block">Admin Login:</span>
              <span className="text-slate-300 block">admin@grocery.com</span>
              <span className="text-slate-400 block font-mono">Admin@123</span>
            </div>
            <div className="border-t border-slate-700 pt-2">
              <span className="text-emerald-400 font-semibold block">Customer Login:</span>
              <span className="text-slate-300 block">user@grocery.com</span>
              <span className="text-slate-400 block font-mono">User@123</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {new Date().getFullYear()} FreshCart Grocery Delivery. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>&bull;</span>
          <Link to="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
