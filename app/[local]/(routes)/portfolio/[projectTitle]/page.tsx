/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import React from "react";
import { portfolioData } from "@/app/constants/portfolioData";

interface PageParams {
  params: Promise<{ local: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageParams) {
  const { local } = await params;
  const { projectId } = await searchParams;

  const project = portfolioData.find((p) => p.id === Number(projectId));
  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  if (!project) {
    return {
      title: "Project — Sanad",
      description: "Explore our delivered projects.",
      ...sharedMetadata,
    };
  }

  return {
    title: `${project.title[local ?? "en"]} — Sanad`,
    description: project.description[local ?? "en"],
    ...sharedMetadata,
  };
}

export default async function ProjectPage({ params, searchParams }: PageParams) {
  const { local } = await params;
  const { projectId } = await searchParams;

  if (projectId) {
    redirect(`/${local}/project?projectId=${projectId}`);
  }

  redirect(`/${local}/project`);
}
