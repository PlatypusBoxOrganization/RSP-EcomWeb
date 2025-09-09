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
    console.log('Order created successfully:', response.data);
    return response.data;
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
    throw error;
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

  const response = await axios.get(`${API_URL}/orders/myorders`, config);
  return response.data;
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
  if (!orderDate) return 'Calculating...';
  
  const deliveryDays = 3 + Math.floor(Math.random() * 5); // 3-7 days
  const date = new Date(orderDate);
  date.setDate(date.getDate() + deliveryDays);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
