"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
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
  const { addItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = async () => {
    if (!service) return;

    setIsSubmitting(true);
    try {
      await addItem(service.id, 1, {
        serviceTitle: service.title,
        unitPrice: Number(service.basePrice),
        serviceIconUrl: service.coverImageUrl || "",
        description: service.shortDescription || ""
      });
      
      // Navigate to cart page
      router.push(`/${local}/cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsSubmitting(false);
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
              {translations.orderService || (local === "en" ? "Order Service" : "طلب الخدمة")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-primary to-accent-amber" />
          </div>
          <h2 className="display-sm md:display-md text-white font-display mb-4">
            {local === "en" ? "Ready to Get Started?" : "هل أنت مستعد للبدء؟"}
          </h2>
          <p className="body-lg text-surface-400 max-w-2xl mx-auto">
            {local === "en" 
              ? "Add this service to your brief and take your business to the next level."
              : "أضف هذه الخدمة إلى موجزك وارتقِ بعملك إلى المستوى التالي."}
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
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-display rounded-xl hover:bg-surface-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <FiLoader className="text-xl animate-spin" />
            ) : (
              <FiShoppingCart className="text-xl" />
            )}
            <span className="text-lg">
              {isSubmitting 
                ? (local === "en" ? "Adding..." : "جاري الإضافة...") 
                : (local === "en" ? "Order Now" : "اطلب الآن")}
            </span>
            <span className="ml-2 px-3 py-1 bg-primary/10 rounded-lg text-sm">
              {formatCurrency(Number(service.basePrice))}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}