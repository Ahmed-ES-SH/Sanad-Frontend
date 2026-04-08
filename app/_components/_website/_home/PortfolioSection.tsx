"use client";
import React, { useState } from "react";
import { directionMap, projectCategories } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import LocalLink from "../../_global/LocalLink";
import ProjectCard from "../_portfolio/ProjectCard";
import { Project } from "@/app/types/project";

export default function PortfolioSection({
  projects,
}: {
  projects: Project[];
}) {
  const { local } = useVariables();
  const { portfolioSection } = getTranslations(local);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.categoryId === selectedCategory)
    : projects;

  return (
    <section
      dir={directionMap[local]}
      className="page-bg relative py-16 lg:py-24"
    >
      <div className="c-container">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
          <h2 className="text-[2.25rem] sm:text-[3.5rem] font-bold leading-[1.15] text-surface-900 tracking-tight">
            {portfolioSection.title}
          </h2>
          <p className="text-[1.125rem] text-surface-600 leading-relaxed max-w-xl mx-auto">
            {portfolioSection.description}
          </p>
        </div>

        {/* Filter section */}
        <div className="relative mb-12">
          {/* Mobile Swipe Hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex lg:hidden items-center justify-center gap-2 mb-4 text-surface-400 text-xs font-medium uppercase tracking-wider"
          >
            {local === "ar" ? (
              <FiArrowRight size={14} className="animate-pulse" />
            ) : (
              <FiArrowLeft size={14} className="animate-pulse" />
            )}
            <span>{local === "ar" ? "اسحب للتصفية" : "Swipe to filter"}</span>
            {local === "ar" ? (
              <FiArrowLeft size={14} className="animate-pulse" />
            ) : (
              <FiArrowRight size={14} className="animate-pulse" />
            )}
          </motion.div>

          <div className="flex justify-center group">
            <Swiper
              key={local}
              slidesPerView="auto"
              spaceBetween={12}
              freeMode={true}
              modules={[FreeMode]}
              className="w-full px-4! sm:px-0!"
              wrapperClass="justify-start! sm:justify-center!"
            >
              <SwiperSlide className="w-auto!">
                <button
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === null
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "bg-surface-50 text-surface-600 hover:bg-primary/5 border border-surface-200"
                  }`}
                  onClick={() => handleCategoryChange(null)}
                >
                  {portfolioSection.all}
                </button>
              </SwiperSlide>
              {projectCategories.slice(0, 5).map((category, index) => (
                <SwiperSlide key={index} className="w-auto!">
                  <button
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category[local]
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-surface-50 text-surface-600 hover:bg-primary/5 border border-surface-200"
                    }`}
                    onClick={() => handleCategoryChange(category[local])}
                  >
                    {category[local]}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Subtle edge fades for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-page-bg to-transparent z-10 pointer-events-none lg:hidden opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-page-bg to-transparent z-10 pointer-events-none lg:hidden opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Projects with animation */}
        <motion.div
          layout
          className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 8).map((project, index) => (
              <ProjectCard
                key={project.id}
                local={local}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 flex justify-center">
          <LocalLink
            href="/portfolio"
            className="surface-btn-primary px-10 h-12"
          >
            {portfolioSection.showMore}
          </LocalLink>
        </div>
      </div>
    </section>
  );
}
