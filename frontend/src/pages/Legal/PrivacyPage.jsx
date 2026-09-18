import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>User Privacy &amp; Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: January 2026 &bull; Your privacy is our utmost priority
        </p>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">1. Information We Collect</h2>
          <p>
            When you register, place orders, or browse FreshCart, we collect information including your name, email address, contact phone number, delivery address, and order transaction history.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>To process and deliver your grocery orders in 10 minutes.</li>
            <li>To communicate order confirmation, rider dispatch updates, and OTPs.</li>
            <li>To enhance platform performance, personalization, and recommendations.</li>
            <li>To prevent fraudulent transactions and maintain account security.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">3. Payment &amp; Financial Data Security</h2>
          <p>
            FreshCart never stores your credit/debit card numbers, CVVs, or UPI PINs. All financial payments are encrypted with 256-bit SSL encryption and processed via PCI-DSS compliant banking partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">4. Third-Party Sharing</h2>
          <p>
            We strictly do not sell, rent, or trade your personal information with third-party advertisers. Data is only shared with essential logistics delivery partners to fulfill your doorstep deliveries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">5. Contact Our Data Protection Officer</h2>
          <p>
            If you have questions regarding your data or wish to request data erasure, email us at <span className="font-bold text-emerald-600">privacy@freshcart.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
