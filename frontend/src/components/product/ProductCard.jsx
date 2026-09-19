import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../services/api';
import QuantitySelector from './QuantitySelector';
import { Plus, Star, ShoppingCart, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);

  // Check if product is in cart
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      await addToCart(product, 1);
      showToast(`Added "${product.name}" to cart!`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
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

  const isOutOfStock = product.stock <= 0;

  // Resolve image URL (supports uploaded files and external images)
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/80 p-3.5 sm:p-4 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between">
      {/* Top badges */}
      <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10 pointer-events-none">
        {hasDiscount ? (
          <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Fresh
          </span>
        )}

        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-800 shadow-xs border border-slate-100">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{product.rating?.toFixed(1) || '4.5'}</span>
        </div>
      </div>

      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="block relative pt-4 pb-2 overflow-hidden">
        <div className="aspect-square rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-medium mb-1">
            <span className="truncate">{product.category}</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold text-[10px]">
              {product.unit}
            </span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ₹{effectivePrice}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            <span className="block text-[10px] text-emerald-600 font-medium">
              {isOutOfStock ? (
                <span className="text-rose-500 font-semibold">Out of Stock</span>
              ) : (
                'In Stock'
              )}
            </span>
          </div>

          {/* Action Button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : cartQty > 0 ? (
              <QuantitySelector
                size="sm"
                quantity={cartQty}
                max={product.stock}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={loading}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm shadow-emerald-600/20 transition-all duration-150 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
