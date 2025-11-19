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
} from "lucide-react";
import "../../assets/styles/profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
