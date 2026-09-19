import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Badge from '../../components/common/Badge';
import { PackageCheck, ArrowRight, Clock, ShoppingBag } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'out_for_delivery':
        return 'info';
      case 'processing':
      case 'confirmed':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').toUpperCase() || 'PENDING';
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading your orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs my-8">
        <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">No orders placed yet</h2>
        <p className="text-xs text-slate-500 mb-6">
          When you order groceries, you'll be able to track delivery status right here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Fresh Groceries</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Order History ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review previous grocery deliveries and live status
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-md transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 text-sm">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                    {formatStatus(order.orderStatus)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Items summary */}
            <div className="flex flex-wrap items-center gap-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs"
                >
                  <img
                    src={getImageUrl(item.image, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80')}
                    alt={item.name}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span className="text-slate-400 font-bold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
