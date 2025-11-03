# 🌸 Paradise Perfume - Luxury Fragrance E-commerce Platform

> Hệ thống thương mại điện tử bán nước hoa cao cấp với thiết kế sang trọng lấy cảm hứng từ Chanel

[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc project](#-cấu-trúc-project)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Tác giả](#-tác-giả)

## ✨ Tính năng chính

### 🛍️ Người dùng

- **Xem sản phẩm**: Danh sách nước hoa với filter theo danh mục (Nam, Nữ, Mini, Gift Set)
- **Chi tiết sản phẩm**: Thông tin chi tiết, hình ảnh, mô tả
- **Đánh giá & Review**: Hệ thống đánh giá 5 sao với comment
- **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- **Thanh toán**:
  - COD (Thanh toán khi nhận hàng)
  - VNPay (Cổng thanh toán điện tử)
  - MoMo (Ví điện tử)
- **Wishlist**: Lưu sản phẩm yêu thích
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng
- **Chat realtime**: Hỗ trợ khách hàng trực tiếp
- **Tài khoản**: Đăng ký, đăng nhập, quản lý thông tin cá nhân

### 👨‍💼 Quản trị viên

- **Dashboard**: Tổng quan doanh thu, đơn hàng, sản phẩm
- **Quản lý sản phẩm**: CRUD sản phẩm với upload hình ảnh
- **Quản lý đơn hàng**: Cập nhật trạng thái (pending, confirmed, shipping, delivered)
- **Quản lý người dùng**: Xem danh sách, phân quyền
- **Chat hỗ trợ**: Trả lời tin nhắn khách hàng realtime
- **Thống kê**: Biểu đồ doanh thu, đơn hàng theo thời gian

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 18** - UI Library
- **React Router v6** - Routing
- **Context API** - State Management
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **Lucide Icons** - Icon Library
- **Socket.IO Client** - Realtime Communication
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Realtime Communication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **Nodemailer** - Email Service

### Payment Integration

- **VNPay** - Vietnam Payment Gateway
- **MoMo** - E-wallet Payment

## 📦 Yêu cầu hệ thống

- **Node.js** >= 16.x
- **npm** >= 8.x (đi kèm với Node.js)
- **MongoDB** >= 4.4
- **Git** (optional)

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/QuocDuy1705/ParadisePerfume.git
cd perfume
```

### 2. Cài đặt dependencies

#### Backend (Server)

```bash
cd server
npm install
```

#### Frontend (Client)

```bash
cd ../client
npm install
```

## ⚙️ Cấu hình

### 1. Cấu hình Server

Tạo file `.env` trong thư mục `server/`:

```env
# Server Configuration
PORT=5000
SERVER_URL=http://localhost:5000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/perfume_db

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# VNPay Payment Gateway
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_HOST=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# MoMo Payment Gateway
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_API=https://test-payment.momo.vn/v2/gateway/api/create
```

### 2. Cấu hình MongoDB

**Option 1: MongoDB Atlas (Cloud - Khuyến nghị)**

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo tài khoản miễn phí
3. Tạo cluster mới
4. Lấy connection string và thay vào `MONGO_URI`

**Option 2: MongoDB Local**

```bash
# Cài đặt MongoDB Community Server
# Windows: https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Chạy MongoDB
mongod
```

### 3. Cấu hình Email (Gmail)

1. Bật **2-Step Verification** cho Gmail
2. Tạo **App Password**:
   - Vào [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Tạo password mới cho "Mail"
3. Dán password vào `EMAIL_PASS` trong `.env`

### 4. Cấu hình Payment Gateway (Optional)

#### VNPay Sandbox

1. Đăng ký tại [VNPay Sandbox](https://sandbox.vnpayment.vn/)
2. Lấy `TMN Code` và `Hash Secret`
3. Cập nhật vào `.env`

#### MoMo Test

1. Đăng ký tại [MoMo Developers](https://developers.momo.vn/)
2. Tạo ứng dụng test
3. Lấy credentials và cập nhật vào `.env`

## 🎯 Chạy ứng dụng

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Server chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd client
npm start
```

Client chạy tại: `http://localhost:3000`

### Production Mode

**Build Frontend:**

```bash
cd client
npm run build
```

**Chạy Server:**

```bash
cd server
npm start
```

## 📁 Cấu trúc project

```
perfume/
├── client/                 # Frontend React App
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, styles
│   │   ├── components/    # React components
│   │   ├── context/       # Context API (Auth, Cart, Wishlist)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utilities
│   │   └── App.jsx        # Main App component
│   └── package.json
│
├── server/                # Backend Node.js App
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware (auth, rate limit)
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utilities
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## 📚 API Documentation

### Authentication

```
POST   /api/auth/register     - Đăng ký tài khoản
POST   /api/auth/login        - Đăng nhập
GET    /api/auth/me           - Lấy thông tin user (require auth)
```

### Products

```
GET    /api/products          - Lấy danh sách sản phẩm (có filter, pagination)
GET    /api/products/:id      - Lấy chi tiết sản phẩm
POST   /api/products          - Tạo sản phẩm (admin only)
PUT    /api/products/:id      - Cập nhật sản phẩm (admin only)
DELETE /api/products/:id      - Xóa sản phẩm (admin only)
```

### Cart

```
GET    /api/cart              - Lấy giỏ hàng
POST   /api/cart/add          - Thêm vào giỏ
PUT    /api/cart/update/:id   - Cập nhật số lượng
DELETE /api/cart/remove/:id   - Xóa khỏi giỏ
DELETE /api/cart/clear         - Xóa toàn bộ giỏ
```

### Orders

```
GET    /api/orders            - Lấy đơn hàng của user
GET    /api/orders/:id        - Chi tiết đơn hàng
POST   /api/orders            - Tạo đơn hàng mới
PUT    /api/orders/:id        - Cập nhật trạng thái (admin)
```

### Payment

```
POST   /api/payment/vnpay     - Tạo link thanh toán VNPay
GET    /api/payment/vnpay-return - VNPay callback
POST   /api/payment/momo      - Tạo link thanh toán MoMo
GET    /api/payment/momo-return  - MoMo callback
```

### Reviews

```
GET    /api/reviews/product/:id  - Lấy review của sản phẩm
POST   /api/reviews              - Tạo review mới
POST   /api/reviews/:id/helpful  - Đánh dấu hữu ích
```

### Wishlist

```
GET    /api/wishlist          - Lấy wishlist
POST   /api/wishlist/add      - Thêm vào wishlist
DELETE /api/wishlist/remove/:id - Xóa khỏi wishlist
```

## 🎨 Screenshots

_(Thêm screenshots của ứng dụng ở đây)_

### Homepage

![Homepage](screenshots/homepage.png)

### Product Detail

![Product Detail](screenshots/product-detail.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

## 👨‍💻 Tác giả

**Lê Thái Quốc Duy**

- MSSV: 2200006857
- GitHub: [@QuocDuy1705](https://github.com/QuocDuy1705)
- Email: your.email@example.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration: Chanel Official Website
- Icons: [Lucide Icons](https://lucide.dev/)
- UI Components: Custom built with React
- Payment Gateway: VNPay, MoMo

---

**Made with ❤️ for graduation project**
