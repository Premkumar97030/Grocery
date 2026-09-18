import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  async updateQuantity(productId, quantity) {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  async removeFromCart(productId) {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  },
};

export default cartService;
