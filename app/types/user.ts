export type UserRole = "admin" | "user";

export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  googleId: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  name?: string;
  avatar?: string;
  googleId?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
}
