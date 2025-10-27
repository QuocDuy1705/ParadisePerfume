import React, { useEffect } from "react";
import "../assets/styles/orderSuccess.css";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const OrderSuccess = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod || "COD";
  const totalAmount = location.state?.totalAmount;

  // Clear cart when arriving at success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleContinueShopping = () => {
    console.log("Navigate to home");
    window.location.href = "/";
  };

  const handleViewOrders = () => {
    console.log("Navigate to orders");
    window.location.href = "/orders";
  };

  const getPaymentMethodName = (method) => {
    switch (method?.toLowerCase()) {
      case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
      case "cod":
      default:
        return "Thanh toán khi nhận hàng (COD)";
    }
  };

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        {/* Success Icon */}
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#000" strokeWidth="2" />
            <path
              d="M25 40L35 50L55 30"
              stroke="#000"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="order-title">CẢM ƠN BẠN</h1>
        <p className="order-subtitle">
          Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email khi đơn hàng
          được giao cho đơn vị vận chuyển.
        </p>

        {/* Order Details */}
        {orderId && (
          <div className="order-details">
            <div className="order-detail-row">
              <span className="detail-label">Mã đơn hàng:</span>
              <span className="detail-value">
                #{orderId.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="order-detail-row">
              <span className="detail-label">Phương thức thanh toán:</span>
              <span className="detail-value">
                {getPaymentMethodName(paymentMethod)}
              </span>
            </div>
            {totalAmount && (
              <div className="order-detail-row">
                <span className="detail-label">Tổng tiền:</span>
                <span className="detail-value highlight">
                  {totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            )}
          </div>
        )}

        <div className="divider"></div>

        <p className="order-message">
          Hãy tận hưởng trải nghiệm mua sắm tại <strong>PARADISE</strong> – lấy
          cảm hứng từ sự tinh tế của Chanel.
        </p>

        <div className="order-actions">
          <button
            onClick={handleContinueShopping}
            className="btn-home"
            type="button"
          >
            TIẾP TỤC MUA SẮM
          </button>
          <button
            onClick={handleViewOrders}
            className="btn-orders"
            type="button"
          >
            XEM ĐƠN HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
