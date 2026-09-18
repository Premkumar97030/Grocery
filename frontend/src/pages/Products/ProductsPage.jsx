import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilter from '../../components/product/ProductFilter';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Filter, Search, X } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from URL params
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const cats = res.data?.categories || res.categories || (Array.isArray(res.data) ? res.data : []);
      setCategories(cats);
    } catch (e) {
      console.warn('Failed to load categories', e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 12,
        sort: currentSort,
      };

      if (currentSearch) params.search = currentSearch;
      if (currentCategory && currentCategory !== 'all') params.category = currentCategory;
      if (currentMinPrice) params.minPrice = currentMinPrice;
      if (currentMaxPrice) params.maxPrice = currentMaxPrice;
      if (currentInStock) params.inStock = true;

      const res = await productService.getProducts(params);
      const prods = res.data?.products || res.products || (Array.isArray(res.data) ? res.data : []);
      setProducts(prods);
      const pag = res.data?.pagination || res.pagination || {
        page: currentPage,
        totalPages: Math.ceil(prods.length / 12) || 1,
        total: prods.length,
      };
      setPagination(pag);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // reset page on filter change
    setSearchParams(newParams);
  };

  const handlePriceChange = (type, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (type === 'min') {
      val ? newParams.set('minPrice', val) : newParams.delete('minPrice');
    } else {
      val ? newParams.set('maxPrice', val) : newParams.delete('maxPrice');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentCategory !== 'all' ? currentCategory : currentSearch ? `Search: "${currentSearch}"` : 'All Grocery Items'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {pagination.total} items
          </p>
        </div>

        {/* Active search pill */}
        <div className="flex items-center gap-2">
          {currentSearch && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
              <Search className="w-3.5 h-3.5" />
              <span>"{currentSearch}"</span>
              <button
                onClick={() => updateParam('search', '')}
                className="hover:text-rose-600 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilter
            categories={categories}
            selectedCategory={currentCategory}
            onSelectCategory={(cat) => updateParam('category', cat)}
            minPrice={currentMinPrice}
            maxPrice={currentMaxPrice}
            onPriceChange={handlePriceChange}
            inStock={currentInStock}
            onInStockChange={(val) => updateParam('inStock', val)}
            sort={currentSort}
            onSortChange={(val) => updateParam('sort', val)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-end">
            <div className="w-80 max-w-full bg-white h-full overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-slate-900 text-base">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilter
                categories={categories}
                selectedCategory={currentCategory}
                onSelectCategory={(cat) => {
                  updateParam('category', cat);
                  setMobileFilterOpen(false);
                }}
                minPrice={currentMinPrice}
                maxPrice={currentMaxPrice}
                onPriceChange={handlePriceChange}
                inStock={currentInStock}
                onInStockChange={(val) => updateParam('inStock', val)}
                sort={currentSort}
                onSortChange={(val) => {
                  updateParam('sort', val);
                  setMobileFilterOpen(false);
                }}
                onResetFilters={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Product Catalog Content */}
        <div className="lg:col-span-3 space-y-8">
          {error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
