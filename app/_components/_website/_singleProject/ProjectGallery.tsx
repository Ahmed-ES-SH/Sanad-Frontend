"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function ProjectGallery({ project, local }: Props) {
  const isRTL = local === "ar";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const images = project.gallery;

  if (!images?.length) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigate = (dir: 1 | -1) =>
    setLightboxIndex((prev) =>
      prev !== null ? ((prev + dir + images.length) % images.length) : 0
    );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(isRTL ? -1 : 1);
      if (e.key === "ArrowLeft") navigate(isRTL ? 1 : -1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, isRTL]);

  return (
    <section className="py-8">
      {/* Label */}
      <div className="c-container px-4">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="h-px w-8"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <span
            className="caption-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            {isRTL ? "معرض الصور" : "Gallery"}
          </span>
        </div>
      </div>

      {/* First image: full-bleed, extra tall */}
      <div className="c-container px-4 mb-3">
        <button
          onClick={() => openLightbox(0)}
          className="block w-full overflow-hidden rounded-xl cursor-pointer group bg-surface-100"
          aria-label={`${isRTL ? "عرض الصورة 1" : "View image 1"}`}
        >
          {imageErrors[0] ? (
            <div className="w-full aspect-[16/10] flex items-center justify-center">
              <FiImage className="w-12 h-12 text-surface-400" />
            </div>
          ) : (
            <img
              src={images[0]}
              alt={`${project.title[local]} — ${isRTL ? "صورة 1" : "Image 1"}`}
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              onError={() => handleImageError(0)}
            />
          )}
        </button>
      </div>

      {/* Remaining images: 2-col grid */}
      {images.length > 1 && (
        <div className="c-container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {images.slice(1).map((img, index) => {
              const globalIndex = index + 1;
              return (
                <button
                  key={globalIndex}
                  onClick={() => openLightbox(globalIndex)}
                  className="block overflow-hidden rounded-xl cursor-pointer group bg-surface-100"
                  aria-label={`${isRTL ? `عرض الصورة ${globalIndex + 1}` : `View image ${globalIndex + 1}`}`}
                >
                  {imageErrors[globalIndex] ? (
                    <div className="w-full aspect-[3/2] flex items-center justify-center">
                      <FiImage className="w-10 h-10 text-surface-400" />
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`${project.title[local]} — ${isRTL ? `صورة ${globalIndex + 1}` : `Image ${globalIndex + 1}`}`}
                      className="w-full aspect-[3/2] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      onError={() => handleImageError(globalIndex)}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${isRTL ? "عارض الصور" : "Image viewer"}`}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 end-4 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isRTL ? "إغلاق" : "Close"}
            >
              <FiX size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  className="absolute start-4 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={isRTL ? "التالي" : "Previous"}
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  className="absolute end-4 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={isRTL ? "السابق" : "Next"}
                >
                  <FiChevronRight size={24} />
                </button>
              </>
            )}

            {imageErrors[lightboxIndex] ? (
              <div className="w-full max-w-3xl aspect-[4/3] bg-surface-800 flex items-center justify-center rounded-lg">
                <FiImage className="w-16 h-16 text-surface-600" />
              </div>
            ) : (
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex]}
                alt={`${project.title[local]} — ${isRTL ? `صورة ${lightboxIndex + 1}` : `Image ${lightboxIndex + 1}`}`}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onError={() => handleImageError(lightboxIndex)}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/50" aria-live="polite">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
