import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Product3DViewer from './Product3DViewer';
import QuantitySelector from './QuantitySelector';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShoppingCart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

/**
 * Product3DModal
 * High-end immersive 3D Studio inspection modal for any grocery item.
 * Allows customers to rotate 360°, inspect details in 3D, and add directly to cart.
 */
export const Product3DModal = ({ product, isOpen, onClose }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!isOpen || !product) return null;

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
  const isOutOfStock = product.stock <= 0;

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

  const handleIncrement = async () => {
    try {
      await updateQuantity(product._id, cartQty + 1);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDecrement = async () => {
    try {
      await updateQuantity(product._id, cartQty - 1);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {product.category}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400 font-semibold">{product.unit}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight truncate max-w-md">
                {product.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Showcase Studio Canvas */}
        <div className="p-4 sm:p-6 bg-slate-950 flex-1 flex flex-col justify-center min-h-[360px] sm:min-h-[440px]">
          <Product3DViewer
            product={product}
            height="420px"
            showControls={true}
            autoRotateDefault={true}
          />
        </div>

        {/* Footer Actions & Specifications Bar */}
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Price and Details link */}
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">₹{effectivePrice}</span>
                {hasDiscount && (
                  <span className="text-sm text-slate-500 line-through">₹{product.price}</span>
                )}
                {hasDiscount && (
                  <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-emerald-400 font-semibold">⚡ 10-Min Fast Delivery</span>
              </div>
            </div>

            <Link
              to={`/products/${product._id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors ml-auto sm:ml-4 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60"
            >
              <span>Full Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: Cart Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : cartQty > 0 ? (
              <div className="flex items-center gap-3 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 w-full sm:w-auto justify-between">
                <span className="text-xs font-bold text-slate-300 px-2">In Cart:</span>
                <QuantitySelector
                  size="md"
                  quantity={cartQty}
                  max={product.stock}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <QuantitySelector
                  size="md"
                  quantity={selectedQty}
                  max={product.stock}
                  onIncrement={() => setSelectedQty((q) => Math.min(product.stock, q + 1))}
                  onDecrement={() => setSelectedQty((q) => Math.max(1, q - 1))}
                />
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.35)] active:scale-98 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{adding ? 'Adding...' : `Add • ₹${(effectivePrice * selectedQty).toFixed(0)}`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product3DModal;
