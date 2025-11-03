# 🧪 Chat System Testing Checklist

## 📋 Pre-Test Setup

- [ ] Server đang chạy: `cd server && npm run dev`
- [ ] Đã login để có JWT token
- [ ] Có ít nhất 1 user account và 1 admin account
- [ ] Postman hoặc similar tool sẵn sàng

---

## 1. ✅ Basic Chat Flow

### User Side:

- [ ] User có thể tạo conversation
- [ ] User có thể gửi message
- [ ] Message hiển thị trong chat
- [ ] Timestamp hiển thị đúng

### Admin Side:

- [ ] Admin thấy conversation mới trong dashboard
- [ ] Admin thấy unread count tăng
- [ ] Admin có thể reply
- [ ] User nhận được admin reply realtime

**Expected:** ✅ Messages flow both ways, realtime updates

---

## 2. 🛡️ Rate Limiting Test

### Steps:

1. Viết script gửi 101 messages liên tục
2. Hoặc dùng Postman Collection Runner

```javascript
for (let i = 0; i < 101; i++) {
  await fetch("/api/chat/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId: "your-conv-id",
      message: `Test message ${i}`,
    }),
  });
}
```

### Checklist:

- [ ] First 100 messages: Status 201 ✅
- [ ] 101st message: Status 429 ❌ "Too many messages"
- [ ] Response headers có `RateLimit-Remaining`
- [ ] Sau 1 giờ: Rate limit reset

**Expected:** Request #101 gets blocked with 429 error

---

## 3. 🧹 XSS Protection Test

### Test Cases:

#### Test 1: Script Tag

```json
POST /api/chat/messages
{
  "conversationId": "123",
  "message": "<script>alert('xss')</script>Hello"
}
```

- [ ] Message saved as escaped HTML
- [ ] Display shows: `&lt;script&gt;...`
- [ ] No alert() executes

#### Test 2: Event Handlers

```json
{
  "message": "<img src=x onerror=alert('xss')>"
}
```

- [ ] HTML tags removed/escaped
- [ ] No JavaScript executes

#### Test 3: Long Message

```json
{
  "message": "A".repeat(3000)
}
```

- [ ] Status 400: "Message too long (max 2000 characters)"

**Expected:** All malicious code escaped/removed, no XSS possible

---

## 4. 📄 Pagination Test

### Setup:

- Cần >50 messages trong conversation

### Test Sequence:

#### Initial Load

```
GET /api/chat/messages/123?limit=50
```

- [ ] Returns 50 messages
- [ ] `hasMore: true`
- [ ] `oldest` and `newest` timestamps present

#### Load Older Messages

```
GET /api/chat/messages/123?limit=50&before=<oldest_timestamp>
```

- [ ] Returns previous 50 messages
- [ ] Messages are older than initial batch
- [ ] No duplicates

#### Load Newer Messages

```
GET /api/chat/messages/123?after=<newest_timestamp>
```

- [ ] Returns newer messages only
- [ ] Useful for realtime updates

**Expected:** Smooth infinite scroll, no missing messages

---

## 5. ⌨️ Typing Indicator Test

### User Types:

```javascript
socket.emit("typing", {
  conversationId: "123",
});

// Wait 3 seconds

socket.emit("stop_typing", {
  conversationId: "123",
});
```

### Admin Receives:

```javascript
socket.on("user_typing", (data) => {
  console.log("User is typing:", data);
  // data: { userId, conversationId, isTyping: true, timestamp }
});
```

### Checklist:

- [ ] Admin sees "User is typing..." indicator
- [ ] Indicator appears within 100ms
- [ ] Indicator disappears after stop_typing
- [ ] Auto-hide after 3s if no stop_typing sent
- [ ] Works both directions (user ↔ admin)

**Expected:** Realtime typing indicators with < 100ms latency

---

## 6. ✅ Read Receipts Test

### User Sends Message:

```javascript
POST /api/chat/messages
{ conversationId, message: "Hello" }
```

- [ ] Message has `isRead: false`
- [ ] Single checkmark (✓) in UI

### Admin Marks as Read:

```javascript
PUT / api / chat / messages / 123 / read;
```

- [ ] Message `isRead: true`
- [ ] `readAt` timestamp set
- [ ] Socket event emitted

### User Receives Update:

```javascript
socket.on("messages_read", (data) => {
  // data: { conversationId, readBy: 'admin', readAt }
});
```

- [ ] Double checkmark (✓✓) appears
- [ ] Checkmarks turn blue
- [ ] Shows read timestamp on hover

**Expected:** Clear visual feedback for message read status

---

## 7. 🔍 Search & Filter Test (Admin Only)

### Search by Name:

```
GET /api/chat/conversations?search=alex
```

- [ ] Returns conversations with "alex" in userName or userEmail
- [ ] Case-insensitive search

### Filter by Status:

```
GET /api/chat/conversations?status=active
```

- [ ] Returns only active conversations

### Sort by Unread Count:

```
GET /api/chat/conversations?sortBy=unreadCount&order=desc
```

- [ ] Conversations sorted by unread count (high to low)

### Pagination:

```
GET /api/chat/conversations?limit=20&skip=20
```

- [ ] Returns 20 conversations, skip first 20
- [ ] `total` count correct
- [ ] `hasMore` boolean accurate

**Expected:** Flexible filtering and sorting for admin

---

## 8. 📎 File Upload Test

### Test 1: Valid Image

```bash
curl -X POST http://localhost:5000/api/chat/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@photo.jpg" \
  -F "conversationId=123"
```

- [ ] Status 201
- [ ] Message created with `fileUrl`, `fileType: "image"`
- [ ] File saved to `/uploads/chat/`
- [ ] Image accessible at fileUrl
- [ ] Socket event emitted to other party

### Test 2: Valid PDF

```bash
-F "file=@document.pdf"
```

- [ ] Status 201
- [ ] `fileType: "file"`

### Test 3: Invalid File Type

```bash
-F "file=@virus.exe"
```

- [ ] Status 400: "Invalid file type"

### Test 4: File Too Large (>5MB)

```bash
-F "file=@large-video.mp4"
```

- [ ] Status 400: "File too large. Maximum size is 5MB"

### Test 5: No File

```bash
curl -X POST http://localhost:5000/api/chat/upload \
  -H "Authorization: Bearer <token>" \
  -F "conversationId=123"
```

- [ ] Status 400: "No file uploaded"

**Expected:** Only images/PDFs under 5MB accepted

---

## 9. 🔄 Socket.IO Connection Test

### Connection:

```javascript
const socket = io("http://localhost:5000", {
  auth: { token: "your-jwt-token" },
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Error:", err.message);
});
```

### Checklist:

- [ ] Valid token → Connected
- [ ] Invalid token → `connect_error: "Authentication error"`
- [ ] No token → Connection rejected
- [ ] User joins `user_<userId>` room
- [ ] Admin joins `admin_room`

**Expected:** Secure socket connections, auth enforced

---

## 10. 🌐 CORS & Security Test

### CORS:

```javascript
fetch("http://localhost:5000/api/chat/messages", {
  method: "GET",
  headers: { Authorization: "Bearer token" },
});
```

- [ ] Request from allowed origin: Success
- [ ] Request from unknown origin: CORS error

### Auth:

```javascript
// No token
fetch("/api/chat/messages");
```

- [ ] Status 401: "Unauthorized"

### Rate Limit Headers:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1698500000
```

- [ ] Headers present in response

**Expected:** Proper CORS, auth, and rate limit headers

---

## ✅ Final Checklist

- [ ] All 10 tests passed
- [ ] No console errors
- [ ] No memory leaks (check with long sessions)
- [ ] Messages persist after server restart
- [ ] Files accessible after upload
- [ ] Socket reconnects after disconnect
- [ ] Mobile responsive (test on phone)

---

## 🐛 Troubleshooting

### Issue: Messages not realtime

- Check socket connection status
- Verify rooms: `user_${userId}` or `admin_room`
- Check browser console for socket events

### Issue: Rate limit not working

- Check if user is admin (admin bypasses rate limit)
- Verify `req.user.id` is set correctly
- Check rate limit window (1 hour)

### Issue: File upload fails

- Check `uploads/chat` directory exists and writable
- Verify file type and size
- Check multer middleware order in routes

### Issue: XSS not blocked

- Verify sanitizeMessage is called
- Check validator and xss packages installed
- Look for sanitized string in database

---

## 📊 Success Criteria

| Feature           | Status |
| ----------------- | ------ |
| Basic messaging   | ✅     |
| Rate limiting     | ✅     |
| XSS protection    | ✅     |
| Pagination        | ✅     |
| Typing indicators | ✅     |
| Read receipts     | ✅     |
| Search/filter     | ✅     |
| File upload       | ✅     |
| Socket auth       | ✅     |
| CORS/security     | ✅     |

**All green? 🎉 Production ready!**

---

## 📝 Notes

- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Test with slow network (throttle in DevTools)
- Test concurrent users (open multiple tabs)
- Monitor server logs for errors

**Good luck! 🚀**
