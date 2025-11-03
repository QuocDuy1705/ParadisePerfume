# Chat System Improvements Documentation

## 📋 Tổng quan

Tài liệu này mô tả tất cả các cải thiện đã được thực hiện cho hệ thống chat của Paradise Perfume.

## ✅ Danh sách cải tiến đã hoàn thành

### 1. 🔒 Xóa Development Auth Fallback

**File:** `server/server.js`

**Thay đổi:**

- Xóa đoạn code cho phép kết nối socket mà không cần authentication trong development mode
- Tăng cường bảo mật, yêu cầu JWT token hợp lệ cho mọi môi trường

**Lý do:** Tránh lỗ hổng bảo mật khi triển khai production

---

### 2. 🛡️ Rate Limiting

**Files:**

- `server/middleware/rateLimiter.js` (MỚI)
- `server/routes/chatRoutes.js`

**Chức năng:**

- Giới hạn 100 tin nhắn/giờ cho mỗi user
- Giới hạn 10 conversation requests/giờ
- Admin được miễn rate limit
- Sử dụng user ID hoặc IP address làm key

**Cấu hình:**

```javascript
chatMessageLimiter: 100 messages/hour per user
conversationLimiter: 10 requests/hour per user
generalLimiter: 1000 requests/15min per IP
```

**API Response khi vượt giới hạn:**

```json
{
  "message": "Too many messages sent from this account, please try again after an hour"
}
```

---

### 3. 🧹 Input Sanitization (XSS Protection)

**Files:**

- `server/utils/sanitizer.js` (MỚI)
- `server/controllers/chatController.js`
- `server/server.js`

**Chức năng:**

- Loại bỏ HTML tags và script tags
- Escape special characters
- Giới hạn độ dài tin nhắn: 2000 ký tự
- Trim whitespace
- Validate email và phone number

**Ví dụ:**

```javascript
Input: "<script>alert('xss')</script>Hello";
Output: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;Hello";
```

**Dependencies:**

- `validator` - Email, URL validation
- `xss` - XSS sanitization

---

### 4. 📄 Pagination cho Messages

**File:** `server/controllers/chatController.js`

**API Endpoint:** `GET /api/chat/messages/:conversationId`

**Query Parameters:**

- `limit` - Số lượng messages (default: 50)
- `before` - Load older messages (cursor-based)
- `after` - Load newer messages (realtime updates)

**Response:**

```json
{
  "messages": [...],
  "hasMore": true,
  "oldest": "2025-10-28T10:00:00.000Z",
  "newest": "2025-10-28T11:00:00.000Z"
}
```

**Cách sử dụng:**

```javascript
// Load initial messages
GET /api/chat/messages/123?limit=50

// Load older messages (scroll up)
GET /api/chat/messages/123?limit=50&before=2025-10-28T10:00:00.000Z

// Load newer messages
GET /api/chat/messages/123?after=2025-10-28T11:00:00.000Z
```

---

### 5. ⌨️ Typing Indicators

**File:** `server/server.js`

**Socket Events:**

**Client → Server:**

```javascript
socket.emit("typing", {
  conversationId: "123",
  userId: "456", // (if admin replying to user)
});

socket.emit("stop_typing", {
  conversationId: "123",
  userId: "456",
});
```

**Server → Client:**

```javascript
// To user
socket.on("admin_typing", (data) => {
  // data: { userId, conversationId, isTyping, timestamp }
});

// To admin
socket.on("user_typing", (data) => {
  // data: { userId, conversationId, isTyping, timestamp }
});
```

**Recommended UI behavior:**

- Show "User is typing..." for 3 seconds
- Auto-hide if no new typing event
- Show typing indicator only in active conversation

---

### 6. ✅ Read Receipts

**File:** `server/controllers/chatController.js`

**API Endpoint:** `PUT /api/chat/messages/:conversationId/read`

**Chức năng:**

- Mark messages as read
- Update `readAt` timestamp
- Emit socket event to other party
- Reset unread count

**Socket Event:**

```javascript
socket.on("messages_read", (data) => {
  // data: { conversationId, readBy, readAt }
});
```

**UI Implementation:**

- Single checkmark (✓) - Message sent
- Double checkmark (✓✓) - Message delivered
- Blue double checkmark (✓✓) - Message read

---

### 7. 🔍 Conversation Search & Filter (Admin)

**File:** `server/controllers/chatController.js`

**API Endpoint:** `GET /api/chat/conversations`

**Query Parameters:**

- `search` - Search by userName or userEmail
- `status` - Filter by status (active, closed)
- `sortBy` - Sort field (lastMessageTime, unreadCount, createdAt)
- `order` - Sort order (desc, asc)
- `limit` - Results per page (default: 50)
- `skip` - Pagination offset

**Examples:**

```javascript
// Search conversations
GET /api/chat/conversations?search=alex

// Filter by status
GET /api/chat/conversations?status=active

// Sort by unread count
GET /api/chat/conversations?sortBy=unreadCount&order=desc

// Pagination
GET /api/chat/conversations?limit=20&skip=20
```

**Response:**

```json
{
  "conversations": [...],
  "total": 100,
  "hasMore": true
}
```

---

### 8. 📎 File Upload (Images & PDFs)

**Files:**

- `server/middleware/upload.js` (MỚI)
- `server/controllers/chatController.js`
- `server/routes/chatRoutes.js`

**API Endpoint:** `POST /api/chat/upload`

**Request:**

```javascript
const formData = new FormData();
formData.append("file", file);
formData.append("conversationId", conversationId);

fetch("/api/chat/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Validation:**

- Allowed types: JPEG, PNG, GIF, PDF
- Max file size: 5MB
- Files stored in: `/uploads/chat/`
- Filename format: `timestamp-userId-originalname`

**Response:**

```json
{
  "_id": "msg123",
  "conversationId": "conv123",
  "senderId": "user456",
  "senderType": "user",
  "senderName": "John Doe",
  "message": "Sent an image",
  "fileUrl": "/uploads/chat/1698500000000-user456-photo.jpg",
  "fileType": "image",
  "fileName": "photo.jpg",
  "createdAt": "2025-10-28T12:00:00.000Z"
}
```

**Error Handling:**

```json
{
  "message": "File too large. Maximum size is 5MB."
}
```

---

## 🌐 Socket.IO Events Summary

### Client Events (emit to server):

| Event          | Data                                  | Description          |
| -------------- | ------------------------------------- | -------------------- |
| `send_message` | `{ conversationId, message }`         | Send user message    |
| `admin_reply`  | `{ conversationId, userId, message }` | Send admin reply     |
| `typing`       | `{ conversationId, userId? }`         | User/admin is typing |
| `stop_typing`  | `{ conversationId, userId? }`         | Stop typing          |

### Server Events (listen on client):

| Event               | Data                                              | Description                 |
| ------------------- | ------------------------------------------------- | --------------------------- |
| `new_message`       | `Message object`                                  | New user message (to admin) |
| `new_admin_message` | `Message object`                                  | New admin reply (to user)   |
| `user_typing`       | `{ userId, conversationId, isTyping, timestamp }` | User typing (to admin)      |
| `admin_typing`      | `{ userId, conversationId, isTyping, timestamp }` | Admin typing (to user)      |
| `messages_read`     | `{ conversationId, readBy, readAt }`              | Messages marked as read     |
| `error`             | `{ message }`                                     | Error occurred              |

---

## 📊 Database Schema Updates

### Message Model

Các trường mới cần thêm (nếu chưa có):

```javascript
{
  fileUrl: String,        // URL to uploaded file
  fileType: String,       // 'image' or 'file'
  fileName: String,       // Original filename
  readAt: Date,          // When message was read
  isRead: Boolean        // Read status
}
```

### Conversation Model

Không có thay đổi schema, nhưng queries được tối ưu hóa.

---

## 🔧 Configuration

### Environment Variables

Không cần thêm env variables mới.

### Dependencies Added

```json
{
  "express-rate-limit": "^7.0.0",
  "validator": "^13.11.0",
  "xss": "^1.0.14",
  "multer": "^1.4.5-lts.1"
}
```

### Installation

```bash
cd server
npm install express-rate-limit validator xss multer
```

---

## 🧪 Testing Guide

### 1. Test Rate Limiting

```javascript
// Send 101 messages rapidly
for (let i = 0; i < 101; i++) {
  await sendMessage({ conversationId, message: `Test ${i}` });
}
// Expected: 101st request should return 429 error
```

### 2. Test Input Sanitization

```javascript
// Send XSS attack
await sendMessage({
  conversationId,
  message: '<script>alert("xss")</script>',
});
// Expected: Message saved as escaped HTML
```

### 3. Test Pagination

```javascript
// Load initial messages
const initial = await getMessages(conversationId);

// Load older messages
const older = await getMessages(conversationId, {
  before: initial.oldest,
});
// Expected: Older messages loaded
```

### 4. Test Typing Indicators

```javascript
socket.emit("typing", { conversationId });
// Wait 3 seconds
socket.emit("stop_typing", { conversationId });
// Expected: Typing indicator shown then hidden
```

### 5. Test File Upload

```javascript
const formData = new FormData();
formData.append("file", imageFile);
formData.append("conversationId", conversationId);

const response = await fetch("/api/chat/upload", {
  method: "POST",
  body: formData,
  headers: { Authorization: `Bearer ${token}` },
});
// Expected: File uploaded, message created
```

### 6. Test Read Receipts

```javascript
await markAsRead(conversationId);
// Expected: Socket event emitted, readAt updated
```

---

## 📝 API Endpoints Summary

| Method | Endpoint                                        | Auth     | Description                                |
| ------ | ----------------------------------------------- | -------- | ------------------------------------------ |
| GET    | `/api/chat/conversation`                        | ✅       | Get/create user conversation               |
| GET    | `/api/chat/conversations`                       | ✅ Admin | Get all conversations (with search/filter) |
| GET    | `/api/chat/messages/:conversationId`            | ✅       | Get messages (with pagination)             |
| POST   | `/api/chat/messages`                            | ✅       | Send text message                          |
| POST   | `/api/chat/upload`                              | ✅       | Upload file/image                          |
| PUT    | `/api/chat/messages/:conversationId/read`       | ✅       | Mark messages as read                      |
| PUT    | `/api/chat/conversations/:conversationId/close` | ✅ Admin | Close conversation                         |

---

## 🚀 Next Steps (Optional)

### Recommended Future Improvements:

1. **Winston Logger** - Replace console.log with structured logging
2. **Sentry Integration** - Error tracking and monitoring
3. **Unit Tests** - Jest tests for controllers
4. **E2E Tests** - Cypress/Playwright for chat flows
5. **Redis Adapter** - Scale Socket.IO across multiple servers
6. **Canned Responses** - Quick replies for admin
7. **Push Notifications** - Notify users when offline
8. **Message Reactions** - Emoji reactions
9. **Voice Messages** - Audio file support
10. **Chat Analytics** - Response time, volume metrics

---

## 👨‍💻 Code Quality Improvements

### Security Enhancements:

- ✅ XSS protection with input sanitization
- ✅ Rate limiting to prevent spam
- ✅ File type validation
- ✅ JWT authentication enforced
- ✅ File size limits

### Performance Optimizations:

- ✅ Cursor-based pagination (avoid skip/limit on large datasets)
- ✅ Indexed database queries
- ✅ Socket rooms for targeted broadcasting
- ✅ Rate limiting reduces server load

### User Experience:

- ✅ Typing indicators for real-time feedback
- ✅ Read receipts for message status
- ✅ File/image sharing in chat
- ✅ Search and filter for admin
- ✅ Pagination for smooth scrolling

---

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. **Server logs** - Xem console.log outputs
2. **Network tab** - Kiểm tra request/response
3. **Socket.IO events** - Verify events are emitted/received
4. **File permissions** - uploads/chat directory must be writable
5. **Rate limit headers** - Check RateLimit-\* headers in response

---

**Ngày cập nhật:** 28/10/2025  
**Phiên bản:** 1.0.0  
**Tác giả:** Paradise Perfume Team
