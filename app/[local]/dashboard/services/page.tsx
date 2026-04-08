import { Suspense } from "react";
import ServicesContent from "@/app/_components/_dashboard/ServicesPage/ServicesContent";
import ServicesLoading from "./loading";
import { getAdminServices } from "@/app/actions/servicesActions";
import { Service } from "@/app/types/service";

export default async function ServicesPage() {
  let services: Service[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 0 };

  try {
    const response = await getAdminServices({ limit: 100 });
    services = response.data;
    meta = response.meta;
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServicesLoading />}>
        <ServicesContent initialServices={services} meta={meta} />
      </Suspense>
    </div>
  );
}
