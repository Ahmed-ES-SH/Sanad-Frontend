export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  role: "admin" | "user";
  isEmailVerified: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
  token: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface ApiResponse<T = unknown> {
  statusCode?: number;
  message: string;
  error?: string;
  data?: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    user?: User;
    access_token?: string;
    userId?: number;
  };
}

export interface currentUserType {
  success: boolean;
  message: string;
  user?: User;
}
