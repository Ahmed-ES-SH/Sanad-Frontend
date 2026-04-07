import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import UserStats from "@/app/_components/_dashboard/UsersPage/UserStats";
import FilterBar from "@/app/_components/_dashboard/UsersPage/FilterBar";
import UserTable from "@/app/_components/_dashboard/UsersPage/UserTable";
import PendingBanner from "@/app/_components/_dashboard/UsersPage/PendingBanner";

export default function UsersPage() {
  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
              User Management
            </h2>
            <p className="text-stone-500 mt-1">
              Manage platform access, roles, and user permissions across departments.
            </p>
          </div>
          <button className="bg-gradient-to-br from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <UserStats />

        {/* Filter Bar */}
        <FilterBar />

        {/* User Table */}
        <UserTable />

        {/* Pending Banner */}
        <PendingBanner />
      </main>
    </>
  );
}