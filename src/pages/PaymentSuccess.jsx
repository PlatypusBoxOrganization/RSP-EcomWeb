import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // You can add any post-payment logic here, like updating the order status in your backend
    console.log('Payment successful:', { paymentId, orderId });
  }, [paymentId, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>
       
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Order ID:</div>
            <div className="font-medium">{orderId || 'N/A'}</div>
            
            <div className="text-gray-500">Payment ID:</div>
            <div className="font-medium">{paymentId || 'N/A'}</div>
            
            <div className="text-gray-500">Status:</div>
            <div className="text-green-600 font-medium">Completed</div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Orders
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Need help?{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact our support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
