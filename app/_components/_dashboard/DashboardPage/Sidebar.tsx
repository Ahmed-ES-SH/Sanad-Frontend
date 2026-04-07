"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiLayout,
  FiUsers,
  FiTarget,
  FiTool,
  FiMail,
  FiCreditCard,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { IoMdClose } from "react-icons/io";

//////////////////////////////////////////////////////
///////  Nav item configuration — hrefs are framework-level
///////  paths, labels are resolved via translation keys
//////////////////////////////////////////////////////
const navItems = [
  { labelKey: "overview", href: "/dashboard", icon: FiLayout },
  { labelKey: "users", href: "/dashboard/users", icon: FiUsers },
  { labelKey: "projects", href: "/dashboard/projects", icon: FiTarget },
  { labelKey: "services", href: "/dashboard/services", icon: FiTool },
  { labelKey: "contactUs", href: "/dashboard/contactus", icon: FiMail },
  { labelKey: "payments", href: "/dashboard/payments", icon: FiCreditCard },
  { labelKey: "blog", href: "/dashboard/blog", icon: FiFileText },
];

export default function Sidebar() {
  const { local } = useVariables();
  const { logout, isLoading } = useAuth();

  const pathname = usePathname();
  const { DashboardPage } = getTranslations(local);
  const t = DashboardPage.Sidebar;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-9999 md:hidden" />

      <aside className="bg-stone-100 w-64 max-md:w-1/2 max-sm:w-3/4 z-99  flex flex-col h-screen py-4 shrink-0 max-md:fixed max-md:z-9999 sticky top-0 border-r border-gray-300 shadow-md max-md:left-0 max-md:top-0 max-md:pr-4">
        {/* overlay */}

        {/* close button */}
        <button className="ml-auto text-red-600 w-10 h-10 rounded-full flex items-center justify-center bg-red-400/10 hover:bg-red-400/20 transition-colors">
          <IoMdClose className="size-6" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 mt-6 lg:mt-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mx-2 flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Icon
                  className="mr-3 shrink-0"
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span>{item.labelKey}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 pt-4 mt-4 border-t border-stone-200/50">
          <div
            onClick={() => logout()}
            className="mx-2 cursor-pointer flex bg-red-400/60 text-white items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium hover:bg-red-400/60"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t.loggingOut}</span>
              </div>
            ) : (
              <>
                <FiLogOut className="mr-3 shrink-0" size={20} />
                <span>{t.logout}</span>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
