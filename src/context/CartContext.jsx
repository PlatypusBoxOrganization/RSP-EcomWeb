import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/api/cartService';
import api from '../services/api/axiosConfig';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_CART':
      return { 
        ...state, 
        items: action.payload.items || [],
        loading: false,
        error: null 
      };
      
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null
      };
      
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload._id ? action.payload : item
        ),
        loading: false,
        error: null
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        loading: false,
        error: null
      };
      
    case 'CLEAR_CART':
      return { 
        ...state, 
        items: [],
        loading: false,
        error: null 
      };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    loading: false, 
    error: null 
  });
  
  const { user } = useAuth();

  // Fetch cart from API on mount and when user changes
  const fetchCart = useCallback(async () => {
    // Get token directly from localStorage to ensure we have the latest value
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await cartService.getCart();
      
      if (result.success && result.cart) {
        // Ensure we have a valid items array
        const items = Array.isArray(result.cart.items) ? result.cart.items : [];
        
        // Ensure each cart item has the full product details
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            try {
              // If product details are already fully populated, use them
              if (item.product && item.product.name) {
                return item;
              }
              
              // Get the product ID from either productId or nested product._id
              const productId = item.productId || (item.product && item.product._id);
              if (!productId) {
                console.warn('No product ID found for cart item:', item);
                return item;
              }
              
              // Fetch the product details
              const response = await api.get(`/products/${productId}`);
              if (response.data) {
                return {
                  ...item,
                  product: response.data.product || response.data // Handle both formats
                };
              }
              return item;
            } catch (error) {
              console.error('Error fetching product details for item:', item, error);
              return item; // Return the item as-is if there's an error
            }
          })
        );
        
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: itemsWithProducts,
            totalPrice: result.cart.totalPrice || 0,
            totalItems: result.cart.totalItems || 0
          } 
        });
      } else {
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: [],
            totalPrice: 0,
            totalItems: 0
          } 
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error.message);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to load cart' 
      });
    }
  }, [user?.token]);
  
  // Watch for auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    // Check token directly from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return { 
        success: false, 
        error: 'Please login to add items to cart',
        requiresAuth: true
      };
    }
    
    if (quantity < 1) {
      return { success: false, error: 'Quantity must be at least 1' };
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await cartService.addToCart(product._id || product.id, quantity);
      
      if (result.success) {
        // Always refresh the entire cart from the server to ensure consistency
        await fetchCart();
        return { success: true, data: result.cart };
      } else {
        throw new Error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      const errorMsg = error.message || 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user?.token) return { success: false, error: 'Not authenticated' };
    if (quantity < 1) return { success: false, error: 'Invalid quantity' };
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { cart } = await cartService.updateCartItem(productId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: cart.items.find(item => item.product._id === productId) });
      return { success: true, data: cart };
    } catch (error) {
      console.error('Error updating cart:', error);
      const errorMsg = error.message || 'Failed to update cart';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    // Check token directly from localStorage for consistency
    const token = localStorage.getItem('token');
    if (!token) {
      return { 
        success: false, 
        error: 'Please login to modify your cart',
        requiresAuth: true 
      };
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await cartService.removeFromCart(itemId);
      
      if (result.success) {
        // Refresh the entire cart to ensure consistency with the server
        await fetchCart();
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error.message);
      const errorMsg = error.message || 'Failed to remove item';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { 
        success: false, 
        error: errorMsg,
        requiresAuth: error.response?.status === 401
      };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user?.token) return { success: false, error: 'Not authenticated' };
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMsg = error.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Calculate cart total
  const cartTotal = state.items.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  // Calculate total items
  const itemCount = state.items.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        cartTotal,
        itemCount,
        loading: state.loading,
        error: state.error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
