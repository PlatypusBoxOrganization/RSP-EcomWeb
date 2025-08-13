import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FaHeart, FaRegHeart, FaShareAlt, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductTabs from './ProductTabs';
import RecommendationSection from './RecommendationSection';
import { toast } from 'react-toastify';
import axios from 'axios';



const ProductOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isInWishlist = isWishlisted(product?._id || product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setImageIndex((imageIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setImageIndex((imageIndex - 1 + product.images.length) % product.images.length);
  };

  // Ensure we have a valid images array
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['/Images/placeholder.webp'];

  // Calculate discount if not provided
  const discount = product.discount || 
    (product.mrp > product.price 
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
      : 0);

  const handleAddToCart = async () => {
    if (!product) return { success: false, error: 'No product selected' };
    
    try {
      // Pass the selected quantity to the addToCart function
      const result = await addToCart({ 
        ...product, 
        quantity,
        image: productImages[0] 
      }, quantity); // Pass the quantity as a second parameter
      
      if (result.requiresAuth) {
        // Redirect to login with a message
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}&message=${encodeURIComponent('Please login to add items to your cart')}`);
        return { success: false, requiresAuth: true };
      }
      
      if (result.success) {
        toast.success(quantity > 1 ? `${quantity} items added to cart!` : 'Added to cart!');
        return { success: true };
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      toast.error('An error occurred while adding to cart');
    }
  };

  const handleBuyNow = async () => {
    const result = await handleAddToCart();
    if (result?.success) {
      navigate('/cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Shop
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
        {/* Left - Images */}
        <div className="relative w-full md:w-1/2">
          <img
            src={productImages[imageIndex]}
            alt={product.name}
            className="w-full h-96 object-contain rounded-md"
          />
          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white"
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white"
                aria-label="Next image"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {productImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${imageIndex === idx ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Info */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          {/* Wishlist & Share */}
          <div className="flex justify-between items-start mb-4">
            <div>
              {product.brand && (
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {product.brand}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>
            <div className="flex gap-3 text-gray-600">
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!product) return;
                  
                  const result = await toggleWishlist(product);
                  if (result.error) {
                    toast.error(result.error);
                    if (result.requiresAuth) {
                      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}&message=${encodeURIComponent('Please login to manage your wishlist')}`);
                    }
                  }
                }}
                className={`p-2 hover:bg-gray-100 rounded-full ${isInWishlist ? 'text-pink-500' : 'text-gray-600'}`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Share product"
              >
                <FaShareAlt className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ratings */}
          {(product.rating || product.reviewCount) && (
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                <span className="font-medium">{product.rating?.toFixed(1) || '4.5'}</span>
                <span className="ml-1">★</span>
                <span className="mx-1">|</span>
                <span>{product.reviewCount || '0'} Reviews</span>
              </div>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            </div>
          )}

          {/* Pricing */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.mrp?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            {discount > 0 && (
              <span className="text-sm text-green-600">
                You save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Highlights */}
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {product.highlights?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
              <ul className="space-y-2">
                {product.highlights.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and buttons */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium">{product.category || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">SKU:</span>
                <span className="ml-2 font-mono">{product.sku || product._id?.substring(0, 8).toUpperCase()}</span>
              </div>
              {product.warranty && (
                <div>
                  <span className="text-gray-500">Warranty:</span>
                  <span className="ml-2">{product.warranty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm">
              <p className="text-gray-700 font-semibold">
                Ship To <span className="ml-2 font-normal text-black">Delhi, 110001</span>{' '}
                <button className="text-pink-600 text-xs hover:underline">Change</button>
              </p>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>🚚 Delivery by <span className="text-black font-medium">30th Jun</span></p>
                <p>💰 Cash on Delivery <span className="text-green-600 font-medium">Available</span></p>
                <p>↩️ 7 day Easy Return <button className="text-pink-600 hover:underline">Know More</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
        <RecommendationSection currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductOverview;
