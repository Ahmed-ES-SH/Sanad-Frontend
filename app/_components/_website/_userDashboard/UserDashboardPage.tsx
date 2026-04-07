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
      <footer className="bg-surface-50 mt-12 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-400 font-medium">
            © 2024 Sanad Digital Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => comingSoon("Privacy Policy")}
              className="text-xs text-surface-400 hover:text-primary font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => comingSoon("Terms of Service")}
              className="text-xs text-surface-400 hover:text-primary font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Terms of Service
            </button>
            <button
              onClick={() => comingSoon("API Documentation")}
              className="text-xs text-surface-400 hover:text-primary font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              API Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
