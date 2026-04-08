import HeroWelcome from "@/app/_components/_dashboard/DashboardPage/HeroWelcome";
import KeyMetrics from "@/app/_components/_dashboard/DashboardPage/KeyMetrics";
import ActiveProjectsTable from "@/app/_components/_dashboard/DashboardPage/ActiveProjectsTable";
import ServicePerformance from "@/app/_components/_dashboard/DashboardPage/ServicePerformance";
import RecentActivity from "@/app/_components/_dashboard/DashboardPage/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-stone-50">
        <HeroWelcome />
        <KeyMetrics />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActiveProjectsTable />
          </div>
          <div className="space-y-6">
            <ServicePerformance />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
