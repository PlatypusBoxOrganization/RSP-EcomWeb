import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-[#0d0f13] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/public/images/logo.jpg" // Replace this with your logo path (public/logo.png)
            alt="Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="text-xl font-semibold">ElectroHive</span>
        </div>

        {/* Right: Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-400">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/history" className="hover:text-blue-400">
              History
            </Link>
          </li>
          <li>
            <Link to="/team" className="hover:text-blue-400">
              Team
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-blue-400">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/complaints" className="hover:text-blue-400">
              Complaint Box
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-blue-400">
              Shopping
            </Link>
          </li>
          <li>
            <FaSearch className="cursor-pointer hover:text-blue-400" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
