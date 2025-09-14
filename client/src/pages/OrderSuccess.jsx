import React from "react";
import "../assets/styles/orderSuccess.css";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <h1 className="order-title">CẢM ƠN BẠN</h1>
        <p className="order-subtitle">
          Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email khi đơn hàng
          được giao cho đơn vị vận chuyển.
        </p>

        <div className="divider"></div>

        <p className="order-message">
          Hãy tận hưởng trải nghiệm mua sắm tại <strong>PARADISE</strong> – lấy
          cảm hứng từ sự tinh tế của Chanel.
        </p>

        <div className="order-actions">
          <Link to="/" className="btn-home">
            TIẾP TỤC MUA SẮM
          </Link>
          <Link to="/profile" className="btn-orders">
            XEM ĐƠN HÀNG
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
