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
        productService.getProducts({ limit: 16 }),
      ]);

      if (catRes.success) setCategories(catRes.data.categories || []);
      if (prodRes.success && prodRes.data.products) {
        const prods = prodRes.data.products;
        setFeaturedProducts(prods.slice(0, 8));
        setDiscountedProducts(
          prods.filter((p) => p.discountPrice > 0 && p.discountPrice < p.price).slice(0, 8)
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

  if (loading) return <LoadingSpinner size="lg" text="Loading FreshCart Grocery Catalog..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Promo Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-100">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>10-Minute Instant Grocery Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Fresh Organic Groceries &amp; Daily Essentials.
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Farm-picked crisp vegetables, fresh seasonal fruits, dairy, and artisanal breads delivered right to your kitchen in minutes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              <span>Shop All Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-emerald-800/60 hover:bg-emerald-800/80 text-white border border-white/20 px-5 py-3 rounded-2xl font-bold text-sm transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute right-10 bottom-0 w-72 h-72 bg-teal-300/20 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* 2. Quick Category Tiles */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-slate-500">Pick from our freshly stocked collections</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group bg-white rounded-3xl p-3 text-center border border-slate-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50/60 overflow-hidden mb-2 flex items-center justify-center p-1">
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Hot Deals & Discounted Picks */}
      {discountedProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Hot Grocery Deals
                </h2>
                <p className="text-xs text-slate-500">Unbeatable discounts on fresh daily staples</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {discountedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Products Catalog */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular &amp; Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Highest rated organic essentials picked by shoppers</p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Freshness Guarantee Banner */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden border border-slate-800">
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
            Freshness Guaranteed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Not completely satisfied with the freshness?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We source our veggies and fruits every single morning directly from certified organic farms. If anything arrives less than perfect, we will issue an instant refund with zero questions asked.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all"
            >
              <span>Order Fresh Produce Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
