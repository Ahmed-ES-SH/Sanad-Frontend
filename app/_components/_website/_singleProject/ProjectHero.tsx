"use client";
import React from "react";
import { motion } from "framer-motion";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function ProjectHero({ project, local }: Props) {
  const isRTL = local === "ar";
  const coverImage = project.spotlight?.coverImage || project.gallery?.[0] || project.imgSrc;

  return (
    <section className="pt-24 sm:pt-28">
      <div className="c-container px-4">
        {/* Category pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/8 text-primary"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
            {project.category[local]}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="display-xl font-display leading-[1.05] max-w-4xl mb-5"
          style={{ color: "var(--surface-900)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.title[local]}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="body-lg sm:text-xl max-w-2xl mb-3"
          style={{ color: "var(--surface-500)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.description[local]}
        </motion.p>

        {/* Tagline — tight with description, forms one content group */}
        {project.spotlight?.tagline && (
          <motion.p
            className="body italic max-w-xl mb-10"
            style={{ color: "var(--surface-400)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.spotlight.tagline[local]}
          </motion.p>
        )}

        {/* Cinematic full-width image — tight gap from text above */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-2xl overflow-hidden">
            <img
              src={coverImage}
              alt={project.title[local]}
              className="w-full aspect-[16/10] sm:aspect-[2/1] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
