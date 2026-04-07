"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import PortfolioCard from "./PortfolioCard";
import ProjectSpotlight from "./ProjectSpotlight";

const ITEMS_PER_LOAD = 6;

interface MappedProject {
  id: string | number;
  imgSrc: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: { en: string; ar: string };
  tools: string[];
  services: string[];
  metrics: { value: string; label: { en: string; ar: string } }[];
  year: string;
  featured?: boolean;
  spotlight?: Record<string, unknown>;
  gallery?: string[];
  longDescription?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  slug?: string;
  client?: { en: string; ar: string };
  duration?: { en: string; ar: string };
}

interface Props {
  projects: MappedProject[];
  local: "en" | "ar";
}

export default function PortfolioGrid({ projects, local }: Props) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [hasMore, setHasMore] = useState(projects.length > ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleProjects = useMemo(
    () => projects.slice(0, visibleCount),
    [projects, visibleCount]
  );

  // Find spotlight projects (featured ones) — from the filtered set only
  const spotlightProjects = useMemo(
    () => projects.filter((p) => p.featured && p.spotlight),
    [projects]
  );

  // Load more handler
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    requestAnimationFrame(() => {
      const nextCount = Math.min(visibleCount + ITEMS_PER_LOAD, projects.length);
      setVisibleCount(nextCount);
      setHasMore(nextCount < projects.length);
      setIsLoading(false);
    });
  }, [isLoading, hasMore, visibleCount, projects.length]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "400px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore, hasMore]);

  // Reset on project change (e.g., category filter)
  useEffect(() => {
    setVisibleCount(Math.min(ITEMS_PER_LOAD, projects.length));
    setHasMore(projects.length > ITEMS_PER_LOAD);
  }, [projects.length]);

  return (
    <section className="c-container px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project, index) => {
          const isHero = index === 0;
          return (
            <React.Fragment key={project.id}>
              <PortfolioCard
                project={project}
                index={index}
                isHero={isHero}
              />

              {/* Spotlight after every 6th project */}
              {spotlightProjects.length > 0 &&
                (index + 1) % 6 === 0 &&
                index + 1 < visibleCount && (
                  <div
                    className="sm:col-span-2 lg:col-span-3"
                    onMouseEnter={() => setIsSpotlightPaused(true)}
                    onMouseLeave={() => setIsSpotlightPaused(false)}
                  >
                    <ProjectSpotlight
                      projects={spotlightProjects as unknown as Parameters<typeof ProjectSpotlight>[0]['projects']}
                      local={local}
                      isPaused={isSpotlightPaused}
                    />
                  </div>
                )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Loading sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-12">
          {isLoading && (
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{
                borderColor: "var(--surface-200)",
                borderTopColor: "var(--primary)",
              }}
            />
          )}
        </div>
      )}

      {/* End message */}
      {!hasMore && visibleCount >= projects.length && (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: "var(--surface-400)" }}>
            {local === "ar" ? "عرضت جميع المشاريع" : "All projects shown"}
          </p>
        </div>
      )}
    </section>
  );
}
