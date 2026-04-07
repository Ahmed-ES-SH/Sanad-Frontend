"use client";
import WhatsappButton from "./WhatsappButton";
import ScrollToTopButton from "./ScrollToTopButton";
import { usePathname } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";

export default function FixedButtons() {
  const pathname = usePathname();
  const { local } = useVariables();

  if (pathname.startsWith(`/${local}/dashboard`)) {
    return null;
  }

  return (
    <div className="fixed flex flex-col gap-4 bottom-6 rtl:right-4 ltr:left-4 z-999999">
      <ScrollToTopButton />
      <WhatsappButton />
    </div>
  );
}
