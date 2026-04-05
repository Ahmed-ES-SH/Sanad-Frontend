"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function SelectLanguage() {
  const { showLangDrop, setShowLangDrop, local } = useVariables();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const toggleDropdown = () => {
    setShowLangDrop((prev) => !prev);
  };

  const handleChangeLanguage = (local: string) => {
    const currentPath =
      typeof window !== "undefined" &&
      window.location.pathname.split("/").slice(2).join("/");

    router.push(`/${local}/${currentPath || ""}`);
    setShowLangDrop(false);
  };

  useEffect(() => {
    if (local == "en") {
      setSelectedLanguage("English");
    } else {
      setSelectedLanguage("العربية");
    }
  }, [local]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLangDrop]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="surface-btn-secondary min-h-[40px] px-4 text-sm"
      >
        <span className="w-[45px]">{selectedLanguage}</span>
        <IoIosArrowDown className={`transition-transform duration-300 ${showLangDrop ? 'rotate-180' : ''}`} />
      </button>
      {showLangDrop && (
        <div className="absolute right-0 mt-3 w-32 surface-card-elevated overflow-hidden border-none shadow-surface-lg p-1">
          <button
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${local === 'ar' ? 'bg-primary/10 text-primary' : 'text-surface-600 hover:bg-primary/5 hover:text-primary'}`}
            onClick={() => handleChangeLanguage("ar")}
          >
            العربية
          </button>
          <button
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${local === 'en' ? 'bg-primary/10 text-primary' : 'text-surface-600 hover:bg-primary/5 hover:text-primary'}`}
            onClick={() => handleChangeLanguage("en")}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
