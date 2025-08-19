import api from './api/axiosConfig';

export const createRazorpayOrder = async (amount) => {
  try {
    console.log('Sending request to create order with amount:', amount);
    const response = await api.post('/payments/create-order', { amount });
    console.log('Order creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createRazorpayOrder:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    // Add more specific error messages based on the status code
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Please log in to continue');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Invalid request. Please check your cart and try again.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('Failed to create payment order. Please try again.');
  }
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};

// Load Razorpay script with retry mechanism
export const loadRazorpay = (retryCount = 0, maxRetries = 2) => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('Razorpay already loaded');
      resolve(window.Razorpay);
      return;
    }
    
    // Check if script is already being loaded
    if (window.__rzpLoading) {
      const checkRzp = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkRzp);
          resolve(window.Razorpay);
        }
      }, 100);
      return;
    }
    
    window.__rzpLoading = true;
    
    // Create script element with cache buster
    const script = document.createElement('script');
    const cacheBuster = `v=${new Date().getTime()}`;
    script.src = `https://checkout.razorpay.com/v1/checkout.js?${cacheBuster}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Handle script load
    const onLoad = () => {
      console.log('Razorpay script loaded successfully');
      if (window.Razorpay) {
        // Add error handler for Razorpay initialization
        const originalRazorpay = window.Razorpay;
        window.Razorpay = function(options) {
          try {
            return new originalRazorpay(options);
          } catch (error) {
            console.error('Razorpay initialization error:', error);
            throw new Error('Failed to initialize payment gateway. Please try again.');
          }
        };
        window.Razorpay.__proto__ = originalRazorpay;
        resolve(window.Razorpay);
      } else if (retryCount < maxRetries) {
        console.log(`Razorpay not available after script load, retrying (${retryCount + 1}/${maxRetries})`);
        cleanup();
        loadRazorpay(retryCount + 1, maxRetries).then(resolve).catch(reject);
      } else {
        reject(new Error('Failed to load payment gateway. Please refresh the page and try again.'));
      }
    };
    
    // Handle script error
    const onError = (error) => {
      console.error('Failed to load Razorpay script:', error);
      if (retryCount < maxRetries) {
        console.log(`Retrying Razorpay load (${retryCount + 1}/${maxRetries})`);
        cleanup();
        loadRazorpay(retryCount + 1, maxRetries).then(resolve).catch(reject);
      } else {
        reject(new Error('Failed to load payment gateway. Please check your internet connection and try again.'));
      }
    };
    
    // Cleanup function
    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
      clearTimeout(timeout);
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      delete window.__rzpLoading;
    };
    
    // Set timeout for script loading (10 seconds)
    const timeout = setTimeout(() => {
      if (!window.Razorpay) {
        console.error('Razorpay script loading timed out');
        onError(new Error('Script load timeout'));
      }
    }, 10000);
    
    // Set up event listeners
    script.onload = onLoad;
    script.onerror = onError;
    
    // Append to document
    console.log('Loading Razorpay script from:', script.src);
    document.head.appendChild(script);
  });
};
