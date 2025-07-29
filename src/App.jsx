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
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const History = lazy(() => import('./pages/History'));
const Team = lazy(() => import('./pages/Team'));
const Faq = lazy(() => import('./pages/Faq'));
const ComplaintBox = lazy(() => import('./pages/ComplaintBox'));
const Wishlist = lazy(() => import('./pages/WishlistPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                  <Route path="/" element={<Home />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/complaints" element={<ComplaintBox />} />
                  <Route path="/shop" element={<Shop />} /> 
                  <Route path="/product/:id" element={<ProductQuickView />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute><Checkout /></ProtectedRoute>
                    </Suspense>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/wishlist" element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute><Wishlist /></ProtectedRoute>
                    </Suspense>
                  } />
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
