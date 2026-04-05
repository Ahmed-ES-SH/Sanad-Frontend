"use client";
import { useState, useTransition } from "react";
import React from "react";
import { directionMap, projectCategories } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { AnimatePresence, motion } from "framer-motion";
import LocalLink from "../../_global/LocalLink";
import ProjectCard from "../_portfolio/ProjectCard";
import { projectsData } from "@/app/constants/projects";

export default function PortfolioSection() {
  const { local } = useVariables();
  const { portfolioSection } = getTranslations(local);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (category: string | null) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  const filteredProjects = selectedCategory
    ? projectsData.filter(
        (project) => project.category[local] === selectedCategory
      )
    : projectsData;

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
        <div className="flex justify-center mb-12">
          <div className="flex items-center justify-center flex-wrap gap-3">
            <button
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-surface-50 text-surface-600 hover:bg-primary/5 border border-surface-200"
              }`}
              onClick={() => handleCategoryChange(null)}
            >
              {portfolioSection.all}
            </button>
            {projectCategories.slice(0, 5).map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category[local]
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "bg-surface-50 text-surface-600 hover:bg-primary/5 whitespace-nowrap border border-surface-200"
                }`}
                onClick={() => handleCategoryChange(category[local])}
              >
                {category[local]}
              </button>
            ))}
          </div>
        </div>

        {/* Projects with animation */}
        <motion.div
          layout
          className={`grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full opacity-100 transition-opacity duration-300 ${isPending ? 'opacity-50' : ''}`}
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
