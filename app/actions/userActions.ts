"use server";

// ============================================================================
// USER ACTIONS - Server actions for admin user management
// All actions use protected requests with JWT Bearer token injection
// ============================================================================

import { revalidatePath } from "next/cache";
import { USER_ENDPOINTS } from "@/app/constants/endpoints";
import { protectedRequest, ApiError } from "@/lib/api-client";
import {
  User,
  UserFormData,
  UserUpdateFormData,
  UserListResponse,
  UserDeleteResponse,
  UserActionResult,
} from "@/app/types/user";

// ============================================================================
// CACHE TAG - Used for Next.js cache invalidation
// ============================================================================

const USERS_CACHE_TAG = "users";

// ============================================================================
// READ ACTIONS - Fetch users from backend
// ============================================================================

/**
 * adminGetUsers - Fetches all users from the backend
 * Returns the complete user list without pagination
 * Per backend plan: GET /users returns all users
 */
export async function adminGetUsers(): Promise<User[]> {
  try {
    const response = await protectedRequest<User[]>(
      USER_ENDPOINTS.ADMIN_LIST,
      "GET",
    );
    return response || [];
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("[UserActions] Failed to fetch users:", error.message);
      throw new Error(error.message);
    }
    console.error("[UserActions] Unknown error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * adminGetUser - Fetches a single user by ID
 * Per backend plan: GET /user/:id
 *
 * @param id - User ID to fetch
 * @returns User object
 */
export async function adminGetUser(id: string | number): Promise<User> {
  try {
    const response = await protectedRequest<User>(
      USER_ENDPOINTS.ADMIN_GET(id),
      "GET",
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[UserActions] Failed to fetch user ${id}:`, error.message);
      throw new Error(error.message);
    }
    console.error(`[UserActions] Unknown error fetching user ${id}:`, error);
    throw new Error("Failed to fetch user");
  }
}

// ============================================================================
// MUTATION ACTIONS - Create, Update, Delete users
// All mutations trigger revalidatePath to refresh the user list
// ============================================================================

/**
 * adminCreateUser - Creates a new user via admin dashboard
 * Per backend plan: POST /user
 * Business rules:
 * - Password must be min 6 characters (backend validates)
 * - Email must be unique
 * - Name must be unique (if provided)
 * - Default role is 'user' if not specified
 *
 * @param formData - User creation data
 * @returns Action result with success/error status
 */
export async function adminCreateUser(
  formData: UserFormData,
): Promise<UserActionResult> {
  try {
    // Build payload - only send non-empty values
    const payload: Record<string, unknown> = {
      email: formData.email,
      password: formData.password,
    };

    if (formData.name) payload.name = formData.name;
    if (formData.avatar) payload.avatar = formData.avatar;
    if (formData.role) payload.role = formData.role;

    const response = await protectedRequest<User>(
      USER_ENDPOINTS.ADMIN_CREATE,
      "POST",
      payload,
    );

    // Invalidate cache to refresh the user list
    revalidatePath("/dashboard/users", "page");

    return {
      success: true,
      message: "User created successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to create user",
    };
  }
}

/**
 * adminUpdateUser - Updates an existing user's details
 * Per backend plan: PATCH /user/:id
 * Business rules:
 * - Supports partial updates (only provided fields are modified)
 * - If isEmailVerified is true, email cannot be changed
 * - Password will be Argon2-hashed on backend
 * - Password min 6 characters when provided
 *
 * @param id - User ID to update
 * @param formData - Partial user data to update
 * @returns Action result with success/error status
 */
export async function adminUpdateUser(
  id: string | number,
  formData: UserUpdateFormData,
): Promise<UserActionResult> {
  try {
    // Build payload - only send provided fields
    const payload: Record<string, unknown> = {};

    if (formData.email !== undefined) payload.email = formData.email;
    if (formData.name !== undefined) payload.name = formData.name;
    if (formData.avatar !== undefined) payload.avatar = formData.avatar;
    if (formData.role !== undefined) payload.role = formData.role;
    if (formData.password !== undefined) payload.password = formData.password;
    if (formData.isEmailVerified !== undefined) {
      payload.isEmailVerified = formData.isEmailVerified;
    }

    const response = await protectedRequest<User>(
      USER_ENDPOINTS.ADMIN_UPDATE(id),
      "PATCH",
      payload,
    );

    // Invalidate cache to refresh the user list
    revalidatePath("/dashboard/users", "page");
    revalidatePath(`/dashboard/users/${id}`, "page");

    return {
      success: true,
      message: "User updated successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to update user",
    };
  }
}

/**
 * adminDeleteUser - Permanently deletes a user account
 * Per backend plan: DELETE /user/:id
 *
 * @param id - User ID to delete
 * @returns Action result with success/error status
 */
export async function adminDeleteUser(
  id: string | number,
): Promise<UserActionResult> {
  try {
    const response = await protectedRequest<UserDeleteResponse>(
      USER_ENDPOINTS.ADMIN_DELETE(id),
      "DELETE",
    );

    // Invalidate cache to refresh the user list
    revalidatePath("/dashboard/users", "page");

    return {
      success: true,
      message: "User deleted successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to delete user",
    };
  }
}
