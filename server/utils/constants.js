// API Response Messages
export const MESSAGES = {
  // Success
  SUCCESS: "Thành công",
  CREATED: "Tạo thành công",
  UPDATED: "Cập nhật thành công",
  DELETED: "Xóa thành công",

  // Errors
  ERROR: "Có lỗi xảy ra",
  NOT_FOUND: "Không tìm thấy",
  UNAUTHORIZED: "Chưa đăng nhập",
  FORBIDDEN: "Không có quyền truy cập",
  BAD_REQUEST: "Yêu cầu không hợp lệ",

  // Auth
  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  EMAIL_EXISTS: "Email đã được sử dụng",

  // Products
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  PRODUCT_CREATED: "Thêm sản phẩm thành công",
  PRODUCT_UPDATED: "Cập nhật sản phẩm thành công",
  PRODUCT_DELETED: "Xóa sản phẩm thành công",

  // Cart
  CART_UPDATED: "Cập nhật giỏ hàng thành công",
  CART_CLEARED: "Đã xóa giỏ hàng",
  ITEM_ADDED: "Đã thêm vào giỏ hàng",
  ITEM_REMOVED: "Đã xóa khỏi giỏ hàng",

  // Orders
  ORDER_CREATED: "Đặt hàng thành công",
  ORDER_UPDATED: "Cập nhật đơn hàng thành công",
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng",
};

// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Product Categories
export const CATEGORIES = {
  MEN: "Men",
  WOMEN: "Women",
  MINI: "Mini",
  GIFTSET: "Giftset",
};

// User Roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Sort Options
export const SORT_OPTIONS = {
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  RATING_DESC: "rating_desc",
  NEWEST: "newest",
  OLDEST: "oldest",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: "cod",
  VNPAY: "vnpay",
  MOMO: "momo",
  CREDIT_CARD: "credit_card",
};
