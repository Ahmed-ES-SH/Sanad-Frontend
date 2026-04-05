"use client";
import { navLinks } from "@/app/constants/constants";
import React, { useEffect, useState } from "react";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { useVariables } from "@/app/context/VariablesContext";
import { IoClose } from "react-icons/io5";
import LocalLink from "../../_global/LocalLink";

import { getTranslations } from "@/app/helpers/helpers";
import Img from "../../_global/Img";

export default function MobailSidebar() {
  const { width, local } = useVariables();
  const { hero } = getTranslations(local);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (width > 1014) {
      setIsSidebarOpen(false);
    }
  }, [width]);

  return (
    <>
      <div
        className={`text-white cursor-pointer lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-0" : "opacity-100"
        }`}
        onClick={toggleSidebar}
      >
        <HiOutlineBars3BottomRight size={32} />
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 ${local === "ar" ? "left-0" : "right-0"} w-80 h-full bg-white z-[9999] transform transition-transform duration-500 ease-out lg:hidden flex flex-col shadow-2xl ${
          isSidebarOpen
            ? "translate-x-0"
            : local === "ar"
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-surface-100">
          <div className="w-24">
            <LocalLink href="/">
              <Img
                src="/logo.png"
                className="w-full object-contain brightness-0"
              />
            </LocalLink>
          </div>
          <button
            onClick={toggleSidebar}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-50 text-surface-900 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {navLinks.map((item, index) => (
            <LocalLink
              key={index}
              href={item.link || "/#contactus"}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl text-surface-600 hover:bg-primary/5 hover:text-primary font-semibold transition-all duration-200"
            >
              {item.icon && (
                <span className="text-xl opacity-70">
                  <item.icon />
                </span>
              )}
              <span>{item.text[local]}</span>
            </LocalLink>
          ))}
        </nav>

        <div className="p-6 border-t border-surface-100 bg-surface-50/50">
          <LocalLink
            href="/signup"
            onClick={() => setIsSidebarOpen(false)}
            className="surface-btn-primary w-full h-14 text-base"
          >
            {hero.join}
          </LocalLink>
          <p className="mt-4 text-center text-[10px] text-surface-400 font-medium uppercase tracking-widest">
            {local === "ar"
              ? "رحلتك الرقمية تبدأ هنا"
              : "Your digital journey starts here"}
          </p>
        </div>
      </aside>
    </>
  );
}
