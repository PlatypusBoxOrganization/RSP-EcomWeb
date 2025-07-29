import React, { useState, useCallback, memo } from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

// Memoized navigation buttons to prevent unnecessary re-renders
const NavigationButton = memo(({ onClick, icon: Icon, label, position }) => (
  <button
    onClick={onClick}
    className={`bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10 ${position === 'left' ? 'mr-auto' : 'ml-auto'}`}
    aria-label={label}
  >
    <Icon className={`w-3 h-3 text-gray-700`} />
  </button>
));

const ProductCard = memo(({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const isInWishlist = isWishlisted(product.id);

  const handleNextImage = useCallback((e) => {
    e?.stopPropagation?.();
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product.images.length]);

  const handlePrevImage = useCallback((e) => {
    e?.stopPropagation?.();
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  }, [product.images.length]);

  const handleQuickView = useCallback((e) => {
    e?.stopPropagation?.();
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleWishlistToggle = useCallback((e) => {
    e?.stopPropagation?.();
    toggleWishlist(product);
  }, [product, toggleWishlist]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div 
      className="relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`View ${product.name} details`}
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        onClick={handleWishlistToggle}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-pink-500 w-4 h-4" />
        ) : (
          <FaRegHeart className="text-gray-500 w-4 h-4 group-hover:text-pink-500" />
        )}
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {product.discount}% OFF
        </span>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <OptimizedImage
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain"
          placeholderClassName="bg-gray-100"
        />

        {/* Image Navigation Arrows */}
        {product.images.length > 1 && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 opacity-0 ${isHovered ? 'opacity-100' : 'md:opacity-0'} transition-opacity duration-200`}>
            <NavigationButton 
              onClick={handlePrevImage} 
              icon={FaChevronLeft} 
              label="Previous image"
              position="left"
            />
            <NavigationButton 
              onClick={handleNextImage} 
              icon={FaChevronRight} 
              label="Next image"
              position="right"
            />
          </div>
        )}

        {/* Quick View Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleQuickView}
        >
          <button 
            className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors duration-200 flex items-center mx-auto"
            aria-label={`Quick view ${product.name}`}
          >
            <FaEye className="mr-1.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </p>
            {product.originalPrice > product.price && (
              <p className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded">
              <span className="text-xs font-medium text-blue-700">
                {product.rating || '4.5'}
              </span>
              <svg
                className="w-3 h-3 text-yellow-400 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
