import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductQuickView = lazy(() => import('./components/QuickView/ProductOverview'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/LoginPage'));
const Register = lazy(() => import('./pages/RegisterPage'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const History = lazy(() => import('./pages/History'));
const Team = lazy(() => import('./pages/Team'));
const Faq = lazy(() => import('./pages/Faq'));
const ComplaintBox = lazy(() => import('./pages/ComplaintBox'));
const Wishlist = lazy(() => import('./pages/WishlistPage'));
const SharedWishlist = lazy(() => import('./pages/SharedWishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProtectedRoute = lazy(() => import('./components/common/ProtectedRoute'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Unauthorized component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">401 Unauthorized</h1>
      <p className="text-lg mb-4">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<Loading />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductQuickView />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/shared-wishlist" element={
                    <Suspense fallback={<Loading />}>
                      <SharedWishlist />
                    </Suspense>
                  } />
                  
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/complaints" element={
                    <ProtectedRoute>
                      <ComplaintBox />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Error routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
