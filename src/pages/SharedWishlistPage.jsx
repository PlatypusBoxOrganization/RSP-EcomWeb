import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaRegSadTear } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SharedWishlistPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        const itemIds = searchParams.get('items');
        if (!itemIds) {
          throw new Error('No items in the shared wishlist');
        }

        // Construct the API URL, ensuring we don't have double /api in the path
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Remove trailing slashes
        const apiUrl = `${baseUrl}/products/ids?ids=${itemIds}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist items');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching shared wishlist:', err);
        setError(err.message || 'Failed to load shared wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedWishlist();
  }, [searchParams]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to cart');
      return;
    }
    
    try {
      const result = await addToCart(product);
      if (result.success) {
        toast.success('Added to cart successfully');
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <FaRegSadTear className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shared Wishlist</h1>
          <p className="text-gray-600">
            {products.length} item{products.length !== 1 ? 's' : ''} in this wishlist
          </p>
          <div className="w-20 h-1 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        {/* Wishlist Items */}
        {products.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product._id || product.id} className="relative group">
                  <ProductCard product={product} />
                  <div className="mt-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items in this wishlist</h3>
            <p className="text-gray-500 mb-6">The shared wishlist is empty or the link is invalid</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#292355] hover:bg-[#3a2f6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355]"
            >
              <FaArrowLeft className="mr-2 -ml-1" />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default SharedWishlistPage;
