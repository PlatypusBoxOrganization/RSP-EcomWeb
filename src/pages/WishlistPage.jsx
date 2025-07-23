import React from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from './ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.length ? (
          wishlist.map((item) => <ProductCard key={item.id} product={item} />)
        ) : (
          <p>No items in wishlist</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
