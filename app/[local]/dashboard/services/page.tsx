import { Suspense } from "react";
import ServicesContent from "@/app/_components/_dashboard/ServicesPage/ServicesContent";
import ServicesLoading from "./loading";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServicesLoading />}>
        <ServicesContent />
      </Suspense>
    </div>
  );
}
