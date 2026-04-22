"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, UserFilterState, UsersPaginatedResponse } from "@/app/types/user";
import { adminDeleteUser } from "@/app/actions/userActions";
import { toast } from "sonner";
import { useAppQuery } from "@/lib/hooks/useAppQuery";

import FilterBar from "./FilterBar";
import UserTable from "./UserTable";
import UserTableSkeleton from "./UserTableSkeleton";

// ============================================================================
// CLIENT USERS - Main client orchestrator component
// Manages server-side filtering, pagination via API calls
// ============================================================================

interface ClientUsersProps {
  initialData: User[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
  pendingUsers: number;
}

export default function ClientUsers({
  initialData,
  total: initialTotal,
  page: initialPage,
  perPage,
  lastPage: initialLastPage,
  pendingUsers,
}: ClientUsersProps) {
  const router = useRouter();

  // Filter state - controlled inputs for search, role, and verification status
  const [filters, setFilters] = useState<UserFilterState>({
    role: "all",
    status: "all",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Build query string with filters and pagination
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", perPage.toString());

    if (filters.role && filters.role !== "all") {
      params.set("role", filters.role);
    }

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    if (filters.search && filters.search.trim()) {
      params.set("search", filters.search.trim());
    }

    return params.toString();
  }, [currentPage, perPage, filters]);

  // Fetch users with filters from server
  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useAppQuery<UsersPaginatedResponse, Error>({
    queryKey: ["users", filters.role, filters.status, filters.search, currentPage],
    endpoint: `/api/user?${queryParams}`,
    config: {
      method: "GET",
    },
    enabled: true,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  });

  // Get users and pagination data from server response
  const userData: UsersPaginatedResponse = usersResponse || {
    data: initialData,
    total: initialTotal,
    page: currentPage,
    perPage,
    lastPage: initialLastPage,
  };

  const users: User[] = userData.data || [];
  const total = userData.total || 0;
  const serverLastPage = userData.lastPage || 1;

  // Update filters and reset to page 1
  const updateFilters = useCallback((newFilters: UserFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Handle user deletion with confirmation
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
        router.refresh();
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("[ClientUsers] Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar onFilterChange={updateFilters} />

      {/* Loading State - Show Skeleton */}
      {isLoading ? (
        <UserTableSkeleton rows={perPage} />
      ) : (
        /* User Table with Pagination */
        <UserTableWithPagination
          users={users}
          currentPage={currentPage}
          totalPages={serverLastPage}
          total={total}
          perPage={perPage}
          onPageChange={handlePageChange}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}

// ============================================================================
// USER TABLE WITH PAGINATION - Wraps UserTable with pagination controls
// ============================================================================

interface UserTableWithPaginationProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onDelete: (user: User) => void;
  deletingId: number | null;
}

function UserTableWithPagination({
  users,
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
  onDelete,
  deletingId,
}: UserTableWithPaginationProps) {
  const startIndex = (currentPage - 1) * perPage;

  // Error state
  if (users.length === 0 && total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-stone-400 text-sm">
          No users found. Create your first user to get started.
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-stone-400 text-sm">
          No users found matching your filters.
        </div>
      </div>
    );
  }

  return (
    <>
      <UserTable
        users={users}
        onDelete={onDelete}
        deletingId={deletingId}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium">
            Showing {startIndex + 1}-{Math.min(startIndex + perPage, total)} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
                  onClick={() => onPageChange(page)}
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
                  onClick={() => onPageChange(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 transition-colors text-xs font-bold"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}