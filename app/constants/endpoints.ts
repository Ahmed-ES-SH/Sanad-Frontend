export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESET_PASSWORD_SEND: "/api/auth/rest-password/send",
  RESET_PASSWORD_VERIFY: "/api/auth/rest-password/verify",
  RESET_PASSWORD: "/api/auth/rest-password",
  GOOGLE_LOGIN: "/api/auth/google",
  GOOGLE_CALLBACK: "/api/auth/google/callback",
  CURRENT_USER: "/api/auth/current-user",
  LOGOUT: "/api/auth/logout",
} as const;

export const USER_ENDPOINTS = {
  CREATE_USER: "/api/user",
  LIST_USERS: "/api/users",
  GET_USER: (id: string | number) => `/api/user/${id}`,
  UPDATE_USER: (id: string | number) => `/api/user/${id}`,
  DELETE_USER: (id: string | number) => `/api/user/${id}`,
} as const;

export const SERVICES_ENDPOINTS = {
  LIST_PUBLISHED: "/api/services",
  GET_BY_SLUG: (slug: string) => `/api/services/${slug}`,
  ADMIN_LIST: "/api/admin/services",
  ADMIN_CREATE: "/api/admin/services",
  ADMIN_UPDATE: (id: string) => `/api/admin/services/${id}`,
  ADMIN_DELETE: (id: string) => `/api/admin/services/${id}`,
  ADMIN_PUBLISH: (id: string) => `/api/admin/services/${id}/publish`,
  ADMIN_REORDER: "/api/admin/services/reorder",
} as const;

export const PORTFOLIO_ENDPOINTS = {
  LIST_PUBLISHED: "/api/portfolio",
  GET_BY_SLUG: (slug: string) => `/api/portfolio/${slug}`,
  ADMIN_LIST: "/api/admin/portfolio",
  ADMIN_CREATE: "/api/admin/portfolio",
  ADMIN_UPDATE: (id: string) => `/api/admin/portfolio/${id}`,
  ADMIN_DELETE: (id: string) => `/api/admin/portfolio/${id}`,
  ADMIN_PUBLISH: (id: string) => `/api/admin/portfolio/${id}/publish`,
  ADMIN_FEATURE: (id: string) => `/api/admin/portfolio/${id}/feature`,
  ADMIN_REORDER: "/api/admin/portfolio/reorder",
} as const;

export const BLOG_ENDPOINTS = {
  LIST_PUBLISHED: "/api/blog",
  GET_BY_SLUG: (slug: string) => `/api/blog/${slug}`,
  ADMIN_LIST: "/api/admin/blog",
  ADMIN_CREATE: "/api/admin/blog",
  ADMIN_UPDATE: (id: string) => `/api/admin/blog/${id}`,
  ADMIN_DELETE: (id: string) => `/api/admin/blog/${id}`,
  ADMIN_PUBLISH: (id: string) => `/api/admin/blog/${id}/publish`,
} as const;

export const CONTACT_ENDPOINTS = {
  SUBMIT: "/api/contact",
  ADMIN_LIST: "/api/admin/contact",
  ADMIN_GET: (id: string) => `/api/admin/contact/${id}`,
  ADMIN_MARK_READ: (id: string) => `/api/admin/contact/${id}/read`,
  ADMIN_MARK_REPLIED: (id: string) => `/api/admin/contact/${id}/reply`,
  ADMIN_DELETE: (id: string) => `/api/admin/contact/${id}`,
} as const;

export const PAYMENTS_ENDPOINTS = {
  CREATE_INTENT: "/api/payments/create-intent",
  ADMIN_LIST: "/api/admin/payments",
  ADMIN_GET: (id: string) => `/api/admin/payments/${id}`,
  ADMIN_REFUND: (id: string) => `/api/admin/payments/${id}/refund`,
} as const;

export const STRIPE_ENDPOINTS = {
  WEBHOOK: "/api/stripe/webhook",
} as const;

export const ALL_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  SERVICES: SERVICES_ENDPOINTS,
  PORTFOLIO: PORTFOLIO_ENDPOINTS,
  BLOG: BLOG_ENDPOINTS,
  CONTACT: CONTACT_ENDPOINTS,
  PAYMENTS: PAYMENTS_ENDPOINTS,
  STRIPE: STRIPE_ENDPOINTS,
} as const;
