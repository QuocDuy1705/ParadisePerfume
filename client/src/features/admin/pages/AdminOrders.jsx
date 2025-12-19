import React, { useEffect, useState } from "react";
import axios from "axios";
import { showError } from "../../../core/utils/toast";
import {
  ShoppingBag,
  Eye,
  X,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "../../../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(
        "❌ Lỗi khi lấy đơn hàng:",
        err.response?.data || err.message
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/orders/${orderId}`,
        { status: newStatus }, // gửi đúng key "status"
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(" Kết quả update:", res.data);

      // cập nhật lại danh sách
      await fetchOrders();

      // đồng bộ với modal nếu đang mở
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error(
        "❌ Lỗi khi cập nhật trạng thái:",
        err.response?.data || err.message
      );
      showError("Cập nhật trạng thái thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-section">
      <div className="section-header">
        <div>
          <h2 className="admin-title">Quản lý đơn hàng</h2>
          <p className="section-subtitle">Danh sách đơn hàng và trạng thái</p>
        </div>
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất cả ({orders.length})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Chờ xử lý ({orders.filter((o) => o.status === "pending").length})
          </button>
          <button
            className={`filter-btn ${filter === "shipped" ? "active" : ""}`}
            onClick={() => setFilter("shipped")}
          >
            Đang giao ({orders.filter((o) => o.status === "shipped").length})
          </button>
          <button
            className={`filter-btn ${filter === "delivered" ? "active" : ""}`}
            onClick={() => setFilter("delivered")}
          >
            Đã giao ({orders.filter((o) => o.status === "delivered").length})
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={64} strokeWidth={1} />
            <h3>Chưa có đơn hàng nào</h3>
            <p>Đơn hàng sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>
                      {order.userId
                        ? `${order.userId.firstName} ${order.userId.lastName}`
                        : "Khách hàng"}
                    </h3>
                    <p className="order-email">
                      {order.userId?.email || "N/A"}
                    </p>
                  </div>
                  <div className={`status-badge status-${order.status}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-info">
                  <div className="info-row">
                    <span className="info-label">Ngày đặt:</span>
                    <span className="info-value">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Tổng tiền:</span>
                    <span className="info-value price">
                      {order.totalPrice?.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Sản phẩm:</span>
                    <span className="info-value">
                      {order.items?.length || 0} sản phẩm
                    </span>
                  </div>
                </div>

                <div className="order-actions">
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    disabled={loading}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={18} />
                    <span>Chi tiết</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal xem chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content order-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chi tiết đơn hàng</h3>
              <button
                className="btn-close-icon"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-detail-content">
              <div className="detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Họ tên:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.fullName ||
                        (selectedOrder.userId
                          ? `${selectedOrder.userId.firstName} ${selectedOrder.userId.lastName}`
                          : "N/A")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.email ||
                        selectedOrder.userId?.email ||
                        selectedOrder.guestEmail ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày đặt:</span>
                    <span className="detail-value">
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái:</span>
                    <span
                      className={`status-badge status-${selectedOrder.status}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span>{getStatusText(selectedOrder.status)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Địa chỉ giao hàng</h4>
                <div className="detail-grid">
                  <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="detail-label">Địa chỉ:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.address || "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quận/Huyện:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.district || "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tỉnh/Thành phố:</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.city || "N/A"}
                    </span>
                  </div>
                  {selectedOrder.note && (
                    <div
                      className="detail-item"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <span className="detail-label">Ghi chú:</span>
                      <span className="detail-value">{selectedOrder.note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Sản phẩm trong đơn hàng</h4>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.productId?.image && (
                        <img
                          src={item.productId.image}
                          alt={item.productId?.name}
                        />
                      )}
                      <div className="item-info">
                        <h5>{item.productId?.name || "Sản phẩm đã xóa"}</h5>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {(
                          (item.productId?.price || 0) * item.quantity
                        ).toLocaleString("vi-VN")}
                        ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section total-section">
                <div className="total-row">
                  <span className="total-label">Tổng cộng:</span>
                  <span className="total-value">
                    {selectedOrder.totalPrice?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
