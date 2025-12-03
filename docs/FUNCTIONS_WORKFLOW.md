# Paradise Perfume — Quy Trình Hoạt Động Các Chức Năng

Tài liệu này giải thích cách thức hoạt động end-to-end của từng chức năng chính trong hệ thống Paradise Perfume: hành động người dùng, xử lý frontend, API endpoints, xử lý backend, luồng dữ liệu và các sự kiện realtime/socket.

---

## 1. Xác thực & Quản lý Tài khoản

- **Frontend**: Người dùng nhập thông tin đăng nhập (hoặc dùng Google OAuth) tại trang Auth.

- **Luồng đăng nhập (email/password)**:

  1. Frontend gửi POST đến `POST /api/users/login` với `{email, password}`.
  2. Backend `authController.login` validate dữ liệu đầu vào, tìm user theo email, so sánh mật khẩu đã hash với bcrypt.
  3. Khi thành công, server trả về JWT token + thông tin user; frontend lưu token vào `localStorage` và cập nhật `AuthContext`.
  4. Các route được bảo vệ gửi kèm header `Authorization: Bearer {token}`; backend middleware `verifyToken` xác thực token và gắn `req.user`.

- **Luồng Google OAuth**:

  1. Frontend lấy Google token và POST đến `/api/auth/google`.
  2. Backend xác thực Google token, tạo mới hoặc tìm user, trả về JWT.

- **Đổi mật khẩu (Profile)**:

  1. Frontend gửi `PUT /api/users/change-password` với `{ currentPassword, newPassword }` và JWT header.
  2. Backend xác minh `currentPassword` qua bcrypt.compare, hash mật khẩu mới với bcrypt và lưu vào DB.

- **Quên mật khẩu**:
  1. Frontend gửi `POST /api/users/forgot-password` với email.
  2. Backend tạo reset token, lưu/mã hóa token, gửi email chứa link reset qua Nodemailer.
  3. User click vào link, frontend gửi mật khẩu mới đến reset endpoint; backend validate token và cập nhật mật khẩu.

---

## 2. Duyệt Sản Phẩm & Chi Tiết

- **Danh sách sản phẩm**:

  1. Frontend gửi request `GET /api/products` với các query parameters tùy chọn (category, brand, price range, search, page).
  2. Backend `productController.getProducts` xây dựng MongoDB query, áp dụng filters, phân trang, trả về mảng sản phẩm.
  3. Frontend hiển thị danh sách sản phẩm, mỗi sản phẩm có link đến trang chi tiết.

- **Chi tiết sản phẩm**:

  1. Frontend gửi `GET /api/products/:id` để lấy dữ liệu đầy đủ của sản phẩm.
  2. Backend trả về product document (hình ảnh, sizes, stock, mô tả).

- **Thêm/Sửa/Xóa (Admin)**:
  - Trang admin gọi các endpoint `POST/PUT/DELETE /api/admin/products` với JWT + xác minh isAdmin.
  - Hình ảnh được upload qua Multer (form-data); backend lưu files vào `/uploads/products` và đường dẫn file được lưu trong product document.

---

## 3. Giỏ Hàng và Thanh Toán

- **Thao tác giỏ hàng (frontend + API)**:

  1. Thêm vào giỏ: frontend gọi `POST /api/cart` với `{ productId, quantity, price }` (hoặc dùng cart local tùy UX).
  2. Backend `cartController` lưu cart items cho user (trong DB) hoặc merge với giỏ hàng hiện có; trả về giỏ hàng đã cập nhật.
  3. Cập nhật/Xóa: `PUT /api/cart/:productId`, `DELETE /api/cart/:productId`.

- **Luồng checkout**:

  1. Frontend thu thập thông tin giao hàng và lựa chọn thanh toán.
  2. Frontend gọi `POST /api/orders` (hoặc `/api/payment/*` tùy luồng thanh toán) với items, shipping và payment method.
  3. Backend validate đơn hàng (tồn tại sản phẩm, giá khớp, stock), áp dụng coupon nếu có, tính tổng tiền.
  4. Với COD: tạo order với status `Pending` và response 201 với chi tiết đơn hàng.
  5. Với chuyển khoản ngân hàng (TPBank QR): backend chuẩn bị payment payload và tạo QR payload/URL (dùng logic VietQR API), trả về dữ liệu QR và order. Order được lưu với `paymentMethod = bank-transfer` và `paymentStatus = Pending`.
  6. Email xác nhận được gửi cho user với tóm tắt đơn hàng.

- **Sau checkout**: giảm stock (tùy chọn khi xác nhận thanh toán vs khi tạo đơn), ghi log lịch sử đơn hàng.

---

## 4. Thanh Toán: COD & TPBank QR

- **COD**: Tạo nhanh order trong DB; thanh toán khi giao hàng.
- **Chuyển khoản ngân hàng (TPBank QR)**:
  1. Backend soạn VietQR payload (số tài khoản, tên tài khoản, mã ngân hàng, số tiền, mô tả) và request tạo QR nếu dùng provider HOẶC build raw QR payload.
  2. Frontend hiển thị QR cho user quét và chuyển tiền. Admin xác minh giao dịch (thủ công hoặc qua reconciliation endpoint).

**Validation**: order items trong request phải bao gồm `productId`, `name`, `price`, `image`, `quantity` để thỏa mãn Order schema (đã fix để bao gồm các field này).

---

## 5. Mã Giảm Giá (Coupons)

- **Tạo coupon (Admin)**: `POST /api/admin/coupons` với code, type (percentage/fixed), giá trị, giới hạn sử dụng, ngày.
- **Áp dụng coupon (User Checkout)**: frontend gửi mã coupon khi checkout; backend xác minh code, expiry, tổng tiền tối thiểu, số lần dùng còn lại, sau đó trả về số tiền giảm.
- Khi tạo đơn hàng, backend giảm số lần sử dụng coupon (nếu có).

---

## 6. Quản Lý Đơn Hàng (Admin)

- Admin lấy danh sách đơn hàng `GET /api/admin/orders` với filters.
- Admin cập nhật trạng thái đơn hàng `PUT /api/admin/orders/:id/status` để update DB và tùy chọn gửi email thông báo cho user (thông báo vận chuyển).

---

## 7. Hệ Thống Chat (Realtime + Lưu Trữ)

Phần này được mô tả chi tiết vì sử dụng Socket.IO + REST API:

- **Models**: `Conversation` và `Message`.

- **Tạo cuộc hội thoại (User)**:

  1. Khi user mở chat, frontend gọi `GET /api/chat/conversation` (protected). Backend tìm hoặc tạo Conversation document cho user đó với `status: active`.
  2. Frontend lấy conversationId và bắt đầu gửi tin nhắn.

- **Gửi tin nhắn (user → server)**: có hai đường trong codebase:

  **A. Đường Socket** (`send_message` event):

  - User socket emit `send_message` với `{ conversationId, message }`.
  - Server nhận, sanitize message, lưu `Message` document với `senderType: 'user'`, tăng conversation unread count và metadata `lastMessage`, sau đó emit `new_message` đến `admin_room`.

  **B. Đường REST** (fallback / admin gửi):

  - Admin dùng `POST /api/chat/messages` (protected admin route) để tạo message. Backend lưu và emit `new_admin_message` đến `user_{userId}`.

- **Admin nhận tin nhắn**:

  1. Admin client (AdminChat.jsx) kết nối WebSocket và join `admin_room` (emit khi connect) hoặc server tự động join admin dựa vào socket metadata.
  2. Server emit `new_message` events đến `admin_room`, admin clients lắng nghe và thêm tin nhắn vào UI.
  3. Admin UI dùng `GET /api/chat/messages/:conversationId` để fetch lịch sử tin nhắn (phân trang) và `PUT /api/chat/messages/:conversationId/read` để đánh dấu đã đọc.

- **Hiển thị đang nhập (Typing indicators)**:

  - User emit `typing` đến server với `conversationId`; server broadcast `user_typing` đến `admin_room` (hoặc đến admins đang xem conversation đó).
  - Admin emit `admin_typing` với `conversationId`; server forward đến `user_{userId}`.

- **Đóng / Mở lại cuộc hội thoại**:

  - Admin gọi `PUT /api/chat/conversations/:conversationId/close` để set `status = closed`.
  - Click vào conversation đã đóng hoặc nhận tin nhắn mới sẽ mở lại (`reopen` endpoint hoặc logic trong `getOrCreateConversation` để set `status = active`).

- **Ghi chú quan trọng đã implement gần đây**:
  - Backend `sendMessage` và socket handlers log thông tin chi tiết để debug và đảm bảo conversation tồn tại trước khi tạo messages.
  - Admin tự động join `admin_room` khi connect hoặc qua client emit `join_admin_room`.
  - Frontend kiểm tra `msg.senderType` để căn chỉnh message bubble bên trái (user) vs bên phải (admin).

---

## 8. Upload File (sản phẩm & chat)

- **Upload middleware**: `multer` được cấu hình với storage path và logic đặt tên file.
- **Hình ảnh sản phẩm**: Admin gửi multipart `FormData` đến product endpoints, backend validate mimetype/size và lưu vào `/uploads/products/`.
- **Files chat**: user/admin có thể đính kèm files, upload được xử lý qua `POST /api/chat/upload` sau đó message tham chiếu `fileUrl` và `fileType` trong `Message` document.

---

## 9. Dịch Vụ Email (Nodemailer)

- Reset mật khẩu, xác nhận đơn hàng, cập nhật trạng thái đơn được gửi qua Nodemailer sử dụng SMTP credentials từ `.env`.
- Templates được lưu dưới dạng HTML trong `utils/sendMail.js` hoặc tương tự.

---

## 10. Tóm Tắt Socket Events

- **Client → Server**:

  - `send_message` (user gửi): { conversationId, message }
  - `admin_reply` (admin gửi qua socket): { conversationId, userId, message }
  - `typing` / `stop_typing` (user đang nhập)
  - `admin_typing` (admin đang nhập)
  - `join_admin_room` / `leave_admin_room` (quản lý admin room)

- **Server → Client**:
  - `new_message` (emit đến admins khi user gửi)
  - `new_admin_message` (emit đến user cụ thể khi admin trả lời)
  - `user_typing` (emit đến admin room)
  - `admin_typing` (emit đến user trong conversation)

---

## 11. Các Trường Hợp Lỗi và Validations

- **Message sanitization**: backend `sanitizeMessage` ngăn chặn XSS và nội dung không hợp lệ; tin nhắn không hợp lệ trả về 400.
- **Conversation không tồn tại**: trả về 404 khi tạo messages cho conversation bị thiếu.
- **Kiểm tra quyền**: middleware `isAdmin` bảo vệ admin endpoints.
- **Tin nhắn trùng lặp**: frontend kiểm tra `_id` trùng lặp khi thêm vào danh sách.

---

## 12. Ví Dụ Luồng Hoạt Động

### Ví dụ: User gửi tin nhắn chat (socket)

1. User socket đã kết nối, join vào room `user_{userId}`.
2. User emit `send_message` với `{ conversationId, message }`.
3. Server sanitize, lưu `Message` doc, cập nhật `Conversation` (lastMessage, lastMessageTime, unreadCount++).
4. Server emit `new_message` đến `admin_room` với payload message đã lưu.
5. Admin clients nhận `new_message`, thêm vào UI chỉ khi `conversationId` khớp với conversation đang chọn; nếu không thì badge tăng trong danh sách conversation.

### Ví dụ: Admin trả lời qua REST endpoint

1. Admin gõ reply và submit; frontend `POST /api/chat/messages` với `{ conversationId, message }` và JWT.
2. Backend xác minh admin, tạo `Message` với `senderType: admin`, cập nhật Conversation.
3. Backend emit `new_admin_message` đến room `user_{userId}` để user nhận reply realtime.
4. Backend trả về message đã lưu cho admin; frontend thêm message vào danh sách.

---

## 13. Các File Quan Trọng Trong Code

- **Frontend**:

  - `client/src/features/admin/pages/AdminChat.jsx` — admin chat UI và socket listeners
  - `client/src/context/SocketContext.jsx` — socket provider
  - `client/src/context/AuthContext.jsx` — luồng auth và lưu token
  - `client/src/services/*` — axios API wrappers

- **Backend**:
  - `server/controllers/chatController.js` — REST endpoints cho chat
  - `server/server.js` — Socket.IO handlers và room logic
  - `server/models/Conversation.js`, `server/models/Message.js` — schemas
  - `server/routes/chatRoutes.js` — chat API routes

---

## 14. Ghi Chú & Khắc Phục Sự Cố

- **Nếu admin không nhận được tin nhắn**: kiểm tra admin socket đã join `admin_room` và server đang emit `new_message` đến room đó.
- **Nếu tin nhắn hiển thị sai phía**: kiểm tra `msg.senderType` từ server payload (`user` vs `admin`) và đảm bảo frontend dùng nó để xác định căn chỉnh.
- **Nếu lỗi 500 khi gửi tin nhắn**: xem server logs (controller stacktrace) – nguyên nhân thường gặp là thiếu conversation, user không hợp lệ, hoặc lỗi DB.

---

## 15. Các Bước Tiếp Theo (đề xuất cải tiến)

- Tập trung hóa chat logic (dùng cùng API path cho cả socket và REST để tránh trùng lặp).
- Thêm integration tests cho chat và payment flows.
- Thêm unit tests cho sanitization, coupon validation.
- Thêm monitoring/alerts cho lỗi server (Sentry/LogRocket).

---

_Cập nhật lần cuối: 30 tháng 11, 2025_
