import React from 'react';
import { toast } from 'react-toastify';
import PaymentButton from '../common/PaymentButton';

const CheckoutButton = ({ cartTotal, cartItems, className = '' }) => {
  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    // You can add additional logic here, like clearing the cart or showing a success message
    toast.success('Payment successful! Your order has been placed.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Error handling is already done in the PaymentButton component
  };

  // Calculate amount in the smallest currency unit (paise for INR)
  const amountInPaise = Math.round(cartTotal * 100);

  return (
    <div className={`mt-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Complete your order</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
          <p>Order total</p>
          <p>₹{cartTotal.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Shipping and taxes calculated at checkout.
        </p>
        
        <PaymentButton
          amount={amountInPaise}
          buttonText={`Pay ₹${cartTotal.toFixed(2)}`}
          description={`Payment for ${cartItems.length} item(s)`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          className="w-full justify-center py-3 text-base"
        />
        
        <p className="mt-4 text-center text-sm text-gray-500">
          <span>Or </span>
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500"
            onClick={() => window.history.back()}
          >
            Continue Shopping<span aria-hidden="true"> &rarr;</span>
          </button>
        </p>
      </div>
    </div>
  );
};

export default CheckoutButton;
