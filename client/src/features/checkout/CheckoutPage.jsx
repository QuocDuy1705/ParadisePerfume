import React, { useState, useEffect } from "react";
import { useCart } from "../../core/context/CartContext";
import { useNavigate } from "react-router-dom";
import { showError, showWarning, showSuccess } from "../../core/utils/toast";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
} from "../../core/utils/validators";
import api from "../../core/utils/api";
import "../../assets/styles/checkout.css";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
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

  // Hàm áp dụng coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã coupon");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/coupons/validate",
        {
          code: couponCode.toUpperCase(),
          orderAmount: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.valid) {
        console.log("✅ Coupon data:", response.data.coupon);
        setAppliedCoupon(response.data.coupon);
        setCouponError("");
        showSuccess(`Áp dụng mã "${couponCode}" thành công!`);
      }
    } catch (error) {
      console.error("❌ Coupon error:", error.response?.data);
      setCouponError(error.response?.data?.message || "Mã coupon không hợp lệ");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Hàm xóa coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const shippingFee = 30000; // 30,000₫

  // Tính toán giảm giá từ coupon
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.min(
          (totalPrice * appliedCoupon.discountValue) / 100,
          appliedCoupon.maxDiscountAmount || Infinity
        )
      : appliedCoupon.discountValue
    : 0;

  const finalTotal = totalPrice + shippingFee - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form inputs
      const nameValidation = validateName(form.fullName);
      if (!nameValidation.isValid) {
        showWarning(nameValidation.message);
        setLoading(false);
        return;
      }

      const emailValidation = validateEmail(form.email);
      if (!emailValidation.isValid) {
        showWarning(emailValidation.message);
        setLoading(false);
        return;
      }

      const phoneValidation = validatePhone(form.phone);
      if (!phoneValidation.isValid) {
        showWarning(phoneValidation.message);
        setLoading(false);
        return;
      }

      const addressValidation = validateAddress(form.address);
      if (!addressValidation.isValid) {
        showWarning(addressValidation.message);
        setLoading(false);
        return;
      }

      if (!form.city || form.city.trim() === "") {
        showWarning("Vui lòng chọn Tỉnh/Thành phố");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const isGuest = !token;

      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
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
        totalPrice: finalTotal,
        shippingFee,
        couponCode: appliedCoupon?.code || null,
        discount: discountAmount,
      };

      // Thêm guestEmail nếu là guest
      if (isGuest) {
        orderData.guestEmail = form.email;
      }

      // Xử lý theo phương thức thanh toán
      if (form.paymentMethod === "bank_transfer") {
        // Thanh toán qua TP Bank QR Code
        const endpoint = isGuest
          ? "/payment/guest/create-bank-order"
          : "/payment/create-bank-order";

        const res = await api.post(endpoint, orderData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.data.success) {
          // Hiển thị QR Code modal
          setQRData(res.data.data);
          setShowQRModal(true);
        } else {
          showError("Không thể tạo mã QR thanh toán");
        }
      } else {
        // Thanh toán COD
        const endpoint = isGuest
          ? "/payment/guest/create-cod-order"
          : "/payment/create-cod-order";

        const res = await api.post(endpoint, orderData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log("COD Order created:", res.data);

        // Điều hướng sang trang success
        navigate("/order-success", {
          state: {
            orderId: res.data.data.orderId,
            orderNumber: res.data.data.orderNumber,
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
                    value="bank_transfer"
                    checked={form.paymentMethod === "bank_transfer"}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <span className="payment-name">
                      Chuyển khoản ngân hàng (TP Bank)
                    </span>
                    <span className="payment-desc">
                      Quét mã QR để thanh toán nhanh chóng
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

            {/* Coupon Section */}
            <div className="coupon-section">
              <h3 className="coupon-title">MÃ GIẢM GIÁ</h3>

              {!appliedCoupon ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-apply-coupon"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "..." : "ÁP DỤNG"}
                  </button>
                </div>
              ) : (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2 8h16M4 4h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                        stroke="#000"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <div>
                      <strong>{appliedCoupon.code}</strong>
                      <span className="coupon-desc">
                        {appliedCoupon.description}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-coupon"
                    onClick={handleRemoveCoupon}
                  >
                    ✕
                  </button>
                </div>
              )}

              {couponError && (
                <div className="coupon-error">⚠️ {couponError}</div>
              )}
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

              {appliedCoupon && (
                <div className="calc-row discount">
                  <span>Giảm giá ({appliedCoupon.code})</span>
                  <span className="discount-amount">
                    -{discountAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
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

      {/* QR Code Payment Modal */}
      {showQRModal && qrData && (
        <div className="qr-modal-overlay" onClick={() => setShowQRModal(false)}>
          <div
            className="qr-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="qr-modal-close"
              onClick={() => setShowQRModal(false)}
            >
              ✕
            </button>

            <h2 className="qr-modal-title">QUÉT MÃ QR ĐỂ THANH TOÁN</h2>

            <div className="qr-code-container">
              <img
                src={qrData.qrCodeUrl}
                alt="QR Code Payment"
                className="qr-code-image"
              />
            </div>

            <div className="bank-info-box">
              <h3>THÔNG TIN CHUYỂN KHOẢN</h3>
              <div className="bank-info-row">
                <span className="info-label">Ngân hàng:</span>
                <span className="info-value">{qrData.bankInfo.bankName}</span>
              </div>
              <div className="bank-info-row">
                <span className="info-label">Số tài khoản:</span>
                <span className="info-value">
                  {qrData.bankInfo.accountNumber}
                </span>
              </div>
              <div className="bank-info-row">
                <span className="info-label">Chủ tài khoản:</span>
                <span className="info-value">
                  {qrData.bankInfo.accountName}
                </span>
              </div>
              <div className="bank-info-row highlight">
                <span className="info-label">Số tiền:</span>
                <span className="info-value amount">
                  {qrData.bankInfo.amount.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="bank-info-row highlight">
                <span className="info-label">Nội dung CK:</span>
                <span className="info-value content">
                  {qrData.bankInfo.content}
                </span>
              </div>
            </div>

            <div className="qr-instructions">
              <h4>📱 HƯỚNG DẪN THANH TOÁN</h4>
              <ol>
                <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                <li>
                  Chọn chức năng <strong>"Quét mã QR"</strong>
                </li>
                <li>Quét mã QR phía trên</li>
                <li>Kiểm tra thông tin và xác nhận thanh toán</li>
              </ol>
              <div className="warning-note">
                <strong>⚠️ LƯU Ý:</strong> Vui lòng ghi ĐÚNG nội dung chuyển
                khoản <strong>{qrData.bankInfo.content}</strong> để đơn hàng
                được xử lý nhanh chóng.
              </div>
            </div>

            <button
              className="btn-confirm-paid"
              onClick={() => {
                setShowQRModal(false);
                navigate("/order-success", {
                  state: {
                    orderId: qrData.orderId,
                    orderNumber: qrData.orderNumber,
                    paymentMethod: "bank_transfer",
                    totalAmount: finalTotal,
                  },
                  replace: true,
                });
              }}
            >
              TÔI ĐÃ CHUYỂN KHOẢN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
