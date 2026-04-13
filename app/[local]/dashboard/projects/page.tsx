import { getAdminProjects } from "@/app/actions/portfolioActions";
import { getCategories } from "@/app/actions/blogActions";
import ProjectsFilterBar from "./_components/ProjectsFilterBar";
import ProjectsClientTable from "./_components/ProjectsClientTable";

export default async function ProjectsPage() {
  const [projectsResult, categories] = await Promise.all([
    getAdminProjects({ page: 1, limit: 1000 }),
    getCategories(),
  ]);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <ProjectsFilterBar categories={categories} />
      <ProjectsClientTable
        initialProjects={projectsResult.data}
        initialMeta={projectsResult.meta}
        categories={categories}
      />
    </main>
  );
}
