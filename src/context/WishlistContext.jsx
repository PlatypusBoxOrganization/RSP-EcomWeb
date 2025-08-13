import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import wishlistService from '../services/api/wishlistService';
import cartService from '../services/api/cartService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  
  // Helper to get auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        return;
      }
      
      const { success, data, error } = await wishlistService.getWishlist();
      if (success) {
        setWishlist(data.wishlist || data || []);
      } else {
        setError(error || 'Failed to load wishlist');
        if (error?.includes('token') || error?.includes('auth')) {
          // If token is invalid, log the user out
          logout();
        }
      }
    } catch (err) {
      console.error('Error in fetchWishlist:', err);
      setError(err.message || 'Failed to load wishlist');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthToken, logout]);

  // Initial fetch
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Toggle wishlist item
  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      return { 
        success: false, 
        error: 'Please login to manage wishlist',
        requiresAuth: true
      };
    }
    
    const token = getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: 'Authentication token not found',
        requiresAuth: true
      };
    }

    try {
      const productId = product._id || product.id;
      let result;

      if (isWishlisted(productId)) {
        result = await wishlistService.removeFromWishlist(productId);
      } else {
        result = await wishlistService.addToWishlist(productId);
      }

      if (result.success) {
        await fetchWishlist(); // Refresh wishlist after update
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setError('Failed to update wishlist');
      return { success: false, error: 'Failed to update wishlist' };
    }
  };

  // Check if product is in wishlist
  const isWishlisted = (id) => {
    return wishlist.some(item => 
      item._id === id || item.product?._id === id || item.product?.id === id
    );
  };

  // Move item from wishlist to cart
  // Can accept either a product object or a productId
  const moveToCart = async (productOrId) => {
    if (!isAuthenticated) {
      return { 
        success: false, 
        error: 'Please login to move items to cart',
        requiresAuth: true
      };
    }

    const token = getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: 'Authentication token not found',
        requiresAuth: true
      };
    }

    try {
      // Handle both product object and productId
      const productId = typeof productOrId === 'string' 
        ? productOrId 
        : (productOrId._id || productOrId.id || productOrId.product?._id);
      
      if (!productId) {
        throw new Error('Invalid product ID');
      }
      
      // First remove from wishlist
      const removeResult = await wishlistService.removeFromWishlist(productId);
      
      if (removeResult.success) {
        // Then add to cart
        // NOTE: Cart service call removed
        
        // Refresh wishlist to reflect changes
        await fetchWishlist();
        return { 
          success: true, 
          cartNeedsRefresh: true, // Flag to indicate cart needs refresh
          productId
        };
      } else {
        // If removing from wishlist fails, do not add to cart
        throw new Error(removeResult.error || 'Failed to remove from wishlist');
      }
    } catch (err) {
      console.error('Error moving to cart:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to move to cart' 
      };
    }
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        toggleWishlist, 
        isWishlisted, 
        moveToCart,
        loading,
        error,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
