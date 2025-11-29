# 🔐 TÍNH NĂNG XÁC THỰC MỚI

## 📋 Tổng Quan

Hệ thống đã được bổ sung 2 tính năng xác thực quan trọng:

### 1. ✅ QUÊN MẬT KHẨU (Forgot Password)

- Gửi mã xác thực 6 số qua email
- Mã có hiệu lực 15 phút
- Reset mật khẩu an toàn với token hashing

### 2. 🔵 ĐĂNG NHẬP GOOGLE (Google OAuth)

- Đăng nhập nhanh bằng tài khoản Google
- Tự động tạo tài khoản mới nếu chưa tồn tại
- Liên kết tài khoản Google với tài khoản hiện có

---

## 🗂️ Cấu Trúc File Mới

```
📦 perfume/
├── 📁 server/
│   ├── 📁 models/
│   │   └── User.js                    ✨ Updated (Google fields, reset token)
│   ├── 📁 controllers/
│   │   └── authController.js          ✨ Updated (3 functions mới)
│   ├── 📁 routes/
│   │   └── authRoutes.js              ✨ Updated (3 routes mới)
│   └── 📁 utils/
│       └── sendMail.js                ✨ Updated (email template)
│
├── 📁 client/src/features/auth/
│   ├── AuthPage.jsx                   ✨ Updated (Google button, forgot link)
│   ├── ForgotPasswordPage.jsx         🆕 NEW
│   ├── ResetPasswordPage.jsx          🆕 NEW
│   └── GoogleCallbackPage.jsx         🆕 NEW
│
└── 📁 docs/
    └── GOOGLE_OAUTH_SETUP.md          🆕 NEW
```

---

## 🔧 API ENDPOINTS MỚI

### 1. POST `/api/users/forgot-password`

**Gửi mã reset mật khẩu qua email**

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "Email khôi phục mật khẩu đã được gửi!",
  "email": "user@example.com"
}
```

---

### 2. POST `/api/users/reset-password`

**Đặt lại mật khẩu với token**

**Request:**

```json
{
  "email": "user@example.com",
  "token": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response:**

```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

---

### 3. POST `/api/users/google`

**Đăng nhập/Đăng ký bằng Google**

**Request:**

```json
{
  "googleId": "1234567890",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": "https://..."
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://...",
    "authProvider": "google",
    "isAdmin": false
  }
}
```

---

## 📊 DATABASE SCHEMA UPDATES

### User Model - Các Field Mới

```javascript
{
  // Google OAuth
  googleId: { type: String, sparse: true, unique: true },
  profilePicture: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },

  // Password Reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // Password không còn bắt buộc nếu đăng nhập Google
  password: { type: String, required: function() { return !this.googleId; } }
}
```

---

## 🎨 UI/UX FLOW

### Luồng Quên Mật Khẩu

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  AuthPage   │         │   Forgot     │         │   Reset     │
│             │         │   Password   │         │   Password  │
└─────┬───────┘         └──────┬───────┘         └──────┬──────┘
      │                        │                        │
      │ Click "Quên mật khẩu?" │                        │
      ├───────────────────────>│                        │
      │                        │                        │
      │                        │ Nhập email             │
      │                        │ ↓                      │
      │                        │ Server gửi mã 6 số    │
      │                        │ ↓                      │
      │                        │ Redirect               │
      │                        ├───────────────────────>│
      │                        │                        │
      │                        │                        │ Nhập mã + pass mới
      │                        │                        │ ↓
      │                        │                        │ Đổi mật khẩu
      │<───────────────────────────────────────────────┤
      │ Redirect về login                              │
```

### Luồng Google OAuth

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  AuthPage   │         │   Google     │         │  Callback   │
│             │         │   Popup      │         │   Handler   │
└─────┬───────┘         └──────┬───────┘         └──────┬──────┘
      │                        │                        │
      │ Click Google button    │                        │
      ├───────────────────────>│                        │
      │                        │ User login Google      │
      │                        │ ↓                      │
      │                        │ Redirect với token     │
      │                        ├───────────────────────>│
      │                        │                        │
      │                        │                        │ Fetch user info
      │                        │                        │ ↓
      │<───────────────────────────────────────────────┤ Post message
      │ Receive user data                              │
      │ ↓                                               │
      │ Call /api/users/google                         │
      │ ↓                                               │
      │ Login success                                   │
```

---

## 📧 EMAIL TEMPLATES

### Password Reset Email

Email gửi đi sẽ có:

- ✉️ **Subject**: "🔐 Đặt lại mật khẩu - Paradise Perfume"
- 🎨 **Design**: Chanel-style black & white
- 🔢 **Mã 6 số**: Font lớn, dễ đọc
- 🔗 **Link reset**: Button CTA đen
- ⏰ **Thời hạn**: Hiển thị rõ 15 phút

---

## 🔒 SECURITY FEATURES

### ✅ Password Reset

- Token được hash bằng SHA-256 trước khi lưu DB
- Token hết hạn sau 15 phút
- Chỉ gửi 1 lần, token cũ sẽ bị ghi đè
- Validate email tồn tại trước khi gửi

### ✅ Google OAuth

- Không lưu password cho user Google
- `authProvider` field để phân biệt loại đăng nhập
- Tự động liên kết nếu email đã tồn tại
- Profile picture được sync từ Google

---

## 🧪 TESTING

### Test Forgot Password

```bash
# 1. Request reset token
curl -X POST http://localhost:5000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check email for 6-digit code

# 3. Reset password
curl -X POST http://localhost:5000/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "token":"123456",
    "newPassword":"newPass123"
  }'
```

### Test Google Login

1. Cấu hình `REACT_APP_GOOGLE_CLIENT_ID` trong `.env`
2. Vào `http://localhost:3000/auth`
3. Click "Đăng nhập bằng Google"
4. Chọn tài khoản Google
5. Kiểm tra redirect và token

---

## 📝 ENVIRONMENT VARIABLES

### Client `.env`

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Server `.env`

```env
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Cập nhật Google OAuth redirect URIs cho production
- [ ] Thêm production domain vào `CLIENT_URL`
- [ ] Cấu hình SMTP cho email production
- [ ] Test forgot password flow hoàn chỉnh
- [ ] Test Google login flow hoàn chỉnh
- [ ] Kiểm tra email deliverability
- [ ] Verify token expiration hoạt động đúng

---

## 🆘 TROUBLESHOOTING

### Email không được gửi

- Kiểm tra `EMAIL_USER` và `EMAIL_PASS` trong `.env`
- Bật "Less secure app access" hoặc dùng App Password
- Kiểm tra console log server để xem lỗi SMTP

### Google login không hoạt động

- Xem file `GOOGLE_OAUTH_SETUP.md` để cấu hình
- Kiểm tra Client ID trong `.env`
- Verify redirect URI trong Google Console
- Allow popup trong browser

### Token hết hạn

- Token reset password có hiệu lực 15 phút
- Request token mới nếu hết hạn
- Kiểm tra timezone server/client

---

## 📚 TÀI LIỆU THAM KHẢO

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Nodemailer Documentation](https://nodemailer.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Ngày cập nhật**: 30/11/2025  
**Version**: 2.0  
**Tác giả**: Paradise Perfume Development Team
