import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user data
      
      // Only redirect if we aren't already at /login to avoid the refresh loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  getAvailableSlots: (date) => api.get('/bookings/available-slots', { params: { date } }),
};

export const adminAPI = {
  setAvailability: (date, isAvailable) => 
    api.post('/admin/availability', null, { params: { date, isAvailable } }),
  getAvailability: (startDate, endDate) => 
    api.get('/admin/availability', { params: { startDate, endDate } }),
  getDailyBookings: (date) => 
    api.get('/admin/bookings', { params: { date } }),
};

export default api;