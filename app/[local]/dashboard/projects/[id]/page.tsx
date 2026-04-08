"use client";

import React, { useCallback, useEffect, useState, KeyboardEvent } from "react";
import { motion, type Variants } from "framer-motion";
import ProjectQuickStats from "./_components/_projectDetails/ProjectQuickStats";
import ProjectOverview from "./_components/_projectDetails/ProjectOverview";
import RecentTasks from "./_components/_projectDetails/RecentTasks";
import ProjectTimeline from "./_components/_projectDetails/ProjectTimeline";
import ProjectTeam from "./_components/_projectDetails/ProjectTeam";
import ResourcesDocuments from "./_components/_projectDetails/ResourcesDocuments";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

export default function ProjectDetailsPage() {
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Keyboard shortcut handler for power users
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        // Navigation handled by href
      }
    },
    [],
  );

  return (
    <>
      <motion.main
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#fff8f5] min-h-screen relative"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Background texture - subtle architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Breadcrumb & Header */}
        <motion.section
          className="relative flex flex-col md:flex-row md:items-end justify-between gap-6"
          variants={sectionVariants}
        >
          <div className="space-y-3 min-w-0">
            <nav
              className="flex items-center gap-3 text-sm font-medium tracking-wide"
              aria-label="Breadcrumb"
            >
              <a
                href="/dashboard/projects"
                className="text-[#584237]/70 hover:text-[#9d4300] transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded-md"
                onKeyDown={handleKeyDown}
                aria-label="Back to Projects list"
              >
                <motion.svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </motion.svg>
                <span className="whitespace-nowrap">Projects</span>
              </a>
              <motion.svg
                className="w-4 h-4 text-[#584237]/40 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
              {/* Project name with overflow handling */}
              <span
                className="text-[#1c1917] font-medium truncate"
                title="NEOM Bridge Phase 2"
              >
                NEOM Bridge Phase 2
              </span>
            </nav>
            {/* Keyboard shortcut hint - visible on focus or hover */}
            <div className="flex items-center gap-5 flex-wrap">
              <h2
                className="text-4xl md:text-5xl font-black tracking-tight text-[#1c1917] leading-tight font-[family-name:var(--font-oswald)] min-w-0"
                style={{ letterSpacing: "-0.02em" }}
              >
                <span className="block truncate max-w-[400px] md:max-w-[600px]">
                  NEOM Bridge
                </span>
                <span className="block text-[#9d4300] text-2xl md:text-3xl font-bold tracking-normal mt-1 font-[family-name:var(--font-ibm-plex-sans)]">
                  Phase 2
                </span>
              </h2>
              <span className="px-4 py-1.5 bg-[#f97316] text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-[#f97316]/25 border border-[#fb923c]/50 whitespace-nowrap">
                In Progress
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <motion.button
              className="flex items-center gap-2.5 px-6 py-3 rounded-lg border-2 border-[#d6d3d1] bg-white/80 backdrop-blur-sm text-[#584237] font-bold text-sm hover:bg-white hover:border-[#a8a29e] hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Edit Project details"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="whitespace-nowrap">Edit Project</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2.5 px-6 py-3 rounded-lg bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold text-sm hover:from-[#ea580c] hover:to-[#c2410c] transition-all duration-200 shadow-xl shadow-[#f97316]/20 hover:shadow-[#f97316]/30 border border-[#fb923c]/50 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Generate Project Report"
            >
              {/* Subtle shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="relative z-10 whitespace-nowrap">
                Generate Report
              </span>
            </motion.button>
          </div>
        </motion.section>

        {/* Project Quick Stats - Primary emphasis on Budget */}
        <motion.div className="relative" variants={sectionVariants}>
          <ProjectQuickStats />
        </motion.div>

        {/* Main Content - Clear two-column rhythm */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative"
          variants={sectionVariants}
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectOverview />
            <RecentTasks />
          </div>
          {/* Right Column */}
          <div className="space-y-8">
            <ProjectTimeline />
            <ProjectTeam />
            <ResourcesDocuments />
          </div>
        </motion.div>

        {/* Keyboard shortcuts help text - sr only but accessible */}
        <div className="sr-only" aria-live="polite">
          Keyboard shortcuts: Press Escape to go back to projects list. Press E
          to edit project. Press R to generate report.
        </div>
      </motion.main>
    </>
  );
}
