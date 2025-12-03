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
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users as UsersIcon,
  Award,
  AlertTriangle,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { showError } from "../../../core/utils/toast";
import api from "../../../core/utils/api";
import "../../../assets/styles/admin.css";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    totalRevenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [worstProducts, setWorstProducts] = useState([]);
  const [unsoldProducts, setUnsoldProducts] = useState([]);
  const [currentPeriodStats, setCurrentPeriodStats] = useState({
    revenue: 0,
    orders: 0,
    newUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
  });
  const [timeRange, setTimeRange] = useState("year");
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Không tìm thấy token");
        showError("Vui lòng đăng nhập để truy cập trang admin");
        setLoading(false);
        return;
      }

      // Tạo query params cho time filter
      const params = new URLSearchParams();
      params.append("timeRange", timeRange);

      if (
        timeRange === "custom" &&
        customDates.startDate &&
        customDates.endDate
      ) {
        params.append("startDate", customDates.startDate);
        params.append("endDate", customDates.endDate);
      }

      // Lấy dữ liệu tổng quan và analytics
      const [productsRes, ordersRes, usersRes, analyticsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/users"),
          api.get(`/admin/analytics?${params.toString()}`),
        ]);

      const productsData = productsRes.data;
      const ordersData = ordersRes.data;
      const usersData = usersRes.data;
      const analyticsData = analyticsRes.data;

      const orders = Array.isArray(ordersData)
        ? ordersData
        : ordersData.orders || [];
      const products = Array.isArray(productsData)
        ? productsData
        : productsData.products || [];
      const users = Array.isArray(usersData)
        ? usersData
        : usersData.users || [];

      console.log("✅ Dữ liệu nhận được:", {
        products: products.length,
        orders: orders.length,
        users: users.length,
        analytics: analyticsData,
      });

      // Tính tổng doanh thu
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.totalPrice || 0);
      }, 0);

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        totalRevenue: totalRevenue,
      });

      // Xử lý dữ liệu analytics
      const monthlyRevenue = generateMonthlyData(
        analyticsData.monthlyRevenue,
        "revenue",
        "orders"
      );
      const monthlyUsers = generateMonthlyData(
        analyticsData.monthlyUsers,
        "users"
      );

      setRevenueData(monthlyRevenue);
      setUsersData(monthlyUsers);
      setTopProducts(analyticsData.topProducts || []);
      setWorstProducts(analyticsData.worstProducts || []);
      setUnsoldProducts(analyticsData.unsoldProducts || []);
      setCurrentPeriodStats(analyticsData.currentPeriod || {});
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu tổng quan:", err);
      showError("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleCustomDateApply = () => {
    if (!customDates.startDate || !customDates.endDate) {
      showError("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc");
      return;
    }
    setTimeRange("custom");
    fetchStats();
  };

  const getChangeIndicator = (value) => {
    if (value > 0) {
      return (
        <span className="stat-change positive">
          <TrendingUp size={16} /> +{value}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="stat-change negative">
          <TrendingDown size={16} /> {value}%
        </span>
      );
    } else {
      return (
        <span className="stat-change neutral">
          <span style={{ marginLeft: "4px" }}>0%</span>
        </span>
      );
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "week":
        return "7 ngày qua";
      case "month":
        return "Tháng này";
      case "quarter":
        return "Quý này";
      case "year":
        return "Năm nay";
      case "custom":
        return `${customDates.startDate} - ${customDates.endDate}`;
      default:
        return "Năm nay";
    }
  };

  // Hàm tạo dữ liệu theo tháng từ MongoDB aggregate
  const generateMonthlyData = (
    aggregateData,
    valueKey = "revenue",
    secondKey = null
  ) => {
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

    const monthlyData = months.map((month, index) => {
      const dataItem = { month };
      const foundData = aggregateData.find((item) => item._id === index + 1);

      if (foundData) {
        dataItem[valueKey] = foundData[valueKey] || 0;
        if (secondKey && foundData[secondKey]) {
          dataItem[secondKey] = foundData[secondKey];
        }
      } else {
        dataItem[valueKey] = 0;
        if (secondKey) {
          dataItem[secondKey] = 0;
        }
      }

      return dataItem;
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

  // Custom Tooltip cho biểu đồ doanh thu
  const RevenueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.month}</p>
          <p className="tooltip-value">
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.orders && (
            <p className="tooltip-orders">
              Đơn hàng: {payload[0].payload.orders}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip cho biểu đồ người dùng
  const UsersTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.month}</p>
          <p className="tooltip-value">Người dùng mới: {payload[0].value}</p>
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
        <div className="header-content">
          <div>
            <h2 className="admin-title">Tổng quan hệ thống</h2>
            <p className="overview-subtitle">
              Thống kê và phân tích doanh thu chi tiết - {getTimeRangeLabel()}
            </p>
          </div>
          <button
            className="btn-refresh"
            onClick={fetchStats}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="time-filter-section">
        <div className="time-filter-header">
          <Calendar size={20} />
          <h3>Bộ lọc thời gian</h3>
        </div>
        <div className="time-filter-buttons">
          <button
            className={`filter-btn ${timeRange === "week" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("week")}
          >
            7 Ngày
          </button>
          <button
            className={`filter-btn ${timeRange === "month" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("month")}
          >
            Tháng Này
          </button>
          <button
            className={`filter-btn ${timeRange === "quarter" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("quarter")}
          >
            Quý Này
          </button>
          <button
            className={`filter-btn ${timeRange === "year" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("year")}
          >
            Năm Nay
          </button>
        </div>
        <div className="custom-date-range">
          <input
            type="date"
            value={customDates.startDate}
            onChange={(e) =>
              setCustomDates({ ...customDates, startDate: e.target.value })
            }
            className="date-input"
          />
          <span>đến</span>
          <input
            type="date"
            value={customDates.endDate}
            onChange={(e) =>
              setCustomDates({ ...customDates, endDate: e.target.value })
            }
            className="date-input"
          />
          <button className="btn-apply" onClick={handleCustomDateApply}>
            Áp dụng
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Doanh thu kỳ này</h3>
            <p className="stat-value">
              {formatCurrency(currentPeriodStats.revenue || 0)}
            </p>
            {getChangeIndicator(currentPeriodStats.revenueChange || 0)}
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Đơn hàng kỳ này</h3>
            <p className="stat-value">{currentPeriodStats.orders || 0}</p>
            {getChangeIndicator(currentPeriodStats.ordersChange || 0)}
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
            <UsersIcon size={24} />
          </div>
          <div className="stat-content">
            <h3>Khách hàng mới</h3>
            <p className="stat-value">{currentPeriodStats.newUsers || 0}</p>
            {getChangeIndicator(currentPeriodStats.usersChange || 0)}
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>📊 Doanh thu theo tháng</h3>
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
            <Tooltip content={<RevenueTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#000000"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ số lượng đơn hàng */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>📦 Số lượng đơn hàng theo tháng</h3>
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
              dataKey="orders"
              fill="#000000"
              name="Số đơn hàng"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ khách hàng đăng ký */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>👥 Khách hàng đăng ký theo tháng</h3>
          <p>Số lượng người dùng mới trong năm {new Date().getFullYear()}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666666" />
            <Tooltip content={<UsersTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#000000"
              strokeWidth={2}
              name="Người dùng mới"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="products-analysis">
        <div className="product-section best-sellers">
          <div className="section-header">
            <div className="header-content">
              <Award size={24} className="section-icon" />
              <div>
                <h3>🏆 Top 10 Sản phẩm bán chạy nhất</h3>
                <p>Sản phẩm được khách hàng yêu thích</p>
              </div>
            </div>
          </div>
          <div className="product-list">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={index} className="product-item best">
                  <div className="product-rank">#{index + 1}</div>
                  <img
                    src={item._id?.image || "/images/placeholder.png"}
                    alt={item._id?.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{item._id?.name || "N/A"}</h4>
                    <p className="product-stats">
                      Đã bán: <strong>{item.totalSold}</strong> sản phẩm
                    </p>
                    <p className="product-revenue">
                      Doanh thu: {formatCurrency(item.revenue)}
                    </p>
                  </div>
                  <div className="product-badge success">
                    <TrendingUp size={16} />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        <div className="product-section worst-sellers">
          <div className="section-header">
            <div className="header-content">
              <AlertTriangle size={24} className="section-icon" />
              <div>
                <h3>⚠️ Top 10 Sản phẩm bán chậm nhất</h3>
                <p>Cần xem xét chiến lược marketing</p>
              </div>
            </div>
          </div>
          <div className="product-list">
            {worstProducts.length > 0 ? (
              worstProducts.map((item, index) => (
                <div key={index} className="product-item worst">
                  <div className="product-rank warning">#{index + 1}</div>
                  <img
                    src={item._id?.image || "/images/placeholder.png"}
                    alt={item._id?.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{item._id?.name || "N/A"}</h4>
                    <p className="product-stats">
                      Đã bán: <strong>{item.totalSold}</strong> sản phẩm
                    </p>
                    <p className="product-revenue">
                      Doanh thu: {formatCurrency(item.revenue)}
                    </p>
                  </div>
                  <div className="product-badge warning">
                    <TrendingDown size={16} />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {unsoldProducts.length > 0 && (
          <div className="product-section unsold">
            <div className="section-header">
              <div className="header-content">
                <Package size={24} className="section-icon" />
                <div>
                  <h3>📦 Sản phẩm chưa bán được</h3>
                  <p>Cần ưu tiên quảng bá hoặc điều chỉnh giá</p>
                </div>
              </div>
            </div>
            <div className="product-list">
              {unsoldProducts.map((product, index) => (
                <div key={index} className="product-item unsold">
                  <img
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-price">
                      Giá: {formatCurrency(product.price)}
                    </p>
                    <p className="product-stock">Tồn kho: {product.stock}</p>
                  </div>
                  <div className="product-badge danger">
                    <AlertTriangle size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
