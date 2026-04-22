import Img from "./Img";
import SelectLanguage from "../_website/_navbar/SelectLanguage";
import MobileSidebar from "../_website/_navbar/MobileSidebar";
import NavLinks from "../_website/_navbar/NavLinks";
import ClientDiv from "./ClientDiv";
import Joinbtn from "../_website/_navbar/Joinbtn";
import LocalLink from "./LocalLink";
import CartButton from "./CartButton";
import NotificationBell from "./NotificationBell";
import { getCurrentUserAction } from "@/app/actions/authActions";

export default async function Navbar() {
  const response = await getCurrentUserAction();

  return (
    <ClientDiv initialUser={response?.user ?? null}>
      <div className="c-container h-full xl:grid flex justify-between lg:grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <LocalLink href={"/"} className="relative block">
            <Img
              src="/sanad-logo.png"
              className={`object-contain transition-all duration-500 lg:w-14 w-11 scale-100 hover:scale-110 active:scale-90`}
              alt="Sanad Logo"
              loading="eager"
            />
          </LocalLink>
        </div>

        {/* Middle: Navigation Links (Perfectly Centered) */}
        <nav className="hidden xl:flex items-center justify-center h-full">
          <NavLinks />
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1 md:gap-4">
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
    </ClientDiv>
  );
}
