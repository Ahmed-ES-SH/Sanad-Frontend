"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SocialButton from "./SocialButtonProps ";
import SubmitButton from "./SubmitButton";
import FormHeader from "./FormHeader";
import { directionMap } from "@/app/constants/constants";
import SignInFields from "./SignInFields";
import LocalLink from "../../_global/LocalLink";
import { loginAction } from "@/app/actions/authActions";
import { AUTH_ENDPOINTS } from "@/app/constants/endpoints";
import { useAuth } from "@/app/context/AuthContext";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignInForm() {
  const { local } = useVariables();
  const { formValidation, signInPage } = getTranslations(local);
  const router = useRouter();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateForm(updateErrors = true) {
    const newErrors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = formValidation.emailRequired;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = formValidation.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = formValidation.passwordRequired;
    }

    if (updateErrors) {
      setErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  }

  const isFormValid =
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAction({
        email: formData.email,
        password: formData.password,
      });

      if (response.statusCode === 403) {
        toast.error(response.message);
        router.push(`/${local}/verify-email?email=${formData.email}`);
      }

      if (response.statusCode === 400) {
        toast.error(response.message);
      }

      if (
        response.success &&
        response.data?.user &&
        response.data?.access_token
      ) {
        const user = response.data.user;
        setUser(user);
        toast.success(response.message);
        router.push(
          user.role === "admin"
            ? `/${local}/dashboard`
            : `/${local}/userdashboard`,
        );
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWith = (strategy: "oauth_google" | "oauth_facebook") => {
    if (strategy === "oauth_google") {
      // Google OAuth initiates on the backend, redirects to /api/auth/callback/google
      window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
    }
  };

  return (
    <>
      <motion.div
        dir={directionMap[local]}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full space-y-4"
      >
        <FormHeader title={signInPage.title} subtitle={signInPage.subtitle} />

        <form onSubmit={handleSignIn} className="w-full">
          <SignInFields
            locale={local}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <SubmitButton
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            {signInPage.signIn}
          </SubmitButton>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            {signInPage.noAccount}{" "}
            <LocalLink
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {signInPage.createAccount}
            </LocalLink>
          </p>
        </motion.div>

        <div className="w-full flex items-center gap-2">
          <div className="h-[2px] bg-gray-200 rounded-xl flex-1"></div>
          <p>{signInPage.or}</p>
          <div className="h-[2px] bg-gray-200 rounded-xl flex-1"></div>
        </div>
        <SocialButton
          local={local}
          provider="google"
          onClick={() => signInWith("oauth_google")}
        />
      </motion.div>
    </>
  );
}
