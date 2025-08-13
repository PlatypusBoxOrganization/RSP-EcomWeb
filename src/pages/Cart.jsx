import React, { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSpinner, 
  FaTrash, 
  FaArrowLeft, 
  FaShoppingCart, 
  FaShoppingBag, 
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaPlus,
  FaMinus,
  FaTicketAlt,
  FaCreditCard,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { 
    items, 
    cartTotal, 
    itemCount,
    loading: isLoading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    refreshCart
  } = useCart();
  
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [localItems, setLocalItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Calculate delivery date (3 days from now)
  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days delivery time
    return date;
  }, []);

  // Check for cart messages in location state
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Sync local items with cart context and handle errors
  useEffect(() => {
    if (items) {
      setLocalItems(items);
    }
    
    if (error) {
      toast.error(error);
    }
  }, [items, error]);

  // Handle quantity changes with debounce
  const debouncedUpdateQuantity = useMemo(
    () =>
      debounce(async (productId, newQuantity, updateFn) => {
        if (newQuantity < 1) return;
        
        try {
          const result = await updateFn(productId, newQuantity);
          if (!result.success) {
            toast.error(result.error || 'Failed to update quantity');
            refreshCart();
          } else {
            toast.success('Cart updated');
          }
        } catch (err) {
          console.error('Error updating quantity:', err);
          toast.error('Failed to update quantity. Please try again.');
          refreshCart();
        }
      }, 300),
    [refreshCart]
  );

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      if (newQuantity < 1) return;
      
      // Optimistic UI update
      setLocalItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Debounced API call
      debouncedUpdateQuantity(productId, newQuantity, updateQuantity);
      
      // Update loading state
      setIsUpdating(prev => ({ ...prev, [productId]: true }));
      
      // Clear loading state after debounce
      const timer = setTimeout(() => {
        setIsUpdating(prev => ({ ...prev, [productId]: false }));
      }, 350);
      
      return () => clearTimeout(timer);
    },
    [debouncedUpdateQuantity, updateQuantity]
  );

  // Handle remove item
  const handleRemoveItem = useCallback(async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const result = await removeFromCart(productId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove item');
      }
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error(err.message || 'Failed to remove item');
      refreshCart();
    }
  }, [removeFromCart]);

  // Handle moving item to wishlist
  const handleMoveToWishlist = async (item) => {
    if (!user) {
      toast.error('Please login to use your wishlist');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    const product = item.product || item;
    const productId = product?._id || item.productId;
    
    if (!productId) {
      console.error('Invalid product data:', item);
      toast.error('Invalid product data');
      return;
    }

    setIsUpdating(prev => ({ ...prev, [item._id || item.id]: true }));

    try {
      // First check if the product is already in wishlist
      const isInWishlist = isWishlisted(productId);
      
      if (!isInWishlist) {
        // Add to wishlist if not already there
        const wishlistResult = await toggleWishlist(product);
        
        if (!wishlistResult.success) {
          if (wishlistResult.requiresAuth) {
            navigate('/login', { state: { from: location.pathname } });
            return;
          }
          throw new Error(wishlistResult.error || 'Failed to add to wishlist');
        }
      }
      
      // Then remove from cart
      const cartResult = await removeFromCart(item._id || item.id);
      
      if (cartResult.success) {
        toast.success('Moved to wishlist');
        // Refresh both cart and wishlist to ensure consistency
        await refreshCart();
      } else {
        throw new Error(cartResult.error || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      toast.error(error.message || 'Failed to move to wishlist');
    } finally {
      setIsUpdating(prev => ({ ...prev, [item._id || item.id]: false }));
    }
  };

  // Handle clear cart
  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const result = await clearCart();
      if (!result.success) {
        throw new Error(result.error || 'Failed to clear cart');
      }
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error(err.message || 'Failed to clear cart');
      refreshCart();
    }
  }, [clearCart, refreshCart]);

  // Handle coupon application
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setIsCouponLoading(true);
    setCouponError('');
    
    try {
      // TODO: Implement actual coupon validation API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation
      if (couponCode.toUpperCase() === 'WELCOME10') {
        setAppliedCoupon({
          code: 'WELCOME10',
          discount: 10, // 10% off
          maxDiscount: 500 // Max ₹500 off
        });
        toast.success('Coupon applied successfully!');
      } else {
        throw new Error('Invalid or expired coupon code');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setCouponError(err.message || 'Failed to apply coupon');
      toast.error(err.message || 'Failed to apply coupon');
    } finally {
      setIsCouponLoading(false);
    }
  }, [couponCode]);
  
  // Handle remove coupon
  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  }, []);
  
  // Handle checkout
  const handleCheckout = useCallback(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    setIsCheckingOut(true);
    try {
      // TODO: Add any pre-checkout validation
      navigate('/checkout');
    } catch (err) {
      console.error('Error during checkout:', err);
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsCheckingOut(false);
    }
  }, [user, navigate]);
  
  // Calculate cart totals
  const cartTotals = useMemo(() => {
    const subtotal = localItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply coupon discount if available
    let discount = 0;
    if (appliedCoupon) {
      const calculatedDiscount = (subtotal * appliedCoupon.discount) / 100;
      discount = Math.min(calculatedDiscount, appliedCoupon.maxDiscount);
    }
    
    // Calculate delivery charge (free for orders above ₹500)
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    
    const total = Math.max(0, subtotal - discount + deliveryCharge);
    
    return {
      subtotal,
      discount,
      deliveryCharge,
      total,
      totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [localItems, appliedCoupon]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [user, navigate]);

  // Use cartTotals for all calculations to avoid duplication

  return (
    <div className=" bg-gray-50 p-10 px-2 lg:px-4 md:px-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Cart</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {isLoading && localItems.length === 0 ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
                <p>Loading your cart...</p>
              </div>
            </div>
          ) : error ? (
            <div className="container mx-auto p-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-4 text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : !Array.isArray(localItems) ? (
            <div className="container mx-auto p-4 text-center">
              <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">Cart Data Loading</h1>
              <p className="text-gray-600 mb-4">Please wait while we load your cart items...</p>
              <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
            </div>
          ) : localItems.length === 0 ? (
            <div className="container mx-auto p-4 text-center">
              <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
              <Link
                to="/shop"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          ) : (
            localItems.map((item, index) => (
              <div
                key={`cart-item-${item.id || item._id || index}`}
                className="bg-white p-4 rounded-md shadow-sm flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  {!item.product ? (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <FaSpinner className="animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={item.product.images?.[0] || '/Images/placeholder.webp'}
                      alt={item.product.name || 'Product image'}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/Images/placeholder.webp';
                      }}
                    />
                  )}
                  <div>
                    {!item.product ? (
                      <div className="space-y-2">
                        <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-md">{item.product.name || 'Unnamed Product'}</h3>
                        <p className="text-sm text-gray-600">₹ {item.product.price || '0.00'}</p>
                        {item.product.mrp > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            MRP: ₹ {item.product.mrp}
                          </p>
                        )}
                        {item.product.discount > 0 && (
                          <p className="text-sm text-green-600">
                            {item.product.discount}% off
                          </p>
                        )}
                      </>
                    )}
                    <div className="mt-2 flex gap-2">
                      <select className="border px-2 py-1 text-sm rounded">
                        <option key="one-size" value="one-size">One Size</option>
                      </select>
                      <select
                        className="border px-2 py-1 text-sm rounded"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={`qty-${num}`} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Delivery by <strong>{deliveryDate.toDateString()}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMoveToWishlist(item);
                    }}
                    className="text-sm text-pink-600 hover:underline flex items-center gap-1"
                    disabled={isUpdating[item._id || item.id]}
                  >
                    {isUpdating[item._id || item.id] ? (
                      <>
                        <FaSpinner className="animate-spin h-3 w-3" /> Moving...
                      </>
                    ) : (
                      <>
                        <FaHeart className="inline mr-1" /> Save to Wishlist
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id || item.id)}
                    className="text-sm text-gray-600 hover:text-red-500 disabled:opacity-50"
                    disabled={isUpdating[item._id || item.id]}
                  >
                    {isUpdating[item._id || item.id] ? (
                      <FaSpinner className="animate-spin h-4 w-4 inline" />
                    ) : (
                      'Remove'
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96 bg-white p-4  rounded-md shadow-sm h-fit space-y-4 ">
          <div className="text-sm border-b pb-2">
            <div className="flex justify-between">
              <span>Deliver To</span>
              <button className="text-blue-500 text-xs">Change</button>
            </div>
            <p className="text-gray-700 font-medium">Delhi, 110001</p>
            <button className="text-xs text-pink-600">Login to select/ add address</button>
          </div>

          <div className="text-sm">
            <button className="text-blue-500">Check for Coupons</button>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Cart Total</span>
              <span>₹ {cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fees</span>
              <span>₹ 10.00</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {cartTotal + 10}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Product Discount(s)</span>
              <span>- ₹ 2000.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹ {cartTotal + 10 - 2000}</span>
            </div>
          </div>
          <Link to="/checkout">
          <button className="bg-[#292355] text-white w-full py-2 rounded-md hover:bg-[#482e5e]">
            Checkout
          </button>
          </Link>

          <div className="text-xs text-gray-500 mt-5">
            <p key="secure-payments">✅ Safe and secure payments</p>
            <p key="easy-returns">🔁 Easy returns</p>
            <p key="authentic-products">📦 100% Authentic products</p>
          </div>

          <div className="text-xs text-gray-600 text-center">
            Need Help? <button className="text-blue-500"><Link to="/contact" className="hover:text-blue-400">
              Contact Us
            </Link></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
