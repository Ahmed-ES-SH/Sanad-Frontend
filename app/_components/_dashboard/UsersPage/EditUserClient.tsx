"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserUpdateFormData, UserRole } from "@/app/types/user";
import { adminUpdateUser, adminDeleteUser } from "@/app/actions/userActions";
import { toast } from "sonner";

// ============================================================================
// EDIT USER CLIENT - Admin form for updating existing users
// Supports partial updates, role changes, password resets, and deletion
// ============================================================================

interface EditUserClientProps {
  user: User;
  local: string;
}

export default function EditUserClient({ user, local }: EditUserClientProps) {
  const router = useRouter();

  // ============================================================================
  // Form state - initialized with existing user data
  // ============================================================================
  const [formData, setFormData] = useState<UserUpdateFormData>({
    email: user.email,
    name: user.name || "",
    avatar: user.avatar || "",
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    password: "", // Leave empty by default
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState(formData.avatar || "");

  // ============================================================================
  // Handle field changes
  // ============================================================================
  const handleChange = (field: keyof UserUpdateFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ============================================================================
  // Handle role selection
  // ============================================================================
  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  // ============================================================================
  // Submit update form - only sends changed fields
  // ============================================================================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build payload - only include non-empty/changed fields
      const payload: UserUpdateFormData = {};

      if (formData.email && formData.email !== user.email) {
        payload.email = formData.email;
      }
      if (formData.name !== undefined && formData.name !== (user.name || "")) {
        payload.name = formData.name;
      }
      if (formData.avatar !== undefined && formData.avatar !== (user.avatar || "")) {
        payload.avatar = formData.avatar;
      }
      if (formData.role && formData.role !== user.role) {
        payload.role = formData.role;
      }
      if (formData.isEmailVerified !== undefined && formData.isEmailVerified !== user.isEmailVerified) {
        payload.isEmailVerified = formData.isEmailVerified;
      }
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsSubmitting(false);
          return;
        }
        payload.password = formData.password;
      }

      // Only update if there are changes
      if (Object.keys(payload).length === 0) {
        toast.info("No changes detected");
        setIsSubmitting(false);
        return;
      }

      const result = await adminUpdateUser(user.id, payload);

      if (result.success) {
        toast.success(result.message);
        router.push(`/${local}/dashboard/users`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to update user");
      console.error("[EditUserClient] Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // Handle user deletion with confirmation
  // ============================================================================
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await adminDeleteUser(user.id);

      if (result.success) {
        toast.success(result.message);
        router.push(`/${local}/dashboard/users`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("[EditUserClient] Delete error:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // ============================================================================
  // Format date for display
  // ============================================================================
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Edit User</h1>
        <p className="text-stone-500 mt-1">
          Update user details, role, or reset password.
        </p>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-12 gap-8">
          {/* Main Form Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 mb-6">
                Basic Information
              </h2>
              <div className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-700">
                    Email {user.isEmailVerified && (
                      <span className="text-xs text-amber-600">(cannot change when verified)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange("email")}
                    disabled={user.isEmailVerified}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="user@example.com"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={handleChange("name")}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    placeholder="e.g. Ahmed Al-Saud"
                  />
                </div>

                {/* Avatar Preview */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-700">
                    Avatar
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="group relative w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 hover:border-orange-400 transition-all cursor-pointer"
                  >
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={user.name || "User avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className={`${formData.avatar ? "hidden" : ""} absolute inset-0 flex items-center justify-center bg-stone-100`}>
                      <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </button>
                  <p className="text-xs text-stone-500">Click to change avatar</p>
                </div>

                {/* Email Verification Toggle */}
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isEmailVerified"
                    checked={formData.isEmailVerified || false}
                    onChange={handleChange("isEmailVerified")}
                    className="w-4 h-4 text-orange-600 border-stone-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isEmailVerified" className="text-sm font-medium text-stone-700">
                    Email verified
                  </label>
                </div>
              </div>
            </div>

            {/* Security & Role */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 mb-6">
                Security & Role
              </h2>
              <div className="space-y-6">
                {/* Password Reset */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-700">
                    New Password <span className="text-xs text-stone-400">(leave empty to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange("password")}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    placeholder="Min. 6 characters"
                  />
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
                        checked={formData.role === "user"}
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
                            <p className="text-sm font-semibold">Standard User</p>
                            <p className="text-xs text-stone-500">Limited dashboard access</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        className="peer sr-only"
                        checked={formData.role === "admin"}
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
                            <p className="text-sm font-semibold">Administrator</p>
                            <p className="text-xs text-stone-500">Full system capabilities</p>
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
            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 border border-stone-200/50">
              <h4 className="text-sm font-semibold text-stone-900 mb-4">User Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">User ID</span>
                  <span className="font-medium text-stone-900">#{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Created</span>
                  <span className="font-medium text-stone-900">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Last Updated</span>
                  <span className="font-medium text-stone-900">{formatDate(user.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Google ID</span>
                  <span className="font-medium text-stone-900">{user.googleId ? "Linked" : "None"}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Danger Zone</h4>
              <p className="text-xs text-red-700 mb-4">
                Deleting a user is permanent and cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-stone-500 text-sm font-medium hover:text-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      {/* Avatar Edit Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Edit Avatar</h3>
            <p className="text-sm text-stone-600 mb-4">
              Enter the new image URL for the avatar.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  placeholder="https://example.com/avatar.jpg"
                  autoFocus
                />
                {!newAvatarUrl.trim() && (
                  <p className="text-xs text-red-500">URL is required</p>
                )}
              </div>
              {newAvatarUrl.trim() && (
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-200">
                    <img
                      src={newAvatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAvatarModal(false);
                  setNewAvatarUrl(formData.avatar || "");
                }}
                className="px-4 py-2 text-stone-600 text-sm font-medium hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newAvatarUrl.trim()) {
                    toast.error("URL is required");
                    return;
                  }
                  setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
                  setShowAvatarModal(false);
                  toast.success("Avatar updated");
                }}
                disabled={!newAvatarUrl.trim()}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Delete User</h3>
            <p className="text-sm text-stone-600 mb-6">
              Are you sure you want to delete <strong>{user.name || user.email}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-stone-600 text-sm font-medium hover:text-stone-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
