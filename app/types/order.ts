// ============================================================================
// ORDER STATUS - Allowed values for order lifecycle
// ============================================================================

export type OrderStatus =
  | "pending"
  | "paid"
  | "in_progress"
  | "completed"
  | "cancelled";

// ============================================================================
// ORDER TIMELINE - Track order progress updates
// ============================================================================

export interface OrderUpdate {
  id: string;
  orderId: string;
  author: "system" | "admin";
  content: string;
  createdAt: string;
}

// ============================================================================
// SERVICE REFERENCE - Embeded service data in orders
// ============================================================================

export interface OrderService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  coverImageUrl: string;
  basePrice: number;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// ORDER ENTITY - Core order data structure (User-facing)
// ============================================================================

export interface Order {
  id: string;
  userId: number;
  serviceId: string;
  service: OrderService;
  paymentId: string | null;
  status: OrderStatus;
  amount: number;
  currency: string;
  notes: string | null;
  updates: OrderUpdate[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// USER REFERENCE - Embedded user data in admin orders
// ============================================================================

export interface OrderUser {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  role: "admin" | "user";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PAYMENT DETAILS - Payment information for orders (Admin view)
// ============================================================================

export interface OrderPayment {
  id: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  description: string;
  metadata: {
    orderId: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ORDER ENTITY - Extended order data (Admin-facing)
// ============================================================================

export interface AdminOrder extends Omit<Order, "service"> {
  user: OrderUser;
  service: OrderService & {
    longDescription?: string;
  };
  payment?: OrderPayment | null;
}

// ============================================================================
// PAGINATION META - Standard pagination response
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// API RESPONSES - Typed responses from backend endpoints
// ============================================================================

// Create Order Response (201 Created)
export interface CreateOrderResponse extends Order {}

// Initiate Payment Response (201 Created)
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
  stripePaymentIntentId: string;
}

// List Orders Response (200 OK)
export interface OrderListResponse {
  data: Order[];
  meta: PaginationMeta;
}

// List Admin Orders Response (200 OK)
export interface AdminOrderListResponse {
  data: AdminOrder[];
  meta: PaginationMeta;
}

// Single Order Response (200 OK)
export interface OrderDetailResponse extends Order {}

// Single Admin Order Response (200 OK)
export interface AdminOrderDetailResponse extends AdminOrder {}

// Add Timeline Update Response (201 Created)
export interface AddOrderUpdateResponse extends OrderUpdate {}

// Update Order Status Response (200 OK)
export interface UpdateOrderStatusResponse extends Omit<AdminOrder, "payment"> {}

// ============================================================================
// QUERY PARAMETERS - API request parameters
// ============================================================================

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface AdminOrderQueryParams extends OrderQueryParams {
  status?: OrderStatus;
  userId?: number;
  serviceId?: string;
}

// ============================================================================
// FORM DATA - Client-side form state
// ============================================================================

export interface CreateOrderFormData {
  serviceId: string;
  notes?: string;
}

export interface UpdateOrderStatusFormData {
  status: OrderStatus;
}

export interface AddOrderUpdateFormData {
  content: string;
}

// ============================================================================
// ACTION RESULTS - Server action return types
// ============================================================================

export interface OrderActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface InitiatePaymentResult {
  clientSecret: string;
  paymentId: string;
  stripePaymentIntentId: string;
}