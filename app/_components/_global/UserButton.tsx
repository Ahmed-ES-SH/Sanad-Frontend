"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import LocalLink from "./LocalLink";
import {
  FiUser,
  FiCreditCard,
  FiLogOut,
  FiLoader,
  FiChevronDown,
  FiBell,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Img from "./Img";
import { LuLayoutDashboard } from "react-icons/lu";

/**
 * UserButton component for the Sanad platform.
 * Implements "Balanced Modern" aesthetics with a solid surface and subtle shadow depth.
 * Features smooth Framer Motion animations for the dropdown interaction.
 */
export default function UserButton() {
  const { user, logout, isLoading } = useAuth();
  const { local } = useVariables();
  const { userMenu } = getTranslations(local);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const displayName = user.name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 px-2 rounded-full md:border border-surface-100 hover:border-surface-200 hover:bg-surface-50 transition-all duration-300 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          {user.avatar ? (
            <Img
              src={user.avatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover border border-surface-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <span className="hidden md:block text-sm font-medium text-surface-700 group-hover:text-primary transition-colors">
          {displayName.split(" ")[0]}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="text-surface-400 md:block hidden group-hover:text-primary"
        >
          <FiChevronDown size={14} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 rtl:right-auto rtl:left-0 mt-3 w-64 rounded-2xl shadow-surface-xl bg-white border border-surface-100 p-2 z-1000 origin-top-right rtl:origin-top-left"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header / Profile Info */}
            <div className="px-4 py-4 mb-1 rounded-xl bg-surface-50/50 border border-surface-100">
              <p className="text-sm font-bold text-surface-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-surface-500 truncate mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Menu Links */}
            <div className="space-y-0.5">
              {user?.role == "admin" && (
                <LocalLink
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <LuLayoutDashboard size={18} />
                  </div>
                  <span>{userMenu.dashboard}</span>
                </LocalLink>
              )}
              <LocalLink
                href="/userdashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <FiUser size={18} />
                </div>
                <span>{userMenu.profile}</span>
              </LocalLink>

              <LocalLink
                href="/dashboard/payments"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <FiCreditCard size={18} />
                </div>
                <span>{userMenu.payments}</span>
              </LocalLink>

              <LocalLink
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <FiBell size={18} />
                </div>
                <span>Notifications</span>
              </LocalLink>
            </div>

            {/* Logout Action */}
            <div className="mt-2 pt-2 border-t border-surface-100">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-accent-rose hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-accent-rose group-hover:bg-rose-100">
                  {isLoading ? (
                    <FiLoader size={18} className="animate-spin" />
                  ) : (
                    <FiLogOut size={18} />
                  )}
                </div>
                <span>{isLoading ? userMenu.loggingOut : userMenu.logout}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
