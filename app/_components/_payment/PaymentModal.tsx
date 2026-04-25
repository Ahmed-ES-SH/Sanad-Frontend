"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PaymentForm } from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { pollPaymentStatus } from "@/lib/api/payments/poll-payment-status";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  amount: number;
  currency?: string;
  paymentId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type CheckoutUiState =
  | "collecting"
  | "pending"
  | "verification_delayed"
  | "auth_required"
  | "succeeded"
  | "failed";

export function PaymentModal({
  isOpen,
  onClose,
  clientSecret,
  amount,
  currency = "USD",
  paymentId,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutUiState>("collecting");
  const pollCleanupRef = useRef<(() => void) | null>(null);

  const handleError = (error: string) => {
    setCheckoutState("failed");
    onError?.(error);
  };

  const stopPolling = useCallback(() => {
    if (pollCleanupRef.current) {
      pollCleanupRef.current();
      pollCleanupRef.current = null;
    }
  }, []);

  const handleModalClose = useCallback(() => {
    stopPolling();
    onClose();
  }, [onClose, stopPolling]);

  const startWebhookStatusPolling = useCallback(() => {
    stopPolling();
    setCheckoutState("pending");

    pollCleanupRef.current = pollPaymentStatus({
      paymentId,
      onStatusChange: (status) => {
        if (status === "succeeded") {
          setCheckoutState("succeeded");
          stopPolling();
          onSuccess?.();
          return;
        }

        if (status === "failed") {
          setCheckoutState("failed");
          stopPolling();
          onError?.("Payment failed. Please try again.");
        }
      },
      onError: (error) => {
        const statusCode =
          (
            error as Error & {
              statusCode?: number;
              response?: { status?: number };
            }
          ).statusCode ??
          (
            error as Error & {
              statusCode?: number;
              response?: { status?: number };
            }
          ).response?.status;
        if (statusCode === 401) {
          setCheckoutState("auth_required");
          stopPolling();
          onError?.("Session expired while verifying payment. Please sign in again.");
          return;
        }
        onError?.("Unable to verify payment status. Retrying...");
      },
      onTimeout: () => {
        setCheckoutState("verification_delayed");
        onError?.("Payment verification is delayed. You can keep waiting or retry.");
      },
    });
  }, [paymentId, stopPolling, onSuccess, onError]);

  const handleConfirmed = (paymentIntentStatus: string | null) => {
    if (paymentIntentStatus === "requires_payment_method") {
      setCheckoutState("failed");
      onError?.("Payment was not completed. Please check your method and retry.");
      return;
    }
    startWebhookStatusPolling();
  };

  // Close modal when opened externally
  useEffect(() => {
    if (!isOpen) {
      stopPolling();
      setCheckoutState("collecting");
    }
  }, [isOpen, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

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
            onClick={handleModalClose}
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
                  <FaLock className="text-xs" /> Payment #{paymentId.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={handleModalClose}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto md:px-8">
              {checkoutState === "succeeded" ? (
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
                    Your payment of {formattedAmount} has been confirmed.
                  </p>
                  <button
                    onClick={handleModalClose}
                    className="mt-8 w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-surface-sm"
                  >
                    Done
                  </button>
                </motion.div>
              ) : checkoutState === "failed" ? (
                <div className="text-center py-10 space-y-4">
                  <h3 className="text-2xl font-bold text-stone-900 font-display">
                    Payment Failed
                  </h3>
                  <p className="text-stone-500 font-medium">
                    We couldn&apos;t confirm your payment. You can retry now.
                  </p>
                  <button
                    onClick={() => setCheckoutState("collecting")}
                    className="mt-2 w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-surface-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : checkoutState === "auth_required" ? (
                <div className="text-center py-10 space-y-4">
                  <h3 className="text-2xl font-bold text-stone-900 font-display">
                    Sign In Required
                  </h3>
                  <p className="text-stone-500 font-medium">
                    Your session expired while verifying payment status.
                  </p>
                  <button
                    onClick={handleModalClose}
                    className="mt-2 w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-surface-sm"
                  >
                    Close
                  </button>
                </div>
              ) : checkoutState === "verification_delayed" ? (
                <div className="text-center py-10 space-y-4">
                  <h3 className="text-2xl font-bold text-stone-900 font-display">
                    Payment Still Processing
                  </h3>
                  <p className="text-stone-500 font-medium">
                    Verification is delayed. You can continue waiting safely.
                  </p>
                  <button
                    onClick={startWebhookStatusPolling}
                    className="mt-2 w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-surface-sm"
                  >
                    Check Again
                  </button>
                </div>
              ) : checkoutState === "pending" ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-stone-900 mb-2 font-display">
                    Payment Processing
                  </h3>
                  <p className="text-stone-500 font-medium">
                    Waiting for secure confirmation from our payment system...
                  </p>
                </div>
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
                    {stripePromise ? (
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
                          onConfirmed={handleConfirmed}
                          onError={handleError}
                        />
                      </Elements>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-stone-500 font-medium">
                          Stripe configuration is missing. Please contact support.
                        </p>
                      </div>
                    )}
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
