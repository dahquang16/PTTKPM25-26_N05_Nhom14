import api from './api';

export const bookService = {
  getBooks: (params = {}) => {
    return api.get('/books', { params });
  },
  getBookById: (id) => {
    return api.get(`/books/${id}`);
  },
  getPopularBooks: (page = 0, size = 10) => {
    return api.get('/books/popular', { params: { page, size } });
  },
  getAvailableBooks: (page = 0, size = 10) => {
    return api.get('/books/available', { params: { page, size } });
  },
  getCategories: () => {
    return api.get('/books/categories');
  },
  createBook: (bookData) => {
    return api.post('/books', bookData);
  },
  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
  },
  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};


