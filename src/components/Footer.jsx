import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaMapSigns, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#292355] text-white pt-12 pb-6 px-4 sm:px-6 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8 mb-8">
          {/* Column 1: Branding */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/images/logo.png" 
                alt="ElectroHive Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 mr-3 object-contain"
              />
              <h2 className="text-xl sm:text-2xl font-bold">RS PORTRONICS</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Making advanced technology accessible for a better future through innovative electronics solutions and quality service.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 pb-2 border-b border-gray-700">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          {/* <div className="mt-6 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 pb-2 border-b border-gray-700">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/products/electronics" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products/healthcare" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link to="/products/iot" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">IoT Devices</Link></li>
              <li><Link to="/products/pcb" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">PCB Fabrication</Link></li>
              <li><Link to="/products/accessories" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div> */}

          {/* Column 4: Contact Info */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 pb-2 border-b border-gray-700">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-blue-400 mr-3" />
                <span className="text-sm sm:text-base text-gray-300">
                  <span className="font-medium text-white">Head Office:</span> #2, Street No 1, BTW, Ferozepur, Punjab, India
                </span>
              </li>
              <li className="flex items-start">
                <FaMapSigns className="mt-1 flex-shrink-0 text-blue-400 mr-3" />
                <span className="text-sm sm:text-base text-gray-300">
                  <span className="font-medium text-white">Branch:</span> Phase 7, Sector - 62 Mohali, Punjab
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@electrohive.com" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  info@electrohive.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-blue-400 mr-3 flex-shrink-0" />
                <a href="tel:+919464919397" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  +91-9464919397
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left mb-3 md:mb-0">
              &copy; {new Date().getFullYear()} RS Portronics. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
