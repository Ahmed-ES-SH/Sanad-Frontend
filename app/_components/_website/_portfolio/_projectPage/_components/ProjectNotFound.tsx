"use client";

import React from "react";
import Link from "next/link";
import { HiOutlinePhotograph } from "react-icons/hi";
import { directionMap } from "@/app/constants/constants";

export function ProjectNotFound({ local }: { local: "en" | "ar" }) {
  const isRTL = local === "ar";
  return (
    <div
      dir={directionMap[local]}
      className="min-h-[60vh] flex items-center justify-center"
      style={{ background: "var(--surface-50)" }}
    >
      <div className="text-center max-w-md px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: "var(--surface-100)",
            border: "1px solid var(--surface-200)",
          }}
        >
          <HiOutlinePhotograph
            size={28}
            style={{ color: "var(--surface-400)" }}
          />
        </div>
        <h1
          className="heading-lg font-display mb-3"
          style={{ color: "var(--surface-900)" }}
        >
          {isRTL ? "المشروع غير موجود" : "Project Not Found"}
        </h1>
        <p className="body mb-8" style={{ color: "var(--surface-500)" }}>
          {isRTL
            ? "عذراً، لم نتمكن من العثور على المشروع الذي تبحث عنه."
            : "Sorry, we couldn't find the project you're looking for."}
        </p>
        <Link
          href={`/${local}/portfolio`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ background: "var(--primary)", color: "white" }}
        >
          {isRTL ? "العودة للمشاريع" : "Back to Portfolio"}
        </Link>
      </div>
    </div>
  );
}
