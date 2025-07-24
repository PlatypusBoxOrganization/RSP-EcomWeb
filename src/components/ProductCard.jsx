import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  const handleQuickView = () => {
    navigate(`/product/${product.id}`); // This id should match product.id from your JSON
  };

  return (
    <div className="border rounded-lg py-4 shadow-sm text-center hover:shadow-md transition relative">

<button
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
        onClick={() => toggleWishlist(product)}
      >
        {isWishlisted(product.id) ? (
          <FaHeart className="text-pink-600" />
        ) : (
          <FaRegHeart className="text-gray-500" />
        )}
      </button>

      {/* Image Slider with Arrows */}
      <div className="relative w-full h-32 px-4 flex items-center justify-center mb-3 ">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-30 object-contain "
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-1 shadow-sm"
            >
              &#x2039;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-1 shadow-sm"
            >
              &#x203A;
            </button>
          </>
        )}
      </div>

      {/* Rest of the ProductCard remains unchanged */}
      <button
        onClick={handleQuickView}
        className="mt-2 text-sm text-pink-600 bg-pink-200 p-1 flex justify-center items-center w-full hover:bg-pink-300 hover:transition duration-200"
      >
        Quick View
      </button>
      <h3 className="text-sm font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>

      <div className='mt-2 flex flex-col items-center'>
        <div className='flex items-center gap-2'>
          <p className="text-lg font-bold">₹{product.price}</p>
          <p className="text-md text-gray-500 line-through">₹{product.mrp}</p>
          <p className="text-xs text-green-600">{product.discount}% off</p>
        </div>
      </div>

      <div className='flex items-center gap-2 justify-center mt-2'>
        <p className="text-xs text-yellow-600 border flex items-center justify-center rounded-3xl px-0.5 w-12">
          ⭐ {product.rating}
        </p>
        <p className="text-xs text-gray-500">({product.reviewCount})</p>
      </div>
    </div>
  );
};

export default ProductCard;
