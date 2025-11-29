# HƯỚNG DẪN CÀI ĐẶT GOOGLE OAUTH

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật Google+ API trong API Library

## Bước 2: Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Web application**
4. Cấu hình:
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/google/callback`
5. Lưu **Client ID**

## Bước 3: Cập nhật Environment Variables

### Client (.env trong thư mục client)

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Server (.env trong thư mục server)

```env
CLIENT_URL=http://localhost:3000
```

## Bước 4: Test Google Login

1. Khởi động server: `cd server && npm run dev`
2. Khởi động client: `cd client && npm start`
3. Vào trang đăng nhập: `http://localhost:3000/auth`
4. Click nút "Đăng nhập bằng Google"
5. Chọn tài khoản Google

## Lưu ý

- Đảm bảo Google Client ID được cấu hình đúng
- Kiểm tra redirect URI khớp với Google Console
- Email đã được xác thực trong Google

## Troubleshooting

### Lỗi "redirect_uri_mismatch"

- Kiểm tra lại redirect URI trong Google Console
- Đảm bảo URL khớp chính xác (http vs https, trailing slash)

### Lỗi "access_denied"

- Người dùng đã từ chối quyền truy cập
- Kiểm tra scope yêu cầu

### Popup bị chặn

- Cho phép popup trong trình duyệt
- Hoặc thử đăng nhập trong tab mới thay vì popup
