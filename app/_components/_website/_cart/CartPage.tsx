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
import { useCart } from "@/app/context/CartContext";
import { FiLoader } from "react-icons/fi";
import { PaymentModal } from "../../_payment/PaymentModal";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useCartToast } from "@/app/hooks/useCartToast";
import { calculateCartTotals } from "@/app/helpers/_cart/calculateCartTotals.helper";
import { createPaymentIntent } from "@/app/helpers/_cart/createPaymentIntent.helper";

export function CartPage() {
  const { local } = useVariables();
  const { isAuthenticated } = useAuth();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  const { items, isLoading, removeItem, addItem, clearCart } = useCart();

  // Checkout states
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState("");

  // Undo toast state management
  const {
    undoToast,
    isRemoving,
    handleRemove,
    handleUndo,
    handleDismissToast,
  } = useCartToast(removeItem, addItem);

  // Calculate totals
  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      toast.error(t.loginRequired);
      return;
    }

    setIsProcessingCheckout(true);
    try {
      const { clientSecret, paymentId } = await createPaymentIntent(
        totals.total,
        items,
      );
      setClientSecret(clientSecret);
      setPaymentId(paymentId);
      setIsPaymentModalOpen(true);
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error(t.checkoutError);
      }
    } finally {
      setIsProcessingCheckout(false);
    }
  }, [items, totals.total, isAuthenticated, t.checkoutError]);

  const onSuccess = useCallback(() => {
    toast.success(t.paymentSuccess);
    setIsPaymentModalOpen(false);
    clearCart();
  }, [clearCart, t.paymentSuccess]);

  // Check if cart is empty
  const isEmpty = items.length === 0;

  if (isLoading && items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        role="status"
        aria-label={t.loadingBrief}
      >
        <FiLoader className="text-4xl text-primary animate-spin" />
        <p className="text-surface-500">{t.loadingBrief}</p>
      </div>
    );
  }

  return (
    <>
      {isEmpty ? (
        <EmptyCartState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-20 lg:pb-0">
          {/* Left Column: Your Brief */}
          <div className="lg:col-span-8 lg:max-h-[80dvh] lg:overflow-y-auto space-y-8 scrollbar-hide">
            <div className="space-y-4 md:space-y-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
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
              subtotal={totals.subtotal}
              technicalFee={totals.technicalFee}
              vat={totals.vat}
              total={totals.total}
              onCheckout={handleCheckout}
              isProcessing={isProcessingCheckout}
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      {!isEmpty && (
        <div className="lg:hidden bg-white/60 backdrop-blur-sm fixed bottom-0 inset-x-0 z-40 border-t border-gray-300 p-4 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-(--on-surface-variant) font-medium">
                {t.total}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatPrice(totals.total, local)}
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
        amount={totals.total}
        paymentId={paymentId}
        onSuccess={onSuccess}
        onError={(error) => {
          toast.error(error || t.paymentFailed);
        }}
      />
    </>
  );
}
