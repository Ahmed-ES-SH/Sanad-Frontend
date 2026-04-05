"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import LocalLink from "../../_global/LocalLink";
import { FiChevronLeft, FiChevronRight, FiArrowDown } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { ServiceStats } from "@/app/constants/servicesData";

interface ServiceHeroProps {
  title: { en: string; ar: string };
  smallDesc: { en: string; ar: string };
  image: string;
  category?: string;
  stats?: ServiceStats[];
}

const categoryLabels: Record<string, { en: string; ar: string }> = {
  development: { en: "Development", ar: "التطوير" },
  marketing: { en: "Marketing", ar: "التسويق" },
  design: { en: "Design", ar: "التصميم" },
  "data-security": { en: "Data & Security", ar: "البيانات والأمان" },
};

export default function ServiceHero({ title, smallDesc, image, category, stats }: ServiceHeroProps) {
  const { local } = useVariables();
  const isArabic = local === "ar";
  const categoryLabel = category ? categoryLabels[category] : null;

  return (
    <section className="c-container mx-auto px-4 pt-8 md:pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card-elevated overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] md:min-h-[520px]">
          {/* Content Side */}
          <div className={`lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-center ${isArabic ? "lg:order-2" : ""}`}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-6" aria-label="Breadcrumb">
              <LocalLink href="/services" className="body-sm text-surface-400 hover:text-primary transition-colors">
                {local === "en" ? "Services" : "الخدمات"}
              </LocalLink>
              {categoryLabel && (
                <>
                  <span className="text-surface-300">
                    {isArabic ? <FiChevronLeft className="w-3.5 h-3.5" /> : <FiChevronRight className="w-3.5 h-3.5" />}
                  </span>
                  <span className="body-sm text-surface-500">{categoryLabel[local]}</span>
                </>
              )}
            </nav>

            {/* Category Badge */}
            {categoryLabel && (
              <motion.div
                initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-5"
              >
                <span className="surface-badge">{categoryLabel[local]}</span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="display-lg text-surface-900 font-display leading-[1.1] tracking-[-0.03em] mb-5"
            >
              {title[local]}
            </motion.h1>

            {/* Lead Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[1.1rem] md:text-[1.2rem] leading-[1.7] text-surface-600 font-normal max-w-xl mb-8"
            >
              {smallDesc[local]}
            </motion.p>

            {/* Inline Stats Bar */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-0 mb-8 border-t border-b border-surface-200 py-5"
              >
                {stats.map((stat, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="w-px h-10 bg-surface-200" />
                    )}
                    <div className="flex-1 px-4 first:pl-0 last:pr-0">
                      <p className="display-sm text-surface-900 font-display leading-none mb-1.5">
                        {stat.value}
                      </p>
                      <p className="caption text-surface-500 uppercase tracking-wider">
                        {stat.label[local]}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href="#order-section"
                className="surface-btn-primary"
              >
                <span>{local === "en" ? "Order This Service" : "اطلب هذه الخدمة"}</span>
                <FiArrowDown className="text-sm" />
              </a>
              <LocalLink
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-surface-600 hover:text-primary hover:bg-primary-50 transition-all duration-300 font-display body-sm"
              >
                {isArabic ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
                <span>{local === "en" ? "All Services" : "جميع الخدمات"}</span>
              </LocalLink>
            </motion.div>
          </div>

          {/* Image Side */}
          <div className={`lg:col-span-5 relative overflow-hidden ${isArabic ? "lg:order-1" : ""}`}>
            <div className="absolute inset-0 bg-surface-100" />
            <div className="relative w-full h-full min-h-[280px] md:min-h-[360px] lg:min-h-full">
              <Image
                src={image}
                alt={title[local]}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Subtle gradient edge for seamless blend into content side */}
              <div
                className={`absolute inset-y-0 ${isArabic ? "left-0" : "right-0"} w-16 bg-gradient-to-${isArabic ? "l" : "r"} from-white to-transparent`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
