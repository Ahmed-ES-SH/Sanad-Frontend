/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactPage from "@/app/_components/_website/_contact/ContactPage";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import React from "react";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.contactMeta.title,
    description: translations.contactMeta.description,
    ...sharedMetadata,
  };
}

export default function Contact() {
  return <ContactPage />;
}
