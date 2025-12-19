# Hướng Dẫn Hệ Thống ParadisePerfume

## 1. Tổng quan nền tảng

ParadisePerfume được tách thành ứng dụng khách React trong [client/](client) và máy chủ API Node.js + Express trong [server/](server). MongoDB lưu trữ dữ liệu qua các mô hình Mongoose, còn Socket.IO phụ trách trò chuyện thời gian thực giữa khách và quản trị viên. Tầng tiện ích chung đảm nhận xác thực, bộ nhớ đệm, làm sạch dữ liệu, gửi email và tích hợp AI.

## 2. Backend (server/)

### 2.1 Khởi tạo ứng dụng

- [server/server.js](server/server.js) tải biến môi trường, kết nối MongoDB và gắn chuỗi middleware như Helmet, compression, CORS cùng bộ phân tích thân yêu cầu. Mọi router REST được mount dưới tiền tố /api và thư mục uploads được phục vụ công khai.
- Cùng trong file này, HTTP server và Socket.IO được khởi tạo. Middleware xác thực socket kiểm tra JWT (có fallback khi cần) trước khi đính kèm userId và isAdmin vào socket. Các sự kiện lưu tin nhắn chat, phát tới admin và đồng bộ hội thoại thông qua import động mô hình Mongoose.
- Tuyến kiểm tra sức khỏe và middleware xử lý lỗi 404 kết thúc pipeline.

### 2.2 Kết nối cơ sở dữ liệu

- [server/config/db.js](server/config/db.js) cung cấp connectDB, đọc MONGO_URI, bật strictQuery và ghi log trạng thái. Server chỉ bắt đầu lắng nghe sau khi hàm này hoàn tất.

### 2.3 Tầng middleware

- [server/middleware/auth.js](server/middleware/auth.js) định nghĩa protect (xác thực JWT, gắn req.user, chặn truy cập khi thiếu) và adminOnly (đảm bảo quyền quản trị). Hai middleware này bảo vệ các tuyến nhạy cảm như quản lý sản phẩm và cập nhật đơn hàng.
- [server/middleware/cache.js](server/middleware/cache.js) bọc phản hồi bằng node-cache. cacheMiddleware lưu kết quả GET theo URL, còn clearCacheByPattern xóa cache sau thao tác ghi.
- [server/middleware/errorHandler.js](server/middleware/errorHandler.js) chứa AppError, asyncHandler và middleware lỗi dùng toàn cục.
- [server/middleware/upload.js](server/middleware/upload.js) cấu hình multer để lưu ảnh vào uploads và lọc MIME.
- [server/middleware/rateLimiter.js](server/middleware/rateLimiter.js) áp dụng express-rate-limit nhằm bảo vệ tuyến đăng nhập và AI.

### 2.4 Mô hình dữ liệu

Mỗi schema trong [server/models/](server/models) mô tả một collection MongoDB cùng timestamp và quy tắc xác thực.

- [server/models/User.js](server/models/User.js) lưu thông tin đăng nhập, hồ sơ, token đặt lại mật khẩu, nhà cung cấp OAuth và quyền hạn.
- [server/models/Product.js](server/models/Product.js) chứa dữ liệu danh mục như tên, loại, nhóm, giá, hình ảnh, note, đánh giá và thông tin tồn kho.
- [server/models/Order.js](server/models/Order.js) theo dõi kết quả thanh toán gồm shippingAddress, danh sách items (giá, tên, ảnh), phí, phương thức thanh toán và trạng thái.
- Các mô hình bổ sung Cart, Wishlist, Coupon, Review, Blog, Conversation, Message, Category hỗ trợ báo cáo và cá nhân hóa.

### 2.5 Bộ điều khiển và tuyến

Các file trong [server/controllers/](server/controllers) xuất các hàm REST dùng asyncHandler, ném AppError khi vi phạm và dọn cache khi cần. Thư mục [server/routes/](server/routes) ánh xạ URL, gắn middleware rồi chuyển tiếp tới controller.

Các module trọng tâm:

- [server/controllers/authController.js](server/controllers/authController.js) xử lý đăng ký, đăng nhập, callback Google OAuth, khôi phục mật khẩu bằng OTP, cập nhật hồ sơ và liệt kê người dùng cho admin. Token tạo bởi generateToken, email chào mừng hoặc đặt lại gửi bất đồng bộ qua sendMail.js.
- [server/controllers/productController.js](server/controllers/productController.js) cung cấp CRUD sản phẩm, tìm kiếm với searchProducts (lọc theo từ khóa, danh mục, giá, note, đánh giá, có phân trang và sắp xếp) và truy vấn theo danh mục cho trang chủ. Cache được làm mới sau mỗi thay đổi.
- [server/controllers/orderController.js](server/controllers/orderController.js) xây dựng đơn hàng từ payload giỏ, tạo số đơn tuần tự, tính tổng và phí ship, lưu shippingAddress và cho phép admin đổi trạng thái. Người dùng lấy lịch sử, admin có dashboard phân trang.
- [server/controllers/cartController.js](server/controllers/cartController.js) đồng bộ giỏ của người đăng nhập, xử lý thêm, cập nhật, xóa với xác thực phía máy chủ.
- [server/controllers/paymentController.js](server/controllers/paymentController.js) tích hợp Stripe hoặc MoMo tùy cấu hình để tạo intent, ghi nhận kết quả và cập nhật đơn.
- [server/controllers/chatController.js](server/controllers/chatController.js) quản lý Conversation và Message, phối hợp Socket.IO để đẩy cập nhật theo thời gian thực.
- [server/controllers/aiController.js](server/controllers/aiController.js) thực hiện yêu cầu OpenAI cho gợi ý mùi hương và hỏi đáp, kèm giới hạn tần suất, làm sạch và cache.
- Các controller blog, review, wishlist, coupon và admin summary tuân cùng mẫu: đọc model, xác thực đầu vào và trả JSON kèm thông điệp rõ ràng.

Điểm nhấn tuyến:

- [server/routes/productRoutes.js](server/routes/productRoutes.js) cấu hình endpoint duyệt sản phẩm và bảo vệ thao tác ghi bằng adminOnly.
- [server/routes/orderRoutes.js](server/routes/orderRoutes.js) cho phép khách tạo hoặc xem đơn, đồng thời cấp quyền cập nhật số lượng lớn cho admin.
- [server/routes/adminRoutes.js](server/routes/adminRoutes.js) gộp thống kê dashboard, quản lý đơn, blog và sản phẩm dưới nhánh /api/admin với các lớp bảo vệ.

### 2.6 Dịch vụ và tiện ích

- [server/services/aiRecommendation.service.js](server/services/aiRecommendation.service.js) dựng prompt, kết hợp tín hiệu hồ sơ người dùng với metadata sản phẩm rồi gọi dịch vụ AI.
- [server/utils/sendMail.js](server/utils/sendMail.js) sử dụng Nodemailer gửi email giao dịch như chào mừng, đặt lại mật khẩu và thông báo đơn. Các tham số cấu hình đọc từ biến môi trường SMTP.
- [server/utils/constants.js](server/utils/constants.js) lưu trữ hằng số nghiệp vụ gồm trạng thái đơn, loại voucher, cấu hình phân trang mặc định.
- [server/utils/sanitizer.js](server/utils/sanitizer.js) làm sạch nội dung trước khi lưu tin nhắn hoặc chuyển tiếp tới AI.

## 3. Frontend (client/)

### 3.1 Khung ứng dụng

- [client/src/App.jsx](client/src/App.jsx) cấu hình React Router với các trang tải lười, bao bọc cây component bằng SocketProvider và CartContext, đồng thời chỉ hiển thị Header và Footer ngoài khu vực admin. Suspense sử dụng LoadingFallback trong lúc module đang tải.
- Các điểm vào [client/src/index.jsx](client/src/index.jsx) và [client/src/index.js](client/src/index.js) render ứng dụng, đăng ký service worker và báo cáo web vitals cho môi trường CRA.

### 3.2 Ngữ cảnh và tiện ích cốt lõi

- [client/src/core/context/CartContext.jsx](client/src/core/context/CartContext.jsx) lưu trạng thái giỏ, đồng bộ với local storage hoặc API và cung cấp các hàm thêm, cập nhật số lượng, bật tắt giỏ.
- [client/src/core/context/AuthContext.jsx](client/src/core/context/AuthContext.jsx) (nếu kích hoạt) quản lý dữ liệu đăng nhập và token làm mới. Thành phần bảo vệ như [client/src/features/admin/components/AdminRoute.jsx](client/src/features/admin/components/AdminRoute.jsx) đọc ngữ cảnh này để kiểm soát quyền.
- [client/src/core/utils/api.js](client/src/core/utils/api.js) trả về Axios đã cấu hình với base URL, interceptor gắn token và xử lý lỗi thống nhất. Thành phần gọi api.get hoặc api.post thay vì fetch thuần.
- Bộ trợ giúp thông báo trong [client/src/core/utils/toast.js](client/src/core/utils/toast.js) chuẩn hóa toast thành công hoặc thất bại.

### 3.3 Thành phần giao diện chung

- [client/src/shared/components/Header.jsx](client/src/shared/components/Header.jsx) hiển thị điều hướng, truy cập tài khoản, huy hiệu giỏ và liên kết nhanh tới AI hoặc chat, phản hồi theo trạng thái đăng nhập cũng như điều khiển các ngăn trượt.
- [client/src/shared/components/Footer.jsx](client/src/shared/components/Footer.jsx) trình bày câu chuyện thương hiệu, form đăng ký và liên kết mạng xã hội.
- [client/src/components/AIChatbox.jsx](client/src/components/AIChatbox.jsx) đặt widget AI nổi, quản lý trạng thái hội thoại, đưa ra câu trả lời dự phòng và chuyển tiếp sang Socket.IO khi cần người thật.
- Bộ CSS trong [client/src/assets/styles/](client/src/assets/styles) xác định phong cách thương hiệu gồm lưới, typography và tính đáp ứng. Ví dụ home.css đã được điều chỉnh giảm khoảng cách lưới sản phẩm.

### 3.4 Mô-đun tính năng

Mỗi thư mục trong [client/src/features/](client/src/features) gom logic trang, hook dịch vụ và component theo miền nghiệp vụ.

- Home trong [client/src/features/home/Home.jsx](client/src/features/home/Home.jsx) tải hero, thẻ quảng bá AI và các nhóm sản phẩm. Hàm handleSearch gọi /api/products/search, lưu kết quả và chuyển giữa danh mục gợi ý và lưới lọc.
- Products như [client/src/features/products/pages/ProductPage.jsx](client/src/features/products/pages/ProductPage.jsx) triển khai duyệt catalog với ProductFilters chuyển form thành tham số truy vấn. ProductDetail lấy thông tin sản phẩm, gợi ý liên quan và gửi hành động thêm giỏ qua CartContext.
- Cart và Checkout ([client/src/features/cart/CartPage.jsx](client/src/features/cart/CartPage.jsx), [client/src/features/checkout/CheckoutPage.jsx](client/src/features/checkout/CheckoutPage.jsx)) phản chiếu dữ liệu giỏ từ máy chủ, thu thập địa chỉ và thanh toán, tạo đơn rồi chuyển tới [client/src/features/orders/OrderSuccess.jsx](client/src/features/orders/OrderSuccess.jsx).
- Orders trong [client/src/features/orders/OrderPage.jsx](client/src/features/orders/OrderPage.jsx) truy vấn lịch sử bằng JWT và hiển thị trạng thái khớp enum máy chủ.
- Auth ([client/src/features/auth/AuthPage.jsx](client/src/features/auth/AuthPage.jsx)) chuyển đổi giữa đăng nhập và đăng ký, gọi /api/auth/login hoặc /api/auth/register; luồng quên hoặc đặt lại mật khẩu sử dụng endpoint tương ứng và bật toast phản hồi.
- Admin ([client/src/features/admin/pages/AdminDashboard.jsx](client/src/features/admin/pages/AdminDashboard.jsx)) tổng hợp số liệu doanh thu, biểu đồ và phím tắt quản trị. [client/src/features/admin/pages/AdminOrders.jsx](client/src/features/admin/pages/AdminOrders.jsx) hiển thị danh sách đơn, mở modal chi tiết và gọi PUT /api/admin/orders/:id để đổi trạng thái, đồng thời hiển thị địa chỉ giao hàng và ghi chú.
- Blog trong [client/src/features/blog/pages/](client/src/features/blog/pages) lấy nội dung từ /api/blogs, render an toàn và hỗ trợ lọc danh mục.
- Voucher ([client/src/features/voucher/VoucherHuntPage.jsx](client/src/features/voucher/VoucherHuntPage.jsx)) gamify việc săn mã bằng cách gọi /api/coupons và kiểm tra tiến độ người dùng.
- AI ([client/src/features/ai/AIRecommendation.jsx](client/src/features/ai/AIRecommendation.jsx)) gửi sở thích mùi hương tới /api/ai/recommend, hiển thị đề xuất ưu tiên và gợi ý thêm vào giỏ.
- Chat ([client/src/features/chat/ChatButton.jsx](client/src/features/chat/ChatButton.jsx)) mở giao diện chat, tham gia phòng socket, truyền nhận tin nhắn và rơi về email khi ngoại tuyến.
- Static pages như [client/src/features/static/HowToOrderPage.jsx](client/src/features/static/HowToOrderPage.jsx) chứa nội dung biên tập, tái sử dụng layout và typography chung.

### 3.5 Kiểm thử và công cụ

- [client/src/setupTests.js](client/src/setupTests.js) cấu hình React Testing Library và Jest DOM. Các script trong client/package.json có npm test cho kiểm thử đơn vị và npm run build tạo bundle sản xuất.

## 4. Quy trình nghiệp vụ

### 4.1 Duyệt sản phẩm đến thanh toán

1. Người dùng truy cập Home, có thể lọc bằng ProductFilters; component chuyển dữ liệu form thành truy vấn /api/products/search và cập nhật danh sách filteredProducts.
2. Khi chọn sản phẩm, trang chuyển tới ProductDetail, gọi /api/products/:id và đưa SKU vào CartContext.
3. Giỏ hàng duy trì đồng bộ với máy chủ thông qua /api/cart gắn với người dùng đăng nhập.
4. Checkout thu thập địa chỉ giao, tạo yêu cầu /api/orders, controller ghi đơn trạng thái pending, khởi tạo intent thanh toán rồi điều hướng tới trang xác nhận và làm sạch cache giỏ.

### 4.2 Hỗ trợ thời gian thực

1. SocketProvider kết nối /socket.io bằng JWT lưu trong local storage.
2. AIChatbox xử lý bước tư vấn AI đầu tiên qua /api/ai/chat, đồng thời cho phép nâng cấp sang trò chuyện người thật.
3. Khi người thật tiếp nhận, component phát sự kiện send_message; server lưu, làm sạch nội dung và phát tới phòng admin hoặc người dùng tương ứng để dashboard cập nhật ngay.

### 4.3 Vận hành đơn hàng admin

1. Dashboard admin lấy thống kê từ /api/admin/stats được cấu hình trong adminRoutes.
2. Trang /admin/orders tải từng đơn kèm userId populate; bộ chọn trạng thái gọi PUT /api/admin/orders/:id để cập nhật và dọn cache.
3. Modal chi tiết hiển thị địa chỉ giao, ghi chú và line item hỗ trợ quyết định xử lý.

## 5. Hạ tầng và script build

- [package.json](package.json) ở thư mục gốc cung cấp các script: npm run dev chạy đồng thời client và server, npm run server hoặc npm run client khởi động từng phía, npm run build tạo bundle React, npm run install:all cài phụ thuộc toàn dự án.
- [client/package.json](client/package.json) cấu hình ứng dụng React với script start, build, test và lint.
- [server/package.json](server/package.json) cung cấp npm run dev dùng Nodemon, npm start và các script seed dữ liệu mẫu.

## 6. Nguyên tắc mở rộng an toàn

- Tái sử dụng asyncHandler và AppError khi xây dựng controller mới để đồng bộ xử lý lỗi.
- Gọi clearCacheByPattern mỗi khi dữ liệu phục vụ trang public thay đổi để tránh kết quả cũ.
- Đảm bảo protect và adminOnly được gắn vào mọi endpoint quản trị mới.
- Ở phía client, thêm tuyến bằng React.lazy kết hợp Suspense để tối ưu bundle và luôn dùng instance Axios chung nhằm tự động gắn header xác thực.
- Với Socket.IO, tiếp tục dùng quy ước tên phòng user_id thay vì tạo kênh ngẫu nhiên.

## 7. Bảng tham chiếu nhanh

- API base URL: http://localhost:5000/api
- Client dev URL: http://localhost:3000
- Biến môi trường chính: MONGO_URI, JWT_SECRET, cấu hình SMTP, khóa nhà cung cấp AI nếu sử dụng.
- Trạng thái đơn hàng: pending, shipped, delivered, cancelled.

Tài liệu này cung cấp cái nhìn tổng quan cùng liên kết đến mã nguồn để đội ngũ nắm rõ mục đích, luồng dữ liệu và cách các module phối hợp trong hệ thống ParadisePerfume.
