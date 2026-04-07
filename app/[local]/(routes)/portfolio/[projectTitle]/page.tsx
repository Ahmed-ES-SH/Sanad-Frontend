import { notFound } from "next/navigation";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import { getProjectBySlug } from "@/app/actions/portfolioActions";
import ClientProject from "@/app/_components/_website/_portfolio/_projectPage/ClientProject";

interface PageParams {
  params: Promise<{ local: string; projectTitle: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { local, projectTitle } = await params;
  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  try {
    const project = await getProjectBySlug(projectTitle);
    return {
      title: `${project.title} — Sanad`,
      description: project.shortDescription,
      ...sharedMetadata,
    };
  } catch {
    return {
      title: translations.portfolioMeta?.title || "Project — Sanad",
      description:
        translations.portfolioMeta?.description ||
        "Explore our delivered projects.",
      ...sharedMetadata,
    };
  }
}

export default async function ProjectPage({ params }: PageParams) {
  const { local, projectTitle } = await params;
  const locale = (local === "ar" ? "ar" : "en") as "en" | "ar";

  let project;
  try {
    project = await getProjectBySlug(projectTitle);
  } catch {
    notFound();
  }

  return <ClientProject project={project} local={locale} />;
}
