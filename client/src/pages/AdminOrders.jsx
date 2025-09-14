import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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
      alert("Cập nhật trạng thái thất bại! Xem log console để biết chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-section">
      <h2 className="admin-title">Quản lý đơn hàng</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Người đặt</th>
            <th>Email</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6">Chưa có đơn hàng nào</td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td>
                  {o.userId
                    ? `${o.userId.firstName} ${o.userId.lastName}`
                    : "Unknown"}
                </td>
                <td>{o.userId?.email || "Không có email"}</td>
                <td>${o.totalPrice?.toFixed(2)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => setSelectedOrder(o)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal xem chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chi tiết đơn hàng</h3>
            <p>
              <strong>Người đặt:</strong>{" "}
              {selectedOrder.userId
                ? `${selectedOrder.userId.firstName} ${selectedOrder.userId.lastName}`
                : "Unknown"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userId?.email}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className="status-badge">{selectedOrder.status}</span>
            </p>

            <h4>Sản phẩm trong đơn</h4>
            <ul>
              {selectedOrder.items.map((i) => (
                <li key={i._id}>
                  {i.productId?.name || "SP đã xóa"} × {i.quantity} = $
                  {(i.productId?.price * i.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <p>
              <strong>Tổng tiền:</strong> $
              {selectedOrder.totalPrice?.toFixed(2)}
            </p>

            <button
              className="btn-close"
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
