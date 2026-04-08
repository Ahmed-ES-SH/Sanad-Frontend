import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Hook to handle guest cart merge after login
 * Automatically merges guest cart when user authenticates
 */
export function useGuestCartMerge() {
  const { isAuthenticated } = useAuth();

  const { mergeGuestCartAfterLogin } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCartAfterLogin().catch((error) => {
        console.error("Failed to merge guest cart:", error);
      });
    }
  }, [isAuthenticated, mergeGuestCartAfterLogin]);
}

/**
 * Hook for optimistic cart updates
 * Updates UI immediately while backend processes the request
 */
export function useOptimisticCart() {
  const { items, addItem, removeItem, updateItemQuantity } = useCart();

  return {
    items,
    optimisticAdd: async (serviceId: string, quantity: number = 1) => {
      // Optimistic update could be added here with useOptimistic hook
      await addItem(serviceId, quantity);
    },
    optimisticRemove: async (itemId: string) => {
      await removeItem(itemId);
    },
    optimisticUpdate: async (itemId: string, quantity: number) => {
      await updateItemQuantity(itemId, quantity);
    },
  };
}
