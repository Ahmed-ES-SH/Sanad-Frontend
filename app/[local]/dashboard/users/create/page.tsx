"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

// Placeholder for actual server action
const createUserAction = async (prevState: any, formData: FormData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Form Data:", Object.fromEntries(formData));
  return { success: true, message: "User created successfully!" };
};

export default function CreateUserPage() {
  const router = useRouter();
  const [formState, formAction] = useFormState(createUserAction, {
    success: false,
    message: "",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    await formAction(formData);
    setIsPending(false);

    if (formState.success) {
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="surface-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="heading-md text-surface-900 mb-1">Add New User</h1>
            <p className="body-sm text-surface-500">
              Create a new account for a team member or client.
            </p>
          </div>
          <Link href="/dashboard/users">
            <button type="button" className="surface-btn-secondary py-2 px-4 text-sm font-semibold">
              Back to Users
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block body-sm font-semibold text-surface-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="surface-input w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block body-sm font-semibold text-surface-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@sanad.com"
              required
              className="surface-input w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block body-sm font-semibold text-surface-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              required
              className="surface-input w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block body-sm font-semibold text-surface-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="surface-input w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2378716c%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
            >
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {formState.message && (
            <div
              className={`p-4 rounded-xl body-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                formState.success 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}
            >
              {formState.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || formState.success}
            className="surface-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating User...
              </span>
            ) : (
              "Add User Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
