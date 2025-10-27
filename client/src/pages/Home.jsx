import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import Hero from "../components/Hero";
import "../assets/styles/home.css";

const categories = ["Men", "Women", "Mini", "Giftset"];

const Home = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch sản phẩm theo category
  const fetchByCategory = async () => {
    try {
      setLoading(true);
      const result = {};

      // Fetch song song cho performance tốt hơn
      const promises = categories.map(async (cat) => {
        const res = await api.get(`/products/category/${cat}`);
        return { category: cat, products: res.data };
      });

      const responses = await Promise.all(promises);
      responses.forEach(({ category, products }) => {
        result[category] = products;
      });

      setGroupedProducts(result);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchByCategory();
  }, []);

  // Search filter
  const handleSearch = async (filters = {}) => {
    try {
      setIsFiltering(true);
      const res = await api.get("/products/search", {
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

      // Handle response có thể có pagination hoặc không
      const products = res.data.products || res.data;
      setFilteredProducts(products);
    } catch (error) {
      console.error("Error searching products:", error);
      setFilteredProducts([]);
    }
  };

  // Toggle xem thêm
  const handleToggleCategory = (cat) => {
    if (expandedCategories.includes(cat)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== cat));
    } else {
      setExpandedCategories([...expandedCategories, cat]);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <Hero />
        <div style={{ textAlign: "center", padding: "50px" }}>
          Đang tải sản phẩm...
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Hero />

      {/* Luxury Statement */}
      <div className="luxury-statement">
        <p>NGHỆ THUẬT CHÍNH HÃNG</p>
        <div className="statement-divider"></div>
        <p className="statement-subtitle">
          Mỗi chai nước hoa kể một câu chuyện riêng
        </p>
      </div>

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
        categories.map((cat, index) => {
          const products = groupedProducts[cat] || [];
          const isExpanded = expandedCategories.includes(cat);

          // Hiển thị 3 sản phẩm khi chưa expand, tất cả khi đã expand
          const displayProducts = isExpanded ? products : products.slice(0, 3);

          return (
            <React.Fragment key={cat}>
              <section className="category-section">
                <h2>
                  {cat === "Men"
                    ? "Nước hoa nam"
                    : cat === "Women"
                    ? "Nước hoa nữ"
                    : cat === "Mini"
                    ? "Bộ sưu tập mini"
                    : "Hộp quà tặng"}
                </h2>

                <div className="product-grid">
                  {displayProducts.length === 0 ? (
                    <p>Chưa có sản phẩm trong danh mục này.</p>
                  ) : (
                    displayProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  )}
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

              {/* Divider giữa các section - trừ section cuối */}
              {index < categories.length - 1 && (
                <div className="section-divider">
                  <div className="divider-line"></div>
                </div>
              )}
            </React.Fragment>
          );
        })
      )}

      {/* Luxury Experience Banner */}
      <div className="luxury-experience">
        <div className="experience-content">
          <h3>NGHỆ THUẬT NƯỚC HOA</h3>
          <p>
            Mỗi chai nước hoa là một tác phẩm nghệ thuật, được chế tác tỉ mỉ từ
            những nguyên liệu quý hiếm nhất. Hãy để Paradise dẫn dắt bạn vào thế
            giới của sự sang trọng và tinh tế.
          </p>
          <div className="experience-features">
            <div className="feature">
              <div className="feature-icon">✦</div>
              <p>100% Chính hãng</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✦</div>
              <p>Miễn phí vận chuyển</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✦</div>
              <p>Đóng gói sang trọng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
