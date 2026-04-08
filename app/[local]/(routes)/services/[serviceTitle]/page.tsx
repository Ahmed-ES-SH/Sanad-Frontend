/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import ServiceLayout from "@/app/_components/_website/_servicePage/ServiceLayout";
import Loading from "./loading";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getServiceBySlug } from "@/app/actions/servicesActions";
import { Service } from "@/app/types/service";
import { notFound } from "next/navigation";

interface ServicePageProps {
  params: Promise<{ local: string; serviceTitle: string }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { local, serviceTitle } = await params;
  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  try {
    const service = await getServiceBySlug(serviceTitle);
    return {
      title: `Sanad Service - ${service.title}`,
      description: service.shortDescription,
      ...sharedMetadata,
    };
  } catch {
    return {
      title: translations.servicesMeta.title,
      description: translations.servicesMeta.description,
      ...sharedMetadata,
    };
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { local, serviceTitle } = await params;
  let service: Service | null = null;

  try {
    service = await getServiceBySlug(serviceTitle);
  } catch {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <ServiceLayout service={service} />
    </Suspense>
  );
}
