# 🎓 NEW FEATURES IMPLEMENTATION GUIDE

## Tổng quan

Tài liệu này hướng dẫn sử dụng 3 tính năng mới đã được thêm vào Paradise Perfume:

1. ✅ **Email Notifications System** - Hệ thống gửi email tự động
2. ✅ **SEO Meta Tags** - Tối ưu hóa công cụ tìm kiếm
3. ✅ **Coupon/Discount System** - Hệ thống mã giảm giá

---

## 1. 📧 EMAIL NOTIFICATIONS SYSTEM

### Tính năng đã implement:

#### ✉️ **Email Templates**

**1. Welcome Email** - Email chào mừng khi đăng ký

- Tự động gửi khi user đăng ký tài khoản mới
- Bao gồm: Lời chào, ưu đãi thành viên mới
- Template: Professional HTML với Chanel-inspired design

**2. Order Confirmation Email** - Xác nhận đơn hàng

- Gửi ngay sau khi đơn hàng được tạo
- Bao gồm: Mã đơn, chi tiết sản phẩm, tổng tiền, phương thức thanh toán
- Link: Xem đơn hàng online

**3. Order Status Update Email** - Cập nhật trạng thái

- Gửi khi admin thay đổi trạng thái đơn hàng
- Các trạng thái: Pending, Confirmed, Shipping, Delivered, Cancelled
- Icon & màu sắc khác nhau cho mỗi trạng thái

**4. Password Reset Email** (Template đã sẵn sàng)

- Để sử dụng cho tính năng reset password trong tương lai
- Bao gồm: Reset link với expiry time (1 giờ)

### Cấu hình Email

**File:** `server/.env`

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Hướng dẫn lấy App Password:**

1. Đăng nhập Gmail
2. Vào [Google Account Security](https://myaccount.google.com/security)
3. Bật **2-Step Verification**
4. Tạo **App Password**:
   - Chọn App: Mail
   - Chọn Device: Other (Custom name)
   - Copy 16-ký tự password
5. Paste vào `EMAIL_PASS` trong `.env`

### API Endpoints

Không có API endpoint riêng. Email được gửi tự động khi:

- ✅ User đăng ký → Welcome email
- ✅ Tạo đơn hàng → Order confirmation
- ✅ Admin cập nhật status → Status update email

### Testing Email

**Test Welcome Email:**

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "123456",
  "country": "Vietnam"
}
```

**Test Order Confirmation:**

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "userId": "USER_ID",
  "items": [...],
  "totalAmount": 500000,
  "paymentMethod": "cod"
}
```

**Test Status Update:**

```bash
PUT http://localhost:5000/api/orders/ORDER_ID
Content-Type: application/json
Authorization: Bearer ADMIN_JWT_TOKEN

{
  "status": "shipping"
}
```

### Email Design

Tất cả email có:

- ✅ Responsive design
- ✅ Professional Chanel-inspired layout
- ✅ Black & white color scheme
- ✅ Clean typography
- ✅ Call-to-action buttons
- ✅ Footer với links

---

## 2. 🔍 SEO META TAGS

### Đã implement:

#### **1. Basic Meta Tags**

```html
<title>Paradise Perfume - Nước Hoa Cao Cấp Chính Hãng</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="Paradise Perfume" />
<meta name="robots" content="index, follow" />
```

#### **2. Open Graph (Facebook/LinkedIn)**

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
```

#### **3. Twitter Cards**

```html
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="..." />
<meta property="twitter:description" content="..." />
<meta property="twitter:image" content="..." />
```

#### **4. Structured Data (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Paradise Perfume",
  "description": "...",
  "address": {...},
  "openingHours": "Mo-Su 09:00-21:00"
}
```

#### **5. robots.txt**

**File:** `client/public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://paradiseperfume.com/sitemap.xml
```

#### **6. sitemap.xml**

**File:** `client/public/sitemap.xml`

Bao gồm:

- Homepage (priority 1.0)
- Product categories (priority 0.9)
- Blog pages (priority 0.7)
- Info pages (priority 0.5-0.6)

### Cách sử dụng:

**Bước 1:** Update domain trong `index.html`

```html
<!-- Thay đổi từ -->
<meta property="og:url" content="https://paradiseperfume.com/" />

<!-- Thành domain thực tế -->
<meta property="og:url" content="https://your-domain.com/" />
```

**Bước 2:** Tạo og-image.jpg

- Kích thước khuyến nghị: 1200x630px
- Đặt tại: `client/public/images/og-image.jpg`
- Hình ảnh đại diện cho website khi share social media

**Bước 3:** Test SEO

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **Google Rich Results Test:** https://search.google.com/test/rich-results

### Dynamic Meta Tags (Tương lai)

Để thêm meta tags động cho từng trang product:

**Option 1:** React Helmet (Recommended)

```bash
npm install react-helmet-async
```

**Option 2:** Server-Side Rendering (SSR)

- Next.js hoặc Remix

---

## 3. 🎫 COUPON/DISCOUNT SYSTEM

### Database Model

**File:** `server/models/Coupon.js`

```javascript
{
  code: "WELCOME10",              // Mã giảm giá (unique, uppercase)
  description: "Giảm 10% đơn đầu", // Mô tả
  discountType: "percentage",     // "percentage" hoặc "fixed"
  discountValue: 10,              // Giá trị (% hoặc VND)
  minOrderAmount: 100000,         // Đơn tối thiểu
  maxDiscountAmount: 50000,       // Giảm tối đa (cho %)
  startDate: "2025-01-01",        // Ngày bắt đầu
  endDate: "2025-12-31",          // Ngày kết thúc
  usageLimit: 100,                // Số lần sử dụng (null = unlimited)
  usagePerUser: 1,                // Mỗi user dùng mấy lần
  usedCount: 0,                   // Đã dùng bao nhiêu lần
  isActive: true                  // Còn hiệu lực không
}
```

### API Endpoints

#### **1. Get Active Coupons (Public)**

```bash
GET /api/coupons/active
```

**Response:**

```json
[
  {
    "code": "WELCOME10",
    "description": "Giảm 10% cho đơn hàng đầu tiên",
    "discountType": "percentage",
    "discountValue": 10,
    "minOrderAmount": 100000,
    "maxDiscountAmount": 50000,
    "endDate": "2025-12-31T00:00:00.000Z"
  }
]
```

#### **2. Validate Coupon (User)**

```bash
POST /api/coupons/validate
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "code": "WELCOME10",
  "orderAmount": 500000,
  "items": []
}
```

**Response (Success):**

```json
{
  "valid": true,
  "message": "Áp dụng mã giảm giá thành công",
  "couponId": "67...",
  "code": "WELCOME10",
  "discount": 50000,
  "finalAmount": 450000,
  "discountType": "percentage",
  "discountValue": 10
}
```

**Response (Error):**

```json
{
  "valid": false,
  "message": "Đơn hàng tối thiểu 100,000₫"
}
```

#### **3. Create Coupon (Admin)**

```bash
POST /api/coupons
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "code": "SUMMER2025",
  "description": "Giảm 15% mùa hè 2025",
  "discountType": "percentage",
  "discountValue": 15,
  "minOrderAmount": 200000,
  "maxDiscountAmount": 100000,
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "usageLimit": 500,
  "usagePerUser": 2
}
```

#### **4. Get All Coupons (Admin)**

```bash
GET /api/coupons
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### **5. Update Coupon (Admin)**

```bash
PUT /api/coupons/:id
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "isActive": false  // Vô hiệu hóa coupon
}
```

#### **6. Delete Coupon (Admin)**

```bash
DELETE /api/coupons/:id
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Note:** Nếu coupon đã được sử dụng, sẽ chỉ vô hiệu hóa (isActive=false) thay vì xóa.

#### **7. Get Coupon Statistics (Admin)**

```bash
GET /api/coupons/:id/stats
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Response:**

```json
{
  "coupon": {
    "code": "WELCOME10",
    "usedCount": 45,
    "usageLimit": 100,
    "remainingUses": 55
  },
  "statistics": {
    "totalOrders": 45,
    "totalDiscount": 1250000,
    "avgDiscount": 27778
  },
  "recentUsage": [...]
}
```

### Frontend Integration

**1. Checkout Page - Apply Coupon**

```javascript
const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);

const handleApplyCoupon = async () => {
  try {
    const response = await api.post("/coupons/validate", {
      code: couponCode,
      orderAmount: totalAmount,
      items: cartItems,
    });

    setAppliedCoupon(response.data);
    // Update final amount: response.data.finalAmount
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
```

**2. Display Discount in Checkout**

```jsx
{
  appliedCoupon && (
    <div className="coupon-applied">
      <p>Mã: {appliedCoupon.code}</p>
      <p>Giảm: {appliedCoupon.discount.toLocaleString()}₫</p>
    </div>
  );
}

<div className="order-total">
  <p>Tạm tính: {totalAmount.toLocaleString()}₫</p>
  {appliedCoupon && (
    <p className="discount">
      Giảm giá: -{appliedCoupon.discount.toLocaleString()}₫
    </p>
  )}
  <h3>
    Tổng:{" "}
    {appliedCoupon
      ? appliedCoupon.finalAmount.toLocaleString()
      : totalAmount.toLocaleString()}
    ₫
  </h3>
</div>;
```

**3. When Creating Order**

```javascript
const createOrder = async () => {
  const orderData = {
    items: cartItems,
    totalAmount: appliedCoupon ? appliedCoupon.finalAmount : totalAmount,
    paymentMethod: selectedMethod,
    couponId: appliedCoupon?.couponId,
    discount: appliedCoupon?.discount || 0,
  };

  await api.post("/orders", orderData);

  // Apply coupon usage
  if (appliedCoupon) {
    await api.post("/coupons/apply", {
      couponId: appliedCoupon.couponId,
      userId: user.id,
      orderAmount: totalAmount,
      discountAmount: appliedCoupon.discount,
    });
  }
};
```

### Coupon Types Examples

**1. Percentage Discount**

```json
{
  "code": "SALE20",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 100000 // Giảm tối đa 100k
}
```

**2. Fixed Amount**

```json
{
  "code": "DISCOUNT50K",
  "discountType": "fixed",
  "discountValue": 50000 // Giảm cố định 50k
}
```

**3. First Order (Newbie)**

```json
{
  "code": "NEWBIE",
  "discountType": "percentage",
  "discountValue": 10,
  "usagePerUser": 1, // Chỉ dùng 1 lần/user
  "minOrderAmount": 0
}
```

**4. Limited Time Flash Sale**

```json
{
  "code": "FLASH24H",
  "discountType": "percentage",
  "discountValue": 30,
  "startDate": "2025-12-25T00:00:00",
  "endDate": "2025-12-26T00:00:00",
  "usageLimit": 100 // Chỉ 100 người đầu tiên
}
```

### Admin Panel - Coupon Management

**Tạo Component:** `client/src/features/admin/pages/AdminCoupons.jsx`

```jsx
import { useState, useEffect } from "react";
import api from "../../../core/utils/api";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const response = await api.get("/coupons");
    setCoupons(response.data);
  };

  const handleCreate = async (formData) => {
    await api.post("/coupons", formData);
    fetchCoupons();
  };

  const handleToggle = async (id, currentStatus) => {
    await api.put(`/coupons/${id}`, {
      isActive: !currentStatus,
    });
    fetchCoupons();
  };

  return (
    <div className="admin-coupons">
      <h2>Quản lý mã giảm giá</h2>
      {/* Form tạo coupon */}
      {/* Table hiển thị coupons */}
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploy:

- [ ] Update `EMAIL_USER` và `EMAIL_PASS` trong `.env`
- [ ] Thay domain trong `index.html` meta tags
- [ ] Tạo `og-image.jpg` (1200x630px)
- [ ] Update `sitemap.xml` với domain thực
- [ ] Test email gửi thành công
- [ ] Test coupon validation logic
- [ ] Verify SEO tags với tools

### Testing:

1. **Email System:**

   - Đăng ký tài khoản mới → Check email
   - Tạo đơn hàng → Check order confirmation
   - Admin đổi status → Check status update email

2. **SEO:**

   - View page source → Verify meta tags
   - Facebook Debugger → Test OG tags
   - Google Search Console → Submit sitemap

3. **Coupons:**
   - Tạo coupon test
   - Apply coupon hợp lệ → Should work
   - Apply coupon hết hạn → Should fail
   - Apply coupon đã hết lượt → Should fail
   - Check usage statistics

---

## 📊 IMPACT & BENEFITS

### Email Notifications:

- ✅ Tăng trust với khách hàng
- ✅ Giảm support requests (có email xác nhận)
- ✅ Professional branding
- ✅ Tự động hóa communication

### SEO Meta Tags:

- ✅ Tăng traffic từ Google
- ✅ CTR cao hơn trên SERP
- ✅ Social sharing đẹp hơn
- ✅ Google hiểu website tốt hơn

### Coupon System:

- ✅ Marketing campaigns dễ dàng
- ✅ Tăng conversion rate
- ✅ Customer retention
- ✅ Flash sales & promotions
- ✅ Track ROI của campaigns

---

## 🐛 TROUBLESHOOTING

### Email không gửi được:

**Problem:** Email không đến inbox

**Solutions:**

1. Check `.env` có đúng EMAIL_USER và EMAIL_PASS không
2. Verify Gmail App Password (16 ký tự)
3. Check spam folder
4. Enable "Less secure app access" (không khuyến nghị)
5. Check server logs: `console.error` trong email functions

### SEO tags không hiện:

**Problem:** Facebook/Twitter không hiển thị preview

**Solutions:**

1. Clear cache của debugger tools
2. Verify `og:image` URL accessible publicly
3. Check image size (1200x630px)
4. Ensure meta tags trong `<head>`

### Coupon validation fails:

**Problem:** Valid coupon bị reject

**Debug:**

1. Check coupon `isActive = true`
2. Check dates: `startDate <= now <= endDate`
3. Check `usageLimit` không vượt quá
4. Check `minOrderAmount` đủ không
5. Check user đã dùng hết `usagePerUser` chưa

---

## 📞 SUPPORT

Nếu gặp vấn đề khi implement:

1. Check server logs
2. Check browser console
3. Verify API responses
4. Test với Postman/Thunder Client
5. Review code trong các files:
   - `server/utils/sendMail.js`
   - `server/controllers/couponController.js`
   - `server/models/Coupon.js`
   - `client/public/index.html`

---

**Made with ❤️ for Paradise Perfume Graduation Project**

Last Updated: November 19, 2025
