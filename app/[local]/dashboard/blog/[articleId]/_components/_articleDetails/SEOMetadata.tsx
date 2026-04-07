"use client";

import { HelpIcon } from "@/app/_components/_dashboard/DashboardPage/Tooltip";
import { Article } from "@/app/types/blog";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

export function SEOMetadata({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="surface-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-stone-50">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">
            SEO Metadata
          </h4>
          <HelpIcon content="SEO score measures how well your article is optimized for search engines. Higher scores improve visibility." />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <FiCheckCircle className="text-emerald-600" />
        </motion.div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
            Focus Keyword
          </label>
          <div className="bg-stone-50 px-3 py-2 rounded border border-stone-100 text-sm text-stone-900 font-medium">
            Sustainable Urban Architecture
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
            Meta Description
          </label>
          <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded border border-stone-100">
            Explore the latest trends in sustainable urban planning and
            biophilic architecture for 2024. Learn how cities are evolving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="h-full bg-emerald-500"
            />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase">
            85% Score
          </span>
        </div>
      </div>
    </motion.div>
  );
}
