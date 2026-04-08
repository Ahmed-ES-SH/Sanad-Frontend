import UserStats from "@/app/_components/_dashboard/UsersPage/UserStats";
import FilterBar from "@/app/_components/_dashboard/UsersPage/FilterBar";
import UserTable from "@/app/_components/_dashboard/UsersPage/UserTable";
import PendingBanner from "@/app/_components/_dashboard/UsersPage/PendingBanner";
import { adminGetUsers } from "@/app/actions/userActions";
import { User } from "@/app/types/user";
import { IoMdPersonAdd } from "react-icons/io";
import Link from "next/link";

// ============================================================================
// USERS PAGE - Server component that fetches all users from backend
// Data is passed down to client components for interactivity
// ============================================================================

export default async function UsersPage() {
  // Fetch users server-side for security and performance
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await adminGetUsers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load users";
    console.error("[UsersPage] Error loading users:", error);
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
              User Management
            </h2>
            <p className="text-stone-500 mt-1">
              Manage platform access, roles, and user permissions across
              departments.
            </p>
          </div>
          <Link
            href="/dashboard/users/add"
            className="bg-linear-to-br from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95"
          >
            <IoMdPersonAdd className="size-6" />
            Add New User
          </Link>
        </div>

        {/* Stats Cards */}
        <UserStats users={users} />

        {/* Filter Bar */}
        <FilterBar users={users} />

        {/* User Table */}
        <UserTable users={users} error={error} />

        {/* Pending Banner */}
        <PendingBanner users={users} />
      </main>
    </>
  );
}
