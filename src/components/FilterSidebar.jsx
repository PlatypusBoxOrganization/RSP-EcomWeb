import React, { useState, useCallback, memo } from "react";

// Memoized checkbox component to prevent unnecessary re-renders
const FilterCheckbox = memo(({ label, name, value, checked, onChange }) => (
  <label className="flex items-center">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    {label || value}
  </label>
));

// Memoized color option component
const ColorOption = memo(({ color, checked, onChange }) => (
  <label className="flex items-center">
    <input
      type="checkbox"
      value={color}
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    {color}
  </label>
));

const FilterSidebar = ({ filters, setFilters, onReset }) => {
  const [openSections, setOpenSections] = useState({
    category: false,
    brand: false,
    colour: false,
    price: false,
    discount: false,
  });

  // Memoize toggle function with useCallback
  const toggleSection = useCallback((section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Memoize filter change handlers
  const handleCategoryChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  }, [setFilters]);

  const handleBrandChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, brand: e.target.value }));
  }, [setFilters]);

  const handleColorChange = useCallback((e) => {
    const selectedColors = filters.colors || [];
    const updatedColors = e.target.checked
      ? [...selectedColors, e.target.value]
      : selectedColors.filter((color) => color !== e.target.value);
    setFilters(prev => ({ ...prev, colors: updatedColors }));
  }, [filters.colors, setFilters]);

  const handlePriceChange = useCallback((e) => {
    const range = {
      all: [0, 20000],
      low: [0, 1000],
      mid: [1000, 5000],
      high: [5000, 20000],
    };
    setFilters(prev => ({ ...prev, priceRange: range[e.target.value] }));
  }, [setFilters]);

  const handleDiscountChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, discount: e.target.value }));
  }, [setFilters]);

  // Use the passed onReset or local handleClear
  const handleClear = useCallback(() => {
    if (onReset) {
      onReset();
    } else {
      setFilters({
        category: "",
        brand: "",
        colors: [],
        priceRange: [0, 20000],
        discount: "",
      });
    }
  }, [onReset, setFilters]);

  // Memoize the price range check
  const isPriceRangeSelected = useCallback((range) => {
    const [min, max] = filters.priceRange || [0, 20000];
    const ranges = {
      all: [0, 20000],
      low: [0, 1000],
      mid: [1000, 5000],
      high: [5000, 20000],
    };
    return min === ranges[range][0] && max === ranges[range][1];
  }, [filters.priceRange]);

  // Define colors array outside JSX to prevent recreation on each render
  const colors = ["Red", "Green", "Blue", "Black"];

  return (
    <aside className="p-4 rounded-lg bg-white shadow-sm w-full md:w-64 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          onClick={handleClear}
          className="text-pink-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 rounded"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center focus:outline-none"
          aria-expanded={openSections.category}
          aria-controls="category-filters"
        >
          <h4 className="font-medium">Department</h4>
          <span className="text-lg">{openSections.category ? "−" : "+"}</span>
        </button>
        {openSections.category && (
          <div id="category-filters" className="mt-2 space-y-1">
            <FilterCheckbox
              label="Electronics"
              name="category"
              value="Electronics"
              checked={filters.category === "Electronics"}
              onChange={handleCategoryChange}
            />
            <FilterCheckbox
              label="Medical"
              name="category"
              value="Medical"
              checked={filters.category === "Medical"}
              onChange={handleCategoryChange}
            />
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="mb-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => toggleSection("brand")}
        >
          <h4 className="font-medium">Brand</h4>
          <span>{openSections.brand ? "−" : "+"}</span>
        </div>
        {openSections.brand && (
          <select
            className="mt-2 w-full border px-2 py-1 text-sm rounded"
            value={filters.brand}
            onChange={handleBrandChange}
          >
            <option value="">All</option>
            <option value="Portronics">Portronics</option>
            {/* Add more brands */}
          </select>
        )}
      </div>

      {/* Colour */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("colour")}
          className="w-full flex justify-between items-center focus:outline-none"
          aria-expanded={openSections.colour}
          aria-controls="color-filters"
        >
          <h4 className="font-medium">Colour</h4>
          <span className="text-lg">{openSections.colour ? "−" : "+"}</span>
        </button>
        {openSections.colour && (
          <div id="color-filters" className="mt-2 space-y-1">
            {colors.map((color) => (
              <ColorOption
                key={color}
                color={color}
                checked={filters.colors?.includes(color) || false}
                onChange={handleColorChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex justify-between items-center focus:outline-none"
          aria-expanded={openSections.price}
          aria-controls="price-filters"
        >
          <h4 className="font-medium">Price</h4>
          <span className="text-lg">{openSections.price ? "−" : "+"}</span>
        </button>
        {openSections.price && (
          <div id="price-filters" className="mt-2 space-y-1">
            <FilterCheckbox
              label="All Prices"
              name="price"
              value="all"
              checked={isPriceRangeSelected('all')}
              onChange={handlePriceChange}
            />
            <FilterCheckbox
              label="₹0 – ₹1,000"
              name="price"
              value="low"
              checked={isPriceRangeSelected('low')}
              onChange={handlePriceChange}
            />
            <FilterCheckbox
              label="₹1,000 – ₹5,000"
              name="price"
              value="mid"
              checked={isPriceRangeSelected('mid')}
              onChange={handlePriceChange}
            />
            <FilterCheckbox
              label="₹5,000 – ₹20,000"
              name="price"
              value="high"
              checked={isPriceRangeSelected('high')}
              onChange={handlePriceChange}
            />
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="mb-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => toggleSection("discount")}
        >
          <h4 className="font-medium">Discount</h4>
          <span>{openSections.discount ? "−" : "+"}</span>
        </div>
        {openSections.discount && (
          <div className="mt-2 space-y-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="discount"
                value="10"
                checked={filters.discount === "10"}
                onChange={handleDiscountChange}
                className="mr-2"
              />
              10% or more
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="discount"
                value="20"
                checked={filters.discount === "20"}
                onChange={handleDiscountChange}
                className="mr-2"
              />
              20% or more
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="discount"
                value="30"
                checked={filters.discount === "30"}
                onChange={handleDiscountChange}
                className="mr-2"
              />
              30% or more
            </label>
          </div>
        )}
      </div>
    </aside>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FilterSidebar, (prevProps, nextProps) => {
  // Only re-render if filters or open sections change
  return (
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
    JSON.stringify(prevProps.openSections) === JSON.stringify(nextProps.openSections)
  );
});
