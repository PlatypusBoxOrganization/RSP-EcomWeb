import { useState } from 'react';
import { toast } from 'react-toastify';
import { BsCreditCard } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const PaymentButton = ({
  amount,
  currency = 'INR',
  buttonText = 'Pay Now',
  className = '',
  onSuccess = () => {},
  onError = () => {},
  description = 'Complete your purchase',
  disabled = false,
  orderId = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // 1. Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        toast.error('Failed to load Razorpay SDK');
        setIsLoading(false);
        return;
      }

      // 2. Create order on your server
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency,
          description,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 3. Open Razorpay payment modal
      const options = {
        key: 'rzp_test_RJgQjyW5DIRbPa', // Your Razorpay key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ElectroHive', // Your business name
        description: description,
        order_id: orderData.id,
        handler: async function (response) {
          // Verify payment on your server
          const verificationResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();

          if (verificationResponse.ok) {
            toast.success('Payment successful!');
            onSuccess(verificationData);
            // Redirect to success page with payment details
            navigate(`/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
          } else {
            throw new Error(verificationData.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name', // You can prefill customer details
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb', // Primary color
        },
        modal: {
          ondismiss: () => {
            // Handle modal close
            console.log('Payment modal closed');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={displayRazorpay}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center px-6 py-3 
        border border-transparent rounded-md shadow-sm
        text-base font-medium text-white bg-blue-600 
        hover:bg-blue-700 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <BsCreditCard className="mr-2" />
          {buttonText}
        </>
      )}
    </button>
  );
};

export default PaymentButton;
