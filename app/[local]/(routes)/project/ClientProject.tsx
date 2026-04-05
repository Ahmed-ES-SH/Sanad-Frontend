"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { directionMap } from "@/app/constants/constants";
import { portfolioData } from "@/app/constants/portfolioData";
import ProjectHero from "@/app/_components/_website/_singleProject/ProjectHero";
import ProjectBrief from "@/app/_components/_website/_singleProject/ProjectBrief";
import ProjectOverview from "@/app/_components/_website/_singleProject/ProjectOverview";
import ChallengeSolution from "@/app/_components/_website/_singleProject/ChallengeSolution";
import ProjectResults from "@/app/_components/_website/_singleProject/ProjectResults";
import ProjectTimeline from "@/app/_components/_website/_singleProject/ProjectTimeline";
import ProjectGallery from "@/app/_components/_website/_singleProject/ProjectGallery";
import Testimonial from "@/app/_components/_website/_singleProject/Testimonial";
import TechStack from "@/app/_components/_website/_singleProject/TechStack";
import RelatedProjects from "@/app/_components/_website/_singleProject/RelatedProjects";
import ProjectCTA from "@/app/_components/_website/_singleProject/ProjectCTA";
import LocalLink from "@/app/_components/_global/LocalLink";

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
        <LocalLink
          href={`/${local}/portfolio`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          {isRTL ? "العودة للمشاريع" : "Back to Portfolio"}
        </LocalLink>
      </div>
    </div>
  );
}

export default function ClientProject() {
  const { local } = useVariables();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const project = projectId
    ? portfolioData.find((p) => p.id === Number(projectId))
    : null;

  if (!project) return <ProjectNotFound local={local} />;

  const challenge = project.spotlight?.challenge || { en: "", ar: "" };
  const solution = project.spotlight?.solution || { en: "", ar: "" };
  const description = project.spotlight?.tagline
    ? { en: project.spotlight.tagline.en, ar: project.spotlight.tagline.ar }
    : project.description;

  return (
    <div
      dir={directionMap[local]}
      className="min-h-[100dvh]"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <ProjectHero project={project} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectBrief project={project} local={local} />
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
      <ProjectResults project={project} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectTimeline project={project} local={local} />
      <Testimonial project={project} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <ProjectGallery project={project} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <TechStack project={project} local={local} />

      {/* Divider */}
      <div className="c-container px-4">
        <div style={{ borderTop: "1px solid var(--surface-200)" }} />
      </div>

      <RelatedProjects currentProjectId={project.id} local={local} />
      <ProjectCTA local={local} />
    </div>
  );
}
