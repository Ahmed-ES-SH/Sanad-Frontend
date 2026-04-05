"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useVariables } from "@/app/context/VariablesContext";
import { portfolioData } from "@/app/constants/portfolioData";

interface Props {
  currentProjectId: number;
  local: "en" | "ar";
}

export default function RelatedProjects({ currentProjectId, local }: Props) {
  const isRTL = local === "ar";
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const related = portfolioData
    .filter((p) => p.id !== currentProjectId)
    .slice(0, 2);

  if (!related.length) return null;

  const handleImageError = (projectId: number) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  return (
    <section className="c-container px-4 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px w-8"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="caption-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              {isRTL ? "المزيد" : "More Work"}
            </span>
          </div>
          <h2
            className="display-sm font-display"
            style={{ color: "var(--surface-900)" }}
          >
            {isRTL ? "مشاريع ذات صلة" : "Related Projects"}
          </h2>
        </div>
        <Link
          href={`/${local}/portfolio`}
          className="text-sm font-medium transition-colors duration-150 flex-shrink-0"
          style={{ color: "var(--primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
        >
          {isRTL ? "عرض جميع المشاريع" : "View All"}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {related.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/${local}/project?projectId=${project.id}`}
              className="group block overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--surface-card-bg)",
                borderColor: "var(--surface-card-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--surface-card-border-hover)";
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(15, 23, 42, 0.06), 0 4px 6px rgba(15, 23, 42, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--surface-card-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="relative overflow-hidden aspect-[16/10] bg-surface-100">
                {imageErrors[project.id] ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={project.imgSrc}
                    alt={project.title[local]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    onError={() => handleImageError(project.id)}
                  />
                )}
                <div
                  className="absolute top-3 end-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <FiChevronRight size={14} color="white" className={isRTL ? "rotate-180" : ""} />
                </div>
              </div>
              <div className="p-5">
                <h3
                  className="heading-sm font-display mb-1.5 truncate"
                  style={{ color: "var(--surface-900)" }}
                >
                  {project.title[local]}
                </h3>
                <p
                  className="body-sm line-clamp-2"
                  style={{ color: "var(--surface-500)" }}
                >
                  {project.description[local]}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
