import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import { portfolioData } from "@/app/constants/portfolioData";
import ClientProject from "@/app/_components/_website/_portfolio/_projectPage/ClientProject";

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
    title: `${project.title[local as "en" | "ar"]} — Sanad`,
    description: project.description[local as "en" | "ar"],
    ...sharedMetadata,
  };
}

export default function ProjectPage() {
  return <ClientProject />;
}
