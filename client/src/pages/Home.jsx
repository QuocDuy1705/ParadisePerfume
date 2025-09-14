import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import CartSidebar from "../components/CartSidebar";
import Hero from "../components/Hero";
import "../assets/styles/home.css";

const categories = ["Men", "Women", "Mini", "Giftset"];

const Home = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState([]); // lưu category nào đã "Xem thêm"
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // quản lý sidebar

  // Fetch tất cả sp theo category
  const fetchByCategory = async () => {
    const result = {};
    for (const cat of categories) {
      const res = await axios.get(
        `http://localhost:5000/api/products/category/${cat}`
      );

      result[cat] = res.data; // lấy toàn bộ, hiển thị limit ở UI
    }
    setGroupedProducts(result);
  };

  useEffect(() => {
    fetchByCategory();
  }, []);

  // Search filter
  const handleSearch = async (filters = {}) => {
    setIsFiltering(true);
    const res = await axios.get(`http://localhost:5000/api/products/search`, {
      params: {
        keyword: filters.keyword,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        notes: Array.isArray(filters.notes)
          ? filters.notes.join(",")
          : filters.notes || "",
        rating: filters.rating,
        sortBy: filters.sortBy,
      },
    });
    setFilteredProducts(res.data);
  };

  // Toggle xem thêm
  const handleToggleCategory = (cat) => {
    if (expandedCategories.includes(cat)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== cat)); // thu gọn lại
    } else {
      setExpandedCategories([...expandedCategories, cat]); // mở rộng
    }
  };

  return (
    <div className="homepage">
      <Hero />
      <ProductFilters onSearch={handleSearch} />

      {isFiltering ? (
        <section className="search-results">
          <h2>Kết quả tìm kiếm</h2>
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p>Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </section>
      ) : (
        categories.map((cat) => {
          const products = groupedProducts[cat] || [];
          const isExpanded = expandedCategories.includes(cat);
          const displayProducts = isExpanded ? products : products.slice(0, 3);

          return (
            <section key={cat} className="category-section">
              <h2>
                {cat === "Men"
                  ? "Nước hoa Nam"
                  : cat === "Women"
                  ? "Nước hoa Nữ"
                  : cat === "Mini"
                  ? "Mini Size"
                  : "Giftset"}
              </h2>

              <div className="product-grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Nút Xem thêm / Thu gọn */}
              {products.length > 3 && (
                <button
                  className="view-more-btn"
                  onClick={() => handleToggleCategory(cat)}
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </section>
          );
        })
      )}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Home;
