"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function TechStack({ project, local }: Props) {
  const isRTL = local === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (!project.tools.length) return null;

  return (
    <section ref={ref} className="c-container px-4 py-10 md:py-14">
      <div className="flex items-center gap-3 mb-8">
        <div
          className="h-px w-8"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <span
          className="caption-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--primary)" }}
        >
          {isRTL ? "التقنيات" : "Built With"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {project.tools.map((tool, index) => (
          <motion.div
            key={tool}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-default"
              style={{
                backgroundColor: "var(--surface-card-bg)",
                border: "1px solid var(--surface-card-border)",
                color: "var(--surface-700)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--surface-card-border)";
                e.currentTarget.style.color = "var(--surface-700)";
              }}
            >
              {tool}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
