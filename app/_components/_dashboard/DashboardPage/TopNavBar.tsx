"use client";

import { FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import LocaleLink from "../../_global/LocaleLink";
import UserButton from "../../_global/UserButton";
import DropdownNotifications from "./DropdownNotifications";
import DropdownSettings from "./DropdownSettings";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
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

function buildBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbLabels: { label: string; href: string }[] = [];
  let href = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    // Skip locale segment
    if (i === 0 && /^[a-z]{2}$/.test(segment)) continue;
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
  const { local } = useVariables();
  const { DashboardPage } = getTranslations(local);
  const t = DashboardPage.TopNavBar;
  const pathname = usePathname();
  const crumbs = buildBreadcrumb(pathname);

  return (
    <header className="fixed top-0 left-0 z-999 bg-stone-100 flex justify-between items-center w-full px-8 py-3 shrink-0 border-b border-stone-200">
      {/* Breadcrumb */}
      <div className="flex items-center truncate gap-4">
        <nav
          className="flex items-center gap-2 text-stone-500 text-sm font-medium"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-2">
                {idx > 0 && <span className="text-stone-400">/</span>}
                {isLast ? (
                  <span className="text-orange-700 font-bold">
                    {crumb.label}
                  </span>
                ) : (
                  <LocaleLink
                    href={crumb.href}
                    className="hover:text-stone-700 transition-colors"
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
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden xl:block">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />
          <input
            className="pl-10 pr-4 py-2 bg-stone-200/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 w-64"
            placeholder={t.searchPlaceholder}
            type="text"
            aria-label={t.searchPlaceholder}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <DropdownNotifications />
          <DropdownSettings />

          {/* User Button */}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
