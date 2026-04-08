"use client";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface VariablesType {
  width: number;
  local: "en" | "ar";
  showLangDrop: boolean;
  setShowLangDrop: Dispatch<SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

interface props {
  children: ReactNode;
}

const Variables = createContext<VariablesType | null>(null);

export default function VariablesProvider({ children }: props) {
  const params = useParams();
  const local = (params.local as "en" | "ar") || "en";

  const [width, setWidth] = useState(0);
  const [showLangDrop, setShowLangDrop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set width on initial mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Variables.Provider
      value={{
        width,
        local,
        showLangDrop,
        setShowLangDrop,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </Variables.Provider>
  );
}

export const useVariables = () => {
  const context = useContext(Variables);

  if (!context) {
    throw new Error("useVariables must be used within a VariablesProvider");
  }

  return context;
};
