import { QuickActions } from "@/app/_components/_dashboard/ContactUsPage/QuickActions";
import { StatsCards } from "@/app/_components/_dashboard/ContactUsPage/StatsCards";
import { Filters } from "@/app/_components/_dashboard/ContactUsPage/Filters";
import { MessagesTable } from "@/app/_components/_dashboard/ContactUsPage/MessagesTable";

export default function ContactUsPage() {
  return (
    <main className="pt-24 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
      {/* Row 1: Quick Actions */}
      <QuickActions />
      
      {/* Row 2: Stats Cards */}
      <StatsCards />
      
      {/* Row 3: Filters */}
      <Filters />
      
      {/* Row 4: Messages Table */}
      <MessagesTable />
    </main>
  );
}
