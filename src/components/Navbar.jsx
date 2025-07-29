import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaTimes, FaBars, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { items: cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/contact", text: "Contact Us" },
    { to: "/history", text: "History" },
    { to: "/team", text: "Team" },
    { to: "/faq", text: "FAQ" },
    { to: "/complaints", text: "Complaint Box" },
    { to: "/shop", text: "Shopping" },
    { to: "/wishlist", text: "Wishlist" },
    { to: "/cart", text: "My Cart" },
  ];

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
      )}
      
      <nav className="bg-[#0d0f13] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
          {/* Left: Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full"
            />
            <span className="text-lg sm:text-xl font-semibold">RS PORTRONICS</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-blue-400 px-2 py-1 flex items-center">
                  {link.text}
                  {link.text === 'My Cart' && cartItems.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <FaSearch className="cursor-pointer hover:text-blue-400 text-lg" />
            </li>
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/wishlist" className="text-white hover:text-blue-400">
              <FaHeart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="text-white hover:text-blue-400">
              <div className="relative">
                <FaShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hamburger-button text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu fixed top-0 right-0 h-full w-64 bg-[#0d0f13] shadow-lg transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-50 md:hidden`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-3 px-3 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors"
                >
                  {link.text}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
