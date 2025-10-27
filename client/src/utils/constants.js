// Product Categories
export const CATEGORIES = {
  MEN: "Men",
  WOMEN: "Women",
  MINI: "Mini",
  GIFTSET: "Giftset",
};

export const CATEGORY_LABELS = {
  [CATEGORIES.MEN]: "Nước hoa Nam",
  [CATEGORIES.WOMEN]: "Nước hoa Nữ",
  [CATEGORIES.MINI]: "Mini Size",
  [CATEGORIES.GIFTSET]: "Giftset",
};

// Sort Options
export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "rating_desc", label: "Đánh giá cao nhất" },
];

// Perfume Notes
export const PERFUME_NOTES = [
  "Citrus",
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Fruity",
  "Aquatic",
  "Spicy",
  "Sweet",
  "Powdery",
];

// Navigation Menu
export const NAV_MENU = [
  { path: "/", label: "TRANG CHỦ" },
  { path: "/men", label: "NƯỚC HOA NAM" },
  { path: "/women", label: "NƯỚC HOA NỮ" },
  { path: "/mini", label: "NƯỚC HOA MINI" },
  { path: "/giftset", label: "GIFTSET" },
  { path: "/about", label: "ABOUT PARADISE" },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Chờ xử lý",
  [ORDER_STATUS.PROCESSING]: "Đang xử lý",
  [ORDER_STATUS.SHIPPED]: "Đang giao hàng",
  [ORDER_STATUS.DELIVERED]: "Đã giao hàng",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: "cod",
  VNPAY: "vnpay",
  MOMO: "momo",
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: "Thanh toán khi nhận hàng",
  [PAYMENT_METHODS.VNPAY]: "VNPay",
  [PAYMENT_METHODS.MOMO]: "MoMo",
};

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  ITEMS_PER_PAGE: [12, 24, 48],
};

// Price Range
export const PRICE_RANGES = [
  { min: 0, max: 500000, label: "Dưới 500K" },
  { min: 500000, max: 1000000, label: "500K - 1 triệu" },
  { min: 1000000, max: 2000000, label: "1 - 2 triệu" },
  { min: 2000000, max: 5000000, label: "2 - 5 triệu" },
  { min: 5000000, max: null, label: "Trên 5 triệu" },
];

// Rating Stars
export const RATINGS = [5, 4, 3, 2, 1];

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // Products
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCTS_SEARCH: "/products/search",
  PRODUCTS_CATEGORY: (category) => `/products/category/${category}`,

  // Cart
  CART: "/cart",
  CART_ADD: "/cart/add",
  CART_UPDATE: "/cart/update",
  CART_REMOVE: "/cart/remove",

  // Orders
  ORDERS: "/orders",
  ORDER_DETAIL: (id) => `/orders/${id}`,

  // Admin
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
};
