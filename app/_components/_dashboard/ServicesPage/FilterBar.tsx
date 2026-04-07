"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiSearch, FiFilter } from "react-icons/fi";

const categories = [
  { value: "all", labelKey: "allCategories" },
  { value: "cloud", labelKey: "cloud" },
  { value: "security", labelKey: "security" },
  { value: "support", labelKey: "support" },
  { value: "data", labelKey: "dataSystems" },
];

const statuses = [
  { value: "active", labelKey: "statusActive" },
  { value: "pending", labelKey: "statusPending" },
  { value: "maintenance", labelKey: "statusMaintenance" },
];

const prices = [
  { value: "high-low", labelKey: "priceHighLow" },
  { value: "low-high", labelKey: "priceLowHigh" },
];

export default function FilterBar() {
  const { local } = useVariables();
  const { ServicesPage } = getTranslations(local);
  const t = ServicesPage.FilterBar;

  return (
    <section className="bg-stone-100 rounded-xl p-4 flex flex-wrap items-center gap-4">
      <div className="grow min-w-[200px]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input
            className="w-full bg-white border-none rounded-lg py-2 pl-10 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            placeholder={t.searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="w-full md:w-auto">
        <select className="bg-white border-none rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-1 focus:ring-orange-500 outline-none w-full appearance-none cursor-pointer">
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.labelKey}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto">
        <select className="bg-white border-none rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-1 focus:ring-orange-500 outline-none w-full appearance-none cursor-pointer">
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.labelKey}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto">
        <select className="bg-white border-none rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-1 focus:ring-orange-500 outline-none w-full appearance-none cursor-pointer">
          {prices.map((price) => (
            <option key={price.value} value={price.value}>
              {price.labelKey}
            </option>
          ))}
        </select>
      </div>

      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2">
        <FiFilter className="text-sm" />
        {t.applyFilters}
      </button>
    </section>
  );
}
