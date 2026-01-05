import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getMe: () => api.get('/auth/me'),
};

// Reels API
export const reelsAPI = {
  scan: (data) => api.post('/reels/scan', data),
  getAll: (params) => api.get('/reels', { params }),
  getOne: (id) => api.get(`/reels/${id}`),
  delete: (id) => api.delete(`/reels/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getGrowth: (params) => api.get('/analytics/growth', { params }),
  getViral: () => api.get('/analytics/viral'),
  compare: (data) => api.post('/analytics/compare', data),
  export: (params) => api.get('/analytics/export', { params }),
  getBrandMatch: (params) => api.get('/analytics/agency/brand-match', { params }),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getStats: () => api.get('/admin/stats'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;