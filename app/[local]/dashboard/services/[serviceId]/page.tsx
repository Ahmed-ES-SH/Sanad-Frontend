import ServiceDetailsContent from "./_components/_serviceDetails/ServiceDetailsContent";
import { getAdminServiceById } from "@/app/actions/servicesActions";
import { Service } from "@/app/types/service";
import { notFound } from "next/navigation";

interface ServiceEditPageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function ServiceDetailsPage({
  params,
}: ServiceEditPageProps) {
  const { serviceId } = await params;
  let service: Service | null = null;

  try {
    service = await getAdminServiceById(serviceId);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <ServiceDetailsContent service={service} />
    </div>
  );
}
