"use client";
import { motion } from "framer-motion";

interface Props {
  local: "en" | "ar";
  projectCount: number;
}

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PortfolioHero({ local, projectCount }: Props) {
  const isRTL = local === "ar";

  return (
    <section className="relative overflow-hidden">
      {/* Mesh gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(251, 146, 60, 0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div className="c-container relative z-10 px-4 py-16 sm:py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left: Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childVariant}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="display-xl font-display leading-[1.05]"
              style={{ color: "var(--surface-900)" }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "أعمالنا" : "Our Work"}
            </h1>
          </motion.div>

          {/* Right: Descriptor + Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childVariant}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="md:text-end"
          >
            <p
              className="text-lg sm:text-xl max-w-md mb-4"
              style={{ color: "var(--surface-500)" }}
            >
              {isRTL
                ? "مشاريع تتحدث عن نفسها — نُفذت بخبرة واحتراف"
                : "Projects that speak for themselves — delivered with expertise and precision."}
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.08)",
                color: "var(--primary)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
              />
              {isRTL
                ? `${projectCount} مشروع مُنجز`
                : `${projectCount} projects delivered`}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
