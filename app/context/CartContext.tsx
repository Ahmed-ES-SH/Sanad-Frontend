'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  getCartAction as getCart,
  addToCartAction as addToCart,
  updateCartItemAction as updateCartItem,
  removeFromCartAction as removeFromCart,
  clearCartAction as clearCart,
  mergeCartAction as mergeCart,
} from '@/app/actions/cartActions';
import type {
  CartDto,
  CartItemDto,
  GuestCartItem,
} from '@/lib/api/cart';

// ============================================================================
// Cart Context Types
// ============================================================================

export interface CartItem extends CartItemDto {
  // Backward compatibility fields for existing components
  name?: string;
  price?: number;
  image?: string;
  title?: string;
  description?: string;
}

export interface Cart extends CartDto {
  items: CartItem[];
}

interface CartContextType {
  // State
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Computed values
  totalItems: number;
  totalAmount: number;

  // Cart operations (backend-synced)
  fetchCart: () => Promise<void>;
  addItem: (serviceId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  incrementItemQuantity: (itemId: string) => Promise<void>;
  decrementItemQuantity: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Guest cart operations
  mergeGuestCartAfterLogin: () => Promise<void>;

  // Utility
  isServiceInCart: (serviceId: string) => boolean;
  getItemByServiceId: (serviceId: string) => CartItem | undefined;
  getItemQuantity: (serviceId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

// ============================================================================
// Local Storage Helpers for Guest Cart
// ============================================================================

const GUEST_CART_STORAGE_KEY = 'sanad_guest_cart';

function loadGuestCartFromStorage(): GuestCartItem[] {
  try {
    const cartData = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error loading guest cart from storage:', error);
    return [];
  }
}

function saveGuestCartToStorage(items: GuestCartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving guest cart to storage:', error);
  }
}

function clearGuestCartFromStorage() {
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing guest cart from storage:', error);
  }
}

// ============================================================================
// Cart Provider Component
// ============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Items array for convenience
  const items = cart?.items || [];
  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const cartData = await getCart();
      setCart(cartData as Cart);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on mount and when auth status changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart (syncs with backend)
  const addItem = useCallback(async (serviceId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      // Guest mode: add to local storage
      const guestCart = loadGuestCartFromStorage();
      const existingIndex = guestCart.findIndex(
        (item) => item.serviceId === serviceId
      );

      if (existingIndex >= 0) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push({ serviceId, quantity });
      }

      saveGuestCartToStorage(guestCart);
      
      // Update local state for UI feedback
      const guestTotalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      setCart({
        id: '',
        userId: 0,
        items: guestCart.map((item) => ({
          id: `guest-${item.serviceId}`,
          cartId: '',
          serviceId: item.serviceId,
          serviceTitle: '',
          serviceSlug: '',
          serviceIconUrl: null,
          quantity: item.quantity,
          unitPrice: 0,
          subtotal: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Backward compatibility
          title: '',
          name: '',
          price: 0,
          image: '',
          description: '',
        })),
        totalItems: guestTotalItems,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Cart);
      
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await addToCart(serviceId, quantity);
      setCart(updatedCart as Cart);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to add item to cart';
      setError(errorMessage);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    if (itemId.startsWith('guest-')) {
      // Guest mode: remove from local storage
      const serviceId = itemId.replace('guest-', '');
      const guestCart = loadGuestCartFromStorage().filter(
        (item) => item.serviceId !== serviceId
      );
      saveGuestCartToStorage(guestCart);

      const guestTotalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      setCart((prev) => prev ? {
        ...prev,
        items: prev.items.filter((item) => item.serviceId !== serviceId),
        totalItems: guestTotalItems,
      } : null);
      
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await removeFromCart(itemId);
      setCart(updatedCart as Cart);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to remove item from cart';
      setError(errorMessage);
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 0) return;

    if (quantity === 0) {
      await removeItem(itemId);
      return;
    }

    if (itemId.startsWith('guest-')) {
      // Guest mode: update local storage
      const serviceId = itemId.replace('guest-', '');
      const guestCart = loadGuestCartFromStorage();
      const itemIndex = guestCart.findIndex(
        (item) => item.serviceId === serviceId
      );

      if (itemIndex >= 0) {
        guestCart[itemIndex].quantity = quantity;
        saveGuestCartToStorage(guestCart);

        const guestTotalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
        setCart((prev) => prev ? {
          ...prev,
          items: prev.items.map((item) =>
            item.serviceId === serviceId ? { ...item, quantity } : item
          ),
          totalItems: guestTotalItems,
        } : null);
      }
      
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await updateCartItem(itemId, quantity);
      setCart(updatedCart as Cart);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to update cart item';
      setError(errorMessage);
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [removeItem]);

  // Increment item quantity
  const incrementItemQuantity = useCallback(async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    // Enforce max quantity of 99
    if (item.quantity >= 99) return;

    await updateItemQuantity(itemId, item.quantity + 1);
  }, [items, updateItemQuantity]);

  // Decrement item quantity
  const decrementItemQuantity = useCallback(async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (item.quantity <= 1) {
      await removeItem(itemId);
      return;
    }

    await updateItemQuantity(itemId, item.quantity - 1);
  }, [items, updateItemQuantity, removeItem]);

  // Clear entire cart
  const clearCartFn = useCallback(async () => {
    if (!isAuthenticated) {
      // Guest mode: clear local storage
      clearGuestCartFromStorage();
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await clearCart();
      setCart(null);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to clear cart';
      setError(errorMessage);
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Merge guest cart after login
  const mergeGuestCartAfterLogin = useCallback(async () => {
    const guestCart = loadGuestCartFromStorage();

    if (guestCart.length === 0) {
      // No guest items, just fetch user cart
      await fetchCart();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await mergeCart(guestCart);
      setCart(result.cart as Cart);
      
      // Clear guest cart from local storage
      clearGuestCartFromStorage();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to merge guest cart';
      setError(errorMessage);
      console.error('Error merging guest cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  // Check if a service is in cart
  const isServiceInCart = useCallback(
    (serviceId: string) => items.some((item) => item.serviceId === serviceId),
    [items]
  );

  // Get item by service ID
  const getItemByServiceId = useCallback(
    (serviceId: string) => items.find((item) => item.serviceId === serviceId),
    [items]
  );

  // Get item quantity by service ID
  const getItemQuantity = useCallback(
    (serviceId: string) => {
      const item = items.find((i) => i.serviceId === serviceId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        isLoading,
        error,
        totalItems,
        totalAmount,
        fetchCart,
        addItem,
        removeItem,
        updateItemQuantity,
        incrementItemQuantity,
        decrementItemQuantity,
        clearCart: clearCartFn,
        mergeGuestCartAfterLogin,
        isServiceInCart,
        getItemByServiceId,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================================================
// Cart Hook
// ============================================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
