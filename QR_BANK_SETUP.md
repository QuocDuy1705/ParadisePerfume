# HƯỚNG DẪN THANH TOÁN QR CODE TP BANK

## 📋 Thay Đổi

**TRƯỚC** (VNPay/MoMo):

- VNPay Payment Gateway
- MoMo Payment Gateway
- COD

**SAU** (TP Bank QR):

- **TP Bank QR Code** (Quét mã thanh toán)
- COD (Giữ nguyên)

---

## 🏦 BƯỚC 1: Cấu hình Thông Tin Ngân Hàng

### 1.1. Thêm vào file `.env` (server)

```env
# TP Bank Configuration
BANK_BIN=970423
BANK_ACCOUNT_NUMBER=0123456789012
BANK_ACCOUNT_NAME=LE THAI QUOC DUY
```

**Lưu ý**: Thay các thông tin sau bằng thông tin thật của bạn:

- `BANK_ACCOUNT_NUMBER`: Số tài khoản TP Bank của bạn
- `BANK_ACCOUNT_NAME`: Tên chủ tài khoản (viết HOA, không dấu)

---

## 🔧 BƯỚC 2: Thay Đổi Backend

### 2.1. Thay thế file `paymentController.js`

**File cũ**: `server/controllers/paymentController.js` (600+ dòng với VNPay/MoMo)

**File mới**: Copy nội dung từ `server/controllers/paymentController_new.js`

```bash
# Trong terminal:
cd server/controllers
del paymentController.js
rename paymentController_new.js paymentController.js
```

### 2.2. Cập nhật Routes

File: `server/routes/paymentRoutes.js`

```javascript
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createBankOrder,
  createCODOrder,
  confirmPayment,
  checkPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

// TP Bank QR Payment
router.post("/create-bank-order", protect, createBankOrder);
router.post("/confirm-payment/:orderId", protect, confirmPayment);
router.get("/check-status/:orderId", protect, checkPaymentStatus);

// COD Payment
router.post("/create-cod-order", protect, createCODOrder);

export default router;
```

---

## 🎨 BƯỚC 3: Thay Đổi Frontend

### 3.1. Cập nhật CheckoutPage

File: `client/src/pages/CheckoutPage.jsx`

**Thay đổi phần Payment Method**:

```jsx
<div className="payment-method">
  <h3>Phương Thức Thanh Toán</h3>

  {/* TP Bank QR Code */}
  <label className="payment-option">
    <input
      type="radio"
      name="payment"
      value="bank_transfer"
      checked={paymentMethod === "bank_transfer"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <div className="payment-info">
      <strong>🏦 Chuyển khoản ngân hàng (TP Bank)</strong>
      <p>Quét mã QR để thanh toán nhanh chóng</p>
    </div>
  </label>

  {/* COD */}
  <label className="payment-option">
    <input
      type="radio"
      name="payment"
      value="cod"
      checked={paymentMethod === "cod"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <div className="payment-info">
      <strong>💵 Thanh toán khi nhận hàng (COD)</strong>
      <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
    </div>
  </label>
</div>
```

### 3.2. Xử lý Submit

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setIsSubmitting(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      totalPrice: getTotal(),
      shippingFee: 30000,
      shippingAddress: formData,
      note: formData.note,
    };

    let response;

    if (paymentMethod === "bank_transfer") {
      // TP Bank QR Code
      response = await axios.post(
        "http://localhost:5000/api/payment/create-bank-order",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Hiển thị QR Code
      showQRCodeModal(response.data.data);
    } else if (paymentMethod === "cod") {
      // COD
      response = await axios.post(
        "http://localhost:5000/api/payment/create-cod-order",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Chuyển đến trang thành công
      navigate(`/order-success?orderId=${response.data.data.orderId}`);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Có lỗi xảy ra khi đặt hàng!");
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3.3. Tạo Modal Hiển Thị QR Code

```jsx
const [showQRModal, setShowQRModal] = useState(false);
const [qrData, setQRData] = useState(null);

const showQRCodeModal = (data) => {
  setQRData(data);
  setShowQRModal(true);
};

// Component Modal
{
  showQRModal && (
    <div className="qr-modal">
      <div className="qr-modal-content">
        <h2>🏦 Quét Mã QR Để Thanh Toán</h2>

        <div className="qr-code-container">
          <img src={qrData.qrCodeUrl} alt="QR Code" className="qr-code-image" />
        </div>

        <div className="bank-info">
          <h3>Thông Tin Chuyển Khoản</h3>
          <p>
            <strong>Ngân hàng:</strong> {qrData.bankInfo.bankName}
          </p>
          <p>
            <strong>Số tài khoản:</strong> {qrData.bankInfo.accountNumber}
          </p>
          <p>
            <strong>Chủ tài khoản:</strong> {qrData.bankInfo.accountName}
          </p>
          <p>
            <strong>Số tiền:</strong> {qrData.bankInfo.amount.toLocaleString()}đ
          </p>
          <p>
            <strong>Nội dung CK:</strong> {qrData.bankInfo.content}
          </p>
        </div>

        <div className="qr-instructions">
          <h4>📱 Hướng dẫn:</h4>
          <ol>
            <li>Mở app ngân hàng của bạn</li>
            <li>Chọn "Quét mã QR"</li>
            <li>Quét mã QR bên trên</li>
            <li>Xác nhận thanh toán</li>
          </ol>
          <p className="note">
            ⚠️ Vui lòng GHI ĐÚNG nội dung chuyển khoản:{" "}
            <strong>{qrData.bankInfo.content}</strong>
          </p>
        </div>

        <button
          className="btn-confirm-paid"
          onClick={() => {
            navigate(`/order-success?orderId=${qrData.orderId}`);
          }}
        >
          Tôi Đã Chuyển Khoản
        </button>

        <button
          className="btn-close-modal"
          onClick={() => setShowQRModal(false)}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
```

### 3.4. CSS cho Modal

```css
/* QR Code Modal */
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.qr-modal-content {
  background: white;
  padding: 40px;
  border-radius: 0;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.qr-modal-content h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #000;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.qr-code-container {
  margin: 30px 0;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
}

.qr-code-image {
  width: 300px;
  height: 300px;
  max-width: 100%;
}

.bank-info {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
}

.bank-info h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.bank-info p {
  margin: 10px 0;
  font-size: 0.95rem;
  color: #333;
}

.bank-info strong {
  font-weight: 600;
  color: #000;
}

.qr-instructions {
  text-align: left;
  margin: 20px 0;
}

.qr-instructions h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 400;
}

.qr-instructions ol {
  margin: 15px 0;
  padding-left: 20px;
}

.qr-instructions li {
  margin: 8px 0;
  line-height: 1.6;
}

.qr-instructions .note {
  background: #fff3cd;
  padding: 15px;
  border: 1px solid #ffeeba;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #856404;
}

.btn-confirm-paid {
  width: 100%;
  padding: 16px;
  background: #000;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.btn-confirm-paid:hover {
  background: #2a2a2a;
}

.btn-close-modal {
  width: 100%;
  padding: 16px;
  background: white;
  color: #000;
  border: 1px solid #000;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: #fafafa;
}
```

---

## 🧪 BƯỚC 4: Test Hệ Thống

### 4.1. Test Backend

```bash
# Test create bank order
POST http://localhost:5000/api/payment/create-bank-order
Headers: {
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "items": [...],
  "totalPrice": 1000000,
  "shippingAddress": {...},
  "shippingFee": 30000
}

# Response:
{
  "success": true,
  "data": {
    "orderId": "...",
    "orderNumber": "ORD...",
    "qrCodeUrl": "https://img.vietqr.io/image/...",
    "bankInfo": {
      "bankName": "TP Bank",
      "accountNumber": "...",
      "accountName": "...",
      "amount": 1000000,
      "content": "ORD..."
    }
  }
}
```

### 4.2. Test Frontend

1. **Đăng nhập** vào tài khoản
2. **Thêm sản phẩm** vào giỏ hàng
3. Vào **Checkout**
4. Chọn **"Chuyển khoản ngân hàng"**
5. Điền thông tin giao hàng
6. Click **"Đặt Hàng"**
7. Xem **QR Code** hiển thị
8. Quét mã QR (hoặc xem thông tin chuyển khoản)
9. Click **"Tôi Đã Chuyển Khoản"**
10. Chuyển đến trang **Order Success**

---

## 📊 BƯỚC 5: Admin Xác Nhận Thanh Toán

### 5.1. API Confirm Payment

```javascript
// Admin xác nhận đã nhận tiền
POST /api/payment/confirm-payment/:orderId
Headers: {
  "Authorization": "Bearer ADMIN_TOKEN"
}

// Response:
{
  "success": true,
  "message": "Xác nhận thanh toán thành công"
}
```

### 5.2. Thêm Button vào Admin Dashboard

```jsx
// AdminOrders.jsx
const confirmPayment = async (orderId) => {
  try {
    await axios.post(
      `http://localhost:5000/api/payment/confirm-payment/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Xác nhận thanh toán thành công!");
    fetchOrders(); // Reload orders
  } catch (error) {
    alert("Lỗi xác nhận thanh toán!");
  }
};

// Trong table:
{
  order.paymentMethod === "bank_transfer" &&
    order.paymentStatus === "pending" && (
      <button onClick={() => confirmPayment(order._id)}>
        Xác Nhận Đã Nhận Tiền
      </button>
    );
}
```

---

## 🎯 KẾT QUẢ

### Trước:

- VNPay (Yêu cầu đăng ký, cấu hình phức tạp)
- MoMo (Yêu cầu đăng ký doanh nghiệp)
- COD

### Sau:

- **TP Bank QR Code** (Đơn giản, chỉ cần số tài khoản)
  - Khách quét mã QR
  - Chuyển khoản ngay lập tức
  - Admin xác nhận thủ công
- **COD** (Giữ nguyên)

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Không tự động**: QR Code không tự động kiểm tra thanh toán. Admin phải kiểm tra app ngân hàng và xác nhận thủ công.

2. **Nội dung chuyển khoản**: Khách PHẢI ghi đúng `orderNumber` để admin dễ đối chiếu.

3. **Bảo mật**: Không để lộ số tài khoản ra ngoài, chỉ hiển thị qua QR Code.

4. **Backup**: Backup file `paymentController.js` cũ trước khi thay thế:
   ```bash
   copy paymentController.js paymentController.backup.js
   ```

---

## 🔄 Quay Lại VNPay/MoMo

Nếu muốn quay lại VNPay/MoMo, restore file backup:

```bash
del paymentController.js
rename paymentController.backup.js paymentController.js
```

---

**Ngày tạo**: 19/11/2025  
**Version**: 1.0  
**Tác giả**: Paradise Perfume Development Team
