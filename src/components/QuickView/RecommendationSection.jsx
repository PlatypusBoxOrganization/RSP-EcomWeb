import React, { useState } from 'react';
import products from '../../data/products.json';
import ProductCard from '../ProductCard';

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
            <div key={product.id} className="w-54 flex-shrink-0">
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
  const category = currentProduct.category;

  const relatedProducts = products.filter(
    (p) => p.category === category && p.id !== currentProduct.id
  );

  const suggestedProducts = products.filter(
    (p) => p.category !== category
  );

  return (
    <div className="px-4">
      <Carousel title="You may also like" productList={suggestedProducts.slice(0, 6)} />
      <Carousel title="Related Products" productList={relatedProducts.slice(0, 6)} />
    </div>
  );
};

export default RecommendationSection;
