"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiLoader, FiCreditCard } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCreateOrder, useInitiatePayment } from "@/lib/hooks/orders";
import { Service } from "@/app/types/service";

// Format currency
function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
}

interface ServiceOrderCTAProps {
  service?: Service | null;
  local: "en" | "ar";
  translations: Record<string, string>;
}

export default function ServiceOrderCTA({ service, local, translations }: ServiceOrderCTAProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const createOrderHook = useCreateOrder();
  const initiatePaymentHook = useInitiatePayment();

  // Reset states when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setOrderSuccess(false);
      setOrderId(null);
      setPaymentClientSecret(null);
      setPaymentError(null);
      setNotes("");
    }
  }, [isModalOpen]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsSubmitting(true);
    setPaymentError(null);

    // Step 1: Create order
    const orderResult = await createOrderHook.createOrder(
      service.id,
      notes.trim() || undefined
    );

    if (!orderResult.success || !orderResult.data) {
      setIsSubmitting(false);
      setPaymentError(orderResult.message || "Failed to create order");
      return;
    }

    // Order created successfully - now initiate payment
    const createdOrderId = orderResult.data.id;
    setOrderId(createdOrderId);

    // Step 2: Initiate Stripe payment
    const paymentResult = await initiatePaymentHook.initiatePayment(createdOrderId);

    setIsSubmitting(false);

    if (!paymentResult.success || !paymentResult.data) {
      setPaymentError(paymentResult.message || "Failed to initiate payment");
      return;
    }

    // Payment initiated - get client secret
    setPaymentClientSecret(paymentResult.data.clientSecret);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  // No service available
  if (!service) {
    return null;
  }

  return (
    <section id="order-section" className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-surface-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-amber/10" />
      
      <div className="relative c-container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-primary to-accent-amber" />
            <span className="caption-xs font-semibold text-primary uppercase tracking-wider">
              {translations.orderService}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-primary to-accent-amber" />
          </div>
          <h2 className="display-sm md:display-md text-white font-display mb-4">
            {local === "en" ? "Ready to Get Started?" : "هل أنت مستعد للبدء؟"}
          </h2>
          <p className="body-lg text-surface-400 max-w-2xl mx-auto">
            {local === "en" 
              ? "Order now and take your business to the next level with our professional services."
              : "اطلب الآن وامنح نفسك竞争优势 من خلال خدماتنا الاحترافية."}
          </p>
        </motion.div>

        {/* Simple Order Button - No Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-display rounded-xl hover:bg-surface-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <FiCreditCard className="text-xl" />
            <span className="text-lg">{local === "en" ? "Order Now" : "اطلب الآن"}</span>
            <span className="ml-2 px-3 py-1 bg-primary/10 rounded-lg text-sm">
              {formatCurrency(Number(service.basePrice))}
            </span>
          </button>
        </motion.div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="surface-card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <div>
                  <h3 className="heading-md text-surface-900 font-display">
                    {local === "en" ? "Order Service" : "طلب الخدمة"}
                  </h3>
                  <p className="body-sm text-primary mt-1">
                    {service.title} — {formatCurrency(Number(service.basePrice))}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors disabled:opacity-50"
                >
                  <FiX className="text-surface-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Order Created - Show Payment */}
                {orderSuccess || paymentClientSecret ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                    >
                      <FiCheck className="text-4xl text-green-600" />
                    </motion.div>
                    <h3 className="heading-lg text-surface-900 font-display mb-2">
                      {local === "en" ? "Order Confirmed!" : "تم تأكيد الطلب!"}
                    </h3>
                    <p className="body-lg text-surface-500 mb-6">
                      {local === "en" 
                        ? `Order #${orderId?.slice(0, 8)} has been created successfully.`
                        : `تم إنشاء الطلب #${orderId?.slice(0, 8)} بنجاح.`}
                    </p>
                    <button
                      onClick={handleClose}
                      className="surface-btn-primary w-full py-4"
                    >
                      {local === "en" ? "Done" : "تم"}
                    </button>
                  </div>
                ) : (
                  /* Order Form */
                  <form onSubmit={handleOrderSubmit} className="space-y-5">
                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Order Summary" : "ملخص الطلب"}
                      </label>
                      <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-surface-900 font-medium">{service.title}</span>
                          <span className="text-primary font-semibold">{formatCurrency(Number(service.basePrice))}</span>
                        </div>
                        <p className="text-sm text-surface-500">{service.shortDescription}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Notes (Optional)" : "ملاحظات (اختياري)"}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className="surface-input w-full resize-none"
                        placeholder={local === "en" 
                          ? "Tell us about your project requirements..." 
                          : "أخبرنا عن متطلبات مشروعك..."}
                      />
                      <p className="text-xs text-surface-400 mt-1 text-right">
                        {notes.length}/1000
                      </p>
                    </div>

                    {paymentError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{paymentError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !service}
                      className="surface-btn-primary w-full py-4 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>{local === "en" ? "Processing..." : "جاري المعالجة..."}</span>
                        </>
                      ) : (
                        <>
                          <FiCreditCard />
                          <span>{local === "en" ? "Pay Now" : "ادفع الآن"} — {formatCurrency(Number(service.basePrice))}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}