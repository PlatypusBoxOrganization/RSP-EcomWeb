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

// Get user orders
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get('/profile/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

// Get single order
export const getOrder = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/profile/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error.response?.data || { message: 'Failed to fetch order' };
  }
};
