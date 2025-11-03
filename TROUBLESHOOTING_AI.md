# 🚀 QUICK START GUIDE - AI RECOMMENDATION

## ⚠️ LỖI: "Đang tải câu hỏi..." không biến mất?

### NGUYÊN NHÂN:

Server chưa chạy hoặc chưa kết nối được đến port 5000

---

## ✅ GIẢI PHÁP NHANH

### Bước 1: Mở Terminal mới

```bash
# Windows PowerShell
cd D:\Khoaluan\DACN_2200006857_LeThaiQuocDuy\perfume\server
```

### Bước 2: Khởi động server

```bash
npm start
```

### Bước 3: Chờ thông báo

```
✅ Server running on port 5000
✅ MongoDB Connected: cluster0.xijff.mongodb.net
```

### Bước 4: Reload trang

- Ấn F5 hoặc Ctrl+R
- Hoặc click nút "🔄 Thử Lại"

---

## 🔍 KIỂM TRA SERVER

### Cách 1: Kiểm tra port 5000

```bash
# Windows
netstat -ano | findstr :5000
```

Nếu có output → Server đang chạy ✅
Nếu không có output → Server chưa chạy ❌

### Cách 2: Test API trực tiếp

Mở browser: http://localhost:5000/api/ai/quiz

**Kết quả mong đợi**:

```json
{
  "success": true,
  "data": {
    "questions": [...],
    "totalQuestions": 7
  }
}
```

**Nếu lỗi**:

- "Cannot GET /api/ai/quiz" → Routes chưa mount
- "ERR_CONNECTION_REFUSED" → Server chưa chạy
- Timeout → Server bị crash

---

## 🛠️ TROUBLESHOOTING

### Lỗi 1: "EADDRINUSE: port 5000 already in use"

```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số ở cột cuối)
taskkill /F /PID <PID>

# Hoặc đổi port trong server/.env
PORT=5001
```

### Lỗi 2: "Cannot find module 'openai'"

```bash
cd server
npm install openai
npm start
```

### Lỗi 3: MongoDB connection failed

```bash
# Kiểm tra .env có MONGO_URI đúng không
# File: server/.env
MONGO_URI=mongodb+srv://perfumeparadise:...
```

### Lỗi 4: CORS error

```bash
# Kiểm tra server.js có cấu hình CORS chưa
app.use(cors());
```

---

## 📝 CHECKLIST

- [ ] Server đang chạy (port 5000)
- [ ] MongoDB connected
- [ ] AI routes đã mount (`/api/ai/*`)
- [ ] OpenAI package đã install
- [ ] Client đang chạy (port 3000 hoặc 5173)
- [ ] Không có CORS error

---

## 🎯 TEST NHANH

### Terminal 1: Server

```bash
cd server
npm start

# Chờ thông báo:
# ✅ Server running on port 5000
# ✅ MongoDB Connected
```

### Terminal 2: Client

```bash
cd client
npm run dev

# Chờ thông báo:
# ➜ Local: http://localhost:5173/
```

### Browser:

1. Mở: http://localhost:5173
2. Click button "🤖 AI" ở header
3. Hoặc: http://localhost:5173/ai-recommend
4. Xem có hiện quiz không

---

## 💡 FALLBACK MODE

Nếu server không chạy được, component sẽ tự động dùng **3 câu hỏi mẫu**:

1. Giới tính
2. Độ tuổi
3. Dịp sử dụng

→ Vẫn có thể test UI, nhưng không có AI recommendation thật

---

## 🔥 COMMON ISSUES

### Issue: "Đang tải câu hỏi..." mãi không biến mất

✅ Fix: Khởi động server (`npm start` trong folder server)

### Issue: Nhấn "Nhận Gợi Ý AI" không có kết quả

✅ Fix:

1. Check console (F12) xem có lỗi gì
2. Đảm bảo có products trong database (`npm run seed`)
3. Check OPENAI_API_KEY nếu muốn dùng AI thật

### Issue: Error 404 /api/ai/quiz

✅ Fix: Kiểm tra `server/server.js` đã có:

```javascript
import aiRoutes from "./routes/aiRoutes.js";
app.use("/api/ai", aiRoutes);
```

---

## 🚀 PRODUCTION CHECKLIST

Trước khi deploy:

- [ ] Update API URL từ localhost sang production
- [ ] Add OPENAI_API_KEY vào .env production
- [ ] Test tất cả 7 câu hỏi
- [ ] Test AI recommendations
- [ ] Test fallback mode
- [ ] Test mobile responsive

---

## 📞 STILL NOT WORKING?

1. **Check Browser Console** (F12 → Console tab)

   - Xem error message
   - Copy error và search Google

2. **Check Server Logs** (Terminal chạy `npm start`)

   - Xem có error gì không
   - Check MongoDB connection

3. **Restart Everything**

   ```bash
   # Stop server (Ctrl+C)
   # Stop client (Ctrl+C)

   # Start lại
   cd server && npm start
   cd client && npm run dev
   ```

4. **Clear Cache**
   - Ctrl+Shift+Delete → Clear cache
   - Hard reload (Ctrl+Shift+R)

---

## ✅ SUCCESS SIGNS

Khi mọi thứ hoạt động:

- ✅ Server log: "Server running on port 5000"
- ✅ Browser: Hiện quiz với 7 câu hỏi
- ✅ Console: Không có error màu đỏ
- ✅ Có thể trả lời câu hỏi
- ✅ Nhận được recommendations

🎉 **DONE! Enjoy AI Recommendation!**
