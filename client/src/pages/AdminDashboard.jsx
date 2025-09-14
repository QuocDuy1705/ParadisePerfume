import React, { useState } from "react";
import { Package, ShoppingBag, BarChart3, Menu, Users } from "lucide-react";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import "../assets/styles/admin.css";

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <h1 className="admin-logo">{collapsed ? "CA" : "PARADISE ADMIN"}</h1>
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <button
            onClick={() => setTab("overview")}
            className={`admin-nav-item ${tab === "overview" ? "active" : ""}`}
          >
            <BarChart3 size={18} />
            {!collapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => setTab("products")}
            className={`admin-nav-item ${tab === "products" ? "active" : ""}`}
          >
            <Package size={18} />
            {!collapsed && <span>Products</span>}
          </button>

          <button
            onClick={() => setTab("orders")}
            className={`admin-nav-item ${tab === "orders" ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            {!collapsed && <span>Orders</span>}
          </button>

          <button
            onClick={() => setTab("users")}
            className={`admin-nav-item ${tab === "users" ? "active" : ""}`}
          >
            <Users size={18} />
            {!collapsed && <span>Users</span>}
          </button>
        </nav>
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
