import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import AddUserClient from "@/app/_components/_dashboard/UsersPage/AddUserForm/AddUserClient";
import Link from "next/link";

export default function AddUserPage() {
  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/dashboard/users"
              className="text-sm font-medium text-stone-500 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Users
            </Link>
          </div>

          <AddUserClient />
        </div>
      </main>
    </>
  );
}
