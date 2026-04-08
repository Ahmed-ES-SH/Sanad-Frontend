"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AvatarUpload from "./AvatarUpload";
import { adminCreateUser } from "@/app/actions/userActions";
import { UserFormData, UserRole } from "@/app/types/user";
import { toast } from "sonner";

// ============================================================================
// ADD USER CLIENT - Admin form for creating new users
// Validates input and submits to server action for backend creation
// ============================================================================

type FormState = "idle" | "submitting" | "success";

const rolePermissions: Record<UserRole, { title: string; items: string[] }> = {
  user: {
    title: "Standard User Permissions",
    items: [
      "View personal dashboard",
      "Edit own profile",
      "Access assigned content",
    ],
  },
  admin: {
    title: "Administrator Permissions",
    items: [
      "Full dashboard access",
      "User management",
      "System settings",
      "Content moderation",
    ],
  },
};

const FORM_KEY = "add-user-draft";

interface DraftFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  avatar: string;
}

export default function AddUserClient() {
  const router = useRouter();

  // ============================================================================
  // Form state - matches backend DTO structure
  // ============================================================================
  const [form, setForm] = useState<DraftFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    avatar: "",
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formState, setFormState] = useState<FormState>("idle");

  // ============================================================================
  // Restore draft on mount from localStorage
  // ============================================================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DraftFormData>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  // ============================================================================
  // Persist draft on change to localStorage
  // ============================================================================
  useEffect(() => {
    try {
      localStorage.setItem(FORM_KEY, JSON.stringify(form));
    } catch {
      /* storage full — ignore */
    }
  }, [form]);

  const clearDraft = () => {
    localStorage.removeItem(FORM_KEY);
  };

  // ============================================================================
  // Handle field changes with error clearing
  // ============================================================================
  const handleChange =
    (field: keyof DraftFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setForm({ ...form, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleRoleChange = (role: UserRole) => {
    setForm({ ...form, role });
  };

  // ============================================================================
  // Validation - matches backend requirements
  // ============================================================================
  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (min 6 per backend plan, using 8 for security)
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    // Confirm password match
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // Form submission - calls server action
  // ============================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    try {
      // Build form data matching backend DTO
      const userData: UserFormData = {
        email: form.email,
        password: form.password,
        name: form.name || "",
        avatar: form.avatar || "",
        role: form.role,
        isEmailVerified: false, // Default for new users
      };

      const result = await adminCreateUser(userData);

      if (result.success) {
        setFormState("success");
        clearDraft();
        toast.success(result.message);

        // Redirect after success
        setTimeout(() => {
          router.push("/dashboard/users");
        }, 1500);
      } else {
        toast.error(result.message);
        setFormState("idle");
      }
    } catch (err) {
      toast.error("Failed to create user");
      console.error("[AddUserClient] Create error:", err);
      setFormState("idle");
    }
  };

  const handleDiscard = () => {
    clearDraft();
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      avatar: "",
    });
    setErrors({});
  };

  const isRTL = false; /* wire to useVariables() when locale is enabled */
  const permissions = rolePermissions[form.role];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Add New User</h1>
        <p className="text-stone-500 mt-1">Add a new user to Sanad.</p>
      </div>

      {formState === "success" ? (
        /* Success State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            User Created Successfully
          </h2>
          <p className="text-stone-500 mt-1 text-sm">
            Redirecting to users list...
          </p>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className={formState === "success" ? "mt-8" : ""}
      >
        <div className="grid grid-cols-12 gap-8">
          {/* Main Form Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 mb-6">
                Basic Information
              </h2>
              <div className="space-y-6">
                <AvatarUpload
                  onAvatarChange={(url) => setForm({ ...form, avatar: url })}
                />
                <div className="space-y-5">
                  {/* Email — required, first */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-stone-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      autoComplete="email"
                      className={`w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none ${
                        errors.email ? "border-red-400" : ""
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Name — optional, second */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-stone-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      autoComplete="name"
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Sultan Al-Rashid"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Access */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 mb-6">
                Credentials &amp; Role
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-stone-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={handleChange("password")}
                      autoComplete="new-password"
                      className={`w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none ${
                        errors.password ? "border-red-400" : ""
                      }`}
                      placeholder="At least 8 characters"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-stone-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      autoComplete="new-password"
                      className={`w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none ${
                        errors.confirmPassword ? "border-red-400" : ""
                      }`}
                      placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Assignment */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-stone-700">
                    Role
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        className="peer sr-only"
                        checked={form.role === "user"}
                        onChange={() => handleRoleChange("user")}
                      />
                      <div className="p-4 rounded-xl border-2 border-stone-200 bg-stone-50 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 peer-checked:bg-orange-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-stone-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              Standard User
                            </p>
                            <p className="text-xs text-stone-500">
                              Limited dashboard access
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        className="peer sr-only"
                        checked={form.role === "admin"}
                        onChange={() => handleRoleChange("admin")}
                      />
                      <div className="p-4 rounded-xl border-2 border-stone-200 bg-stone-50 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 peer-checked:bg-orange-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-stone-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              Administrator
                            </p>
                            <p className="text-xs text-stone-500">
                              Full system capabilities
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Role Permissions Summary */}
            <div className="bg-white rounded-xl p-6 border border-stone-200/50">
              <h4 className="text-sm font-semibold text-stone-900 mb-3">
                {permissions.title}
              </h4>
              <ul className="space-y-2">
                {permissions.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-stone-600"
                  >
                    <svg
                      className="w-4 h-4 mt-0.5 text-orange-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-2.5 text-stone-500 text-sm font-medium hover:text-stone-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="px-10 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {formState === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
