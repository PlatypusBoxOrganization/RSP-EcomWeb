import api from './axiosConfig';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch wishlist' 
      };
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist', { productId });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add to wishlist' 
      };
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove from wishlist' 
      };
    }
  },

  // Move item from wishlist to cart
  moveToCart: async (productId) => {
    try {
      const response = await api.post(`/wishlist/${productId}/move-to-cart`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error moving to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to move to cart' 
      };
    }
  }
};

export default wishlistService;
