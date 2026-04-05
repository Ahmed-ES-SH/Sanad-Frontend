"use client";
import { directionMap } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import React, { ReactNode } from "react";

interface props {
  children: ReactNode;
}

export default function ClientDiv({ children }: props) {
  const { local } = useVariables();
  return (
    <div className="" dir={directionMap[local || "en"]}>
      {children}
    </div>
  );
}
