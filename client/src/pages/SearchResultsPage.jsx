import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { Search } from "lucide-react";
import "../assets/styles/searchResults.css";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Get search and filter params from URL
  const keyword = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page")) || 1;

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (category) params.append("category", category);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sortBy) params.append("sortBy", sortBy);
        params.append("page", page);
        params.append("limit", 20);

        const response = await axios.get(
          `http://localhost:5000/api/products/search?${params.toString()}`
        );

        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setError("Une erreur s'est produite lors de la recherche.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, category, minPrice, maxPrice, sortBy, page]);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    // Update filter params
    if (newFilters.category) {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    if (newFilters.minPrice) {
      params.set("minPrice", newFilters.minPrice);
    } else {
      params.delete("minPrice");
    }

    if (newFilters.maxPrice) {
      params.set("maxPrice", newFilters.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy);
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    setSearchParams(params);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="search-results-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <div className="search-title-section">
            <Search size={24} className="search-icon" />
            <h1 className="search-title">
              {keyword ? <>RÉSULTATS POUR "{keyword}"</> : "TOUS LES PRODUITS"}
            </h1>
          </div>
          {!loading && (
            <p className="search-count">
              {pagination.total}{" "}
              {pagination.total === 1 ? "résultat" : "résultats"}{" "}
              {keyword && `trouvé${pagination.total > 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="search-content">
          {/* Sidebar with Filters */}
          <aside className="search-sidebar">
            <FilterPanel
              onFilterChange={handleFilterChange}
              initialFilters={{
                category,
                minPrice,
                maxPrice,
                sortBy,
              }}
            />
          </aside>

          {/* Main Content */}
          <main className="search-main">
            {loading ? (
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <p>Recherche en cours...</p>
              </div>
            ) : error ? (
              <div className="search-error">
                <p>{error}</p>
                <button
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  RÉESSAYER
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="search-no-results">
                <Search size={48} className="no-results-icon" />
                <h2>KHÔNG TÌM THẤY KẾT QUẢ</h2>
                <p>
                  {keyword
                    ? `Không tìm thấy sản phẩm nào phù hợp với tìm kiếm "${keyword}".`
                    : "Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn."}
                </p>
                <button className="browse-btn" onClick={() => navigate("/")}>
                  VỀ TRANG CHỦ
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="search-products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
