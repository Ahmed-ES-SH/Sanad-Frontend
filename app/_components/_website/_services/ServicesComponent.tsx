"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { directionMap } from "@/app/constants/constants";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import LocalLink from "../../_global/LocalLink";
import { Service } from "@/app/types/service";
import CategoriesFilter from "./CategoriesFilter";
import { Category } from "@/app/types/blog";
import ServiceCard from "./ServiceCard";

interface ServicesComponentProps {
  services?: Service[];
  categories: Category[];
}

export default function ServicesComponent({
  services = [],
  categories = [],
}: ServicesComponentProps) {
  const { local } = useVariables();
  const { servicesPage } = getTranslations(local);
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);

  const filteredServices =
    activeFilter !== null
      ? services.filter((s) => s.category?.slug === activeFilter.slug)
      : services;

  return (
    <section
      dir={directionMap[local]}
      className="py-24 bg-surface-50"
      id="services"
    >
      <div className="c-container">
        {/* Refined Header: Left Aligned for Rhythm */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="surface-badge mb-4">{servicesPage.title1}</span>
            <h1 className="display-md font-display text-surface-900 mb-6 leading-tight">
              {servicesPage.title2}
            </h1>
            <p className="body-lg text-surface-500 leading-relaxed">
              {servicesPage.description}
            </p>
          </div>

          <CategoriesFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            categories={categories}
            local={local}
          />
        </div>

        {/* Services Grid with Layout Animations */}
        <motion.div
          layout="position"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} local={local} />
              ))
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mb-6">
                  <FiArrowUpRight className="size-8 text-surface-400 rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">
                  {local === "en"
                    ? "No solutions found"
                    : "لم يتم العثور على حلول"}
                </h3>
                <p className="text-surface-500 max-w-xs">
                  {local === "en"
                    ? "Try selecting a different category to see our services."
                    : "حاول اختيار فئة مختلفة لرؤية خدماتنا."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
