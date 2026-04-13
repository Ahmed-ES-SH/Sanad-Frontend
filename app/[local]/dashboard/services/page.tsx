import { Suspense } from "react";
import ServicesContent from "@/app/_components/_dashboard/ServicesPage/ServicesContent";
import ServicesLoading from "./loading";
import { getCategories } from "@/app/actions/blogActions";
import { getAdminServices } from "@/app/actions/servicesActions";

export default async function ServicesPage() {
  const categories = await getCategories();
  const services = await getAdminServices();

  if (!services)
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p>No services found</p>
      </div>
    );

  const { meta, data } = services;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServicesLoading />}>
        <ServicesContent services={data} meta={meta} categories={categories} />
      </Suspense>
    </div>
  );
}
