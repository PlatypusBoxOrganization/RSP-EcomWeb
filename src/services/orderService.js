import axios from 'axios';
import authService from './api/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Test order creation endpoint
export const testOrderEndpoint = async () => {
  try {
    const testData = { message: 'Testing order endpoint' };
    console.log('Testing order endpoint with data:', testData);
    const response = await axios.post(`${API_URL}/test/test-order`, testData);
    console.log('Test order endpoint response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing order endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  try {
    console.log('Creating order with data:', orderData);
    const response = await axios.post(`${API_URL}/orders`, orderData, config);
    
    // Ensure the response has the expected structure
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    // If the response is already in the correct format, return it
    if (response.data.order || response.data._id) {
      console.log('Order created successfully:', response.data);
      return response.data;
    }
    
    // If the response is the order directly, wrap it in the expected format
    const orderResponse = {
      success: true,
      message: 'Order created successfully',
      order: response.data,
      _id: response.data._id || null
    };
    
    console.log('Order created successfully:', orderResponse);
    return orderResponse;
    
  } catch (error) {
    console.error('Error creating order:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    // Create a more descriptive error message
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to create order. Please try again.';
    
    const orderError = new Error(errorMessage);
    orderError.response = error.response;
    throw orderError;
  }
};

// Get order by ID
export const getOrderDetails = async (orderId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  const response = await axios.get(`${API_URL}/orders/${orderId}`, config);
  return response.data;
};

// Get logged in user orders
export const getMyOrders = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  try {
    console.log('Fetching orders from:', `${API_URL}/orders/myorders`);
    const response = await axios.get(`${API_URL}/orders/myorders`, config);
    console.log('Orders API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error in getMyOrders:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, status) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/orders/${orderId}/status`,
    { status },
    config
  );
  return response.data;
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  const response = await axios.get(`${API_URL}/orders`, config);
  return response.data;
};

export const getEstimatedDeliveryDate = (orderDate) => {
  const date = new Date(orderDate);
  // Add 7 days for standard delivery
  date.setDate(date.getDate() + 7);
  
  // Return formatted date (e.g., "May 15, 2023")
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Cancel an order
export const cancelOrder = async (orderId, reason = '') => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/orders/${orderId}/cancel`,
      { reason },
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
