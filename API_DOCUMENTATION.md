# 📘 API Documentation - Paradise Perfume

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Hầu hết các endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register

Đăng ký tài khoản mới

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`

```json
{
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Login

Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Get Current User

Lấy thông tin user hiện tại

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🛍️ Products Endpoints

### Get All Products

Lấy danh sách sản phẩm với filter và pagination

**Endpoint:** `GET /products`

**Query Parameters:**

- `page` (number): Trang hiện tại (default: 1)
- `limit` (number): Số sản phẩm/trang (default: 12)
- `category` (string): Lọc theo danh mục (men/women/mini/giftset)
- `type` (string): Lọc theo loại (eau-de-parfum/eau-de-toilette)
- `search` (string): Tìm kiếm theo tên
- `sort` (string): Sắp xếp (price-asc/price-desc/name-asc/name-desc)

**Example:** `GET /products?category=men&page=1&limit=12&sort=price-asc`

**Response:** `200 OK`

```json
{
  "products": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "CHANEL N°5",
      "price": 2500000,
      "image": "https://example.com/images/chanel-n5.jpg",
      "description": "Nước hoa kinh điển...",
      "category": "women",
      "type": "eau-de-parfum",
      "rating": 4.8,
      "numReviews": 156
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pages": 5,
    "total": 60,
    "limit": 12
  }
}
```

### Get Product by ID

Lấy chi tiết sản phẩm

**Endpoint:** `GET /products/:id`

**Response:** `200 OK`

```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "CHANEL N°5",
  "price": 2500000,
  "image": "https://example.com/images/chanel-n5.jpg",
  "description": "Nước hoa kinh điển từ năm 1921...",
  "category": "women",
  "type": "eau-de-parfum",
  "rating": 4.8,
  "numReviews": 156,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Create Product (Admin)

Tạo sản phẩm mới

**Endpoint:** `POST /products`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**

```json
{
  "name": "DIOR Sauvage",
  "price": 3200000,
  "image": "https://example.com/images/dior-sauvage.jpg",
  "description": "Hương thơm mạnh mẽ...",
  "category": "men",
  "type": "eau-de-toilette"
}
```

**Response:** `201 Created`

### Update Product (Admin)

Cập nhật sản phẩm

**Endpoint:** `PUT /products/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (Tương tự Create)

**Response:** `200 OK`

### Delete Product (Admin)

Xóa sản phẩm

**Endpoint:** `DELETE /products/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

```json
{
  "message": "Xóa sản phẩm thành công"
}
```

---

## 🛒 Cart Endpoints

### Get Cart

Lấy giỏ hàng của user

**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "items": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "product": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "CHANEL N°5",
        "price": 2500000,
        "image": "https://example.com/images/chanel-n5.jpg"
      },
      "quantity": 2
    }
  ],
  "totalPrice": 5000000
}
```

### Add to Cart

Thêm sản phẩm vào giỏ

**Endpoint:** `POST /cart/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantity": 1
}
```

**Response:** `200 OK`

### Update Cart Item

Cập nhật số lượng

**Endpoint:** `PUT /cart/update/:itemId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

### Remove from Cart

Xóa sản phẩm khỏi giỏ

**Endpoint:** `DELETE /cart/remove/:itemId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Clear Cart

Xóa toàn bộ giỏ hàng

**Endpoint:** `DELETE /cart/clear`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 📦 Orders Endpoints

### Get User Orders

Lấy danh sách đơn hàng của user

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "totalPrice": 5000000,
    "shippingFee": 30000,
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "TP.HCM",
      "district": "Quận 1"
    },
    "paymentMethod": "vnpay",
    "paymentStatus": "paid",
    "status": "shipping",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Order by ID

Chi tiết đơn hàng

**Endpoint:** `GET /orders/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Create Order

Tạo đơn hàng mới

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "items": [
    {
      "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 2,
      "price": 2500000
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "TP.HCM",
    "district": "Quận 1"
  },
  "note": "Giao giờ hành chính",
  "paymentMethod": "cod",
  "shippingFee": 30000,
  "totalPrice": 5030000
}
```

**Response:** `201 Created`

### Update Order Status (Admin)

Cập nhật trạng thái đơn hàng

**Endpoint:** `PUT /orders/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**

```json
{
  "status": "shipping"
}
```

**Possible Status:**

- `pending`: Chờ xác nhận
- `confirmed`: Đã xác nhận
- `shipping`: Đang giao
- `delivered`: Đã giao
- `cancelled`: Đã hủy

**Response:** `200 OK`

---

## 💳 Payment Endpoints

### Create VNPay Payment

Tạo link thanh toán VNPay

**Endpoint:** `POST /payment/vnpay`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "shippingAddress": {...},
  "note": "",
  "shippingFee": 30000,
  "items": [...],
  "totalPrice": 5030000
}
```

**Response:** `200 OK`

```json
{
  "payUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...",
  "orderId": "VNP60f7b3b3b3b3b3b3b3b3b3b31735689600"
}
```

### VNPay Return

Callback từ VNPay sau khi thanh toán

**Endpoint:** `GET /payment/vnpay-return`

**Query Parameters:** (Tự động từ VNPay)

**Response:** Redirect về frontend

### Create MoMo Payment

Tạo link thanh toán MoMo

**Endpoint:** `POST /payment/momo`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Tương tự VNPay)

**Response:** `200 OK`

```json
{
  "payUrl": "https://test-payment.momo.vn/...",
  "orderId": "MOMO60f7b3b3b3b3b3b3b3b3b3b31735689600",
  "message": "Tạo thanh toán MoMo thành công"
}
```

---

## ⭐ Reviews Endpoints

### Get Product Reviews

Lấy đánh giá của sản phẩm

**Endpoint:** `GET /reviews/product/:productId`

**Query Parameters:**

- `page` (number): Trang hiện tại
- `limit` (number): Số review/trang
- `sort` (string): newest/oldest/highest/lowest/helpful

**Response:** `200 OK`

```json
{
  "reviews": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "firstName": "Nguyễn",
        "lastName": "Văn A"
      },
      "product": "60f7b3b3b3b3b3b3b3b3b3b3",
      "rating": 5,
      "title": "Rất tuyệt vời",
      "comment": "Mùi hương sang trọng...",
      "helpful": 12,
      "verified": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 156,
    "fiveStars": 120,
    "fourStars": 20,
    "threeStars": 10,
    "twoStars": 4,
    "oneStar": 2
  },
  "pagination": {
    "currentPage": 1,
    "pages": 16,
    "total": 156
  }
}
```

### Create Review

Tạo đánh giá mới

**Endpoint:** `POST /reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "rating": 5,
  "title": "Rất tuyệt vời",
  "comment": "Mùi hương sang trọng, lưu hương lâu..."
}
```

**Response:** `201 Created`

### Mark Review as Helpful

Đánh dấu review hữu ích

**Endpoint:** `POST /reviews/:id/helpful`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## ❤️ Wishlist Endpoints

### Get Wishlist

Lấy danh sách yêu thích

**Endpoint:** `GET /wishlist`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "products": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "CHANEL N°5",
      "price": 2500000,
      "image": "https://example.com/images/chanel-n5.jpg"
    }
  ]
}
```

### Add to Wishlist

Thêm vào wishlist

**Endpoint:** `POST /wishlist/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response:** `200 OK`

### Remove from Wishlist

Xóa khỏi wishlist

**Endpoint:** `DELETE /wishlist/remove/:productId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Clear Wishlist

Xóa toàn bộ wishlist

**Endpoint:** `DELETE /wishlist/clear`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 👥 Users Endpoints (Admin)

### Get All Users

Lấy danh sách user

**Endpoint:** `GET /admin/users`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Update User Role

Cập nhật quyền user

**Endpoint:** `PUT /admin/users/:id/role`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**

```json
{
  "role": "admin"
}
```

**Response:** `200 OK`

### Delete User

Xóa user

**Endpoint:** `DELETE /admin/users/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

## 📊 Admin Statistics

### Get Dashboard Stats

Lấy thống kê tổng quan

**Endpoint:** `GET /admin/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

```json
{
  "revenue": {
    "total": 150000000,
    "thisMonth": 45000000,
    "change": 15.5
  },
  "orders": {
    "total": 350,
    "pending": 12,
    "change": 8.2
  },
  "products": {
    "total": 60,
    "outOfStock": 5
  },
  "users": {
    "total": 1250,
    "newThisMonth": 85
  },
  "revenueChart": [
    { "date": "2025-01-01", "revenue": 5000000, "orders": 12 },
    ...
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error",
  "errors": {
    "email": "Email không hợp lệ",
    "password": "Mật khẩu phải có ít nhất 6 ký tự"
  }
}
```

### 401 Unauthorized

```json
{
  "message": "Vui lòng đăng nhập"
}
```

### 403 Forbidden

```json
{
  "message": "Bạn không có quyền truy cập"
}
```

### 404 Not Found

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

### 500 Internal Server Error

```json
{
  "message": "Lỗi server",
  "error": "Error details..."
}
```

---

## 🔌 WebSocket Events (Socket.IO)

### Client → Server

**Join chat room:**

```javascript
socket.emit("join", { userId: "60f7b3b3b3b3b3b3b3b3b3b3" });
```

**Send message:**

```javascript
socket.emit("send_message", {
  conversationId: "60f7b3b3b3b3b3b3b3b3b3b3",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  message: "Xin chào",
  senderModel: "User",
});
```

**Typing indicator:**

```javascript
socket.emit("typing", {
  conversationId: "60f7b3b3b3b3b3b3b3b3b3b3",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
});
```

### Server → Client

**New message:**

```javascript
socket.on("new_message", (message) => {
  // Handle new message
});
```

**New admin message:**

```javascript
socket.on("new_admin_message", (message) => {
  // Handle admin message
});
```

**Typing indicator:**

```javascript
socket.on("user_typing", (data) => {
  // Show typing indicator
});
```

---

## 📝 Notes

- Tất cả dates theo format ISO 8601
- Prices đơn vị: VNĐ
- Images: URL string hoặc base64
- Token expires: 30 ngày
- Rate limit: 100 requests/15 phút

---

**Last updated:** November 2025
