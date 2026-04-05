"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarFilter from "./SidebarFilter";
import ProjectCard from "./ProjectCard";
import Pagination from "./Pagination";
import ServicesSlider from "./ServicesSlider";
import { directionMap } from "@/app/constants/constants";
import { projectsData } from "@/app/constants/projects";

export interface Project {
  id: number;
  imgSrc: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  skills: string[];
}

export default function ProjectsPortfolio() {
  const { local } = useVariables();
  const { portfolioPage } = getTranslations(local);
  const allLabel = local === "ar" ? "الكل" : "All";
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || allLabel;
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const projectsPerPage = 6;

  const projects = useMemo<Project[]>(() => projectsData, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === allLabel) return projects;

    return projects.filter(
      (project) => project.category[local] === selectedCategory
    );
  }, [projects, selectedCategory, allLabel, local]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  const updateURL = useCallback((category: string, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === allLabel) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    router.replace(`?${queryString}`, { scroll: false });
  }, [searchParams, router, allLabel]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(selectedCategory, page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL(category, 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      updateURL(selectedCategory, totalPages);
    }
  }, [totalPages, currentPage, selectedCategory, updateURL]);

  return (
    <div
      dir={directionMap[local]}
      className="min-h-screen pt-24"
      style={{ background: "var(--surface-50)" }}
    >
      {/* Header */}
      <motion.div
        className="border-b"
        style={{ borderColor: "var(--surface-200)", backgroundColor: "var(--surface-50)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="c-container px-6 py-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--surface-900)" }}>
            {portfolioPage.projectsTitle}
            <span style={{ color: "var(--primary)" }}>
              {portfolioPage.projectsTitleHighlight}
            </span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--surface-500)" }}>
            {portfolioPage.projectsDescription}
          </p>
        </div>
      </motion.div>

      <div className="c-container py-8 mb-8">
        <div className="py-8 flex gap-8">
          <SidebarFilter
            projects={projects}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            setCurrentPage={setCurrentPage}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
            allLabel={allLabel}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              className="mb-8 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{ color: "var(--surface-500)" }}>
                {startIndex + 1}–{Math.min(startIndex + projectsPerPage, filteredProjects.length)} {local === "ar" ? "من" : "of"} {filteredProjects.length}
              </p>
              {selectedCategory !== allLabel && (
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}>
                  {selectedCategory}
                </span>
              )}
            </motion.div>

            {/* Projects Grid */}
            {currentProjects.length === 0 ? (
              <div className="text-center py-16">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--surface-300)" strokeWidth="1.5" className="mx-auto mb-4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-lg font-medium mb-2" style={{ color: "var(--surface-600)" }}>
                  {local === "ar" ? "لا توجد مشاريع في هذا التصنيف" : "No projects in this category"}
                </p>
                <button
                  onClick={() => {
                    handleCategoryChange(allLabel);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: "var(--primary)", color: "white" }}
                >
                  {local === "ar" ? "عرض جميع المشاريع" : "View all projects"}
                </button>
              </div>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
                layout
              >
                <AnimatePresence mode="sync">
                  {currentProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      local={local}
                      index={index}
                      project={project}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
        <ServicesSlider />
      </div>
    </div>
  );
}
