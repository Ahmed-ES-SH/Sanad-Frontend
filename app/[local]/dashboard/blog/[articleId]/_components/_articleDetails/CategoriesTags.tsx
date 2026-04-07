"use client";

import { Article } from "@/app/types/blog";
import { motion } from "framer-motion";
import { FiPlus, FiX, FiChevronDown } from "react-icons/fi";

export function CategoriesTags({ article }: { article: Article }) {
  const tags = [
    { label: "2024", removable: true },
    { label: "Green Building", removable: true },
    { label: "Urban Design", removable: true },
    { label: "Future", removable: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="surface-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-stone-50">
        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">
          Categories & Tags
        </h4>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-primary"
        >
          <FiPlus />
        </motion.button>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">
            Category
          </label>
          <div className="relative">
            <select className="surface-input w-full appearance-none cursor-pointer pr-10">
              <option>Architecture</option>
              <option>Urban Planning</option>
              <option>Sustainability</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    tag.label === "Future"
                      ? "0 2px 8px rgba(120, 113, 108, 0.3)"
                      : "0 2px 8px rgba(249, 115, 22, 0.3)",
                }}
                className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 cursor-default transition-shadow ${
                  tag.label === "Future"
                    ? "bg-stone-100 text-stone-500"
                    : "bg-primary-50 text-primary"
                }`}
              >
                {tag.label}
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer"
                >
                  <FiX className="text-[12px]" />
                </motion.span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
