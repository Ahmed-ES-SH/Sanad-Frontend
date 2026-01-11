/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import ServiceLayout from "@/app/_components/_website/_servicePage/ServiceLayout";
import Loading from "./loading";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { servicesData } from "@/app/constants/servicesData";

export async function generateMetadata({ params, searchParams }: any) {
  const { local } = await params;
  const { serviceId } = await searchParams;

  const service: any = servicesData.find(
    (service) => service.id === Number(serviceId)
  );

  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  if (!service) {
    return {
      title: "Service Title",
      description: "Service Description",
      ...sharedMetadata,
    };
  }

  return {
    title: `Madad Service - ${service.title[local ?? "en"]}`,
    description: service.description[local ?? "en"],
    ...sharedMetadata,
  };
}

export default async function ServicePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ServiceLayout />
    </Suspense>
  );
}
