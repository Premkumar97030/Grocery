import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductCard from '../../components/product/ProductCard';
import Tilt3D from '../../components/common/Tilt3D';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  Tag,
  Zap,
  Leaf,
  CheckCircle2,
  HeartHandshake,
  ShoppingBag,
  Star,
  Flame,
  Truck,
  Apple,
  Award,
  Sparkle,
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catRes, prodRes] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts({ limit: 20 }),
      ]);

      const catList = Array.isArray(catRes.data)
        ? catRes.data
        : (Array.isArray(catRes.categories) ? catRes.categories : (catRes.data?.categories || []));
      setCategories(catList);

      const prodList = Array.isArray(prodRes.data)
        ? prodRes.data
        : (Array.isArray(prodRes.products) ? prodRes.products : (prodRes.data?.products || []));

      if (prodList.length > 0) {
        setFeaturedProducts(prodList.slice(0, 8));
        setDiscountedProducts(
          prodList.filter((p) => p.discountPrice && p.discountPrice > 0).slice(0, 4)
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to load home page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading FreshCart 3D Supermarket..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const features = [
    {
      icon: Clock,
      title: '10-Minute Lightning Delivery',
      desc: 'Hyperlocal micro-stores deliver farm produce to your doorstep in under 10 minutes.',
      tag: 'FASTEST',
      color: 'bg-amber-500/20 text-amber-500 border border-amber-400/30',
      glow: 'shadow-[0_8px_20px_rgba(245,158,11,0.25)]',
    },
    {
      icon: Leaf,
      title: '100% Organic & Pesticide Free',
      desc: 'Harvested directly from certified local sustainable farms every morning at sunrise.',
      tag: 'PURE',
      color: 'bg-emerald-500/20 text-emerald-500 border border-emerald-400/30',
      glow: 'shadow-[0_8px_20px_rgba(16,185,129,0.25)]',
    },
    {
      icon: Truck,
      title: 'Free Delivery On ₹500+',
      desc: 'Stock up your weekly groceries with zero delivery or packing convenience fees.',
      tag: 'SAVINGS',
      color: 'bg-blue-500/20 text-blue-500 border border-blue-400/30',
      glow: 'shadow-[0_8px_20px_rgba(59,130,246,0.25)]',
    },
    {
      icon: HeartHandshake,
      title: 'Instant 1-Click Refunds',
      desc: 'Not 100% satisfied with any item? Get an instant wallet credit in 10 seconds.',
      tag: 'ASSURANCE',
      color: 'bg-purple-500/20 text-purple-500 border border-purple-400/30',
      glow: 'shadow-[0_8px_20px_rgba(168,85,247,0.25)]',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Shalini Mehta',
      city: 'Hyderabad',
      text: 'The greens and avocados arrived literally 9 minutes after ordering. So fresh they felt like they were picked 10 minutes ago!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Arjun Nambiar',
      city: 'Bangalore',
      text: 'FreshCart saved our dinner party. Organic butter, herbs, and sourdough delivered before our oven even pre-heated. 10/10!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Sneha Patel',
      city: 'Mumbai',
      text: 'Their quality is leaps and bounds ahead of local supermarkets. Best Alphonso mangoes and chemical-free dairy.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Interactive 3D Hero Showcase */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-emerald-850 to-teal-950 text-white p-6 sm:p-12 lg:p-16 shadow-3d-lg border border-emerald-700/30 preserve-3d">
        {/* Floating 3D Ambient Orbs */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none animate-float-3d-slow" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-float-3d-reverse" />
        <div className="absolute right-1/3 top-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none animate-glow-3d" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Hero Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/20 backdrop-blur-xl border border-emerald-400/40 px-4 py-1.5 rounded-full text-xs font-black text-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.3)] animate-float-3d">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
              <span>SUPERFAST 10-MINUTE GROCERY DELIVERY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Farm-Fresh Groceries at Your Doorstep in{' '}
              <span className="bg-gradient-to-r from-amber-300 via-emerald-200 to-teal-100 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                10 Minutes.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl font-medium">
              Crisp organic vegetables, sweet seasonal fruits, farm-fresh dairy, artisan sourdough, and pantry essentials delivered straight to your door.
            </p>

            {/* CTA Buttons with 3D Depth */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/products">
                  <Button
                    variant="amber"
                    size="lg"
                    icon={ShoppingBag}
                    className="text-slate-950 font-black"
                  >
                    <span>Shop Fresh Groceries</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-[2px] transition-all">
                    Browse 7 Departments
                  </button>
                </Link>
              </div>

              {/* 3D Coupon Pill */}
              <div className="inline-flex items-center gap-2.5 bg-slate-950/60 backdrop-blur-xl border border-emerald-500/40 px-4 py-2 rounded-2xl text-xs text-emerald-200 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <Tag className="w-4 h-4 text-amber-300" />
                <span>
                  Use coupon code{' '}
                  <span className="font-mono font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30">
                    FRESH50
                  </span>{' '}
                  for ₹50 OFF your first order!
                </span>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Tilt3D
              maxTilt={14}
              scale={1.04}
              glareOpacity={0.3}
              className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-visible shadow-2xl p-1"
            >
              {/* Main Image Plate */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] group">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Organic Vegetables & Fruits"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>

              {/* 3D Floating Live Badge 1 (Top Left) */}
              <div
                className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.25)] border border-white flex items-center gap-3 text-slate-900 z-30 animate-float-3d"
                style={{ transform: 'translateZ(45px)' }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Direct Harvest</p>
                  <p className="text-xs font-black text-emerald-800">4:30 AM Farm Picked</p>
                </div>
              </div>

              {/* 3D Floating Live Badge 2 (Bottom Right) */}
              <div
                className="absolute -bottom-4 -right-4 bg-slate-900/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-slate-700/80 flex items-center gap-3 text-white z-30 animate-float-3d-reverse"
                style={{ transform: 'translateZ(55px)' }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Avg Delivery</p>
                  <p className="text-xs font-black text-white">8 Mins 42 Secs</p>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* 2. Quick Department Categories Grid with 3D Elevate */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 shadow-sm transition-all"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category._id || category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <Tilt3D
                maxTilt={12}
                scale={1.05}
                glareOpacity={0.15}
                className="bg-white rounded-3xl p-4 text-center border border-slate-100 shadow-3d hover:shadow-3d-hover transition-all duration-300 flex flex-col items-center justify-between h-full"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 overflow-hidden mb-3 flex items-center justify-center p-1.5 shadow-[0_8px_16px_rgba(16,185,129,0.12)] border border-emerald-100/80 group-hover:shadow-[0_12px_24px_rgba(16,185,129,0.25)] transition-all duration-300"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <img
                    src={category.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-115 transition-transform duration-500 ease-out"
                  />
                </div>
                <span
                  className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {category.name}
                </span>
              </Tilt3D>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Deals & Steal Prices */}
      {discountedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(244,63,94,0.35)] animate-float-3d">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Daily Flash Deals</span>
                  <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-0.5 rounded-full uppercase border border-rose-200">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Massive markdowns on seasonal fresh harvests</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 shadow-sm transition-colors"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Best Sellers & Organic Favorites */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular &amp; Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Highest rated daily essentials picked by thousands of shoppers</p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 shadow-sm transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Why FreshCart 4-Pillar 3D Cards */}
      <section className="bg-gradient-to-b from-white to-slate-50/80 rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-3d-lg space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            The FreshCart Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How We Deliver Peak Freshness in 10 Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Tilt3D
                key={i}
                maxTilt={10}
                scale={1.03}
                glareOpacity={0.15}
                className="p-6 rounded-3xl bg-white border border-slate-100/90 space-y-4 shadow-3d hover:shadow-3d-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between" style={{ transform: 'translateZ(25px)' }}>
                  <div className={`w-12 h-12 rounded-2xl ${feat.color} ${feat.glow} flex items-center justify-center font-bold`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {feat.tag}
                  </span>
                </div>
                <div style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="font-black text-slate-900 text-sm mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </Tilt3D>
            );
          })}
        </div>
      </section>

      {/* 6. Customer Testimonials in 3D */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by 50,000+ Happy Households
          </h2>
          <p className="text-xs text-slate-500">Here's what our community says about our 10-minute deliveries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Tilt3D
              key={idx}
              maxTilt={8}
              scale={1.02}
              glareOpacity={0.12}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-3d hover:shadow-3d-hover space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100" style={{ transform: 'translateZ(20px)' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300 shadow-sm"
                />
                <div>
                  <h4 className="font-black text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold">{t.city}</p>
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* 7. Guaranteed Freshness & Quality Callout with 3D Layering */}
      <section className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 relative overflow-hidden border border-slate-800 shadow-3d-lg preserve-3d">
        <div className="max-w-2xl space-y-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-black shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Quality &amp; Freshness Guarantee</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Not completely satisfied with the quality? We'll refund it instantly.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Every batch of produce undergoes rigorous 3-stage sorting for ripeness, crispness, and zero blemishes. If anything arrives less than perfect, get an instant replacement or full refund in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link to="/products">
              <Button
                variant="primary"
                size="lg"
                icon={ShoppingBag}
                className="font-black text-slate-950"
              >
                <span>Order Fresh Produce Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link
              to="/delivery-info"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-extrabold px-4 py-3.5 hover:underline"
            >
              Learn about our 10-min cold-chain logistics &rarr;
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-float-3d" />
      </section>
    </div>
  );
};

export default HomePage;
