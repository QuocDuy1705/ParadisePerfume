import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../core/context/CartContext";
import "../../../assets/styles/home.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, 1);
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
      Men: "Nước hoa nam",
      Women: "Nước hoa nữ",
      Mini: "Bộ sưu tập mini",
      Giftset: "Hộp quà cao cấp",
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
