"use client";

import { useState, useMemo } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiSearch } from "react-icons/fi";
import { User, UserRole, UserFilterState } from "@/app/types/user";

// ============================================================================
// FILTER BAR - Filters user list by role, verification status, and search
// Provides controlled filter state for parent component consumption
// ============================================================================

interface FilterBarProps {
  users: User[];
  onFilterChange?: (filteredUsers: User[]) => void;
}

export default function FilterBar({ users, onFilterChange }: FilterBarProps) {
  const { local } = useVariables();
  const { UsersPage } = getTranslations(local);
  const t = UsersPage.FilterBar;

  // ============================================================================
  // Filter state - controlled inputs for search, role, and verification status
  // ============================================================================
  const [filters, setFilters] = useState<UserFilterState>({
    role: "all",
    status: "all",
    search: "",
  });

  // Apply filters whenever they change
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter by role
    if (filters.role !== "all") {
      result = result.filter((u) => u.role === filters.role);
    }

    // Filter by verification status
    if (filters.status === "verified") {
      result = result.filter((u) => u.isEmailVerified);
    } else if (filters.status === "unverified") {
      result = result.filter((u) => !u.isEmailVerified);
    }

    // Filter by search (name or email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(searchLower) ||
          (u.name && u.name.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [users, filters]);

  // Notify parent of filter changes
  useState(() => {
    if (onFilterChange) {
      onFilterChange(filteredUsers);
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      role: e.target.value as UserRole | "all",
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value as "all" | "verified" | "unverified",
    }));
  };

  return (
    <div className="bg-stone-50 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-center">
      <div className="relative grow w-full">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          size={18}
        />
        <input
          className="w-full bg-white border-none rounded-lg pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          placeholder={t.searchPlaceholder || "Search by name or email..."}
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <select
          className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-orange-500 min-w-[140px] cursor-pointer"
          value={filters.role}
          onChange={handleRoleChange}
        >
          <option value="all">{t.allRoles || "All Roles"}</option>
          <option value="admin">{t.admin || "Admin"}</option>
          <option value="user">User</option>
        </select>
        <select
          className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-orange-500 min-w-[140px] cursor-pointer"
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">{t.status || "Status"}</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
    </div>
  );
}
