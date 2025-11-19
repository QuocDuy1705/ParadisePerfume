import React from "react";
import { useWishlist } from "../../../core/context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../../core/context/CartContext";
import { showSuccess } from "../../../core/utils/toast";
import "../../../assets/styles/wishlist.css";

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product._id, 1);
    if (success) {
      showSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleClearAll = async () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?")) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="wishlist-title-section">
            <Heart size={32} className="wishlist-heart-icon" />
            <h1 className="wishlist-title">SẢN PHẨM YÊU THÍCH</h1>
          </div>
          <p className="wishlist-count">
            {wishlist.products.length}{" "}
            {wishlist.products.length === 1 ? "sản phẩm" : "sản phẩm"}
          </p>
          {wishlist.products.length > 0 && (
            <button className="clear-wishlist-btn" onClick={handleClearAll}>
              <Trash2 size={18} />
              XÓA TẤT CẢ
            </button>
          )}
        </div>

        {wishlist.products.length === 0 ? (
          <div className="wishlist-empty">
            <Heart size={64} className="empty-heart-icon" />
            <h2>DANH SÁCH YÊU THÍCH TRỐNG</h2>
            <p>Thêm các sản phẩm yêu thích để dễ dàng tìm lại sau này</p>
            <button
              className="browse-products-btn"
              onClick={() => navigate("/")}
            >
              KHÁM PHÁ SẢN PHẨM
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.products.map((product) => (
              <div key={product._id} className="wishlist-card">
                <button
                  className="remove-from-wishlist-btn"
                  onClick={() => handleRemove(product._id)}
                  aria-label="Xóa khỏi danh sách yêu thích"
                >
                  <Heart size={20} fill="currentColor" />
                </button>

                <div
                  className="wishlist-product-image"
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="wishlist-product-info">
                  <h3
                    className="wishlist-product-name"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.name}
                  </h3>
                  <p className="wishlist-product-category">
                    {product.category === "Men"
                      ? "Nước hoa nam"
                      : product.category === "Women"
                      ? "Nước hoa nữ"
                      : product.category === "Mini"
                      ? "Bộ sưu tập mini"
                      : "Hộp quà tặng"}
                  </p>
                  <p className="wishlist-product-price">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <button
                  className="wishlist-add-to-bag-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag size={18} />
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
