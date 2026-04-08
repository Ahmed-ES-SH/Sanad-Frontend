import EditUserClient from "@/app/_components/_dashboard/UsersPage/EditUserClient";
import { adminGetUser } from "@/app/actions/userActions";
import { notFound } from "next/navigation";
import Link from "next/link";

// ============================================================================
// USER PROFILE PAGE - Server component that fetches single user data
// Passes data to EditUserClient for admin editing
// ============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;

  // ============================================================================
  // Fetch user data server-side
  // ============================================================================
  let user;
  try {
    user = await adminGetUser(id);
  } catch (error) {
    console.error(`[UserProfilePage] Failed to fetch user ${id}:`, error);
    notFound();
  }

  if (!user) {
    notFound();
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Users
            </Link>
          </div>

          <EditUserClient user={user} />
        </div>
      </main>
    </>
  );
}
