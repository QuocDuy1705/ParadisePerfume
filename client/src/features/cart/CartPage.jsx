import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../core/context/CartContext";
import { ShoppingBag, Plus, Minus, ArrowRight, X } from "lucide-react";
import { showSuccess, showError } from "../../core/utils/toast";
import axios from "axios";
import "../../assets/styles/cart.css";

const CartPage = () => {
  const { cart, loading, fetchCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      showError("Không thể cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
      showSuccess("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      showError("Không thể xóa sản phẩm");
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <ShoppingBag size={80} strokeWidth={1} />
            <h2>GIỎ HÀNG TRỐNG</h2>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/products")}
            >
              KHÁM PHÁ SẢN PHẨM
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">GIỎ HÀNG</h1>
          <p className="cart-subtitle">{cart.items.length} sản phẩm</p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image-wrapper">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="item-image"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  />
                </div>

                <div className="item-details">
                  <h3
                    className="item-name"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="item-category">
                    {item.product.category === "Men"
                      ? "Eau de Parfum Pour Homme"
                      : item.product.category === "Women"
                      ? "Eau de Parfum Pour Femme"
                      : "Eau de Toilette"}
                  </p>
                  <p className="item-price">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                <div className="item-quantity">
                  <label className="quantity-label">Số lượng</label>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p className="total-label">Tổng</p>
                  <p className="total-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.product._id)}
                  title="Xóa sản phẩm"
                >
                  <X size={20} />
                </button>
              </div>
            ))}

            <button
              className="continue-shopping-link"
              onClick={() => navigate("/products")}
            >
              ← Tiếp tục mua sắm
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2 className="summary-title">TÓM TẮT ĐƠN HÀNG</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span className="free-shipping">Miễn phí</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Tổng cộng</span>
                  <span className="total-amount">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                THANH TOÁN
                <ArrowRight size={18} />
              </button>

              <div className="summary-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Đổi trả trong 30 ngày</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Sản phẩm chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
