"use server";

import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/app/constants/endpoints";
import { setAuthCookie, getAuthCookie, deleteAuthCookie } from "@/lib/session";
import {
  publicRequest,
  protectedRequest,
  logoutBackend,
  ApiError,
} from "@/lib/api-client";
import {
  AuthResponse,
  currentUserType,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  User,
} from "@/lib/types/auth";
import { toast } from "sonner";

export async function loginAction(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  try {
    const response = await publicRequest<{
      user: User;
      access_token: string;
    }>(AUTH_ENDPOINTS.LOGIN, "POST", credentials);

    if (!response.access_token) {
      return {
        success: false,
        message: response.user
          ? "you need to verify your email first"
          : "Invalid credentials",
      };
    }

    await setAuthCookie(response.access_token);

    return {
      success: true,
      message: "Login successful",
      data: {
        user: response.user,
        access_token: response.access_token,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function registerAction(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  try {
    const response = await publicRequest<{
      user: User;
    }>(USER_ENDPOINTS.CREATE_USER, "POST", {
      name: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
    });

    return {
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        user: response.user,
      },
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
      message: "An unexpected error occurred",
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const token = await getAuthCookie();

    if (token) {
      try {
        await logoutBackend(token);
      } catch (error) {
        console.log(error);
        toast.error("Failed to logout from backend");
      }
    }

    await deleteAuthCookie();

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    await deleteAuthCookie();
    return {
      success: true,
      message: "Logged out successfully",
    };
  }
}

export async function getCurrentUserAction(): Promise<currentUserType> {
  try {
    const user = await protectedRequest<User>(AUTH_ENDPOINTS.CURRENT_USER);

    return {
      success: true,
      message: "User fetched successfully",
      user: user,
    };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }
    return {
      success: false,
      message: "Failed to fetch user data",
    };
  }
}

export async function sendResetLinkAction(
  email: string,
): Promise<AuthResponse> {
  try {
    await publicRequest(AUTH_ENDPOINTS.RESET_PASSWORD_SEND, "POST", {
      email,
    });

    return {
      success: true,
      message:
        "If an account exists with this email, a reset link has been sent.",
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
      message: "An unexpected error occurred",
    };
  }
}

export async function verifyResetTokenAction(
  token: string,
  email: string,
): Promise<AuthResponse> {
  try {
    const response = await publicRequest<{ userId: number }>(
      AUTH_ENDPOINTS.RESET_PASSWORD_VERIFY,
      "POST",
      { token, email },
    );

    return {
      success: true,
      message: "Token is valid",
      data: {
        userId: response.userId,
      },
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
      message: "An unexpected error occurred",
    };
  }
}

export async function resetPasswordAction(
  credentials: ResetPasswordCredentials,
): Promise<AuthResponse> {
  try {
    await publicRequest(AUTH_ENDPOINTS.RESET_PASSWORD, "POST", credentials);

    return {
      success: true,
      message: "Password changed successfully",
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
      message: "An unexpected error occurred",
    };
  }
}

export async function verifyEmailAction(token: string): Promise<AuthResponse> {
  try {
    await publicRequest(
      `${AUTH_ENDPOINTS.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`,
      "POST",
    );

    return {
      success: true,
      message: "Email verified successfully",
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
      message: "An unexpected error occurred",
    };
  }
}

// ============================================================================
// PROFILE UPDATE - Update current user's profile
// ============================================================================

interface ProfileUpdateData {
  name?: string;
  avatar?: string;
  password?: string;
}

/**
 * updateProfileAction - Updates the current user's profile
 * Supports partial updates for name, avatar, and password
 * Email cannot be changed (it's marked as verified/readonly)
 *
 * @param profileData - Profile data to update
 * @returns AuthResponse with success/error status
 */
export async function updateProfileAction(
  profileData: ProfileUpdateData,
): Promise<AuthResponse> {
  try {
    // First get current user to retrieve their ID
    const currentUser = await protectedRequest<User>(AUTH_ENDPOINTS.CURRENT_USER);

    if (!currentUser || !currentUser.id) {
      return {
        success: false,
        message: "Unable to fetch current user",
      };
    }

    const payload: Record<string, unknown> = {};

    if (profileData.name !== undefined) payload.name = profileData.name;
    if (profileData.avatar !== undefined) payload.avatar = profileData.avatar;
    if (profileData.password !== undefined) payload.password = profileData.password;

    const updatedUser = await protectedRequest<User>(
      USER_ENDPOINTS.UPDATE_USER(currentUser.id),
      "PATCH",
      payload,
    );

    return {
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
