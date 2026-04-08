"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/user";
import { adminDeleteUser } from "@/app/actions/userActions";
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "sonner";

// ============================================================================
// USER TABLE - Displays users in a responsive table with actions
// Supports edit, delete, and shows user verification status
// ============================================================================

interface UserTableProps {
  users: User[];
  error?: string | null;
}

const ITEMS_PER_PAGE = 10;

export default function UserTable({ users, error }: UserTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ============================================================================
  // Handle user deletion with confirmation
  // ============================================================================
  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name || user.email}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(user.id);

    try {
      const result = await adminDeleteUser(user.id);

      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Refresh the page data
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("[UserTable] Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================================
  // Pagination logic
  // ============================================================================
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  // Reset to page 1 if users change
  useState(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  });

  // ============================================================================
  // Error state
  // ============================================================================
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-red-500 text-sm font-medium">
          Failed to load users: {error}
        </div>
      </div>
    );
  }

  // ============================================================================
  // Empty state
  // ============================================================================
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-stone-400 text-sm">
          No users found. Create your first user to get started.
        </div>
      </div>
    );
  }

  // ============================================================================
  // Generate initials for avatar fallback
  // ============================================================================
  const getInitials = (name: string | null): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ============================================================================
  // Format date for display
  // ============================================================================
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                {/* User Info */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                        src={user.avatar}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {user.name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-stone-400">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      user.role === "admin"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>

                {/* Verification Status */}
                <td className="px-6 py-5">
                  <div
                    className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-tight ${
                      user.isEmailVerified
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.isEmailVerified
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                    ></div>
                    {user.isEmailVerified ? "Verified" : "Pending"}
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-5 text-sm text-stone-500">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      className="p-2 text-stone-400 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                      title="Edit user"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      {deletingId === user.id ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <FiTrash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-stone-50 flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium">
            Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-stone-400 mx-1">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 transition-colors text-xs font-bold"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
