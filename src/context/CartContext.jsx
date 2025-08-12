import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  const API_URL = 'http://localhost:5000/api/cart';

  // Fetch cart from API on mount and when user changes
  const fetchCart = useCallback(async () => {
    if (!user?.token) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      dispatch({ type: 'SET_CART', payload: { items: data.items } });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to load cart' 
      });
    }
  }, [user?.token]);
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product) => {
    if (!user?.token) {
      // Option: Redirect to login or show auth modal
      return { success: false, error: 'Please login to add items to cart' };
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data } = await axios.post(
        API_URL,
        { 
          productId: product._id || product.id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || ''
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      dispatch({ type: 'ADD_ITEM', payload: data.items });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add to cart';
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
      const { data } = await axios.put(
        `${API_URL}/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      dispatch({ type: 'UPDATE_ITEM', payload: data.item });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating cart:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update cart';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user?.token) return { success: false, error: 'Not authenticated' };
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      const errorMsg = error.response?.data?.message || 'Failed to remove item';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user?.token) return { success: false, error: 'Not authenticated' };
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMsg = error.response?.data?.message || 'Failed to clear cart';
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
