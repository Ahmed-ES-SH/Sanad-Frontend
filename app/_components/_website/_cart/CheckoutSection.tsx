"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PremiumBanner } from "./PremiumBanner";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";

interface CheckoutSectionProps {
  subtotal: number;
  technicalFee: number;
  vat: number;
  total: number;
}

export function CheckoutSection({
  subtotal,
  technicalFee,
  vat,
  total,
}: CheckoutSectionProps) {
  const { local } = useVariables();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  return (
    <div className="space-y-4">
      <OrderSummary
        subtotal={subtotal}
        technicalFee={technicalFee}
        vat={vat}
        total={total}
      />

      <div className="surface-card p-5 md:p-6 shadow-sm">
        <PaymentMethodSelector />

        {/* CTA button — solid gradient, no glow, no scale animation on layout */}
        <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <MdLockOutline className="text-xl" />
          {t.secureCheckout}
        </button>

        <div className="mt-5 flex flex-col items-center gap-4">
          <p className="text-[11px] text-center text-(--on-surface-variant) leading-relaxed px-4 max-w-xs font-medium">
            {t.secureCheckoutDesc}
          </p>
          {/* Real payment brand icons */}
          <div
            className="flex gap-4 items-center text-(--on-surface-variant)/50"
          >
            <FaCcVisa className="h-5 w-auto" />
            <FaCcMastercard className="h-5 w-auto" />
            <FaBuildingColumns className="h-4 w-auto" />
          </div>
        </div>
      </div>

      <PremiumBanner />
    </div>
  );
}
