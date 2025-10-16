import api from './api';

export const orderService = {
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },
  getOrdersByUser: (userId, page = 0, size = 10) => {
    return api.get(`/orders/user/${userId}`, { params: { page, size } });
  },
  getAllOrders: (params = {}) => {
    return api.get('/orders', { params });
  },
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },
  updateOrderStatus: (id, status) => {
    return api.put(`/orders/${id}/status`, { status });
  }
};


