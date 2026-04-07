"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiFilter } from "react-icons/fi";

export function Filters() {
  const { local } = useVariables();
  const { ContactUsPage } = getTranslations(local);
  const t = ContactUsPage.Filters;

  return (
    <section className="bg-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 mb-8 shadow-sm border border-stone-200/50">
      <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-200/30 min-w-[240px]">
        <FiFilter className="text-stone-500" size={18} />
        <input
          className="bg-transparent border-0 focus:ring-0 text-sm w-full p-0 text-stone-700 placeholder-stone-400"
          placeholder={t.searchPlaceholder}
          type="text"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <select className="appearance-none bg-stone-50 border-0 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-stone-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer">
            <option>{t.statusAll}</option>
            <option>{t.unread}</option>
            <option>{t.replied}</option>
            <option>{t.archived}</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            expand_more
          </span>
        </div>
        <div className="relative">
          <select className="appearance-none bg-stone-50 border-0 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-stone-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer">
            <option>{t.categoryGeneral}</option>
            <option>{t.technicalSupport}</option>
            <option>{t.billing}</option>
            <option>{t.partnership}</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            expand_more
          </span>
        </div>
        <div className="relative">
          <select className="appearance-none bg-stone-50 border-0 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-stone-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer">
            <option>{t.priorityAll}</option>
            <option>{t.critical}</option>
            <option>{t.high}</option>
            <option>{t.medium}</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            expand_more
          </span>
        </div>
      </div>
    </section>
  );
}
