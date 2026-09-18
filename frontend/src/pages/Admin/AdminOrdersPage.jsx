import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { ShoppingBag, Eye, CheckCircle2, Truck, Clock, PackageCheck, XCircle } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders({
        status: statusFilter,
        page,
        limit: 10,
      });
      setOrders(res.data || []);
      setTotalPages(res.pages || 1);
      setTotalOrders(res.total || 0);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      // Update locally
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed': return <Badge variant="warning">Placed</Badge>;
      case 'processing': return <Badge variant="info">Processing</Badge>;
      case 'out_for_delivery': return <Badge variant="secondary">Out for Delivery</Badge>;
      case 'delivered': return <Badge variant="success">Delivered</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track, fulfill, and update live customer deliveries ({totalOrders} total)</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All', value: '' },
            { label: 'Placed', value: 'placed' },
            { label: 'Processing', value: 'processing' },
            { label: 'Out for Delivery', value: 'out_for_delivery' },
            { label: 'Delivered', value: 'delivered' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-emerald-100 hover:bg-emerald-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <LoadingSpinner size="lg" message="Loading Orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50/50 border-b border-emerald-100 text-gray-600 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Quick Status Update</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.user?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2)}
                      <p className="text-[10px] text-gray-400 font-normal uppercase">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={statusUpdating}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?._id?.slice(-6).toUpperCase()}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <div>
                <p className="text-xs text-gray-500">Current Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">${selectedOrder.totalAmount?.toFixed(2)}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              <h4 className="font-bold text-gray-900 mb-1">Delivery Address</h4>
              <p className="text-gray-700">{selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
              </p>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Ordered Items</h4>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{item.name}</p>
                        <p className="text-[11px] text-gray-400">{item.quantity} x ${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
