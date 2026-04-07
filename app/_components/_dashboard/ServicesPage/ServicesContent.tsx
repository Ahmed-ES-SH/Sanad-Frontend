"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import TopNavBar from "../DashboardPage/TopNavBar";
import QuickActions from "./QuickActions";
import ChartsSection from "./ChartsSection";
import FilterBar from "./FilterBar";
import ServiceCards from "./ServiceCards";

export default function ServicesContent() {
  const { local } = useVariables();
  const { ServicesPage } = getTranslations(local);
  const t = ServicesPage;

  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-stone-50">
        {/* Page Header & Breadcrumb */}
        <section>
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>{t.breadcrumbMain}</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-orange-600 font-medium">
              {t.breadcrumbServices}
            </span>
          </nav>
          <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.title}
          </h2>
        </section>

        {/* Quick Action Cards (Bento Style) */}
        <QuickActions />

        {/* Charts Section */}
        <ChartsSection />

        {/* Search and Filter Bar */}
        <FilterBar />

        {/* Grid of Service Cards */}
        <ServiceCards />
      </main>
    </>
  );
}
