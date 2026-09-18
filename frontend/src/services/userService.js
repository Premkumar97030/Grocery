import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async updatePassword(passwordData) {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  async addAddress(addressData) {
    const response = await api.post('/users/addresses', addressData);
    return response.data;
  },

  async deleteAddress(id) {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },
};

export default userService;
