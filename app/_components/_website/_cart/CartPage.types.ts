import type { CartItem as CartItemType } from "@/app/context/CartContext";

/**
 * Represents an undo toast for cart actions (remove/save for later).
 */
export interface UndoToast {
  item: CartItemType;
  action: "remove" | "save";
}

/**
 * Calculated totals for the cart order summary.
 */
export interface CartTotals {
  subtotal: number;
  technicalFee: number;
  vat: number;
  total: number;
}

/**
 * Props for the PaymentModal success/error callbacks.
 */
export interface PaymentCallbacks {
  onSuccess: () => void;
  onError: (error: string) => void;
}