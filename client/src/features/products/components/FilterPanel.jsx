import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import "../../../assets/styles/filterPanel.css";

const FilterPanel = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sortBy: initialFilters.sortBy || "newest",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="filter-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <SlidersHorizontal size={18} />
        <span>FILTRER</span>
      </button>

      {/* Filter Panel */}
      <div className={`filter-panel ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>FILTRES</h3>
          <button className="filter-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="filter-content">
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">DANH MỤC</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              <option value="Men">Nước Hoa Nam</option>
              <option value="Women">Nước Hoa Nữ</option>
              <option value="Mini">Nước Hoa Mini</option>
              <option value="Giftset">Giftset</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">KHOẢNG GIÁ (VNĐ)</label>
            <div className="price-inputs">
              <input
                type="number"
                className="filter-input"
                placeholder="Tối thiểu"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                className="filter-input"
                placeholder="Tối đa"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label className="filter-label">SẮP XẾP THEO</label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating_desc">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Reset Button */}
          <button className="filter-reset-btn" onClick={handleReset}>
            ĐẶT LẠI BỘ LỌC
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="filter-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default FilterPanel;
