"use client";

import UserDashboardHeader from "./UserDashboardHeader";
import UserProfileHeader from "./UserProfileHeader";
import StatsRow from "./StatsRow";
import QuickStartBanner from "./QuickStartBanner";
import QuickActions from "./QuickActions";
import ActiveDeliverables from "./ActiveDeliverables";
import QuickSettings from "./QuickSettings";
import RecentActivityTable from "./RecentActivityTable";
import { comingSoon } from "./lib";

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserDashboardHeader />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
        <UserProfileHeader />
        <StatsRow />
        <QuickStartBanner />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActiveDeliverables />
          </div>
          <div className="lg:col-span-1">
            <QuickSettings />
          </div>
        </div>
        <RecentActivityTable />
      </main>
    </div>
  );
}
