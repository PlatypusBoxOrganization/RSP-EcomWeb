import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock function to send OTP
  const sendOtp = async (phoneNumber) => {
    // In a real app, this would be an API call to your backend
    console.log(`Sending OTP to ${phoneNumber}`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would get this from the server
        const mockOtp = Math.floor(1000 + Math.random() * 9000);
        console.log(`Mock OTP for ${phoneNumber}: ${mockOtp}`);
        localStorage.setItem('otp', mockOtp.toString());
        localStorage.setItem('otpPhone', phoneNumber);
        setOtpSent(true);
        resolve({ success: true });
      }, 1000);
    });
  };

  // Mock function to verify OTP
  const verifyOtp = async (otp) => {
    const storedOtp = localStorage.getItem('otp');
    const phoneNumber = localStorage.getItem('otpPhone');
    
    if (otp === storedOtp) {
      // In a real app, you would get a token from the server
      const mockUser = {
        id: '1',
        phone: phoneNumber,
        name: 'User',
        token: 'mock-jwt-token',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.removeItem('otp');
      localStorage.removeItem('otpPhone');
      setUser(mockUser);
      setOtpSent(false);
      return { success: true, user: mockUser };
    }
    
    return { success: false, error: 'Invalid OTP' };
  };

  const login = async (phoneNumber, password) => {
    // In a real app, this would be an API call to your backend
    console.log(`Logging in with ${phoneNumber}`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would verify credentials with the server
        if (phoneNumber && password) {
          const mockUser = {
            id: '1',
            phone: phoneNumber,
            name: 'User',
            token: 'mock-jwt-token',
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve({ success: true, user: mockUser });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setOtpSent(false);
  };

  const value = {
    user,
    otpSent,
    loading,
    sendOtp,
    verifyOtp,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
