import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ArrowRight } from 'lucide-react';

export const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (idx) => {
    setOpenItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'delivery', label: '10-Min Delivery' },
    { id: 'orders', label: 'Orders & Payments' },
    { id: 'quality', label: 'Quality & Sourcing' },
    { id: 'returns', label: 'Returns & Refunds' },
  ];

  const faqs = [
    {
      category: 'delivery',
      question: 'How does 10-minute lightning delivery work?',
      answer:
        'We operate hyperlocal micro-fulfillment centers (dark stores) strategically located across neighborhoods. When you place an order, our automated picking system packs your fresh items in under 2 minutes, and our dedicated riders deliver within a 2-3 km radius in 10 minutes.',
    },
    {
      category: 'delivery',
      question: 'What are the delivery charges?',
      answer:
        'Delivery is completely FREE on all orders above ₹500. For orders under ₹500, a minimal delivery convenience fee of ₹25 is applied.',
    },
    {
      category: 'delivery',
      question: 'What are the delivery operating hours?',
      answer:
        'Our delivery partners operate every day from 6:00 AM to 11:00 PM, including weekends and public holidays.',
    },
    {
      category: 'orders',
      question: 'What payment methods do you accept?',
      answer:
        'We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, MasterCard, RuPay), and Net Banking.',
    },
    {
      category: 'orders',
      question: 'Can I cancel or modify my order after placing it?',
      answer:
        'Yes! You can cancel your order directly from your Orders page while it is in "Pending" or "Confirmed" status before our rider departs.',
    },
    {
      category: 'quality',
      question: 'How do you guarantee farm freshness and organic quality?',
      answer:
        'Our procurement team receives daily harvests directly from verified organic farms at 4:00 AM. Every batch undergoes rigorous quality inspections for pesticide-free certification, crispness, and ripeness before reaching our store.',
    },
    {
      category: 'returns',
      question: 'What is your refund policy if an item arrives damaged or unripe?',
      answer:
        'We have a strict "No Questions Asked" refund policy. If any produce does not meet your expectations, simply report it via your profile or customer support for an instant replacement or full refund.',
    },
    {
      category: 'returns',
      question: 'How long does an online refund take to credit?',
      answer:
        'UPI refunds are credited instantly. Credit and Debit card refunds reflect in your bank account within 2-4 business days.',
    },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 py-4 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Find instant answers to common questions about delivery, orders, payments, and our fresh farm sourcing.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search your question (e.g. delivery time, refund)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
            <p className="text-sm font-bold text-slate-700">No questions matched your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try a different keyword or contact our support team.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, i) => {
            const isOpen = !!openItems[i];
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleItem(i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help banner */}
      <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Still have questions?</h4>
            <p className="text-xs text-slate-600">Our customer support champions are available 24/7 to assist you.</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
        >
          Contact Support <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;
