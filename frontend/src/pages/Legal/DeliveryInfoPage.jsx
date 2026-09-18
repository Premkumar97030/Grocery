import React from 'react';
import { Truck, Clock, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeliveryInfoPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping &amp; Returns</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Delivery &amp; Return Policy
        </h1>
        <p className="text-xs text-slate-500">
          Superfast 10-minute delivery &bull; 100% freshness guarantee
        </p>
      </div>

      {/* Grid of Key Promises */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">10-Min Fast Delivery</h3>
          <p className="text-xs text-slate-500">Packed in 2 mins, delivered in 10 mins from dark stores.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Free Over ₹500</h3>
          <p className="text-xs text-slate-500">Zero delivery fee on all orders exceeding ₹500.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Instant Refund</h3>
          <p className="text-xs text-slate-500">No questions asked return on unsatisfied fresh produce.</p>
        </div>
      </div>

      {/* Detailed Guidelines */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">1. Delivery Zones &amp; Timings</h2>
          <p>
            FreshCart delivers across major neighborhoods in Hyderabad, Bangalore, Mumbai, and Delhi-NCR from 6:00 AM to 11:00 PM daily. Check your postal code at checkout to confirm instant 10-minute slot availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">2. Delivery Charges Structure</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-100 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 text-xs font-bold">
                <tr>
                  <th className="p-3 border-b border-slate-200">Order Value</th>
                  <th className="p-3 border-b border-slate-200">Delivery Fee</th>
                  <th className="p-3 border-b border-slate-200">Estimated Arrival</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">₹500 and above</td>
                  <td className="p-3 font-bold text-emerald-600">FREE</td>
                  <td className="p-3 text-slate-600">10 – 15 Minutes</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Below ₹500</td>
                  <td className="p-3 font-bold text-slate-900">₹25</td>
                  <td className="p-3 text-slate-600">10 – 15 Minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">3. Easy Returns &amp; Replacement</h2>
          <p>
            If any item delivered is damaged, expired, or not up to quality standards:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Go to <Link to="/orders" className="text-emerald-600 font-semibold underline">Your Orders</Link> within 24 hours of delivery.</li>
            <li>Click on "Report Quality Issue" or contact our 24/7 support.</li>
            <li>Receive an instant replacement delivery or full refund to your original payment method.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DeliveryInfoPage;
