"use client";
import React from "react";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function ProjectBrief({ project, local }: Props) {
  const isRTL = local === "ar";

  const items = [
    { label: isRTL ? "العميل" : "Client", value: project.client[local] },
    { label: isRTL ? "السنة" : "Year", value: project.year },
    { label: isRTL ? "المدة" : "Duration", value: project.duration[local] },
    { label: isRTL ? "التصنيف" : "Category", value: project.category[local] },
  ];

  return (
    <section className="c-container px-4 py-8">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--surface-400)" }}>
              {item.label}
            </span>
            <span className="body-sm font-semibold" style={{ color: "var(--surface-800)" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Services — separated with subtle divider */}
      {project.services.length > 0 && (
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--surface-200)" }}>
          <span className="text-xs font-medium mb-3 block" style={{ color: "var(--surface-400)" }}>
            {isRTL ? "الخدمات" : "Services"}
          </span>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "var(--surface-100)",
                  color: "var(--surface-700)",
                }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
