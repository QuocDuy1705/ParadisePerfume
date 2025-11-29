# 🚀 HƯỚNG DẪN SỬ DỤNG NHANH

## ✨ Tính Năng Mới Đã Thêm

### 1. 🔑 QUÊN MẬT KHẨU

- Người dùng click "Quên mật khẩu?" ở trang đăng nhập
- Nhập email → Nhận mã 6 số qua email
- Nhập mã + mật khẩu mới → Hoàn tất

### 2. 🔵 ĐĂNG NHẬP GOOGLE

- Click nút "Đăng nhập bằng Google"
- Chọn tài khoản Google
- Tự động đăng nhập/tạo tài khoản

---

## 📋 CÀI ĐẶT NHANH

### Bước 1: Cấu hình Server

```bash
cd server
```

Tạo/Cập nhật file `.env`:

```env
# Existing
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri

# Email (for Password Reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth
CLIENT_URL=http://localhost:3000
```

### Bước 2: Cấu hình Client

```bash
cd client
```

Tạo/Cập nhật file `.env`:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Bước 3: Khởi động

**Terminal 1 - Server:**

```bash
cd server
npm run dev
```

**Terminal 2 - Client:**

```bash
cd client
npm start
```

---

## 🧪 TEST CHỨC NĂNG

### Test 1: Quên Mật Khẩu

1. Vào `http://localhost:3000/auth`
2. Click "Quên mật khẩu?"
3. Nhập email đã đăng ký
4. Click "GỬI MÃ XÁC THỰC"
5. Kiểm tra email → Lấy mã 6 số
6. Nhập mã + mật khẩu mới
7. Click "ĐẶT LẠI MẬT KHẨU"
8. Đăng nhập lại với mật khẩu mới

### Test 2: Google Login

**⚠️ Cần setup Google OAuth trước** (xem `GOOGLE_OAUTH_SETUP.md`)

1. Vào `http://localhost:3000/auth`
2. Click "Đăng nhập bằng Google"
3. Popup Google xuất hiện
4. Chọn tài khoản Google
5. Tự động đăng nhập vào hệ thống

---

## 📁 FILE MỚI ĐÃ TẠO

### Backend (Server)

- ✅ `models/User.js` - Updated với Google & Reset fields
- ✅ `controllers/authController.js` - Added 3 functions
- ✅ `routes/authRoutes.js` - Added 3 routes
- ✅ `utils/sendMail.js` - Updated password reset email

### Frontend (Client)

- ✅ `features/auth/ForgotPasswordPage.jsx` - NEW
- ✅ `features/auth/ResetPasswordPage.jsx` - NEW
- ✅ `features/auth/GoogleCallbackPage.jsx` - NEW
- ✅ `features/auth/AuthPage.jsx` - Updated with Google button
- ✅ `App.jsx` - Added 3 new routes

### Documentation

- ✅ `AUTHENTICATION_FEATURES.md` - Chi tiết đầy đủ
- ✅ `GOOGLE_OAUTH_SETUP.md` - Hướng dẫn setup Google
- ✅ `QUICKSTART.md` - File này

---

## 🔗 ROUTES MỚI

| Route                   | Component          | Mô tả                 |
| ----------------------- | ------------------ | --------------------- |
| `/forgot-password`      | ForgotPasswordPage | Nhập email để reset   |
| `/reset-password`       | ResetPasswordPage  | Nhập mã + pass mới    |
| `/auth/google/callback` | GoogleCallbackPage | Xử lý callback Google |

---

## 🎯 API ENDPOINTS MỚI

| Method | Endpoint                     | Body                                       | Response          |
| ------ | ---------------------------- | ------------------------------------------ | ----------------- |
| POST   | `/api/users/forgot-password` | `{ email }`                                | Success message   |
| POST   | `/api/users/reset-password`  | `{ email, token, newPassword }`            | Success message   |
| POST   | `/api/users/google`          | `{ googleId, email, firstName, lastName }` | `{ token, user }` |

---

## ⚙️ GMAIL APP PASSWORD

**Để gửi email reset password:**

1. Vào [Google Account Security](https://myaccount.google.com/security)
2. Bật **2-Step Verification**
3. Vào **App passwords**
4. Chọn "Mail" và "Other (Custom name)"
5. Generate password
6. Copy password vào `EMAIL_PASS` trong `.env`

---

## 🔐 GOOGLE OAUTH CLIENT ID

**Để đăng nhập Google:**

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Bật Google+ API
4. Tạo OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID vào `REACT_APP_GOOGLE_CLIENT_ID`

**Chi tiết**: Xem file `GOOGLE_OAUTH_SETUP.md`

---

## 🐛 COMMON ISSUES

### ❌ Email không gửi được

```
Solution: Kiểm tra EMAIL_USER và EMAIL_PASS trong .env
          Dùng App Password, không phải password thường
```

### ❌ Google login lỗi "redirect_uri_mismatch"

```
Solution: Kiểm tra redirect URI trong Google Console
          Phải khớp chính xác: http://localhost:3000/auth/google/callback
```

### ❌ Token hết hạn

```
Solution: Request mã reset mới (token có hiệu lực 15 phút)
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:

1. Kiểm tra console log (browser & server)
2. Xem file `AUTHENTICATION_FEATURES.md` để biết chi tiết
3. Đọc phần Troubleshooting trong docs

---

## ✅ CHECKLIST

- [ ] Đã cấu hình `.env` cho server
- [ ] Đã cấu hình `.env` cho client
- [ ] Đã setup Google OAuth (nếu dùng Google login)
- [ ] Đã setup Gmail App Password (nếu dùng forgot password)
- [ ] Server đang chạy trên port 5000
- [ ] Client đang chạy trên port 3000
- [ ] Đã test forgot password flow
- [ ] Đã test Google login flow

---

**Happy Coding! 🎉**
