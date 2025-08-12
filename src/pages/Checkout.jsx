import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
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
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          address,
          paymentMethod,
          // Add any additional order details here
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
      </header> */}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-10">

        {/* Left - Main Checkout Area */}
        <div className="w-full lg:w-2/3 space-y-6">

          {/* Delivery Details */}
          <section className="bg-white p-5 rounded shadow">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                id="address"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="text-sm">
              <button className="text-blue-600">+ Add delivery instructions (optional)</button>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white p-5 rounded shadow">
            <h3 className="font-semibold mb-4">Your available balance</h3>

            <div className="space-y-4">
              {/* UPI */}
              <div className="border p-4 rounded">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="payment" 
                    id="upi" 
                    className="mr-2" 
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <label htmlFor="upi" className="flex-1">UPI</label>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-3 pl-6">
                    <input
                      type="text"
                      placeholder="Enter UPI ID"
                      className="border px-3 py-2 rounded w-full md:w-1/2"
                    />
                  </div>
                )}
              </div>

              {/* Cards */}
              <div className="border p-4 rounded">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="payment" 
                    id="card" 
                    className="mr-2" 
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label htmlFor="card" className="flex-1">Credit or debit card</label>
                </div>
                {paymentMethod === 'card' && (
                  <div className="mt-3 pl-6 space-y-3">
                    <input
                      type="text"
                      placeholder="Card number"
                      className="border px-3 py-2 rounded w-full"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="border px-3 py-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="border px-3 py-2 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div className="border p-4 rounded">
                <div className="flex items-center">
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
