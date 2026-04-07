"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiMail, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import LocalLink from "../../_global/LocalLink";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormHeader from "./FormHeader";
import { directionMap } from "@/app/constants/constants";
import { sendResetLinkAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const { local } = useVariables();
  const { forgotPassword, formValidation } = getTranslations(local);
  const isRTL = local === "ar";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError(formValidation.emailRequired);
      return;
    } else if (!emailRegex.test(email)) {
      setError(formValidation.emailInvalid);
      return;
    }

    setIsLoading(true);

    try {
      const response = await sendResetLinkAction(email);

      if (response.success) {
        toast.success(response.message);
        router.push(`/${local}/check-your-inbox`);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      dir={directionMap[local]}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      <FormHeader
        title={forgotPassword.title}
        subtitle={forgotPassword.description}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label={forgotPassword.emailLabel}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          icon={<FiMail size={18} />}
          placeholder={forgotPassword.emailPlaceholder}
        />

        <SubmitButton isLoading={isLoading}>
          {forgotPassword.sendLink}
        </SubmitButton>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
        <LocalLink
          href="/signin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors group"
        >
          {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
          {forgotPassword.backToLogin}
        </LocalLink>

        <p className="text-sm text-gray-400">
          {forgotPassword.needHelp}{" "}
          <LocalLink
            href="/contact"
            className="text-primary font-semibold hover:underline"
          >
            {forgotPassword.contactSupport}
          </LocalLink>
        </p>
      </div>
    </motion.div>
  );
}
