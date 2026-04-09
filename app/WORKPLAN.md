# Orders Integration Work Plan

## Overview

This document outlines the comprehensive work plan for integrating the Service Orders API into the frontend project, based on the `ORDERS&UPDATEORDERS.md` specification.

---

## Project Structure Analysis

### Existing Infrastructure

| Component | Location | Purpose |
|-----------|----------|---------|
| API Client | `lib/api-client.ts` | HTTP requests with auth handling |
| Server Actions | `app/actions/` | Server-side data operations |
| Endpoints | `app/constants/endpoints.ts` | API endpoint definitions |
| Types | `app/types/service.ts` | TypeScript interfaces |
| Auth | `lib/session.ts` | JWT token management |

### Pattern to Follow

Based on `servicesActions.ts`, the project uses:
- Server Actions (`'use server'`)
- TanStack Query with `revalidateTag` for cache invalidation
- Protected/Public request helpers
- Typed responses with error handling

---

## Integration Work Plan

### Phase 1: Types & Endpoints Configuration

#### 1.1 Create Order Types (`app/types/order.ts`)

```typescript
// Define all order-related interfaces
// - Order, OrderUpdate, Payment, OrderStatus enum
// - CreateOrderResponse, PaymentIntentResponse
// - OrderListResponse, PaginatedResponse
```

#### 1.2 Update Endpoints (`app/constants/endpoints.ts`)

```typescript
export const ORDERS_ENDPOINTS = {
  // User endpoints
  CREATE: (serviceId: string, notes?: string) => `/api/orders?serviceId=${serviceId}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`,
  LIST: (page?: number, limit?: number) => `/api/orders?${new URLSearchParams({ page: String(page || 1), limit: String(limit || 10) }).toString()}`,
  GET: (id: string) => `/api/orders/${id}`,
  PAY: (id: string) => `/api/orders/${id}/pay`,
  
  // Admin endpoints
  ADMIN_LIST: (page?: number, limit?: number, status?: string, userId?: number, serviceId?: string) => {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status) params.set('status', status);
    if (userId) params.set('userId', String(userId));
    if (serviceId) params.set('serviceId', serviceId);
    return `/api/admin/orders?${params.toString()}`;
  },
  ADMIN_GET: (id: string) => `/api/admin/orders/${id}`,
  ADMIN_UPDATE_STATUS: (id: string) => `/api/admin/orders/${id}/status`,
  ADMIN_ADD_UPDATE: (id: string) => `/api/admin/orders/${id}/updates`,
} as const;
```

**Priority**: HIGH  
**Estimated Time**: 2 hours

---

### Phase 2: Server Actions (User-Facing)

#### 2.1 Create Order Action (`app/actions/ordersActions.ts`)

| Function | Description |
|----------|-------------|
| `createOrder(serviceId, notes?)` | POST /orders - Create new order |
| `getMyOrders(page?, limit?)` | GET /orders - List user's orders |
| `getOrderById(id)` | GET /orders/:id - Get single order |
| `initiatePayment(orderId)` | POST /orders/:id/pay - Start Stripe payment |

**Priority**: HIGH  
**Estimated Time**: 4 hours

#### 2.2 Implementation Details

```typescript
// Key considerations:
// - Use protectedRequest for all endpoints
// - Return typed responses matching API spec
// - Handle ApiError and throw user-friendly errors
// - Include revalidation tags for cache management
```

---

### Phase 3: Server Actions (Admin-Facing)

#### 3.1 Admin Order Actions

| Function | Description |
|----------|-------------|
| `getAllOrders(params)` | GET /admin/orders - List with filters |
| `getAdminOrderById(id)` | GET /admin/orders/:id - Full details |
| `updateOrderStatus(id, status)` | PATCH /admin/orders/:id/status |
| `addOrderUpdate(id, content)` | POST /admin/orders/:id/updates |

**Priority**: HIGH  
**Estimated Time**: 4 hours

#### 3.2 Admin Authorization

- Verify admin role before allowing access
- Use existing auth middleware pattern
- Return proper 403 errors for non-admin users

---

### Phase 4: Client-Side Integration (TanStack Query)

#### 4.1 Order Hooks (`hooks/useOrders.ts`)

```typescript
// User hooks
export function useCreateOrder()
export function useMyOrders(page, limit)
export function useOrderById(id)
export function useInitiatePayment(orderId)

// Admin hooks
export function useAllOrders(filters)
export function useAdminOrderById(id)
export function useUpdateOrderStatus()
export function useAddOrderUpdate()
```

#### 4.2 Query Keys Convention

```typescript
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  myOrders: () => [...orderKeys.all, 'my'] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
};
```

**Priority**: HIGH  
**Estimated Time**: 6 hours

---

### Phase 5: Stripe Payment Integration

#### 5.1 Stripe Setup

| Task | Description |
|------|-------------|
| Install Stripe | `npm install @stripe/stripe-js @stripe/react-stripe-js` |
| Environment Variables | Add STRIPE_PUBLISHABLE_KEY to .env |
| Stripe Provider | Wrap app with StripeElements provider |

#### 5.2 Payment Flow Implementation

```
User clicks "Pay" → initiatePayment() → Get clientSecret
  → Show Stripe Elements → User enters card
  → stripe.confirmCardPayment()
  → Handle success/error
  → Poll or redirect to order status
```

#### 5.3 Components Needed

| Component | Purpose |
|-----------|---------|
| `PaymentForm` | Stripe card element wrapper |
| `PaymentModal` | Modal for payment process |
| `PaymentSuccess` | Success confirmation |
| `PaymentError` | Error display with retry |

**Priority**: HIGH  
**Estimated Time**: 8 hours

---

### Phase 6: UI Components (User Dashboard)

#### 6.1 Orders List Page

- Display user's orders with status badges
- Pagination controls
- Filter by status
- Quick actions (View, Pay)

#### 6.2 Order Detail Page

- Full order information
- Service details
- Timeline/updates feed
- Payment button (if pending)
- Status indicator

#### 6.3 Create Order Flow

- Service selection → Order form → Confirmation
- Notes input field
- Price display
- Submit handler

**Priority**: MEDIUM  
**Estimated Time**: 12 hours

---

### Phase 7: UI Components (Admin Dashboard)

#### 7.1 Orders Management Page

- Table with all orders
- Filter by: status, user, service, date
- Search functionality
- Bulk actions (optional)
- Export capability (optional)

#### 7.2 Order Detail Modal/Page

- Full order details
- User information
- Service information
- Payment details
- Timeline with add-update form
- Status change dropdown

**Priority**: MEDIUM  
**Estimated Time**: 10 hours

---

### Phase 8: Error Handling & Validation

#### 8.1 Error Types to Handle

| Status Code | Scenario | User Message |
|-------------|----------|--------------|
| 400 | Invalid order status | "Cannot process this order right now" |
| 400 | Payment already initiated | "Payment already in progress" |
| 403 | Not order owner | "You don't have permission to view this order" |
| 404 | Order not found | "Order not found" |
| 401 | Unauthorized | "Please log in to continue" |

#### 8.2 Validation

- Service ID must be UUID
- Notes max 1000 characters
- Status must be valid enum value

**Priority**: MEDIUM  
**Estimated Time**: 4 hours

---

### Phase 9: Internationalization (i18n)

#### 9.1 Translation Keys Needed

```json
{
  "Orders": {
    "title": "My Orders",
    "create": "Create Order",
    "status": {
      "pending": "Pending",
      "paid": "Paid",
      "in_progress": "In Progress",
      "completed": "Completed",
      "cancelled": "Cancelled"
    },
    "actions": {
      "pay": "Pay Now",
      "view": "View Details",
      "cancel": "Cancel"
    }
  }
}
```

**Priority**: LOW  
**Estimated Time**: 3 hours

---

### Phase 10: Testing & Polish

#### 10.1 Testing Checklist

- [ ] Unit tests for server actions
- [ ] Integration tests for payment flow
- [ ] UI component tests
- [ ] Error state tests
- [ ] Loading state tests

#### 10.2 Polish Items

- Loading skeletons
- Empty states
- Responsive design
- Animations (Framer Motion)

**Priority**: LOW  
**Estimated Time**: 6 hours

---

## Summary Timeline

| Phase | Task | Estimated Hours |
|-------|------|-----------------|
| 1 | Types & Endpoints | 2 |
| 2 | User Server Actions | 4 |
| 3 | Admin Server Actions | 4 |
| 4 | TanStack Query Hooks | 6 |
| 5 | Stripe Integration | 8 |
| 6 | User UI Components | 12 |
| 7 | Admin UI Components | 10 |
| 8 | Error Handling | 4 |
| 9 | i18n | 3 |
| 10 | Testing & Polish | 6 |
| **TOTAL** | | **59 hours** |

---

## Dependencies

### NPM Packages

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^latest",
    "@stripe/react-stripe-js": "^latest"
  }
}
```

### Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## File Structure

```
app/
├── actions/
│   └── ordersActions.ts        # Server actions (NEW)
├── constants/
│   └── endpoints.ts           # UPDATE - add ORDERS_ENDPOINTS
├── types/
│   └── order.ts                # NEW - order types
hooks/
└── useOrders.ts                # NEW - TanStack Query hooks

# UI Components (existing pattern)
app/_components/_dashboard/
├── OrdersPage/
│   ├── OrdersList.tsx
│   ├── OrderDetail.tsx
│   └── CreateOrderForm.tsx
└── AdminOrdersPage/
    ├── OrdersTable.tsx
    └── OrderManagement.tsx

# Stripe Components
components/
├── payment/
│   ├── PaymentForm.tsx
│   ├── PaymentModal.tsx
│   └── PaymentSuccess.tsx
```

---

## Implementation Order

1. **Phase 1**: Types + Endpoints (Foundation)
2. **Phase 2-3**: Server Actions (Backend communication)
3. **Phase 4**: Hooks (Data layer)
4. **Phase 5**: Stripe Integration (Payment)
5. **Phase 6-7**: UI Components (User & Admin)
6. **Phase 8-10**: Polish & Testing

---

## Notes

- All API calls use JWT in `Authorization: Bearer <token>` header
- Admin endpoints require admin role check on backend
- Stripe client secret is used with Stripe.js for payment confirmation
- Timeline updates show order progress history
- Status changes trigger automatic timeline entries

---

*Generated: April 2026*  
*Source: ORDERS&UPDATEORDERS.md*