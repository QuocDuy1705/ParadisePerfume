# Hướng dẫn đăng ký và cấu hình VNPay Sandbox

## 🔐 Đăng ký tài khoản VNPay Sandbox

### Bước 1: Truy cập VNPay Sandbox

1. Mở trình duyệt và truy cập: **https://sandbox.vnpayment.vn/**
2. Click vào **"Đăng ký"** hoặc **"Register"**

### Bước 2: Đăng ký tài khoản Merchant

1. Điền thông tin:

   - **Email**: Email của bạn
   - **Tên doanh nghiệp**: Tên shop của bạn (ví dụ: "Perfume Paradise")
   - **Số điện thoại**: Số điện thoại liên hệ
   - **Mật khẩu**: Tạo mật khẩu mạnh

2. Xác nhận email

3. Đăng nhập vào tài khoản

### Bước 3: Lấy thông tin cấu hình

Sau khi đăng nhập, bạn sẽ thấy:

- **TMN Code**: Mã định danh merchant (ví dụ: DEMOV210)
- **Hash Secret**: Key bảo mật (ví dụ: RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ)

### Bước 4: Cấu hình vào project

Mở file `server/.env` và cập nhật:

```env
# VNPay Configuration
VNPAY_TMN_CODE=<YOUR_TMN_CODE_HERE>
VNPAY_HASH_SECRET=<YOUR_HASH_SECRET_HERE>
VNPAY_HOST=https://sandbox.vnpayment.vn
```

**Lưu ý**:

- KHÔNG commit file `.env` lên Git
- Giữ bí mật Hash Secret

## 💳 Test thanh toán

### Thông tin thẻ test VNPay cung cấp:

**Thẻ ATM nội địa:**

- Ngân hàng: NCB
- Số thẻ: `9704198526191432198`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- Mật khẩu OTP: `123456`

**Thẻ quốc tế:**

- Số thẻ: `4111111111111111`
- CVV: `123`
- Ngày hết hạn: `12/25`

### Luồng test:

1. Truy cập trang checkout: `http://localhost:3000/checkout`
2. Chọn phương thức thanh toán **"VNPay"**
3. Điền thông tin giao hàng
4. Click **"HOÀN TẤT ĐẶT HÀNG"**
5. Bạn sẽ được chuyển đến trang VNPay
6. Chọn ngân hàng **NCB** (hoặc ngân hàng khác trong danh sách test)
7. Nhập thông tin thẻ test
8. Nhập mã OTP: `123456`
9. Thanh toán thành công → Redirect về trang success

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Invalid data format"

**Nguyên nhân:**

- Thiếu hoặc sai TMN Code / Hash Secret
- Các tham số gửi lên VNPay không đúng định dạng
- IP address không hợp lệ

**Giải pháp:**

1. Kiểm tra lại TMN Code và Hash Secret trong `.env`
2. Restart server sau khi cập nhật `.env`
3. Kiểm tra log trong terminal server

### Lỗi: "Invalid signature"

**Nguyên nhân:**

- Hash Secret không đúng
- Thuật toán tạo signature sai

**Giải pháp:**

1. Copy lại Hash Secret từ VNPay dashboard
2. Đảm bảo không có space hoặc ký tự thừa

### Lỗi: "Amount invalid"

**Nguyên nhân:**

- Số tiền phải là số nguyên và > 0
- VNPay yêu cầu số tiền tính bằng VND (nhân 100)

**Giải pháp:**

- Code đã tự động nhân 100 và làm tròn

## 📝 Production Deployment

Khi deploy lên production:

1. Đăng ký tài khoản VNPay **thật** (không phải sandbox)
2. Hoàn tất thủ tục ký hợp đồng với VNPay
3. Lấy TMN Code và Hash Secret production
4. Cập nhật `.env`:
   ```env
   VNPAY_TMN_CODE=<PRODUCTION_TMN_CODE>
   VNPAY_HASH_SECRET=<PRODUCTION_HASH_SECRET>
   VNPAY_HOST=https://vnpayment.vn
   ```

## 🔗 Tài liệu tham khảo

- VNPay Sandbox: https://sandbox.vnpayment.vn/
- Tài liệu API: https://sandbox.vnpayment.vn/apis/docs/
- Hỗ trợ: hotrovnpay@vnpay.vn

---

**Lưu ý**: Đây là môi trường test, không thu tiền thật. Để sử dụng production, cần ký hợp đồng với VNPay.
