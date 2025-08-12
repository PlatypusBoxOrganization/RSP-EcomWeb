import api from './axiosConfig';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      // Handle 400 Bad Request (duplicate user)
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'User already exists';
        return { success: false, error: errorMessage };
      }
      // For other errors, throw as before
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
