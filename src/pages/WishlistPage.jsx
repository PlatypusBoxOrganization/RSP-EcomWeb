import React from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length 
              ? `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`
              : 'Your wishlist is currently empty'}
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length > 0 ? (
          <div className="space-y-6">
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/shop"
                className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#292355] hover:bg-[#3a2f6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355] transition-colors"
              >
                <FaArrowRight className="mr-2 -ml-1" />
                Continue Shopping
              </Link>
              
              <button
                type="button"
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#292355] bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355] transition-colors"
              >
                Share Wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
              <FaHeart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding some products to your wishlist!</p>
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#292355] hover:bg-[#3a2f6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355] transition-colors"
              >
                <FaArrowRight className="mr-2 -ml-1" />
                Browse Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
