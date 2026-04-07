/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AuthLayout from "@/app/_components/_website/_auth/AuthLayout";
import ForgotPasswordForm from "@/app/_components/_website/_auth/ForgotPasswordForm";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.forgotPassword.meta.title,
    description: translations.forgotPassword.meta.description,
    ...sharedMetadata,
  };
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
