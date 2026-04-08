"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBox, FiArrowUpRight } from "react-icons/fi";
import { directionMap } from "@/app/constants/constants";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { formatTitle, getTranslations } from "@/app/helpers/helpers";
import LocalLink from "../../_global/LocalLink";
import { servicesData, ServiceData } from "@/app/constants/servicesData";
import { Service } from "@/app/types/service";

interface ServicesComponentProps {
  services?: Service[];
}

type CategoryValue = Exclude<ServiceData["category"], undefined>;
type FilterCategory = "all" | CategoryValue;

const categoryLabels: Record<FilterCategory, { en: string; ar: string }> = {
  all: { en: "All Solutions", ar: "جميع الحلول" },
  development: { en: "Development", ar: "تطوير" },
  marketing: { en: "Marketing", ar: "تسويق" },
  design: { en: "Design", ar: "تصميم" },
  "data-security": { en: "Data & Security", ar: "بيانات وأمان" },
};

const categoryOrder: FilterCategory[] = [
  "all",
  "development",
  "marketing",
  "design",
  "data-security",
];

export default function ServicesComponent({ services = [] }: ServicesComponentProps) {
  const { local } = useVariables();
  const { servicesPage } = getTranslations(local);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const backendServices = services.map((service) => ({
    id: service.id,
    title: { en: service.title, ar: service.title },
    category: (service.category?.slug || "all") as CategoryValue,
    smallDesc: { en: service.shortDescription, ar: service.shortDescription },
    imgsrc: service.iconUrl || "",
    slug: service.slug,
  }));

  const displayServices = backendServices.length > 0 ? backendServices : servicesData;

  const filteredServices =
    activeFilter === "all"
      ? displayServices
      : displayServices.filter((s) => s.category === activeFilter);

  const getServiceUrl = (service: typeof displayServices[0]) => {
    if ('slug' in service && service.slug) {
      return `/services/${service.slug}`;
    }
    return `/services/${formatTitle(service.title[local])}?serviceId=${service.id}`;
  };

  return (
    <section dir={directionMap[local]} className="py-24 bg-surface-50" id="services">
      <div className="c-container">
        {/* Refined Header: Left Aligned for Rhythm */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="surface-badge mb-4">
              {servicesPage.title1}
            </span>
            <h1 className="display-md font-display text-surface-900 mb-6 leading-tight">
              {servicesPage.title2}
            </h1>
            <p className="body-lg text-surface-500 leading-relaxed">
              {servicesPage.description}
            </p>
          </div>

          {/* Premium Sliding Filter */}
          <div 
            className="flex flex-wrap gap-2 p-1.5 bg-surface-100 rounded-2xl border border-surface-200"
            role="tablist"
            aria-label={local === "en" ? "Service categories" : "فئات الخدمات"}
          >
            {categoryOrder.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    isActive ? "text-white" : "text-surface-500 hover:text-surface-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-button"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {categoryLabels[cat][local]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid with Layout Animations */}
        <motion.div 
          layout="position"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "circOut" }}
              >
                <LocalLink
                  href={getServiceUrl(service)}
                  className="surface-card group relative flex flex-col h-full p-8 transition-all duration-500 overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {/* Subtle Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <div className="mb-8 flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-surface-50 group-hover:bg-primary-50 transition-colors duration-500">
                      <Img src={service.imgsrc} className="w-10 h-10 object-contain" />
                    </div>
                    <FiArrowUpRight className="text-surface-300 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all size-6" />
                  </div>

                  <h3 className="heading-md font-display text-surface-900 mb-3">
                    {service.title[local]}
                  </h3>
                  <p className="body-sm text-surface-500 leading-relaxed mb-6">
                    {service.smallDesc[local]}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-surface-100 flex items-center text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore Solution
                  </div>
                </LocalLink>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
