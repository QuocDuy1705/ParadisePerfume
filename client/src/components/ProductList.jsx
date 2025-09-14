import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../assets/styles/productList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // lấy từ .env

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };
    fetchData();
  }, [API_URL]);

  return (
    <div className="product-page">
      <div className="filter-bar">
        <span>☰ FILTERS</span>
        <span>{products.length} products</span>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
