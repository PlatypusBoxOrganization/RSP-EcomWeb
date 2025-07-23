import React, { useEffect, useState } from "react";
import productsData from "../data/products.json";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 20000],
    colors: [],
    discount: ""
  });
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const applyFilters = () => {
    return products
      .filter((product) =>
        filters.category ? product.category === filters.category : true
      )
      .filter((product) =>
        filters.brand ? product.brand === filters.brand : true
      )
      .filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      )
      .filter((product) =>
        filters.colors.length > 0
          ? filters.colors.includes(product.color)
          : true
      )
      .filter((product) =>
        filters.discount
          ? product.discount >= parseInt(filters.discount)
          : true
      );
  };

 

  return (
    <main className="bg-white text-gray-800 min-h-screen">
      <section className="text-center py-8">
        <h1 className="text-2xl font-bold">Buy Portronics Online</h1>
        <p className="text-sm text-gray-500">
          {applyFilters().length} Products Found
        </p>
      </section>

      <section className="max-w-7xl mx-auto ml-18 px-6 pr-0   pb-16 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div>
        <FilterSidebar filters={filters} setFilters={setFilters} className="pr-10"  />
        </div>

        {/* Main Area */}
        <div className="md:col-span-4 ml-10 ">
          {/* Sort Dropdown */}
          <div className="flex justify-end mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="popularity">Sort By: Popularity</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {applyFilters().map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;
