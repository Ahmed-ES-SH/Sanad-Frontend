"use client";

import { motion } from "framer-motion";
import { FiPlusCircle, FiDownload } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

export default function HeroWelcome() {
  const { local } = useVariables();
  const { DashboardPage } = getTranslations(local);
  const t = DashboardPage.HeroWelcome;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white flex flex-col md:flex-row justify-between items-center gap-6 border border-stone-200"
    >
      <div className="relative z-10 space-y-2 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
          {t.greeting}
        </h2>
        <p className="text-stone-600 max-w-lg">{t.subtitle}</p>
        <div className="pt-4 flex gap-3 justify-center md:justify-start">
          <button className="px-6 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-orange-600 transition-colors active:bg-orange-700">
            <FiPlusCircle size={18} />
            {t.newProjectBtn}
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors border border-stone-200">
            <FiDownload size={16} className="inline mr-1.5" />
            {t.downloadReportBtn}
          </button>
        </div>
      </div>

      <div className="relative w-28 h-28 hidden lg:block">
        <div className="absolute inset-0 bg-orange-100 rounded-full" />
        <div className="absolute inset-3 bg-orange-200 rounded-full" />
        <div className="absolute inset-6 bg-orange-500 rounded-full flex items-center justify-center text-white">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
    </motion.section>
  );
}
