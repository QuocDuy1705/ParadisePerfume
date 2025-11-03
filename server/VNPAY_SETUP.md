# Hướng dẫn cấu hình VNPay Sandbox

## ✅ Thông tin đã cấu hình (SANDBOX)

**⚠️ LƯU Ý:** Đây là môi trường Sandbox để test, **KHÔNG dùng cho khách hàng thanh toán thật**.

```
Terminal ID / Mã Website: 5XSNTFQU
Secret Key / Chuỗi bí mật: AJ57CUKLGZBXAYN8RUSM3FXRIWY00VAI
```

### Cấu hình trong file `.env`:

```properties
VNPAY_TMN_CODE=5XSNTFQU
VNPAY_HASH_SECRET=AJ57CUKLGZBXAYN8RUSM3FXRIWY00VAI
VNPAY_HOST=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

## 📋 IPN URL (Server to Server)

VNPay yêu cầu URL này để cập nhật trạng thái thanh toán.

**Development:**

```
http://localhost:5000/api/payment/vnpay-return
```

**Production (cần cập nhật khi deploy):**

```
https://yourdomain.com/api/payment/vnpay-return
```

---

## 🔑 Hướng dẫn lấy Credentials (nếu cần)

### Bước 1: Đăng ký tài khoản Sandbox

1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản merchant (miễn phí)
3. Đăng nhập vào dashboard

### Bước 2: Lấy TMN Code và Hash Secret

1. Vào **Cấu hình** → **Thông tin tài khoản**
2. Copy **TMN Code** (Website Code)
3. Copy **Hash Secret** (Secret Key)

### Bước 3: Cập nhật file `.env`

```properties
# VNPay Configuration
VNPAY_TMN_CODE=YOUR_TMN_CODE_HERE          # Ví dụ: 5XSNTFQU
VNPAY_HASH_SECRET=YOUR_HASH_SECRET_HERE    # Ví dụ: AJ57CUKLGZBXAYN8RUSM3FXRIWY00VAI
VNPAY_HOST=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

---

## ⚠️ Lỗi thường gặp

### 1. "Dữ liệu gửi sang không đúng định dạng"

**Nguyên nhân:**

- TMN_CODE hoặc HASH_SECRET sai
- Chưa đăng ký tài khoản Sandbox
- Params thiếu hoặc sai format

**Giải pháp:**

- Kiểm tra lại credentials trong `.env`
- Đảm bảo đã đăng ký tài khoản tại sandbox.vnpayment.vn
- Xem logs server để kiểm tra params

### 2. "Invalid signature"

**Nguyên nhân:**

- HASH_SECRET không khớp
- Cách tạo signature sai

**Giải pháp:**

- Copy lại HASH_SECRET từ dashboard VNPay
- Đảm bảo không có khoảng trắng thừa trong `.env`

---

## 🧪 Test thanh toán

### Thông tin test card (VNPay Sandbox)

**Ngân hàng NCB:**

- Số thẻ: `9704198526191432198`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- OTP: `123456`

**Hoặc dùng QR Code:**

- Mở app ngân hàng test
- Quét mã QR từ VNPay
- Nhập mật khẩu: `123456`

---

## 📝 Checklist trước khi test

- [ ] Đã đăng ký tài khoản tại https://sandbox.vnpayment.vn/
- [ ] Đã copy đúng TMN_CODE và HASH_SECRET
- [ ] File `.env` không có khoảng trắng thừa
- [ ] Server đã restart sau khi sửa `.env`
- [ ] Kiểm tra logs server khi test:
  ```bash
  cd server
  npm run dev
  ```
- [ ] Xem console browser network tab khi redirect VNPay

---

## 🔗 Tài liệu tham khảo

- VNPay Sandbox: https://sandbox.vnpayment.vn/
- Tài liệu API: https://sandbox.vnpayment.vn/apis/docs/
- Hỗ trợ: support@vnpay.vn

---

## ⚡ Quick Fix

Nếu bạn không muốn dùng VNPay ngay, có thể test với **COD (Cash on Delivery)** trước:

1. Chọn "Thanh toán khi nhận hàng" trong checkout
2. Đơn hàng sẽ được tạo ngay lập tức
3. Không cần cấu hình gì thêm

Sau khi có credentials VNPay đúng, quay lại test VNPay payment!
