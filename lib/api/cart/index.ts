import { protectedRequest, publicRequest, ApiError } from '@/lib/api-client';

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItemDto {
  id: string;
  cartId: string;
  serviceId: string;
  serviceTitle: string;
  serviceSlug: string;
  serviceIconUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartDto {
  id: string;
  userId: number;
  items: CartItemDto[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  serviceId: string;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface MergeCartDto {
  items: GuestCartItem[];
}

export interface GuestCartItem {
  serviceId: string;
  quantity: number;
}

export interface MergeCartResponse {
  success: boolean;
  message: string;
  cart: CartDto;
  failedItems: FailedCartItem[];
}

export interface FailedCartItem {
  serviceId: string;
  reason: string;
}

// ============================================================================
// Cart API Functions
// ============================================================================

/**
 * Fetch the authenticated user's cart
 * Creates a new empty cart if one doesn't exist
 */
export async function getCart(): Promise<CartDto> {
  try {
    return await protectedRequest<CartDto>('/api/cart', 'GET');
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      // User not authenticated, return empty cart structure
      return createEmptyCart();
    }
    throw error;
  }
}

/**
 * Add a service to the cart
 * If the service already exists, increments the quantity
 */
export async function addToCart(
  data: AddToCartDto
): Promise<CartDto> {
  return await protectedRequest<CartDto>('/api/cart/items', 'POST', data as unknown as Record<string, unknown>);
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartItem(
  itemId: string,
  data: UpdateCartItemDto
): Promise<CartDto> {
  return await protectedRequest<CartDto>(`/api/cart/items/${itemId}`, 'PUT', data as unknown as Record<string, unknown>);
}

/**
 * Remove a specific item from the cart
 */
export async function removeFromCart(itemId: string): Promise<CartDto> {
  return await protectedRequest<CartDto>(`/api/cart/items/${itemId}`, 'DELETE');
}

/**
 * Clear all items from the cart
 */
export async function clearCart(): Promise<{ message: string }> {
  return await protectedRequest<{ message: string }>('/api/cart', 'DELETE');
}

/**
 * Merge guest cart items with the authenticated user's cart
 * Call this after login to consolidate guest items
 */
export async function mergeCart(
  data: MergeCartDto
): Promise<MergeCartResponse> {
  return await protectedRequest<MergeCartResponse>('/api/cart/merge', 'POST', data as unknown as Record<string, unknown>);
}

// ============================================================================
// Helper Functions
// ============================================================================

function createEmptyCart(): CartDto {
  return {
    id: '',
    userId: 0,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
