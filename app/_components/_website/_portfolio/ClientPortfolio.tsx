"use client";
import { useMemo, useState, useCallback } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { portfolioData, categories } from "@/app/constants/portfolioData";
import { directionMap } from "@/app/constants/constants";
import PortfolioHero from "@/app/_components/_website/_portfolio/PortfolioHero";
import FilterBar from "@/app/_components/_website/_portfolio/FilterBar";
import PortfolioGrid from "@/app/_components/_website/_portfolio/PortfolioGrid";
import StatsBar from "@/app/_components/_website/_portfolio/StatsBar";
import PortfolioCTA from "@/app/_components/_website/_portfolio/PortfolioCTA";

export default function ClientPortfolio() {
  const { local } = useVariables();
  const allLabel = categories[0][local];
  const [selectedCategory, setSelectedCategory] = useState(allLabel);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === allLabel) return portfolioData;
    return portfolioData.filter(
      (project) => project.category[local] === selectedCategory,
    );
  }, [selectedCategory, allLabel, local]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div
      dir={directionMap[local]}
      className="min-h-dvh mt-6"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <PortfolioHero local={local} projectCount={portfolioData.length} />
      <FilterBar
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategoryChange}
        local={local}
      />
      <PortfolioGrid projects={filteredProjects} local={local} />
      <StatsBar local={local} />
      <PortfolioCTA local={local} />
    </div>
  );
}
