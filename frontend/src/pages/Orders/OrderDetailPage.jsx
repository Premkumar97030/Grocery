import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../services/api';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  PackageCheck,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Ban,
  ShieldCheck,
} from 'lucide-react';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrderById(id);
      if (res.success && res.data.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id);
      if (res.success) {
        showToast('Order has been cancelled successfully', 'info');
        fetchOrder();
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading order tracking details..." />;
  if (error || !order) return <ErrorMessage message={error || 'Order not found'} onRetry={fetchOrder} />;

  const stages = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Packing' },
    { key: 'shipped', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStageIndex = (status) => {
    if (status === 'out_for_delivery') return 3;
    const idx = stages.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIdx = getStageIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Order #{order._id.toUpperCase()}
              </h1>
              <Badge variant={isCancelled ? 'danger' : order.orderStatus === 'delivered' ? 'success' : 'primary'}>
                {order.orderStatus?.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {canCancel && (
          <Button
            size="sm"
            variant="danger"
            icon={Ban}
            loading={cancelling}
            onClick={handleCancelOrder}
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Live Order Timeline Progress */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
          Delivery Status Tracker
        </h3>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-600" />
            <span>This order was cancelled. Restocked produce will be available for other shoppers.</span>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-between relative z-10">
              {stages.map((stg, i) => {
                const isPassed = i <= currentStageIdx;
                const isCurrent = i === currentStageIdx;

                return (
                  <div key={stg.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-bold max-w-[80px] sm:max-w-none ${
                        isPassed ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting progress track line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${(currentStageIdx / (stages.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid: Order Items & Delivery Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Itemized List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
            Items Ordered ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3.5">
                <img
                  src={getImageUrl(item.image, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80')}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <span className="text-xs text-slate-400 block">{item.unit || '1 unit'}</span>
                  <span className="text-xs text-slate-600 font-semibold mt-0.5 block">
                    ₹{item.price} &times; {item.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount</span>
              <span className="text-emerald-600 text-lg">₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Delivery & Payment Details */}
        <div className="lg:col-span-1 space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Shipping Destination
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-slate-500 font-medium pt-1">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Payment Info
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Method:</span>
              <span className="font-bold text-slate-900 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Payment Status:</span>
              <span
                className={`font-bold capitalize ${
                  order.paymentStatus === 'completed'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
