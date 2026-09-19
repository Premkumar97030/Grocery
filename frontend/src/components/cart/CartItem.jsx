import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import QuantitySelector from '../product/QuantitySelector';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product || {};
  const effectivePrice = item.price || (product.discountPrice > 0 ? product.discountPrice : product.price) || 0;
  const itemTotal = effectivePrice * item.quantity;

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-none">
      {/* Product Thumbnail */}
      <Link to={`/products/${product._id || product}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Title and Unit */}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold text-slate-400 block truncate">
          {product.category || 'Grocery'} &bull; {product.unit || '1 unit'}
        </span>
        <Link
          to={`/products/${product._id || product}`}
          className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors block truncate"
        >
          {product.name || 'Grocery Item'}
        </Link>
        <div className="text-xs text-slate-500 mt-1">
          ₹{effectivePrice} each
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <QuantitySelector
          size="sm"
          quantity={item.quantity}
          max={product.stock || 99}
          onIncrement={() => onUpdateQuantity(product._id || product, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(product._id || product, item.quantity - 1)}
        />

        {/* Item Total Price */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-extrabold text-slate-900 block">
            ₹{itemTotal.toFixed(0)}
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onRemove(product._id || product)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
