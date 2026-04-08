"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import LocalLink from "../../_global/LocalLink";
import { directionMap } from "@/app/constants/constants";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import { Suspense } from "react";
import CheckYourInbox from "./CheckYourInbox";

export default function VerifyEmailContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContentInner />
    </Suspense>
  );
}

function VerifyEmailContentInner() {
  const { local } = useVariables();
  const { verifyCode } = getTranslations(local);
  const t = verifyCode;
  const isRTL = local === "ar";
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t?.missingToken || "Verification token is missing");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await verifyEmailAction(token);

        if (response.success) {
          setStatus("success");
          setMessage(response.message);
          toast.success(response.message);
        } else {
          setStatus("error");
          setMessage(response.message);
          toast.error(response.message);
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error?.message || "Verification failed");
        toast.error(error?.message || "Verification failed");
      }
    };

    if (token) verifyEmail();
  }, [token, local]);

  if (!token) return <CheckYourInbox />;

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
        {status === "verifying" && (
          <FiLoader
            size={64}
            className="animate-spin text-primary"
            aria-hidden="true"
          />
        )}
        {status === "success" && (
          <FiCheckCircle
            size={64}
            className="text-accent-emerald"
            aria-hidden="true"
          />
        )}
        {status === "error" && (
          <FiXCircle
            size={64}
            className="text-accent-rose"
            aria-hidden="true"
          />
        )}

        {/* Title */}
        <h1 className="font-display text-3xl font-extrabold text-surface-900 tracking-tight">
          {status === "verifying"
            ? t?.verifyingTitle || "Verifying Email"
            : status === "success"
              ? t?.successTitle || "Email Verified"
              : t?.errorTitle || "Verification Failed"}
        </h1>

        {/* Message */}
        <p className="text-surface-600 text-base leading-relaxed text-center px-2 max-w-md">
          {message ||
            (status === "verifying"
              ? t?.verifyingDesc || "Please wait while we verify your email..."
              : status === "success"
                ? t?.successDesc ||
                  "Your email has been verified successfully. You can now sign in."
                : t?.errorDesc ||
                  "We were unable to verify your email. The link may be invalid or expired.")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-center gap-4">
        {status === "success" && (
          <LocalLink
            href="/signin"
            className="inline-flex items-center gap-2 surface-btn-primary px-6 py-3 rounded-xl font-semibold"
          >
            {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
            {t?.goToSignIn || "Go to Sign In"}
          </LocalLink>
        )}

        {status === "error" && (
          <LocalLink
            href="/signup"
            className="inline-flex items-center gap-2 surface-btn-primary px-6 py-3 rounded-xl font-semibold"
          >
            {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
            {t?.backToSignup || "Back to Sign Up"}
          </LocalLink>
        )}
      </div>
    </motion.div>
  );
}
