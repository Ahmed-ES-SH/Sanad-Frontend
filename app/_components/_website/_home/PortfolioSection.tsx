"use client";
import { useCallback, useState } from "react";
import { directionMap } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Project } from "@/app/types/project";
import { Category } from "@/app/types/blog";
import { useAppQuery } from "@/lib/hooks/useAppQuery";
import { PORTFOLIO_ENDPOINTS } from "@/app/constants/endpoints";

import LoadingGrid from "./_portfolioSection/LoadingGrid";
import EmptyState from "./_portfolioSection/EmptyState";
import ProjectsCategoriesFilter from "./_portfolioSection/ProjectsCategoriesFilter";
import LocalLink from "../../_global/LocalLink";
import ProjectCard from "../_portfolio/ProjectCard";

interface PortfolioSectionProps {
  projects: Project[];
  categories: Category[];
}

/**
 * PortfolioSection displays a filtered list of projects on the home page.
 * It includes category filtering, animated transitions, and mobile-optimized swiper.
 */
export default function PortfolioSection({
  projects,
  categories,
}: PortfolioSectionProps) {
  const { local } = useVariables();
  const { portfolioSection } = getTranslations(local);

  // State management for projects data and filtering
  const [enabled, setEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /**
   * Updates the selected category and enables the dynamic query.
   */
  const handleCategoryChange = useCallback((category: string | null) => {
    setEnabled(true);
    setSelectedCategory(category);
  }, []);

  /**
   * Resets the category filter to show all projects.
   */
  const handleResetFilter = useCallback(() => {
    handleCategoryChange(null);
  }, [handleCategoryChange]);

  // Fetch projects based on selected category when filtering is enabled
  const { data: projectData, isLoading: projectLoading } = useAppQuery<{
    data: Project[];
  }>({
    queryKey: [`portfolio-published-${selectedCategory}`],
    endpoint: `${PORTFOLIO_ENDPOINTS.LIST_PUBLISHED}${selectedCategory ? `?categoryId=${selectedCategory}` : ""}`,
    enabled,
  });

  // Determine which data to display and the loading state
  const isFiltering = enabled && selectedCategory !== null;
  const displayedProjects = isFiltering ? (projectData?.data ?? []) : projects;
  const isLoading = isFiltering && projectLoading;

  return (
    <section
      dir={directionMap[local]}
      className="page-bg relative py-16 lg:py-24"
    >
      <div className="c-container">
        {/* Header section with title and description */}
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2.25rem] sm:text-[3.5rem] font-bold leading-[1.15] text-surface-900 tracking-tight"
          >
            {portfolioSection.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[1.125rem] text-surface-600 leading-relaxed max-w-xl mx-auto"
          >
            {portfolioSection.description}
          </motion.p>
        </div>

        {/* Filter section with Swiper for mobile scrollability */}
        <div className="relative mb-12">
          {/* Mobile Swipe Hint: Appears only on small screens to guide users */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex lg:hidden items-center justify-center gap-2 mb-4 text-surface-400 text-xs font-medium uppercase tracking-wider"
          >
            <FiArrowLeft size={14} className="animate-pulse rtl:rotate-180" />
            <span>{portfolioSection.swipeToFilter}</span>
            <FiArrowRight size={14} className="animate-pulse rtl:rotate-180" />
          </motion.div>

          {/* Edge fades to indicate scrollability on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-page-bg to-transparent z-10 pointer-events-none lg:hidden opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-page-bg to-transparent z-10 pointer-events-none lg:hidden opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Projects Categories Filter */}
        <ProjectsCategoriesFilter
          isLoading={isLoading}
          categories={categories}
          local={local}
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          portfolioSection={portfolioSection}
        />

        {/* Projects Grid Display */}
        <motion.div layout className="relative min-h-[400px]">
          {isLoading ? (
            <LoadingGrid />
          ) : displayedProjects.length === 0 ? (
            <EmptyState onReset={handleResetFilter} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full"
            >
              <AnimatePresence mode="wait">
                {displayedProjects.slice(0, 8).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProjectCard
                      local={local}
                      project={project}
                      index={index}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* "Show More" link to the full portfolio page */}
        {!isLoading && displayedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex justify-center"
          >
            <LocalLink
              href="/portfolio"
              className="surface-btn-primary px-10 h-12"
            >
              {portfolioSection.showMore}
            </LocalLink>
          </motion.div>
        )}
      </div>
    </section>
  );
}
