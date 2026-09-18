import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ArrowRight, FolderTree } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categoryService.getCategories();
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.categories) ? res.categories : (res.data?.categories || []));
      setCategories(list);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading categories..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              All Grocery Categories
            </h1>
            <p className="text-xs text-slate-500">Browse by our freshly curated departments</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
              <img
                src={category.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-extrabold text-base drop-shadow-sm">{category.name}</h3>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {category.description || 'Fresh and organic produce sourced directly from trusted growers.'}
              </p>

              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700 pt-2 border-t border-slate-100">
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
