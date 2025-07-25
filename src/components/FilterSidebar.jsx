import React, { useState } from "react";

const FilterSidebar = ({ filters, setFilters }) => {
  const [openSections, setOpenSections] = useState({
    category: false,
    brand: false,
    colour: false,
    price: false,
    discount: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleBrandChange = (e) => {
    setFilters({ ...filters, brand: e.target.value });
  };

  const handleColorChange = (e) => {
    const selectedColors = filters.colors || [];
    const updatedColors = e.target.checked
      ? [...selectedColors, e.target.value]
      : selectedColors.filter((color) => color !== e.target.value);
    setFilters({ ...filters, colors: updatedColors });
  };

  const handlePriceChange = (e) => {
    const range = {
      all: [0, 20000],
      low: [0, 1000],
      mid: [1000, 5000],
      high: [5000, 20000],
    };
    setFilters({ ...filters, priceRange: range[e.target.value] });
  };

  const handleDiscountChange = (e) => {
    setFilters({ ...filters, discount: e.target.value });
  };

  const handleClear = () => {
    setFilters({
      category: "",
      brand: "",
      colors: [],
      priceRange: [0, 20000],
      discount: "",
    });
  };

  return (
    <aside className="hidden md:block  p-4 rounded-lg bg-white shadow-sm w-64  ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          onClick={handleClear}
          className="text-pink-600 text-sm hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => toggleSection("category")}
        >
          <h4 className="font-medium">Department</h4>
          <span>{openSections.category ? "−" : "+"}</span>
        </div>
        {openSections.category && (
          <div className="mt-2 space-y-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="Electronics"
                checked={filters.category === "Electronics"}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              Electronics
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="Medical"
                checked={filters.category === "Medical"}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              Medical
            </label>
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
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => toggleSection("colour")}
        >
          <h4 className="font-medium">Colour</h4>
          <span>{openSections.colour ? "−" : "+"}</span>
        </div>
        {openSections.colour && (
          <div className="mt-2 space-y-1">
            {["Red", "Green", "Blue", "Black"].map((color) => (
              <label key={color} className="flex items-center">
                <input
                  type="checkbox"
                  value={color}
                  checked={filters.colors?.includes(color)}
                  onChange={handleColorChange}
                  className="mr-2"
                />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <h4 className="font-medium">Price</h4>
          <span>{openSections.price ? "−" : "+"}</span>
        </div>
        {openSections.price && (
          <div className="mt-2 space-y-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="all"
                onChange={handlePriceChange}
                className="mr-2"
              />
              All
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="low"
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹0 – ₹1,000
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="mid"
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹1,000 – ₹5,000
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="high"
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹5,000+
            </label>
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

export default FilterSidebar;
