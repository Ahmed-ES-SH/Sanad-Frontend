'use server';

import { revalidatePath } from 'next/cache';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  type CartDto,
  type AddToCartDto,
  type UpdateCartItemDto,
  type MergeCartDto,
  type MergeCartResponse,
  type GuestCartItem,
} from '@/lib/api/cart';

// ============================================================================
// Cart Server Actions
// ============================================================================

/**
 * Fetch the authenticated user's cart
 */
export async function getCartAction(): Promise<CartDto> {
  try {
    const cart = await getCart();
    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

/**
 * Add a service to the cart
 */
export async function addToCartAction(
  serviceId: string,
  quantity: number = 1
): Promise<CartDto> {
  try {
    const data: AddToCartDto = { serviceId, quantity };
    const cart = await addToCart(data);
    revalidatePath('/cart');
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartItemAction(
  itemId: string,
  quantity: number
): Promise<CartDto> {
  try {
    const data: UpdateCartItemDto = { quantity };
    const cart = await updateCartItem(itemId, data);
    revalidatePath('/cart');
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove a specific item from the cart
 */
export async function removeFromCartAction(itemId: string): Promise<CartDto> {
  try {
    const cart = await removeFromCart(itemId);
    revalidatePath('/cart');
    return cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Clear all items from the cart
 */
export async function clearCartAction(): Promise<{ message: string }> {
  try {
    const result = await clearCart();
    revalidatePath('/cart');
    return result;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

/**
 * Merge guest cart with authenticated user's cart
 * Call this after login to consolidate guest items
 */
export async function mergeCartAction(
  guestItems: GuestCartItem[]
): Promise<MergeCartResponse> {
  try {
    const data: MergeCartDto = { items: guestItems };
    const result = await mergeCart(data);
    revalidatePath('/cart');
    return result;
  } catch (error) {
    console.error('Error merging cart:', error);
    throw error;
  }
}
