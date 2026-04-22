/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import SubmitButton from "./SubmitButton";
import FormHeader from "./FormHeader";
import InputField from "./InputField";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "../../_global/LocalLink";
import {
  FiLock,
  FiCheckCircle,
  FiCircle,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import Img from "../../_global/Img";
import {
  resetPasswordAction,
  verifyResetTokenAction,
} from "@/app/actions/authActions";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}

function ResetPasswordFormContent() {
  const { local } = useVariables();
  const { resetPassword } = getTranslations(local);
  const isRTL = local === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("e");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (token && email) {
      verifyResetTokenAction(token, email).then((response) => {
        if (response.success) {
          setIsTokenValid(true);
        } else {
          toast.error(response.message);
          router.push(`/${local}/forgot-password`);
        }
      });
    }
  }, [token, email, local, router]);

  const passwordRequirements = {
    length: formData.password.length >= 8,
    numberAndSpecial:
      /[0-9]/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password),
    match:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== "",
  };

  const calculateStrength = () => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password))
      score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    return score;
  };

  const strength = calculateStrength();
  const strengthLabels = [
    resetPassword.weak,
    resetPassword.fair,
    resetPassword.good,
    resetPassword.strong,
  ];
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error("Invalid reset link");
      router.push(`/${local}/forgot-password`);
      return;
    }

    if (
      passwordRequirements.length &&
      passwordRequirements.numberAndSpecial &&
      passwordRequirements.match
    ) {
      setIsLoading(true);

      try {
        const response = await resetPasswordAction({
          email,
          password: formData.password,
          token,
        });

        if (response.success) {
          toast.success(response.message);
          router.push(`/${local}/signin`);
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      dir={directionMap[local]}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-md:mt-12 space-y-6"
    >
      {/* Identity Branding */}
      <Img src="/sanad-logo.png" alt="Logo" className="w-16 mx-auto" />

      <FormHeader
        title={resetPassword.title}
        subtitle={resetPassword.subtitle}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-h-[75dvh] overflow-y-auto p-2"
      >
        {/* New Password Field */}
        <div className="space-y-2">
          <div
            className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <label
              className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: "var(--surface-500)" }}
            >
              {resetPassword.newPassword}
            </label>
            {formData.password && (
              <span
                className="text-[10px] font-medium"
                style={{ color: strength >= 3 ? "#16a34a" : "var(--primary)" }}
              >
                {strengthLabels[Math.min(strength - 1, 3)] ||
                  resetPassword.weak}
              </span>
            )}
          </div>

          <InputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={resetPassword.newPasswordPlaceholder}
            icon={<FiLock size={18} />}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
          />

          {/* Strength Indicator Bars */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    strength >= i
                      ? strengthColors[strength - 1]
                      : "var(--surface-200)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            className="text-[11px] uppercase tracking-widest font-semibold block"
            style={{ color: "var(--surface-500)" }}
          >
            {resetPassword.confirmPassword}
          </label>
          <InputField
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={resetPassword.confirmPasswordPlaceholder}
            icon={<FiLock size={18} />}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            autoComplete="new-password"
          />
        </div>

        {/* Requirements Checklist */}
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: "var(--surface-input-bg)",
            borderColor: "var(--surface-input-border)",
          }}
        >
          <ul className="space-y-2">
            <li
              className="flex items-center gap-3 text-xs"
              style={{ color: "var(--surface-600)" }}
            >
              {passwordRequirements.length ? (
                <FiCheckCircle size={16} className="text-primary" />
              ) : (
                <FiCircle size={16} style={{ color: "var(--surface-300)" }} />
              )}
              <span>{resetPassword.requirements.minChars}</span>
            </li>
            <li
              className="flex items-center gap-3 text-xs"
              style={{ color: "var(--surface-600)" }}
            >
              {passwordRequirements.numberAndSpecial ? (
                <FiCheckCircle size={16} className="text-primary" />
              ) : (
                <FiCircle size={16} style={{ color: "var(--surface-300)" }} />
              )}
              <span>{resetPassword.requirements.numberAndSpecial}</span>
            </li>
            <li
              className="flex items-center gap-3 text-xs"
              style={{ color: "var(--surface-600)" }}
            >
              {passwordRequirements.match ? (
                <FiCheckCircle size={16} className="text-primary" />
              ) : (
                <FiCircle size={16} style={{ color: "var(--surface-300)" }} />
              )}
              <span>{resetPassword.requirements.mustMatch}</span>
            </li>
          </ul>
        </div>

        <SubmitButton
          isLoading={isLoading}
          disabled={
            !passwordRequirements.length ||
            !passwordRequirements.numberAndSpecial ||
            !passwordRequirements.match ||
            isLoading
          }
        >
          <span className="flex items-center gap-2">
            {resetPassword.updatePassword}
            {isRTL ? <FiArrowLeft size={18} /> : <FiArrowRight size={18} />}
          </span>
        </SubmitButton>
      </form>

      <div className="pt-2 flex flex-col items-center">
        <LocalLink
          href="/signin"
          className="text-sm text-primary font-medium transition-colors flex items-center gap-1 group"
        >
          {isRTL ? (
            <FiArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          ) : (
            <FiArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
          )}
          {resetPassword.backToLogin}
        </LocalLink>
      </div>
    </motion.div>
  );
}
