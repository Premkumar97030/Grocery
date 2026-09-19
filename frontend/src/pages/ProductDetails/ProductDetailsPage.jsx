import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import ProductGrid from '../../components/product/ProductGrid';
import QuantitySelector from '../../components/product/QuantitySelector';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Plus,
  ShoppingCart,
  Heart,
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProductById(id);
      const prod = res.data?.product || res.product || res.data;
      if (prod) {
        setProduct(prod);

        // Fetch related products in the same category
        if (prod.category) {
          const relRes = await productService.getProducts({
            category: prod.category,
            limit: 4,
          });
          const relProds = relRes.data?.products || relRes.products || (Array.isArray(relRes.data) ? relRes.data : []);
          setRelatedProducts(relProds.filter((p) => p._id !== prod._id));
        }
      }
    } catch (err) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" text="Loading product details..." />;
  if (error || !product) return <ErrorMessage message={error || 'Product not found'} onRetry={fetchProduct} />;

  const cartItem = cart.items.find(
    (item) => (item.product?._id || item.product) === product._id
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const effectivePrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product, selectedQty);
      showToast(`Added ${selectedQty} x "${product.name}" to cart!`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-emerald-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-emerald-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image Stage */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative">
            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {discountPercent}% DISCOUNT
              </span>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Specifications & Add to Cart */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Brand: <strong className="text-slate-700">{product.brand}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Unit */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.rating?.toFixed(1) || '4.5'}</span>
                <span className="text-amber-700 font-normal">
                  ({product.reviews?.length || 18} reviews)
                </span>
              </div>
              <span className="text-slate-400">&bull;</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                Unit: {product.unit}
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{effectivePrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save ₹{(product.price - product.discountPrice).toFixed(0)}
                  </span>
                </>
              )}
            </div>

            {/* Stock and description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units left)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-500">Out of Stock</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {product.stock > 0 ? (
              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={selectedQty}
                  max={product.stock}
                  onIncrement={() => setSelectedQty((q) => Math.min(product.stock, q + 1))}
                  onDecrement={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  size="lg"
                />
                <Button
                  size="lg"
                  variant="primary"
                  icon={ShoppingCart}
                  loading={adding}
                  onClick={handleAddToCart}
                  className="flex-1 text-sm font-bold shadow-md shadow-emerald-600/30"
                >
                  Add To Cart &bull; ₹{(effectivePrice * selectedQty).toFixed(0)}
                </Button>
              </div>
            ) : (
              <Button size="lg" variant="outline" disabled className="w-full">
                Product Currently Out of Stock
              </Button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center font-medium">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                <span>10-Min Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span>100% Organic</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Related in {product.category}
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View More
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
