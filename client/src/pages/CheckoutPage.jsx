import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { showError, showWarning } from "../utils/toast";
import api from "../utils/api";
import "../assets/styles/checkout.css";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    note: "",
    paymentMethod: "cod",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const shippingFee = 30000; // 30,000₫
  const finalTotal = totalPrice + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning("Vui lòng đăng nhập để tiếp tục!");
        navigate("/auth");
        return;
      }

      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          district: form.district,
        },
        note: form.note,
        paymentMethod: form.paymentMethod,
        totalPrice: finalTotal,
        shippingFee,
      };

      // Xử lý theo phương thức thanh toán
      if (form.paymentMethod === "vnpay") {
        // Thanh toán VNPay
        const res = await api.post("/payment/vnpay", orderData);
        if (res.data.payUrl) {
          // Chuyển hướng đến VNPay
          window.location.href = res.data.payUrl;
        } else {
          showError("Không thể tạo liên kết thanh toán VNPay");
        }
      } else if (form.paymentMethod === "momo") {
        // Thanh toán MoMo
        const res = await api.post("/payment/momo", orderData);
        if (res.data.payUrl) {
          // Chuyển hướng đến MoMo
          window.location.href = res.data.payUrl;
        } else {
          showError("Không thể tạo liên kết thanh toán MoMo");
        }
      } else {
        // Thanh toán COD
        const res = await api.post("/orders", orderData);
        console.log("Order created:", res.data);

        // Điều hướng sang trang success với thông tin đầy đủ
        // KHÔNG clear cart ở đây để tránh useEffect redirect
        navigate("/order-success", {
          state: {
            orderId: res.data.order?._id,
            paymentMethod: "COD",
            totalAmount: finalTotal,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      showError(
        err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-label">Giỏ hàng</span>
        </div>
        <div className="step-line"></div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-label">Thông tin</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-label">Hoàn tất</span>
        </div>
      </div>

      <div className="checkout-container">
        {/* LEFT: FORM */}
        <div className="checkout-main">
          <h1 className="checkout-title">THÔNG TIN GIAO HÀNG</h1>

          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="form-section">
              <h2 className="section-title">Thông tin liên hệ</h2>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0901234567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h2 className="section-title">Địa chỉ giao hàng</h2>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="address">Địa chỉ *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="district">Quận/Huyện *</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Quận 1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Tỉnh/Thành phố *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Hồ Chí Minh"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="note">Ghi chú (tùy chọn)</label>
                  <textarea
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: giao hàng giờ hành chính"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2 className="section-title">Phương thức thanh toán</h2>

              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <span className="payment-name">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="payment-desc">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </span>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={form.paymentMethod === "vnpay"}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <span className="payment-name">VNPay</span>
                    <span className="payment-desc">
                      Thanh toán qua ví điện tử VNPay
                    </span>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={form.paymentMethod === "momo"}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <span className="payment-name">MoMo</span>
                    <span className="payment-desc">
                      Thanh toán qua ví điện tử MoMo
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-checkout" disabled={loading}>
              {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
            </button>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h2 className="summary-title">ĐỐN HÀNG CỦA BẠN</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <div className="item-image">
                    <img src={item.product.image} alt={item.product.name} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{item.product.name}</h4>
                    <p>{item.product.type}</p>
                  </div>
                  <div className="item-price">
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-calculations">
              <div className="calc-row">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="calc-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>TỔNG CỘNG</span>
              <span className="total-amount">
                {finalTotal.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <p className="tax-note">Đã bao gồm thuế VAT</p>
          </div>

          <div className="checkout-benefits">
            <div className="benefit-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L13 8L20 9L15 14L16 20L10 17L4 20L5 14L0 9L7 8L10 2Z"
                  fill="#000"
                />
              </svg>
              <span>Sản phẩm chính hãng 100%</span>
            </div>
            <div className="benefit-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="#000"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M6 10L9 13L14 7" stroke="#000" strokeWidth="1.5" />
              </svg>
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div className="benefit-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2V10L15 15"
                  stroke="#000"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="#000"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
