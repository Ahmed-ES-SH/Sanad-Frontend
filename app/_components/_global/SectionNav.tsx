"use client";
import React, { useState, useEffect } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { directionMap } from "@/app/constants/constants";

interface SectionNavItem {
  id: string;
  label: { en: string; ar: string };
}

const navItems: SectionNavItem[] = [
  { id: "services", label: { en: "Services", ar: "الخدمات" } },
  { id: "how-we-work", label: { en: "How We Work", ar: "كيف نعمل" } },
  { id: "pricing", label: { en: "Pricing", ar: "الأسعار" } },
];

export default function SectionNav() {
  const { local } = useVariables();
  const [activeSection, setActiveSection] = useState<string>("services");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = 200;
      setIsSticky(window.scrollY > triggerPoint);

      // Determine which section is currently in view
      const sections = navItems
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id: item.id, top: rect.top };
        })
        .filter(Boolean);

      // Find the section closest to the top (but not far above)
      const visibleSection = sections.find((s) => s && s.top >= -100 && s.top < 300);
      if (visibleSection) {
        setActiveSection(visibleSection.id);
      }

      // If scrolled past all sections, keep the last active one
      const firstVisible = sections.find((s) => s && s.top >= 0);
      if (!firstVisible && sections.length > 0) {
        const lastInSection = [...sections].reverse().find((s) => s && s.top < 0);
        if (lastInSection) setActiveSection(lastInSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Account for sticky nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      dir={directionMap[local]}
      className={`z-40 transition-all duration-300 ${
        isSticky
          ? "fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md py-3 shadow-surface-sm"
          : "absolute top-4 inset-x-0 py-2"
      }`}
      role="navigation"
      aria-label={local === "en" ? "Page sections" : "أقسام الصفحة"}
    >
      <div className="c-container">
        <div className="flex items-center justify-center gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] min-w-[44px] ${
                  isActive
                    ? "bg-primary text-white shadow-button"
                    : "text-surface-500 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {item.label[local]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
