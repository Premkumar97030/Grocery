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
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-white rounded-3xl border border-slate-100 my-8 shadow-3d">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner animate-float-3d">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Fresh fruits, vegetables, dairy and daily essentials are just 10 minutes away!
        </p>
        <Link to="/products">
          <Button variant="primary" size="md" icon={ShoppingBag}>
            <span>Start Shopping</span>
          </Button>
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
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Review items in your basket</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Delivery Bar */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/80 border border-emerald-200/80 rounded-3xl p-5 text-xs shadow-3d">
            {subtotal >= freeDeliveryThreshold ? (
              <div className="flex items-center gap-2 text-emerald-800 font-black">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-bounce" />
                <span>Congratulations! You qualify for FREE Lightning Delivery!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span>Add ₹{differenceForFree.toFixed(0)} more for FREE Delivery</span>
                  <span className="text-[11px] text-emerald-800 font-extrabold">₹{subtotal.toFixed(0)} / ₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-3d">
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

        {/* Right: Order Summary Card with 3D Depth */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 shadow-3d-lg">
            <h3 className="font-black text-slate-900 text-lg pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-black text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Fee</span>
                </div>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    FREE
                  </span>
                ) : (
                  <span className="font-black text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-emerald-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-black text-sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>

            {/* Guarantees */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe &amp; Secure 256-bit Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
