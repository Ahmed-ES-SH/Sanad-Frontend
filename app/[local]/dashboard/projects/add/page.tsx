import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import AddNewProject from "@/app/_components/_dashboard/ProjectsPage/AddNewProject";

export default function AddNewProjectPage() {
  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto">
        <AddNewProject />
      </main>
    </>
  );
}
