"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import {
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  lastActive: string;
  avatar?: string;
  initials?: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Hassan Al-Fahad",
    email: "hassan.f@sanad.tech",
    role: "Manager",
    status: "Active",
    lastActive: "Today, 09:42 AM",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Layla Rashid",
    email: "l.rashid@client.com",
    role: "Client",
    status: "Active",
    lastActive: "Yesterday, 11:20 PM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Zaid Amari",
    email: "z.amari@contractor.io",
    role: "Manager",
    status: "Inactive",
    lastActive: "14 Oct, 2023",
    initials: "ZA",
  },
  {
    id: 4,
    name: "Omar Farooq",
    email: "omar.admin@sanad.tech",
    role: "Admin",
    status: "Active",
    lastActive: "Just now",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

export default function UserTable() {
  const { local } = useVariables();
  const { UsersPage } = getTranslations(local);
  const t = UsersPage.UserTable;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.user}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.role}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.status}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.lastActive}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                        src={user.avatar}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-sm">
                        {user.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      user.role === "Admin"
                        ? "bg-orange-100 text-orange-700"
                        : user.role === "Manager"
                          ? "bg-stone-100 text-stone-600"
                          : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div
                    className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-tight ${
                      user.status === "Active"
                        ? "text-green-600"
                        : "text-stone-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status === "Active"
                          ? "bg-green-500"
                          : "bg-stone-400"
                      }`}
                    ></div>
                    {user.status}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-stone-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-stone-400 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-stone-50 flex items-center justify-between">
        <p className="text-xs text-stone-500 font-medium">{t.showingText}</p>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors disabled:opacity-30"
            disabled
          >
            <FiChevronLeft size={18} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 transition-colors text-xs font-bold">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 transition-colors text-xs font-bold">
            3
          </button>
          <span className="text-stone-400 mx-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 transition-colors text-xs font-bold">
            128
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 transition-colors">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
