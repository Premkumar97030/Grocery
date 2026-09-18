import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ProductFilter = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  inStock = false,
  onInStockChange,
  sort = 'newest',
  onSortChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filter Catalog</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-600 transition-colors font-medium cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Products
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : (cat.name || '');
            const catId = typeof cat === 'string' ? cat : (cat._id || cat.id || cat.name);
            const isSelected = selectedCategory && selectedCategory.toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={catId}
                type="button"
                onClick={() => onSelectCategory(catName)}
                className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{catName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-700">In-Stock items only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;
