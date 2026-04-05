"use client";
import React from "react";

interface Category {
  en: string;
  ar: string;
}

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
  local: "en" | "ar";
}

export default function FilterBar({
  categories,
  selected,
  onSelect,
  local,
}: Props) {
  const isRTL = local === "ar";

  return (
    <div
      className="sticky z-30 border-b"
      style={{
        top: 0,
        backgroundColor: "rgba(250, 250, 249, 0.95)",
        borderColor: "var(--surface-200)",
        backdropFilter: "none",
      }}
    >
      <div className="c-container px-4">
        <div
          className="flex gap-2 py-3 overflow-x-auto scrollbar-hide"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {categories.map((cat) => {
            const label = cat[local];
            const isActive = selected === label;

            return (
              <button
                key={label}
                onClick={() => onSelect(label)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  minHeight: "44px",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "var(--surface-600)",
                  border: `1px solid ${isActive ? "var(--primary)" : "var(--surface-200)"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--surface-100)";
                    e.currentTarget.style.borderColor = "var(--surface-300)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--surface-200)";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
