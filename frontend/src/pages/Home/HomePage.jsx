import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductCard from '../../components/product/ProductCard';
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

  if (loading) return <LoadingSpinner size="lg" text="Loading FreshCart Supermarket..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const features = [
    {
      icon: Clock,
      title: '10-Minute Lightning Delivery',
      desc: 'Hyperlocal micro-stores deliver farm produce to your doorstep in minutes.',
      tag: 'FASTEST',
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      icon: Leaf,
      title: '100% Organic & Pesticide Free',
      desc: 'Harvested directly from certified local farms every sunrise.',
      tag: 'PURE',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: Truck,
      title: 'Free Shipping Over ₹500',
      desc: 'Stock up your weekly groceries with zero delivery convenience fees.',
      tag: 'SAVINGS',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: HeartHandshake,
      title: 'No-Questions-Asked Refunds',
      desc: 'Not 100% happy with a mango or tomato? Instant refund straight to wallet.',
      tag: 'ASSURANCE',
      color: 'bg-purple-500/10 text-purple-600',
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
    <div className="space-y-16 sm:space-y-20">
      {/* 1. Hero Promo Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl shadow-emerald-950/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 shadow-inner">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>SUPERFAST 10-MINUTE GROCERY DELIVERY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Farm-Fresh Groceries at Your Doorstep in <span className="bg-gradient-to-r from-amber-300 via-emerald-200 to-white bg-clip-text text-transparent">10 Minutes</span>.
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl font-normal">
              Crisp organic vegetables, sweet seasonal fruits, dairy, artisan sourdough, and pantry essentials sourced directly from farmers at sunrise.
            </p>

            {/* CTA Buttons & Micro badges */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>Shop Fresh Groceries</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-sm transition-all"
                >
                  Browse 7 Departments
                </Link>
              </div>

              {/* Coupon Bar */}
              <div className="inline-flex items-center gap-2 bg-emerald-950/50 backdrop-blur-md border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-200">
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span>Use code <span className="font-mono font-bold text-amber-300 bg-amber-400/15 px-1.5 py-0.5 rounded">FRESH50</span> for ₹50 OFF your first order!</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Banner & Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Organic Vegetables & Fruits"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating Live Badge 1 */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex items-center gap-2.5 text-slate-900 animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Direct Harvest</p>
                  <p className="text-xs font-black text-emerald-800">4:30 AM Farm Picked</p>
                </div>
              </div>

              {/* Floating Live Badge 2 */}
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center gap-2.5 text-white">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-300 uppercase">Avg Delivery</p>
                  <p className="text-xs font-black text-white">8 Mins 42 Secs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur circles */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Quick Department Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category._id || category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group bg-white rounded-3xl p-3.5 text-center border border-slate-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col items-center justify-between hover:-translate-y-1"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50/70 overflow-hidden mb-2.5 flex items-center justify-center p-1.5 ring-1 ring-emerald-100">
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Deals & Steal Prices */}
      {discountedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Daily Flash Deals
                </h2>
                <p className="text-xs text-slate-500">Massive markdowns on seasonal fresh harvests</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <TrendingUp className="w-5 h-5" />
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
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Why FreshCart 4-Pillar Features */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
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
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3 hover:border-emerald-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center font-bold`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by 50,000+ Happy Households
          </h2>
          <p className="text-xs text-slate-500">Here's what our community says about our 10-minute deliveries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Guaranteed Freshness & Quality Callout */}
      <section className="rounded-3xl bg-slate-950 text-white p-8 sm:p-14 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Quality &amp; Freshness Guarantee</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Not completely satisfied with the quality? We'll refund it instantly.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Every batch of produce undergoes rigorous 3-stage sorting for ripeness, crispness, and zero blemishes. If anything arrives less than perfect, get an instant replacement or full refund in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span>Order Fresh Produce Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/delivery-info"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-bold px-4 py-3.5"
            >
              Learn about our 10-min cold-chain logistics &rarr;
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
};

export default HomePage;
