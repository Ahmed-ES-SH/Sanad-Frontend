"use client";

import Image from "next/image";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { formatPrice } from "@/app/helpers/formatPrice";
import { MdSecurity, MdDeleteOutline, MdBookmarkBorder } from "react-icons/md";

interface CartItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  type: "project" | "service";
  tags?: string[];
  category?: string;
  onRemove?: (item: CartItemProps) => void;
  onSaveForLater?: (item: CartItemProps) => void;
  isRemoving?: boolean;
}

export function CartItem({
  item,
  onRemove,
  onSaveForLater,
  isRemoving,
}: {
  item: CartItemProps;
  onRemove?: (item: CartItemProps) => void;
  onSaveForLater?: (item: CartItemProps) => void;
  isRemoving?: boolean;
}) {
  const { local } = useVariables();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  return (
    <article
      className={`group surface-card overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${
        isRemoving ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
      } ${isRtl ? (isRemoving ? "opacity-0 -translate-x-4" : "") : ""}`}
      style={{
        transitionProperty: "opacity, transform, border-color, box-shadow",
      }}
    >
      <div
        className="flex flex-col md:flex-row gap-0 rtl:md:flex-row-reverse"
      >
        {/* Visual indicator strip — type-based */}
        <div
          className={`w-full md:w-1 h-1 md:h-auto shrink-0 ${
            item.type === "project"
              ? "bg-(--gradient-primary)"
              : "bg-accent-cyan"
          }`}
        />

        <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-5 p-4 md:p-6 ">
          {/* Thumbnail / Icon Container */}
          <div className="flex items-start justify-between md:block shrink-0">
            {item.type === "project" ? (
              <div className="w-24 md:w-44 h-16 md:h-28 rounded-lg overflow-hidden relative bg-(--surface-container)">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-(--surface-container) border border-(--outline-variant)/30 flex items-center justify-center"
              >
                <MdSecurity className="text-accent-cyan text-2xl md:text-3xl" />
              </div>
            )}

            {/* Price on mobile (next to thumb) */}
            <div className="md:hidden text-end">
              <span className="text-base font-bold text-primary tabular-nums block">
                {formatPrice(item.price, local)}
              </span>
              <p className="text-[10px] text-(--on-surface-variant) mt-0.5">
                {t.investment}
              </p>
            </div>
          </div>

          {/* Brief content */}
          <div className="flex-1 min-w-0">
            {/* Header: title + investment (hidden on mobile, shown on md+) */}
            <div className="flex items-start justify-between gap-4 mb-3 ">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.type === "project"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent-cyan/10 text-accent-cyan"
                    }`}
                  >
                    {item.type === "project" ? t.scope : t.deliverables}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-(--on-surface) leading-tight">
                  {item.title}
                </h3>
                <p className="text-(--on-surface-variant) text-xs md:text-sm mt-1 line-clamp-2 md:line-clamp-none">
                  {item.description}
                </p>
              </div>
              <div
                className="hidden md:block text-end shrink-0"
              >
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatPrice(item.price, local)}
                </span>
                <p className="text-[10px] text-(--on-surface-variant) mt-0.5 uppercase tracking-wide">
                  {t.investment}
                </p>
              </div>
            </div>

            {/* Tags / category */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.type === "project" && item.tags && (
                <>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[9px] md:text-[10px] font-medium bg-(--surface-container-high) text-(--on-surface-variant) rounded border border-(--outline-variant)/20"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
              {item.type === "service" && item.category && (
                <span className="px-2.5 py-0.5 text-[10px] md:text-xs font-medium bg-(--surface-container-highest) text-(--on-surface-variant) rounded-full border border-(--outline-variant)/20">
                  {item.category}
                </span>
              )}
            </div>

            {/* Actions */}
            <div
              className="flex items-center gap-2 md:gap-4 mt-4 pt-4 border-t border-(--outline-variant)/20"
            >
              <button
                onClick={() => onRemove?.(item)}
                disabled={isRemoving}
                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 py-2 md:p-0 rounded-lg md:rounded-none bg-(--surface-container) md:bg-transparent text-xs font-bold text-(--on-surface-variant) transition-all active:scale-95 disabled:opacity-50 hover:text-red-500 hover:bg-red-50 md:hover:bg-transparent"
              >
                <MdDeleteOutline className="text-lg md:text-base" />
                {t.remove}
              </button>
              <button
                onClick={() => onSaveForLater?.(item)}
                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 py-2 md:p-0 rounded-lg md:rounded-none bg-(--surface-container) md:bg-transparent text-xs font-bold text-(--on-surface-variant) hover:text-primary transition-all active:scale-95 hover:bg-primary/5 md:hover:bg-transparent"
              >
                <MdBookmarkBorder className="text-lg md:text-base" />
                {t.saveForLater}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
