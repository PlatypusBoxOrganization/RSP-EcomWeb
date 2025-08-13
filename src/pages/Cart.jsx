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
import { getProfile } from '../services/api/profileService';

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
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

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

  // Fetch user's shipping address
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!user) {
        setIsLoadingAddress(false);
        return;
      }
      
      try {
        const response = await getProfile();
        const addresses = response.data?.addresses || [];
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        setShippingAddress(defaultAddress || null);
      } catch (err) {
        console.error('Error fetching shipping address:', err);
        toast.error('Failed to load shipping address');
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchUserAddress();
  }, [user]);

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
    const subtotal = localItems.reduce((sum, item) => {
      const itemPrice = item.product?.price || 0;
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    // Calculate total discount from product discounts
    const productDiscount = localItems.reduce((sum, item) => {
      if (item.product?.discount) {
        const discountAmount = (item.product.price * item.product.discount / 100) * item.quantity;
        return sum + parseFloat(discountAmount.toFixed(2));
      }
      return sum;
    }, 0);
    
    // Apply coupon discount if available
    let couponDiscount = 0;
    if (appliedCoupon) {
      const calculatedDiscount = (subtotal * appliedCoupon.discount) / 100;
      couponDiscount = Math.min(calculatedDiscount, appliedCoupon.maxDiscount);
    }
    
    const totalDiscount = productDiscount + couponDiscount;
    
    // Calculate delivery charge (free for orders above ₹500)
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    
    // Processing fee (fixed for now, could be made dynamic)
    const processingFee = 10;
    
    const total = Math.max(0, subtotal - totalDiscount + deliveryCharge + processingFee);
    
    return {
      subtotal,
      productDiscount,
      couponDiscount,
      totalDiscount,
      deliveryCharge,
      processingFee,
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
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Size: One Size</div>
                      <div>Qty: {item.quantity}</div>
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
        <div className="w-full lg:w-96 bg-white p-4 rounded-md shadow-sm h-fit space-y-4">
          {/* Shipping Address Section */}
          <div className="text-sm border-b pb-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Deliver To</span>
              {user ? (
                <Link 
                  to="/profile?tab=address" 
                  className="text-blue-500 text-xs hover:underline"
                >
                  {shippingAddress ? 'Change' : 'Add Address'}
                </Link>
              ) : (
                <Link 
                  to="/login?redirect=/cart" 
                  className="text-blue-500 text-xs hover:underline"
                >
                  Login to add address
                </Link>
              )}
            </div>
            
            {isLoadingAddress ? (
              <div className="animate-pulse space-y-2 mt-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : shippingAddress ? (
              <div className="mt-1">
                <p className="text-gray-700 font-medium">
                  {shippingAddress.name}
                  {shippingAddress.isDefault && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">
                  {shippingAddress.street}, {shippingAddress.city}
                </p>
                <p className="text-gray-600 text-sm">
                  {shippingAddress.state}, {shippingAddress.postalCode}
                </p>
                <p className="text-gray-600 text-sm">
                  Phone: {shippingAddress.phone || user?.phone || 'Not provided'}
                </p>
              </div>
            ) : user ? (
              <p className="text-gray-500 text-sm mt-1">
                No address saved. Please add a shipping address.
              </p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">
                Please login to manage your addresses.
              </p>
            )}
          </div>

          {/* Coupon Section */}
          <div className="text-sm">
            {showCouponInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isCouponLoading}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {isCouponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowCouponInput(true)}
                className="text-blue-500 hover:underline"
              >
                Have a coupon code? Apply here
              </button>
            )}
            {couponError && (
              <p className="text-red-500 text-xs mt-1">{couponError}</p>
            )}
            {appliedCoupon && (
              <div className="flex items-center justify-between mt-2 bg-green-50 p-2 rounded">
                <span className="text-green-700 text-sm">
                  Coupon Applied: {appliedCoupon.code} (-{appliedCoupon.discount}%)
                </span>
                <button 
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="text-sm space-y-2 pt-2">
            <div className="flex justify-between">
              <span>Price ({cartTotals.totalItems} {cartTotals.totalItems === 1 ? 'item' : 'items'})</span>
              <span>₹{cartTotals.subtotal.toFixed(2)}</span>
            </div>
            
            {cartTotals.productDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Product Discount</span>
                <span>- ₹{cartTotals.productDiscount.toFixed(2)}</span>
              </div>
            )}
            
            {appliedCoupon && cartTotals.couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>- ₹{cartTotals.couponDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{cartTotals.deliveryCharge === 0 ? 'FREE' : `₹${cartTotals.deliveryCharge.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Processing Fees</span>
              <span>₹{cartTotals.processingFee.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>₹{cartTotals.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </p>
            </div>
          </div>
          
          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut || localItems.length === 0 || !shippingAddress}
            className={`w-full bg-[#292355] text-white py-2 rounded-md hover:bg-[#482e5e] transition-colors ${
              (isCheckingOut || localItems.length === 0 || !shippingAddress) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isCheckingOut ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              `Proceed to Pay ₹${cartTotals.total.toFixed(2)}`
            )}
          </button>

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
