"use client";
import { useState, useEffect } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { directionMap } from "@/app/constants/constants";
import PortfolioHero from "@/app/_components/_website/_portfolio/PortfolioHero";
import PortfolioGrid from "@/app/_components/_website/_portfolio/PortfolioGrid";
import StatsBar from "@/app/_components/_website/_portfolio/StatsBar";
import PortfolioCTA from "@/app/_components/_website/_portfolio/PortfolioCTA";
import { getPublishedProjects } from "@/app/actions/portfolioActions";
import type { Project } from "@/app/types/project";

// Map API Project to the shape expected by existing UI components
function mapProjectToLocal(project: Project) {
  return {
    id: project.id,
    imgSrc: project.coverImageUrl || "",
    gallery: project.images || [],
    title: { en: project.title, ar: project.title },
    description: {
      en: project.shortDescription,
      ar: project.shortDescription,
    },
    category: {
      en: project.category?.name || "Other",
      ar: project.category?.name || "أخرى",
    },
    tools: project.techStack || [],
    services: [],
    metrics: [],
    year: new Date(project.createdAt).getFullYear().toString(),
    featured: project.isFeatured,
    longDescription: project.longDescription,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    slug: project.slug,
  };
}

export default function ClientPortfolio() {
  const { local } = useVariables();
  const [projects, setProjects] = useState<
    ReturnType<typeof mapProjectToLocal>[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const result = await getPublishedProjects();
        if (!cancelled) {
          setProjects(result.data.map(mapProjectToLocal));
        }
      } catch {
        if (!cancelled) {
          setError(
            local === "ar"
              ? "فشل في تحميل المشاريع"
              : "Failed to load projects",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [local]);

  if (loading) {
    return (
      <div
        dir={directionMap[local]}
        className="min-h-dvh mt-6 flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-50)" }}
      >
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--surface-200)",
            borderTopColor: "var(--primary)",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={directionMap[local]}
        className="min-h-dvh mt-6 flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-50)" }}
      >
        <p className="text-lg" style={{ color: "var(--surface-500)" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={directionMap[local]}
      className="min-h-dvh mt-6"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <PortfolioHero local={local} projectCount={projects.length} />
      <PortfolioGrid projects={projects} local={local} />
      <StatsBar local={local} />
      <PortfolioCTA local={local} />
    </div>
  );
}
