import React from "react";
import Img from "./Img";
import SelectLanguage from "../_website/_navbar/SelectLanguage";
import MobailSidebar from "../_website/_navbar/MobailSidebar";
import NavLinks from "../_website/_navbar/NavLinks";
import ClientDiv from "./ClientDiv";
import Joinbtn from "../_website/_navbar/Joinbtn";
import LocalLink from "./LocalLink";

export default function Navbar() {
  return (
    <ClientDiv>
      <header className="w-full h-20 fixed top-0 left-0 z-[999] transition-all duration-300 bg-primary/80 backdrop-blur-sm">
        <div className="c-container h-full flex items-center justify-between">
          <div className="logo relative">
            <LocalLink href={"/"}>
              <Img
                src="/logo.webp"
                className="w-32 object-contain transition-transform duration-300 hover:scale-105"
              />
            </LocalLink>
          </div>

          <nav className="flex-1 flex justify-center">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-4">
            <Joinbtn />
            <div className="w-px h-6 bg-white/10 hidden md:block" />
            <SelectLanguage />
            <MobailSidebar />
          </div>
        </div>
      </header>
    </ClientDiv>
  );
}
