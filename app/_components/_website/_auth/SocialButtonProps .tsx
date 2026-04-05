"use client";
import { FaFacebookF } from "react-icons/fa";
import Img from "../../_global/Img";
import { ReactNode } from "react";

interface SocialButtonProps {
  provider: "google" | "facebook";
  onClick: () => void;
  isLoading?: boolean;
  local: "en" | "ar";
}

type LineLabel = {
  en: string;
  ar: string;
};

type LineItem = {
  bg: string;
  label: LineLabel;
  imgsrc?: string;
  icon?: ReactNode;
};

type lineType = {
  [key: string]: LineItem;
};

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  isLoading,
  local,
}) => {
  const styles: lineType = {
    google: {
      bg: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
      imgsrc: "/google.png",
      label: {
        en: "Continue with Google",
        ar: "تابع باستخدام جوجل",
      },
    },
    facebook: {
      bg: "bg-[#1877F2] text-white hover:bg-[#145dc2]",
      icon: <FaFacebookF className="text-white" />,
      label: {
        en: "Continue with Facebook",
        ar: "تابع باستخدام فيسبوك",
      },
    },
  };

  const current = styles[provider];

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200"
      style={{
        backgroundColor: provider === "google" ? "var(--surface-card-bg)" : "#1877F2",
        border: `1px solid ${provider === "google" ? "var(--surface-card-border)" : "transparent"}`,
        color: provider === "google" ? "var(--surface-700)" : "white",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          if (provider === "google") {
            e.currentTarget.style.backgroundColor = "var(--surface-50)";
            e.currentTarget.style.borderColor = "var(--surface-card-border-hover)";
          } else {
            e.currentTarget.style.backgroundColor = "#145dc2";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (provider === "google") {
          e.currentTarget.style.backgroundColor = "var(--surface-card-bg)";
          e.currentTarget.style.borderColor = "var(--surface-card-border)";
        } else {
          e.currentTarget.style.backgroundColor = "#1877F2";
        }
      }}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {current.icon ? (
            current.icon
          ) : (
            <Img src={current.imgsrc ?? "/google.png"} className="w-5 h-5" />
          )}
          <span className="whitespace-nowrap">
            {current.label[local]}
          </span>
        </>
      )}
    </button>
  );
};

export default SocialButton;
