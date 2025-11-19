import React from "react";
import { useCart } from "../../../core/context/CartContext";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/cartSidebar.css";

const CartSidebar = () => {
  const {
    cart,
    loading,
    updateCartItem,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    navigate("/checkout");
    setIsCartOpen(false);
  };

  const totalAmount =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isCartOpen ? "active" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h2>GIỎ HÀNG</h2>
          <button
            className="close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Đóng giỏ hàng"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        {/* Items Count */}
        {cart?.items?.length > 0 && (
          <div className="cart-count">
            {totalItems} {totalItems === 1 ? "sản phẩm" : "sản phẩm"}
          </div>
        )}

        {/* Body */}
        <div className="cart-body">
          {loading ? (
            <div className="cart-empty">
              <p>Đang tải...</p>
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path
                    d="M20 25L30 20L50 20L60 25L60 60L20 60L20 25Z"
                    stroke="#ddd"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M30 25V20C30 15 35 10 40 10C45 10 50 15 50 20V25"
                    stroke="#ddd"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <p className="empty-text">Giỏ hàng của bạn đang trống</p>
              <button
                className="continue-shopping-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <p className="cart-item-type">{item.product.type}</p>
                    <p className="cart-item-price">
                      {item.product.price.toLocaleString("vi-VN")}₫
                    </p>

                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button
                          onClick={() =>
                            updateCartItem(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItem(item.product._id, item.quantity + 1)
                          }
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="remove-btn"
                        aria-label="Xóa sản phẩm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="summary-row total">
                <span>TỔNG CỘNG</span>
                <span className="total-amount">
                  {totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <p className="tax-note">Đã bao gồm thuế VAT</p>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              THANH TOÁN
            </button>

            <button
              className="continue-shopping-link"
              onClick={() => setIsCartOpen(false)}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
