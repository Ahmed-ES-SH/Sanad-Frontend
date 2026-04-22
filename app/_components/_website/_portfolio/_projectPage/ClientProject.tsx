"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineExternalLink,
  HiOutlineCode,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
} from "react-icons/hi";

import { directionMap } from "@/app/constants/constants";
import type { Project } from "@/app/types/project";
import {
  RevealSection,
  SectionLabel,
  StatChip,
  GalleryLightbox,
  GallerySlider,
  TechBadge,
  ProjectNotFound,
  ProjectImage,
} from "./_components";

/* ─────────────────────────────────────────────
   Animation Variants
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface Props {
  project: Project;
  local: "en" | "ar";
}

export default function ClientProject({ project, local }: Props) {
  const isRTL = local === "ar";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) return <ProjectNotFound local={local} />;

  const coverImage = project.coverImageUrl ?? project.images?.[0] ?? null;
  const allImages = project.images ?? [];
  const techStack = project.techStack ?? [];
  const year = new Date(project.createdAt).getFullYear().toString();
  const categoryName = project.category?.name ?? (isRTL ? "أخرى" : "Other");

  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (dir: 1 | -1) =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + dir + allImages.length) % allImages.length : 0,
    );

  return (
    <div
      dir={directionMap[local]}
      className="min-h-dvh pb-20"
      style={{ background: "var(--surface-50)" }}
    >
      {/* ── Back Link ────────────────────────────────── */}
      <div className="c-container px-4 pt-8 pb-0">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/${local}/portfolio`}
            className="inline-flex items-center gap-2 text-sm font-semibold group focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            style={{ color: "var(--surface-500)" }}
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:bg-surface-200"
              style={{ background: "var(--surface-100)" }}
            >
              {isRTL ? <HiArrowRight size={16} /> : <HiArrowLeft size={16} />}
            </span>
            <span className="group-hover:underline underline-offset-4 transition-all duration-200">
              {isRTL ? "جميع المشاريع" : "All Projects"}
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="c-container px-4 pt-10 pb-0">
        {/* Category pill */}
        <motion.div
          custom={0}
          variants={fadeUp as any}
          initial="hidden"
          animate="show"
          className="mb-5"
        >
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "var(--primary-50)",
              color: "var(--primary-dark)",
              border: "1px solid var(--primary-100)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            {categoryName}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={0.1}
          variants={fadeUp as any}
          initial="hidden"
          animate="show"
          className="display-xl font-display max-w-4xl mb-5 leading-[1.05]"
          style={{ color: "var(--surface-900)" }}
        >
          {project.title}
        </motion.h1>

        {/* Short description */}
        <motion.p
          custom={0.2}
          variants={fadeUp as any}
          initial="hidden"
          animate="show"
          className="body-lg max-w-2xl mb-8"
          style={{ color: "var(--surface-500)" }}
        >
          {project.shortDescription}
        </motion.p>

        {/* Stats row */}
        <motion.div
          custom={0.28}
          variants={fadeUp as any}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-3 mb-10"
        >
          <StatChip
            icon={<HiOutlineCalendar size={16} />}
            label={isRTL ? "السنة" : "Year"}
            value={year}
          />
          <StatChip
            icon={<HiOutlineTag size={16} />}
            label={isRTL ? "التصنيف" : "Category"}
            value={categoryName}
          />
          {techStack.length > 0 && (
            <StatChip
              icon={<HiOutlineCode size={16} />}
              label={isRTL ? "التقنيات" : "Tech Used"}
              value={`${techStack.length} ${isRTL ? "تقنية" : "technologies"}`}
            />
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{
                background: "var(--gradient-primary)",
                color: "white",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              }}
            >
              <HiOutlineExternalLink size={16} />
              {isRTL ? "عرض المشروع" : "Live Project"}
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{
                background: "var(--surface-card-bg)",
                border: "1px solid var(--surface-card-border)",
                color: "var(--surface-700)",
              }}
            >
              <HiOutlineCode size={16} />
              {isRTL ? "الكود المصدري" : "Source Code"}
            </a>
          )}
        </motion.div>

        {/* Cover Image */}
        {coverImage && (
          <motion.div
            custom={0.35}
            variants={fadeIn as any}
            initial="hidden"
            animate="show"
            className="rounded-2xl shadow-surface-xl border border-surface-200 overflow-hidden"
          >
            <ProjectImage
              src={coverImage}
              alt={project.title}
              aspect="aspect-[16/9] lg:aspect-[2.4/1]"
              priority
            />
          </motion.div>
        )}
      </section>

      {/* ── Overview / Long Description ───────────────── */}
      {project.longDescription && (
        <RevealSection className="c-container px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <SectionLabel label={isRTL ? "نظرة عامة" : "Overview"} />
            <p
              className="body-lg leading-[1.8]"
              style={{ color: "var(--surface-600)" }}
            >
              {project.longDescription}
            </p>
          </div>
        </RevealSection>
      )}

      {/* Divider */}
      <div className="c-container px-4">
        <div className="border-t border-surface-200" />
      </div>

      {/* ── Tech Stack ────────────────────────────────── */}
      {techStack.length > 0 && (
        <RevealSection className="c-container px-4 py-14 md:py-20">
          <SectionLabel label={isRTL ? "التقنيات المستخدمة" : "Built With"} />
          <div className="flex flex-wrap gap-3">
            {techStack.map((tool, index) => (
              <TechBadge key={tool} tool={tool} index={index} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* Divider */}
      {allImages.length > 0 && (
        <div className="c-container px-4">
          <div className="border-t border-surface-200" />
        </div>
      )}

      {/* ── Gallery ───────────────────────────────────── */}
      {allImages.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="c-container px-4">
            <RevealSection>
              <SectionLabel label={isRTL ? "معرض الصور" : "Gallery"} />
            </RevealSection>
            <GallerySlider
              images={allImages}
              title={project.title}
              isRTL={isRTL}
              onOpen={(i) => setLightboxIndex(i)}
            />
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="c-container px-4">
        <div className="border-t border-surface-200" />
      </div>

      {/* ── CTA Banner ────────────────────────────────── */}
      <RevealSection className="c-container px-4 py-16 md:py-24">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-16 text-center shadow-[0_20px_60px_rgba(249,115,22,0.3)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -start-16 w-64 h-64 rounded-full opacity-20 bg-white blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -end-16 w-72 h-72 rounded-full opacity-10 bg-white blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white">
              <HiOutlineSparkles size={15} />
              {isRTL ? "هل تريد مشروعاً مشابهاً؟" : "Like what you see?"}
            </div>
            <h2 className="display-sm font-display text-white mb-4 leading-[1.2]">
              {isRTL
                ? "دعنا نبني شيئاً رائعاً معاً"
                : "Let's Build Something Great Together"}
            </h2>
            <p className="body text-white/75 max-w-lg mx-auto mb-8">
              {isRTL
                ? "تواصل معنا لمناقشة مشروعك القادم ونحن سنجعله حقيقة."
                : "Reach out and let's discuss your next project. We'll make it a reality."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${local}/contact`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                style={{
                  background: "white",
                  color: "var(--primary-dark)",
                }}
              >
                <HiOutlineLightningBolt size={16} />
                {isRTL ? "ابدأ مشروعك" : "Start Your Project"}
              </Link>
              <Link
                href={`/${local}/portfolio`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold border transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.35)",
                }}
              >
                {isRTL ? "استعرض المزيد" : "View More Work"}
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Lightbox ─────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            images={allImages}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNav={navigateLightbox}
            title={project.title}
            isRTL={isRTL}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
