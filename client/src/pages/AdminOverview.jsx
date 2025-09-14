import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "../assets/styles/admin.css";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes, revenueRes] =
          await Promise.all([
            axios.get("/api/products"),
            axios.get("/api/orders"),
            axios.get("/api/users"),
            axios.get("/api/orders/revenue"), // endpoint doanh thu theo tháng
          ]);

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
        });

        setRevenueData(revenueRes.data); // [{ month: "Jan", revenue: 2000 }, ...]
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tổng quan:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-overview">
      <h2 className="admin-title">Tổng quan hệ thống</h2>

      {/* Số liệu */}
      <div className="overview-grid">
        <div className="admin-card">
          <h3>Sản phẩm</h3>
          <p>{stats.products}</p>
        </div>
        <div className="admin-card">
          <h3>Đơn hàng</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="admin-card">
          <h3>Người dùng</h3>
          <p>{stats.users}</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="overview-graph">
        <h3>Biểu đồ doanh thu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverview;
