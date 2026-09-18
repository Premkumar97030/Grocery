import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    const payload = response.data?.data;
    const rawProducts = payload?.products || (Array.isArray(payload) ? payload : response.data?.products || (Array.isArray(response.data) ? response.data : []));
    const products = Array.isArray(rawProducts) ? rawProducts : [];
    const pagination = payload?.pagination || response.data?.pagination || {
      page: Number(params.page) || 1,
      totalPages: 1,
      total: products.length,
      limit: Number(params.limit) || 12,
    };
    return {
      success: true,
      data: {
        products,
        pagination,
      },
      products,
      pagination,
      total: pagination.total,
      pages: pagination.totalPages,
      page: pagination.page,
    };
  },

  async getFeaturedProducts() {
    const response = await api.get('/products', { params: { isFeatured: true, limit: 8 } });
    const payload = response.data?.data;
    const rawProducts = payload?.products || (Array.isArray(payload) ? payload : response.data?.products || (Array.isArray(response.data) ? response.data : []));
    const products = Array.isArray(rawProducts) ? rawProducts : [];
    return {
      success: true,
      data: {
        products,
      },
      products,
    };
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    const product = response.data?.data?.product || response.data?.product || response.data?.data || response.data;
    return {
      success: true,
      data: { product },
      product,
    };
  },

  async createProduct(productData) {
    const isFormData = productData instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
    const response = await api.post('/products', productData, { headers });
    return response.data;
  },

  async updateProduct(id, productData) {
    const isFormData = productData instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
    const response = await api.put(`/products/${id}`, productData, { headers });
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;

