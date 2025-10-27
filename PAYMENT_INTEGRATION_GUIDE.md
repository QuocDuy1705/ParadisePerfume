# HƯỚNG DẪN TÍCH HỢP THANH TOÁN MOMO VÀ VNPAY

## 📋 Tổng quan

Dự án đã tích hợp 3 phương thức thanh toán:

1. **COD (Cash on Delivery)** - Thanh toán khi nhận hàng
2. **VNPay** - Cổng thanh toán trực tuyến VNPay
3. **MoMo** - Ví điện tử MoMo

## 🔧 Cấu hình VNPay

### Bước 1: Đăng ký tài khoản VNPay Sandbox

1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản doanh nghiệp test
3. Lấy thông tin:
   - **TMN Code**: Mã định danh merchant
   - **Hash Secret**: Secret key để mã hóa

### Bước 2: Cấu hình Server (.env)

```env
VNPAY_TMN_CODE=YOUR_TMN_CODE_HERE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET_HERE
VNPAY_HOST=https://sandbox.vnpayment.vn
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### Bước 3: Cài đặt package

```bash
cd server
npm install vnpay
```

### Bước 4: Test thanh toán

- Sử dụng thẻ test của VNPay:
  - **Số thẻ**: 9704198526191432198
  - **Tên chủ thẻ**: NGUYEN VAN A
  - **Ngày phát hành**: 07/15
  - **Mật khẩu OTP**: 123456

## 🔧 Cấu hình MoMo

### Bước 1: Đăng ký tài khoản MoMo Developer

1. Truy cập: https://developers.momo.vn/
2. Đăng ký tài khoản và tạo ứng dụng
3. Lấy thông tin:
   - **Partner Code**: Mã đối tác
   - **Access Key**: Key truy cập
   - **Secret Key**: Key bảo mật

### Bước 2: Cấu hình Server (.env)

```env
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_API=https://test-payment.momo.vn/v2/gateway/api/create
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### Bước 3: Test thanh toán

- Sử dụng app MoMo test hoặc môi trường sandbox
- Tài khoản test sẽ được cung cấp bởi MoMo khi đăng ký

## 🚀 Cách sử dụng

### 1. Frontend (CheckoutPage.jsx)

Người dùng chọn phương thức thanh toán:

```jsx
<select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
  <option value="vnpay">VNPay</option>
  <option value="momo">MoMo</option>
</select>
```

### 2. Luồng thanh toán VNPay

1. User chọn "VNPay" → Submit form
2. Frontend gọi API: `POST /api/payment/vnpay`
3. Server tạo payment URL và lưu order với status "pending"
4. Redirect user đến VNPay payment page
5. User thanh toán tại VNPay
6. VNPay redirect về: `/vnpay-return?vnp_ResponseCode=00&...`
7. Backend xử lý callback, cập nhật order status
8. Frontend hiển thị kết quả

### 3. Luồng thanh toán MoMo

1. User chọn "MoMo" → Submit form
2. Frontend gọi API: `POST /api/payment/momo`
3. Server tạo payment URL qua MoMo API
4. Redirect user đến MoMo payment page
5. User thanh toán qua app MoMo
6. MoMo gọi IPN: `POST /api/payment/momo-notify`
7. MoMo redirect user về: `/momo-return?resultCode=0&...`
8. Frontend hiển thị kết quả

## 📁 Cấu trúc File

```
server/
├── controllers/
│   └── paymentController.js    # Logic thanh toán VNPay & MoMo
├── routes/
│   └── paymentRoutes.js        # API routes
└── .env                        # Cấu hình keys

client/
├── pages/
│   ├── CheckoutPage.jsx        # Trang checkout
│   ├── VNPayReturn.jsx         # Callback VNPay
│   └── MoMoReturn.jsx          # Callback MoMo
└── App.jsx                     # Routes
```

## 🔐 Security Notes

1. **KHÔNG** commit file `.env` lên Git
2. Luôn verify signature từ VNPay/MoMo
3. Sử dụng HTTPS cho production
4. Validate dữ liệu từ callback
5. Implement rate limiting cho payment endpoints

## 🧪 Testing Checklist

- [ ] COD: Tạo đơn hàng thành công
- [ ] VNPay: Thanh toán thành công
- [ ] VNPay: Hủy thanh toán
- [ ] MoMo: Thanh toán thành công
- [ ] MoMo: Hủy thanh toán
- [ ] IPN handling: MoMo notify được xử lý đúng
- [ ] Cart cleared sau thanh toán thành công
- [ ] Order status updated correctly

## 📞 Support

- **VNPay**: https://sandbox.vnpayment.vn/apis/docs/
- **MoMo**: https://developers.momo.vn/v3/docs/

## 🎯 Production Deployment

### 1. Thay đổi URLs

```env
# Production
VNPAY_HOST=https://vnpayment.vn
MOMO_API=https://payment.momo.vn/v2/gateway/api/create
FRONTEND_URL=https://yourdomain.com
SERVER_URL=https://api.yourdomain.com
```

### 2. Sử dụng production credentials

- Đăng ký tài khoản production trên VNPay
- Đăng ký merchant production trên MoMo
- Cập nhật keys trong .env

### 3. Enable HTTPS

- Cài đặt SSL certificate
- Force HTTPS cho tất cả requests
- Cấu hình CORS properly

## 💡 Tips

1. **Log transactions**: Lưu lại tất cả transaction để debug
2. **Error handling**: Xử lý tất cả edge cases
3. **Timeout handling**: Set timeout cho payment redirects
4. **User experience**: Hiển thị loading states rõ ràng
5. **Mobile compatibility**: Test trên nhiều thiết bị

---

**Created**: October 27, 2025
**Version**: 1.0.0
