import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  MapPin,
  Package,
  Calendar,
  CreditCard,
  LogOut,
  Edit2,
  Heart,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
  Ticket,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import "../../assets/styles/profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        // Lấy profile
        const resUser = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(resUser.data);

        // Lấy order history
        const resOrders = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(resOrders.data);

        // Lấy saved coupons
        const resCoupons = await axios.get(
          "http://localhost:5000/api/coupons/saved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedCoupons(resCoupons.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordSuccess("Đổi mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại!"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã copy mã: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUnsaveCoupon = async (couponId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/coupons/unsave/${couponId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedCoupons(savedCoupons.filter((c) => c._id !== couponId));
      toast.success("Đã bỏ lưu voucher");
    } catch (error) {
      toast.error("Không thể bỏ lưu voucher");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      Pending: "status-pending",
      Processing: "status-processing",
      Shipped: "status-shipped",
      Delivered: "status-delivered",
      Completed: "status-completed",
      Cancelled: "status-cancelled",
    };
    return statusMap[status] || "status-pending";
  };

  const getStatusText = (order) => {
    if (order.status) return order.status;
    return order.isPaid ? "Đã thanh toán" : "Chờ thanh toán";
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-title-section">
            <h1 className="profile-title">TÀI KHOẢN CỦA TÔI</h1>
            <p className="profile-subtitle">Xin chào, {user?.firstName}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            ĐĂNG XUẤT
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            Thông tin cá nhân
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <Package size={18} />
            Đơn hàng của tôi
          </button>
          <button
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <Lock size={18} />
            Đổi mật khẩu
          </button>
          <button
            className={`tab-btn ${activeTab === "coupons" ? "active" : ""}`}
            onClick={() => setActiveTab("coupons")}
          >
            <Ticket size={18} />
            Voucher đã lưu
          </button>
          <button
            className={`tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={18} />
            Danh sách yêu thích
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === "profile" && user && (
            <div className="profile-info-section">
              <div className="info-header">
                <h2 className="section-title">THÔNG TIN CÁ NHÂN</h2>
                <button className="edit-btn">
                  <Edit2 size={16} />
                  CHỈNH SỬA
                </button>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">
                    <User size={24} />
                  </div>
                  <div className="info-details">
                    <label className="info-label">Họ và tên</label>
                    <p className="info-value">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="info-details">
                    <label className="info-label">Địa chỉ email</label>
                    <p className="info-value">{user.email}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="info-details">
                    <label className="info-label">Quốc gia</label>
                    <p className="info-value">
                      {user.country || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="info-details">
                    <label className="info-label">Thành viên từ</label>
                    <p className="info-value">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="account-stats">
                <div className="stat-card">
                  <ShoppingBag size={32} />
                  <div className="stat-number">{orders.length}</div>
                  <div className="stat-label">Tổng đơn hàng</div>
                </div>
                <div className="stat-card">
                  <Package size={32} />
                  <div className="stat-number">
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Delivered" || o.status === "Completed"
                      ).length
                    }
                  </div>
                  <div className="stat-label">Đã giao hàng</div>
                </div>
                <div className="stat-card">
                  <CreditCard size={32} />
                  <div className="stat-number">
                    {formatPrice(
                      orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                    )}
                  </div>
                  <div className="stat-label">Tổng chi tiêu</div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="orders-section">
              <div className="section-header">
                <h2 className="section-title">ĐỚN HÀNG CỦA TÔI</h2>
                <p className="section-subtitle">{orders.length} đơn hàng</p>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={64} />
                  <h3>Chưa có đơn hàng</h3>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <button
                    className="shop-now-btn"
                    onClick={() => navigate("/products")}
                  >
                    KHÁM PHÁ SẢN PHẨM
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span className="order-label">ĐƠN HÀNG</span>
                          <span className="order-number">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <span
                          className={`order-status ${getStatusClass(
                            getStatusText(order)
                          )}`}
                        >
                          {getStatusText(order)}
                        </span>
                      </div>

                      <div className="order-info">
                        <div className="order-detail">
                          <Calendar size={16} />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="order-detail">
                          <Package size={16} />
                          <span>{order.items?.length || 0} sản phẩm</span>
                        </div>
                        <div className="order-detail">
                          <CreditCard size={16} />
                          <span className="order-total">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="order-items">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="order-item">
                              <img
                                src={
                                  item.productId?.image || "/placeholder.png"
                                }
                                alt={item.productId?.name || "Product"}
                                className="order-item-image"
                              />
                              <div className="order-item-details">
                                <p className="order-item-name">
                                  {item.productId?.name || "Sản phẩm"}
                                </p>
                                <p className="order-item-quantity">
                                  SL: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="more-items">
                              +{order.items.length - 2} sản phẩm khác
                            </p>
                          )}
                        </div>
                      )}

                      <div className="order-footer">
                        <button
                          className="view-order-btn"
                          onClick={() => navigate(`/orders`)}
                        >
                          XEM CHI TIẾT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div className="password-section">
              <div className="section-header">
                <h2 className="section-title">ĐỔI MẬT KHẨU</h2>
                <p className="section-subtitle">
                  Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với
                  người khác
                </p>
              </div>

              <form className="password-form" onSubmit={handlePasswordChange}>
                {passwordError && (
                  <div className="alert alert-error">
                    <span>⚠️ {passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="alert alert-success">
                    <span>✓ {passwordSuccess}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="currentPassword">
                    <Lock size={18} />
                    Mật khẩu hiện tại *
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    <Lock size={18} />
                    Mật khẩu mới *
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <Lock size={18} />
                    Xác nhận mật khẩu mới *
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="password-requirements">
                  <p className="requirements-title">Yêu cầu mật khẩu:</p>
                  <ul>
                    <li
                      className={
                        passwordForm.newPassword.length >= 6 ? "valid" : ""
                      }
                    >
                      ✓ Ít nhất 6 ký tự
                    </li>
                    <li
                      className={
                        passwordForm.newPassword &&
                        passwordForm.newPassword ===
                          passwordForm.confirmPassword
                          ? "valid"
                          : ""
                      }
                    >
                      ✓ Mật khẩu xác nhận khớp
                    </li>
                    <li
                      className={
                        passwordForm.currentPassword &&
                        passwordForm.newPassword &&
                        passwordForm.currentPassword !==
                          passwordForm.newPassword
                          ? "valid"
                          : ""
                      }
                    >
                      ✓ Khác mật khẩu hiện tại
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="change-password-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "ĐANG XỬ LÝ..." : "ĐỔI MẬT KHẨU"}
                </button>
              </form>
            </div>
          )}

          {/* Saved Coupons Tab */}
          {activeTab === "coupons" && (
            <div className="saved-coupons-section">
              <div className="section-header">
                <h2 className="section-title">VOUCHER ĐÃ LƯU</h2>
                <button
                  className="browse-coupons-btn"
                  onClick={() => navigate("/voucher-hunt")}
                >
                  <Ticket size={16} />
                  Săn thêm voucher
                </button>
              </div>

              {savedCoupons.length === 0 ? (
                <div className="empty-coupons">
                  <Ticket size={80} strokeWidth={1} />
                  <h3>Chưa có voucher nào</h3>
                  <p>Ghé trang săn voucher để lưu các mã giảm giá hấp dẫn!</p>
                  <button
                    className="browse-btn"
                    onClick={() => navigate("/voucher-hunt")}
                  >
                    Săn voucher ngay
                  </button>
                </div>
              ) : (
                <div className="coupons-grid">
                  {savedCoupons.map((coupon) => (
                    <div key={coupon._id} className="saved-coupon-card">
                      <div className="coupon-header">
                        <div className="coupon-discount">
                          <span className="discount-value">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : `${coupon.discountValue.toLocaleString()}đ`}
                          </span>
                          <span className="discount-label">GIẢM</span>
                        </div>
                        <button
                          className="remove-coupon-btn"
                          onClick={() => handleUnsaveCoupon(coupon._id)}
                          title="Bỏ lưu"
                        >
                          ×
                        </button>
                      </div>

                      <div className="coupon-body">
                        <h4 className="coupon-description">
                          {coupon.description}
                        </h4>

                        <div className="coupon-details">
                          {coupon.minOrderAmount > 0 && (
                            <p className="detail-item">
                              📦 Đơn tối thiểu:{" "}
                              {coupon.minOrderAmount.toLocaleString()}đ
                            </p>
                          )}
                          {coupon.maxDiscountAmount && (
                            <p className="detail-item">
                              💰 Giảm tối đa:{" "}
                              {coupon.maxDiscountAmount.toLocaleString()}đ
                            </p>
                          )}
                          {coupon.endDate && (
                            <p className="detail-item">
                              📅 HSD:{" "}
                              {new Date(coupon.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          )}
                        </div>

                        <div className="coupon-code-section">
                          <div className="code-box">
                            <code>{coupon.code}</code>
                          </div>
                          <button
                            className="copy-code-btn"
                            onClick={() => handleCopyCode(coupon.code)}
                          >
                            {copiedCode === coupon.code ? (
                              <>
                                <Check size={16} />
                                Đã copy
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
