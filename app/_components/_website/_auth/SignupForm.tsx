/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "../../_global/LocalLink";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const fieldTranslations = {
  en: {
    title: "Create your account",
    subtitle: "Start your journey with Sanad",
    fullName: "Full Name",
    fullNamePlaceholder: "Ahmed Al-Rashid",
    email: "Email",
    emailPlaceholder: "ahmed@company.com",
    password: "Password",
    passwordPlaceholder: "Create a strong password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    submit: "Create Account",
    orContinueWith: "or continue with",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    passwordLength: "At least 8 characters",
    passwordLowercase: "Lowercase letter",
    passwordUppercase: "Uppercase letter",
    passwordNumber: "Number",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  },
  ar: {
    title: "أنشئ حسابك",
    subtitle: "ابدأ رحلتك مع سند",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أحمد الراشد",
    email: "البريد الإلكتروني",
    emailPlaceholder: "ahmed@company.com",
    password: "كلمة المرور",
    passwordPlaceholder: "أنشئ كلمة مرور قوية",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
    submit: "إنشاء حساب",
    orContinueWith: "أو تابع باستخدام",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    passwordLength: "8 أحرف على الأقل",
    passwordLowercase: "حرف صغير",
    passwordUppercase: "حرف كبير",
    passwordNumber: "رقم",
    weak: "ضعيفة",
    fair: "مقبولة",
    good: "جيدة",
    strong: "قوية",
  },
};

function SignupForm() {
  const { local } = useVariables();
  const { signUpPage, formValidation } = getTranslations(local);
  const t = fieldTranslations[local];
  const isRTL = local === "ar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = formValidation.fullNameRequired;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = formValidation.fullNameTooShort;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = formValidation.emailRequired;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = formValidation.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = formValidation.passwordRequired;
    } else if (formData.password.length < 8) {
      newErrors.password = formValidation.passwordTooShort;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = formValidation.passwordWeak;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = formValidation.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = formValidation.passwordsNotMatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    toast.info("Google sign-in coming soon");
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim() !== "");

  const passwordChecks = [
    { met: formData.password.length >= 8 },
    { met: /[a-z]/.test(formData.password) },
    { met: /[A-Z]/.test(formData.password) },
    { met: /\d/.test(formData.password) },
  ];
  const metCount = passwordChecks.filter((c) => c.met).length;
  const strengthLevel = formData.password
    ? metCount <= 1
      ? 0
      : metCount === 2
        ? 1
        : metCount === 3
          ? 2
          : 3
    : 0;
  const strengthLabels = [t.weak, t.fair, t.good, t.strong];
  const strengthColors = [
    "var(--accent-rose)",
    "var(--accent-amber)",
    "var(--primary)",
    "var(--accent-emerald)",
  ];

  const renderInput = (
    name: string,
    label: string,
    placeholder: string,
    type: string = "text",
    showToggle?: boolean,
    toggleState?: boolean,
    onToggle?: () => void,
    autoComplete?: string,
    autoFocus?: boolean,
  ) => {
    const hasError = !!errors[name as keyof FormErrors];
    const isFocused = focusedField === name;

    return (
      <div className="space-y-1.5">
        <label className="block body-sm font-medium text-surface-700">
          {label}
        </label>
        <div className="relative">
          <input
            name={name}
            type={showToggle && toggleState ? "text" : type}
            value={formData[name as keyof typeof formData]}
            onChange={handleInputChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className="surface-input w-full"
            style={hasError ? { borderColor: "var(--accent-rose)" } : undefined}
          />
          {showToggle && onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute inset-y-0 end-0 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors rounded"
              style={{
                padding: "8px",
                minWidth: "44px",
                minHeight: "44px",
                outlineOffset: "2px",
              }}
              aria-label={toggleState ? "Hide password" : "Show password"}
            >
              {toggleState ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          )}
        </div>
        {hasError && (
          <p className="text-xs mt-1" style={{ color: "var(--accent-rose)" }}>
            {errors[name as keyof FormErrors]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div dir={directionMap[local]} className="w-full sm:max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        {renderInput(
          "fullName",
          t.fullName,
          t.fullNamePlaceholder,
          "text",
          false,
          undefined,
          undefined,
          "name",
          undefined,
          true,
        )}
        {renderInput(
          "email",
          t.email,
          t.emailPlaceholder,
          "email",
          false,
          undefined,
          undefined,
          "email",
        )}

        <div className="space-y-1.5">
          {renderInput(
            "password",
            t.password,
            t.passwordPlaceholder,
            "password",
            true,
            showPassword,
            () => setShowPassword(!showPassword),
            "new-password",
          )}

          {formData.password && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i <= strengthLevel
                            ? strengthColors[strengthLevel]
                            : "var(--surface-200)",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: strengthColors[strengthLevel] }}
                >
                  {strengthLabels[strengthLevel]}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {[
                  {
                    label: t.passwordLength,
                    met: formData.password.length >= 8,
                  },
                  {
                    label: t.passwordLowercase,
                    met: /[a-z]/.test(formData.password),
                  },
                  {
                    label: t.passwordUppercase,
                    met: /[A-Z]/.test(formData.password),
                  },
                  {
                    label: t.passwordNumber,
                    met: /\d/.test(formData.password),
                  },
                ].map((check, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs"
                    style={{
                      color: check.met
                        ? "var(--surface-600)"
                        : "var(--surface-400)",
                    }}
                  >
                    {check.met ? (
                      <FiCheck
                        size={12}
                        style={{ color: "var(--accent-emerald)" }}
                      />
                    ) : (
                      <FiX />
                    )}
                    {check.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {renderInput(
          "confirmPassword",
          t.confirmPassword,
          t.confirmPasswordPlaceholder,
          "password",
          true,
          showConfirmPassword,
          () => setShowConfirmPassword(!showConfirmPassword),
          "new-password",
        )}

        {/* Password match indicator */}
        {formData.confirmPassword &&
          formData.password === formData.confirmPassword && (
            <p
              className="text-xs -mt-2"
              style={{ color: "var(--accent-emerald)" }}
            >
              <FiCheck
                size={12}
                className="inline me-1"
                style={{ color: "var(--accent-emerald)" }}
              />
              {isRTL ? "كلمات المرور متطابقة" : "Passwords match"}
            </p>
          )}

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="surface-btn-primary w-full py-3 sm:py-3.5 mt-5 sm:mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={{
            minHeight: "48px",
            fontSize: "clamp(0.875rem, 2.5vw, 0.9375rem)",
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t.submit}
              <FiArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
            </span>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5 sm:my-6">
        <div
          className="h-px flex-1"
          style={{ backgroundColor: "var(--surface-200)" }}
        />
        <p
          className="text-xs font-medium"
          style={{ color: "var(--surface-400)" }}
        >
          {t.orContinueWith}
        </p>
        <div
          className="h-px flex-1"
          style={{ backgroundColor: "var(--surface-200)" }}
        />
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        className="surface-btn-secondary w-full py-3 sm:py-3.5"
        style={{ minHeight: "48px" }}
      >
        <span className="flex items-center justify-center gap-3">
          <img
            src="/google.png"
            alt={isRTL ? "جوجل" : "Google"}
            className="w-5 h-5"
          />
          <span>{isRTL ? "جوجل" : "Google"}</span>
        </span>
      </button>

      <p className="text-center body text-surface-500 mt-5 sm:mt-6">
        {t.alreadyHaveAccount}{" "}
        <LocalLink
          href={`/${local}/signin`}
          className="font-semibold transition-colors duration-150"
          style={{
            color: "var(--primary)",
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
            padding: "0 8px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--primary-dark)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
        >
          {t.signIn}
        </LocalLink>
      </p>
    </div>
  );
}

export default SignupForm;
