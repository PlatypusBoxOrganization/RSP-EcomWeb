import React, { useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard.jsx';
import { FaHeart, FaArrowRight, FaShoppingCart, FaRegSadTear } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WishlistPage = () => {
  const { 
    wishlist, 
    loading, 
    error,
    isWishlisted,
    toggleWishlist,
    moveToCart,
    refreshWishlist 
  } = useWishlist();
  
  const { addToCart, refreshCart } = useCart();

  // Handle move to cart action
  const handleMoveToCart = async (product) => {
    const productId = product._id || product.id || product.product?._id;
    if (!productId) {
      toast.error('Invalid product');
      return;
    }
    
    try {
      // First add to cart
      const addToCartResult = await addToCart(product, 1);
      
      if (addToCartResult.success) {
        // If added to cart successfully, remove from wishlist
        const removeResult = await toggleWishlist(product);
        
        if (removeResult.success) {
          // Refresh both wishlist and cart
          await Promise.all([
            refreshWishlist(),
            refreshCart()
          ]);
          toast.success('Moved to cart successfully');
        } else {
          // If removing from wishlist fails, remove from cart to keep in sync
          await removeFromCart(addToCartResult.cartItemId);
          toast.error('Failed to update wishlist');
        }
      } else {
        toast.error(addToCartResult.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error(error.message || 'Failed to move to cart');
    }
  };

  // Handle add to cart action
  const handleAddToCart = async (product) => {
    const itemToAdd = product.product || product;
    const result = await addToCart(itemToAdd);
    if (result.success) {
      toast.success('Added to cart successfully');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (product) => {
    const result = await toggleWishlist(product);
    if (result.success) {
      toast.success('Removed from wishlist');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <FaRegSadTear className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={refreshWishlist}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {wishlist.map((item) => {
                const product = item.product || item;
                return (
                  <div key={product._id || product.id} className="relative group">
                    <ProductCard product={product} />
                    <div className="mt-2 flex flex-col space-y-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <FaShoppingCart className="mr-2" />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product)}
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
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
                className="px-6 py-3 border rounded-md shadow-sm text-base font-medium text-[#292355] bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355] transition-colors"
              >
                Share Wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you love for easy access later</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#292355] hover:bg-[#3a2f6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355]"
            >
              <FaArrowRight className="mr-2 -ml-1" />
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
