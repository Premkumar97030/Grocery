import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: January 2026 &bull; Effective for all FreshCart users and customers
        </p>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the FreshCart mobile website and application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue using our services immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">2. Account Registration &amp; Security</h2>
          <p>
            When creating an account with FreshCart, you agree to provide true, accurate, and current information. You are responsible for safeguarding your login credentials and for all activities that take place under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">3. Orders, Pricing &amp; Availability</h2>
          <p>
            All produce prices are displayed in Indian Rupees (₹) inclusive of applicable taxes. FreshCart strives to ensure accurate pricing and inventory; however, in rare cases of stock shortages from farms, we reserve the right to cancel or refund the affected items.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">4. 10-Minute Lightning Delivery</h2>
          <p>
            Delivery turnaround is calculated from when the order is confirmed to arrival at the delivery address. Adverse weather, natural calamities, or unforeseen road closures may occasionally cause temporary delays.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">5. Cancellations &amp; Instant Refunds</h2>
          <p>
            Orders can be cancelled free of charge while in "Pending" status. For fresh produce that does not meet quality expectations upon delivery, customers can initiate a replacement or full refund through our customer support within 24 hours of delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">6. Limitation of Liability</h2>
          <p>
            FreshCart shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
