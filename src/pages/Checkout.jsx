import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaSpinner, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { createOrder as createRazorpayOrder, verifyPayment } from '../services/paymentService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    if (!address) {
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create order on backend
      const { order } = await createRazorpayOrder(cartTotal);
      
      const options = {
        key: 'rzp_test_RJgQjyW5DIRbPa',
        amount: order.amount,
        currency: order.currency,
        name: 'ElectroHive',
        description: 'Thank you for shopping with us',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create order in database
            const orderResponse = await fetch('http://localhost:5000/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                address,
                paymentMethod: 'razorpay',
                paymentId: response.razorpay_payment_id,
                items: cart,
                totalAmount: cartTotal
              })
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
              throw new Error(orderData.message || 'Failed to create order');
            }

            setOrderSuccess(true);
            setOrderDetails(orderData);
            clearCart();
            toast.success('Order placed successfully!');
          } catch (error) {
            console.error('Payment verification/order creation failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@example.com',
          contact: '9999999999', // Ideally get this from user profile
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
      paymentObject.open();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error processing payment');
      toast.error(error.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'razorpay') {
      await displayRazorpay();
      return;
    }

    // Handle COD (Cash on Delivery)
    if (!address) {
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          address,
          paymentMethod,
          items: cart,
          totalAmount: cartTotal
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderDetails(data);
      setOrderSuccess(true);
      // Optionally clear cart here
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Your order ID is: {orderDetails?.orderId}</p>
          <p className="text-gray-700 mb-6">
            Thank you for shopping with us. We'll send you a confirmation email with order details.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="border border-blue-500 text-blue-500 px-6 py-2 rounded hover:bg-blue-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p>Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      {/* Header */}
      {/* <header className="flex items-center justify-between px-6 py-4 bg-indigo-900 text-white shadow-md sticky top-0 z-10">
        <div className="font-semibold text-lg">LOGO</div>
        <h1 className="text-xl font-bold">Secure Checkout <span className="text-sm">▼</span></h1>
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-xl" />
          <span>Cart</span>
        </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  className="h-4 w-4 text-blue-600"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label htmlFor="cod" className="ml-2">
                  Cash on Delivery
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="razorpay"
                  name="payment"
                  className="h-4 w-4 text-blue-600"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <label htmlFor="razorpay" className="ml-2">
                  Credit/Debit Card (Razorpay)
                </label>
              </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    id="netbanking" 
                    className="mr-2"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <label htmlFor="netbanking" className="flex-1">Net Banking</label>
                </div>
                {paymentMethod === 'netbanking' && (
                  <div className="pl-0 mt-2">
                    <select className="border px-3 py-2 rounded w-full">
                      <option value="">Select your bank</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="other">Other Banks</option>
                    </select>
                  </div>
                )}
              </div>





              {/* COD */}
              <div className="border p-4 rounded">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="payment" 
                    id="cod" 
                    className="mr-2" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <label htmlFor="cod" className="flex-1">Cash on Delivery/Pay on Delivery</label>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="text-sm text-gray-500 pl-6 mt-1">Pay with cash, UPI, or card when your order is delivered.</p>
                )}
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-5 bg-[#292355] px-6 py-3 rounded-lg font-semibold hover:bg-[#482e5e] text-white w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </section>

          {/* Review Items Section */}
          <section className="bg-white p-5 rounded shadow">
            <h3 className="font-semibold">Review items and shipping</h3>
            <p className="text-sm text-gray-600 mt-2">Text</p>
          </section>
        </div>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-5 rounded shadow space-y-4">
            <button className="w-full bg-[#292355] py-2 rounded font-semibold hover:bg-[#482e5e] text-white">
              Use this payment method
            </button>

            <div className="text-sm space-y-2">
              <p className="flex justify-between"><span>Items:</span> <span>₹--</span></p>
              <p className="flex justify-between"><span>Delivery:</span> <span>₹--</span></p>
              <p className="font-semibold flex justify-between"><span>Order Total:</span> <span>₹--</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-indigo-950 text-white text-sm mt-10">
        <div className="text-center py-3 bg-indigo-900">Back to top</div>
        <div className="py-5 px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300">
          <span>LOGO</span>
          <span>Help</span>
          <span>Text</span>
        </div>
      </footer> */}
    </div>
  );
};

export default Checkout;
