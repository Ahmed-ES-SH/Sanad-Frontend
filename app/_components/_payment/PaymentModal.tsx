"use client";

import { useState, useEffect } from "react";
import { PaymentForm } from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { FaLock } from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  amount: number;
  currency?: string;
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  clientSecret,
  amount,
  currency = "USD",
  orderId,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccess = () => {
    setPaymentSuccess(true);
    onSuccess?.();
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  // Close modal when opened externally
  useEffect(() => {
    if (!isOpen) {
      setPaymentSuccess(false);
    }
  }, [isOpen]);

  // Format amount for display (amount is in dollars, not cents as per API spec)
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0  z-99999 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-white  w-full max-w-2xl mx-auto bg-surface-card-bg border border-surface-card-border rounded-2xl shadow-surface-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-surface-card-border flex items-center justify-between bg-surface-50">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">
                  Secure Checkout
                </h2>
                <p className="text-sm font-medium text-stone-500 mt-1 flex items-center gap-1.5">
                  <FaLock className="text-xs" /> Order #{orderId.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto md:px-8">
              {paymentSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                    <svg
                      className="w-10 h-10 text-emerald-600 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2 font-display">
                    Payment Successful
                  </h3>
                  <p className="text-stone-500 font-medium">
                    Your payment of {formattedAmount} has been processed.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-8 w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-surface-sm"
                  >
                    Done
                  </button>
                </motion.div>
              ) : clientSecret ? (
                <div className="space-y-6">
                  {/* Amount Summary */}
                  <div className="p-5 bg-gradient-to-br from-surface-50 to-surface-100 rounded-xl border border-surface-card-border flex items-center justify-between">
                    <span className="text-stone-600 font-medium">
                      Total Amount Due
                    </span>
                    <span className="text-3xl font-bold text-primary font-display">
                      {formattedAmount}
                    </span>
                  </div>

                  {/* Stripe Form */}
                  <div className="min-h-[250px]">
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#f97316", // Sanad primary orange
                            colorBackground: "#ffffff",
                            colorText: "#1c1917", // stone-900
                            colorDanger: "#ef4444",
                            fontFamily: "Inter, system-ui, sans-serif",
                            spacingUnit: "4px",
                            borderRadius: "8px",
                          },
                          rules: {
                            ".Input": {
                              border: "1px solid #e7e5e4", // stone-200
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            },
                            ".Input:focus": {
                              border: "1px solid #f97316",
                              boxShadow: "0 0 0 1px #f97316",
                            },
                            ".Label": {
                              color: "#57534e", // stone-500
                              fontWeight: "500",
                            },
                          },
                        },
                      }}
                    >
                      <PaymentForm
                        clientSecret={clientSecret}
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />
                    </Elements>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-stone-500 font-medium animate-pulse">
                    Initializing secure payment...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
