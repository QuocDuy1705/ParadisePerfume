# 📁 HƯỚNG DẪN TỔ CHỨC LẠI CẤU TRÚC FOLDER

## 🎯 Mục Tiêu

Chuyển từ cấu trúc **Page/Component-based** sang **Feature-based** để dễ quản lý khi dự án lớn.

---

## 📊 Cấu Trúc Mới

```
src/
├── features/              # Các tính năng chính
│   ├── auth/             # Authentication
│   ├── home/             # Trang chủ
│   ├── products/         # Sản phẩm
│   ├── cart/             # Giỏ hàng
│   ├── checkout/         # Thanh toán
│   ├── orders/           # Đơn hàng
│   ├── profile/          # Hồ sơ người dùng
│   ├── admin/            # Quản trị
│   ├── blog/             # Blog
│   ├── ai/               # AI Recommendation
│   ├── chat/             # Live Chat
│   └── static/           # Trang tĩnh
├── shared/               # Components dùng chung
│   ├── components/       # Header, Footer, Navbar...
│   └── layouts/          # Layout wrapper
├── core/                 # Core functionality
│   ├── context/          # React Context
│   ├── services/         # API services
│   └── utils/            # Utility functions
└── assets/               # Static assets (giữ nguyên)
```

---

## 🔄 DI CHUYỂN FILES

### 1️⃣ FEATURES - AUTH (Xác thực)

```bash
# Di chuyển
pages/AuthPage.jsx → features/auth/AuthPage.jsx
```

**Cập nhật import trong App.jsx:**

```javascript
// Cũ:
import AuthPage from "./pages/AuthPage";

// Mới:
import AuthPage from "./features/auth/AuthPage";
```

---

### 2️⃣ FEATURES - HOME (Trang chủ)

```bash
# Di chuyển
pages/Home.jsx → features/home/Home.jsx
components/Hero.jsx → features/home/components/Hero.jsx
components/AIFeatureCard.jsx → features/home/components/AIFeatureCard.jsx
```

**Cập nhật import trong App.jsx:**

```javascript
// Mới:
import Home from "./features/home/Home";
```

**Cập nhật import trong Home.jsx:**

```javascript
// Mới:
import Hero from "./components/Hero";
import AIFeatureCard from "./components/AIFeatureCard";
```

---

### 3️⃣ FEATURES - PRODUCTS (Sản phẩm)

```bash
# Di chuyển Pages
pages/ProductPage.jsx → features/products/pages/ProductPage.jsx
pages/ProductDetail.jsx → features/products/pages/ProductDetail.jsx
pages/MenPage.jsx → features/products/pages/MenPage.jsx
pages/WomenPage.jsx → features/products/pages/WomenPage.jsx
pages/MiniPage.jsx → features/products/pages/MiniPage.jsx
pages/GiftsetPage.jsx → features/products/pages/GiftsetPage.jsx
pages/CategoryPage.jsx → features/products/pages/CategoryPage.jsx
pages/SearchResultsPage.jsx → features/products/pages/SearchResultsPage.jsx
pages/WishlistPage.jsx → features/products/pages/WishlistPage.jsx

# Di chuyển Components
components/ProductCard.jsx → features/products/components/ProductCard.jsx
components/ProductList.jsx → features/products/components/ProductList.jsx
components/ProductFilters.jsx → features/products/components/ProductFilters.jsx
components/FilterPanel.jsx → features/products/components/FilterPanel.jsx
components/CategoryBanner.jsx → features/products/components/CategoryBanner.jsx
components/ProductServices.jsx → features/products/components/ProductServices.jsx
components/Rating.jsx → features/products/components/Rating.jsx
components/ReviewForm.jsx → features/products/components/ReviewForm.jsx
components/ReviewList.jsx → features/products/components/ReviewList.jsx
components/Pagination.jsx → features/products/components/Pagination.jsx
```

**Cập nhật import trong App.jsx:**

```javascript
import ProductPage from "./features/products/pages/ProductPage";
import ProductDetail from "./features/products/pages/ProductDetail";
import MenPage from "./features/products/pages/MenPage";
// ... các product pages khác
```

---

### 4️⃣ FEATURES - CART (Giỏ hàng)

```bash
# Di chuyển
pages/CartPage.jsx → features/cart/CartPage.jsx
components/CartSidebar.jsx → features/cart/components/CartSidebar.jsx
```

**Cập nhật import:**

```javascript
import CartPage from "./features/cart/CartPage";
```

**Trong CartPage.jsx:**

```javascript
import CartSidebar from "./components/CartSidebar";
```

---

### 5️⃣ FEATURES - CHECKOUT (Thanh toán)

```bash
# Di chuyển
pages/CheckoutPage.jsx → features/checkout/CheckoutPage.jsx
pages/PaymentPage.jsx → features/checkout/PaymentPage.jsx
pages/VNPayReturn.jsx → features/checkout/VNPayReturn.jsx (XÓA - không dùng nữa)
pages/MoMoReturn.jsx → features/checkout/MoMoReturn.jsx (XÓA - không dùng nữa)
```

**Cập nhật import:**

```javascript
import CheckoutPage from "./features/checkout/CheckoutPage";
import PaymentPage from "./features/checkout/PaymentPage";
```

---

### 6️⃣ FEATURES - ORDERS (Đơn hàng)

```bash
# Di chuyển
pages/Order.jsx → features/orders/OrderPage.jsx
pages/OrderSuccess.jsx → features/orders/OrderSuccess.jsx
```

**Cập nhật import:**

```javascript
import OrderPage from "./features/orders/OrderPage";
import OrderSuccess from "./features/orders/OrderSuccess";
```

---

### 7️⃣ FEATURES - PROFILE (Hồ sơ)

```bash
# Di chuyển
pages/ProfilePage.jsx → features/profile/ProfilePage.jsx
```

**Cập nhật import:**

```javascript
import ProfilePage from "./features/profile/ProfilePage";
```

---

### 8️⃣ FEATURES - ADMIN (Quản trị)

```bash
# Di chuyển Pages
pages/AdminDashboard.jsx → features/admin/pages/AdminDashboard.jsx
pages/AdminOverview.jsx → features/admin/pages/AdminOverview.jsx
pages/AdminProducts.jsx → features/admin/pages/AdminProducts.jsx
pages/AdminOrders.jsx → features/admin/pages/AdminOrders.jsx
pages/AdminUsers.jsx → features/admin/pages/AdminUsers.jsx
pages/AdminBlogs.jsx → features/admin/pages/AdminBlogs.jsx
pages/AdminChat.jsx → features/admin/pages/AdminChat.jsx

# Di chuyển Components
components/AdminRoute.jsx → features/admin/components/AdminRoute.jsx
components/RichTextEditor.jsx → features/admin/components/RichTextEditor.jsx
```

**Cập nhật import:**

```javascript
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminRoute from "./features/admin/components/AdminRoute";
// ... các admin pages khác
```

---

### 9️⃣ FEATURES - BLOG

```bash
# Di chuyển
pages/BlogPage.jsx → features/blog/pages/BlogPage.jsx
pages/BlogDetail.jsx → features/blog/pages/BlogDetail.jsx
pages/BlogBrands.jsx → features/blog/pages/BlogBrands.jsx
pages/BlogLuxuryBrands.jsx → features/blog/pages/BlogLuxuryBrands.jsx
pages/BlogFragranceTypes.jsx → features/blog/pages/BlogFragranceTypes.jsx
pages/BlogHowToChoose.jsx → features/blog/pages/BlogHowToChoose.jsx
pages/BlogPerfumeCare.jsx → features/blog/pages/BlogPerfumeCare.jsx
```

**Cập nhật import:**

```javascript
import BlogPage from "./features/blog/pages/BlogPage";
import BlogDetail from "./features/blog/pages/BlogDetail";
// ... các blog pages khác
```

---

### 🔟 FEATURES - AI (Gợi ý AI)

```bash
# Di chuyển
components/AIRecommendation.jsx → features/ai/AIRecommendation.jsx
```

**Cập nhật import:**

```javascript
import AIRecommendation from "./features/ai/AIRecommendation";
```

---

### 1️⃣1️⃣ FEATURES - CHAT (Trò chuyện)

```bash
# Di chuyển
components/ChatBox.jsx → features/chat/ChatBox.jsx
components/ChatButton.jsx → features/chat/ChatButton.jsx
```

**Cập nhật import trong App.jsx:**

```javascript
import ChatButton from "./features/chat/ChatButton";
```

---

### 1️⃣2️⃣ FEATURES - STATIC (Trang tĩnh)

```bash
# Di chuyển
pages/AboutPage.jsx → features/static/AboutPage.jsx
pages/ContactPage.jsx → features/static/ContactPage.jsx
pages/FAQPage.jsx → features/static/FAQPage.jsx
pages/TermsPage.jsx → features/static/TermsPage.jsx
pages/PrivacyPage.jsx → features/static/PrivacyPage.jsx
pages/ShippingPage.jsx → features/static/ShippingPage.jsx
pages/ReturnsPage.jsx → features/static/ReturnsPage.jsx
pages/WarrantyPage.jsx → features/static/WarrantyPage.jsx
pages/HowToOrderPage.jsx → features/static/HowToOrderPage.jsx
pages/StoresPage.jsx → features/static/StoresPage.jsx
pages/CareersPage.jsx → features/static/CareersPage.jsx
pages/SustainabilityPage.jsx → features/static/SustainabilityPage.jsx
```

**Cập nhật import:**

```javascript
import AboutPage from "./features/static/AboutPage";
import ContactPage from "./features/static/ContactPage";
// ... các static pages khác
```

---

### 1️⃣3️⃣ SHARED - COMPONENTS (Components dùng chung)

```bash
# Di chuyển
components/Header.jsx → shared/components/Header.jsx
components/Footer.jsx → shared/components/Footer.jsx
components/Navbar.jsx → shared/components/Navbar.jsx
components/SearchBar.jsx → shared/components/SearchBar.jsx
components/ScrollToTop.jsx → shared/components/ScrollToTop.jsx
```

**Cập nhật import trong App.jsx:**

```javascript
import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import ScrollToTop from "./shared/components/ScrollToTop";
```

---

### 1️⃣4️⃣ CORE - CONTEXT

```bash
# Di chuyển
context/AuthContext.jsx → core/context/AuthContext.jsx
context/CartContext.jsx → core/context/CartContext.jsx
```

**Cập nhật import:**

```javascript
// Trong App.jsx
import { AuthProvider } from "./core/context/AuthContext";
import { CartProvider } from "./core/context/CartContext";

// Trong các component khác
import { useAuth } from "../../core/context/AuthContext";
import { useCart } from "../../core/context/CartContext";
```

---

### 1️⃣5️⃣ CORE - SERVICES

```bash
# Di chuyển
services/auth.js → core/services/auth.js
services/cartService.jsx → core/services/cartService.jsx
services/payment.js → core/services/payment.js
```

**Cập nhật import:**

```javascript
import api from "../../core/services/auth";
```

---

### 1️⃣6️⃣ CORE - UTILS

```bash
# Di chuyển
utils/* → core/utils/*
```

**Cập nhật import:**

```javascript
import api from "../../core/utils/api";
```

---

## 🛠️ LỆNH DI CHUYỂN (PowerShell)

### Bước 1: Di chuyển từng feature

```powershell
cd client/src

# 1. AUTH
Move-Item pages/AuthPage.jsx features/auth/AuthPage.jsx

# 2. HOME
Move-Item pages/Home.jsx features/home/Home.jsx
Move-Item components/Hero.jsx features/home/components/Hero.jsx
Move-Item components/AIFeatureCard.jsx features/home/components/AIFeatureCard.jsx

# 3. PRODUCTS - Pages
Move-Item pages/ProductPage.jsx features/products/pages/ProductPage.jsx
Move-Item pages/ProductDetail.jsx features/products/pages/ProductDetail.jsx
Move-Item pages/MenPage.jsx features/products/pages/MenPage.jsx
Move-Item pages/WomenPage.jsx features/products/pages/WomenPage.jsx
Move-Item pages/MiniPage.jsx features/products/pages/MiniPage.jsx
Move-Item pages/GiftsetPage.jsx features/products/pages/GiftsetPage.jsx
Move-Item pages/CategoryPage.jsx features/products/pages/CategoryPage.jsx
Move-Item pages/SearchResultsPage.jsx features/products/pages/SearchResultsPage.jsx
Move-Item pages/WishlistPage.jsx features/products/pages/WishlistPage.jsx

# 3. PRODUCTS - Components
Move-Item components/ProductCard.jsx features/products/components/ProductCard.jsx
Move-Item components/ProductList.jsx features/products/components/ProductList.jsx
Move-Item components/ProductFilters.jsx features/products/components/ProductFilters.jsx
Move-Item components/FilterPanel.jsx features/products/components/FilterPanel.jsx
Move-Item components/CategoryBanner.jsx features/products/components/CategoryBanner.jsx
Move-Item components/ProductServices.jsx features/products/components/ProductServices.jsx
Move-Item components/Rating.jsx features/products/components/Rating.jsx
Move-Item components/ReviewForm.jsx features/products/components/ReviewForm.jsx
Move-Item components/ReviewList.jsx features/products/components/ReviewList.jsx
Move-Item components/Pagination.jsx features/products/components/Pagination.jsx

# 4. CART
Move-Item pages/CartPage.jsx features/cart/CartPage.jsx
Move-Item components/CartSidebar.jsx features/cart/components/CartSidebar.jsx

# 5. CHECKOUT
Move-Item pages/CheckoutPage.jsx features/checkout/CheckoutPage.jsx
Move-Item pages/PaymentPage.jsx features/checkout/PaymentPage.jsx

# 6. ORDERS
Move-Item pages/Order.jsx features/orders/OrderPage.jsx
Move-Item pages/OrderSuccess.jsx features/orders/OrderSuccess.jsx

# 7. PROFILE
Move-Item pages/ProfilePage.jsx features/profile/ProfilePage.jsx

# 8. ADMIN - Pages
Move-Item pages/AdminDashboard.jsx features/admin/pages/AdminDashboard.jsx
Move-Item pages/AdminOverview.jsx features/admin/pages/AdminOverview.jsx
Move-Item pages/AdminProducts.jsx features/admin/pages/AdminProducts.jsx
Move-Item pages/AdminOrders.jsx features/admin/pages/AdminOrders.jsx
Move-Item pages/AdminUsers.jsx features/admin/pages/AdminUsers.jsx
Move-Item pages/AdminBlogs.jsx features/admin/pages/AdminBlogs.jsx
Move-Item pages/AdminChat.jsx features/admin/pages/AdminChat.jsx

# 8. ADMIN - Components
Move-Item components/AdminRoute.jsx features/admin/components/AdminRoute.jsx
Move-Item components/RichTextEditor.jsx features/admin/components/RichTextEditor.jsx

# 9. BLOG
Move-Item pages/BlogPage.jsx features/blog/pages/BlogPage.jsx
Move-Item pages/BlogDetail.jsx features/blog/pages/BlogDetail.jsx
Move-Item pages/BlogBrands.jsx features/blog/pages/BlogBrands.jsx
Move-Item pages/BlogLuxuryBrands.jsx features/blog/pages/BlogLuxuryBrands.jsx
Move-Item pages/BlogFragranceTypes.jsx features/blog/pages/BlogFragranceTypes.jsx
Move-Item pages/BlogHowToChoose.jsx features/blog/pages/BlogHowToChoose.jsx
Move-Item pages/BlogPerfumeCare.jsx features/blog/pages/BlogPerfumeCare.jsx

# 10. AI
Move-Item components/AIRecommendation.jsx features/ai/AIRecommendation.jsx

# 11. CHAT
Move-Item components/ChatBox.jsx features/chat/ChatBox.jsx
Move-Item components/ChatButton.jsx features/chat/ChatButton.jsx

# 12. STATIC
Move-Item pages/AboutPage.jsx features/static/AboutPage.jsx
Move-Item pages/ContactPage.jsx features/static/ContactPage.jsx
Move-Item pages/FAQPage.jsx features/static/FAQPage.jsx
Move-Item pages/TermsPage.jsx features/static/TermsPage.jsx
Move-Item pages/PrivacyPage.jsx features/static/PrivacyPage.jsx
Move-Item pages/ShippingPage.jsx features/static/ShippingPage.jsx
Move-Item pages/ReturnsPage.jsx features/static/ReturnsPage.jsx
Move-Item pages/WarrantyPage.jsx features/static/WarrantyPage.jsx
Move-Item pages/HowToOrderPage.jsx features/static/HowToOrderPage.jsx
Move-Item pages/StoresPage.jsx features/static/StoresPage.jsx
Move-Item pages/CareersPage.jsx features/static/CareersPage.jsx
Move-Item pages/SustainabilityPage.jsx features/static/SustainabilityPage.jsx

# 13. SHARED
Move-Item components/Header.jsx shared/components/Header.jsx
Move-Item components/Footer.jsx shared/components/Footer.jsx
Move-Item components/Navbar.jsx shared/components/Navbar.jsx
Move-Item components/SearchBar.jsx shared/components/SearchBar.jsx
Move-Item components/ScrollToTop.jsx shared/components/ScrollToTop.jsx

# 14. CORE - Context
Move-Item context/AuthContext.jsx core/context/AuthContext.jsx
Move-Item context/CartContext.jsx core/context/CartContext.jsx

# 15. CORE - Services
Move-Item services/auth.js core/services/auth.js
Move-Item services/cartService.jsx core/services/cartService.jsx
Move-Item services/payment.js core/services/payment.js

# 16. CORE - Utils
Move-Item utils/* core/utils/
```

### Bước 2: Xóa các file không dùng

```powershell
# Xóa VNPay/MoMo return pages (không dùng nữa)
Remove-Item pages/VNPayReturn.jsx
Remove-Item pages/MoMoReturn.jsx

# Xóa component ProductPage.jsx trong components (trùng lặp)
Remove-Item components/ProductPage.jsx
```

### Bước 3: Xóa folder cũ (sau khi đã di chuyển hết)

```powershell
Remove-Item -Recurse pages
Remove-Item -Recurse components
Remove-Item -Recurse context
Remove-Item -Recurse services
Remove-Item -Recurse utils
```

---

## 📝 CẬP NHẬT IMPORTS TRONG App.jsx

Sau khi di chuyển xong, cập nhật file `App.jsx`:

```javascript
// SHARED COMPONENTS
import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import ScrollToTop from "./shared/components/ScrollToTop";

// CORE
import { AuthProvider } from "./core/context/AuthContext";
import { CartProvider } from "./core/context/CartContext";

// FEATURES - Auth
import AuthPage from "./features/auth/AuthPage";

// FEATURES - Home
import Home from "./features/home/Home";

// FEATURES - Products
import ProductPage from "./features/products/pages/ProductPage";
import ProductDetail from "./features/products/pages/ProductDetail";
import MenPage from "./features/products/pages/MenPage";
import WomenPage from "./features/products/pages/WomenPage";
import MiniPage from "./features/products/pages/MiniPage";
import GiftsetPage from "./features/products/pages/GiftsetPage";
import CategoryPage from "./features/products/pages/CategoryPage";
import SearchResultsPage from "./features/products/pages/SearchResultsPage";
import WishlistPage from "./features/products/pages/WishlistPage";

// FEATURES - Cart
import CartPage from "./features/cart/CartPage";

// FEATURES - Checkout
import CheckoutPage from "./features/checkout/CheckoutPage";
import PaymentPage from "./features/checkout/PaymentPage";

// FEATURES - Orders
import OrderPage from "./features/orders/OrderPage";
import OrderSuccess from "./features/orders/OrderSuccess";

// FEATURES - Profile
import ProfilePage from "./features/profile/ProfilePage";

// FEATURES - Admin
import AdminRoute from "./features/admin/components/AdminRoute";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminOverview from "./features/admin/pages/AdminOverview";
import AdminProducts from "./features/admin/pages/AdminProducts";
import AdminOrders from "./features/admin/pages/AdminOrders";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminBlogs from "./features/admin/pages/AdminBlogs";
import AdminChat from "./features/admin/pages/AdminChat";

// FEATURES - Blog
import BlogPage from "./features/blog/pages/BlogPage";
import BlogDetail from "./features/blog/pages/BlogDetail";
import BlogBrands from "./features/blog/pages/BlogBrands";
import BlogLuxuryBrands from "./features/blog/pages/BlogLuxuryBrands";
import BlogFragranceTypes from "./features/blog/pages/BlogFragranceTypes";
import BlogHowToChoose from "./features/blog/pages/BlogHowToChoose";
import BlogPerfumeCare from "./features/blog/pages/BlogPerfumeCare";

// FEATURES - AI
import AIRecommendation from "./features/ai/AIRecommendation";

// FEATURES - Chat
import ChatButton from "./features/chat/ChatButton";

// FEATURES - Static
import AboutPage from "./features/static/AboutPage";
import ContactPage from "./features/static/ContactPage";
import FAQPage from "./features/static/FAQPage";
import TermsPage from "./features/static/TermsPage";
import PrivacyPage from "./features/static/PrivacyPage";
import ShippingPage from "./features/static/ShippingPage";
import ReturnsPage from "./features/static/ReturnsPage";
import WarrantyPage from "./features/static/WarrantyPage";
import HowToOrderPage from "./features/static/HowToOrderPage";
import StoresPage from "./features/static/StoresPage";
import CareersPage from "./features/static/CareersPage";
import SustainabilityPage from "./features/static/SustainabilityPage";
```

---

## ✅ KIỂM TRA SAU KHI DI CHUYỂN

1. **Chạy lại client:**

   ```bash
   npm start
   ```

2. **Kiểm tra console** xem có lỗi import nào không

3. **Test từng trang** để đảm bảo hoạt động bình thường

4. **Tìm kiếm toàn bộ project** để fix các import còn sót:
   ```bash
   # Tìm các import cũ còn sót
   grep -r "from './pages/" src/
   grep -r "from './components/" src/
   grep -r "from './context/" src/
   grep -r "from './services/" src/
   ```

---

## 🎯 LỢI ÍCH CỦA CẤU TRÚC MỚI

### ✅ Tổ chức tốt hơn:

- Mỗi feature có folder riêng
- Dễ tìm file liên quan đến 1 chức năng
- Components và pages của cùng 1 feature ở gần nhau

### ✅ Dễ bảo trì:

- Muốn sửa Products? → Vào `features/products/`
- Muốn sửa Admin? → Vào `features/admin/`
- Tất cả code liên quan ở 1 chỗ

### ✅ Dễ mở rộng:

- Thêm feature mới? → Tạo folder mới trong `features/`
- Không ảnh hưởng đến code cũ
- Có thể tách thành micro-frontend sau này

### ✅ Teamwork tốt hơn:

- Mỗi người phụ trách 1 feature
- Ít conflict khi merge code
- Dễ review code theo feature

---

## 📌 LƯU Ý

1. **Backup trước khi di chuyển:**

   ```bash
   git add .
   git commit -m "Backup before restructure"
   ```

2. **Di chuyển từng bước:**

   - Di chuyển 1 feature
   - Test xem có lỗi không
   - Commit
   - Tiếp tục feature khác

3. **Sử dụng Find & Replace:**

   - Trong VS Code: `Ctrl + Shift + H`
   - Tìm: `from './pages/`
   - Thay: `from './features/XXX/`

4. **Tạo index.js cho mỗi folder:**

   ```javascript
   // features/products/index.js
   export { default as ProductPage } from "./pages/ProductPage";
   export { default as ProductDetail } from "./pages/ProductDetail";
   // ... export tất cả
   ```

   Sau đó import ngắn gọn hơn:

   ```javascript
   import { ProductPage, ProductDetail } from "./features/products";
   ```

---

**Ngày tạo:** 19/11/2025  
**Version:** 1.0  
**Tác giả:** Paradise Perfume Team
