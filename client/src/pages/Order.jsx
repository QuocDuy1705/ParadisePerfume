import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Truck,
  ArrowLeft,
} from "lucide-react";
import "../assets/styles/orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

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
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div className="header-content">
            <h1 className="orders-title">ĐƠN HÀNG CỦA TÔI</h1>
            <p className="orders-subtitle">{orders.length} đơn hàng</p>
          </div>
          <button
            className="back-to-profile-btn"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={18} />
            VỀ TÀI KHOẢN
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <Package size={80} />
            <h3>Chưa có đơn hàng</h3>
            <p>Bạn chưa có đơn hàng nào.</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>
              KHÁM PHÁ SẢN PHẨM
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-detail-card">
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-label">MÃ ĐƠN HÀNG</span>
                    <span className="order-number">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`order-status-badge ${getStatusClass(
                      getStatusText(order)
                    )}`}
                  >
                    {getStatusText(order)}
                  </span>
                </div>

                {/* Order Info */}
                <div className="order-card-info">
                  <div className="info-item">
                    <Calendar size={18} />
                    <div>
                      <span className="info-label">Ngày đặt</span>
                      <span className="info-value">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <CreditCard size={18} />
                    <div>
                      <span className="info-label">Tổng tiền</span>
                      <span className="info-value price">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <Truck size={18} />
                    <div>
                      <span className="info-label">Phương thức thanh toán</span>
                      <span className="info-value">
                        {order.paymentMethod || "COD"}
                      </span>
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="info-item">
                      <MapPin size={18} />
                      <div>
                        <span className="info-label">Địa chỉ giao hàng</span>
                        <span className="info-value">
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="order-products">
                    <h4 className="products-title">Sản phẩm đã đặt</h4>
                    <div className="products-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <img
                            src={item.productId?.image || "/placeholder.png"}
                            alt={item.productId?.name || "Sản phẩm"}
                            className="product-image"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <div className="product-details">
                            <p className="product-name">
                              {item.productId?.name || "Sản phẩm"}
                            </p>
                            <p className="product-quantity">
                              Số lượng: {item.quantity}
                            </p>
                            <p className="product-price">
                              {formatPrice(
                                item.price || item.productId?.price || 0
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>
                      {formatPrice(order.itemsPrice || order.totalPrice)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(order.shippingPrice || 0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Thuế:</span>
                    <span>{formatPrice(order.taxPrice || 0)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
