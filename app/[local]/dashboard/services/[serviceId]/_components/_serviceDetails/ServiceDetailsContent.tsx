import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import ServiceHeader from "./ServiceHeader";
import StatsGrid from "./StatsGrid";
import ServiceOverview from "./ServiceOverview";
import PricingTable from "./PricingTable";
import CustomerAdoptionChart from "./CustomerAdoptionChart";
import ServiceConfiguration from "./ServiceConfiguration";
import TopCustomers from "./TopCustomers";
import RelatedServices from "./RelatedServices";

export default function ServiceDetailsContent() {
  return (
    <>
      <main className=" overflow-y-auto p-6 md:p-8 space-y-8 flex-1 w-full">
        {/* Service Header */}
        <ServiceHeader />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Wide) */}
          <div className="lg:col-span-2 space-y-8">
            <ServiceOverview />
            <PricingTable />
            <CustomerAdoptionChart />
          </div>

          {/* Right Column (Narrow) */}
          <div className="space-y-8">
            <ServiceConfiguration />
            <TopCustomers />
            <RelatedServices />
          </div>
        </div>
      </main>

      {/* Contextual FAB - Only for Mobile */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-surface-xl flex items-center justify-center hover:scale-110 hover:shadow-surface-lg transition-all">
        <span className="material-symbols-outlined">add</span>
      </button>
    </>
  );
}
