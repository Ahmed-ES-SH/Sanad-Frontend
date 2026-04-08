"use client";

import { useState, useCallback } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { formatPrice } from "@/app/helpers/formatPrice";
import { CartItem } from "./CartItem";
import { TrustIndicators } from "./TrustIndicators";
import { CheckoutSection } from "./CheckoutSection";
import { EmptyCartState } from "./EmptyCartState";
import { MdClose } from "react-icons/md";

interface CartItemType {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  type: "project" | "service";
  tags?: string[];
  category?: string;
}

// Mock data - in production this would come from cart store/API
const initialCartItems: CartItemType[] = [
  {
    id: "1",
    title: "E-commerce Platform Refactor",
    description: "Performance optimization for high-traffic retail.",
    price: 4500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOi9__kW5JIEvYErPT4iAuLdSQrsMKhveIs4Gi2SpUiW8v4oB4RUgWAniJxrgzW-HJOq2AHJ0MyIbrj1dUDfBNLQAnKtj102JtJX6qR1UMc0AcO92jv6HGEUsVFGycKtxOT7jyYjBRUdx3uVRxURzNOF5t61RO08SMEepDgmPKYC0l89P7yWF8tcL1X5v8pHDLvGXMOc3BG6KGb1iLFRTZ6D8QZWaEqSZefm_lbP8UsytwlE_epMdrVuB9z64Y25hCk_h7275PoQxn",
    type: "project",
    tags: ["Next.js", "Tailwind", "GraphQL"],
  },
  {
    id: "2",
    title: "Security Penetration Test",
    description: "Advanced vulnerability assessment and reporting.",
    price: 1200,
    type: "service",
    category: "Cyber Security",
  },
];

interface UndoToast {
  item: CartItemType;
  action: "remove" | "save";
}

export function CartPage() {
  const { local } = useVariables();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);
  const [undoToast, setUndoToast] = useState<UndoToast | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const technicalFee = subtotal * 0.025; // 2.5%
  const vat = subtotal * 0.05; // 5%
  const total = subtotal + technicalFee + vat;

  // Handle remove with undo functionality
  const handleRemove = useCallback((item: CartItemType) => {
    setIsRemoving(item.id);

    // Simulate brief delay for visual feedback
    setTimeout(() => {
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));

      // Show undo toast
      setUndoToast({
        item,
        action: "remove",
      });

      // Auto-dismiss undo toast after 5 seconds
      setTimeout(() => {
        setUndoToast((current) =>
          current?.item.id === item.id ? null : current,
        );
      }, 5000);
    }, 300);
  }, []);

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (undoToast) {
      setCartItems((prev) =>
        [...prev, undoToast.item].sort((a, b) => a.id.localeCompare(b.id)),
      );
      setUndoToast(null);
    }
  }, [undoToast]);

  // Handle save for later
  const handleSaveForLater = useCallback((item: CartItemType) => {
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));

    // Show toast
    setUndoToast({
      item,
      action: "save",
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setUndoToast((current) =>
        current?.item.id === item.id ? null : current,
      );
    }, 5000);
  }, []);

  const handleDismissToast = useCallback(() => {
    setUndoToast(null);
  }, []);

  // Check if cart is empty
  const isEmpty = cartItems.length === 0;

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
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onSaveForLater={handleSaveForLater}
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
            <button className="flex-1 max-w-[200px] py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {t.secureCheckout}
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
    </>
  );
}
