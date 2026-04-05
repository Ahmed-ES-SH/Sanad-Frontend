"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  projects: PortfolioProject[];
  local: "en" | "ar";
  isPaused: boolean;
}

const ROTATION_INTERVAL = 8000;

export default function ProjectSpotlight({ projects, local, isPaused }: Props) {
  const isRTL = local === "ar";
  const [activeIndex, setActiveIndex] = useState(0);

  const nextProject = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (isPaused || projects.length <= 1) return;

    const timer = setInterval(nextProject, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextProject, projects.length]);

  const active = projects[activeIndex];
  if (!active?.spotlight) return null;

  return (
    <div
      className="surface-card overflow-hidden"
      style={{ padding: "clamp(20px, 4vw, 40px)" }}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Image */}
        <div className="md:w-[55%] flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={active.id}
              src={active.spotlight.coverImage || active.imgSrc}
              alt={active.title[local]}
              className="w-full aspect-[16/10] md:aspect-[4/3] object-cover rounded-xl"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center md:w-[45%]">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-0.5"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="caption-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              {isRTL ? "مشروع مميز" : "Featured Project"}
            </span>
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={`title-${active.id}`}
              className="display-sm font-display mb-2"
              style={{ color: "var(--surface-900)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.title[local]}
            </motion.h3>
          </AnimatePresence>

          {/* Tagline */}
          <p
            className="body-sm mb-4 italic"
            style={{ color: "var(--surface-500)" }}
          >
            {active.spotlight.tagline[local]}
          </p>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${active.id}`}
              className="body text-surface-600 mb-6"
              style={{ color: "var(--surface-600)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.spotlight.solution[local]}
            </motion.p>
          </AnimatePresence>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href={`/${local}/project?projectId=${active.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--gradient-primary)",
                color: "white",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gradient-primary-hover)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 115, 22, 0.35)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--gradient-primary)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(249, 115, 22, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isRTL ? "عرض المشروع" : "View Project"}
              <FiArrowRight
                size={14}
                className={isRTL ? "rotate-180" : ""}
              />
            </Link>

            {/* Dots indicator */}
            {projects.length > 1 && (
              <div className="flex items-center gap-1.5">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? "24px" : "8px",
                      height: "8px",
                      backgroundColor:
                        i === activeIndex ? "var(--primary)" : "var(--surface-300)",
                    }}
                    aria-label={
                      isRTL
                        ? `الانتقال للمشروع ${i + 1}`
                        : `Go to project ${i + 1}`
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
