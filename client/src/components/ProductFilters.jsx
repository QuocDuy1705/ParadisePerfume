import React, { useState } from "react";
import "../assets/styles/ProductFilters.css";

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
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label>Từ khoá:</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Phân loại:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="Men">Nước hoa Nam</option>
          <option value="Women">Nước hoa Nữ</option>
          <option value="Mini">Mini</option>
          <option value="Giftset">Giftset</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Giá:</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span> - </span>
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Sắp xếp theo:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Mặc định</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="rating_desc">Đánh giá cao</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>

      <div className="filter-submit">
        <button type="submit">Tìm kiếm</button>
        <button type="button" className="reset-btn" onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </form>
  );
};

export default ProductFilters;
