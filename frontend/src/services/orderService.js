import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders(params = {}) {
    const response = await api.get('/orders/my-orders', { params });
    const payload = response.data?.data;
    const orders = payload?.orders || (Array.isArray(payload) ? payload : response.data?.orders || []);
    const pagination = payload?.pagination || {
      page: 1,
      totalPages: 1,
      total: orders.length,
    };
    return {
      data: orders,
      orders,
      pagination,
      total: pagination.total,
      pages: pagination.totalPages,
    };
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    const data = response.data?.data || response.data;
    return { data };
  },

  async getAllOrders(params = {}) {
    const response = await api.get('/orders', { params });
    const payload = response.data?.data;
    const orders = payload?.orders || (Array.isArray(payload) ? payload : response.data?.orders || []);
    const pagination = payload?.pagination || {
      page: 1,
      totalPages: 1,
      total: orders.length,
    };
    return {
      data: orders,
      orders,
      pagination,
      total: pagination.total,
      pages: pagination.totalPages,
    };
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { orderStatus: status });
    const data = response.data?.data || response.data;
    return { data };
  },

  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`);
    const data = response.data?.data || response.data;
    return { data };
  },
};

export default orderService;
