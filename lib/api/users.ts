import { instance } from "@/lib/axios";
import { User, UsersPaginatedResponse } from "@/app/types/user";

/**
 * Fetch users with optional search and pagination
 * Uses the GET /api/user endpoint
 */
export async function fetchUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<UsersPaginatedResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const res = await instance.get<UsersPaginatedResponse>(`/user?${params.toString()}`);
  return res.data;
}

/**
 * Fetch all users without pagination (for broadcast select all)
 */
export async function fetchAllUsers(): Promise<User[]> {
  // According to USERS_PLAN.md, GET /user returns all users without pagination
  const res = await instance.get<User[]>("/user");
  return res.data;
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(id: number): Promise<User> {
  const res = await instance.get<User>(`/user/${id}`);
  return res.data;
}