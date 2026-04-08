"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import QuickActions from "./QuickActions";
import ChartsSection from "./ChartsSection";
import FilterBar from "./FilterBar";
import ServiceCards from "./ServiceCards";
import { Service } from "@/app/types/service";
import { PaginationMeta } from "@/app/types/blog";

interface ServicesContentProps {
  initialServices?: Service[];
  meta?: PaginationMeta;
}

export default function ServicesContent({
  initialServices = [],
  meta,
}: ServicesContentProps) {
  const { local } = useVariables();
  const { ServicesPage } = getTranslations(local);
  const t = ServicesPage;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-stone-50">
        {/* Page Header & Breadcrumb */}

        {/* Quick Action Cards (Bento Style) */}
        <QuickActions />

        {/* Charts Section */}
        <ChartsSection />

        {/* Search and Filter Bar */}
        <FilterBar />

        {/* Grid of Service Cards */}
        <ServiceCards initialServices={initialServices} />
      </main>
    </>
  );
}
