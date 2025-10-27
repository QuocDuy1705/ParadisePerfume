import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { showSuccess, showWarning, showError } from "../utils/toast";
import "../assets/styles/home.css";

const API_URL = "http://localhost:5000/api";

const ProductCard = ({ product }) => {
  const { fetchCart, setIsCartOpen } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        return;
      }

      await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
      setIsCartOpen(true);
      showSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      showError("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  // Format giá VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format tên danh mục
  const formatCategory = (category) => {
    const categories = {
      Men: "Eau de Parfum Pour Homme",
      Women: "Eau de Parfum Pour Femme",
      Mini: "Miniature Collection",
      Giftset: "Coffret Prestige",
    };
    return categories[category] || category;
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="product-category">{formatCategory(product.category)}</p>
        <p className="price">{formatPrice(product.price)}</p>
      </Link>
      <button className="add-to-bag" onClick={handleAddToCart}>
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ProductCard;
