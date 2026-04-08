"use client";

import { FiSearch, FiMenu } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import LocaleLink from "../../_global/LocaleLink";
import UserButton from "../../_global/UserButton";
import DropdownNotifications from "./DropdownNotifications";
import DropdownSettings from "./DropdownSettings";

const routeLabels: Record<string, string> = {
  dashboard: "Overview",
  projects: "Projects",
  "projects/add": "Add New Project",
  services: "Services",
  "services/add": "Add New Service",
  users: "Users",
  "users/add": "Add New User",
  payments: "Payments & Billing",
  blog: "Blog",
  "blog/add": "Add New Post",
  contactus: "Contact Submissions",
};

function buildBreadcrumb(pathname: string, local: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbLabels: { label: string; href: string }[] = [];
  let href = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    // Skip locale segment
    if (i === 0 && segment === local) continue;
    href += `/${segment}`;

    // Check if this segment + next is a known compound route
    const compoundKey = `${segment}/${segments[i + 1]}`;
    if (routeLabels[compoundKey]) {
      crumbLabels.push({ label: routeLabels[compoundKey], href });
      i++; // skip next segment
      continue;
    }

    if (routeLabels[segment]) {
      crumbLabels.push({ label: routeLabels[segment], href });
    }
  }

  return crumbLabels;
}

export default function TopNavBar() {
  const { local, setIsSidebarOpen } = useVariables();
  const { DashboardPage } = getTranslations(local);
  const t = DashboardPage.TopNavBar;
  const pathname = usePathname();
  const crumbs = buildBreadcrumb(pathname, local);
  const isRTL = local === "ar";

  if (!pathname.includes(`/${local}/dashboard`)) {
    return null;
  }

  return (
    <header className="sticky  top-0 left-0  z-30 bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-4 sm:px-8 py-4 shrink-0 border-b border-stone-200/60 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-600 border border-stone-200/50 shadow-sm"
          aria-label="Open Sidebar"
        >
          <FiMenu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-stone-400 text-xs sm:text-sm font-semibold tracking-wide"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-stone-300 font-normal">/</span>
                )}
                {isLast ? (
                  <span className="text-stone-800 font-bold truncate max-w-[120px] sm:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <LocaleLink
                    href={crumb.href}
                    className="hover:text-orange-600 transition-colors hidden sm:inline"
                  >
                    {crumb.label}
                  </LocaleLink>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <FiSearch
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-stone-400`}
            size={16}
          />
          <input
            className={`${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 bg-stone-100 border-stone-200/50 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-48 xl:w-64 placeholder:text-stone-400`}
            placeholder={t.searchPlaceholder}
            type="text"
            aria-label={t.searchPlaceholder}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-3 border-r border-stone-200/60 pr-1 sm:pr-3">
            <DropdownNotifications />
            <DropdownSettings />
          </div>

          {/* User Button */}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
