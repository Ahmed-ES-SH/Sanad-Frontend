"use client";
import Link from "next/link";
import { useVariables } from "@/app/context/VariablesContext";
import { directionMap } from "@/app/constants/constants";
import type { Project } from "@/app/types/project";
import {
  ProjectHero,
  ProjectBrief,
  ProjectOverview,
  ChallengeSolution,
  ProjectResults,
  ProjectTimeline,
  ProjectGallery,
  Testimonial,
  TechStack,
  RelatedProjects,
  ProjectCTA,
} from "./index";

// Adapter: map API Project to PortfolioProject-compatible shape
function adaptProject(project: Project) {
  const title = { en: project.title, ar: project.title };
  const shortDesc = {
    en: project.shortDescription,
    ar: project.shortDescription,
  };
  const longDesc = project.longDescription
    ? { en: project.longDescription, ar: project.longDescription }
    : shortDesc;
  const category = {
    en: project.category?.name || "Other",
    ar: project.category?.name || "أخرى",
  };

  return {
    ...project,
    id: Number(project.id), // numeric id for legacy components
    imgSrc: project.coverImageUrl || "",
    title,
    description: shortDesc,
    category,
    tools: project.techStack || [],
    services: [],
    metrics: [],
    year: new Date(project.createdAt).getFullYear().toString(),
    client: { en: "N/A", ar: "N/A" },
    duration: { en: "N/A", ar: "N/A" },
    gallery: project.images || [],
    featured: project.isFeatured,
    spotlight: project.longDescription
      ? {
          tagline: {
            en: project.shortDescription,
            ar: project.shortDescription,
          },
          challenge: { en: "", ar: "" },
          solution: { en: "", ar: "" },
          coverImage: project.coverImageUrl || project.images?.[0] || "",
          liveUrl: project.liveUrl || undefined,
          process: [],
          testimonial: undefined,
        }
      : undefined,
    longDescription: longDesc,
  };
}

function ProjectNotFound({ local }: { local: "en" | "ar" }) {
  const isRTL = local === "ar";
  return (
    <div
      dir={directionMap[local]}
      className="min-h-[60vh] flex items-center justify-center"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <div className="c-container px-4 text-center max-w-md">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ backgroundColor: "var(--surface-100)" }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: "var(--surface-400)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1
          className="heading-lg font-display mb-2"
          style={{ color: "var(--surface-900)" }}
        >
          {isRTL ? "المشروع غير موجود" : "Project Not Found"}
        </h1>
        <p className="body mb-8" style={{ color: "var(--surface-500)" }}>
          {isRTL
            ? "عذراً، لم نتمكن من العثور على المشروع الذي تبحث عنه."
            : "Sorry, we couldn't find the project you're looking for."}
        </p>
        <Link
          href={`/${local}/portfolio`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
          }}
        >
          {isRTL ? "العودة للمشاريع" : "Back to Portfolio"}
        </Link>
      </div>
    </div>
  );
}

interface Props {
  project: Project;
  local: "en" | "ar";
}

export default function ClientProject({ project, local }: Props) {
  const adapted = adaptProject(project);

  const challenge = adapted.spotlight?.challenge || { en: "", ar: "" };
  const solution = adapted.spotlight?.solution || { en: "", ar: "" };
  const description = adapted.spotlight?.tagline
    ? adapted.spotlight.tagline
    : adapted.description;

  return (
    <div
      dir={directionMap[local]}
      className="min-h-dvh"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <ProjectHero project={adapted} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectBrief project={adapted} local={local} />
      <ProjectOverview description={description} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      {challenge.en && (
        <ChallengeSolution
          challenge={challenge}
          solution={solution}
          local={local}
        />
      )}
      <ProjectResults project={adapted} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectTimeline project={adapted} local={local} />
      <Testimonial project={adapted} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectGallery project={adapted} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <TechStack project={adapted} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <RelatedProjects currentProjectId={adapted.id} local={local} />
      <ProjectCTA local={local} />
    </div>
  );
}
