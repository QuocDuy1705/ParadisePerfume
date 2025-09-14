import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../assets/styles/category.css";

const CategoryPage = ({ category, title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products/category/${category}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi load sản phẩm:", err);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="category-page">
      <h1>{title}</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        ) : (
          <p>Không có sản phẩm nào trong mục này.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
