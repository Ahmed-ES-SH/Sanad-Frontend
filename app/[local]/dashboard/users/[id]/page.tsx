import EditUserClient from "@/app/_components/_dashboard/UsersPage/EditUserClient";
import { adminGetUser } from "@/app/actions/userActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

// ============================================================================
// USER PROFILE PAGE - Server component that fetches single user data
// Passes data to EditUserClient for admin editing
// ============================================================================

interface PageProps {
  params: Promise<{ id: string; local: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id, local } = await params;

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
        <div className="w-full">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href={`/${local}/dashboard/users`}
              className="text-sm font-medium text-stone-500 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <BsArrowLeft className="w-4 h-4" />
              Back to Users
            </Link>
          </div>

          <EditUserClient user={user} local={local} />
        </div>
      </main>
    </>
  );
}
