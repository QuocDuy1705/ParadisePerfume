import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../core/context/CartContext";
import LazyImage from "../../../components/LazyImage";
import "../../../assets/styles/home.css";

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await addToCart(product._id, 1);
    },
    [addToCart, product._id]
  );

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
        <LazyImage
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        <h3>{product.name}</h3>
        <p className="product-category">{formatCategory(product.category)}</p>
        <p className="price">{formatPrice(product.price)}</p>
      </Link>
      <button className="add-to-bag" onClick={handleAddToCart}>
        Thêm vào giỏ
      </button>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
