import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, ArrowRight, Package } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch orders & products in parallel
        const [ordersRes, productsRes] = await Promise.all([
          orderService.getAllOrders({ limit: 10 }),
          productService.getProducts({ limit: 50 }),
        ]);

        const orders = Array.isArray(ordersRes.orders)
          ? ordersRes.orders
          : Array.isArray(ordersRes.data?.orders)
          ? ordersRes.data.orders
          : Array.isArray(ordersRes.data)
          ? ordersRes.data
          : [];

        const products = Array.isArray(productsRes.products)
          ? productsRes.products
          : Array.isArray(productsRes.data?.products)
          ? productsRes.data.products
          : Array.isArray(productsRes.data)
          ? productsRes.data
          : [];

        const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pending = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;
        const lowStock = products.filter(p => p.stock < 10);

        setStats({
          totalRevenue: totalRev,
          totalOrders: ordersRes.total || ordersRes.pagination?.total || orders.length,
          pendingOrders: pending,
          totalProducts: productsRes.total || productsRes.pagination?.total || products.length,
          lowStockProducts: lowStock.length,
        });

        setRecentOrders(orders.slice(0, 5));
        setLowStockList(lowStock.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <LoadingSpinner size="lg" message="Loading Admin Dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Live snapshot of grocery orders, inventory, and revenue</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Active / Pending"
          value={stats.pendingOrders}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Tables Row: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest customer orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No orders placed yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-semibold">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 font-mono text-xs text-emerald-700 font-semibold">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 font-medium text-gray-900">
                        {order.user?.name || 'Customer'}
                      </td>
                      <td className="py-3.5 font-bold text-gray-900">
                        ₹{order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-3.5">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="py-3.5 text-right text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warnings (1 col) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
              <p className="text-xs text-gray-500 mt-0.5">Items needing restock</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Inventory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <div className="text-center py-8 text-emerald-600">
              <Package className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm font-medium">All items well-stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockList.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white border border-rose-100"
                    />
                    <div>
                      <p className="font-semibold text-xs text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-[11px] text-gray-500">₹{product.price?.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-100 rounded-lg">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
