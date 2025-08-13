import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import axios from 'axios';

const Carousel = ({ title, productList }) => {
  const [scrollX, setScrollX] = useState(0);

  const scroll = (direction) => {
    const scrollAmount = 300;
    const container = document.getElementById(title);
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
      setScrollX(container.scrollLeft - scrollAmount);
    } else {
      container.scrollLeft += scrollAmount;
      setScrollX(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="my-10 ">
      <div className="flex justify-between items-center px-2 sm:px-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="text-sm px-4 py-1 border rounded hover:bg-gray-200">View all products</button>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/3 bg-white shadow-md z-10 rounded-full p-2"
        >
          ◀
        </button>
        <div
          id={title}
          className="flex overflow-x-auto no-scrollbar space-x-4 px-6 py-4 scroll-smooth"
        >
          {productList.map((product) => (
            <div key={product._id || product.id} className="w-54 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/3 bg-white shadow-md z-10 rounded-full p-2"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

const RecommendationSection = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentProduct?._id) {
        console.log('No current product ID available');
        return;
      }
      
      console.log('Fetching recommendations for product:', currentProduct._id);
      
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        // Fetch related and suggested products in parallel
        const [relatedResponse, suggestedResponse] = await Promise.all([
          axios.get(`${apiUrl}/products/related/${currentProduct._id}`),
          axios.get(`${apiUrl}/products/suggested`)
        ]);
        
        console.log('Related products response:', relatedResponse.data);
        console.log('Suggested products response:', suggestedResponse.data);
        
        setRelatedProducts(Array.isArray(relatedResponse.data) ? relatedResponse.data : []);
        setSuggestedProducts(Array.isArray(suggestedResponse.data) ? suggestedResponse.data : []);
        
      } catch (err) {
        console.error('Error fetching recommendations:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct?._id]);

  if (!currentProduct) {
    return null;
  }

  // Show loading state only on initial load
  if (loading && relatedProducts.length === 0 && suggestedProducts.length === 0) {
    return (
      <div className="px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error message if there was an error and no products are loaded
  if (error && relatedProducts.length === 0 && suggestedProducts.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 mt-8">
      {suggestedProducts.length > 0 && (
        <div className="mb-10">
          <Carousel 
            title="You may also like" 
            productList={suggestedProducts} 
          />
        </div>
      )}
      
      {relatedProducts.length > 0 && (
        <div className="mb-10">
          <Carousel 
            title="Related Products" 
            productList={relatedProducts} 
          />
        </div>
      )}
      
      {!loading && relatedProducts.length === 0 && suggestedProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No recommendations available at the moment.
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;
