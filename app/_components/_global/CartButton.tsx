"use client";

import { GrCart } from "react-icons/gr";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useVariables } from "@/app/context/VariablesContext";

export default function CartButton() {
  const { items, removeItem, clearCart, totalItems, totalAmount } = useCart();
  const [open, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { local } = useVariables();
  const isRtl = local === "ar";

  // Use backend cart items directly
  const displayItems = items;
  const isEmpty = items.length === 0;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handleClear = () => {
    clearCart();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
        aria-label="Toggle Cart"
        aria-expanded={open}
      >
        <GrCart className="text-primary size-6" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-full mt-3 w-[300px] sm:w-96 surface-card overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl z-50 border border-gray-100 ${
              isRtl ? "right-[-120px] sm:right-0" : "right-[-60px] sm:right-0"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b border-gray-100 flex justify-between items-center bg-white ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <h3 className="font-semibold text-(--on-surface) text-base">
                {isRtl
                  ? `عربة التسوق (${totalItems})`
                  : `Cart (${totalItems})`}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="max-h-[50vh] overflow-y-auto bg-white custom-scrollbar">
              {isEmpty ? (
                <div className="p-8 pb-10 text-center flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <GrCart className="size-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">
                    {isRtl ? "عربة التسوق فارغة" : "Your cart is empty"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {displayItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 group ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      {/* Image / Icon */}
                      {item.serviceIconUrl ? (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-200/50">
                          <Image
                            src={item.serviceIconUrl}
                            alt={item.serviceTitle || "Cart item"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-primary/5 shrink-0 flex items-center justify-center text-primary/40 font-bold border border-primary/10">
                          {(item.serviceTitle?.charAt(0) || "?").toUpperCase()}
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`flex-1 min-w-0 flex flex-col justify-center ${isRtl ? "text-right" : "text-left"}`}
                      >
                        <h4 className="text-sm font-semibold text-(--on-surface) truncate">
                          {item.serviceTitle}
                        </h4>

                        <div
                          className={`flex justify-between items-center mt-2.5 ${isRtl ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-sm font-bold text-primary">
                            ${item.unitPrice.toLocaleString()} × {item.quantity}
                          </span>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className={`text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer ${isRtl ? "flex-row-reverse" : ""}`}
                            aria-label="Remove item"
                          >
                            <MdDeleteOutline size={16} />
                            <span className="hidden sm:inline">
                              {isRtl ? "إزالة" : "Remove"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <div
                  className={`flex justify-between items-center mb-4 ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <span className="font-semibold text-gray-600 text-sm">
                    {isRtl ? "الإجمالي" : "Total"}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
                <div
                  className={`flex gap-3 ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-600 transition-colors focus:ring-2 focus:ring-gray-200 outline-none cursor-pointer"
                  >
                    {isRtl ? "إفراغ العربة" : "Clear Cart"}
                  </button>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary/30 outline-none text-center shadow-md shadow-primary/20 block"
                  >
                    {isRtl ? "إتمام الطلب" : "Checkout"}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
