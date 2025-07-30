import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";
import debounce from 'lodash.debounce';
import productsData from "../data/products.json";
const ProductCard = lazy(() => import('../components/ProductCard'));
const FilterSidebar = lazy(() => import('../components/FilterSidebar'));
import OptimizedImage from "../components/OptimizedImage";

// Fallback component for lazy loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Shop = () => {
  const [products, setProducts] = useState(productsData);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 20000],
    colors: [],
    discount: ""
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Memoize active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) count++;
    if (filters.colors.length > 0) count++;
    if (filters.discount) count++;
    return count;
  }, [filters]);

  // Debounce search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Update debounced search query when searchQuery changes
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Other filters
      if (filters.category && product.category !== filters.category) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) return false;
      if (filters.discount && (!product.discount || product.discount < parseInt(filters.discount))) return false;
      
      return true;
    });
  }, [products, searchQuery, filters]);

  // Memoize sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'popularity':
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  }, [filteredProducts, sortBy]);

  // Virtualized grid cell renderer
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    if (index >= sortedProducts.length) return null;
    
    const product = sortedProducts[index];
    return (
      <div style={style} className="px-2 py-2">
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <ProductCard 
            key={`${product.id}-${product.name}`} 
            product={product}
          />
        </Suspense>
      </div>
    );
  };

  const productCount = filteredProducts.length;
  
  // Memoize the filter reset function
  const resetFilters = useCallback(() => {
    setFilters({
      category: "",
      brand: "",
      priceRange: [0, 20000],
      colors: [],
      discount: ""
    });
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                {productCount} {productCount === 1 ? 'Product' : 'Products'} Found
                {activeFiltersCount > 0 && ` • ${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="mt-4 md:hidden">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <FaFilter className="mr-2 h-4 w-4 text-gray-500" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Overlay */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-gray-100/70 bg-opacity-10 transition-opacity" 
                  aria-hidden="true" 
                  onClick={() => setIsMobileFilterOpen(false)}
                ></div>

                {/* Modal Container */}
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Filters</h3>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setIsMobileFilterOpen(false)}
                          >
                            <FaTimes className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="mt-4">
                          <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            onReset={resetFilters}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Apply Filters
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilters({
                              category: "",
                              brand: "",
                              priceRange: [0, 20000],
                              colors: [],
                              discount: ""
                            });
                            setIsMobileFilterOpen(false);
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            {/* <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"> */}
              {/* <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setFilters({
                        category: "",
                        brand: "",
                        priceRange: [0, 20000],
                        colors: [],
                        discount: ""
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div> */}
            {/* </div> */}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Filter Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-sm text-gray-500">
                Showing {productCount} {productCount === 1 ? 'product' : 'products'}
              </p>
              <div className="relative w-full sm:w-64  ">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block  md:w-full pl-3 pr-4 py-2   focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-sm rounded-md"
                >
                  <option className="text-xs" value="popularity">Sort by: Popularity</option>
                  <option className="text-xs" value="price-low-high">Sort by: Price Low to High</option>
                  <option className="text-xs" value="price-high-low">Sort by: Price High to Low</option>
                </select>
                {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div> */}
              </div>
            </div>

            {/* Virtualized Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="h-[calc(100vh-300px)] w-full">
              <AutoSizer>
                {({ height, width }) => {
                  // Calculate number of columns based on container width
                  const columnCount = width < 640 ? 2 : width < 1024 ? 3 : 4;
                  const rowCount = Math.ceil(sortedProducts.length / columnCount);
                  const columnWidth = width / columnCount;
                  const rowHeight = 500; // Adjust based on your card height

                  return (
                    <Grid
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      height={height}
                      rowCount={rowCount}
                      rowHeight={rowHeight}
                      width={width}
                      itemData={sortedProducts}
                      className="scrollbar-hide"
                    >
                      {Cell}
                    </Grid>
                  );
                }}
              </AutoSizer>
            </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                  <FaTimes className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({
                        category: "",
                        brand: "",
                        priceRange: [0, 20000],
                        colors: [],
                        discount: ""
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </Suspense>
    </main>
  );
};

export default Shop;
