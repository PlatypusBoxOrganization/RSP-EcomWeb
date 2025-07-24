import React, { useState } from 'react';

const ProductTabs = ({ product }) => {
  const tabs = ['Description', 'Specification', 'Warranty', 'Review', 'QnA', 'Other Info'];
  const [activeTab, setActiveTab] = useState('Description');
  

  const tabContent = {
    Description: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {product.description}
        </p>
        {product.highlights && product.highlights.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-700 list-disc pl-6 space-y-1">
              {product.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
    Specification: (
      <div className="text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Brand</p>
            <p>{product.brand || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Category</p>
            <p>{product.category || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Color</p>
            <p>{product.color || 'N/A'}</p>
          </div>
        </div>
      </div>
    ),
    Warranty: (
      <div className="text-sm text-gray-700">
        <p>This product comes with a standard manufacturer's warranty. For more details, please contact our customer support.</p>
      </div>
    ),
    Review: (
      <div className="text-sm text-gray-700">
        <p><strong>{product.rating}★</strong> based on {product.reviewCount} reviews</p>
        <div className="mt-4 space-y-4">
          <p>No customer reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    ),
    QnA: (
      <div className="text-sm text-gray-700">
        <p>No questions yet. Be the first to ask a question!</p>
      </div>
    ),
    'Other Info': (
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-semibold">Price:</span> ₹{product.price.toLocaleString()}</p>
        {product.mrp && (
          <p><span className="font-semibold">MRP:</span> <span className="line-through">₹{product.mrp.toLocaleString()}</span></p>
        )}
        {product.discount && (
          <p><span className="font-semibold">Discount:</span> {product.discount}% OFF</p>
        )}
      </div>
    ),
  };

  return (
    <div className="px-6 mt-10">
      <div className="flex gap-4 flex-wrap border-b">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm border-b-2 transition ${
              activeTab === tab
                ? 'border-pink-500 text-pink-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-white p-4 border rounded shadow-sm">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default ProductTabs;
