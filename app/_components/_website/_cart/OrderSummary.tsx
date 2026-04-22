"use client";

import { useState } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { formatPrice } from "@/app/helpers/formatPrice";
import {
  MdInfoOutline,
  MdLocalOffer,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";

interface OrderSummaryProps {
  subtotal: number;
  technicalFee: number;
  vat: number;
  total: number;
}

export function OrderSummary({
  subtotal,
  technicalFee,
  vat,
  total,
}: OrderSummaryProps) {
  const { local } = useVariables();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  const [promoCode, setPromoCode] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "applied" | "invalid"
  >("idle");

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    // Placeholder: in production this would validate against an API
    if (promoCode.trim().toUpperCase() === "SANAD10") {
      setPromoStatus("applied");
    } else {
      setPromoStatus("invalid");
    }
  };

  return (
    <div className="surface-card overflow-hidden border-t-[3px] border-t-primary shadow-sm">
      {/* Receipt header */}
      <div className="px-5 py-4 border-b border-(--outline-variant)/10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-(--on-surface-variant)">
          {t.total}
        </h2>
      </div>

      {/* Receipt line items */}
      <div className="px-5 py-5">
        <dl className="space-y-3.5">
          <div className="flex justify-between items-baseline text-sm">
            <dt className="text-(--on-surface-variant)">{t.subtotal}</dt>
            <dd className="font-semibold text-(--on-surface) tabular-nums">
              {formatPrice(subtotal, local)}
            </dd>
          </div>
          <div className="flex justify-between items-baseline text-sm group/tooltip relative">
            <dt className="text-(--on-surface-variant) flex items-center gap-1.5">
              {t.technicalFee}
              <MdInfoOutline
                className="text-xs text-(--on-surface-variant)/40 cursor-help hover:text-primary transition-colors"
                title={t.technicalFeeTooltip}
              />
            </dt>
            <dd className="font-semibold text-(--on-surface) tabular-nums">
              $0.00
            </dd>
          </div>
          <div className="flex justify-between items-baseline text-sm pb-1">
            <dt className="text-(--on-surface-variant)">{t.vat}</dt>
            <dd className="font-semibold text-(--on-surface) tabular-nums">
              {formatPrice(vat, local)}
            </dd>
          </div>
        </dl>

        {/* Divider */}
        <div className="my-5 border-t-2 border-(--outline-variant)/10 border-dashed" />

        {/* Total */}
        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-(--on-surface) pb-1">
            {t.total}
          </span>
          <div className="text-end">
            <span className="text-2xl font-black text-primary tabular-nums block leading-none tracking-tight">
              {formatPrice(total, local)}
            </span>
            <p className="text-[10px] text-(--on-surface-variant) font-bold mt-1 uppercase tracking-wide">
              {t.includesTaxes}
            </p>
          </div>
        </div>
      </div>

      {/* Promo code section */}
      <div className="border-t border-(--outline-variant)/10 bg-(--surface-container-low) px-5 py-4">
        {!promoExpanded ? (
          <button
            onClick={() => setPromoExpanded(true)}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
          >
            <MdLocalOffer className="text-sm" />
            {t.promoCode}
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoStatus("idle");
                }}
                placeholder={t.promoCodePlaceholder}
                className="flex-1 px-3 py-2 text-xs bg-(--surface-container-lowest) border border-(--outline-variant)/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-(--on-surface) placeholder:text-(--on-surface-variant)/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyPromo();
                }}
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10"
              >
                {t.applyPromo}
              </button>
            </div>
            {promoStatus === "applied" && (
              <p className="text-xs text-accent-emerald font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                <MdCheckCircle className="text-sm" />
                {t.promoApplied}
              </p>
            )}
            {promoStatus === "invalid" && (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                <MdErrorOutline className="text-sm" />
                {t.promoInvalid}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
