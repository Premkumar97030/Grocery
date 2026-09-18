import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const ContactPage = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been received.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="space-y-12 py-4 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>24/7 Dedicated Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          We're Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about your order, delivery timing, or farm partnerships? Reach out to us anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Contact Channels */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Phone Support</h4>
                  <p className="text-slate-500 mt-0.5">+91 98765 43210</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Toll-free 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Inquiries</h4>
                  <p className="text-slate-500 mt-0.5">support@freshcart.com</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Responses within 30 mins</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Operating Hours</h4>
                  <p className="text-slate-500 mt-0.5">Monday – Sunday: 6:00 AM – 11:00 PM</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">365 days a year</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Headquarters</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    FreshCart Logistics Hub, Outer Ring Road, Financial District, Hyderabad, Telangana 500032
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Contact Form */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Send Us a Message</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the details below and our customer support team will get in touch immediately.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  We've received your query and will reply to <span className="font-bold">{email || 'your email'}</span> within 30 minutes.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="mt-2"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  type="text"
                  placeholder="e.g. Question about 10-min delivery / Order inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain how we can help you..."
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm p-3.5 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  loading={loading}
                  icon={Send}
                  className="w-full sm:w-auto"
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
