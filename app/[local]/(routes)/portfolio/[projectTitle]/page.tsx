/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectDetailsPage from "@/app/_components/_website/_projectPage/ProjectDetailsPage";
import React, { Suspense } from "react";
import Loading from "../../services/[serviceTitle]/loading";
import { projectsData } from "@/app/constants/projects";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";

export async function generateMetadata({ params, searchParams }: any) {
  const { local } = await params;
  const { projectId } = await searchParams;

  const project: any = projectsData.find(
    (service) => service.id === Number(projectId)
  );

  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  if (!project) {
    return {
      title: "project Title",
      description: "project Description",
      ...sharedMetadata,
    };
  }

  return {
    title: `Madad Project - ${project.title[local ?? "en"]}`,
    description: project.description[local ?? "en"],
    ...sharedMetadata,
  };
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectDetailsPage />;
    </Suspense>
  );
}
