"use client";
import { directionMap } from "@/app/constants/constants";
import { useAuth } from "@/app/context/AuthContext";
import { useNotification } from "@/app/context/NotificationContext";
import { useVariables } from "@/app/context/VariablesContext";
import { User } from "@/lib/types/auth";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
interface props {
  children: ReactNode;
  initialUser: User | null;
}

export default function ClientDiv({ children, initialUser }: props) {
  const { setUser } = useAuth();
  const { local } = useVariables();
  const { fetchNotifications } = useNotification();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initial check in case page starts scrolled
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications(1, 10);
  }, [fetchNotifications]);

  const pathname = usePathname();

  if (pathname.startsWith(`/${local}/dashboard`)) {
    return null;
  }

  return (
    <div className="" dir={directionMap[local || "en"]}>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-999 bg-white transition-all duration-500 ease-out ${
          isScrolled
            ? "h-16 border-b border-surface-200 shadow-surface-md"
            : "h-20 border-b border-surface-100 shadow-surface-sm"
        }`}
      >
        {children}
      </header>
    </div>
  );
}
