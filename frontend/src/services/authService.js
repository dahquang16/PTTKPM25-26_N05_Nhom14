import api from './api';
export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    return api.get('/auth/profile');
  }
};


