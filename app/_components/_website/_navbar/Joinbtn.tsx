"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import React from "react";
import LocalLink from "../../_global/LocalLink";

function UserButton() {
  return (
    <div>
      <p>UserButton</p>
    </div>
  );
}

export default function Joinbtn() {
  const { local } = useVariables();
  const { hero } = getTranslations(local);

  const user = false;

  return (
    <>
      {!user && (
        <div className="hidden sm:block">
          <LocalLink
            href={"/signup"}
            className="surface-btn-primary min-h-[40px] px-6 text-sm"
          >
            {hero.join}
          </LocalLink>
        </div>
      )}

      {user && <UserButton />}
    </>
  );
}
