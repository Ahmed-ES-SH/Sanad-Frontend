"use client";
import React from "react";
import { navLinks } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import LocalLink from "../../_global/LocalLink";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const Variables = useVariables();
  const local = Variables.local || "en";
  const pathname = usePathname();

  return (
    <div className="links hidden lg:block">
      <ul className="flex items-center gap-8 text-white">
        {navLinks.map((link, index) => {
          const isActive = pathname === `/${local}${link.link}` || (link.link === "/" && pathname === `/${local}`);
          
          return (
            <LocalLink
              href={link.link || "/#contactus"}
              key={index}
              className={`group text-[15px] xl:text-[16px] font-semibold transition-colors duration-200 relative py-1 ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <p>{link.text[local]}</p>
              
              <div className={`absolute bottom-0 left-0 h-[2px] bg-primary-light transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </LocalLink>
          );
        })}
      </ul>
    </div>
  );
}
