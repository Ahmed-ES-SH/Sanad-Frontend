"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function ProjectTimeline({ project, local }: Props) {
  const isRTL = local === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const process = project.spotlight?.process;
  if (!process?.length) return null;

  return (
    <section ref={ref} className="c-container px-4 py-10 md:py-14">
      {/* Label */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="h-px w-8"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <span
          className="caption-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--primary)" }}
        >
          {isRTL ? "المراحل" : "Process"}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative max-w-3xl">
        {/* Vertical line — aligned to center of dots */}
        <div
          className="absolute top-4 bottom-0 w-px"
          style={{
            [isRTL ? "right" : "left"]: "15px",
            backgroundColor: "var(--surface-200)",
          }}
        />

        {process.map((phase, index) => (
          <motion.div
            key={index}
            className="relative flex gap-5 mb-8 last:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Dot — optically centered on the line */}
            <div
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: "var(--surface-50)",
                border: "2px solid var(--primary)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--primary)" }}
              >
                {index + 1}
              </span>
            </div>

            {/* Content */}
            <div className="pt-1">
              <h3
                className="heading-sm font-display mb-1.5"
                style={{ color: "var(--surface-900)" }}
              >
                {phase.title[local]}
              </h3>
              <p
                className="body-sm leading-relaxed"
                style={{ color: "var(--surface-500)" }}
              >
                {phase.description[local]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
