import React, { useState } from "react";
import { Search, X } from "lucide-react";
import "../../../assets/styles/ProductFilters.css";

const ProductFilters = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]); // chưa render UI, nhưng giữ sẵn
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      keyword,
      category,
      minPrice,
      maxPrice,
      // gửi dưới dạng string để BE nhận ổn định
      notes: Array.isArray(selectedNotes) ? selectedNotes.join(",") : "",
      rating,
      sortBy,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedNotes([]);
    setRating("");
    setSortBy("");
    onSearch({});
  };

  return (
    <div className="filters-container">
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-group">
          <label className="filter-label">Từ khóa</label>
          <div className="input-wrapper">
            <input
              type="text"
              className="filter-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Phân loại</label>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Men">Nước hoa Nam</option>
            <option value="Women">Nước hoa Nữ</option>
            <option value="Mini">Bộ sưu tập Mini</option>
            <option value="Giftset">Hộp quà tặng</option>
          </select>
        </div>

        <div className="filter-group price-group">
          <label className="filter-label">Khoảng giá</label>
          <div className="price-inputs">
            <input
              type="number"
              className="filter-input price-input"
              placeholder="Từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="price-separator">—</span>
            <input
              type="number"
              className="filter-input price-input"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sắp xếp theo</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="rating_desc">Đánh giá cao nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="filter-btn search-btn">
            <Search size={16} />
            <span>Tìm kiếm</span>
          </button>
          <button
            type="button"
            className="filter-btn reset-btn"
            onClick={handleReset}
          >
            <X size={16} />
            <span>Đặt lại</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilters;
