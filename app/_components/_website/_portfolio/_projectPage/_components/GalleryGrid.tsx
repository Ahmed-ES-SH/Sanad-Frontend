"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { ProjectImage } from "./ProjectImage";

export function GalleryGrid({
  images,
  title,
  isRTL,
  onOpen,
}: {
  images: string[];
  title: string;
  isRTL: boolean;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {images.map((img, idx) => (
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: idx * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={() => onOpen(idx)}
          className="block w-full overflow-hidden rounded-2xl cursor-zoom-in group text-left"
          style={{ border: "1px solid var(--surface-200)" }}
          aria-label={isRTL ? `عرض الصورة ${idx + 2}` : `View image ${idx + 2}`}
        >
          <ProjectImage
            src={img}
            alt={`${title} — ${isRTL ? `صورة ${idx + 2}` : `Image ${idx + 2}`}`}
            aspect="aspect-[3/2] lg:aspect-video"
          />
        </motion.button>
      ))}
    </div>
  );
}
