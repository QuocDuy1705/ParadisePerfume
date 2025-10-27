import React, { useState } from "react";
import {
  Package,
  ShoppingBag,
  BarChart3,
  Menu,
  Users,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import "../assets/styles/admin.css";

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <h1 className="admin-logo">{collapsed ? "P" : "PARADISE"}</h1>
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="admin-subtitle">
          {!collapsed && <span>Admin Console</span>}
        </div>

        <nav className="admin-nav">
          <button
            onClick={() => setTab("overview")}
            className={`admin-nav-item ${tab === "overview" ? "active" : ""}`}
            title="Tổng quan"
          >
            <BarChart3 size={20} />
            {!collapsed && <span>Tổng quan</span>}
          </button>

          <button
            onClick={() => setTab("products")}
            className={`admin-nav-item ${tab === "products" ? "active" : ""}`}
            title="Sản phẩm"
          >
            <Package size={20} />
            {!collapsed && <span>Sản phẩm</span>}
          </button>

          <button
            onClick={() => setTab("orders")}
            className={`admin-nav-item ${tab === "orders" ? "active" : ""}`}
            title="Đơn hàng"
          >
            <ShoppingBag size={20} />
            {!collapsed && <span>Đơn hàng</span>}
          </button>

          <button
            onClick={() => setTab("users")}
            className={`admin-nav-item ${tab === "users" ? "active" : ""}`}
            title="Người dùng"
          >
            <Users size={20} />
            {!collapsed && <span>Người dùng</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <LogOut size={20} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {tab === "overview" && <AdminOverview />}
        {tab === "products" && <AdminProducts />}
        {tab === "orders" && <AdminOrders />}
        {tab === "users" && <AdminUsers />}
      </main>
    </div>
  );
};

export default AdminDashboard;
