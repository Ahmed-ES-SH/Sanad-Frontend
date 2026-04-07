"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiInfo } from "react-icons/fi";

export default function PendingBanner() {
  const { local } = useVariables();
  const { UsersPage } = getTranslations(local);
  const t = UsersPage.PendingBanner;

  return (
    <div className="bg-sky-50 text-sky-800 p-4 rounded-xl flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
        <FiInfo size={20} className="text-sky-600" />
      </div>
      <p className="text-sm font-medium">
        {t.message}{" "}
        <a
          className="underline font-bold text-sky-700 hover:text-sky-900"
          href="#"
        >
          {t.reviewLink}
        </a>
      </p>
    </div>
  );
}
