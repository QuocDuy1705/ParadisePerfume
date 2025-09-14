import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext"; // hook mình đã viết hôm trước
import "../assets/styles/home.css";

const API_URL = "http://localhost:5000/api";

const ProductCard = ({ product }) => {
  const { fetchCart, setIsCartOpen } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // ngăn reload trang
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // cập nhật lại giỏ hàng
      await fetchCart();

      // mở giỏ hàng sidebar
      setIsCartOpen(true);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="price">starting from ${product.price}</p>
      </Link>
      <button className="add-to-bag" onClick={handleAddToCart}>
        Add to Bag
      </button>
    </div>
  );
};

export default ProductCard;
