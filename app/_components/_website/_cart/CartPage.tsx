"use client";
import { useState, useCallback, useMemo } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { formatPrice } from "@/app/helpers/formatPrice";
import { CartItem } from "./CartItem";
import { TrustIndicators } from "./TrustIndicators";
import { CheckoutSection } from "./CheckoutSection";
import { EmptyCartState } from "./EmptyCartState";
import { MdClose } from "react-icons/md";
import { useCart, CartItem as CartItemType } from "@/app/context/CartContext";
import { FiLoader } from "react-icons/fi";
import { PaymentModal } from "../../_payment/PaymentModal";
import { toast } from "sonner";
import { paymentsApi } from "@/lib/api/payments/client";
import { useAuth } from "@/app/context/AuthContext";

interface UndoToast {
  item: CartItemType;
  action: "remove" | "save";
}

export function CartPage() {
  const { local } = useVariables();
  const { isAuthenticated } = useAuth();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  const { items, isLoading, removeItem } = useCart();
  const [undoToast, setUndoToast] = useState<UndoToast | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Checkout states
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");

  // Calculate totals (prefer context values if available)
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const technicalFee = 0;
  const vat = subtotal * 0.05; // 5%
  const total = subtotal + vat;

  // Handle remove with visual feedback
  const handleRemove = useCallback(
    async (item: CartItemType) => {
      setIsRemoving(item.id);

      try {
        // Show undo toast (optimistic)
        setUndoToast({
          item,
          action: "remove",
        });

        await removeItem(item.id);

        setIsRemoving(null);

        // Auto-dismiss undo toast after 5 seconds
        setTimeout(() => {
          setUndoToast((current) =>
            current?.item.id === item.id ? null : current,
          );
        }, 5000);
      } catch (error) {
        console.error("Failed to remove item:", error);
        setIsRemoving(null);
        setUndoToast(null);
      }
    },
    [removeItem],
  );

  // Handle undo action (re-add item)
  const { addItem } = useCart();
  const handleUndo = useCallback(async () => {
    if (undoToast) {
      const { item } = undoToast;
      try {
        await addItem(item.serviceId, item.quantity);
        setUndoToast(null);
      } catch (error) {
        console.error("Failed to undo remove:", error);
      }
    }
  }, [undoToast, addItem]);

  // Handle save for later (simulate for now as context doesn't have it)
  const handleSaveForLater = useCallback(
    async (item: CartItemType) => {
      await handleRemove(item);
      setUndoToast({
        item,
        action: "save",
      });
    },
    [handleRemove],
  );

  const handleDismissToast = useCallback(() => {
    setUndoToast(null);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      toast.error(
        local === "en"
          ? "You need to login to checkout. Please login or register."
          : "يجب عليك تسجيل الدخول لإتمام عملية الشراء. يرجى تسجيل الدخول أو إنشاء حساب.",
      );
      return;
    }

    setIsProcessingCheckout(true);
    try {
      // Build a description from items
      const description = `Sanad Services: ${items.map((i) => i.title).join(", ")}`;

      const response = await paymentsApi.createPaymentIntent({
        amount: total,
        currency: "usd",
        description: description.substring(0, 255), // Stripe limit
      });

      const { clientSecret, paymentId } = response.data;
      setClientSecret(clientSecret);
      setOrderId(paymentId);
      setIsPaymentModalOpen(true);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        local === "en"
          ? "Failed to initialize checkout. Please try again."
          : "فشل في بدء عملية الدفع. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsProcessingCheckout(false);
    }
  }, [items, total, local]);

  // Check if cart is empty
  const isEmpty = items.length === 0;

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiLoader className="text-4xl text-primary animate-spin" />
        <p className="text-surface-500">
          {local === "en" ? "Loading your brief..." : "جاري تحميل موجزك..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {isEmpty ? (
        <EmptyCartState />
      ) : (
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-20 lg:pb-0`}
        >
          {/* Left Column: Your Brief */}
          <div className="lg:col-span-8 lg:max-h-[80dvh] lg:overflow-y-auto space-y-8 scrollbar-hide">
            {/* Brief Items */}
            <div className="space-y-4 md:space-y-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item as any}
                  onRemove={() => handleRemove(item)}
                  isRemoving={isRemoving === item.id}
                />
              ))}
            </div>

            <div className="hidden lg:block">
              <TrustIndicators />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <CheckoutSection
              subtotal={subtotal}
              technicalFee={technicalFee}
              vat={vat}
              total={total}
              onCheckout={handleCheckout}
              isProcessing={isProcessingCheckout}
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      {!isEmpty && (
        <div className="lg:hidden bg-white/60 backdrop-blur-sm fixed bottom-0 inset-x-0 z-40  border-t border-gray-300 p-4 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-(--on-surface-variant) font-medium">
                {t.total}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatPrice(total, local)}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
              className="flex-1 max-w-[200px] py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {isProcessingCheckout ? (
                <FiLoader className="animate-spin text-xl" />
              ) : (
                t.secureCheckout
              )}
            </button>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {undoToast && (
        <div
          className={`fixed bottom-24 lg:bottom-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-stone-900 text-white animate-in slide-in-from-bottom-4 duration-300 ${
            isRtl ? "left-6" : "right-6"
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="text-sm flex-1">
            {undoToast.action === "remove"
              ? t.undoRemoveMessage
              : t.undoSaveMessage}
          </span>
          <button
            onClick={handleUndo}
            className="text-sm font-bold text-primary hover:underline shrink-0"
          >
            {t.undo}
          </button>
          <button
            onClick={handleDismissToast}
            className="text-stone-400 hover:text-white transition-colors shrink-0"
            aria-label={t.dismiss}
          >
            <MdClose className="text-base" />
          </button>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        clientSecret={clientSecret}
        amount={total}
        orderId={orderId}
        onSuccess={() => {
          toast.success(
            local === "en" ? "Payment successful!" : "تم الدفع بنجاح!",
          );
          setIsPaymentModalOpen(false);
          // Optional: clear cart here if needed
        }}
        onError={(error) => {
          toast.error(
            error || (local === "en" ? "Payment failed" : "فشل الدفع"),
          );
        }}
      />
    </>
  );
}
