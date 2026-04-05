"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  description: { en: string; ar: string };
  local: "en" | "ar";
}

export default function ProjectOverview({ description, local }: Props) {
  const isRTL = local === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="c-container px-4 py-10 md:py-14"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* Large decorative quote mark */}
        <div
          className="text-8xl font-display leading-none mb-4 select-none text-primary/15"
        >
          "
        </div>
        <p
          className="body-lg sm:text-xl leading-relaxed font-medium"
          style={{ color: "var(--surface-700)" }}
        >
          {description[local]}
        </p>
      </motion.div>
    </section>
  );
}
