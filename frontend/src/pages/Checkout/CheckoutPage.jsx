import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import AddressCard from '../../components/checkout/AddressCard';
import AddressForm from '../../components/checkout/AddressForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, updateUserState } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await userService.getProfile();
      if (res.success && res.data.user) {
        const userAddrs = res.data.user.addresses || [];
        setAddresses(userAddrs);

        // Select default address or first address
        const defaultAddr = userAddrs.find((a) => a.isDefault) || userAddrs[0];
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.price || item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  const handleCreateAddress = async (addressData) => {
    try {
      setSavingAddress(true);
      const res = await userService.addAddress(addressData);
      if (res.success) {
        showToast('Address added successfully!');
        setIsNewAddressModalOpen(false);
        await fetchAddresses();
        if (res.data.address) {
          setSelectedAddress(res.data.address);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await userService.deleteAddress(addrId);
      if (res.success) {
        showToast('Address deleted');
        fetchAddresses();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    if (cart.items.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }

    try {
      setSubmittingOrder(true);

      const orderPayload = {
        items: cart.items.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
          price: item.price || (item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price),
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine: selectedAddress.addressLine,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'India',
        },
        paymentMethod,
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.data.order) {
        showToast('Order placed successfully! 🚀', 'success');
        clearCart();
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to place order', 'error');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 max-w-md mx-auto">
        <h2 className="text-lg font-black text-slate-900 mb-2">No Items in Cart</h2>
        <p className="text-xs text-slate-500 mb-6">Add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link to="/cart" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500">Confirm delivery address &amp; payment method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Address & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">1. Delivery Address</h2>
              </div>
              <Button
                size="sm"
                variant="light"
                icon={Plus}
                onClick={() => setIsNewAddressModalOpen(true)}
              >
                Add New Address
              </Button>
            </div>

            {loadingAddresses ? (
              <LoadingSpinner size="sm" text="Loading addresses..." />
            ) : addresses.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
                <p className="text-xs text-slate-500">You do not have any saved delivery addresses.</p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Plus}
                  onClick={() => setIsNewAddressModalOpen(true)}
                >
                  Add Your Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    isSelected={selectedAddress?._id === addr._id}
                    onSelect={() => setSelectedAddress(addr)}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-slate-500">Pay cash or UPI directly when your groceries arrive</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              {/* UPI Mock */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Instant UPI Payment</span>
                    <span className="text-xs text-slate-500">Google Pay, PhonePe, Paytm QR simulation</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              {/* Card Mock */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Credit / Debit Card</span>
                    <span className="text-xs text-slate-500">Visa, Mastercard, RuPay cards supported</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
              Basket Review ({cart.items.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h3>

            {/* Mini Items List */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
              {cart.items.map((item) => {
                const prod = item.product || {};
                const price = item.price || prod.discountPrice || prod.price || 0;
                return (
                  <div key={prod._id || prod} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[150px]">
                      {item.quantity}x {prod.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{(price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculation Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Total</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Total Payable</span>
                <span className="text-xl font-black text-emerald-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              variant="primary"
              loading={submittingOrder}
              onClick={handlePlaceOrder}
              className="w-full text-sm font-extrabold shadow-md shadow-emerald-600/30"
            >
              Place Order &bull; ₹{totalAmount.toFixed(0)}
            </Button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Protected Transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      <Modal
        isOpen={isNewAddressModalOpen}
        onClose={() => setIsNewAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <AddressForm
          onSubmit={handleCreateAddress}
          onCancel={() => setIsNewAddressModalOpen(false)}
          loading={savingAddress}
        />
      </Modal>
    </div>
  );
};

export default CheckoutPage;
