import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted(product.id) ? (
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
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-100'}`}
          loading="lazy"
        />

        {/* Image Navigation Arrows */}
        {product.images.length > 1 && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 opacity-0 ${isHovered ? 'opacity-100' : 'md:opacity-0'} transition-opacity duration-200`}>
            <button
              onClick={handlePrevImage}
              className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-3 h-3 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              aria-label="Next image"
            >
              <FaChevronRight className="w-3 h-3 text-gray-700" />
            </button>
          </div>
        )}

        {/* Quick View Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleQuickView}
        >
          <button className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors duration-200 flex items-center mx-auto">
            <FaEye className="mr-1.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <p className="text-xs text-gray-500 mb-1 truncate">{product.category}</p>
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-base font-bold text-gray-900">₹{product.price}</span>
            {product.price < product.mrp && (
              <span className="text-xs text-gray-500 line-through">₹{product.mrp}</span>
            )}
          </div>
          
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <span className="text-yellow-600 text-xs font-medium">
              ⭐ {product.rating} <span className="text-gray-500">({product.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Quick View Button - Mobile */}
        <button
          onClick={handleQuickView}
          className="mt-3 w-full py-2 text-xs font-medium text-pink-600 bg-pink-50 rounded-md hover:bg-pink-100 transition-colors duration-200 md:hidden"
        >
          Quick View
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
