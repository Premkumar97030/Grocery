import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No products found matching your search.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-100 p-4 space-y-3 animate-pulse"
          >
            <div className="aspect-square rounded-2xl bg-slate-100" />
            <div className="h-4 bg-slate-100 rounded-md w-1/3" />
            <div className="h-5 bg-slate-100 rounded-md w-3/4" />
            <div className="pt-2 flex items-center justify-between">
              <div className="h-6 bg-slate-100 rounded-md w-1/4" />
              <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-100 my-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No items found</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
