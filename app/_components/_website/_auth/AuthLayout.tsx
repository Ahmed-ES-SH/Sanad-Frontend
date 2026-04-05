"use client";
import { ReactNode } from "react";
import { useVariables } from "@/app/context/VariablesContext";

function AuthLayout({ children }: { children: ReactNode }) {
  const { local } = useVariables();
  const isRTL = local === "ar";

  return (
    <div className="min-h-screen mt-12 flex items-center justify-center page-bg">
      <div className="w-full sm:max-w-md">
        <div
          className="surface-card"
          style={{
            padding: "clamp(16px, 4vw, 32px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
