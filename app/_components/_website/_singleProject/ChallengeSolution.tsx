"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  challenge: { en: string; ar: string };
  solution: { en: string; ar: string };
  local: "en" | "ar";
}

export default function ChallengeSolution({ challenge, solution, local }: Props) {
  const isRTL = local === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="c-container px-4 py-12 md:py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Challenge — Dark Card (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: "var(--surface-900)" }}
        >
          <span
            className="text-3xl font-display font-black leading-none block mb-5"
            style={{ color: "rgba(255, 255, 255, 0.1)" }}
          >
            01
          </span>
          <h2
            className="heading-lg font-display mb-4"
            style={{ color: "white" }}
          >
            {isRTL ? "التحدي" : "The Challenge"}
          </h2>
          <p
            className="body leading-relaxed"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {challenge[local]}
          </p>
        </motion.div>

        {/* Solution — Light Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--surface-card-bg)",
            border: "1px solid var(--surface-card-border)",
            borderLeft: isRTL ? "1px solid var(--surface-card-border)" : "3px solid var(--primary)",
            borderRight: isRTL ? "3px solid var(--primary)" : "1px solid var(--surface-card-border)",
          }}
        >
          <span
            className="text-3xl font-display font-black leading-none block mb-5"
            style={{ color: "var(--surface-100)" }}
          >
            02
          </span>
          <h2
            className="heading-lg font-display mb-4"
            style={{ color: "var(--surface-900)" }}
          >
            {isRTL ? "الحل" : "The Solution"}
          </h2>
          <p
            className="body leading-relaxed"
            style={{ color: "var(--surface-600)" }}
          >
            {solution[local]}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
