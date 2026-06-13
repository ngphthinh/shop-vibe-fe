export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  CHANGE_PASSWORD: "/auth/change-password",

  // Products
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  PRODUCTS_SEARCH: "/products/search",
  PRODUCT_IMAGE: (id: number) => `products/${id}/images`,

  // Orders
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string | number) => `/orders/${id}`,
  ADMIN_ORDERS: "orders/admin/all",
  CANCEL_ORDER: (id: string | number) => `/orders/${id}/cancel`,
  UPDATE_ORDER_STATUS: (id: string | number) => `/orders/admin/${id}/status`,
  ADMIN_ORDER_DETAIL: (id: string | number) => `/orders/admin/${id}`,

  // Cart
  CART: "/cart",
  CART_ITEMS: "/cart/items",
  CART_CLEAR: "/cart/clear",

  // Categories
  CATEGORIES: "/categories",
  // Reviews
  REVIEWS: (id: string | number) => `/reviews/products/${id}`,
  REVIEW_DETAIL: (id: string | number) => `/reviews/${id}`,

  // Users
  PROFILE: "/users/me",
  ADMIN_USERS: "/users/admin/all",
  ADMIN_USERS_LOCK: (id: number) => `/users/admin/${id}/lock`,
  ADMIN_USERS_UNLOCK: (id: number) => `/users/admin/${id}/unlock`,

  // Admin Statistics
  OVERVIEW: "/admin/statistics/overview",
  REVENUE: "/admin/statistics/revenue",
  TOP_PRODUCTS: "/admin/statistics/top-products",
  TOP_CUSTOMERS: "/admin/statistics/top-customers",
};
