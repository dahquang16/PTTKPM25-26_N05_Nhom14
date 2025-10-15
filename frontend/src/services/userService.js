import api from './api';

export const userService = {
  getUsers: (params = {}) => {
    return api.get('/users', { params });
  },
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },
  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  },
  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  }
};
