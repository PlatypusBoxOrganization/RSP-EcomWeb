import axios from 'axios';
import axiosInstance from './axiosConfig';

// Get user profile
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/profile/update', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Add new address
export const addAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/profile/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error.response?.data || { message: 'Failed to add address' };
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axiosInstance.put(
      `/profile/addresses/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error.response?.data || { message: 'Failed to update address' };
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await axiosInstance.delete(`/profile/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Return a consistent error response
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete address. Please try again.'
    };
  }
};

// Get user orders with pagination and filtering
export const getOrders = async (page = 1, limit = 10, status = '') => {
  try {
    const response = await axiosInstance.get('/orders/myorders', {
      params: { page, limit, status }
    });
    
    // Ensure we always return a consistent structure
    const data = response.data || [];
    return {
      orders: Array.isArray(data) ? data : [data],
      page: page,
      limit: limit,
      total: Array.isArray(data) ? data.length : 1,
      totalPages: Math.ceil((Array.isArray(data) ? data.length : 1) / limit) || 1
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Return an empty structure with error information
    return {
      orders: [],
      page: 1,
      limit: limit,
      total: 0,
      totalPages: 1,
      error: error.response?.data?.message || 'Failed to fetch orders'
    };
  }
};

// Get single order with detailed information
export const getOrder = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error.response?.data || { message: 'Failed to fetch order' };
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, {
      status: 'cancelled'
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error.response?.data || { message: 'Failed to cancel order' };
  }
};

// Request order return
// export const requestReturn = async (orderId, reason, comment = '') => {
//   try {
//     const response = await axiosInstance.post(`/orders/${orderId}/return`, {
//       reason,
//       comment
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error requesting return:', error);
//     throw error.response?.data || { message: 'Failed to request return' };
//   }
// };

// Track order
// export const trackOrder = async (orderId) => {
//   try {
//     const response = await axiosInstance.get(`/orders/${orderId}/track`);
//     return response.data;
//   } catch (error) {
//     console.error('Error tracking order:', error);
//     throw error.response?.data || { message: 'Failed to track order' };
//   }
// };
