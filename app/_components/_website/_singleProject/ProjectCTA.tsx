"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import LocalLink from "../../_global/LocalLink";

interface Props {
  local: "en" | "ar";
}

export default function ProjectCTA({ local }: Props) {
  const isRTL = local === "ar";

  return (
    <section className="c-container px-4 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(249, 115, 22, 0.06) 0%, transparent 60%),
            var(--surface-50)
          `,
          border: "1px solid var(--surface-200)",
        }}
      >
        <div className="px-6 py-12 sm:px-10 sm:py-14 text-center">
          <h2
            className="heading-lg md:display-sm font-display mb-3"
            style={{ color: "var(--surface-900)" }}
          >
            {isRTL ? "لنبدأ بمشروعك" : "Let's build your project"}
          </h2>
          <p
            className="body mb-8 max-w-lg mx-auto"
            style={{ color: "var(--surface-500)" }}
          >
            {isRTL
              ? "أخبرنا عن فكرة مشروعك وسنتواصل معك خلال يوم واحد لمناقشة التفاصيل."
              : "Share your project idea and we'll get back to you within one business day to discuss the details."}
          </p>
          <LocalLink
            href={`/${local}/contact`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: "var(--gradient-primary)",
              color: "white",
              boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gradient-primary-hover)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(249, 115, 22, 0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--gradient-primary)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(249, 115, 22, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isRTL ? "ابدأ مشروعك" : "Start Your Project"}
            <FiArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
          </LocalLink>
        </div>
      </motion.div>
    </section>
  );
}
