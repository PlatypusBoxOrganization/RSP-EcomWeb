import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
import ContactUs from './pages/ContactUs';
import History from './pages/History';
// import Team from './pages/Team';
// import Faq from './pages/Faq';
// import ComplaintBox from './pages/ComplaintBox';
import Shop from './pages/Shop';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/history" element={<History />} />
              {/* <Route path="/team" element={<Team />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/complaints" element={<ComplaintBox />} /> */}
              <Route path="/shop" element={<Shop />} /> 
              {/* <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
