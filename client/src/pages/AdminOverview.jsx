import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react";
import { showError } from "../utils/toast";
import "../assets/styles/admin.css";

// Import axios instance đã được cấu hình
const API_BASE_URL = "http://localhost:5000/api";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    totalRevenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Không tìm thấy token");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_BASE_URL}/orders`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_BASE_URL}/users`, {
            method: "GET",
            headers,
          }),
        ]);

        // Kiểm tra response status
        if (!productsRes.ok) {
          throw new Error(`Products API error: ${productsRes.status}`);
        }
        if (!ordersRes.ok) {
          throw new Error(`Orders API error: ${ordersRes.status}`);
        }
        if (!usersRes.ok) {
          throw new Error(`Users API error: ${usersRes.status}`);
        }

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();

        // API trả về mảng trực tiếp, không có .data
        const orders = Array.isArray(ordersData) ? ordersData : [];
        const products = Array.isArray(productsData) ? productsData : [];
        const users = Array.isArray(usersData) ? usersData : [];

        console.log("✅ Dữ liệu nhận được:", {
          products: products.length,
          orders: orders.length,
          users: users.length,
        });

        // Tính tổng doanh thu
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.totalPrice || 0);
        }, 0);

        console.log("💰 Tổng doanh thu:", totalRevenue);

        setStats({
          products: products.length,
          orders: orders.length,
          users: users.length,
          totalRevenue: totalRevenue,
        });

        // Tạo dữ liệu doanh thu theo tháng
        const monthlyRevenue = generateMonthlyRevenue(orders);
        console.log("📊 Dữ liệu theo tháng:", monthlyRevenue);
        setRevenueData(monthlyRevenue);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu tổng quan:", err);
        showError("Lỗi khi tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Hàm tạo dữ liệu doanh thu theo tháng
  const generateMonthlyRevenue = (orders) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    const monthlyData = months.map((month, index) => ({
      month: month,
      doanhthu: 0,
      donhang: 0,
    }));

    orders.forEach((order) => {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const monthIndex = orderDate.getMonth();
        monthlyData[monthIndex].doanhthu += order.totalPrice || 0;
        monthlyData[monthIndex].donhang += 1;
      }
    });

    return monthlyData;
  };

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Custom Tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.month}</p>
          <p className="tooltip-value">
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
          <p className="tooltip-orders">
            Đơn hàng: {payload[0].payload.donhang}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-overview">
      <div className="overview-header">
        <h2 className="admin-title">Tổng quan hệ thống</h2>
        <p className="overview-subtitle">Thống kê và phân tích doanh thu</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Tổng doanh thu</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <span className="stat-change positive">
              <TrendingUp size={16} /> +12.5% so với tháng trước
            </span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Tổng đơn hàng</h3>
            <p className="stat-value">{stats.orders}</p>
            <span className="stat-change positive">
              <TrendingUp size={16} /> {stats.orders} đơn
            </span>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Sản phẩm</h3>
            <p className="stat-value">{stats.products}</p>
            <span className="stat-change neutral">
              {stats.products} sản phẩm
            </span>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Khách hàng</h3>
            <p className="stat-value">{stats.users}</p>
            <span className="stat-change positive">
              <TrendingUp size={16} /> +{stats.users} người dùng
            </span>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu - Line Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Biểu đồ doanh thu theo tháng</h3>
          <p>Dữ liệu doanh thu trong năm 2025</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666666" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#666666"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="doanhthu"
              stroke="#000000"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ số lượng đơn hàng - Bar Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Số lượng đơn hàng theo tháng</h3>
          <p>Phân tích xu hướng đặt hàng</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
            <Legend />
            <Bar
              dataKey="donhang"
              fill="#000000"
              name="Số đơn hàng"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverview;
