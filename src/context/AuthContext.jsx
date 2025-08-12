import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/api/authService';
import { isTokenExpired } from '../utils/tokenService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  const loadUser = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (token && !isTokenExpired(token)) {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } else {
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register a new user
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.data.user);
        return { success: true, data: result.data };
      } else {
        // Handle the error case from authService
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      // This will catch any unexpected errors
      console.error('Unexpected error during registration:', error);
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setError(null);
    // Don't set loading state here - let the component handle it
    try {
      const response = await authService.login(credentials);
      // Update user state
      setUser(response.user);
      // Don't show toast here to prevent flash before redirect
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      // Don't show toast here - let the component handle it
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
    // Clear any pending redirects or auth state
    window.history.replaceState(null, '', '/');
    return true;
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    loadUser,
    setUser, // Expose setUser to update user context
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
