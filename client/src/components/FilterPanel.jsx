import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import "../assets/styles/filterPanel.css";

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
            <label className="filter-label">CATÉGORIE</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              <option value="Men">Pour Homme</option>
              <option value="Women">Pour Femme</option>
              <option value="Mini">Miniature</option>
              <option value="Giftset">Coffret Cadeau</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">FOURCHETTE DE PRIX (VND)</label>
            <div className="price-inputs">
              <input
                type="number"
                className="filter-input"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                className="filter-input"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label className="filter-label">TRIER PAR</label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="newest">Nouveautés</option>
              <option value="price_asc">Prix: Croissant</option>
              <option value="price_desc">Prix: Décroissant</option>
              <option value="rating_desc">Mieux notés</option>
            </select>
          </div>

          {/* Reset Button */}
          <button className="filter-reset-btn" onClick={handleReset}>
            RÉINITIALISER LES FILTRES
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
