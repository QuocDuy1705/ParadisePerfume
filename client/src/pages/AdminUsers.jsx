import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="admin-section">
      <h2 className="admin-title">Quản lý người dùng</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Quyền</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">Chưa có user nào</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.isAdmin ? "admin" : "user"}
                    onChange={(e) =>
                      updateUserAdmin(u._id, e.target.value === "admin")
                    }
                    disabled={loading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => deleteUser(u._id)}
                    disabled={loading}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
