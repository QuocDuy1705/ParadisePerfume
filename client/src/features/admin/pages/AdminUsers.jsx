import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Shield,
  User,
  Trash2,
  Calendar,
  UserPlus,
  X,
  Eye,
  EyeOff,
  Info,
  Mail,
  MapPin,
  Clock,
  Bookmark,
} from "lucide-react";
import "../../../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "Vietnam",
    isAdmin: false,
  });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

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

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");

    // Validation
    if (
      !createForm.firstName ||
      !createForm.lastName ||
      !createForm.email ||
      !createForm.password
    ) {
      setCreateError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (createForm.password.length < 6) {
      setCreateError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      setCreateError("Email không hợp lệ");
      return;
    }

    setCreateLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/register",
        {
          title: "Mr",
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          email: createForm.email,
          password: createForm.password,
          country: createForm.country,
          isAdmin: createForm.isAdmin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form and close modal
      setCreateForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        country: "Vietnam",
        isAdmin: false,
      });
      setShowCreateModal(false);
      setCreateError("");

      // Refresh user list
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi khi tạo user:", err);
      setCreateError(
        err.response?.data?.message ||
          "Không thể tạo tài khoản. Email có thể đã tồn tại."
      );
    } finally {
      setCreateLoading(false);
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
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <UserPlus size={18} />
            Tạo tài khoản
          </button>
        </div>
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
                    className="btn-icon btn-info"
                    onClick={() => viewUserDetails(user)}
                    title="Xem chi tiết"
                  >
                    <Info size={18} />
                  </button>
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

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Thông tin chi tiết người dùng</h2>
              <button
                className="btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="user-detail-content">
              <div className="detail-section">
                <div className="detail-avatar">
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt="Avatar" />
                  ) : (
                    <User size={64} />
                  )}
                </div>
                <h3>
                  {selectedUser.title && `${selectedUser.title}. `}
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <span
                  className={`role-badge ${
                    selectedUser.isAdmin ? "admin" : "user"
                  }`}
                >
                  {selectedUser.isAdmin ? (
                    <>
                      <Shield size={14} /> Quản trị viên
                    </>
                  ) : (
                    <>
                      <User size={14} /> Người dùng
                    </>
                  )}
                </span>
              </div>

              <div className="detail-section">
                <h4>Thông tin cá nhân</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <Mail size={18} />
                    <div>
                      <label>Email</label>
                      <p>{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <label>Quốc gia</label>
                      <p>{selectedUser.country || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Shield size={18} />
                    <div>
                      <label>Phương thức đăng nhập</label>
                      <p>
                        {selectedUser.authProvider === "google" ? (
                          <span className="auth-badge google">Google</span>
                        ) : (
                          <span className="auth-badge local">
                            Email/Password
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {selectedUser.googleId && (
                    <div className="detail-item">
                      <Shield size={18} />
                      <div>
                        <label>Google ID</label>
                        <p className="mono-text">{selectedUser.googleId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Thông tin tài khoản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <label>Ngày tạo tài khoản</label>
                      <p>
                        {new Date(selectedUser.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Clock size={18} />
                    <div>
                      <label>Cập nhật lần cuối</label>
                      <p>
                        {new Date(selectedUser.updatedAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Bookmark size={18} />
                    <div>
                      <label>Voucher đã lưu</label>
                      <p>{selectedUser.savedCoupons?.length || 0} voucher</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <User size={18} />
                    <div>
                      <label>User ID</label>
                      <p className="mono-text">{selectedUser._id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo tài khoản mới</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="create-user-form">
              {createError && (
                <div className="alert alert-error">{createError}</div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Tên *</label>
                  <input
                    type="text"
                    id="firstName"
                    value={createForm.firstName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Nhập tên"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Họ *</label>
                  <input
                    type="text"
                    id="lastName"
                    value={createForm.lastName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, lastName: e.target.value })
                    }
                    placeholder="Nhập họ"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Quốc gia</label>
                <select
                  id="country"
                  value={createForm.country}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, country: e.target.value })
                  }
                >
                  <option value="Vietnam">Vietnam</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="Korea">Korea</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={createForm.isAdmin}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        isAdmin: e.target.checked,
                      })
                    }
                  />
                  <Shield size={16} />
                  <span>Cấp quyền quản trị viên</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createLoading}
                >
                  {createLoading ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
