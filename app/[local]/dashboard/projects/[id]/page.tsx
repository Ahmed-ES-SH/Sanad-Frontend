// import EditProject from "@/app/_components/_dashboard/ProjectsPage/EditProject";
import { getCategories } from "@/app/actions/blogActions";
import { getAdminProjectById } from "@/app/actions/portfolioActions";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string; local: string }>;
}) {
  try {
    const { id } = await params;

    // Fetch project and categories in parallel
    const [project, categories] = await Promise.all([
      getAdminProjectById(id),
      getCategories(),
    ]);

    if (!project) {
      return notFound();
    }

    return (
      <main className="flex-1 overflow-y-auto bg-[#fff8f5] min-h-screen">
        {/* <EditProject project={project} categories={categories} /> */}
      </main>
    );
  } catch (error) {
    console.error("[EditProjectPage ERROR]:", error);
    return notFound();
  }
}
