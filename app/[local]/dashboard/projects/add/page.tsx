import AddNewProject from "@/app/_components/_dashboard/ProjectsPage/AddNewProject";
import { getCategories } from "@/app/actions/blogActions";

export default async function AddNewProjectPage() {
  const categories = await getCategories();

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <AddNewProject categories={categories} />
      </main>
    </>
  );
}
