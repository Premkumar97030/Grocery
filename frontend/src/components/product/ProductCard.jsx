import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../services/api';
import Tilt3D from '../common/Tilt3D';
import QuantitySelector from './QuantitySelector';
import Product3DModal from './Product3DModal';
import { Plus, Star, Box, Sparkles } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

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
    <>
      <Tilt3D
        maxTilt={10}
        scale={1.03}
        glareOpacity={0.2}
        className="group h-full rounded-3xl bg-white border border-slate-100 shadow-3d hover:shadow-3d-hover transition-all duration-300 flex flex-col justify-between p-4"
      >
        {/* 3D Floating Top Badges */}
        <div
          className="flex items-center justify-between absolute top-4 left-4 right-4 z-20 pointer-events-none"
          style={{ transform: 'translateZ(35px)' }}
        >
          {hasDiscount ? (
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-[0_4px_10px_rgba(244,63,94,0.35)]">
              {discountPercent}% OFF
            </span>
          ) : (
            <span className="bg-emerald-50/90 backdrop-blur-md text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Fresh Pick
            </span>
          )}

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-black text-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-100">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>

        {/* 3D Product Image Showcase */}
        <div className="block relative pt-5 pb-3" style={{ transform: 'translateZ(25px)' }}>
          <Link
            to={`/products/${product._id}`}
            className="block aspect-square rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center overflow-hidden border border-slate-100/80 shadow-inner group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 relative"
          >
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Quick 3D View Trigger Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIs3DModalOpen(true);
            }}
            title="Inspect in 3D Studio"
            className="absolute bottom-5 right-2 z-20 flex items-center gap-1 bg-slate-900/90 hover:bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-slate-700/60 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group/btn"
          >
            <Box className="w-3 h-3 text-emerald-400 group-hover/btn:text-white transition-colors" />
            <span>3D VIEW</span>
          </button>
        </div>

        {/* Product Information with 3D Depth */}
        <div
          className="mt-2 flex-1 flex flex-col justify-between"
          style={{ transform: 'translateZ(15px)' }}
        >
          <div>
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-medium mb-1.5">
              <span className="truncate font-semibold text-emerald-600/90">{product.category}</span>
              <span className="bg-slate-100/90 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[10px]">
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

          {/* Pricing & 3D Tactile Action Button */}
          <div
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">
                  ₹{effectivePrice}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <span className="block text-[10px] font-semibold">
                {isOutOfStock ? (
                  <span className="text-rose-500">Out of Stock</span>
                ) : (
                  <span className="text-emerald-600">⚡ 10-Min Delivery</span>
                )}
              </span>
            </div>

            {/* 3D Action Controls */}
            <div style={{ transform: 'translateZ(30px)' }}>
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
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-[0_3px_0_#047857,0_6px_14px_rgba(5,150,105,0.3)] hover:shadow-[0_5px_0_#047857,0_10px_18px_rgba(5,150,105,0.35)] active:translate-y-[2px] active:shadow-[0_1px_0_#047857] transition-all duration-150 cursor-pointer border-t border-emerald-400/40"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>ADD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Tilt3D>

      {/* 3D Studio Inspection Modal */}
      <Product3DModal
        product={product}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
