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
import axios from 'axios';
import authService from '../services/api/authService';
import { 
  loadRazorpay, 
  createRazorpayOrder, 
  verifyPayment 
} from '../services/paymentService';
import { validateCartItems } from '../services/api/cartService';
import { createOrder, testOrderEndpoint } from '../services/orderService';

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

  // Use the existing cartTotals calculation from below
  
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [localItems, setLocalItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
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

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    // Default values for empty cart
    if (!localItems || localItems.length === 0) {
      return {
        subtotal: 0,
        productDiscount: 0,
        couponDiscount: 0,
        deliveryCharge: 0,
        processingFee: 0,
        total: 0,
        totalItems: 0
      };
    }

    try {
      // Convert all values to numbers to ensure proper calculations
      const subtotal = parseFloat(localItems.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        const itemPrice = parseFloat(item.product.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (itemPrice * quantity);
      }, 0).toFixed(2)) || 0;
      
      // Calculate total discount from product discounts
      const productDiscount = parseFloat(localItems.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        const discount = parseFloat(item.product.discount) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (discount * quantity);
      }, 0).toFixed(2)) || 0;
      
      // Calculate coupon discount if applied
      let couponDiscount = 0;
      if (appliedCoupon && appliedCoupon.discountValue) {
        if (appliedCoupon.discountType === 'percentage') {
          const discountValue = parseFloat(appliedCoupon.discountValue) || 0;
          couponDiscount = parseFloat(((subtotal * discountValue) / 100).toFixed(2)) || 0;
        } else {
          couponDiscount = parseFloat(parseFloat(appliedCoupon.discountValue).toFixed(2)) || 0;
        }
      }
      
      // Calculate total after discounts (ensure it doesn't go below 0)
      const totalAfterDiscounts = Math.max(0, subtotal - productDiscount - couponDiscount);
      
      // Calculate delivery charge (free over ₹499)
      const deliveryCharge = parseFloat((totalAfterDiscounts >= 499 ? 0 : 40).toFixed(2)) || 0;
      
      // Calculate processing fee (2% of order value, minimum ₹5)
      const processingFee = Math.max(5, parseFloat((totalAfterDiscounts * 0.02).toFixed(2)) || 0);
      
      // Calculate final total (ensure it's a valid number)
      const total = parseFloat((totalAfterDiscounts + deliveryCharge + processingFee).toFixed(2)) || 0;
      
      return {
        subtotal: isNaN(subtotal) ? 0 : subtotal,
        productDiscount: isNaN(productDiscount) ? 0 : productDiscount,
        couponDiscount: isNaN(couponDiscount) ? 0 : couponDiscount,
        deliveryCharge: isNaN(deliveryCharge) ? 0 : deliveryCharge,
        processingFee: isNaN(processingFee) ? 0 : processingFee,
        total: isNaN(total) ? 0 : total,
        totalItems: localItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
      };
    } catch (error) {
      console.error('Error calculating cart totals:', error);
      // Return default values in case of error
      return {
        subtotal: 0,
        productDiscount: 0,
        couponDiscount: 0,
        deliveryCharge: 0,
        processingFee: 0,
        total: 0,
        totalItems: 0
      };
    }
  }, [localItems, appliedCoupon]);

  // Handle checkout with Razorpay
  const validateCartBeforeCheckout = useCallback(async () => {
    try {
      const validation = await validateCartItems();
      if (!validation.valid) {
        // Remove invalid items from cart
        if (validation.invalidItems?.length > 0) {
          // Show error message about removed items
          const errorMsg = `Some items in your cart are no longer available. We've removed them from your cart.`;
          setPaymentError(errorMsg);
          
          // Remove invalid items using the removeFromCart function
          await Promise.all(
            validation.invalidItems.map(item => 
              removeFromCart(item.productId)
            )
          );
          
          throw new Error(errorMsg);
        }
        throw new Error('Your cart contains invalid items. Please refresh your cart and try again.');
      }
      return true;
    } catch (error) {
      console.error('Cart validation error:', error);
      setPaymentError(error.message);
      setIsProcessingPayment(false);
      return false;
    }
  }, [removeFromCart, setPaymentError, setIsProcessingPayment]);

  const handleCheckout = useCallback(async () => {
    // Validate user is logged in
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Validate cart is not empty
    if (itemCount === 0) {
      setPaymentError('Your cart is empty');
      return;
    }

    try {
      // First validate cart items
      const isValid = await validateCartBeforeCheckout();
      if (!isValid) return;
      
      setIsProcessingPayment(true);
      
      // 1. Load Razorpay script first
      console.log('Loading Razorpay script...');
      try {
        await loadRazorpay();
      } catch (error) {
        console.error('Error loading Razorpay:', error);
        throw new Error(`Payment gateway error: ${error.message}`);
      }

      if (typeof window.Razorpay !== 'function') {
        throw new Error('Payment gateway not available. Please refresh and try again.');
      }

      // 2. Create order on backend with amount in paise
      const amountInPaise = Math.round(cartTotals.total * 100);
      console.log('Processing payment for amount:', cartTotals.total, 'INR (', amountInPaise, 'paise )');
      
      console.log('Creating Razorpay order...');
      const orderResponse = await createRazorpayOrder(amountInPaise);
      console.log('Order created:', orderResponse);

      if (!orderResponse?.order?.id) {
        throw new Error('Failed to create payment order. Please try again.');
      }


      // Use order details from backend response
      const { order } = orderResponse;
      
      // Validate order data
      if (!order.id || !order.amount) {
        console.error('Invalid order data from backend:', order);
        throw new Error('Invalid order data received from server');
      }
      
      // Log order details for debugging
      console.log('Preparing Razorpay options with order:', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        receipt: order.receipt
      });

      // Prepare Razorpay options with all required fields
      const options = {
        key: 'rzp_test_RJgQjyW5DIRbPa',
        amount: order.amount.toString(), // Convert to string as required by Razorpay
        currency: 'INR',
        name: 'ElectroHive',
        description: `Order #${order.receipt || 'WEB'}`,
        order_id: order.id, // This is the Razorpay order ID
        handler: async function(response) {
          try {
            console.log('Razorpay payment response:', response);
            
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response from Razorpay');
            }
            
            // First verify the payment with Razorpay
            console.log('Verifying payment with Razorpay...');
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: 'INR'
            };
            
            // Verify payment with our backend
            console.log('Sending verification request to server...');
            const verification = await verifyPayment(verificationData);
            console.log('Payment verification response:', verification);
            
            if (!verification.success) {
              throw new Error(verification.error || 'Payment verification failed');
            }
            
            console.log('Payment verified successfully with Razorpay');
            
            // Validate local items
            if (!localItems || !Array.isArray(localItems) || localItems.length === 0) {
              throw new Error('No items found in cart');
            }
            
            // Process order items with validation
            const orderItems = localItems.map(item => {
              const productId = item.product?._id || item._id;
              const name = item.product?.name || item.name || 'Unknown Product';
              const price = Number(item.product?.price || item.price || 0);
              const quantity = Number(item.quantity) || 1;
              
              if (!productId) {
                throw new Error(`Invalid product ID for item: ${name}`);
              }
              
              if (price <= 0) {
                throw new Error(`Invalid price for item: ${name}`);
              }
              
              if (quantity <= 0) {
                throw new Error(`Invalid quantity for item: ${name}`);
              }
              
              return {
                product: productId,
                name,
                image: item.product?.images?.[0] || item.images?.[0] || '/images/default-product.png',
                price,
                quantity,
                total: price * quantity
              };
            });
            
            console.log('Processed order items:', orderItems);
            
            // Validate shipping address
            if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
                !shippingAddress.postalCode || !shippingAddress.country) {
              throw new Error('Please provide complete shipping address');
            }
            
            const mappedShippingAddress = {
              address: shippingAddress.street.trim(),
              city: shippingAddress.city.trim(),
              postalCode: shippingAddress.postalCode.trim(),
              country: shippingAddress.country.trim()
            };
            
            // Calculate totals
            const itemsPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping for orders over 1000
            const taxPrice = Number((itemsPrice * 0.02).toFixed(2)); // 2% tax
            const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
            
            // Prepare order data
            const orderData = {
              user: user?._id || null,
              orderItems: orderItems.map(({ product, quantity }) => ({
                product,
                quantity
              })),
              shippingAddress: mappedShippingAddress,
              paymentMethod: 'Razorpay',
              itemsPrice,
              taxPrice,
              shippingPrice,
              totalPrice,
              isPaid: true,
              paidAt: new Date().toISOString(),
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              status: 'processing'
            };
            
            console.log('Final order data being sent to server:', JSON.stringify(orderData, null, 2));
            
            try {
              // Create the order in our database
              const orderResponse = await createOrder(orderData);
              console.log('Order creation response:', orderResponse);
              
              // Extract order ID from the response
              const orderId = orderResponse?._id || 
                            orderResponse?.order?._id || 
                            (orderResponse.data && (orderResponse.data._id || orderResponse.data.orderId));
              
              if (!orderId) {
                console.error('Invalid order creation response:', orderResponse);
                throw new Error('Failed to create order. Please contact support with payment ID: ' + response.razorpay_payment_id);
              }
              
              console.log('Order created successfully with ID:', orderId);
              
              // Clear the cart after successful order
              try {
                await clearCart();
                console.log('Cart cleared successfully');
              } catch (cartError) {
                console.error('Error clearing cart after order:', cartError);
                // Don't fail the order if cart clearing fails
              }
              
              // Show success message
              toast.success('Order placed successfully!');
              
              // Redirect to order success page with the correct order ID
              navigate(`/order/${orderId}`, { 
                state: { 
                  orderId,
                  isNewOrder: true 
                },
                replace: true 
              });
              
              return; // Exit the function after successful order creation
              
            } catch (orderError) {
              console.error('Order creation error:', {
                message: orderError.message,
                response: orderError.response?.data,
                stack: orderError.stack
              });
              
              // If order creation fails but payment was successful, we need to handle this carefully
              // In a production environment, you would want to implement a retry mechanism or manual review
              throw new Error(`Order creation failed: ${orderError.message}. Your payment was successful. Please contact support with payment ID: ${response.razorpay_payment_id}`);
            }
            
          } catch (error) {
            console.error('Payment processing error:', {
              message: error.message,
              response: error.response?.data,
              stack: error.stack
            });
            
            setIsProcessingPayment(false);
            
            // Handle specific error cases
            let errorMessage = error.message || 'Error processing payment';
            
            // Handle specific error cases
            if (error.response?.data?.error?.code === 'OUT_OF_STOCK') {
              // Refresh cart to get latest stock information
              await refreshCart();
              errorMessage = 'Some items in your cart are out of stock. Please review your cart and try again.';
            } else if (error.response?.data?.error?.code === 'INVALID_ITEMS') {
              // Refresh cart to get latest product information
              await refreshCart();
              errorMessage = 'Some items in your cart are no longer available. Your cart has been updated.';
            }
            
            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message?.includes('network')) {
              errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message?.includes('timeout')) {
              errorMessage = 'Request timed out. Please try again.';
            }
            
            setPaymentError(errorMessage);
            toast.error(errorMessage);
            
            // If payment was successful but order creation failed, show special message
            if (error.message?.includes('payment was successful') || 
                error.response?.data?.paymentSuccess) {
              toast.warning(
                'Payment was successful but there was an issue with your order. ' +
                'Please contact support with your payment ID.'
              );
            }
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          order_from: 'ElectroHive Web',
          order_total: `₹${(order.amount / 100).toFixed(2)}`,
          order_id: order.id
        },
        theme: {
          color: '#3399cc',
          hide_topbar: false
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
            setIsProcessingPayment(false);
          },
          escape: true,
          backdropclose: false
        }
      };

      // Open Razorpay payment popup
      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        
        // Handle modal close event
        rzp.on('payment.failed', function(response) {
          console.error('Payment failed:', response.error);
          setPaymentError(
            response.error.description || 'Payment was not completed. Please try again.'
          );
        });
        
        // Cleanup function
        return () => {
          rzp.close();
        };
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        throw new Error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  }, [user, itemCount, cartTotals, navigate, clearCart, items, shippingAddress]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [user, navigate]);

  // Use cartTotals for all calculations to avoid duplication

  return (
    <div className="bg-gray-50 p-10 px-2 lg:px-4 md:px-10">
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

            {/* Payment Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={async () => {
                  try {
                    console.log('Testing order endpoint...');
                    const result = await testOrderEndpoint();
                    console.log('Test result:', result);
                    toast.success('Test endpoint working! Check console for details.');
                  } catch (error) {
                    console.error('Test failed:', error);
                    toast.error('Test failed. Check console for details.');
                  }
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Test Order Endpoint
              </button>
              <button
                onClick={async () => {
                  try {
                    console.log('Testing order creation with auth...');
                    const response = await axios.post(
                      `${import.meta.env.VITE_API_URL}/test/create-test-order`,
                      { test: 'data' },
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${authService.getToken()}`
                        }
                      }
                    );
                    console.log('Test order creation result:', response.data);
                    toast.success('Test order created! Check console for details.');
                  } catch (error) {
                    console.error('Test order creation failed:', error);
                    toast.error(`Test failed: ${error.message}`);
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Test Order Creation
              </button>
              {paymentError && (
                <div className="w-full mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {paymentError}
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={isProcessingPayment || itemCount === 0}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${isProcessingPayment || itemCount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isProcessingPayment ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${(cartTotals?.total || 0).toFixed(2)}`
                )}
              </button>
            </div>

            {/* Payment Info */}
            <div className="text-xs text-gray-500 mt-5">
              <p key="secure-payments">✅ Safe and secure payments</p>
              <p key="easy-returns">🔁 Easy returns</p>
              <p key="authentic-products">📦 100% Authentic products</p>
            </div>

            <div className="text-xs text-gray-600 text-center mt-4">
              Need Help? <Link to="/contact" className="text-blue-500 hover:text-blue-400">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
