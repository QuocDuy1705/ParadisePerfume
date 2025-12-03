# 📊 Tính Năng Thống Kê Admin Dashboard

## Tổng Quan

Hệ thống Admin Dashboard đã được nâng cấp với các tính năng thống kê chi tiết và phân tích dữ liệu chuyên nghiệp cho website bán hàng nước hoa Paradise.

---

## ✨ Các Tính Năng Đã Thêm

### 1. 💰 Thống Kê Doanh Thu Theo Tháng

- **Biểu đồ Area Chart**: Hiển thị xu hướng doanh thu trong năm
- **Dữ liệu chi tiết**: Doanh thu và số đơn hàng của từng tháng
- **Tooltip tương tác**: Hiển thị thông tin chi tiết khi hover
- **So sánh tháng hiện tại**: Thống kê riêng cho tháng đang diễn ra

**Công nghệ sử dụng**: MongoDB Aggregation, Recharts Area Chart

### 2. 📦 Thống Kê Đơn Hàng

- **Biểu đồ Bar Chart**: Số lượng đơn hàng theo từng tháng
- **Phân tích xu hướng**: Xác định tháng cao điểm và tháng thấp điểm
- **Dữ liệu realtime**: Cập nhật theo dữ liệu thực tế từ database

### 3. 👥 Thống Kê Khách Hàng Đăng Ký

- **Biểu đồ Line Chart**: Số lượng người dùng mới đăng ký theo tháng
- **Tăng trưởng khách hàng**: Theo dõi xu hướng tăng/giảm
- **Tổng số người dùng**: Hiển thị tổng số khách hàng hiện tại
- **Khách hàng mới tháng này**: Số lượng đăng ký trong tháng hiện tại

**MongoDB Query**: Sử dụng `$match` và `$group` theo tháng đăng ký

### 4. 🏆 Top 10 Sản Phẩm Bán Chạy Nhất

- **Xếp hạng**: Thứ hạng từ #1 đến #10
- **Thông tin hiển thị**:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Số lượng đã bán
  - Tổng doanh thu từ sản phẩm
- **Icon badge**: Biểu tượng trending up màu xanh
- **Border highlight**: Viền trái màu xanh lá cây

**Thuật toán**: MongoDB Aggregation với `$unwind`, `$group`, `$sort` và `$limit`

### 5. ⚠️ Top 10 Sản Phẩm Bán Chậm Nhất

- **Cảnh báo**: Sản phẩm cần xem xét chiến lược marketing
- **Thông tin hiển thị**:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Số lượng đã bán (thấp)
  - Doanh thu hạn chế
- **Icon badge**: Biểu tượng trending down màu vàng
- **Border highlight**: Viền trái màu vàng cảnh báo

**Mục đích**: Giúp admin xác định sản phẩm cần cải thiện chiến lược bán hàng

### 6. 📦 Sản Phẩm Chưa Bán Được

- **Danh sách**: Các sản phẩm chưa có đơn hàng nào
- **Thông tin hiển thị**:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Giá bán
  - Số lượng tồn kho
- **Icon badge**: Biểu tượng alert màu đỏ
- **Border highlight**: Viền trái màu đỏ nguy hiểm

**Công dụng**: Xác định sản phẩm cần ưu tiên quảng bá hoặc điều chỉnh giá

### 7. 📈 Cards Thống Kê Tổng Quan

Cập nhật 4 cards thống kê chính với thông tin realtime:

1. **Tổng Doanh Thu**
   - Tổng doanh thu toàn thời gian
   - Doanh thu tháng hiện tại
2. **Tổng Đơn Hàng**
   - Tổng số đơn hàng
   - Số đơn hàng tháng này
3. **Sản Phẩm**
   - Tổng số sản phẩm trong hệ thống
4. **Khách Hàng**
   - Tổng số người dùng
   - Số người dùng mới tháng này

---

## 🔧 Cấu Trúc Kỹ Thuật

### Backend API

#### Endpoint: `/api/admin/analytics`

**Method**: GET  
**Authentication**: Required (Admin only)

**Response Structure**:

```javascript
{
  monthlyRevenue: [
    { _id: 1, revenue: 50000000, orders: 25 },
    { _id: 2, revenue: 45000000, orders: 22 },
    // ... 12 tháng
  ],
  monthlyUsers: [
    { _id: 1, users: 15 },
    { _id: 2, users: 20 },
    // ... 12 tháng
  ],
  topProducts: [
    {
      _id: { _id: "product_id", name: "Chanel No.5", image: "url", price: 3500000 },
      totalSold: 150,
      revenue: 525000000
    },
    // ... top 10
  ],
  worstProducts: [
    {
      _id: { _id: "product_id", name: "Product Name", image: "url", price: 2000000 },
      totalSold: 2,
      revenue: 4000000
    },
    // ... bottom 10
  ],
  unsoldProducts: [
    {
      _id: "product_id",
      name: "Product Name",
      image: "url",
      price: 1500000,
      stock: 50
    },
    // ...
  ],
  currentMonth: {
    revenue: 45000000,
    orders: 22,
    newUsers: 18
  }
}
```

### MongoDB Aggregation Queries

#### 1. Doanh Thu Theo Tháng

```javascript
await Order.aggregate([
  {
    $match: {
      createdAt: { $gte: startOfYear, $lt: endOfYear },
    },
  },
  {
    $group: {
      _id: { $month: "$createdAt" },
      revenue: { $sum: "$totalPrice" },
      orders: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);
```

#### 2. Top Sản Phẩm Bán Chạy

```javascript
await Order.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalSold: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
    },
  },
  { $sort: { totalSold: -1 } },
  { $limit: 10 },
]);
```

#### 3. Sản Phẩm Chưa Bán

```javascript
const soldProductIds = await Order.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId" } },
]);

const unsoldProducts = await Product.find({
  _id: { $nin: soldIds },
}).limit(10);
```

### Frontend Components

#### AdminOverview.jsx

**State Management**:

```javascript
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
const [currentMonthStats, setCurrentMonthStats] = useState({});
```

**Charts Used**:

- **AreaChart**: Doanh thu theo tháng
- **BarChart**: Đơn hàng theo tháng
- **LineChart**: Người dùng đăng ký theo tháng

---

## 🎨 UI/UX Design

### Color Scheme

- **Best Sellers**: Xanh lá (#28a745) - Thành công
- **Worst Sellers**: Vàng (#ffc107) - Cảnh báo
- **Unsold Products**: Đỏ (#dc3545) - Nguy hiểm
- **Charts**: Đen (#000000) - Chuyên nghiệp, sang trọng

### Responsive Design

- **Desktop**: Full grid layout với sidebar mở rộng
- **Tablet**: Grid 2 cột, sidebar có thể thu gọn
- **Mobile**: Stack layout, sidebar overlay

### Icons

Sử dụng **Lucide React**:

- `TrendingUp` - Tăng trưởng
- `TrendingDown` - Giảm sút
- `Award` - Thành tích
- `AlertTriangle` - Cảnh báo
- `DollarSign` - Doanh thu
- `ShoppingCart` - Đơn hàng
- `Package` - Sản phẩm
- `Users` - Khách hàng

---

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1025px) {
  /* Full features */
}

/* Tablet */
@media (max-width: 1024px) {
  /* Collapsed sidebar */
}

/* Mobile */
@media (max-width: 768px) {
  /* Stack layout */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Compact view */
}
```

---

## 🚀 Cách Sử Dụng

### 1. Khởi động Backend

```bash
cd server
npm install
npm start
```

### 2. Khởi động Frontend

```bash
cd client
npm install
npm start
```

### 3. Truy cập Admin Dashboard

- URL: `http://localhost:3000/admin`
- Đăng nhập với tài khoản admin
- Chọn tab "Tổng quan" để xem thống kê

---

## 📊 Dữ Liệu Mẫu

Để test đầy đủ tính năng, hệ thống cần:

- ✅ Ít nhất 10 sản phẩm
- ✅ Ít nhất 20 đơn hàng (phân bố qua các tháng)
- ✅ Ít nhất 30 người dùng (đăng ký qua các tháng)
- ✅ Một số sản phẩm chưa có đơn hàng

---

## 🔐 Bảo Mật

- **Authentication**: Token-based với JWT
- **Authorization**: Middleware `isAdmin` kiểm tra quyền
- **Route Protection**: Chỉ admin mới truy cập được `/admin/analytics`
- **Data Validation**: Sanitize và validate input

---

## 🎯 Lợi Ích Cho Admin

1. **Ra Quyết Định Dựa Trên Dữ Liệu**
   - Biết sản phẩm nào bán chạy để tăng stock
   - Biết sản phẩm nào bán chậm để chạy khuyến mãi
2. **Tối Ưu Hóa Tồn Kho**
   - Xác định sản phẩm cần nhập thêm
   - Xác định sản phẩm cần giảm giá thanh lý
3. **Phân Tích Xu Hướng**
   - Tháng nào có doanh thu cao/thấp
   - Mùa nào khách hàng đăng ký nhiều
4. **Chiến Lược Marketing**
   - Tập trung quảng bá sản phẩm chưa bán
   - Upsell sản phẩm bán chạy

---

## 🔄 Cập Nhật Trong Tương Lai

- [ ] Thêm filter theo khoảng thời gian tùy chỉnh
- [ ] Export báo cáo PDF/Excel
- [ ] So sánh với năm trước
- [ ] Thống kê theo danh mục sản phẩm
- [ ] Phân tích RFM (Recency, Frequency, Monetary)
- [ ] Dashboard cho mobile app

---

## 📝 Changelog

### Version 2.0.0 (December 2025)

- ✅ Thêm thống kê doanh thu theo tháng
- ✅ Thêm thống kê khách hàng đăng ký theo tháng
- ✅ Thêm top 10 sản phẩm bán chạy
- ✅ Thêm top 10 sản phẩm bán chậm
- ✅ Thêm danh sách sản phẩm chưa bán được
- ✅ Cải thiện UI/UX với biểu đồ Recharts
- ✅ Thêm responsive design cho mobile
- ✅ Tối ưu MongoDB aggregation queries

---

## 👨‍💻 Developer Notes

**File đã chỉnh sửa**:

1. `server/routes/adminRoutes.js` - Thêm endpoint `/analytics`
2. `client/src/features/admin/pages/AdminOverview.jsx` - UI thống kê
3. `client/src/assets/styles/admin.css` - Styling cho components mới

**Dependencies mới**:

- Recharts (đã có sẵn)
- Lucide React (đã có sẵn)

**Database Indexes** (khuyến nghị):

```javascript
// Orders collection
db.orders.createIndex({ createdAt: 1 });
db.orders.createIndex({ "items.productId": 1 });

// Users collection
db.users.createIndex({ createdAt: 1 });
```

---

**Developed with ❤️ for Paradise Perfume**
