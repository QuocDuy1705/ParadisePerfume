# PARADISE PERFUME - TỔNG HỢP HỆ THỐNG

## **MÔ TẢ DỰ ÁN**

Hệ thống website thương mại điện tử bán nước hoa Paradise Perfume - Nền tảng mua sắm trực tuyến với đầy đủ chức năng quản lý sản phẩm, đơn hàng, thanh toán, và hỗ trợ khách hàng realtime.

---

## **1. CHỨC NĂNG NGƯỜI DÙNG (USER/CUSTOMER)**

### **1.1 Xác thực & Quản lý Tài khoản**

- ✅ **Đăng ký tài khoản mới**

  - Email, mật khẩu, họ tên, quốc gia
  - Validation email format & password strength
  - Mật khẩu yêu cầu: ≥6 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt

- ✅ **Đăng nhập**

  - Email/Password
  - Google OAuth 2.0 (Sign in with Google)
  - Lưu token vào localStorage
  - Auto-redirect sau login

- ✅ **Quên mật khẩu**

  - Gửi email reset password
  - Token reset có thời hạn
  - Form đổi mật khẩu mới

- ✅ **Trang Profile**
  - Xem thông tin cá nhân (họ tên, email, quốc gia)
  - **Đổi mật khẩu**:
    - Nhập mật khẩu hiện tại
    - Nhập mật khẩu mới
    - Xác nhận mật khẩu mới
    - Realtime password strength indicator
    - Toggle show/hide password
    - Validation đầy đủ
  - Note: Tài khoản Google không thể đổi mật khẩu

### **1.2 Sản phẩm & Danh mục**

- ✅ **Xem sản phẩm theo danh mục**

  - Nước hoa nam (Men)
  - Nước hoa nữ (Women)
  - Nước hoa mini (Mini)
  - Bộ quà tặng (Giftset)

- ✅ **Tính năng lọc & tìm kiếm**

  - Lọc theo giá (slider min-max)
  - Lọc theo thương hiệu (Chanel, Dior, Gucci, v.v.)
  - Lọc theo dung tích (30ml, 50ml, 100ml, v.v.)
  - Tìm kiếm theo tên sản phẩm
  - Sắp xếp (giá, tên, mới nhất)

- ✅ **Chi tiết sản phẩm**
  - Hình ảnh sản phẩm (gallery)
  - Tên, mô tả chi tiết
  - Giá gốc, giá sale
  - Thương hiệu, danh mục
  - Các tùy chọn dung tích
  - Số lượng tồn kho
  - Nút thêm vào giỏ hàng
  - Sản phẩm liên quan

### **1.3 Giỏ hàng (Shopping Cart)**

- ✅ **Cart Sidebar**

  - Mở/đóng giỏ hàng nhanh
  - Hiển thị danh sách sản phẩm trong giỏ
  - Tăng/giảm số lượng
  - Xóa sản phẩm
  - Tổng tiền tự động
  - Nút Checkout

- ✅ **Trang giỏ hàng (Cart Page)**
  - Xem toàn bộ sản phẩm
  - Cập nhật số lượng
  - Xóa sản phẩm
  - **Áp dụng mã giảm giá (Coupon)**:
    - Nhập mã code
    - Validate mã (kiểm tra hạn, điều kiện)
    - Hiển thị số tiền giảm
    - Tính tổng sau giảm giá
  - Tổng cộng chi tiết (subtotal, discount, total)

### **1.4 Thanh toán & Đơn hàng**

- ✅ **Checkout (Thanh toán)**

  - Form thông tin giao hàng:
    - Họ tên
    - Số điện thoại
    - Email
    - Địa chỉ chi tiết
    - Thành phố
    - Quốc gia
  - **Phương thức thanh toán**:
    1. **COD** (Cash on Delivery - Thanh toán khi nhận hàng)
       - Tạo đơn hàng với status "Pending"
       - Lưu vào database
       - Gửi email xác nhận
    2. **Chuyển khoản ngân hàng (TP Bank QR)**
       - Tích hợp VietQR API
       - Tạo mã QR chuyển khoản tự động
       - Thông tin tài khoản TP Bank
       - Nội dung chuyển khoản tự động
       - Số tiền chính xác
  - Xác nhận đơn hàng
  - Redirect sang trang Order Success

- ✅ **Quản lý đơn hàng**
  - Xem lịch sử đơn hàng
  - Chi tiết từng đơn:
    - Mã đơn hàng
    - Ngày đặt
    - Trạng thái
    - Sản phẩm đã mua
    - Tổng tiền
    - Thông tin giao hàng
    - Phương thức thanh toán
  - **Trạng thái đơn hàng**:
    - Pending (Chờ xử lý)
    - Processing (Đang xử lý)
    - Shipped (Đã giao vận chuyển)
    - Delivered (Đã giao thành công)
    - Cancelled (Đã hủy)

### **1.5 Chat hỗ trợ với Admin**

- ✅ **Realtime Chat**
  - Nút mở chat widget
  - Gửi tin nhắn cho admin
  - Nhận phản hồi realtime (Socket.IO)
  - Upload file/hình ảnh
  - Hiển thị thời gian tin nhắn
  - Typing indicator (hiển thị admin đang nhập)
  - Seen/Delivered status
  - Âm thanh thông báo tin nhắn mới
  - Bubble count tin nhắn chưa đọc

### **1.6 Các trang khác**

- ✅ **Trang chủ (Home)**

  - Hero banner
  - Sản phẩm nổi bật
  - Danh mục sản phẩm
  - Dịch vụ (ProductServices component)

- ✅ **Trang giới thiệu (About)**

  - Thông tin về Paradise Perfume
  - Câu chuyện thương hiệu
  - Giá trị cốt lõi

- ✅ **Footer**
  - Thông tin liên hệ
  - Social media links
  - Chính sách, điều khoản

---

## **2. CHỨC NĂNG QUẢN TRỊ (ADMIN DASHBOARD)**

### **2.1 Dashboard/Tổng quan (Overview)**

- ✅ **Thống kê tổng quan**

  - Tổng doanh thu (Total Revenue)
  - Tổng số đơn hàng (Total Orders)
  - Tổng số sản phẩm (Total Products)
  - Tổng số người dùng (Total Users)
  - Số đơn hàng chờ xử lý

- ✅ **Biểu đồ & Charts**

  - Biểu đồ doanh thu theo tháng
  - Top sản phẩm bán chạy
  - Biểu đồ trạng thái đơn hàng

- ✅ **Recent Activities**
  - Đơn hàng mới nhất
  - Hoạt động gần đây

### **2.2 Quản lý Sản phẩm (Products Management)**

- ✅ **Danh sách sản phẩm**

  - Xem toàn bộ sản phẩm (table view)
  - Tìm kiếm theo tên
  - Lọc theo danh mục
  - Phân trang

- ✅ **Thêm sản phẩm mới**

  - Form nhập thông tin:
    - Tên sản phẩm
    - Mô tả chi tiết
    - Giá gốc
    - Giá sale (optional)
    - Danh mục (category)
    - Thương hiệu (brand)
    - Dung tích (sizes - array)
    - Số lượng tồn kho
    - Upload hình ảnh (single/multiple)
  - Validation đầy đủ
  - Preview hình ảnh

- ✅ **Chỉnh sửa sản phẩm**

  - Modal edit
  - Load dữ liệu hiện tại
  - Cập nhật thông tin
  - Thay đổi hình ảnh

- ✅ **Xóa sản phẩm**
  - Confirm dialog
  - Soft delete hoặc hard delete

### **2.3 Quản lý Đơn hàng (Orders Management)**

- ✅ **Danh sách đơn hàng**

  - Xem toàn bộ đơn hàng
  - Lọc theo:
    - Trạng thái (Pending, Processing, Shipped, Delivered, Cancelled)
    - Ngày tạo
    - Phương thức thanh toán
  - Tìm kiếm theo mã đơn hàng, tên khách

- ✅ **Chi tiết đơn hàng**

  - Thông tin khách hàng:
    - Họ tên
    - Email
    - Số điện thoại
    - Địa chỉ giao hàng
  - Danh sách sản phẩm đã mua:
    - Tên sản phẩm
    - Số lượng
    - Giá
    - Tổng tiền từng item
  - Tổng cộng:
    - Subtotal
    - Discount (nếu có)
    - Shipping fee (nếu có)
    - Total
  - Phương thức thanh toán
  - Trạng thái đơn hàng

- ✅ **Cập nhật trạng thái đơn hàng**

  - Dropdown chọn trạng thái mới
  - Button Update
  - Gửi email thông báo cho khách (optional)
  - Log history thay đổi

- ✅ **Thống kê đơn hàng**
  - Tổng doanh thu theo khoảng thời gian
  - Export báo cáo (CSV/Excel)

### **2.4 Quản lý Người dùng (Users Management)**

- ✅ **Danh sách người dùng**

  - Xem toàn bộ users
  - Hiển thị:
    - ID
    - Họ tên
    - Email
    - Quốc gia
    - Role (User/Admin)
    - Ngày tạo
  - Tìm kiếm theo tên, email
  - Lọc theo role

- ✅ **Tạo tài khoản mới**

  - Modal create user
  - Form nhập:
    - Họ
    - Tên
    - Email
    - Password
    - Quốc gia
    - Checkbox: Admin account
  - Validation:
    - Email unique
    - Password strength
  - Toggle show/hide password
  - Success notification

- ✅ **Chỉnh sửa người dùng**

  - Cập nhật thông tin
  - Đổi role (User ↔ Admin)
  - Đổi mật khẩu (admin reset)

- ✅ **Xóa người dùng**
  - Confirm dialog
  - Không cho phép xóa chính mình
  - Không cho phép xóa nếu có đơn hàng

### **2.5 Chat với Khách hàng (Admin Chat)**

- ✅ **Dashboard Chat**

  - **Conversations Panel** (bên trái):

    - Danh sách cuộc hội thoại
    - Hiển thị:
      - Avatar user
      - Tên user
      - Email
      - Tin nhắn cuối
      - Thời gian
      - Số tin nhắn chưa đọc (badge)
      - Trạng thái (Active/Closed)
    - Tìm kiếm cuộc hội thoại
    - Lọc theo trạng thái
    - Sắp xếp theo thời gian

  - **Messages Panel** (bên phải):
    - Header:
      - Thông tin user đang chat
      - Nút "Đóng cuộc hội thoại"
    - Khung chat messages:
      - Tin nhắn user (bên trái, nền xám)
      - Tin nhắn admin (bên phải, nền đen)
      - Hiển thị thời gian
      - Read receipts (✓/✓✓)
      - File/Image preview
    - Typing indicator (user đang nhập...)
    - Input form:
      - Textarea nhập tin nhắn
      - Nút upload file/ảnh
      - Nút gửi

- ✅ **Realtime Features**

  - Socket.IO integration
  - Nhận tin nhắn realtime từ user
  - Gửi tin nhắn cho user
  - Admin join "admin_room" khi connect
  - Auto-scroll xuống tin nhắn mới
  - Notification sound

- ✅ **Đóng/Mở lại cuộc hội thoại**

  - Nút "Đóng" → set status = "closed"
  - Click vào conversation đã đóng → tự động reopen (status = "active")
  - User gửi tin nhắn mới vào conversation closed → auto reopen

- ✅ **Upload files trong chat**
  - Upload hình ảnh (preview trong chat)
  - Upload files (download link)
  - Giới hạn size & type

### **2.6 Quản lý Coupon/Mã giảm giá**

- ✅ **Danh sách Coupon**

  - Xem toàn bộ mã giảm giá
  - Hiển thị:
    - Code
    - Loại (Percentage/Fixed Amount)
    - Giá trị giảm
    - Điều kiện tối thiểu
    - Số lượt dùng/Đã dùng
    - Ngày hết hạn
    - Trạng thái (Active/Inactive)

- ✅ **Tạo Coupon mới**

  - Form nhập:
    - Mã code (unique, uppercase)
    - Loại giảm giá:
      - Percentage (%)
      - Fixed Amount (VND)
    - Giá trị giảm
    - Giá trị đơn hàng tối thiểu
    - Số lần sử dụng tối đa
    - Ngày bắt đầu
    - Ngày hết hạn
    - Trạng thái Active/Inactive
  - Validation đầy đủ

- ✅ **Sửa/Xóa Coupon**

  - Modal edit
  - Confirm delete
  - Disable coupon (set inactive)

- ✅ **Thống kê sử dụng**
  - Số lần đã dùng
  - Doanh thu giảm do coupon

### **2.7 Blog (nếu có)**

- ✅ **Quản lý bài viết Blog**
  - CRUD blog posts
  - Categories
  - Tags
  - Featured image
  - Rich text editor

---

## **3. TÍNH NĂNG KỸ THUẬT (TECHNICAL FEATURES)**

### **3.1 Bảo mật (Security)**

- ✅ **Authentication & Authorization**

  - JWT (JSON Web Tokens)
  - Token expire time
  - Refresh token (optional)
  - bcrypt password hashing (salt rounds: 10)

- ✅ **Middleware Protection**

  - `verifyToken`: Xác thực user đã đăng nhập
  - `isAdmin`: Kiểm tra quyền admin
  - Protected routes (frontend + backend)

- ✅ **Input Validation & Sanitization**

  - XSS protection (sanitize HTML/scripts)
  - SQL Injection prevention (NoSQL injection)
  - Email validation
  - Password strength validation

- ✅ **CORS Configuration**

  - Allowed origins
  - Credentials support
  - Preflight requests

- ✅ **Rate Limiting**
  - Chat message limiter (10 tin nhắn/phút)
  - Conversation limiter
  - API rate limiting

### **3.2 Realtime Communication (Socket.IO)**

- ✅ **Server-side Socket.IO**

  - Connection handling
  - Room-based messaging:
    - User rooms: `user_{userId}`
    - Admin room: `admin_room`
  - Events:
    - `send_message` (user → admin)
    - `admin_reply` (admin → user)
    - `new_message` (broadcast to admin)
    - `new_admin_message` (broadcast to user)
    - `typing` (user typing)
    - `admin_typing` (admin typing)
    - `user_typing` (notify admin)
    - `join_admin_room` (admin join room)
    - `leave_admin_room` (admin leave)

- ✅ **Client-side Socket.IO**

  - SocketContext (React Context)
  - Auto-reconnect
  - Connection status indicator
  - Event listeners setup/cleanup

- ✅ **Features**
  - Typing indicators
  - Read receipts
  - Online/Offline status
  - Message persistence (save to DB)
  - Duplicate message prevention

### **3.3 Payment Integration**

- ✅ **COD (Cash on Delivery)**

  - Tạo order với payment method = "COD"
  - Status = "Pending"
  - Email confirmation

- ✅ **Bank Transfer (TP Bank)**

  - VietQR API integration
  - Generate QR Code:
    - Account number
    - Account name
    - Bank code (TP Bank)
    - Amount (số tiền chính xác)
    - Description (mã đơn hàng)
  - Display QR trong checkout
  - Manual verify payment (admin)

- ✅ **Payment Validation**
  - Validate order items (name, price, image required)
  - Check stock availability
  - Validate coupon
  - Calculate total correctly

### **3.4 File Upload (Multer)**

- ✅ **Product Images**

  - Single/Multiple upload
  - Destination: `/uploads/products/`
  - Allowed types: jpg, jpeg, png
  - Max size: 5MB
  - Filename: timestamp + original name

- ✅ **Chat Files**

  - Images: jpg, jpeg, png, gif
  - Documents: pdf, doc, docx
  - Destination: `/uploads/chat/`
  - Max size: 10MB
  - Return file URL

- ✅ **Error Handling**
  - File too large
  - Invalid file type
  - Upload failed

### **3.5 Email Service (Nodemailer)**

- ✅ **Email Configuration**

  - SMTP server (Gmail/SendGrid)
  - From address
  - Authentication

- ✅ **Email Templates**

  - Forgot password:
    - Reset link with token
    - Token expiry: 1 hour
  - Order confirmation:
    - Order details
    - Shipping info
    - Payment method
  - Order status update (optional)

- ✅ **Features**
  - HTML email templates
  - Error handling
  - Queue system (optional)

### **3.6 Database (MongoDB + Mongoose)**

- ✅ **Models & Schemas**

**User Model:**

```javascript
{
  title: String,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed),
  country: String,
  isAdmin: Boolean (default: false),
  googleId: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Product Model:**

```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  salePrice: Number,
  category: String (required),
  brand: String,
  sizes: [String],
  stock: Number (default: 0),
  images: [String],
  rating: Number (default: 0),
  reviews: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Order Model:**

```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    name: String (required),
    quantity: Number (required),
    price: Number (required),
    image: String (required)
  }],
  totalAmount: Number (required),
  discount: Number (default: 0),
  finalAmount: Number (required),
  shippingAddress: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    country: String
  },
  paymentMethod: String (COD/BankTransfer),
  paymentStatus: String (Pending/Paid/Failed),
  status: String (Pending/Processing/Shipped/Delivered/Cancelled),
  couponCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Cart Model:**

```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number (default: 1),
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Conversation Model:**

```javascript
{
  userId: ObjectId (ref: User, required),
  userName: String (required),
  userEmail: String (required),
  status: String (active/closed, default: active),
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Message Model:**

```javascript
{
  conversationId: ObjectId (ref: Conversation, required),
  senderId: ObjectId (required),
  senderType: String (user/admin, required),
  senderName: String (required),
  message: String (required, trimmed, sanitized),
  fileUrl: String,
  fileType: String (image/file),
  fileName: String,
  isRead: Boolean (default: false),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Coupon Model:**

```javascript
{
  code: String (required, unique, uppercase),
  discountType: String (percentage/fixed),
  discountValue: Number (required),
  minOrderValue: Number (default: 0),
  maxUses: Number,
  usedCount: Number (default: 0),
  startDate: Date,
  expiryDate: Date,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

- ✅ **Indexing**

  - User: email (unique)
  - Product: category, brand, name
  - Order: userId, status, createdAt
  - Conversation: userId, status
  - Message: conversationId, createdAt

- ✅ **Validation**
  - Required fields
  - Type validation
  - Custom validators
  - Enum values

### **3.7 Frontend Architecture (React)**

- ✅ **Components Structure**

```
src/
├── components/          # Shared components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartSidebar.jsx
│   ├── FilterPanel.jsx
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx
│   ├── ProductPage.jsx
│   ├── ProductDetail.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── ProfilePage.jsx
│   └── AuthPage.jsx
├── features/           # Feature modules
│   ├── admin/
│   │   └── pages/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminOrders.jsx
│   │       ├── AdminUsers.jsx
│   │       ├── AdminChat.jsx
│   │       └── AdminCoupons.jsx
├── context/            # React Context
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── SocketContext.jsx
├── services/           # API services
│   ├── auth.js
│   ├── cartService.js
│   └── payment.js
└── assets/             # Static assets
    ├── images/
    └── styles/
```

- ✅ **State Management**

  - Context API (AuthContext, CartContext, SocketContext)
  - Local state (useState)
  - useEffect for side effects
  - Custom hooks

- ✅ **Routing (React Router v6)**

  - Public routes: Home, Products, Auth
  - Protected routes: Profile, Checkout, Orders
  - Admin routes: Dashboard, Management pages
  - Route guards

- ✅ **Styling**
  - CSS Modules
  - Inline styles (conditional)
  - Responsive design
  - Mobile-friendly

### **3.8 Backend Architecture (Node.js/Express)**

- ✅ **Project Structure**

```
server/
├── config/
│   └── db.js           # MongoDB connection
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── paymentController.js
│   └── chatController.js
├── models/             # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Conversation.js
│   ├── Message.js
│   └── Category.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── paymentRoutes.js
│   ├── chatRoutes.js
│   ├── adminRoutes.js
│   └── userRoutes.js
├── middleware/         # Custom middleware
│   ├── auth.js         # JWT verification
│   ├── upload.js       # Multer config
│   └── rateLimiter.js  # Rate limiting
├── utils/              # Utility functions
│   ├── sendMail.js
│   └── sanitizer.js
├── seed/               # Database seeding
│   └── seed.js
├── uploads/            # Uploaded files
│   ├── products/
│   └── chat/
└── server.js           # Entry point
```

- ✅ **Middleware Pipeline**

  - CORS
  - Body parser (JSON, URL-encoded)
  - File upload (Multer)
  - Authentication (JWT)
  - Error handling
  - Rate limiting

- ✅ **API Design**
  - RESTful endpoints
  - Consistent response format:

```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, message: "Error message" }
```

- HTTP status codes:

  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Server Error

- ✅ **Error Handling**
  - Try-catch blocks
  - Error middleware
  - Logging
  - User-friendly messages

---

## **4. API ENDPOINTS DOCUMENTATION**

### **4.1 Authentication Routes (`/api/users`, `/api/auth`)**

**POST `/api/users/register`**

- Mô tả: Đăng ký tài khoản mới
- Body:

```json
{
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "country": "Vietnam",
  "isAdmin": false
}
```

**POST `/api/users/login`**

- Mô tả: Đăng nhập
- Body:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

- Response:

```json
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

**POST `/api/users/forgot-password`**

- Mô tả: Gửi email reset password
- Body:

```json
{
  "email": "john@example.com"
}
```

**POST `/api/auth/google`**

- Mô tả: Google OAuth login
- Body:

```json
{
  "token": "google_token"
}
```

**PUT `/api/users/change-password`**

- Mô tả: Đổi mật khẩu
- Headers: `Authorization: Bearer {token}`
- Body:

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### **4.2 Product Routes (`/api/products`)**

**GET `/api/products`**

- Mô tả: Lấy danh sách sản phẩm
- Query params:
  - `category`: string
  - `brand`: string
  - `minPrice`: number
  - `maxPrice`: number
  - `search`: string
  - `page`: number
  - `limit`: number

**GET `/api/products/:id`**

- Mô tả: Lấy chi tiết sản phẩm

**POST `/api/admin/products`** (Admin only)

- Mô tả: Tạo sản phẩm mới
- Headers: `Authorization: Bearer {token}`
- Body: FormData with product fields + images

**PUT `/api/admin/products/:id`** (Admin only)

- Mô tả: Cập nhật sản phẩm

**DELETE `/api/admin/products/:id`** (Admin only)

- Mô tả: Xóa sản phẩm

### **4.3 Cart Routes (`/api/cart`)**

**GET `/api/cart`**

- Mô tả: Lấy giỏ hàng của user
- Headers: `Authorization: Bearer {token}`

**POST `/api/cart`**

- Mô tả: Thêm sản phẩm vào giỏ
- Body:

```json
{
  "productId": "product_id",
  "quantity": 1,
  "price": 1500000
}
```

**PUT `/api/cart/:productId`**

- Mô tả: Cập nhật số lượng

**DELETE `/api/cart/:productId`**

- Mô tả: Xóa sản phẩm khỏi giỏ

### **4.4 Order Routes (`/api/orders`)**

**GET `/api/orders`**

- Mô tả: Lấy danh sách đơn hàng của user
- Headers: `Authorization: Bearer {token}`

**GET `/api/orders/:id`**

- Mô tả: Chi tiết đơn hàng

**POST `/api/orders`**

- Mô tả: Tạo đơn hàng mới
- Body:

```json
{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "COD",
  "couponCode": "SUMMER2024"
}
```

**PUT `/api/orders/:id/status`** (Admin only)

- Mô tả: Cập nhật trạng thái đơn hàng
- Body:

```json
{
  "status": "Shipped"
}
```

### **4.5 Payment Routes (`/api/payment`)**

**POST `/api/payment/cod`**

- Mô tả: Tạo đơn hàng COD
- Body: Order details

**POST `/api/payment/bank-transfer`**

- Mô tả: Tạo đơn hàng chuyển khoản + QR code
- Body: Order details
- Response: Order + QR Code URL

### **4.6 Chat Routes (`/api/chat`)**

**GET `/api/chat/conversation`**

- Mô tả: Lấy hoặc tạo conversation của user
- Headers: `Authorization: Bearer {token}`

**GET `/api/chat/conversations`** (Admin only)

- Mô tả: Lấy tất cả conversations
- Query params:
  - `search`: string
  - `status`: active/closed
  - `sortBy`: lastMessageTime
  - `limit`: number
  - `skip`: number

**GET `/api/chat/messages/:conversationId`**

- Mô tả: Lấy messages của conversation
- Query params:
  - `limit`: number
  - `before`: date (cursor pagination)
  - `after`: date

**POST `/api/chat/messages`**

- Mô tả: Gửi tin nhắn
- Body:

```json
{
  "conversationId": "conv_id",
  "message": "Hello, I need help!"
}
```

**POST `/api/chat/upload`**

- Mô tả: Upload file trong chat
- Body: FormData with file

**PUT `/api/chat/messages/:conversationId/read`**

- Mô tả: Đánh dấu đã đọc

**PUT `/api/chat/conversations/:conversationId/close`** (Admin only)

- Mô tả: Đóng cuộc hội thoại

**PUT `/api/chat/conversations/:conversationId/reopen`** (Admin only)

- Mô tả: Mở lại cuộc hội thoại

### **4.7 Admin Routes (`/api/admin`)**

**GET `/api/admin/users`** (Admin only)

- Mô tả: Lấy danh sách users

**DELETE `/api/admin/users/:id`** (Admin only)

- Mô tả: Xóa user

**GET `/api/admin/stats`** (Admin only)

- Mô tả: Thống kê tổng quan

---

## **5. ENVIRONMENT VARIABLES**

### **Server (.env)**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/paradise_perfume
# or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/paradise_perfume

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Paradise Perfume <noreply@paradiseperfume.com>

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (CORS)
CLIENT_URL=http://localhost:3000

# Upload paths
UPLOAD_PATH=./uploads

# Payment (VietQR)
VIETQR_API_URL=https://api.vietqr.io/v2/generate
BANK_ACCOUNT_NUMBER=your_bank_account
BANK_ACCOUNT_NAME=YOUR NAME
BANK_CODE=970423
```

### **Client (.env)**

```env
# API URL
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## **6. INSTALLATION & SETUP**

### **6.1 Prerequisites**

- Node.js v14+ & npm
- MongoDB (local hoặc MongoDB Atlas)
- Git

### **6.2 Clone Repository**

```bash
git clone https://github.com/QuocDuy1705/ParadisePerfume.git
cd ParadisePerfume
```

### **6.3 Backend Setup**

```bash
cd server
npm install
```

Tạo file `.env` với các biến môi trường ở trên.

```bash
# Seed database (optional)
npm run seed

# Start server
npm start
# or development mode with nodemon
npm run dev
```

Server chạy tại: `http://localhost:5000`

### **6.4 Frontend Setup**

```bash
cd client
npm install
```

Tạo file `.env` với các biến môi trường.

```bash
# Start React app
npm start
```

Client chạy tại: `http://localhost:3000`

### **6.5 Database Seeding**

```bash
cd server
npm run seed
```

Seed data bao gồm:

- Sample products (nước hoa)
- Sample categories
- Admin account
- Sample users

---

## **7. TESTING**

### **7.1 Manual Testing**

- ✅ User registration & login
- ✅ Product browsing & filtering
- ✅ Add to cart & checkout
- ✅ Order creation & payment
- ✅ Chat functionality
- ✅ Admin CRUD operations
- ✅ Admin chat với users

### **7.2 Test Accounts**

**Admin Account:**

- Email: `admin@paradise.com`
- Password: `Admin123!`

**User Account:**

- Email: `user@test.com`
- Password: `User123!`

---

## **8. DEPLOYMENT**

### **8.1 Backend Deployment (Options)**

**Heroku:**

```bash
heroku create paradise-perfume-api
heroku addons:create mongolab
git push heroku main
```

**Railway/Render:**

- Connect GitHub repo
- Set environment variables
- Deploy

**VPS (Ubuntu):**

- Install Node.js, MongoDB, Nginx
- Clone repo
- Setup PM2
- Configure Nginx reverse proxy

### **8.2 Frontend Deployment**

**Vercel:**

```bash
npm install -g vercel
vercel
```

**Netlify:**

```bash
npm run build
# Upload build folder to Netlify
```

**GitHub Pages:**

```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```

### **8.3 Environment Setup**

- Update `.env` với production URLs
- Update CORS allowed origins
- Setup SSL certificates
- Configure domain DNS

---

## **9. CÔNG NGHỆ SỬ DỤNG**

### **Frontend**

| Technology       | Version | Purpose                |
| ---------------- | ------- | ---------------------- |
| React            | 19.x    | UI Framework           |
| React Router     | 6.x     | Routing                |
| Axios            | 1.x     | HTTP Client            |
| Socket.IO Client | 4.x     | Realtime Communication |
| Lucide React     | Latest  | Icons                  |
| CSS3             | -       | Styling                |

### **Backend**

| Technology | Version | Purpose          |
| ---------- | ------- | ---------------- |
| Node.js    | 14+     | Runtime          |
| Express.js | 4.x     | Web Framework    |
| MongoDB    | 5.x     | Database         |
| Mongoose   | 7.x     | ODM              |
| Socket.IO  | 4.x     | Realtime         |
| JWT        | 9.x     | Authentication   |
| Bcrypt     | 5.x     | Password Hashing |
| Nodemailer | 6.x     | Email Service    |
| Multer     | 1.x     | File Upload      |
| Cors       | 2.x     | CORS Handling    |

### **Third-party Services**

- Google OAuth 2.0
- VietQR API (TP Bank)
- SMTP (Gmail/SendGrid)

---

## **10. TÍNH NĂNG NỔI BẬT**

✨ **Highlights:**

1. ✅ Realtime chat với Socket.IO
2. ✅ Google OAuth login
3. ✅ VietQR payment integration
4. ✅ Admin dashboard đầy đủ
5. ✅ Coupon system
6. ✅ Password strength validation
7. ✅ File upload (products + chat)
8. ✅ Email notifications
9. ✅ Responsive design
10. ✅ Security best practices

---

## **11. ROADMAP/FUTURE ENHANCEMENTS**

🚀 **Planned Features:**

- [ ] Product reviews & ratings (user submit)
- [ ] Wishlist/Favorites
- [ ] Product recommendations (AI)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Social media login (Facebook, Apple)
- [ ] Payment gateways (PayPal, Stripe, MoMo)
- [ ] Inventory management system
- [ ] Shipping tracking integration
- [ ] Blog/News section
- [ ] SEO optimization
- [ ] PWA support
- [ ] Unit & Integration tests

---

## **12. TROUBLESHOOTING**

### **Common Issues:**

**1. MongoDB Connection Error**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

→ Start MongoDB service: `sudo service mongod start`

**2. Socket.IO Connection Failed**

```
Socket.IO connection error
```

→ Check CORS settings, ensure server running

**3. JWT Token Invalid**

```
401 Unauthorized
```

→ Check token expiry, re-login

**4. File Upload Failed**

```
Multer error
```

→ Check folder permissions, file size/type

**5. Email Not Sending**

```
Nodemailer error
```

→ Check SMTP credentials, enable "Less secure apps" (Gmail)

---

## **13. CONTRIBUTORS**

- **Developer**: Lê Thái Quốc Duy
- **Project**: Đồ án chuyên ngành 2 (DACN)
- **ID**: 2200006857
- **University**: [Tên trường]

---

## **14. LICENSE**

This project is licensed for educational purposes only.

---

## **15. CONTACT & SUPPORT**

- **GitHub**: https://github.com/QuocDuy1705/ParadisePerfume
- **Email**: quocduy15950@gmail.com

---

**Last Updated**: November 30, 2025
**Version**: 1.0.0
