import axios from 'axios';

// Log environment variables for debugging
console.log('Vite Environment:', import.meta.env);
console.log('API URL:', import.meta.env.VITE_API_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add the auth token to requests
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      // Redirect to login page with a message
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          data: { message: 'Network error. Please check your connection.' },
          status: 0,
          statusText: 'Network Error'
        }
      });
    }

    // Handle specific error statuses
    const status = error.response.status;
    let errorMessage = 'An unexpected error occurred';
    
    if (status === 400) {
      errorMessage = error.response.data?.message || 'Bad request. Please check your input.';
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    // Log detailed error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message,
        url: originalRequest.url,
        method: originalRequest.method,
        data: originalRequest.data
      });
    }
    
    return Promise.reject({
      ...error,
      message: errorMessage,
      response: {
        ...error.response,
        data: {
          ...error.response.data,
          message: errorMessage
        }
      }
    });
  }
);

export default api;
