import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../../data/products.json';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import ProductTabs from './ProductTabs';
import RecommendationSection from './RecommendationSection';



const ProductOverview = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);


  useEffect(() => {
    // Find the product with the matching ID
    const foundProduct = productsData.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading product details...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  const nextImage = () => {
    setImageIndex((imageIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setImageIndex((imageIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
    <div className="p-6 md:flex gap-8">
      {/* Left - Images */}
      <div className="relative w-full md:w-1/2">
        <img
          src={product.images[imageIndex]}
          alt={product.name}
          className="w-full h-96 object-contain rounded-md"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white border px-2 py-1"
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white border px-2 py-1"
        >
          &#8594;
        </button>
      </div>

      {/* Right - Info */}
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
      {/* Wishlist & Share */}
<div className="flex justify-end gap-4 text-gray-600 mb-2 text-xl">
  <button><FaShareAlt /></button>
  <button onClick={() => setWishlist(!wishlist)}>
    {wishlist ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
  </button>
</div>

        <h2 className="text-xl font-bold text-gray-800">{product.brand}</h2>
        <h3 className="text-lg font-medium text-gray-700 mb-2">{product.name}</h3>

        {/* Pricing */}
        <div className="flex items-center gap-4 mb-2">
          <p className="text-xl font-bold text-black">₹{product.price}</p>
          <p className="text-md text-gray-500 line-through">₹{product.mrp}</p>
          <p className="text-green-600 font-medium">{product.discount}% off</p>
        </div>

        {/* Ratings */}
        <div className="mb-4 text-sm text-green-700 bg-green-100 inline-flex items-center px-2 py-1 rounded">
          ⭐ {product.rating} <span className="ml-2 text-gray-600">({product.reviewCount} Ratings & {product.reviews} Reviews)</span>
        </div>

        {/* Quantity and buttons */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16 text-center"
          />
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
            Buy Now
          </button>
          <button className="border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-50">
            Add to Cart
          </button>
        </div>

        {/* Highlights */}
        <div>
          <h4 className="text-md font-semibold mb-2">Highlights</h4>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {product.highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <button className="text-pink-600 mt-2 text-sm">View full details</button>
        </div>
        {/* Shipping Section */}
<div className="mt-6 text-sm">
  <p className="text-gray-700 font-semibold">
    Ship To <span className="ml-2 font-normal text-black">Delhi,110001</span>{' '}
    <button className="text-pink-600 text-xs">Change</button>
  </p>
  <div className="mt-2 space-y-1 text-gray-600">
    <p>🚚 Delivery by <span className="text-black font-medium">30th Jun</span></p>
    <p>💰 Cash on Delivery <span className="text-green-600 font-medium">Available</span></p>
    <p>↩️ 7 day Easy Return <button className="text-pink-600">| Know More</button></p>
  </div>
</div>

      </div> 
    </div>
    <div className="px-20">
      <ProductTabs product={product} />
    </div>
    <div className='px-10 w-full'>
    <RecommendationSection currentProduct={product} />
    </div>
    </>
  );
};

export default ProductOverview;
