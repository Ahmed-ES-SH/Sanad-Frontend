"use client";

import React, { useEffect, useState } from "react";
import Img from "./Img";
import SelectLanguage from "../_website/_navbar/SelectLanguage";
import MobileSidebar from "../_website/_navbar/MobileSidebar";
import NavLinks from "../_website/_navbar/NavLinks";
import ClientDiv from "./ClientDiv";
import Joinbtn from "../_website/_navbar/Joinbtn";
import LocalLink from "./LocalLink";
import CartButton from "./CartButton";
import NotificationBell from "./NotificationBell";

/**
 * Navbar component for the Sanad technical services platform.
 * Implements "Solid Depth" principles with a high-contrast border and subtle shadow.
 * Features an "Intelligent" scroll-based transformation that reduces height and deepens the shadow.
 * Ensures "perfect middle" centering for navigation links using a grid layout.
 */
export default function Navbar() {
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

  return (
    <ClientDiv>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-999 bg-white transition-all duration-500 ease-out ${
          isScrolled
            ? "h-16 border-b border-surface-200 shadow-surface-md"
            : "h-20 border-b border-surface-100 shadow-surface-sm"
        }`}
      >
        <div className="c-container h-full lg:grid flex justify-between lg:grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <LocalLink href={"/"} className="relative block">
              <Img
                src="/sanad-logo.png"
                className={`object-contain transition-all duration-500 ${
                  isScrolled
                    ? "lg:w-12 w-10 scale-95"
                    : "lg:w-14 w-11 scale-100"
                } hover:scale-110 active:scale-90`}
                alt="Sanad Logo"
              />
            </LocalLink>
          </div>

          {/* Middle: Navigation Links (Perfectly Centered) */}
          <nav className="hidden lg:flex items-center justify-center h-full">
            <NavLinks />
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 md:gap-4">
            {/* notification bell */}
            <NotificationBell />

            {/* cart button */}
            <CartButton />

            {/* join button and user button */}
            <Joinbtn />

            {/* separator */}
            <div className="w-px h-6 bg-surface-200 hidden md:block" />

            {/* language selector and mobile sidebar */}
            <div className="flex items-center gap-2">
              <SelectLanguage />
              <MobileSidebar />
            </div>
          </div>
        </div>
      </header>
    </ClientDiv>
  );
}
