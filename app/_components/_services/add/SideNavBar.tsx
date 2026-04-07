"use client";

import { usePathname } from "next/navigation";

interface SideNavBarProps {
  activeItem: string;
}

export function SideNavBar({ activeItem }: SideNavBarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 border-r border-stone-200/15 dark:border-stone-800/15 bg-stone-100 dark:bg-stone-900 w-64 z-50">
      {/* Logo */}
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl">S</div>
          <div>
            <h1 className="text-2xl font-black text-orange-700 dark:text-orange-500 leading-none">Sanad</h1>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mt-1">Management Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        <NavItem 
          icon="dashboard" 
          label="Dashboard" 
          href="/dashboard"
          isActive={activeItem === "dashboard"}
        />
        <NavItem 
          icon="category" 
          label="Services" 
          href="/services"
          isActive={activeItem === "services"}
        />
        <NavItem 
          icon="analytics" 
          label="Analytics" 
          href="/analytics"
          isActive={activeItem === "analytics"}
        />
        <NavItem 
          icon="group" 
          label="Team" 
          href="/team"
          isActive={activeItem === "team"}
        />
        <NavItem 
          icon="settings" 
          label="Settings" 
          href="/settings"
          isActive={activeItem === "settings"}
        />
      </nav>
      
      {/* Bottom Navigation */}
      <div className="mt-auto pt-6 space-y-1 border-t border-stone-200/30">
        <NavItem 
          icon="help" 
          label="Help Center" 
          href="/help"
          isActive={false}
        />
        <NavItem 
          icon="logout" 
          label="Logout" 
          href="/logout"
          isActive={false}
        />
      </div>
    </aside>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  isActive: boolean;
}

function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
        isActive 
          ? "bg-orange-500 text-white shadow-sm shadow-orange-200 scale-95 transition-transform duration-150" 
          : "text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}