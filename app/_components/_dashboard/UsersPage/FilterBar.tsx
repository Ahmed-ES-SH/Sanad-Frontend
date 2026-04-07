"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiSearch } from "react-icons/fi";

export default function FilterBar() {
  const { local } = useVariables();
  const { UsersPage } = getTranslations(local);
  const t = UsersPage.FilterBar;

  return (
    <div className="bg-stone-50 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-center">
      <div className="relative grow w-full">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          size={18}
        />
        <input
          className="w-full bg-white border-none rounded-lg pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          placeholder={t.searchPlaceholder}
          type="text"
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <select className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-orange-500 min-w-[140px] cursor-pointer">
          <option>{t.allRoles}</option>
          <option>{t.admin}</option>
          <option>{t.manager}</option>
          <option>{t.client}</option>
        </select>
        <select className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-orange-500 min-w-[140px] cursor-pointer">
          <option>{t.status}</option>
          <option>{t.active}</option>
          <option>{t.inactive}</option>
        </select>
      </div>
    </div>
  );
}
