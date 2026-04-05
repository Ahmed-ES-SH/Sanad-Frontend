import React from "react";
import SignupForm from "@/app/_components/_website/_auth/SignupForm";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import AuthLayout from "@/app/_components/_website/_auth/AuthLayout";

interface PageParams {
  params: Promise<{ local: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.signUpMeta.title,
    description: translations.signUpMeta.description,
    ...sharedMetadata,
  };
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
