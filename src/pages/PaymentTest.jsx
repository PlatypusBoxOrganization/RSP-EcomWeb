import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutButton from '../components/checkout/CheckoutButton';

const PaymentTest = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(100); // Default amount: ₹100
  
  // Mock cart items for testing
  const cartItems = [
    {
      id: '1',
      name: 'Test Product',
      price: amount,
      quantity: 1,
      image: 'https://via.placeholder.com/50'
    }
  ];

  const handleSuccess = (response) => {
    console.log('Payment successful:', response);
    toast.success('Payment successful!');
    // Redirect to success page or order confirmation
    navigate('/order-success');
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
    toast.error(error.message || 'Payment failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Test Razorpay Integration</h1>
            <p className="mt-2 text-sm text-gray-600">
              This is a test page to verify the Razorpay payment integration
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (INR)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount in INR"
            />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>₹{amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CheckoutButton
                cartTotal={amount}
                cartItems={cartItems}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
