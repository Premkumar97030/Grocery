import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CartItem from '../../components/cart/CartItem';
import Button from '../../components/common/Button';
import {
  ShoppingCart,
  ArrowRight,
  Trash2,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.price || item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const freeDeliveryThreshold = 500;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 40;
  const differenceForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalAmount = subtotal + deliveryFee;

  const handleUpdateQty = async (productId, qty) => {
    try {
      await updateQuantity(productId, qty);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      showToast('Item removed from cart');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      clearCart();
      showToast('Cart cleared');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-white rounded-3xl border border-slate-100 my-8 shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our farm fresh produce and daily essentials!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cart.items.reduce((acc, i) => acc + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Review items in your basket</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Delivery Bar */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-xs">
            {subtotal >= freeDeliveryThreshold ? (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You qualify for FREE Delivery!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-emerald-900 font-semibold">
                  <span>Add ₹{differenceForFree.toFixed(0)} more for FREE Delivery</span>
                  <span className="text-[11px] text-emerald-700">₹{subtotal.toFixed(0)} / ₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            <div className="divide-y divide-slate-100">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product?._id || item.product}
                  item={item}
                  onUpdateQuantity={handleUpdateQty}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivery Fee</span>
                </div>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleProceedToCheckout}
              className="w-full text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              Proceed to Checkout
            </Button>

            {/* Guarantees */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Secure 256-bit Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
