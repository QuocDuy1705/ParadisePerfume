import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Shield, User, Trash2, Calendar } from "lucide-react";
import "../../../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
    }
  };

  const updateUserAdmin = async (id, isAdmin) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/users/${id}`,
        { isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.isAdmin === (filter === "admin"));

  return (
    <div className="admin-section">
      <div className="section-header">
        <div>
          <h2 className="admin-title">Quản lý người dùng</h2>
          <p className="section-subtitle">Danh sách người dùng và phân quyền</p>
        </div>
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất cả ({users.length})
          </button>
          <button
            className={`filter-btn ${filter === "admin" ? "active" : ""}`}
            onClick={() => setFilter("admin")}
          >
            Admin ({users.filter((u) => u.isAdmin).length})
          </button>
          <button
            className={`filter-btn ${filter === "user" ? "active" : ""}`}
            onClick={() => setFilter("user")}
          >
            User ({users.filter((u) => !u.isAdmin).length})
          </button>
        </div>
      </div>

      <div className="users-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={64} strokeWidth={1} />
            <h3>Chưa có người dùng nào</h3>
            <p>Danh sách người dùng sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">
                  <User size={32} />
                </div>
                <div className="user-info">
                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="user-email">{user.email}</p>
                  <div className="user-meta">
                    <span className="meta-item">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="user-actions">
                  <div className="role-selector">
                    <label>
                      <Shield size={16} />
                      Vai trò:
                    </label>
                    <select
                      className="role-select"
                      value={user.isAdmin ? "admin" : "user"}
                      onChange={(e) =>
                        updateUserAdmin(user._id, e.target.value === "admin")
                      }
                      disabled={loading}
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => deleteUser(user._id)}
                    disabled={loading}
                    title="Xóa người dùng"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
