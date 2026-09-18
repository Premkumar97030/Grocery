import api from './api';

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    const payload = response.data?.data;
    const raw = payload?.categories || (Array.isArray(payload) ? payload : response.data?.categories || (Array.isArray(response.data) ? response.data : []));
    const categories = Array.isArray(raw) ? raw : [];
    return {
      success: true,
      data: {
        categories,
      },
      categories,
    };
  },

  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    const category = response.data?.data?.category || response.data?.category || response.data?.data || response.data;
    return {
      success: true,
      data: { category },
      category,
    };
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;

