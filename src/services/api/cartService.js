import api from './axiosConfig';

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart', { 
      productId, 
      quantity
    });
    return {
      ...response.data,
      cart: response.data.cart || { items: [] }
    };
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to add item to cart';
  }
};

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return {
      ...response.data,
      cart: response.data.cart || { items: [] }
    };
  } catch (error) {
    console.error('Error fetching cart:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to fetch cart';
  }
};

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to update cart item';
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to remove item from cart';
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to clear cart';
  }
};

export default {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
