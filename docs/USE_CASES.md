# 📋 USE CASES - PARADISE PERFUME SYSTEM

## 🎯 Actors (Người dùng)

### 1. **Guest (Khách vãng lai)**

- Người dùng chưa đăng nhập
- Có thể xem sản phẩm, blog
- Không thể mua hàng hoặc sử dụng tính năng cá nhân hóa

### 2. **Customer (Khách hàng)**

- Người dùng đã đăng ký và đăng nhập
- Có thể mua hàng, quản lý đơn hàng
- Sử dụng AI chatbot, AI recommendation

### 3. **Admin (Quản trị viên)**

- Quản lý toàn bộ hệ thống
- Quản lý sản phẩm, đơn hàng, người dùng
- Xem thống kê, báo cáo

---

## 📊 USE CASE DIAGRAM STRUCTURE

```
System Boundary: Paradise Perfume E-Commerce System

┌─────────────────────────────────────────────────────────────┐
│                    PARADISE PERFUME SYSTEM                  │
│                                                             │
│  Guest Module:                                              │
│  - Xem danh sách sản phẩm                                  │
│  - Tìm kiếm sản phẩm                                       │
│  - Xem chi tiết sản phẩm                                   │
│  - Xem blog                                                 │
│  - Đăng ký tài khoản                                       │
│  - Đăng nhập                                               │
│                                                             │
│  Customer Module:                                           │
│  - Thêm vào giỏ hàng                                       │
│  - Quản lý giỏ hàng                                        │
│  - Đặt hàng                                                 │
│  - Thanh toán (VNPay, COD)                                 │
│  - Xem lịch sử đơn hàng                                    │
│  - Đánh giá sản phẩm                                       │
│  - Sử dụng AI Chatbot                                      │
│  - Nhận AI Recommendation                                  │
│  - Quản lý Wishlist                                        │
│  - Cập nhật thông tin cá nhân                              │
│  - Chat với admin                                          │
│  - Sử dụng coupon                                          │
│                                                             │
│  Admin Module:                                              │
│  - Quản lý sản phẩm (CRUD)                                 │
│  - Quản lý đơn hàng                                        │
│  - Quản lý người dùng                                      │
│  - Quản lý blog                                            │
│  - Quản lý coupon                                          │
│  - Xem thống kê doanh thu                                  │
│  - Xem báo cáo phân tích                                   │
│  - Chat với khách hàng                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 CHI TIẾT USE CASES

### 🔵 GUEST USE CASES

#### UC-01: Xem Danh Sách Sản Phẩm

**Actor:** Guest, Customer  
**Precondition:** Truy cập website  
**Main Flow:**

1. Guest vào trang Products
2. System hiển thị danh sách sản phẩm với phân trang
3. Guest có thể lọc theo category, price, type
4. System cập nhật danh sách theo filter

**Postcondition:** Danh sách sản phẩm được hiển thị

---

#### UC-02: Tìm Kiếm Sản Phẩm

**Actor:** Guest, Customer  
**Precondition:** Ở trang web  
**Main Flow:**

1. Guest nhập từ khóa vào search box
2. System tìm kiếm trong tên, mô tả sản phẩm
3. System hiển thị kết quả phù hợp

**Alternative Flow:**

- 3a. Không tìm thấy: Hiển thị "Không có kết quả"

**Postcondition:** Kết quả tìm kiếm được hiển thị

---

#### UC-03: Xem Chi Tiết Sản Phẩm

**Actor:** Guest, Customer  
**Precondition:** Có sản phẩm trong hệ thống  
**Main Flow:**

1. Guest click vào sản phẩm
2. System hiển thị thông tin chi tiết:
   - Tên, giá, mô tả
   - Hình ảnh
   - Đánh giá và reviews
   - Sản phẩm liên quan

**Postcondition:** Chi tiết sản phẩm được hiển thị

---

#### UC-04: Xem Blog

**Actor:** Guest, Customer  
**Precondition:** Có blog posts trong hệ thống  
**Main Flow:**

1. Guest vào trang Blog
2. System hiển thị danh sách blog posts
3. Guest click vào bài viết
4. System hiển thị nội dung chi tiết

**Postcondition:** Blog được hiển thị

---

#### UC-05: Đăng Ký Tài Khoản

**Actor:** Guest  
**Precondition:** Chưa có tài khoản  
**Main Flow:**

1. Guest click "Sign Up"
2. System hiển thị form đăng ký
3. Guest nhập thông tin:
   - First Name, Last Name
   - Email
   - Password
   - Phone
4. System validate thông tin
5. System tạo tài khoản
6. System gửi email xác nhận

**Alternative Flow:**

- 4a. Email đã tồn tại: Thông báo lỗi
- 4b. Password yếu: Yêu cầu password mạnh hơn

**Postcondition:** Tài khoản được tạo thành công

---

#### UC-06: Đăng Nhập

**Actor:** Guest  
**Precondition:** Đã có tài khoản  
**Main Flow:**

1. Guest click "Login"
2. System hiển thị form đăng nhập
3. Guest nhập email và password
4. System xác thực thông tin
5. System tạo JWT token
6. System chuyển hướng về trang chủ

**Alternative Flow:**

- 4a. Sai thông tin: Thông báo lỗi
- 4b. Tài khoản bị khóa: Thông báo liên hệ admin

**Postcondition:** Customer đăng nhập thành công

---

### 🟢 CUSTOMER USE CASES

#### UC-07: Thêm Vào Giỏ Hàng

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer xem chi tiết sản phẩm
2. Customer chọn số lượng
3. Customer click "Add to Cart"
4. System kiểm tra tồn kho
5. System thêm vào giỏ hàng
6. System hiển thị thông báo thành công

**Alternative Flow:**

- 4a. Hết hàng: Thông báo "Out of Stock"
- 4b. Vượt quá tồn kho: Thông báo giới hạn

**Postcondition:** Sản phẩm được thêm vào giỏ

---

#### UC-08: Quản Lý Giỏ Hàng

**Actor:** Customer  
**Precondition:** Đã đăng nhập, có sản phẩm trong giỏ  
**Main Flow:**

1. Customer vào trang Cart
2. System hiển thị danh sách sản phẩm trong giỏ
3. Customer có thể:
   - Thay đổi số lượng
   - Xóa sản phẩm
   - Áp dụng coupon
4. System cập nhật tổng tiền

**Postcondition:** Giỏ hàng được cập nhật

---

#### UC-09: Đặt Hàng

**Actor:** Customer  
**Precondition:** Có sản phẩm trong giỏ  
**Main Flow:**

1. Customer click "Checkout"
2. System hiển thị form checkout
3. Customer nhập thông tin giao hàng:
   - Địa chỉ
   - Số điện thoại
   - Ghi chú
4. Customer chọn phương thức thanh toán
5. Customer xác nhận đơn hàng
6. System tạo order
7. System gửi email xác nhận

**Postcondition:** Đơn hàng được tạo

---

#### UC-10: Thanh Toán VNPay

**Actor:** Customer  
**Precondition:** Đã tạo đơn hàng  
**Main Flow:**

1. Customer chọn "VNPay"
2. System tạo payment URL
3. System chuyển hướng đến VNPay
4. Customer nhập thông tin thẻ
5. VNPay xác thực thanh toán
6. VNPay callback về system
7. System cập nhật trạng thái đơn hàng
8. System hiển thị trang success

**Alternative Flow:**

- 5a. Thanh toán thất bại: Quay về trang checkout

**Postcondition:** Thanh toán thành công

---

#### UC-11: Thanh Toán COD

**Actor:** Customer  
**Precondition:** Đã tạo đơn hàng  
**Main Flow:**

1. Customer chọn "COD"
2. System xác nhận đơn hàng
3. System đặt isPaid = false
4. System hiển thị trang success

**Postcondition:** Đơn hàng được tạo với COD

---

#### UC-12: Xem Lịch Sử Đơn Hàng

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer vào trang Orders
2. System lấy danh sách đơn hàng của customer
3. System hiển thị orders với thông tin:
   - Order ID
   - Ngày đặt
   - Tổng tiền
   - Trạng thái
4. Customer có thể xem chi tiết order

**Postcondition:** Lịch sử đơn hàng được hiển thị

---

#### UC-13: Đánh Giá Sản Phẩm

**Actor:** Customer  
**Precondition:** Đã mua sản phẩm  
**Main Flow:**

1. Customer vào trang chi tiết sản phẩm
2. Customer click "Write Review"
3. System hiển thị form review
4. Customer nhập:
   - Rating (1-5 sao)
   - Comment
5. System lưu review
6. System cập nhật average rating của sản phẩm

**Postcondition:** Review được tạo

---

#### UC-14: Sử Dụng AI Chatbot

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer click icon chat
2. System hiển thị chatbot
3. Customer gửi câu hỏi
4. System gửi request đến Gemini AI
5. AI phân tích và trả lời
6. System hiển thị response
7. Lưu conversation vào database

**Postcondition:** Câu hỏi được trả lời

---

#### UC-15: Nhận AI Recommendation

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer vào trang AI Recommendation
2. Customer nhập preferences:
   - Giới tính
   - Độ tuổi
   - Dịp sử dụng
   - Mùi hương yêu thích
3. System gửi request đến Gemini AI
4. AI phân tích và gợi ý sản phẩm
5. System hiển thị recommendations

**Postcondition:** Sản phẩm được gợi ý

---

#### UC-16: Quản Lý Wishlist

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer click icon wishlist trên sản phẩm
2. System thêm/xóa sản phẩm khỏi wishlist
3. Customer có thể xem trang Wishlist
4. System hiển thị danh sách sản phẩm yêu thích

**Postcondition:** Wishlist được cập nhật

---

#### UC-17: Cập Nhật Thông Tin Cá Nhân

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer vào trang Profile
2. System hiển thị thông tin hiện tại
3. Customer chỉnh sửa:
   - Name
   - Phone
   - Address
   - Avatar
4. System validate và lưu thông tin

**Postcondition:** Thông tin được cập nhật

---

#### UC-18: Chat Với Admin

**Actor:** Customer  
**Precondition:** Đã đăng nhập  
**Main Flow:**

1. Customer click "Support Chat"
2. System tạo conversation
3. Customer gửi tin nhắn
4. System lưu message
5. Admin nhận thông báo
6. Admin trả lời
7. Customer nhận tin nhắn realtime

**Postcondition:** Conversation được tạo

---

#### UC-19: Sử Dụng Coupon

**Actor:** Customer  
**Precondition:** Có coupon code hợp lệ  
**Main Flow:**

1. Customer ở trang Checkout
2. Customer nhập coupon code
3. System validate coupon:
   - Kiểm tra tồn tại
   - Kiểm tra expiry date
   - Kiểm tra số lần sử dụng
   - Kiểm tra min purchase
4. System áp dụng giảm giá
5. System cập nhật tổng tiền

**Alternative Flow:**

- 3a. Coupon không hợp lệ: Thông báo lỗi

**Postcondition:** Giảm giá được áp dụng

---

### 🔴 ADMIN USE CASES

#### UC-20: Quản Lý Sản Phẩm (CRUD)

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin

**UC-20a: Tạo Sản Phẩm**
**Main Flow:**

1. Admin vào trang Admin Products
2. Admin click "Create Product"
3. System hiển thị form
4. Admin nhập thông tin:
   - Name, price, description
   - Category, type
   - Images
   - Stock
5. System validate và tạo sản phẩm

**UC-20b: Sửa Sản Phẩm**
**Main Flow:**

1. Admin chọn sản phẩm
2. Admin click "Edit"
3. System hiển thị form với dữ liệu hiện tại
4. Admin chỉnh sửa
5. System cập nhật sản phẩm

**UC-20c: Xóa Sản Phẩm**
**Main Flow:**

1. Admin chọn sản phẩm
2. Admin click "Delete"
3. System hiển thị confirm dialog
4. Admin xác nhận
5. System xóa sản phẩm

**Postcondition:** Sản phẩm được quản lý

---

#### UC-21: Quản Lý Đơn Hàng

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Orders
2. System hiển thị danh sách orders
3. Admin có thể:
   - Xem chi tiết order
   - Cập nhật trạng thái (pending → shipped → delivered)
   - Đánh dấu đã giao hàng
   - Hủy đơn
4. System cập nhật order
5. System gửi email thông báo cho customer

**Postcondition:** Đơn hàng được cập nhật

---

#### UC-22: Quản Lý Người Dùng

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Users
2. System hiển thị danh sách users
3. Admin có thể:
   - Xem thông tin user
   - Cấp/thu hồi quyền admin
   - Xóa user
   - Tạo user mới
4. System cập nhật user

**Postcondition:** Users được quản lý

---

#### UC-23: Quản Lý Blog

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Blogs
2. Admin có thể:
   - Tạo blog mới (title, content, images)
   - Sửa blog
   - Xóa blog
   - Publish/unpublish
3. System lưu blog

**Postcondition:** Blog được quản lý

---

#### UC-24: Quản Lý Coupon

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Coupons
2. Admin có thể:
   - Tạo coupon mới:
     - Code
     - Discount (% hoặc fixed)
     - Expiry date
     - Min purchase
     - Max uses
   - Sửa coupon
   - Xóa coupon
   - Deactivate coupon
3. System lưu coupon

**Postcondition:** Coupon được quản lý

---

#### UC-25: Xem Thống Kê Doanh Thu

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Overview
2. System hiển thị dashboard với:
   - Tổng doanh thu
   - Số đơn hàng
   - Số khách hàng
   - Biểu đồ doanh thu theo tháng
3. Admin chọn bộ lọc thời gian:
   - 7 ngày
   - Tháng này
   - Quý này
   - Năm nay
   - Custom range
4. System cập nhật thống kê theo filter

**Postcondition:** Thống kê được hiển thị

---

#### UC-26: Xem Báo Cáo Phân Tích

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Overview
2. System hiển thị:
   - Top 10 sản phẩm bán chạy
   - Top 10 sản phẩm bán chậm
   - Sản phẩm chưa bán được
   - Biểu đồ khách hàng đăng ký theo tháng
   - % thay đổi so với kỳ trước
3. Admin phân tích dữ liệu

**Postcondition:** Báo cáo được hiển thị

---

#### UC-27: Chat Với Khách Hàng

**Actor:** Admin  
**Precondition:** Đã đăng nhập với quyền admin  
**Main Flow:**

1. Admin vào trang Admin Chat
2. System hiển thị danh sách conversations
3. Admin chọn conversation
4. System hiển thị lịch sử chat
5. Admin gửi tin nhắn
6. System gửi realtime đến customer

**Postcondition:** Tin nhắn được gửi

---

## 🔗 USE CASE RELATIONSHIPS

### Include Relationships:

- UC-09 (Đặt Hàng) **includes** UC-10 (Thanh Toán VNPay) hoặc UC-11 (Thanh Toán COD)
- UC-08 (Quản Lý Giỏ Hàng) **includes** UC-19 (Sử Dụng Coupon)
- UC-20 (Quản Lý Sản Phẩm) **includes** Upload Image

### Extend Relationships:

- UC-14 (AI Chatbot) **extends** UC-03 (Xem Chi Tiết Sản Phẩm)
- UC-15 (AI Recommendation) **extends** UC-01 (Xem Danh Sách Sản Phẩm)
- UC-16 (Wishlist) **extends** UC-03 (Xem Chi Tiết Sản Phẩm)

### Generalization:

- Guest và Customer **generalize** User
- UC-10 và UC-11 **generalize** Payment

---

## 📐 HƯỚNG DẪN VẼ TRONG ASTAH UML

### Bước 1: Tạo Use Case Diagram

1. Mở Astah UML
2. File → New → Use Case Diagram
3. Đặt tên: "Paradise Perfume System Use Cases"

### Bước 2: Thêm Actors

1. Kéo thả **Actor** từ toolbar
2. Tạo 3 actors:
   - Guest (stick figure)
   - Customer (stick figure)
   - Admin (stick figure)
3. Đặt vị trí:
   - Guest: Bên trái trên
   - Customer: Bên trái giữa
   - Admin: Bên phải

### Bước 3: Tạo System Boundary

1. Kéo thả **System** từ toolbar
2. Đặt tên: "Paradise Perfume E-Commerce"
3. Resize để chứa tất cả use cases

### Bước 4: Thêm Use Cases

1. Kéo thả **Use Case** (oval) vào trong system boundary
2. Tạo 27 use cases như đã liệt kê
3. Nhóm theo module:
   - Guest module (top)
   - Customer module (middle)
   - Admin module (bottom)

### Bước 5: Vẽ Associations

1. Chọn **Association** từ toolbar
2. Kéo từ Actor đến Use Case
3. Kết nối:
   - Guest → UC-01 đến UC-06
   - Customer → UC-07 đến UC-19
   - Admin → UC-20 đến UC-27

### Bước 6: Thêm Include/Extend

1. Chọn **Include** relationship
2. Kéo từ UC-09 → UC-10 (<<include>>)
3. Chọn **Extend** relationship
4. Kéo từ UC-14 → UC-03 (<<extend>>)

### Bước 7: Thêm Generalization

1. Chọn **Generalization**
2. Kéo từ Customer → Guest
3. Kéo từ UC-10, UC-11 → Payment (abstract)

### Bước 8: Format

1. Adjust layout cho đẹp
2. Align use cases theo grid
3. Add colors:
   - Guest use cases: Light blue
   - Customer use cases: Light green
   - Admin use cases: Light red

### Bước 9: Add Notes

1. Thêm **Note** để giải thích relationships
2. Link notes đến use cases

### Bước 10: Export

1. File → Export → Image
2. Chọn PNG hoặc SVG
3. Save diagram

---

## 📊 USE CASE PRIORITY

### High Priority (Must Have):

- UC-01: Xem Danh Sách Sản Phẩm ⭐⭐⭐
- UC-03: Xem Chi Tiết Sản Phẩm ⭐⭐⭐
- UC-05: Đăng Ký Tài Khoản ⭐⭐⭐
- UC-06: Đăng Nhập ⭐⭐⭐
- UC-07: Thêm Vào Giỏ Hàng ⭐⭐⭐
- UC-09: Đặt Hàng ⭐⭐⭐
- UC-10/11: Thanh Toán ⭐⭐⭐
- UC-20: Quản Lý Sản Phẩm ⭐⭐⭐
- UC-21: Quản Lý Đơn Hàng ⭐⭐⭐

### Medium Priority (Should Have):

- UC-02: Tìm Kiếm Sản Phẩm ⭐⭐
- UC-12: Xem Lịch Sử Đơn Hàng ⭐⭐
- UC-13: Đánh Giá Sản Phẩm ⭐⭐
- UC-22: Quản Lý Người Dùng ⭐⭐
- UC-25: Xem Thống Kê ⭐⭐

### Low Priority (Nice to Have):

- UC-04: Xem Blog ⭐
- UC-14: AI Chatbot ⭐
- UC-15: AI Recommendation ⭐
- UC-16: Wishlist ⭐
- UC-18: Chat Với Admin ⭐
- UC-23: Quản Lý Blog ⭐
- UC-24: Quản Lý Coupon ⭐

---

## 💡 TIPS VẼ ASTAH

1. **Layout:** Sử dụng grid layout để căn chỉnh
2. **Colors:** Dùng màu để phân biệt actors và modules
3. **Font:** Sử dụng font size phù hợp (10-12pt)
4. **Spacing:** Giữ khoảng cách đều giữa các use cases
5. **Arrows:** Sử dụng đúng loại mũi tên cho từng relationship
6. **Labels:** Thêm label cho include/extend relationships
7. **Notes:** Thêm ghi chú cho các use cases phức tạp
8. **Layers:** Sử dụng layers để tổ chức diagram lớn

---

**Document Version:** 1.0  
**Last Updated:** December 3, 2025  
**Author:** Paradise Perfume Development Team
