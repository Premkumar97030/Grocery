import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import Tilt3D from '../../components/common/Tilt3D';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ArrowRight, FolderTree, Sparkles } from 'lucide-react';

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

  if (loading) return <LoadingSpinner size="lg" text="Loading 3D Category Showcases..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="space-y-8">
      {/* 3D Glass Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-3d">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-[0_6px_16px_rgba(16,185,129,0.3)] animate-float-3d">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              All Grocery Categories
            </h1>
            <p className="text-xs text-slate-500 font-medium">Browse our farm-direct fresh departments</p>
          </div>
        </div>
      </div>

      {/* 3D Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id || category.name}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group block"
          >
            <Tilt3D
              maxTilt={10}
              scale={1.03}
              glareOpacity={0.2}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-3d hover:shadow-3d-hover transition-all duration-300 flex flex-col h-full"
            >
              <div
                className="aspect-[4/3] bg-slate-50 overflow-hidden relative shadow-inner"
                style={{ transform: 'translateZ(20px)' }}
              >
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white z-10" style={{ transform: 'translateZ(30px)' }}>
                  <h3 className="font-black text-base drop-shadow-md text-white tracking-wide">{category.name}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between" style={{ transform: 'translateZ(15px)' }}>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-medium">
                  {category.description || 'Fresh and organic produce sourced directly from trusted growers.'}
                </p>

                <div className="flex items-center justify-between text-xs font-black text-emerald-600 group-hover:text-emerald-700 pt-3 border-t border-slate-100">
                  <span>Shop Department</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Tilt3D>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
