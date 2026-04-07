"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTranslations } from "@/app/helpers/helpers";
import { useVariables } from "@/app/context/VariablesContext";

export function Filters() {
  const { local } = useVariables();
  const { BlogPage } = getTranslations(local);
  const t = BlogPage.Filters;
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col md:flex-row items-center gap-4 mb-6"
    >
      {/* Search Input - Always Visible */}
      <div className="relative grow w-full md:w-auto">
        <label htmlFor="article-search" className="sr-only">
          Search articles
        </label>
        <span
          className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        >
          search
        </span>
        <input
          id="article-search"
          className="w-full border border-stone-200 rounded-xl px-4 py-2 ps-10 pe-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
          placeholder={t.searchPlaceholder}
          type="text"
        />
      </div>

      {/* Essential Filters - Always Visible */}
      <div
        className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar"
        role="group"
        aria-label="Filter options"
      >
        <motion.label className="relative">
          <span className="sr-only">Filter by status</span>
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold appearance-none bg-size-[1.25em_1.25em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10 cursor-pointer"
          >
            <option>{t.statusAll}</option>
            <option>{t.published}</option>
            <option>{t.draft}</option>
            <option>{t.scheduled}</option>
          </motion.select>
        </motion.label>
        <motion.label className="relative">
          <span className="sr-only">Sort by date</span>
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold appearance-none bg-size-[1.25em_1.25em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10 cursor-pointer"
          >
            <option>{t.dateNewest}</option>
            <option>{t.oldest}</option>
          </motion.select>
        </motion.label>

        {/* More Filters Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgb(249 115 22)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowMoreFilters(!showMoreFilters);
            }
          }}
          aria-expanded={showMoreFilters}
          aria-controls="more-filters"
          className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${showMoreFilters ? "bg-orange-500 text-white" : "bg-stone-100 text-stone-600"}`}
        >
          <span
            className="material-symbols-outlined text-sm"
            aria-hidden="true"
          >
            tune
          </span>
        </motion.button>
      </div>

      {/* Expanded Filters - Hidden by Default */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            id="more-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pt-2 md:pt-0 border-t md:border-t-0 border-stone-200 md:border-none"
            role="group"
            aria-label="Additional filters"
          >
            <motion.label className="relative">
              <span className="sr-only">Filter by author</span>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold appearance-none bg-size-[1.25em_1.25em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10 cursor-pointer"
              >
                <option>{t.authorAll}</option>
                <option>Sarah J.</option>
                <option>Michael K.</option>
              </motion.select>
            </motion.label>
            <motion.label className="relative">
              <span className="sr-only">Filter by category</span>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold appearance-none bg-size-[1.25em_1.25em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10 cursor-pointer"
              >
                <option>{t.categoryAll}</option>
                <option>{t.technology}</option>
                <option>{t.editorial}</option>
              </motion.select>
            </motion.label>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
