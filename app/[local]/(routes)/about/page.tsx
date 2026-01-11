/* eslint-disable @typescript-eslint/no-explicit-any */
import AboutPage from "@/app/_components/_website/_about/AboutPage";
import CompanyStats from "@/app/_components/_website/_about/CompanyStats";
import Contact from "@/app/_components/_website/_about/Contact";
import TestimonialsSection from "@/app/_components/_website/_about/TestimonialsSection";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import React from "react";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.aboutMeta.title,
    description: translations.aboutMeta.description,
    ...sharedMetadata,
  };
}

export default function About() {
  return (
    <>
      <AboutPage />
      <CompanyStats />
      <TestimonialsSection />
      <Contact />
    </>
  );
}
