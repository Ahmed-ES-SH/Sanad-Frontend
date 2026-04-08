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

export async function getCurrentUserAction(): Promise<AuthResponse> {
  try {
    const user = await protectedRequest<User>(AUTH_ENDPOINTS.CURRENT_USER);

    return {
      success: true,
      message: "User fetched successfully",
      data: {
        user,
      },
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
