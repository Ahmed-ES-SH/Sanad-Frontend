/* eslint-disable @typescript-eslint/no-explicit-any */
import PricingPlans from "@/app/_components/_global/PricingPlans";
import HowWeWork from "@/app/_components/_website/_services/HowWeWork";
import ServicesComponent from "@/app/_components/_website/_services/ServicesComponent";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import { getPublishedServices } from "@/app/actions/servicesActions";
import React from "react";
import { Service } from "@/app/types/service";
import { getCategories } from "@/app/actions/blogActions";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.servicesMeta.title,
    description: translations.servicesMeta.description,
    ...sharedMetadata,
  };
}

export default async function ServicesPage() {
  let services: Service[] = [];

  const categories = await getCategories();

  try {
    const response = await getPublishedServices();
    services = response.data;
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  return (
    <main id="main-content" className="relative mt-12">
      <ServicesComponent services={services} categories={categories ?? []} />
      <HowWeWork />
      <PricingPlans />
    </main>
  );
}
