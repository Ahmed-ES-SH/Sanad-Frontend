"use client";
import { LocalLink } from "../_portfolio/_projectPage";
import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { directionMap } from "@/app/constants/constants";

export default function CheckYourInbox() {
  const { local } = useVariables();
  const { verifyCode } = getTranslations(local);
  const t = verifyCode;
  const isRTL = local === "ar";
  return (
    <motion.div
      dir={directionMap[local]}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center gap-8"
    >
      {/* Icon */}
      <div className="flex flex-col items-center gap-4">
        <FiCheckCircle
          size={64}
          className="text-accent-emerald"
          aria-hidden="true"
        />

        {/* Title */}
        <h1 className="font-display text-3xl font-extrabold text-surface-900 tracking-tight text-center">
          Check your inbox for a verification email.
        </h1>

        {/* Message */}
        <p className="text-surface-600 text-base leading-relaxed text-center px-2 max-w-md">
          we have sent a verification email to your email address. Please check
          your inbox and click on the verification link to verify your email.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-center gap-4">
        <LocalLink
          href="/signin"
          className="inline-flex items-center gap-2 surface-btn-primary px-6 py-3 rounded-xl font-semibold"
        >
          {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
          {t?.goToSignIn || "Go to Sign In"}
        </LocalLink>
      </div>
    </motion.div>
  );
}
