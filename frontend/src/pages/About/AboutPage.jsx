import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Truck,
  Leaf,
  ShieldCheck,
  HeartHandshake,
  Users,
  Award,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Farm Partners', value: '200+' },
    { label: 'Avg Delivery Time', value: '10 Mins' },
    { label: 'Fresh Products', value: '1,500+' },
  ];

  const values = [
    {
      icon: Leaf,
      title: '100% Farm Fresh',
      desc: 'Sourced directly from certified organic local farmers at sunrise to reach your table the same day.',
    },
    {
      icon: Clock,
      title: '10-Minute Lightning Delivery',
      desc: 'Our network of local micro-fulfillment dark stores ensures lightning-fast delivery within minutes.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Compromise Quality',
      desc: 'Every item passes rigorous 3-tier quality checks for freshness, crispness, and zero chemical preservatives.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer-First Returns',
      desc: 'Not satisfied with a tomato or apple? Get an instant no-questions-asked refund directly to your wallet.',
    },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Head of Quality & Farm Sourcing',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Rajesh Verma',
      role: 'Chief Logistics Officer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Ananya Reddy',
      role: 'Customer Experience Lead',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
            <span>The FreshCart Promise</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Revolutionizing grocery shopping, 10 minutes at a time.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Founded with a vision to connect sustainable farm producers directly with modern households, FreshCart brings farm-fresh vegetables, fruits, dairy, and artisanal staples to your doorstep in minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:gap-3"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs text-center space-y-1 hover:border-emerald-200 transition-colors"
          >
            <p className="text-2xl sm:text-4xl font-black text-emerald-600 tracking-tight">{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Core Mission & Values */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Thousands Choose FreshCart
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We hold ourselves to the highest standards of freshness, ethics, and lightning-fast logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3 hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team / Leadership */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Meet the Team Behind the Freshness
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Passionate foodies, agricultural experts, and logistics engineers building the future of grocery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs text-center space-y-4 hover:border-emerald-200 transition-colors"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-emerald-50"
              />
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{member.name}</h4>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
